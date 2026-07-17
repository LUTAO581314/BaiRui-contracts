export const CONTRACTS_VERSION = "2.0.0";
export const CONTROL_PROTOCOL_VERSION = "1.0";
export const CHANNEL_PROTOCOL_VERSION = "2.0";
export const RUNTIME_PROTOCOL_VERSION = "2.0";
export const DATA_PROTOCOL_VERSION = "2.0";

export const IDENTITY_KINDS = Object.freeze([
  "organization", "user", "agent", "runtime", "workspace", "conversation"
]);
export const ARTIFACT_KINDS = Object.freeze([
  "file", "document", "image", "audio", "video", "dataset", "archive", "other"
]);

export const CHANNELS = Object.freeze(["web", "cli", "feishu", "wechat", "qq"]);
export const CHANNEL_CONNECTION_STATUSES = Object.freeze(["pending", "connected", "degraded", "error", "disconnected", "disabled"]);
export const CHANNEL_DELIVERY_STATUSES = Object.freeze(["delivered", "retryable", "failed"]);

export const CONTROL_ACTION_ARGUMENTS = Object.freeze({
  "snapshot.collect": { required: [], optional: [] },
  "deployment.provision": { required: ["agent_id", "workspace_ref", "config_revision_id"], optional: [] },
  "deployment.start": { required: ["agent_id"], optional: [] },
  "deployment.stop": { required: ["agent_id"], optional: [] },
  "deployment.suspend": { required: ["agent_id"], optional: [] },
  "deployment.resume": { required: ["agent_id"], optional: [] },
  "deployment.delete": { required: ["agent_id"], optional: ["backup_id"] },
  "credential.revoke": { required: ["identity_id"], optional: [] },
  "probe.run": { required: ["probe_ids"], optional: ["test_run_id"] },
  "contract.test": { required: ["suite_id"], optional: ["test_run_id"] },
  "smoke.test": { required: ["suite_id"], optional: ["test_run_id"] },
  "upstream.check": { required: ["upstream_id"], optional: ["candidate_id", "test_run_id"] },
  "config.stage": { required: ["config_revision_id"], optional: [] },
  "config.apply": { required: ["config_revision_id"], optional: [] },
  "config.apply-user": { required: ["config_revision_id"], optional: [] },
  "backup.create": { required: ["backup_policy_id"], optional: ["backup_id"] },
  "backup.verify": { required: ["backup_id"], optional: [] },
  "backup.restore": { required: ["backup_id", "restore_id"], optional: [] },
  "backup.expire": { required: ["backup_id"], optional: [] },
  "release.stage": { required: ["release_id"], optional: ["rollout_id"] },
  "release.apply": { required: ["release_id"], optional: ["rollout_id"] },
  "release.rollback": { required: ["release_id", "rollback_release_id"], optional: ["rollout_id"] },
  "service.restart": { required: ["service_id"], optional: [] }
});

export const CONTROL_ACTIONS = Object.freeze(Object.keys(CONTROL_ACTION_ARGUMENTS));
export const CONTROL_APPROVAL_ACTIONS = Object.freeze([
  "config.apply",
  "backup.restore",
  "release.apply",
  "release.rollback",
  "service.restart",
  "deployment.delete",
  "credential.revoke"
]);
export const CONTROL_COMMAND_STATES = Object.freeze([
  "queued", "leased", "accepted", "running", "succeeded", "failed", "cancelled", "expired"
]);

export const RUNTIME_OPERATIONS = Object.freeze([
  "health.detailed",
  "discovery.models", "discovery.capabilities", "discovery.skills", "discovery.toolsets",
  "sessions.list", "sessions.create", "sessions.get", "sessions.update", "sessions.delete", "sessions.messages", "sessions.fork", "sessions.chat",
  "runs.create", "runs.get", "runs.approve", "runs.stop",
  "jobs.list", "jobs.create", "jobs.get", "jobs.update", "jobs.delete", "jobs.pause", "jobs.resume", "jobs.run",
  "memory.snapshot", "memory.apply"
]);

export const RUNTIME_STREAM_OPERATIONS = Object.freeze(["sessions.chat.stream", "runs.events"]);
export const MODULE_LAYERS = Object.freeze(["core-runtime", "service-integration", "data-storage", "channel-bridge", "ui-exposure"]);
export const MODULE_STATUSES = Object.freeze(["healthy", "degraded", "unhealthy", "unknown"]);
