import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "json-schema-to-typescript";
import { OPENAPI_PATHS, SCHEMAS } from "../src/schemas.mjs";
import { CONTRACTS_VERSION, CONTROL_ACTION_ARGUMENTS } from "../src/protocol.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function controlErrorResponse(description) {
  return {
    description,
    content: { "application/json": { schema: { $ref: "#/components/schemas/ControlError" } } }
  };
}

function operation(pathname, method, schemaName, responseSchemaName = null, responseStatus = 200) {
  const success = { description: responseStatus === 202 ? "Accepted" : "Success" };
  if (responseSchemaName) success.content = { "application/json": { schema: { $ref: `#/components/schemas/${SCHEMAS[responseSchemaName].title}` } } };
  const controlOperation = pathname.startsWith("/api/internal/control-plane/");
  return {
    operationId: `${method}${pathname.replace(/[^A-Za-z0-9]+(.)/g, (_, value) => value.toUpperCase())}`,
    security: [{ machineSignature: [], machineTimestamp: [], machineNonce: [] }],
    requestBody: {
      required: true,
      content: { "application/json": { schema: { $ref: `#/components/schemas/${SCHEMAS[schemaName].title}` } } }
    },
    responses: {
      [responseStatus]: success,
      400: controlOperation ? controlErrorResponse("Contract validation failed") : { description: "Contract validation failed" },
      401: controlOperation ? controlErrorResponse("Machine authentication failed") : { description: "Machine authentication failed" },
      ...(controlOperation ? {
        403: controlErrorResponse("Machine identity or owner scope is forbidden"),
        409: controlErrorResponse("Idempotency, revision, sequence, lease, or receipt conflict"),
        422: controlErrorResponse("Control policy or state transition rejected")
      } : {})
    }
  };
}

function schemaForTypes(value) {
  if (Array.isArray(value)) return value.map(schemaForTypes);
  if (!value || typeof value !== "object") return value;
  const result = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "allOf" && Array.isArray(child) && child.every((entry) => entry && typeof entry === "object" && "if" in entry)) continue;
    result[key] = schemaForTypes(child);
  }
  return result;
}

const validatorTypes = Object.freeze({
  validateControlCommand: "ControlCommand",
  validateRuntimeRequestEnvelope: "RuntimeRequestEnvelope",
  validateControlCommandEnvelope: "CanonicalControlCommandEnvelope",
  validateDesiredState: "DesiredState",
  validateObservation: "Observation",
  validateControlObservation: "Observation",
  validateCommandEvent: "CommandEvent",
  validateControlCommandEvent: "CommandEvent",
  validateApproval: "Approval",
  validateControlApproval: "Approval",
  validateReleaseManifest: "ReleaseManifest",
  validateLeaseRequestEnvelope: "LeaseRequestEnvelope",
  validateLeaseEnvelope: "CanonicalLeaseEnvelope",
  validateReceiptEnvelope: "ReceiptEnvelope",
  validateControlError: "ControlError",
  validateAgentOwnerScope: "AgentOwnerScope",
  validateArtifactPointer: "ArtifactPointer",
  validateRuntimeOperationEnvelope: "RuntimeOperationEnvelope",
  validateRuntimeStreamEnvelope: "RuntimeStreamEnvelope",
  validateSceneSnapshot: "SceneSnapshot",
  validateScenePatch: "ScenePatch",
  validateSceneIntent: "SceneIntent",
  validateRuntimeHeartbeat: "RuntimeHeartbeat",
  validateResourceReport: "ResourceReport",
  validateHeartbeat: "Heartbeat",
  validateResourceSample: "ResourceSample",
  validateCredentialResolution: "CredentialResolution",
  validateCredentialResolutionRequest: "AgentCredentialResolutionRequest",
  validateMemoryProjection: "MemoryProjection",
  validateChannelEnvelope: "ChannelEnvelope",
  validateChannelIngress: "ChannelIngress",
  validateChannelIngressAck: "ChannelIngressAck",
  validateChannelDeliveryLeaseRequest: "ChannelDeliveryLeaseRequest",
  validateChannelDeliveryBatch: "ChannelDeliveryBatch",
  validateChannelDeliveryReceipt: "ChannelDeliveryReceipt",
  validateChannelHealthReport: "ChannelHealthReport",
  validateChannelCredentialResolution: "ChannelCredentialResolution",
  validateChannelCredentialResolutionRequest: "ChannelCredentialResolutionRequest",
  validateChannelBindingInventoryRequest: "ChannelBindingInventoryRequest",
  validateChannelBindingInventory: "ChannelBindingInventory",
  validateIntegrationRequestEnvelope: "IntegrationRequestEnvelope",
  validateIntegrationResult: "IntegrationResult"
});

