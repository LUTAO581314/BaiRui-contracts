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

export interface RuntimeRequestEnvelope {
request: {
request_id: string
request_type: ("message" | "task" | "approval_result" | "tool_result" | "system_event")
tenant: {
organization_id: string
agent_id: string
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
operation: ("health.detailed" | "discovery.models" | "discovery.capabilities" | "discovery.skills" | "discovery.toolsets" | "sessions.list" | "sessions.create" | "sessions.get" | "sessions.update" | "sessions.delete" | "sessions.messages" | "sessions.fork" | "sessions.chat" | "runs.create" | "runs.get" | "runs.approve" | "runs.stop" | "jobs.list" | "jobs.create" | "jobs.get" | "jobs.update" | "jobs.delete" | "jobs.pause" | "jobs.resume" | "jobs.run" | "memory.snapshot" | "memory.apply")
tenant: {
organization_id: string
agent_id: string
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
operation: ("sessions.chat.stream" | "runs.events")
tenant: {
organization_id: string
agent_id: string
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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
role: ("hermes" | "runtime-boundary")
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

export interface CredentialResolution {
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

export interface MemoryProjection {
schema_version: "1.0"
projection_id: string
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
message_id: string
channel: string
channel_account_id: string
sender: {
identity_id?: string
channel_user_id: string
display_name?: string
tenant_hint?: string
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
schema_version: "1.0"
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
schema_version: "1.0"
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
schema_version: "1.0"
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
schema_version: "1.0"
lease_id: string
worker_id: string
/**
 * @maxItems 100
 */
deliveries: {
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
schema_version: "1.0"
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
schema_version: "1.0"
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
binding: {
id: string
organization_id: string
user_id: string
agent_id: string
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

export interface ChannelBindingInventoryRequest {
schema_version: "1.0"
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
schema_version: "1.0"
worker_id: string
/**
 * @maxItems 10000
 */
bindings: {
id: string
organization_id: string
user_id: string
agent_id: string
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
request: {
request_id: string
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
request_id: string
integration_id: string
status: ("completed" | "partial" | "failed" | "skipped")
output?: {
[k: string]: unknown
}
/**
 * @maxItems 100
 */
artifacts?: {
[k: string]: unknown
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
