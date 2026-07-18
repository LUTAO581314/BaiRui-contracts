import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  CONTROL_ACTIONS,
  CONTROL_COMPATIBILITY_WINDOW,
  CONTROL_DESIRED_STATES,
  CONTROL_ERROR_CODES,
  CONTROL_EVENT_TYPES,
  CONTROL_MUTATION_FIELDS,
  CONTROL_QUARANTINED_ACTIONS,
  CONTROL_RECEIPT_STATES,
  CONTROL_TARGET_STATES,
  LEGACY_CONTROL_ACTIONS,
  ContractValidationError,
  validateAgentOwnerScope,
  validateArtifactPointer,
  validateChannelBindingInventory,
  validateChannelBindingInventoryRequest,
  validateChannelCredentialResolution,
  validateChannelCredentialResolutionRequest,
  validateChannelDeliveryBatch,
  validateChannelDeliveryLeaseRequest,
  validateChannelDeliveryReceipt,
  validateChannelHealthReport,
  validateChannelIngress,
  validateChannelIngressAck,
  validateApproval,
  validateControlCommand,
  validateControlCommandEnvelope,
  validateCommandEvent,
  validateControlError,
  validateDesiredState,
  validateHeartbeat,
  validateLeaseEnvelope,
  validateLeaseRequestEnvelope,
  validateObservation,
  validateCredentialResolution,
  validateCredentialResolutionRequest,
  validateReceiptEnvelope,
  validateReleaseManifest,
  validateIntegrationRequestEnvelope,
  validateIntegrationResult,
  validateMemoryProjection,
  validateResourceReport,
  validateResourceSample,
  validateRuntimeHeartbeat,
  validateRuntimeOperationEnvelope,
  validateRuntimeRequestEnvelope
} from "../src/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const now = new Date().toISOString();
const later = new Date(Date.now() + 60_000).toISOString();
const agentScope = { organization_id: "org_1", user_id: "user_1", agent_id: "agent_1" };
const runtimeScope = { ...agentScope, runtime_id: "runtime_1", workspace_id: "workspace_1" };

function fixture(relative) {
  return JSON.parse(fs.readFileSync(path.join(root, "tests", "fixtures", "control-plane", relative), "utf8"));
}

function capturedContractError(callback) {
  try {
    callback();
  } catch (error) {
    assert.ok(error instanceof ContractValidationError);
    return error;
  }
  assert.fail("invalid contract was accepted");
}

function command(action, args, extra = {}) {
  return {
    schema_version: "1.0",
    command_id: "command_1",
    idempotency_key: `deployment_1/${action}/1`,
    deployment_id: "deployment_1",
    action,
    target: { module_id: "bairui.supervisor", instance_id: "agent_1" },
    arguments: args,
    expected_observation_version: 0,
    created_at: now,
    expires_at: later,
    ...extra
  };
}

test("canonical control actions include backup and evidence identifiers", () => {
  assert.ok(CONTROL_ACTIONS.includes("backup.restore"));
  assert.ok(CONTROL_ACTIONS.includes("backup.expire"));
  assert.equal(validateControlCommand(command("backup.restore", { backup_id: "backup_1", restore_id: "restore_1" }, { approval_id: "approval_1" })).action, "backup.restore");
  assert.equal(validateControlCommand(command("upstream.check", { upstream_id: "hermes", candidate_id: "candidate_1", test_run_id: "test_1" })).action, "upstream.check");
  assert.equal(CONTROL_ACTIONS.includes("config.apply-user"), false);
  assert.equal(CONTROL_QUARANTINED_ACTIONS.includes("config.apply-user"), true);
  assert.equal(LEGACY_CONTROL_ACTIONS.includes("config.apply-user"), true);
  assert.equal(validateControlCommand(command("config.apply-user", { config_revision_id: "config_1" })).action, "config.apply-user");
});

test("control validation fails closed for missing approvals and unknown arguments", () => {
  assert.throws(() => validateControlCommand(command("backup.restore", { backup_id: "backup_1", restore_id: "restore_1" })), ContractValidationError);
  assert.throws(() => validateControlCommand(command("snapshot.collect", { prompt: "hidden" })), ContractValidationError);
});

