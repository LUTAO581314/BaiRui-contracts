export interface AgentOwnerScope {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id?: string
conversation_id?: string
}

export interface ArtifactPointer {
schema_version: "1.0"
artifact_id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id?: string
conversation_id?: string
}
kind: ("file" | "document" | "image" | "audio" | "video" | "dataset" | "archive" | "other")
media_type: string
size_bytes: number
sha256: string
created_at: string
metadata?: {
[k: string]: string
}
}

export type ControlCommand = ({
[k: string]: unknown
} & {
schema_version: "1.0"
command_id: string
idempotency_key: string
deployment_id: string
action: ("snapshot.collect" | "deployment.provision" | "deployment.start" | "deployment.stop" | "deployment.suspend" | "deployment.resume" | "deployment.delete" | "credential.revoke" | "probe.run" | "contract.test" | "smoke.test" | "upstream.check" | "config.stage" | "config.apply" | "config.apply-user" | "backup.create" | "backup.verify" | "backup.restore" | "backup.expire" | "release.stage" | "release.apply" | "release.rollback" | "service.restart")
target: {
module_id: string
instance_id?: string
}
arguments: {
[k: string]: unknown
}
approval_id?: string
expected_observation_version: number
not_before?: string
expires_at: string
created_at: string
})

export interface ControlCommandEnvelope {
schema_version: "1.0"
organization_id: string
user_id: string
agent_id: string
server_id: string
request_id: string
correlation_id: string
idempotency_key: string
created_at: string
revision: number
sequence: number
signature: {
algorithm: ("ed25519" | "hmac-sha256")
key_id: string
value: string
signed_at: string
}
command: {
[k: string]: unknown
}
}

export interface DesiredState {
schema_version: "1.0"
organization_id: string
user_id: string
agent_id: string
server_id: string
request_id: string
correlation_id: string
idempotency_key: string
created_at: string
revision: number
sequence: number
signature: {
algorithm: ("ed25519" | "hmac-sha256")
key_id: string
value: string
signed_at: string
}
deployment_id: string
version: number
state?: ("provisioned" | "running" | "stopped" | "suspended" | "deleted")
config_revision_id?: string
release_id?: string
module_versions: {
[k: string]: string
}
/**
 * @maxItems 100
 */
modules?: {
module_id: string
desired_status: ("absent" | "stopped" | "running" | "suspended")
version_ref: string
image_digest?: string
config_ref?: string
enabled?: boolean
}[]
updated_at: string
valid_from?: string
expires_at?: string
}

export interface Observation {
schema_version: "1.0"
organization_id: string
user_id: string
agent_id: string
server_id: string
request_id: string
correlation_id: string
idempotency_key: string
created_at: string
revision: number
sequence: number
signature: {
algorithm: ("ed25519" | "hmac-sha256")
key_id: string
value: string
signed_at: string
}
observation_id: string
deployment_id: string
version: number
desired_state_version?: number
status: ("healthy" | "degraded" | "unhealthy" | "unknown")
/**
 * @maxItems 200
 */
modules: {
module_id: string
status: ("healthy" | "degraded" | "unhealthy" | "unknown")
version: string
readiness?: ("ready" | "not_ready" | "unknown")
image_digest?: string
observed_at: string
/**
 * @maxItems 100
 */
evidence_refs?: string[]
health_code?: string
}[]
/**
 * @maxItems 100
 */
evidence_refs?: string[]
redaction_status: "redacted"
observed_at: string
received_at?: string
freshness_seconds?: number
updated_at?: string
}

