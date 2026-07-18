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
  CONTROL_APPROVAL_DECISIONS,
  CONTROL_COMMAND_STATES,
  CONTROL_COMPATIBILITY_WINDOW,
  CONTROL_DESIRED_STATES,
  CONTROL_ERROR_CODES,
  CONTROL_EVENT_STATES,
  CONTROL_EVENT_TYPES,
  CONTROL_MUTATION_FIELDS,
  CONTROL_PROTOCOL_VERSION,
  CONTROL_QUARANTINED_ACTIONS,
  CONTROL_RECEIPT_STATES,
  CONTROL_RELEASE_STATUSES,
  CONTROL_RISK_LEVELS,
  CONTROL_SCHEMA_VERSION,
  CONTROL_SIGNATURE_ALGORITHMS,
  CONTROL_TARGET_STATES,
  DATA_PROTOCOL_VERSION,
  IDENTITY_KINDS,
  LEGACY_CONTROL_ACTIONS,
  LEGACY_CONTROL_ACTION_ARGUMENTS,
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

function validateCommandTimes(contract, command, prefix = "") {
  if (Date.parse(command.expires_at) <= Date.parse(command.created_at)) {
    throw new ContractValidationError(contract, [{ instancePath: `${prefix}/expires_at`, schemaPath: "#/semantic", keyword: "after", params: {}, message: "must be after created_at" }]);
  }
  if (command.not_before) {
    assertAfter(contract, command.created_at, command.not_before, `${prefix}/not_before`);
    if (Date.parse(command.expires_at) <= Date.parse(command.not_before)) {
      throw new ContractValidationError(contract, [{ instancePath: `${prefix}/expires_at`, schemaPath: "#/semantic", keyword: "after", params: {}, message: "must be after not_before" }]);
    }
  }
}

