import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  ARTIFACT_KINDS,
  CHANNEL_CONNECTION_STATUSES,
  CHANNEL_DELIVERY_STATUSES,
  CHANNEL_PROTOCOL_VERSION,
  CHANNELS,
  CONTRACTS_VERSION,
  CONTROL_ACTIONS,
  CONTROL_ACTION_ARGUMENTS,
  CONTROL_APPROVAL_ACTIONS,
  CONTROL_COMMAND_STATES,
  CONTROL_PROTOCOL_VERSION,
  DATA_PROTOCOL_VERSION,
  IDENTITY_KINDS,
  MODULE_LAYERS,
  MODULE_STATUSES,
  RUNTIME_OPERATIONS,
  RUNTIME_PROTOCOL_VERSION,
  RUNTIME_STREAM_OPERATIONS
} from "./protocol.mjs";
import { SCHEMAS } from "./schemas.mjs";

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validators = new Map(Object.entries(SCHEMAS).map(([name, schema]) => [name, ajv.compile(schema)]));

function issueMessage(contract, issues) {
  const issue = issues?.[0];
  const label = contract.replaceAll("-", " ");
  if (!issue) return `Invalid ${contract} contract`;
  if (issue.keyword === "additionalProperties") {
    const field = issue.params?.additionalProperty ?? "field";
    return issue.instancePath === ""
      ? `Unknown ${label} field: ${field}`
      : `Argument ${field} is not allowed at ${issue.instancePath}`;
  }
  if (issue.keyword === "required") return `Missing required ${issue.params?.missingProperty ?? "field"} in ${contract}`;
  if (issue.keyword === "enum" || issue.keyword === "const") return `${issue.instancePath || contract} is not allowed`;
  return `Invalid ${contract} contract: ${issue.instancePath || "/"} ${issue.message ?? issue.keyword}`;
}

export class ContractValidationError extends TypeError {
  constructor(contract, errors) {
    super(issueMessage(contract, errors));
    this.name = "ContractValidationError";
    this.code = "invalid_contract";
    this.contract = contract;
    this.issues = (errors ?? []).slice(0, 50).map(({ instancePath, schemaPath, keyword, params, message }) => ({ instancePath, schemaPath, keyword, params, message }));
  }
}

export function assertContract(contract, value) {
  const validate = validators.get(contract);
  if (!validate) throw new TypeError(`Unknown BaiRui contract: ${contract}`);
  if (!validate(value)) throw new ContractValidationError(contract, validate.errors);
  return value;
}

export function validateControlCommand(value) {
  const command = assertContract("control-command", value);
  if (Date.parse(command.expires_at) <= Date.parse(command.created_at)) {
    throw new ContractValidationError("control-command", [{ instancePath: "/expires_at", schemaPath: "#/semantic", keyword: "after", params: {}, message: "must be after created_at" }]);
  }
  return command;
}

export function validateRuntimeRequestEnvelope(value) {
  const envelope = assertContract("runtime-request-envelope", value);
  if (envelope.request.runtime_config_ref !== envelope.config.config_id) {
    throw new ContractValidationError("runtime-request-envelope", [{ instancePath: "/request/runtime_config_ref", schemaPath: "#/semantic", keyword: "const", params: {}, message: "must match config.config_id" }]);
  }
  assertOwnerActor("runtime-request-envelope", envelope.request);
  assertConversationBinding("runtime-request-envelope", envelope.request.owner_scope, envelope.request.channel_context?.conversation_id);
  return envelope;
}

const SESSION_SCOPED_OPERATIONS = new Set([
  "sessions.get", "sessions.update", "sessions.delete", "sessions.messages", "sessions.fork", "sessions.chat",
  "sessions.chat.stream"
]);

function semanticIssue(contract, instancePath, message) {
  throw new ContractValidationError(contract, [{ instancePath, schemaPath: "#/semantic", keyword: "ownership", params: {}, message }]);
}

function assertOwnerActor(contract, value) {
  if (value.actor.user_id !== value.owner_scope.user_id) semanticIssue(contract, "/actor/user_id", "must match owner_scope.user_id");
}