export type CommandEvent = ({
[k: string]: unknown
} & {
schema_version: "1.0"
organization_id: string
user_id: string
agent_id: string
server_id: string
request_id: string
correlation_id: string
idempotency_key: string
created_at: string
revision: number
sequence: number
signature: {
algorithm: ("ed25519" | "hmac-sha256")
key_id: string
value: string
signed_at: string
}
event_id: string
event_sequence: number
command_id: string
action?: ("snapshot.collect" | "deployment.provision" | "deployment.start" | "deployment.stop" | "deployment.suspend" | "deployment.resume" | "deployment.delete" | "credential.revoke" | "probe.run" | "contract.test" | "smoke.test" | "upstream.check" | "config.stage" | "config.apply" | "config.apply-user" | "backup.create" | "backup.verify" | "backup.restore" | "backup.expire" | "release.stage" | "release.apply" | "release.rollback" | "service.restart")
attempt: number
state: ("queued" | "leased" | "accepted" | "running" | "executing" | "verifying" | "succeeded" | "failed" | "cancelled" | "expired")
event_type: ("command.queued" | "command.leased" | "command.accepted" | "command.started" | "command.executing" | "command.progress" | "command.verifying" | "command.succeeded" | "command.failed" | "command.cancelled" | "command.expired" | "lease.renewed")
lease_id?: string
lease_token?: string
observation_version?: number
/**
 * @maxItems 100
 */
evidence_refs?: string[]
error_code?: ("invalid_schema_version" | "unsupported_schema_version" | "unknown_field" | "missing_field" | "invalid_identifier" | "invalid_action" | "forbidden_action" | "forbidden_field" | "raw_secret_not_allowed" | "invalid_signature" | "signature_key_unknown" | "signature_expired" | "replay_detected" | "idempotency_conflict" | "revision_conflict" | "sequence_conflict" | "owner_mismatch" | "server_mismatch" | "approval_required" | "approval_not_valid" | "lease_not_found" | "lease_expired" | "receipt_conflict" | "release_not_immutable" | "evidence_not_found")
error_ref?: string
message_ref?: string
result_ref?: string
occurred_at: string
completed_at?: string
})

export type Approval = ({
[k: string]: unknown
} & {
schema_version: "1.0"
organization_id: string
user_id: string
agent_id: string
server_id: string
request_id: string
correlation_id: string
idempotency_key: string
created_at: string
revision: number
sequence: number
signature: {
algorithm: ("ed25519" | "hmac-sha256")
key_id: string
value: string
signed_at: string
}
approval_id: string
command_id: string
action: ("snapshot.collect" | "deployment.provision" | "deployment.start" | "deployment.stop" | "deployment.suspend" | "deployment.resume" | "deployment.delete" | "credential.revoke" | "probe.run" | "contract.test" | "smoke.test" | "upstream.check" | "config.stage" | "config.apply" | "config.apply-user" | "backup.create" | "backup.verify" | "backup.restore" | "backup.expire" | "release.stage" | "release.apply" | "release.rollback" | "service.restart")
risk_level: ("low" | "medium" | "high" | "critical")
requested_by: string
decided_by?: string
decision: ("pending" | "approved" | "rejected" | "expired")
reason_code?: ("operator_requested" | "policy_required" | "break_glass" | "rollback" | "recovery" | "maintenance")
reason_ref?: string
expires_at: string
decided_at?: string
scope?: {
deployment_id: string
organization_id?: string
user_id?: string
agent_id: string
server_id: string
}
})

export interface ReleaseManifest {
schema_version: "1.0"
organization_id: string
user_id: string
agent_id: string
server_id: string
request_id: string
correlation_id: string
idempotency_key: string
created_at: string
revision: number
sequence: number
signature: {
algorithm: ("ed25519" | "hmac-sha256")
key_id: string
value: string
signed_at: string
}
release_id: string
version: string
channel: ("prerelease" | "stable")
status: ("candidate" | "approved" | "rolling_out" | "released" | "blocked" | "withdrawn")
contracts_version: string
immutable: true
agent_commit: string
/**
 * @minItems 1
 * @maxItems 100
 */
artifacts: [{
component: ("platform" | "agent" | "control" | "channel" | "database" | "proxy" | "other")
version: string
ref: string
digest: string
sbom_ref?: string
provenance_ref?: string
}, ...({
component: ("platform" | "agent" | "control" | "channel" | "database" | "proxy" | "other")
version: string
ref: string
digest: string
sbom_ref?: string
provenance_ref?: string
})[]]
sbom_ref?: string
provenance_ref?: string
attestation_ref?: string
migration_ref?: string
compatibility: {
contracts_min: string
contracts_max?: string
agent_min?: string
platform_min?: string
rollback_release_id?: string
/**
 * @maxItems 100
 */
required_capabilities?: string[]
}
release_notes_ref?: string
}

export interface LeaseRequestEnvelope {
schema_version: "1.0"
organization_id: string
user_id: string
agent_id: string
server_id: string
request_id: string
correlation_id: string
idempotency_key: string
created_at: string
revision: number
sequence: number
signature: {
algorithm: ("ed25519" | "hmac-sha256")
key_id: string
value: string
signed_at: string
}
limit: number
lease_seconds: number
requested_at: string
/**
 * @maxItems 100
 */
capability_refs?: string[]
}