test("runtime requests bind the request to the supplied config", () => {
  const request = {
    request_id: "request_1",
    request_type: "message",
    owner_scope: runtimeScope,
    actor: { user_id: "user_1", roles: ["user"] },
    channel_context: { channel: "web" },
    input: { content: "hello" },
    runtime_config_ref: "config_1",
    trace: { correlation_id: "request_1" },
    created_at: now
  };
  const config = { config_id: "config_1", model_policy: {}, tool_policy: {}, memory_policy: {}, approval_policy: {}, storage_policy: {}, integration_policy: {} };
  const envelope = { schema_version: "2.0", request, config };
  assert.equal(validateRuntimeRequestEnvelope(envelope).request.request_id, "request_1");
  assert.throws(() => validateRuntimeRequestEnvelope({ ...envelope, config: { ...config, config_id: "config_2" } }), ContractValidationError);
  assert.throws(() => validateRuntimeRequestEnvelope({ ...envelope, request: { ...request, actor: { user_id: "user_2" } } }), ContractValidationError);
  assert.throws(() => validateRuntimeRequestEnvelope({ ...envelope, schema_version: "1.0" }), ContractValidationError);
  assert.throws(() => validateRuntimeRequestEnvelope({ ...envelope, request: { ...request, owner_scope: undefined, tenant: { organization_id: "org_1", agent_id: "agent_1" } } }), ContractValidationError);
});

test("owner scope freezes the identity hierarchy and Runtime conversation binding", () => {
  assert.equal(validateAgentOwnerScope(agentScope).agent_id, "agent_1");
  assert.throws(() => validateAgentOwnerScope({ ...agentScope, conversation_id: "conversation_1" }), ContractValidationError);
  const operation = {
    schema_version: "2.0",
    operation: "sessions.chat",
    owner_scope: { ...runtimeScope, conversation_id: "session_1" },
    actor: { user_id: "user_1", roles: ["user"] },
    channel_context: { channel: "web" },
    input: { session_id: "session_1", body: { message: "hello" } },
    trace: { correlation_id: "request_1" },
    created_at: now
  };
  assert.equal(validateRuntimeOperationEnvelope(operation).owner_scope.conversation_id, "session_1");
  assert.throws(() => validateRuntimeOperationEnvelope({ ...operation, owner_scope: { ...runtimeScope, conversation_id: "session_2" } }), ContractValidationError);
});

test("artifact pointers and integration results cannot cross Agent owners", () => {
  const artifact = {
    schema_version: "1.0",
    artifact_id: "artifact_1",
    owner_scope: agentScope,
    kind: "document",
    media_type: "text/markdown",
    size_bytes: 12,
    sha256: "a".repeat(64),
    created_at: now
  };
  assert.equal(validateArtifactPointer(artifact).artifact_id, "artifact_1");
  const result = { schema_version: "2.0", request_id: "request_1", owner_scope: runtimeScope, integration_id: "firecrawl", status: "completed", artifacts: [artifact], trace: { correlation_id: "request_1" } };
  assert.equal(validateIntegrationResult(result).artifacts.length, 1);
  assert.throws(() => validateIntegrationResult({ ...result, artifacts: [{ ...artifact, owner_scope: { ...agentScope, agent_id: "agent_2" } }] }), ContractValidationError);
});

test("integration and memory data planes require the complete Runtime owner scope", () => {
  const integration = {
    schema_version: "2.0",
    request: {
      request_id: "request_1",
      owner_scope: runtimeScope,
      integration_id: "firecrawl",
      capability: "scrape",
      input: { url: "https://example.test" },
      timeout_ms: 1000,
      trace: { correlation_id: "request_1" }
    }
  };
  assert.equal(validateIntegrationRequestEnvelope(integration).request.integration_id, "firecrawl");
  assert.throws(() => validateIntegrationRequestEnvelope({ ...integration, request: { ...integration.request, owner_scope: agentScope } }), ContractValidationError);

  const target = { entries: [], char_count: 0, limit: 100 };
  const projection = { schema_version: "2.0", projection_id: "projection_1", owner_scope: runtimeScope, memory: target, user: target, included_note_ids: [], excluded_note_ids: [] };
  assert.equal(validateMemoryProjection(projection).owner_scope.workspace_id, "workspace_1");
  assert.throws(() => validateMemoryProjection({ ...projection, owner_scope: agentScope }), ContractValidationError);
});