async function typeDeclarations() {
  const declarations = [];
  for (const schema of Object.values(SCHEMAS)) {
    declarations.push((await compile(schemaForTypes(schema), schema.title, { bannerComment: "", format: false, unreachableDefinitions: true })).trim());
  }
  const contractMap = Object.entries(SCHEMAS).map(([name, schema]) => `  ${JSON.stringify(name)}: ${schema.title}`).join("\n");
  const validators = Object.entries(validatorTypes).map(([name, type]) => `export declare function ${name}(value: unknown): ${type}`).join("\n");
  const actionArgumentMap = Object.entries(CONTROL_ACTION_ARGUMENTS).map(([action, definition]) => {
    const required = definition.required.map((field) => `    ${JSON.stringify(field)}: ${field === "probe_ids" ? "string[]" : "string"}`);
    const optional = definition.optional.map((field) => `    ${JSON.stringify(field)}?: ${field === "probe_ids" ? "string[]" : "string"}`);
    const fields = [...required, ...optional];
    return `  ${JSON.stringify(action)}: ${fields.length ? `{\n${fields.join("\n")}\n  }` : "Record<string, never>"}`;
  }).join("\n");
  declarations.push(
    `export interface BaiRuiContractMap {\n${contractMap}\n}`,
    "export interface ContractIssue { instancePath: string; schemaPath: string; keyword: string; params: Record<string, unknown>; message?: string }",
    "export declare class ContractValidationError extends TypeError { readonly code: \"invalid_contract\"; readonly contract: string; readonly issues: ContractIssue[]; constructor(contract: string, errors?: ContractIssue[]) }",
    "export declare function assertContract<Name extends keyof BaiRuiContractMap>(contract: Name, value: unknown): BaiRuiContractMap[Name]",
    validators,
    "export declare const SCHEMAS: Readonly<{ [Name in keyof BaiRuiContractMap]: Readonly<Record<string, unknown>> }>",
    "export declare const CONTRACTS_VERSION: string",
    "export declare const CONTROL_PROTOCOL_VERSION: string",
    "export declare const CONTROL_SCHEMA_VERSION: string",
    "export declare const CHANNEL_PROTOCOL_VERSION: string",
    "export declare const RUNTIME_PROTOCOL_VERSION: string",
    "export declare const DATA_PROTOCOL_VERSION: string",
    "export type LegacyControlAction = ControlCommand[\"action\"]",
    "export type ControlAction = ControlCommandEnvelope[\"command\"][\"action\"]",
    `export interface ControlActionArgumentMap {\n${actionArgumentMap}\n}`,
    "export type ApprovalControlAction = Approval[\"action\"]",
    "export type CanonicalControlCommand<Action extends ControlAction = ControlAction> = Action extends ControlAction ? Omit<ControlCommandEnvelope[\"command\"], \"action\" | \"arguments\" | \"approval_id\"> & { action: Action; arguments: ControlActionArgumentMap[Action] } & (Action extends ApprovalControlAction ? { approval_id: string } : { approval_id?: never }) : never",
    "export type CanonicalControlCommandEnvelope = Omit<ControlCommandEnvelope, \"command\"> & { command: CanonicalControlCommand }",
    "export type LeasedControlCommand<Action extends ControlAction = ControlAction> = Action extends ControlAction ? Omit<LeaseEnvelope[\"commands\"][number], \"action\" | \"arguments\" | \"approval_id\"> & { action: Action; arguments: ControlActionArgumentMap[Action] } & (Action extends ApprovalControlAction ? { approval_id: string } : { approval_id?: never }) : never",
    "export type CanonicalLeaseEnvelope = Omit<LeaseEnvelope, \"commands\"> & { commands: LeasedControlCommand[] }",
    "export declare const CONTROL_ACTIONS: readonly ControlAction[]",
    "export declare const LEGACY_CONTROL_ACTIONS: readonly LegacyControlAction[]",
    "export declare const CONTROL_QUARANTINED_ACTIONS: readonly string[]",
    "export declare const CONTROL_ACTION_ARGUMENTS: Readonly<Record<ControlAction, { readonly required: readonly string[]; readonly optional: readonly string[] }>>",
    "export declare const LEGACY_CONTROL_ACTION_ARGUMENTS: Readonly<Record<LegacyControlAction, { readonly required: readonly string[]; readonly optional: readonly string[] }>>",
    "export declare const CONTROL_APPROVAL_ACTIONS: readonly ControlAction[]",
    "export declare const CONTROL_COMMAND_STATES: readonly string[]",
    "export declare const CONTROL_EVENT_STATES: readonly CommandEvent[\"state\"][]",
    "export declare const CONTROL_EVENT_TYPES: readonly CommandEvent[\"event_type\"][]",
    "export declare const CONTROL_RECEIPT_STATES: readonly ReceiptEnvelope[\"state\"][]",
    "export declare const CONTROL_APPROVAL_DECISIONS: readonly Approval[\"decision\"][]",
    "export declare const CONTROL_RISK_LEVELS: readonly Approval[\"risk_level\"][]",
    "export declare const CONTROL_RELEASE_STATUSES: readonly ReleaseManifest[\"status\"][]",
    "export declare const CONTROL_DESIRED_STATES: readonly DesiredState[\"status\"][]",
    "export declare const CONTROL_TARGET_STATES: readonly DesiredState[\"target_state\"][]",
    "export declare const CONTROL_SIGNATURE_ALGORITHMS: readonly ControlCommandEnvelope[\"signature\"][\"algorithm\"][]",
    "export declare const CONTROL_MUTATION_FIELDS: readonly string[]",
    "export declare const CONTROL_COMPATIBILITY_WINDOW: Readonly<Record<string, unknown>>",
    "export declare const CONTROL_ERROR_CODES: readonly ControlError[\"error_code\"][]",
    "export declare const IDENTITY_KINDS: readonly string[]",
    "export declare const ARTIFACT_KINDS: readonly ArtifactPointer[\"kind\"][]",
    "export declare const CHANNELS: readonly string[]",
    "export declare const CHANNEL_CONNECTION_STATUSES: readonly string[]",
    "export declare const CHANNEL_DELIVERY_STATUSES: readonly string[]",
    "export declare const RUNTIME_OPERATIONS: readonly RuntimeOperationEnvelope[\"operation\"][]",
    "export declare const RUNTIME_STREAM_OPERATIONS: readonly RuntimeStreamEnvelope[\"operation\"][]",
    "export declare const MODULE_LAYERS: readonly RuntimeHeartbeat[\"components\"][number][\"layer\"][]",
    "export declare const MODULE_STATUSES: readonly RuntimeHeartbeat[\"status\"][]",
    "export type RuntimeOperation = RuntimeOperationEnvelope[\"operation\"];",
    "export type RuntimeStreamOperation = RuntimeStreamEnvelope[\"operation\"];",
    "export type ModuleLayer = RuntimeHeartbeat[\"components\"][number][\"layer\"];",
    "export type ModuleStatus = RuntimeHeartbeat[\"status\"];"
  );
  return `${declarations.join("\n\n")}\n`;
}