export interface LeaseEnvelope {
schema_version: "1.0"
organization_id: string
user_id: string
agent_id: string
server_id: string
request_id: string
correlation_id: string
idempotency_key: string
created_at: string
revision: number
sequence: number
signature: {
algorithm: ("ed25519" | "hmac-sha256")
key_id: string
value: string
signed_at: string
}
lease_id: string
lease_expires_at: string
/**
 * @maxItems 100
 */
commands: {
[k: string]: unknown
}[]
issued_at?: string
}

export type ReceiptEnvelope = ({
[k: string]: unknown
} & {
schema_version: "1.0"
organization_id: string
user_id: string
agent_id: string
server_id: string
request_id: string
correlation_id: string
idempotency_key: string
created_at: string
revision: number
sequence: number
signature: {
algorithm: ("ed25519" | "hmac-sha256")
key_id: string
value: string
signed_at: string
}
receipt_id: string
lease_id: string
lease_token: string
command_id: string
attempt: number
state: ("accepted" | "running" | "executing" | "verifying" | "succeeded" | "failed" | "cancelled" | "expired")
event_sequence: number
observed_at: string
completed_at?: string
error_code?: ("invalid_schema_version" | "unsupported_schema_version" | "unknown_field" | "missing_field" | "invalid_identifier" | "invalid_action" | "forbidden_action" | "forbidden_field" | "raw_secret_not_allowed" | "invalid_signature" | "signature_key_unknown" | "signature_expired" | "replay_detected" | "idempotency_conflict" | "revision_conflict" | "sequence_conflict" | "owner_mismatch" | "server_mismatch" | "approval_required" | "approval_not_valid" | "lease_not_found" | "lease_expired" | "receipt_conflict" | "release_not_immutable" | "evidence_not_found")
error_ref?: string
/**
 * @maxItems 100
 */
evidence_refs?: string[]
result_ref?: string
endpoint_ref?: string
})

export interface ControlError {
schema_version: "1.0"
error_code: ("invalid_schema_version" | "unsupported_schema_version" | "unknown_field" | "missing_field" | "invalid_identifier" | "invalid_action" | "forbidden_action" | "forbidden_field" | "raw_secret_not_allowed" | "invalid_signature" | "signature_key_unknown" | "signature_expired" | "replay_detected" | "idempotency_conflict" | "revision_conflict" | "sequence_conflict" | "owner_mismatch" | "server_mismatch" | "approval_required" | "approval_not_valid" | "lease_not_found" | "lease_expired" | "receipt_conflict" | "release_not_immutable" | "evidence_not_found")
retryable: boolean
request_id: string
correlation_id: string
field?: string
ref?: string
occurred_at: string
}

export interface RuntimeRequestEnvelope {
schema_version: "2.0"
request: {
request_id: string
request_type: ("message" | "task" | "approval_result" | "tool_result" | "system_event")
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id: string
workspace_id: string
conversation_id?: string
}
actor: {
user_id: string
/**
 * @maxItems 32
 */
roles?: string[]
}
channel_context?: {
[k: string]: unknown
}
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
created_at: string
input: {
[k: string]: unknown
}
runtime_config_ref: string
/**
 * @maxItems 100
 */
capability_hints?: string[]
}
config: {
config_id: string
model_policy: {
[k: string]: unknown
}
tool_policy: {
[k: string]: unknown
}
memory_policy: {
[k: string]: unknown
}
approval_policy: {
[k: string]: unknown
}
storage_policy: {
[k: string]: unknown
}
integration_policy: {
[k: string]: unknown
}
channel_policy?: {
[k: string]: unknown
}
}
}