test("telemetry accepts aggregates and rejects user content", () => {
  const component = { layer: "core-runtime", moduleId: "hermes", status: "healthy", version: "1.0.0", capabilities: ["runs"], metrics: { active_agents: 1 }, observedAt: now };
  const heartbeat = { organizationId: "org_1", userId: "user_1", agentId: "agent_1", runtimeId: "runtime_1", sequence: 1, status: "healthy", queueDepth: 0, activeRuns: 1, failedRuns: 0, observedAt: now, components: [component, { ...component, moduleId: "bairui.runtime-boundary" }], events: [] };
  assert.equal(validateRuntimeHeartbeat(heartbeat).activeRuns, 1);
  assert.throws(() => validateRuntimeHeartbeat({ ...heartbeat, prompt: "must-not-pass" }), ContractValidationError);
});

test("resource telemetry accepts an empty fleet heartbeat", () => {
  const report = { serverId: "server_1", samples: [] };
  assert.equal(validateResourceReport(report).samples.length, 0);
  assert.throws(() => validateResourceReport({ ...report, status: "healthy" }), ContractValidationError);
});

test("C00-02 fixtures validate new mutations and legacy aliases", () => {
  assert.equal(validateDesiredState(fixture("valid/desired-state.json")).status, "active");
  assert.equal(validateObservation(fixture("valid/observation.json")).observation_version, 1);
  assert.equal(validateCommandEvent(fixture("valid/command-event.json")).state, "accepted");
  assert.equal(validateApproval(fixture("valid/approval.json")).decision, "approved");
  assert.equal(validateReleaseManifest(fixture("valid/release-manifest.json")).immutable, true);
  assert.equal(validateLeaseRequestEnvelope(fixture("valid/lease-request-envelope.json")).limit, 5);
  assert.equal(validateLeaseEnvelope(fixture("valid/lease-envelope.json")).commands.length, 1);
  assert.equal(validateReceiptEnvelope(fixture("valid/receipt-envelope.json")).state, "completion_candidate");
  assert.equal(validateControlError(fixture("valid/control-error.json")).error_code, "approval_not_valid");
  assert.equal(validateControlCommand(fixture("valid/legacy-control-command.json")).action, "deployment.start");
  assert.equal(validateHeartbeat(fixture("valid/legacy-heartbeat.json")).status, "healthy");
  assert.equal(validateResourceReport(fixture("valid/legacy-resource-report.json")).samples.length, 0);
  assert.equal(validateResourceSample(fixture("valid/resource-sample.json")).agentId, "agent_1");
});

test("Heartbeat and ResourceSample remain exact aliases of legacy telemetry shapes", () => {
  const readSchema = (name) => JSON.parse(fs.readFileSync(path.join(root, "schemas", `${name}.schema.json`), "utf8"));
  const heartbeat = readSchema("heartbeat");
  const runtimeHeartbeat = readSchema("runtime-heartbeat");
  const comparable = (schema) => {
    const result = structuredClone(schema);
    delete result.$schema;
    delete result.$id;
    delete result.title;
    return result;
  };
  assert.deepEqual(comparable(heartbeat), comparable(runtimeHeartbeat));

  const resourceSample = readSchema("resource-sample");
  const resourceReport = readSchema("resource-report");
  assert.deepEqual(comparable(resourceSample), resourceReport.properties.samples.items);
});