function assertConversationBinding(contract, scope, conversationId) {
  if (conversationId && scope.conversation_id !== conversationId) semanticIssue(contract, "/owner_scope/conversation_id", "must match the addressed conversation");
}

function validateRuntimeOperation(contract, value) {
  const envelope = assertContract(contract, value);
  assertOwnerActor(contract, envelope);
  if (SESSION_SCOPED_OPERATIONS.has(envelope.operation)) {
    if (typeof envelope.input.session_id !== "string") semanticIssue(contract, "/input/session_id", "is required for this operation");
    assertConversationBinding(contract, envelope.owner_scope, envelope.input.session_id);
  }
  return envelope;
}

function sameOwner(left, right) {
  return ["organization_id", "user_id", "agent_id"].every((field) => left[field] === right[field]);
}

export const validateAgentOwnerScope = (value) => assertContract("agent-owner-scope", value);
export const validateArtifactPointer = (value) => assertContract("artifact-pointer", value);
export const validateRuntimeOperationEnvelope = (value) => validateRuntimeOperation("runtime-operation-envelope", value);
export const validateRuntimeStreamEnvelope = (value) => validateRuntimeOperation("runtime-stream-envelope", value);
export const validateRuntimeHeartbeat = (value) => assertContract("runtime-heartbeat", value);
export const validateResourceReport = (value) => assertContract("resource-report", value);
export const validateCredentialResolution = (value) => assertContract("credential-resolution", value);
export const validateMemoryProjection = (value) => assertContract("memory-projection", value);
export const validateChannelEnvelope = (value) => assertContract("channel-envelope", value);
export const validateChannelIngress = (value) => assertContract("channel-ingress", value);
export const validateChannelIngressAck = (value) => assertContract("channel-ingress-ack", value);
export const validateChannelDeliveryLeaseRequest = (value) => assertContract("channel-delivery-lease-request", value);
export const validateChannelDeliveryBatch = (value) => assertContract("channel-delivery-batch", value);
export const validateChannelDeliveryReceipt = (value) => assertContract("channel-delivery-receipt", value);
export function validateChannelHealthReport(value) {
  const report = assertContract("channel-health-report", value);
  if (report.status === "connected" && !(report.capabilities.includes("receive") && report.capabilities.includes("send"))) {
    throw new ContractValidationError("channel-health-report", [{
      instancePath: "/capabilities",
      schemaPath: "#/semantic",
      keyword: "contains",
      params: {},
      message: "must include receive and send when status is connected"
    }]);
  }
  return report;
}
export const validateChannelCredentialResolution = (value) => assertContract("channel-credential-resolution", value);
export const validateChannelBindingInventoryRequest = (value) => assertContract("channel-binding-inventory-request", value);
export const validateChannelBindingInventory = (value) => assertContract("channel-binding-inventory", value);
export const validateIntegrationRequestEnvelope = (value) => assertContract("integration-request-envelope", value);
export function validateIntegrationResult(value) {
  const result = assertContract("integration-result", value);
  for (const [index, artifact] of (result.artifacts ?? []).entries()) {
    if (!sameOwner(result.owner_scope, artifact.owner_scope)) semanticIssue("integration-result", `/artifacts/${index}/owner_scope`, "must match result.owner_scope");
  }
  return result;
}

export {
  ARTIFACT_KINDS,
  CHANNEL_CONNECTION_STATUSES,
  CHANNEL_DELIVERY_STATUSES,
  CHANNEL_PROTOCOL_VERSION,
  CHANNELS,
  CONTRACTS_VERSION,
  CONTROL_ACTIONS,
  CONTROL_ACTION_ARGUMENTS,
  CONTROL_APPROVAL_ACTIONS,
  CONTROL_COMMAND_STATES,
  CONTROL_PROTOCOL_VERSION,
  DATA_PROTOCOL_VERSION,
  IDENTITY_KINDS,
  MODULE_LAYERS,
  MODULE_STATUSES,
  RUNTIME_OPERATIONS,
  RUNTIME_PROTOCOL_VERSION,
  RUNTIME_STREAM_OPERATIONS,
  SCHEMAS
};