export interface RuntimeOperationEnvelope {
schema_version: "2.0"
operation: ("health.detailed" | "discovery.models" | "discovery.capabilities" | "discovery.skills" | "discovery.toolsets" | "sessions.list" | "sessions.create" | "sessions.get" | "sessions.update" | "sessions.delete" | "sessions.messages" | "sessions.fork" | "sessions.chat" | "runs.create" | "runs.get" | "runs.approve" | "runs.stop" | "jobs.list" | "jobs.create" | "jobs.get" | "jobs.update" | "jobs.delete" | "jobs.pause" | "jobs.resume" | "jobs.run" | "memory.snapshot" | "memory.apply" | "provider.catalog" | "provider.validate" | "provider.oauth.list" | "provider.oauth.start" | "provider.oauth.submit" | "provider.oauth.poll" | "provider.oauth.cancel" | "model.info" | "model.options" | "model.recommended" | "model.auxiliary" | "model.set" | "model.moa.get" | "model.moa.set" | "toolsets.list" | "toolsets.update" | "toolsets.config" | "toolsets.models" | "toolsets.model" | "toolsets.provider" | "toolsets.post_setup" | "skills.list" | "skills.toggle" | "skills.content" | "skills.create" | "skills.update" | "skills.hub.sources" | "skills.hub.search" | "skills.hub.preview" | "skills.hub.scan" | "skills.hub.install" | "skills.hub.update" | "skills.hub.uninstall" | "memory.status" | "memory.provider.config" | "memory.provider.setup" | "memory.provider.set" | "memory.provider.oauth.start" | "memory.provider.oauth.status" | "memory.reset" | "memory.learning.graph" | "memory.learning.node.get" | "memory.learning.node.update" | "memory.learning.node.delete" | "memory.curator.get" | "memory.curator.pause" | "memory.curator.run" | "mcp.list" | "mcp.catalog" | "mcp.catalog.install" | "mcp.create" | "mcp.update" | "mcp.delete" | "mcp.test" | "mcp.auth" | "mcp.enabled" | "profiles.list" | "profiles.active.get" | "profiles.active.set" | "profiles.create" | "profiles.get" | "profiles.update" | "profiles.delete" | "profiles.soul.get" | "profiles.soul.set" | "profiles.description.set" | "profiles.model.set" | "profiles.setup-command" | "cron.list" | "cron.get" | "cron.create" | "cron.update" | "cron.pause" | "cron.resume" | "cron.trigger" | "cron.delete" | "cron.history" | "cron.delivery_targets" | "cron.blueprints" | "cron.blueprint.instantiate" | "channel.platforms" | "channel.platform.test" | "channel.pairing.list" | "channel.pairing.approve" | "channel.pairing.revoke" | "channel.pairing.clear" | "analytics.usage" | "analytics.models" | "diagnostics.status" | "diagnostics.system.stats" | "diagnostics.doctor" | "diagnostics.security_audit" | "diagnostics.checkpoints" | "diagnostics.backup" | "diagnostics.debug_share" | "files.list" | "files.read" | "files.read-data-url" | "files.download" | "files.write" | "files.upload" | "files.mkdir" | "files.delete")
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id: string
workspace_id: string
conversation_id?: string
}
actor: {
user_id: string
/**
 * @maxItems 32
 */
roles?: string[]
}
channel_context?: {
[k: string]: unknown
}
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
created_at: string
input: {
[k: string]: unknown
}
}

export interface RuntimeStreamEnvelope {
schema_version: "2.0"
operation: ("sessions.chat.stream" | "runs.events")
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id: string
workspace_id: string
conversation_id?: string
}
actor: {
user_id: string
/**
 * @maxItems 32
 */
roles?: string[]
}
channel_context?: {
[k: string]: unknown
}
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
created_at: string
input: {
[k: string]: unknown
}
}

export interface SceneSnapshot {
schema_version: "2.0"
scene_id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id?: string
}
revision: number
view: {
[k: string]: unknown
}
generated_at: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface ScenePatch {
schema_version: "2.0"
scene_id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id?: string
}
base_revision: number
revision: number
/**
 * @minItems 1
 * @maxItems 200
 */