test("C00-02 publishes mutation fields, compatibility window, and stable error codes", () => {
  for (const field of ["organization_id", "user_id", "agent_id", "server_id", "request_id", "correlation_id", "idempotency_key", "created_at", "revision", "sequence"]) {
    assert.ok(CONTROL_MUTATION_FIELDS.includes(field), field);
  }
  assert.equal(CONTROL_COMPATIBILITY_WINDOW.legacy_contracts_range, "2.2.x");
  assert.equal(CONTROL_COMPATIBILITY_WINDOW.implicit_conversion, false);
  assert.equal(CONTROL_COMPATIBILITY_WINDOW.canonical_receipt_completion_state, "completion_candidate");
  assert.deepEqual(CONTROL_DESIRED_STATES, ["proposed", "accepted", "active", "superseded", "rejected"]);
  assert.ok(CONTROL_TARGET_STATES.includes("running"));
  assert.ok(CONTROL_EVENT_TYPES.includes("command.verification.started"));
  assert.ok(CONTROL_EVENT_TYPES.includes("command.verified"));
  assert.ok(CONTROL_RECEIPT_STATES.includes("completion_candidate"));
  assert.equal(CONTROL_RECEIPT_STATES.includes("succeeded"), false);
  assert.ok(CONTROL_ERROR_CODES.includes("raw_secret_not_allowed"));
  assert.ok(CONTROL_ERROR_CODES.includes("receipt_conflict"));
});

test("every canonical control surface rejects each missing mutation field", () => {
  const desired = fixture("valid/desired-state.json");
  const commandValue = fixture("valid/legacy-control-command.json");
  const commandEnvelope = Object.fromEntries(["schema_version", ...CONTROL_MUTATION_FIELDS].map((field) => [field, desired[field]]));
  commandEnvelope.idempotency_key = commandValue.idempotency_key;
  commandEnvelope.command = commandValue;
  const surfaces = [
    [validateDesiredState, desired],
    [validateObservation, fixture("valid/observation.json")],
    [validateControlCommandEnvelope, commandEnvelope],
    [validateCommandEvent, fixture("valid/command-event.json")],
    [validateLeaseRequestEnvelope, fixture("valid/lease-request-envelope.json")],
    [validateLeaseEnvelope, fixture("valid/lease-envelope.json")],
    [validateReceiptEnvelope, fixture("valid/receipt-envelope.json")]
  ];
  for (const [validate, value] of surfaces) {
    for (const field of ["schema_version", ...CONTROL_MUTATION_FIELDS]) {
      const invalid = structuredClone(value);
      delete invalid[field];
      assert.throws(() => validate(invalid), ContractValidationError, `${validate.name} accepted a missing ${field}`);
    }
  }
});

test("C00-02 rejects missing mutation metadata, business actions, raw fields, and broken leases", () => {
  const missing = capturedContractError(() => validateDesiredState(fixture("invalid/missing-mutation-fields.json")));
  assert.ok(missing.issues.some((issue) => issue.keyword === "required" && issue.params.missingProperty === "server_id"));
  assert.ok(missing.issues.some((issue) => issue.keyword === "required" && issue.params.missingProperty === "signature"));

  const action = capturedContractError(() => validateCommandEvent(fixture("invalid/forbidden-action.json")));
  assert.ok(action.issues.some((issue) => issue.instancePath === "/action" && issue.keyword === "enum"));

  const rawSecret = capturedContractError(() => validateReleaseManifest(fixture("invalid/raw-secret-field.json")));
  assert.ok(rawSecret.issues.some((issue) => issue.keyword === "additionalProperties" && issue.params.additionalProperty === "api_key"));

  const lease = capturedContractError(() => validateLeaseEnvelope(fixture("invalid/lease-binding.json")));
  assert.ok(lease.issues.some((issue) => issue.instancePath === "/commands/0/lease_id"));
});

test("control command envelopes bind canonical commands and quarantine unsafe legacy actions", () => {
  const desired = fixture("valid/desired-state.json");
  const commandValue = fixture("valid/legacy-control-command.json");
  const envelope = Object.fromEntries(["schema_version", ...CONTROL_MUTATION_FIELDS].map((field) => [field, desired[field]]));
  envelope.idempotency_key = commandValue.idempotency_key;
  envelope.command = commandValue;
  assert.equal(validateControlCommandEnvelope(envelope).command.action, "deployment.start");

  const quarantined = command("config.apply-user", { config_revision_id: "config_1" });
  const quarantinedEnvelope = { ...envelope, idempotency_key: quarantined.idempotency_key, command: quarantined };
  const error = capturedContractError(() => validateControlCommandEnvelope(quarantinedEnvelope));
  assert.ok(error.issues.some((issue) => issue.instancePath === "/command/action" && issue.keyword === "enum"));

  const mismatch = { ...envelope, idempotency_key: "different_idempotency_key" };
  assert.throws(() => validateControlCommandEnvelope(mismatch), ContractValidationError);

  const nonApprovalWithApproval = { ...commandValue, approval_id: "approval_1" };
  assert.throws(() => validateControlCommandEnvelope({ ...envelope, idempotency_key: nonApprovalWithApproval.idempotency_key, command: nonApprovalWithApproval }), ContractValidationError);

  const secretCommand = command("deployment.provision", { agent_id: "agent_1", workspace_ref: "workspace:agent_1", config_revision_id: "config_1" }, { secret_refs: ["sr_1234567890abcdef"] });
  assert.equal(validateControlCommandEnvelope({ ...envelope, idempotency_key: secretCommand.idempotency_key, command: secretCommand }).command.secret_refs[0], "sr_1234567890abcdef");
  const nonOpaqueSecret = { ...secretCommand, secret_refs: ["ref:provider-key"] };
  assert.throws(() => validateControlCommandEnvelope({ ...envelope, idempotency_key: nonOpaqueSecret.idempotency_key, command: nonOpaqueSecret }), ContractValidationError);
});

