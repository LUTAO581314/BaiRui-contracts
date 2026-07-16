import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  CONTROL_ACTIONS,
  ContractValidationError,
  validateControlCommand,
  validateCredentialResolution,
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

test("credential contracts validate structure without echoing values in errors", () => {
  const value = { authorization: { id: "auth_1", service: "firecrawl", label: "Personal Firecrawl", authType: "api_key", endpointUrl: "https://api.firecrawl.dev", metadata: {} }, credential: { secret: "secret-value" } };
  assert.equal(validateCredentialResolution(value).authorization.service, "firecrawl");
  try { validateCredentialResolution({ ...value, unexpected: value.credential.secret }); }
  catch (error) { assert.doesNotMatch(JSON.stringify(error), /secret-value/); return; }
  assert.fail("invalid credential response was accepted");
});

test("OpenAPI, schemas, and generated declarations are committed", () => {
  for (const relative of ["openapi/bairui-internal.openapi.json", "schemas/control-command.schema.json", "schemas/runtime-heartbeat.schema.json", "dist/index.d.ts"]) {
    assert.equal(fs.existsSync(path.join(root, relative)), true, relative);
  }
});