operations: [{
op: ("add" | "replace" | "remove")
path: string
value?: unknown
}, ...({
op: ("add" | "replace" | "remove")
path: string
value?: unknown
})[]]
generated_at: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface SceneIntent {
schema_version: "2.0"
scene_id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id?: string
}
intent_id: string
action: ("navigate" | "command" | "refresh" | "resync")
payload: {
[k: string]: unknown
}
created_at: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface RuntimeHeartbeat {
organizationId: string
userId: string
agentId: string
runtimeId: string
sequence: number
status: ("healthy" | "degraded" | "unhealthy" | "unknown")
runtimeVersion?: string
boundaryVersion?: string
configRevisionId?: string
queueDepth: number
activeRuns: number
failedRuns: number
observedAt: string
/**
 * @minItems 2
 * @maxItems 200
 */
components: [{
layer: ("core-runtime" | "service-integration" | "data-storage" | "channel-bridge" | "ui-exposure")
moduleId: string
status: ("healthy" | "degraded" | "unhealthy" | "unknown")
version: string
upstreamRef?: string
/**
 * @maxItems 100
 */
capabilities: string[]
metrics: {
[k: string]: number
}
observedAt: string
}, {
layer: ("core-runtime" | "service-integration" | "data-storage" | "channel-bridge" | "ui-exposure")
moduleId: string
status: ("healthy" | "degraded" | "unhealthy" | "unknown")
version: string
upstreamRef?: string
/**
 * @maxItems 100
 */
capabilities: string[]
metrics: {
[k: string]: number
}
observedAt: string
}, ...({
layer: ("core-runtime" | "service-integration" | "data-storage" | "channel-bridge" | "ui-exposure")
moduleId: string
status: ("healthy" | "degraded" | "unhealthy" | "unknown")
version: string
upstreamRef?: string
/**
 * @maxItems 100
 */
capabilities: string[]
metrics: {
[k: string]: number
}
observedAt: string
})[]]
/**
 * @maxItems 200
 */
events: {
layer?: ("core-runtime" | "service-integration" | "data-storage" | "channel-bridge" | "ui-exposure")
componentId?: string
eventType: string
severity: ("debug" | "info" | "warning" | "error" | "critical")
traceId?: string
metrics: {
[k: string]: number
}
occurredAt: string
}[]
usage?: {
bucketStart: string
bucketSeconds: number
model?: string
inputTokens: number
outputTokens: number
estimatedCostUsd: number
runCount: number
failedRunCount: number
latencySumMs: number
}
}

export interface ResourceReport {
serverId: string
/**
 * @minItems 0
 * @maxItems 500
 */
samples: {
agentId: string
runtimeId: string
deploymentId: string
sequence: number
status: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
agentStorageUsedBytes: number
hostStorageUsedBytes: number
hostStorageLimitBytes: number
osType: string
architecture: string
operatingSystem: string
dockerVersion: string
cpuCount: number
startedAt?: string
uptimeSeconds: number
observedAt: string
/**
 * @minItems 1
 * @maxItems 10
 */
containers: [{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]
}[]
}

export interface Heartbeat {
organizationId: string
userId: string
agentId: string
runtimeId: string
sequence: number
status: ("healthy" | "degraded" | "unhealthy" | "unknown")
runtimeVersion?: string
boundaryVersion?: string
configRevisionId?: string
queueDepth: number
activeRuns: number
failedRuns: number
observedAt: string
/**
 * @minItems 2
 * @maxItems 200
 */
components: [{
layer: ("core-runtime" | "service-integration" | "data-storage" | "channel-bridge" | "ui-exposure")
moduleId: string
status: ("healthy" | "degraded" | "unhealthy" | "unknown")
version: string
upstreamRef?: string
/**
 * @maxItems 100
 */
capabilities: string[]
metrics: {
[k: string]: number
}
observedAt: string
}, {
layer: ("core-runtime" | "service-integration" | "data-storage" | "channel-bridge" | "ui-exposure")
moduleId: string
status: ("healthy" | "degraded" | "unhealthy" | "unknown")
version: string
upstreamRef?: string
/**
 * @maxItems 100
 */
capabilities: string[]
metrics: {
[k: string]: number
}
observedAt: string
}, ...({
layer: ("core-runtime" | "service-integration" | "data-storage" | "channel-bridge" | "ui-exposure")
moduleId: string
status: ("healthy" | "degraded" | "unhealthy" | "unknown")
version: string
upstreamRef?: string
/**
 * @maxItems 100
 */
capabilities: string[]
metrics: {
[k: string]: number
}
observedAt: string
})[]]
/**
 * @maxItems 200
 */
events: {
layer?: ("core-runtime" | "service-integration" | "data-storage" | "channel-bridge" | "ui-exposure")
componentId?: string
eventType: string
severity: ("debug" | "info" | "warning" | "error" | "critical")
traceId?: string
metrics: {
[k: string]: number
}
occurredAt: string
}[]
usage?: {
bucketStart: string
bucketSeconds: number
model?: string
inputTokens: number
outputTokens: number
estimatedCostUsd: number
runCount: number
failedRunCount: number
latencySumMs: number
}
}

export interface ResourceSample {
agentId: string
runtimeId: string
deploymentId: string
sequence: number
status: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
agentStorageUsedBytes: number
hostStorageUsedBytes: number
hostStorageLimitBytes: number
osType: string
architecture: string
operatingSystem: string
dockerVersion: string
cpuCount: number
startedAt?: string
uptimeSeconds: number
observedAt: string
/**
 * @minItems 1
 * @maxItems 10
 */
containers: [{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]|[{
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}, {
role: ("hermes" | "hermes-dashboard" | "runtime-boundary")
status: string
containerId: string
containerName: string
imageRef: string
version?: string
cpuPercent: number
memoryUsedBytes: number
memoryLimitBytes: number
writableBytes: number
startedAt?: string
}]
}

export interface CredentialResolution {
schema_version: "2.0"
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id: string
workspace_id: string
conversation_id?: string
}
authorization: {
id: string
service: string
label: string
authType: ("api_key" | "bearer" | "bearer_token" | "basic" | "oauth_refresh")
endpointUrl?: (string | null)
metadata: {
[k: string]: unknown
}
}
credential: {
secret: string
}
}

export interface AgentCredentialResolutionRequest {
schema_version: "2.0"
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id: string
workspace_id: string
conversation_id?: string
}
authorization_id: string
expected_service: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface MemoryProjection {
schema_version: "2.0"
projection_id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id: string
workspace_id: string
conversation_id?: string
}
memory: {
/**
 * @maxItems 1000
 */
entries: {
note_id: string
content: string
}[]
char_count: number
limit: number
}
user: {
/**
 * @maxItems 1000
 */
entries: {
note_id: string
content: string
}[]
char_count: number
limit: number
}
included_note_ids: string[]
excluded_note_ids: string[]
}