test("C00-02 enforces lease placement, approval separation, and completion-candidate semantics", () => {
  const lease = fixture("valid/lease-envelope.json");
  const crossServer = structuredClone(lease);
  crossServer.commands[0].placement.server_id = "server_2";
  assert.throws(() => validateLeaseEnvelope(crossServer), ContractValidationError);
  const unexpectedApproval = structuredClone(lease);
  unexpectedApproval.commands[0].approval_id = "approval_1";
  assert.throws(() => validateLeaseEnvelope(unexpectedApproval), ContractValidationError);

  const approval = fixture("valid/approval.json");
  assert.throws(() => validateApproval({ ...approval, decided_by: approval.requested_by }), ContractValidationError);

  const receipt = fixture("valid/receipt-envelope.json");
  assert.throws(() => validateReceiptEnvelope({ ...receipt, state: "succeeded" }), ContractValidationError);
  const noEvidence = { ...receipt };
  delete noEvidence.evidence_refs;
  assert.throws(() => validateReceiptEnvelope(noEvidence), ContractValidationError);

  const event = fixture("valid/command-event.json");
  assert.throws(() => validateCommandEvent({ ...event, state: "running" }), ContractValidationError);
  assert.throws(() => validateCommandEvent({ ...event, event_type: "command.progress", state: "succeeded" }), ContractValidationError);

  const desired = fixture("valid/desired-state.json");
  assert.throws(() => validateDesiredState({ ...desired, module_versions: { "core-runtime": "untyped-value" } }), ContractValidationError);
  assert.throws(() => validateDesiredState({ ...desired, signature: { ...desired.signature, signed_at: "2026-07-17T00:00:00Z" } }), ContractValidationError);
});

test("release manifests enforce SemVer channels, compatibility bounds, and unique components", () => {
  const manifest = fixture("valid/release-manifest.json");
  const stableBuild = structuredClone(manifest);
  stableBuild.version = "2.3.0+build.1";
  stableBuild.channel = "stable";
  assert.equal(validateReleaseManifest(stableBuild).channel, "stable");

  const duplicate = structuredClone(manifest);
  duplicate.artifacts.push({ ...duplicate.artifacts[0] });
  assert.throws(() => validateReleaseManifest(duplicate), ContractValidationError);
  assert.throws(() => validateReleaseManifest({
    ...manifest,
    compatibility: { ...manifest.compatibility, contracts_min: "2.4.0" }
  }), ContractValidationError);
});

test("credential contracts validate structure without echoing values in errors", () => {
  const request = { schema_version: "2.0", owner_scope: runtimeScope, authorization_id: "auth_1", expected_service: "firecrawl", trace: { correlation_id: "request_1" } };
  assert.equal(validateCredentialResolutionRequest(request).owner_scope.runtime_id, "runtime_1");
  assert.throws(() => validateCredentialResolutionRequest({ ...request, owner_scope: agentScope }), ContractValidationError);
  const value = { schema_version: "2.0", owner_scope: runtimeScope, authorization: { id: "auth_1", service: "firecrawl", label: "Personal Firecrawl", authType: "api_key", endpointUrl: "https://api.firecrawl.dev", metadata: {} }, credential: { secret: "secret-value" } };
  assert.equal(validateCredentialResolution(value).authorization.service, "firecrawl");
  try { validateCredentialResolution({ ...value, unexpected: value.credential.secret }); }
  catch (error) { assert.doesNotMatch(JSON.stringify(error), /secret-value/); return; }
  assert.fail("invalid credential response was accepted");
});