export function validateControlCommand(value) {
  const command = assertContract("control-command", value);
  validateCommandTimes("control-command", command);
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

function assertAfter(contract, before, after, instancePath) {
  if (Date.parse(after) < Date.parse(before)) {
    throw new ContractValidationError(contract, [{
      instancePath,
      schemaPath: "#/semantic",
      keyword: "after",
      params: {},
      message: "must not be before the preceding event time"
    }]);
  }
}

function validateMutation(contract, value) {
  const mutation = assertContract(contract, value);
  assertAfter(contract, mutation.created_at, mutation.signature.signed_at, "/signature/signed_at");
  if (mutation.updated_at) assertAfter(contract, mutation.created_at, mutation.updated_at, "/updated_at");
  return mutation;
}

export function validateControlCommandEnvelope(value) {
  const envelope = validateMutation("control-command-envelope", value);
  validateCommandTimes("control-command-envelope", envelope.command, "/command");
  if (envelope.idempotency_key !== envelope.command.idempotency_key) {
    semanticIssue("control-command-envelope", "/command/idempotency_key", "must match idempotency_key");
  }
  if (envelope.command.arguments.agent_id && envelope.command.arguments.agent_id !== envelope.agent_id) {
    semanticIssue("control-command-envelope", "/command/arguments/agent_id", "must match agent_id");
  }
  return envelope;
}

export function validateDesiredState(value) {
  const state = validateMutation("desired-state", value);
  if (state.expires_at) assertAfter("desired-state", state.created_at, state.expires_at, "/expires_at");
  if (state.valid_from) assertAfter("desired-state", state.created_at, state.valid_from, "/valid_from");
  return state;
}

export function validateObservation(value) {
  const observation = validateMutation("observation", value);
  assertAfter("observation", observation.created_at, observation.observed_at, "/observed_at");
  if (observation.received_at) assertAfter("observation", observation.observed_at, observation.received_at, "/received_at");
  return observation;
}
export const validateControlObservation = validateObservation;

export function validateCommandEvent(value) {
  const event = validateMutation("command-event", value);
  assertAfter("command-event", event.created_at, event.occurred_at, "/occurred_at");
  assertAfter("command-event", event.occurred_at, event.received_at, "/received_at");
  if (event.completed_at) assertAfter("command-event", event.occurred_at, event.completed_at, "/completed_at");
  return event;
}
export const validateControlCommandEvent = validateCommandEvent;

export function validateApproval(value) {
  const approval = validateMutation("approval", value);
  if (Date.parse(approval.expires_at) <= Date.parse(approval.created_at)) {
    throw new ContractValidationError("approval", [{ instancePath: "/expires_at", schemaPath: "#/semantic", keyword: "after", params: {}, message: "must be after created_at" }]);
  }
  if (approval.decided_at) assertAfter("approval", approval.created_at, approval.decided_at, "/decided_at");
  if (["approved", "rejected"].includes(approval.decision) && Date.parse(approval.decided_at) > Date.parse(approval.expires_at)) {
    throw new ContractValidationError("approval", [{ instancePath: "/decided_at", schemaPath: "#/semantic", keyword: "before", params: {}, message: "must not be after expires_at" }]);
  }
  if (approval.decision === "expired" && Date.parse(approval.decided_at) < Date.parse(approval.expires_at)) {
    throw new ContractValidationError("approval", [{ instancePath: "/decided_at", schemaPath: "#/semantic", keyword: "after", params: {}, message: "must not be before expires_at for an expired approval" }]);
  }
  if (["approved", "rejected"].includes(approval.decision) && approval.requested_by === approval.decided_by) {
    semanticIssue("approval", "/decided_by", "must differ from requested_by");
  }
  for (const field of ["organization_id", "agent_id", "server_id"]) {
    if (approval.scope[field] !== approval[field]) semanticIssue("approval", `/scope/${field}`, `must match ${field}`);
  }
  if (approval.scope.user_id && approval.scope.user_id !== approval.user_id) semanticIssue("approval", "/scope/user_id", "must match user_id");
  return approval;
}
export const validateControlApproval = validateApproval;

function semverParts(value) {
  const [withoutBuild] = value.split("+");
  const separator = withoutBuild.indexOf("-");
  const core = separator === -1 ? withoutBuild : withoutBuild.slice(0, separator);
  const prerelease = separator === -1 ? null : withoutBuild.slice(separator + 1).split(".");
  return { core: core.split(".").map(Number), prerelease };
}

function compareSemver(left, right) {
  const a = semverParts(left);
  const b = semverParts(right);
  for (let index = 0; index < 3; index += 1) {
    if (a.core[index] !== b.core[index]) return a.core[index] < b.core[index] ? -1 : 1;
  }
  if (a.prerelease === null || b.prerelease === null) return a.prerelease === b.prerelease ? 0 : a.prerelease === null ? 1 : -1;
  const length = Math.max(a.prerelease.length, b.prerelease.length);
  for (let index = 0; index < length; index += 1) {
    const leftPart = a.prerelease[index];
    const rightPart = b.prerelease[index];
    if (leftPart === undefined || rightPart === undefined) return leftPart === rightPart ? 0 : leftPart === undefined ? -1 : 1;
    if (leftPart === rightPart) continue;
    const leftNumber = /^[0-9]+$/.test(leftPart);
    const rightNumber = /^[0-9]+$/.test(rightPart);
    if (leftNumber && rightNumber) return Number(leftPart) < Number(rightPart) ? -1 : 1;
    if (leftNumber !== rightNumber) return leftNumber ? -1 : 1;
    return leftPart < rightPart ? -1 : 1;
  }
  return 0;
}

export function validateReleaseManifest(value) {
  const manifest = validateMutation("release-manifest", value);
  const prerelease = semverParts(manifest.version).prerelease !== null;
  if ((manifest.channel === "prerelease") !== prerelease) {
    throw new ContractValidationError("release-manifest", [{ instancePath: "/channel", schemaPath: "#/semantic", keyword: "channel", params: {}, message: "must match the version prerelease marker" }]);
  }
  if (compareSemver(manifest.compatibility.contracts_min, manifest.contracts_version) > 0) {
    semanticIssue("release-manifest", "/compatibility/contracts_min", "must not exceed contracts_version");
  }
  if (manifest.compatibility.contracts_max && compareSemver(manifest.compatibility.contracts_max, manifest.contracts_version) < 0) {
    semanticIssue("release-manifest", "/compatibility/contracts_max", "must not be below contracts_version");
  }
  const components = manifest.artifacts.map((artifact) => artifact.component);
  if (new Set(components).size !== components.length) semanticIssue("release-manifest", "/artifacts", "must contain at most one artifact per component");
  return manifest;
}

export function validateLeaseRequestEnvelope(value) {
  const request = validateMutation("lease-request-envelope", value);
  assertAfter("lease-request-envelope", request.created_at, request.requested_at, "/requested_at");
  return request;
}

export function validateLeaseEnvelope(value) {
  const lease = validateMutation("lease-envelope", value);
  assertAfter("lease-envelope", lease.created_at, lease.issued_at, "/issued_at");
  if (Date.parse(lease.lease_expires_at) <= Date.parse(lease.issued_at)) {
    throw new ContractValidationError("lease-envelope", [{ instancePath: "/lease_expires_at", schemaPath: "#/semantic", keyword: "after", params: {}, message: "must be after issued_at" }]);
  }
  for (const [index, command] of lease.commands.entries()) {
    validateCommandTimes("lease-envelope", command, `/commands/${index}`);
    if (command.lease_id !== lease.lease_id) semanticIssue("lease-envelope", `/commands/${index}/lease_id`, "must match lease_id");
    if (Date.parse(command.lease_expires_at) > Date.parse(lease.lease_expires_at)) semanticIssue("lease-envelope", `/commands/${index}/lease_expires_at`, "must not outlive lease_expires_at");
    if (Date.parse(command.expires_at) > Date.parse(command.lease_expires_at)) semanticIssue("lease-envelope", `/commands/${index}/expires_at`, "must not outlive command.lease_expires_at");
    for (const field of ["organization_id", "agent_id", "server_id"]) {
      if (command.placement[field] !== lease[field]) semanticIssue("lease-envelope", `/commands/${index}/placement/${field}`, `must match ${field}`);
    }
    if (command.placement.user_id && command.placement.user_id !== lease.user_id) semanticIssue("lease-envelope", `/commands/${index}/placement/user_id`, "must match user_id");
    if (command.arguments.agent_id && command.arguments.agent_id !== lease.agent_id) semanticIssue("lease-envelope", `/commands/${index}/arguments/agent_id`, "must match agent_id");
  }
  return lease;
}

export function validateReceiptEnvelope(value) {
  const receipt = validateMutation("receipt-envelope", value);
  assertAfter("receipt-envelope", receipt.created_at, receipt.observed_at, "/observed_at");
  if (receipt.completed_at) assertAfter("receipt-envelope", receipt.observed_at, receipt.completed_at, "/completed_at");
  return receipt;
}

export const validateControlError = (value) => assertContract("control-error", value);

export const validateAgentOwnerScope = (value) => assertContract("agent-owner-scope", value);
export const validateArtifactPointer = (value) => assertContract("artifact-pointer", value);
export const validateRuntimeOperationEnvelope = (value) => validateRuntimeOperation("runtime-operation-envelope", value);
export const validateRuntimeStreamEnvelope = (value) => validateRuntimeOperation("runtime-stream-envelope", value);
export const validateSceneSnapshot = (value) => assertContract("scene-snapshot", value);
export const validateScenePatch = (value) => assertContract("scene-patch", value);
export const validateSceneIntent = (value) => assertContract("scene-intent", value);
export const validateRuntimeHeartbeat = (value) => assertContract("runtime-heartbeat", value);
export const validateResourceReport = (value) => assertContract("resource-report", value);
export const validateHeartbeat = (value) => assertContract("heartbeat", value);
export const validateResourceSample = (value) => assertContract("resource-sample", value);
export const validateCredentialResolution = (value) => assertContract("credential-resolution", value);
export const validateCredentialResolutionRequest = (value) => assertContract("credential-resolution-request", value);
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
export const validateChannelCredentialResolutionRequest = (value) => assertContract("channel-credential-resolution-request", value);
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
  CONTROL_APPROVAL_DECISIONS,
  CONTROL_COMMAND_STATES,
  CONTROL_COMPATIBILITY_WINDOW,
  CONTROL_DESIRED_STATES,
  CONTROL_ERROR_CODES,
  CONTROL_EVENT_STATES,
  CONTROL_EVENT_TYPES,
  CONTROL_MUTATION_FIELDS,
  CONTROL_PROTOCOL_VERSION,
  CONTROL_QUARANTINED_ACTIONS,
  CONTROL_RECEIPT_STATES,
  CONTROL_RELEASE_STATUSES,
  CONTROL_RISK_LEVELS,
  CONTROL_SCHEMA_VERSION,
  CONTROL_SIGNATURE_ALGORITHMS,
  CONTROL_TARGET_STATES,
  DATA_PROTOCOL_VERSION,
  IDENTITY_KINDS,
  LEGACY_CONTROL_ACTIONS,
  LEGACY_CONTROL_ACTION_ARGUMENTS,
  MODULE_LAYERS,
  MODULE_STATUSES,
  RUNTIME_OPERATIONS,
  RUNTIME_PROTOCOL_VERSION,
  RUNTIME_STREAM_OPERATIONS,
  SCHEMAS
};