export type ChannelEnvelope = ({
schema_version: "2.0"
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id?: string
}
message_id: string
channel: string
channel_account_id: string
sender: {
identity_id?: string
channel_user_id: string
display_name?: string
roles?: string[]
}
conversation: {
[k: string]: unknown
}
content: {
[k: string]: unknown
}
/**
 * @maxItems 20
 */
attachments?: []|[{
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]|[{
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}, {
[k: string]: unknown
}]
received_at: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
} | {
schema_version: "2.0"
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id: string
}
outbound_id: string
channel: string
conversation: {
[k: string]: unknown
}
content: {
[k: string]: unknown
}
reply_to?: string
delivery_policy?: {
[k: string]: unknown
}
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
} | {
schema_version: "2.0"
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id: string
}
outbound_id: string
status: ("delivered" | "failed" | "retrying" | "rate_limited" | "skipped")
channel_message_id?: string
error?: {
[k: string]: unknown
}
delivered_at?: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
})

export interface ChannelIngress {
schema_version: "2.0"
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id?: string
}
ingress_id: string
binding_id: string
channel: ("web" | "cli" | "feishu" | "wechat" | "qq")
channel_account_id: string
message_id: string
sender: {
channel_user_id: string
display_name?: string
identity_id?: string
}
conversation: {
channel_conversation_id: string
kind: ("direct" | "group" | "thread")
thread_id?: string
title?: string
}
content: {
kind: ("text" | "markdown" | "image" | "audio" | "file" | "event")
text?: string
data?: {
[k: string]: unknown
}
}
/**
 * @maxItems 20
 */