test("channel ingress and acknowledgements carry stable deduplication identities", () => {
  const trace = { correlation_id: "channel_trace_1" };
  const ingress = {
    schema_version: "2.0",
    owner_scope: { ...agentScope, workspace_id: "workspace_1" },
    ingress_id: "ingress_1",
    binding_id: "binding_1",
    channel: "feishu",
    channel_account_id: "app_1",
    message_id: "message_1",
    sender: { channel_user_id: "ou_1", display_name: "User" },
    conversation: { channel_conversation_id: "oc_1", kind: "group" },
    content: { kind: "text", text: "hello" },
    attachments: [],
    received_at: now,
    trace
  };
  assert.equal(validateChannelIngress(ingress).message_id, "message_1");
  assert.equal(validateChannelIngressAck({ schema_version: "2.0", owner_scope: ingress.owner_scope, ingress_id: "ingress_1", status: "duplicate", acknowledged_at: now, trace }).status, "duplicate");
  assert.throws(() => validateChannelIngress({ ...ingress, organization_id: "untrusted_hint" }), ContractValidationError);
});

test("channel delivery leases bind receipts to attempts and lease tokens", () => {
  const trace = { correlation_id: "delivery_trace_1" };
  const request = { schema_version: "2.0", worker_id: "worker_1", channels: ["feishu", "qq"], limit: 10, lease_seconds: 30, requested_at: now, trace };
  assert.equal(validateChannelDeliveryLeaseRequest(request).limit, 10);
  const delivery = {
    owner_scope: { ...agentScope, workspace_id: "workspace_1", conversation_id: "conversation_1" },
    outbound_id: "outbound_1",
    binding_id: "binding_1",
    channel: "feishu",
    channel_account_id: "app_1",
    conversation: { channel_conversation_id: "oc_1", kind: "group" },
    content: { kind: "text", text: "reply" },
    attempt: 1,
    lease_token: "lease_token_1",
    available_at: now,
    trace
  };
  assert.equal(validateChannelDeliveryBatch({ schema_version: "2.0", lease_id: "lease_1", worker_id: "worker_1", deliveries: [delivery], leased_until: later, trace }).deliveries.length, 1);
  assert.equal(validateChannelDeliveryReceipt({ schema_version: "2.0", owner_scope: delivery.owner_scope, outbound_id: "outbound_1", binding_id: "binding_1", lease_token: "lease_token_1", status: "delivered", attempt: 1, channel_message_id: "message_2", observed_at: now, trace }).status, "delivered");
});

test("channel health cannot claim connected without bidirectional capability or leak data", () => {
  const report = { schema_version: "2.0", owner_scope: { ...agentScope, workspace_id: "workspace_1" }, binding_id: "binding_1", channel: "wechat", worker_id: "worker_1", sequence: 1, status: "connected", capabilities: ["receive", "send", "webhook"], adapter_version: "1.0.0", observed_at: now };
  assert.equal(validateChannelHealthReport(report).status, "connected");
  assert.throws(() => validateChannelHealthReport({ ...report, capabilities: ["receive"] }), ContractValidationError);
  assert.throws(() => validateChannelHealthReport({ ...report, secret: "must-not-pass" }), ContractValidationError);
  assert.throws(() => validateChannelHealthReport({ ...report, message: "must-not-pass" }), ContractValidationError);
});

test("channel credential resolution is binding scoped", () => {
  const request = { schema_version: "2.0", worker_id: "worker_1", binding_id: "binding_1", owner_scope: { ...agentScope, workspace_id: "workspace_1" }, trace: { correlation_id: "request_1" } };
  assert.equal(validateChannelCredentialResolutionRequest(request).binding_id, "binding_1");
  assert.throws(() => validateChannelCredentialResolutionRequest({ ...request, owner_scope: agentScope }), ContractValidationError);
  const resolution = {
    schema_version: "2.0",
    binding: { id: "binding_1", owner_scope: { ...agentScope, workspace_id: "workspace_1" }, channel: "qq", channel_account_id: "app_1", metadata: {} },
    credential: { values: { appId: "app_1", token: "secret-value" } }
  };
  assert.equal(validateChannelCredentialResolution(resolution).binding.owner_scope.agent_id, "agent_1");
  assert.throws(() => validateChannelCredentialResolution({ ...resolution, browser_visible: true }), ContractValidationError);
});

