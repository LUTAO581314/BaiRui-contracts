export const CONTRACTS_VERSION = "2.3.0-rc.2";
export const CONTROL_PROTOCOL_VERSION = "1.0";
export const CONTROL_SCHEMA_VERSION = "1.0";
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
export const CONTROL_QUARANTINED_ACTIONS = Object.freeze(["config.apply-user"]);
export const LEGACY_CONTROL_ACTION_ARGUMENTS = Object.freeze({
  ...CONTROL_ACTION_ARGUMENTS,
  "config.apply-user": { required: ["config_revision_id"], optional: [] }
});
export const LEGACY_CONTROL_ACTIONS = Object.freeze(Object.keys(LEGACY_CONTROL_ACTION_ARGUMENTS));
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
export const CONTROL_EVENT_STATES = Object.freeze([
  "queued", "leased", "accepted", "running", "executing", "verifying",
  "succeeded", "failed", "cancelled", "expired"
]);
export const CONTROL_EVENT_TYPES = Object.freeze([
  "command.queued", "command.leased", "command.accepted", "command.started",
  "command.executing", "command.progress", "command.verification.started",
  "command.verified", "command.failed", "command.cancelled", "command.expired",
  "lease.renewed"
]);
export const CONTROL_RECEIPT_STATES = Object.freeze([
  "accepted", "running", "executing", "completion_candidate", "failed", "cancelled", "expired"
]);
export const CONTROL_APPROVAL_DECISIONS = Object.freeze(["pending", "approved", "rejected", "expired"]);
export const CONTROL_RISK_LEVELS = Object.freeze(["low", "medium", "high", "critical"]);
export const CONTROL_RELEASE_STATUSES = Object.freeze([
  "candidate", "approved", "rolling_out", "released", "blocked", "withdrawn"
]);
export const CONTROL_DESIRED_STATES = Object.freeze([
  "proposed", "accepted", "active", "superseded", "rejected"
]);
export const CONTROL_TARGET_STATES = Object.freeze([
  "provisioned", "running", "stopped", "suspended", "deleted"
]);
export const CONTROL_SIGNATURE_ALGORITHMS = Object.freeze(["ed25519", "hmac-sha256"]);
export const CONTROL_MUTATION_FIELDS = Object.freeze([
  "organization_id", "user_id", "agent_id", "server_id", "request_id",
  "correlation_id", "idempotency_key", "created_at", "revision", "sequence", "signature"
]);
export const CONTROL_COMPATIBILITY_WINDOW = Object.freeze({
  current_contracts: CONTRACTS_VERSION,
  legacy_contracts_range: "2.2.x",
  current_schema_version: CONTROL_SCHEMA_VERSION,
  dual_read_required: true,
  implicit_conversion: false,
  legacy_surfaces: Object.freeze(["control-command@1.0", "runtime-heartbeat@2.0", "resource-report@2.0"]),
  canonical_receipt_completion_state: "completion_candidate",
  quarantined_actions: CONTROL_QUARANTINED_ACTIONS
});
export const CONTROL_ERROR_CODES = Object.freeze([
  "invalid_schema_version",
  "unsupported_schema_version",
  "unknown_field",
  "missing_field",
  "invalid_identifier",
  "invalid_action",
  "quarantined_action",
  "forbidden_action",
  "forbidden_field",
  "raw_secret_not_allowed",
  "invalid_signature",
  "signature_key_unknown",
  "signature_expired",
  "replay_detected",
  "idempotency_conflict",
  "revision_conflict",
  "sequence_conflict",
  "owner_mismatch",
  "server_mismatch",
  "approval_required",
  "approval_not_valid",
  "lease_not_found",
  "lease_expired",
  "receipt_conflict",
  "release_not_immutable",
  "evidence_not_found",
  "stale_observation",
  "verification_failed"
]);

export const RUNTIME_OPERATIONS = Object.freeze([
  "health.detailed",
  "discovery.models", "discovery.capabilities", "discovery.skills", "discovery.toolsets",
  "sessions.list", "sessions.create", "sessions.get", "sessions.update", "sessions.delete", "sessions.messages", "sessions.fork", "sessions.chat",
  "runs.create", "runs.get", "runs.approve", "runs.stop",
  "jobs.list", "jobs.create", "jobs.get", "jobs.update", "jobs.delete", "jobs.pause", "jobs.resume", "jobs.run",
  "memory.snapshot", "memory.apply",
  // Explicit Hermes management ports. These are stable capability names, not
  // arbitrary URL passthroughs. The Agent bridge owns the route mapping.
  "provider.catalog", "provider.validate", "provider.oauth.list", "provider.oauth.start", "provider.oauth.submit", "provider.oauth.poll", "provider.oauth.cancel",
  "model.info", "model.options", "model.recommended", "model.auxiliary", "model.set", "model.moa.get", "model.moa.set",
  "toolsets.list", "toolsets.update", "toolsets.config", "toolsets.models", "toolsets.model", "toolsets.provider", "toolsets.post_setup",
  "skills.list", "skills.toggle", "skills.content", "skills.create", "skills.update", "skills.hub.sources", "skills.hub.search", "skills.hub.preview", "skills.hub.scan", "skills.hub.install", "skills.hub.update", "skills.hub.uninstall",
  "memory.status", "memory.provider.config", "memory.provider.setup", "memory.provider.set", "memory.provider.oauth.start", "memory.provider.oauth.status", "memory.reset", "memory.learning.graph", "memory.learning.node.get", "memory.learning.node.update", "memory.learning.node.delete", "memory.curator.get", "memory.curator.pause", "memory.curator.run",
  "mcp.list", "mcp.catalog", "mcp.catalog.install", "mcp.create", "mcp.update", "mcp.delete", "mcp.test", "mcp.auth", "mcp.enabled",
  "profiles.list", "profiles.active.get", "profiles.active.set", "profiles.create", "profiles.get", "profiles.update", "profiles.delete", "profiles.soul.get", "profiles.soul.set", "profiles.description.set", "profiles.model.set", "profiles.setup-command",
  "cron.list", "cron.get", "cron.create", "cron.update", "cron.pause", "cron.resume", "cron.trigger", "cron.delete", "cron.history", "cron.delivery_targets", "cron.blueprints", "cron.blueprint.instantiate",
  "channel.platforms", "channel.platform.test", "channel.pairing.list", "channel.pairing.approve", "channel.pairing.revoke", "channel.pairing.clear",
  "analytics.usage", "analytics.models",
  "diagnostics.status", "diagnostics.system.stats", "diagnostics.doctor", "diagnostics.security_audit", "diagnostics.checkpoints", "diagnostics.backup", "diagnostics.debug_share",
  "files.list", "files.read", "files.read-data-url", "files.download", "files.write", "files.upload", "files.mkdir", "files.delete"
]);

export const RUNTIME_STREAM_OPERATIONS = Object.freeze(["sessions.chat.stream", "runs.events"]);
export const MODULE_LAYERS = Object.freeze(["core-runtime", "service-integration", "data-storage", "channel-bridge", "ui-exposure"]);
export const MODULE_STATUSES = Object.freeze(["healthy", "degraded", "unhealthy", "unknown"]);