attachments?: []|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]
reply_to_message_id?: string
received_at: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface ChannelIngressAck {
schema_version: "2.0"
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id?: string
}
ingress_id: string
status: ("accepted" | "duplicate" | "rejected")
error_code?: string
acknowledged_at: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface ChannelDeliveryLeaseRequest {
schema_version: "2.0"
worker_id: string
/**
 * @minItems 1
 * @maxItems 5
 */
channels: [("web" | "cli" | "feishu" | "wechat" | "qq")]|[("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq")]|[("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq")]|[("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq")]|[("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq")]
/**
 * @maxItems 100
 */
binding_ids?: string[]
limit: number
lease_seconds: number
requested_at: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface ChannelDeliveryBatch {
schema_version: "2.0"
lease_id: string
worker_id: string
/**
 * @maxItems 100
 */
deliveries: {
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id: string
}
outbound_id: string
binding_id: string
channel: ("web" | "cli" | "feishu" | "wechat" | "qq")
channel_account_id: string
conversation: {
channel_conversation_id: string
kind: ("direct" | "group" | "thread")
thread_id?: string
title?: string
}
content: {
kind: ("text" | "markdown" | "image" | "audio" | "file" | "event")
text?: string
data?: {
[k: string]: unknown
}
}
/**
 * @maxItems 20
 */
attachments?: []|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]|[{
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}, {
attachment_id: string
kind: ("image" | "audio" | "video" | "file")
url?: string
media_type?: string
name?: string
size_bytes?: number
}]
reply_to_message_id?: string
attempt: number
lease_token: string
available_at: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}[]
leased_until: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface ChannelDeliveryReceipt {
schema_version: "2.0"
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id: string
}
outbound_id: string
binding_id: string
lease_token: string
status: ("delivered" | "retryable" | "failed")
attempt: number
channel_message_id?: string
error_code?: string
retry_after_ms?: number
observed_at: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface ChannelHealthReport {
schema_version: "2.0"
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id?: string
}
binding_id: string
channel: ("web" | "cli" | "feishu" | "wechat" | "qq")
worker_id: string
sequence: number
status: ("pending" | "connected" | "degraded" | "error" | "disconnected" | "disabled")
/**
 * @maxItems 20
 */
capabilities: []|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]|[("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket"), ("receive" | "send" | "reply" | "attachments" | "webhook" | "websocket")]
adapter_version?: string
latency_ms?: number
last_inbound_at?: string
last_outbound_at?: string
error_code?: string
observed_at: string
}

export interface ChannelCredentialResolution {
schema_version: "2.0"
binding: {
id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id?: string
}
channel: ("web" | "cli" | "feishu" | "wechat" | "qq")
channel_account_id: string
metadata: {
[k: string]: unknown
}
}
credential: {
values: {
[k: string]: string
}
}
}

export interface ChannelCredentialResolutionRequest {
schema_version: "2.0"
worker_id: string
binding_id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id?: string
}
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface ChannelBindingInventoryRequest {
schema_version: "2.0"
worker_id: string
/**
 * @minItems 1
 * @maxItems 5
 */
channels: [("web" | "cli" | "feishu" | "wechat" | "qq")]|[("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq")]|[("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq")]|[("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq")]|[("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq"), ("web" | "cli" | "feishu" | "wechat" | "qq")]
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface ChannelBindingInventory {
schema_version: "2.0"
worker_id: string
/**
 * @maxItems 10000
 */
bindings: {
id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id: string
conversation_id?: string
}
channel: ("web" | "cli" | "feishu" | "wechat" | "qq")
channel_account_id: string
status: ("pending" | "connected" | "degraded" | "error" | "disconnected" | "disabled" | "unconfigured" | "unavailable")
connection_generation: number
callback_path?: string
updated_at: string
}[]
generated_at: string
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}

export interface IntegrationRequestEnvelope {
schema_version: "2.0"
request: {
request_id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id: string
workspace_id: string
conversation_id?: string
}
integration_id: string
capability: string
input: {
[k: string]: unknown
}
options?: {
[k: string]: unknown
}
timeout_ms: number
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
}
}

export interface IntegrationResult {
schema_version: "2.0"
request_id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id: string
workspace_id: string
conversation_id?: string
}
integration_id: string
status: ("completed" | "partial" | "failed" | "skipped")
output?: {
[k: string]: unknown
}
/**
 * @maxItems 100
 */
artifacts?: {
schema_version: "1.0"
artifact_id: string
owner_scope: {
organization_id: string
user_id: string
agent_id: string
runtime_id?: string
workspace_id?: string
conversation_id?: string
}
kind: ("file" | "document" | "image" | "audio" | "video" | "dataset" | "archive" | "other")
media_type: string
size_bytes: number
sha256: string
created_at: string
metadata?: {
[k: string]: string
}
}[]
usage?: {
[k: string]: unknown
}
error?: {
[k: string]: unknown
}
trace: {
correlation_id: string
parent_id?: string
span_id?: string
}
completed_at?: string
}

export type ControlAction = ControlCommand["action"];

export type RuntimeOperation = RuntimeOperationEnvelope["operation"];

export type RuntimeStreamOperation = RuntimeStreamEnvelope["operation"];

export type ModuleLayer = RuntimeHeartbeat["components"][number]["layer"];

export type ModuleStatus = RuntimeHeartbeat["status"];