test("channel inventory exposes binding metadata without credentials or content", () => {
  const trace = { correlation_id: "inventory_trace_1" };
  const request = { schema_version: "2.0", worker_id: "worker_1", channels: ["feishu", "wechat", "qq"], trace };
  assert.equal(validateChannelBindingInventoryRequest(request).worker_id, "worker_1");
  const inventory = { schema_version: "2.0", worker_id: "worker_1", bindings: [{ id: "binding_1", owner_scope: { ...agentScope, workspace_id: "workspace_1" }, channel: "wechat", channel_account_id: "app_1", status: "pending", connection_generation: 2, callback_path: "/callbacks/wechat/binding_1", updated_at: now }], generated_at: now, trace };
  assert.equal(validateChannelBindingInventory(inventory).bindings[0].connection_generation, 2);
  assert.throws(() => validateChannelBindingInventory({ ...inventory, bindings: [{ ...inventory.bindings[0], credential: { token: "must-not-pass" } }] }), ContractValidationError);
  assert.throws(() => validateChannelBindingInventory({ ...inventory, prompt: "must-not-pass" }), ContractValidationError);
});

test("OpenAPI, schemas, fixtures, and generated declarations are committed", () => {
  for (const relative of ["openapi/bairui-internal.openapi.json", "schemas/agent-owner-scope.schema.json", "schemas/artifact-pointer.schema.json", "schemas/credential-resolution-request.schema.json", "schemas/channel-credential-resolution-request.schema.json", "schemas/control-command.schema.json", "schemas/control-command-envelope.schema.json", "schemas/desired-state.schema.json", "schemas/observation.schema.json", "schemas/command-event.schema.json", "schemas/approval.schema.json", "schemas/release-manifest.schema.json", "schemas/lease-request-envelope.schema.json", "schemas/lease-envelope.schema.json", "schemas/receipt-envelope.schema.json", "schemas/control-error.schema.json", "schemas/runtime-heartbeat.schema.json", "schemas/heartbeat.schema.json", "schemas/resource-sample.schema.json", "schemas/channel-ingress.schema.json", "schemas/channel-delivery-receipt.schema.json", "schemas/channel-health-report.schema.json", "dist/index.d.ts"]) {
    assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  }
  const openapi = JSON.parse(fs.readFileSync(path.join(root, "openapi", "bairui-internal.openapi.json"), "utf8"));
  const heartbeat = openapi.paths["/api/internal/control-plane/heartbeats"].post;
  assert.equal(heartbeat.requestBody.content["application/json"].schema.$ref, "#/components/schemas/Heartbeat");
  const lease = openapi.paths["/api/internal/control-plane/commands/lease"].post;
  assert.equal(lease.responses[409].content["application/json"].schema.$ref, "#/components/schemas/ControlError");
  assert.deepEqual(Object.keys(lease.security[0]).sort(), ["machineNonce", "machineSignature", "machineTimestamp"]);
  for (const [pathname, operations] of Object.entries(openapi.paths).filter(([pathname]) => pathname.startsWith("/api/internal/control-plane/"))) {
    for (const operation of Object.values(operations)) assert.deepEqual(Object.keys(operation.security[0]).sort(), ["machineNonce", "machineSignature", "machineTimestamp"], pathname);
  }

  const declarations = fs.readFileSync(path.join(root, "dist", "index.d.ts"), "utf8");
  assert.match(declarations, /export declare function validateDesiredState\(value: unknown\): DesiredState/);
  assert.match(declarations, /command:\s*\{\s*schema_version:/);
  assert.match(declarations, /commands:\s*\{\s*schema_version:/);
  assert.doesNotMatch(declarations, /command:\s*\{\s*\[k: string\]: unknown/);
});
