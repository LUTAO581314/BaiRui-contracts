import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  CONTROL_ACTIONS,
  ContractValidationError,
  validateChannelBindingInventory,
  validateChannelBindingInventoryRequest,
  validateChannelCredentialResolution,
  validateChannelDeliveryBatch,
  validateChannelDeliveryLeaseRequest,
  validateChannelDeliveryReceipt,
  validateChannelHealthReport,
  validateChannelIngress,
  validateChannelIngressAck,
  validateControlCommand,
  validateCredentialResolution,
  validateResourceReport,
  validateRuntimeHeartbeat,
  validateRuntimeRequestEnvelope
} from "../src/index.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const now = new Date().toISOString();
const later = new Date(Date.now() + 60_000).toISOString();

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
});

test("control validation fails closed for missing approvals and unknown arguments", () => {
  assert.throws(() => validateControlCommand(command("backup.restore", { backup_id: "backup_1", restore_id: "restore_1" })), ContractValidationError);
  assert.throws(() => validateControlCommand(command("snapshot.collect", { prompt: "hidden" })), ContractValidationError);
});

test("runtime requests bind the request to the supplied config", () => {
  const request = {
    request_id: "request_1",
    request_type: "message",
    tenant: { organization_id: "org_1", agent_id: "agent_1" },
    actor: { user_id: "user_1", roles: ["user"] },
    channel_context: { channel: "web" },
    input: { content: "hello" },
    runtime_config_ref: "config_1",
    trace: { correlation_id: "request_1" },
    created_at: now
  };
  const config = { config_id: "config_1", model_policy: {}, tool_policy: {}, memory_policy: {}, approval_policy: {}, storage_policy: {}, integration_policy: {} };
  assert.equal(validateRuntimeRequestEnvelope({ request, config }).request.request_id, "request_1");
  assert.throws(() => validateRuntimeRequestEnvelope({ request, config: { ...config, config_id: "config_2" } }), ContractValidationError);
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

test("credential contracts validate structure without echoing values in errors", () => {
  const value = { authorization: { id: "auth_1", service: "firecrawl", label: "Personal Firecrawl", authType: "api_key", endpointUrl: "https://api.firecrawl.dev", metadata: {} }, credential: { secret: "secret-value" } };
  assert.equal(validateCredentialResolution(value).authorization.service, "firecrawl");
  try { validateCredentialResolution({ ...value, unexpected: value.credential.secret }); }
  catch (error) { assert.doesNotMatch(JSON.stringify(error), /secret-value/); return; }
  assert.fail("invalid credential response was accepted");
});

test("channel ingress and acknowledgements carry stable deduplication identities", () => {
  const trace = { correlation_id: "channel_trace_1" };
  const ingress = {
    schema_version: "1.0",
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
  assert.equal(validateChannelIngressAck({ schema_version: "1.0", ingress_id: "ingress_1", status: "duplicate", acknowledged_at: now, trace }).status, "duplicate");
  assert.throws(() => validateChannelIngress({ ...ingress, organization_id: "untrusted_hint" }), ContractValidationError);
});

test("channel delivery leases bind receipts to attempts and lease tokens", () => {
  const trace = { correlation_id: "delivery_trace_1" };
  const request = { schema_version: "1.0", worker_id: "worker_1", channels: ["feishu", "qq"], limit: 10, lease_seconds: 30, requested_at: now, trace };
  assert.equal(validateChannelDeliveryLeaseRequest(request).limit, 10);
  const delivery = {
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
  assert.equal(validateChannelDeliveryBatch({ schema_version: "1.0", lease_id: "lease_1", worker_id: "worker_1", deliveries: [delivery], leased_until: later, trace }).deliveries.length, 1);
  assert.equal(validateChannelDeliveryReceipt({ schema_version: "1.0", outbound_id: "outbound_1", binding_id: "binding_1", lease_token: "lease_token_1", status: "delivered", attempt: 1, channel_message_id: "message_2", observed_at: now, trace }).status, "delivered");
});

test("channel health cannot claim connected without bidirectional capability or leak data", () => {
  const report = { schema_version: "1.0", binding_id: "binding_1", channel: "wechat", worker_id: "worker_1", sequence: 1, status: "connected", capabilities: ["receive", "send", "webhook"], adapter_version: "1.0.0", observed_at: now };
  assert.equal(validateChannelHealthReport(report).status, "connected");
  assert.throws(() => validateChannelHealthReport({ ...report, capabilities: ["receive"] }), ContractValidationError);
  assert.throws(() => validateChannelHealthReport({ ...report, secret: "must-not-pass" }), ContractValidationError);
  assert.throws(() => validateChannelHealthReport({ ...report, message: "must-not-pass" }), ContractValidationError);
});

test("channel credential resolution is binding scoped", () => {
  const resolution = {
    binding: { id: "binding_1", organization_id: "org_1", user_id: "user_1", agent_id: "agent_1", channel: "qq", channel_account_id: "app_1", metadata: {} },
    credential: { values: { appId: "app_1", token: "secret-value" } }
  };
  assert.equal(validateChannelCredentialResolution(resolution).binding.agent_id, "agent_1");
  assert.throws(() => validateChannelCredentialResolution({ ...resolution, browser_visible: true }), ContractValidationError);
});

test("channel inventory exposes binding metadata without credentials or content", () => {
  const trace = { correlation_id: "inventory_trace_1" };
  const request = { schema_version: "1.0", worker_id: "worker_1", channels: ["feishu", "wechat", "qq"], trace };
  assert.equal(validateChannelBindingInventoryRequest(request).worker_id, "worker_1");
  const inventory = { schema_version: "1.0", worker_id: "worker_1", bindings: [{ id: "binding_1", organization_id: "org_1", user_id: "user_1", agent_id: "agent_1", channel: "wechat", channel_account_id: "app_1", status: "pending", connection_generation: 2, callback_path: "/callbacks/wechat/binding_1", updated_at: now }], generated_at: now, trace };
  assert.equal(validateChannelBindingInventory(inventory).bindings[0].connection_generation, 2);
  assert.throws(() => validateChannelBindingInventory({ ...inventory, bindings: [{ ...inventory.bindings[0], credential: { token: "must-not-pass" } }] }), ContractValidationError);
  assert.throws(() => validateChannelBindingInventory({ ...inventory, prompt: "must-not-pass" }), ContractValidationError);
});

test("OpenAPI, schemas, and generated declarations are committed", () => {
  for (const relative of ["openapi/bairui-internal.openapi.json", "schemas/control-command.schema.json", "schemas/runtime-heartbeat.schema.json", "schemas/channel-ingress.schema.json", "schemas/channel-delivery-receipt.schema.json", "schemas/channel-health-report.schema.json", "dist/index.d.ts"]) {
    assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  }
});