export async function generatedArtifacts() {
  const artifacts = new Map();
  for (const [name, schema] of Object.entries(SCHEMAS)) artifacts.set(`schemas/${name}.schema.json`, json(schema));
  const paths = {};
  for (const [pathname, [method, schemaName, responseSchemaName, responseStatus]] of Object.entries(OPENAPI_PATHS)) {
    paths[pathname] = { [method]: operation(pathname, method, schemaName, responseSchemaName, responseStatus) };
  }
  paths["/api/internal/runtime/agents/{agentId}/authorizations/{authorizationId}/resolve"] = {
    post: {
      operationId: "resolveAgentAuthorization",
      security: [{ machineSignature: [], machineTimestamp: [], machineNonce: [] }],
      parameters: [
        { name: "agentId", in: "path", required: true, schema: { type: "string" } },
        { name: "authorizationId", in: "path", required: true, schema: { type: "string" } }
      ],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/AgentCredentialResolutionRequest" } } }
      },
      responses: {
        200: { description: "Agent-scoped credential", content: { "application/json": { schema: { $ref: "#/components/schemas/CredentialResolution" } } } },
        401: { description: "Runtime identity rejected" },
        404: { description: "Authorization unavailable" }
      }
    }
  };
  paths["/api/internal/channels/bindings/{bindingId}/resolve"] = {
    post: {
      operationId: "resolveChannelBindingCredential",
      security: [{ machineSignature: [], machineTimestamp: [], machineNonce: [] }],
      parameters: [{ name: "bindingId", in: "path", required: true, schema: { type: "string" } }],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/ChannelCredentialResolutionRequest" } } }
      },
      responses: {
        200: { description: "Channel Worker scoped credential", content: { "application/json": { schema: { $ref: "#/components/schemas/ChannelCredentialResolution" } } } },
        401: { description: "Channel Worker identity rejected" },
        404: { description: "Channel binding unavailable" }
      }
    }
  };
  const openapi = {
    openapi: "3.1.0",
    info: { title: "BaiRui Internal Contracts", version: CONTRACTS_VERSION },
    paths,
    components: {
      securitySchemes: {
        machineSignature: { type: "apiKey", in: "header", name: "x-bairui-signature", description: "HMAC signature over the method, path, timestamp, nonce, and body." },
        machineTimestamp: { type: "apiKey", in: "header", name: "x-bairui-timestamp", description: "Signed request timestamp used for freshness validation." },
        machineNonce: { type: "apiKey", in: "header", name: "x-bairui-nonce", description: "Signed one-time nonce used for replay prevention." }
      },
      schemas: Object.fromEntries(Object.values(SCHEMAS).map((schema) => [schema.title, schema]))
    }
  };
  artifacts.set("openapi/bairui-internal.openapi.json", json(openapi));
  artifacts.set("dist/index.d.ts", await typeDeclarations());
  return artifacts;
}

export async function writeGeneratedArtifacts() {
  for (const [relative, content] of await generatedArtifacts()) {
    const destination = path.join(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content, "utf8");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await writeGeneratedArtifacts();
