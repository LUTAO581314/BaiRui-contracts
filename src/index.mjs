import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  CONTRACTS_VERSION,
  CONTROL_ACTIONS,
  CONTROL_ACTION_ARGUMENTS,
  CONTROL_APPROVAL_ACTIONS,
  CONTROL_COMMAND_STATES,
  CONTROL_PROTOCOL_VERSION,
  MODULE_LAYERS,
  MODULE_STATUSES,
  RUNTIME_OPERATIONS,
  RUNTIME_STREAM_OPERATIONS
} from "./protocol.mjs";
import { SCHEMAS } from "./schemas.mjs";

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const validators = new Map(Object.entries(SCHEMAS).map(([name, schema]) => [name, ajv.compile(schema)]));

export class ContractValidationError extends TypeError {
  constructor(contract, errors) {
    super(`Invalid ${contract} contract`);
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
  return envelope;
}

export const validateRuntimeOperationEnvelope = (value) => assertContract("runtime-operation-envelope", value);
export const validateRuntimeStreamEnvelope = (value) => assertContract("runtime-stream-envelope", value);
export const validateRuntimeHeartbeat = (value) => assertContract("runtime-heartbeat", value);
export const validateResourceReport = (value) => assertContract("resource-report", value);
export const validateCredentialResolution = (value) => assertContract("credential-resolution", value);
export const validateMemoryProjection = (value) => assertContract("memory-projection", value);
export const validateChannelEnvelope = (value) => assertContract("channel-envelope", value);
export const validateIntegrationRequestEnvelope = (value) => assertContract("integration-request-envelope", value);
export const validateIntegrationResult = (value) => assertContract("integration-result", value);

export {
  CONTRACTS_VERSION,
  CONTROL_ACTIONS,
  CONTROL_ACTION_ARGUMENTS,
  CONTROL_APPROVAL_ACTIONS,
  CONTROL_COMMAND_STATES,
  CONTROL_PROTOCOL_VERSION,
  MODULE_LAYERS,
  MODULE_STATUSES,
  RUNTIME_OPERATIONS,
  RUNTIME_STREAM_OPERATIONS,
  SCHEMAS
};
