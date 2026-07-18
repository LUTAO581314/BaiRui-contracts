import {
  ARTIFACT_KINDS,
  CHANNEL_CONNECTION_STATUSES,
  CHANNEL_DELIVERY_STATUSES,
  CHANNEL_PROTOCOL_VERSION,
  CHANNELS,
  CONTROL_ACTIONS,
  CONTROL_ACTION_ARGUMENTS,
  CONTROL_APPROVAL_ACTIONS,
  DATA_PROTOCOL_VERSION,
  MODULE_LAYERS,
  MODULE_STATUSES,
  RUNTIME_OPERATIONS,
  RUNTIME_PROTOCOL_VERSION,
  RUNTIME_STREAM_OPERATIONS
} from "./protocol.mjs";

const draft = "https://json-schema.org/draft/2020-12/schema";
const idPattern = "^[A-Za-z0-9][A-Za-z0-9._:/-]{0,255}$";
const identifier = { type: "string", pattern: idPattern };
const timestamp = { type: "string", format: "date-time" };
const stringMap = { type: "object", additionalProperties: { type: "string" } };
const flexibleObject = { type: "object", additionalProperties: true };
const numericMap = { type: "object", additionalProperties: { type: "number" } };
const identifierArray = { type: "array", minItems: 1, maxItems: 100, uniqueItems: true, items: identifier };
const argumentArrayFields = new Set(["probe_ids"]);

function ownerScope(requiredContext = []) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["organization_id", "user_id", "agent_id", ...requiredContext],
    properties: {
      organization_id: identifier,
      user_id: identifier,
      agent_id: identifier,
      runtime_id: identifier,
      workspace_id: identifier,
      conversation_id: identifier
    },
    dependentRequired: { conversation_id: ["workspace_id"] }
  };
}

const trace = {
  type: "object",
  additionalProperties: false,
  required: ["correlation_id"],
  properties: { correlation_id: identifier, parent_id: identifier, span_id: identifier }
};

const channelConversation = {
  type: "object",
  additionalProperties: false,
  required: ["channel_conversation_id", "kind"],
  properties: {
    channel_conversation_id: identifier,
    kind: { enum: ["direct", "group", "thread"] },
    thread_id: identifier,
    title: { type: "string", maxLength: 200 }
  }
};

const channelContent = {
  type: "object",
  additionalProperties: false,
  required: ["kind"],
  properties: {
    kind: { enum: ["text", "markdown", "image", "audio", "file", "event"] },
    text: { type: "string", maxLength: 100000 },
    data: flexibleObject
  }
};

const channelAttachment = {
  type: "object",
  additionalProperties: false,
  required: ["attachment_id", "kind"],
  properties: {
    attachment_id: identifier,
    kind: { enum: ["image", "audio", "video", "file"] },
    url: { type: "string", format: "uri", maxLength: 4096 },
    media_type: { type: "string", maxLength: 200 },
    name: { type: "string", maxLength: 500 },
    size_bytes: { type: "integer", minimum: 0 }
  }
};

const channelSender = {
  type: "object",
  additionalProperties: false,
  required: ["channel_user_id"],
  properties: {
    channel_user_id: identifier,
    display_name: { type: "string", maxLength: 200 },
    identity_id: identifier
  }
};

function document(name, body) {
  return { $schema: draft, $id: `https://contracts.bairui.ai/v2/${name}.schema.json`, ...body };
}

export const agentOwnerScopeSchema = document("agent-owner-scope", {
  title: "AgentOwnerScope",
  ...ownerScope()
});

const artifactPointer = {
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "artifact_id", "owner_scope", "kind", "media_type", "size_bytes", "sha256", "created_at"],
  properties: {
    schema_version: { const: "1.0" },
    artifact_id: identifier,
    owner_scope: ownerScope(),
    kind: { enum: ARTIFACT_KINDS },
    media_type: { type: "string", minLength: 1, maxLength: 200 },
    size_bytes: { type: "integer", minimum: 0 },
    sha256: { type: "string", pattern: "^[a-f0-9]{64}$" },
    created_at: timestamp,
    metadata: stringMap
  }
};

export const artifactPointerSchema = document("artifact-pointer", {
  title: "ArtifactPointer",
  ...artifactPointer
});

function runtimePrincipalProperties() {
  return {
    owner_scope: ownerScope(["runtime_id", "workspace_id"]),
    actor: {
      type: "object",
      additionalProperties: false,
      required: ["user_id"],
      properties: {
        user_id: identifier,
        roles: { type: "array", maxItems: 32, uniqueItems: true, items: identifier }
      }
    },
    channel_context: flexibleObject,
    trace,
    created_at: timestamp
  };
}

const actionConditions = Object.entries(CONTROL_ACTION_ARGUMENTS).map(([action, definition]) => ({
  if: { properties: { action: { const: action } }, required: ["action"] },
  then: {
    properties: {
      arguments: {
        type: "object",
        additionalProperties: false,
        required: definition.required,
        properties: Object.fromEntries([...definition.required, ...definition.optional].map((field) => [
          field,
          argumentArrayFields.has(field) ? identifierArray : identifier
        ]))
      }
    }
  }
}));

export const controlCommandSchema = document("control-command", {
  title: "ControlCommand",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "command_id", "idempotency_key", "deployment_id", "action", "target", "arguments", "expected_observation_version", "expires_at", "created_at"],
  properties: {
    schema_version: { const: "1.0" },
    command_id: identifier,
    idempotency_key: identifier,
    deployment_id: identifier,
    action: { enum: CONTROL_ACTIONS },
    target: {
      type: "object",
      additionalProperties: false,
      required: ["module_id"],
      properties: { module_id: identifier, instance_id: identifier }
    },
    arguments: { type: "object" },
    approval_id: identifier,
    expected_observation_version: { type: "integer", minimum: 0 },
    not_before: timestamp,
    expires_at: timestamp,
    created_at: timestamp
  },
  allOf: [
    ...actionConditions,
    {
      if: { properties: { action: { enum: CONTROL_APPROVAL_ACTIONS } }, required: ["action"] },
      then: { required: ["approval_id"], properties: { approval_id: identifier } }
    }
  ]
});

const runtimeRequest = {
  type: "object",
  additionalProperties: false,
  required: ["request_id", "request_type", "owner_scope", "actor", "input", "runtime_config_ref", "trace", "created_at"],
  properties: {
    request_id: identifier,
    request_type: { enum: ["message", "task", "approval_result", "tool_result", "system_event"] },
    ...runtimePrincipalProperties(),
    input: flexibleObject,
    runtime_config_ref: identifier,
    capability_hints: { type: "array", maxItems: 100, uniqueItems: true, items: identifier }
  }
};

const runtimeConfig = {
  type: "object",
  additionalProperties: false,
  required: ["config_id", "model_policy", "tool_policy", "memory_policy", "approval_policy", "storage_policy", "integration_policy"],
  properties: {
    config_id: identifier,
    model_policy: flexibleObject,
    tool_policy: flexibleObject,
    memory_policy: flexibleObject,
    approval_policy: flexibleObject,
    storage_policy: flexibleObject,
    integration_policy: flexibleObject,
    channel_policy: flexibleObject
  }
};

export const runtimeRequestEnvelopeSchema = document("runtime-request-envelope", {
  title: "RuntimeRequestEnvelope",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "request", "config"],
  properties: { schema_version: { const: RUNTIME_PROTOCOL_VERSION }, request: runtimeRequest, config: runtimeConfig }
});

function operationSchema(name, operations) {
  return document(name, {
    title: name === "runtime-operation-envelope" ? "RuntimeOperationEnvelope" : "RuntimeStreamEnvelope",
    type: "object",
    additionalProperties: false,
    required: ["schema_version", "operation", "owner_scope", "actor", "input", "trace", "created_at"],
    properties: {
      schema_version: { const: RUNTIME_PROTOCOL_VERSION },
      operation: { enum: operations },
      ...runtimePrincipalProperties(),
      input: flexibleObject
    }
  });
}

export const runtimeOperationEnvelopeSchema = operationSchema("runtime-operation-envelope", RUNTIME_OPERATIONS);
export const runtimeStreamEnvelopeSchema = operationSchema("runtime-stream-envelope", RUNTIME_STREAM_OPERATIONS);

const sceneOperation = {
  type: "object",
  additionalProperties: false,
  required: ["op", "path"],
  properties: {
    op: { enum: ["add", "replace", "remove"] },
    path: { type: "string", pattern: "^/[A-Za-z0-9_./-]{1,512}$" },
    value: {}
  }
};

export const sceneSnapshotSchema = document("scene-snapshot", {
  title: "SceneSnapshot",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "scene_id", "owner_scope", "revision", "view", "generated_at", "trace"],
  properties: {
    schema_version: { const: DATA_PROTOCOL_VERSION },
    scene_id: identifier,
    owner_scope: ownerScope(["workspace_id"]),
    revision: { type: "integer", minimum: 0 },
    view: flexibleObject,
    generated_at: timestamp,
    trace
  }
});

export const scenePatchSchema = document("scene-patch", {
  title: "ScenePatch",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "scene_id", "owner_scope", "base_revision", "revision", "operations", "generated_at", "trace"],
  properties: {
    schema_version: { const: DATA_PROTOCOL_VERSION },
    scene_id: identifier,
    owner_scope: ownerScope(["workspace_id"]),
    base_revision: { type: "integer", minimum: 0 },
    revision: { type: "integer", minimum: 1 },
    operations: { type: "array", minItems: 1, maxItems: 200, items: sceneOperation },
    generated_at: timestamp,
    trace
  }
});

export const sceneIntentSchema = document("scene-intent", {
  title: "SceneIntent",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "scene_id", "owner_scope", "intent_id", "action", "payload", "created_at", "trace"],
  properties: {
    schema_version: { const: DATA_PROTOCOL_VERSION },
    scene_id: identifier,
    owner_scope: ownerScope(["workspace_id"]),
    intent_id: identifier,
    action: { enum: ["navigate", "command", "refresh", "resync"] },
    payload: flexibleObject,
    created_at: timestamp,
    trace
  }
});

const heartbeatComponent = {
  type: "object",
  additionalProperties: false,
  required: ["layer", "moduleId", "status", "version", "capabilities", "metrics", "observedAt"],
  properties: {
    layer: { enum: MODULE_LAYERS },
    moduleId: identifier,
    status: { enum: MODULE_STATUSES },
    version: { type: "string", minLength: 1, maxLength: 200 },
    upstreamRef: { type: "string", maxLength: 200 },
    capabilities: { type: "array", maxItems: 100, uniqueItems: true, items: identifier },
    metrics: numericMap,
    observedAt: timestamp
  }
};

export const runtimeHeartbeatSchema = document("runtime-heartbeat", {
  title: "RuntimeHeartbeat",
  type: "object",
  additionalProperties: false,
  required: ["organizationId", "userId", "agentId", "runtimeId", "sequence", "status", "queueDepth", "activeRuns", "failedRuns", "observedAt", "components", "events"],
  properties: {
    organizationId: identifier,
    userId: identifier,
    agentId: identifier,
    runtimeId: identifier,
    sequence: { type: "integer", minimum: 1 },
    status: { enum: MODULE_STATUSES },
    runtimeVersion: { type: "string", maxLength: 200 },
    boundaryVersion: { type: "string", maxLength: 200 },
    configRevisionId: identifier,
    queueDepth: { type: "integer", minimum: 0 },
    activeRuns: { type: "integer", minimum: 0 },
    failedRuns: { type: "integer", minimum: 0 },
    observedAt: timestamp,
    components: { type: "array", minItems: 2, maxItems: 200, items: heartbeatComponent },
    events: {
      type: "array",
      maxItems: 200,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["eventType", "severity", "metrics", "occurredAt"],
        properties: {
          layer: { enum: MODULE_LAYERS },
          componentId: identifier,
          eventType: identifier,
          severity: { enum: ["debug", "info", "warning", "error", "critical"] },
          traceId: identifier,
          metrics: numericMap,
          occurredAt: timestamp
        }
      }
    },
    usage: {
      type: "object",
      additionalProperties: false,
      required: ["bucketStart", "bucketSeconds", "inputTokens", "outputTokens", "estimatedCostUsd", "runCount", "failedRunCount", "latencySumMs"],
      properties: {
        bucketStart: timestamp,
        bucketSeconds: { type: "integer", minimum: 1 },
        model: { type: "string", maxLength: 200 },
        inputTokens: { type: "integer", minimum: 0 },
        outputTokens: { type: "integer", minimum: 0 },
        estimatedCostUsd: { type: "number", minimum: 0 },
        runCount: { type: "integer", minimum: 0 },
        failedRunCount: { type: "integer", minimum: 0 },
        latencySumMs: { type: "number", minimum: 0 }
      }
    }
  }
});

const resourceContainer = {
  type: "object",
  additionalProperties: false,
  required: ["role", "status", "containerId", "containerName", "imageRef", "cpuPercent", "memoryUsedBytes", "memoryLimitBytes", "writableBytes"],
  properties: {
    role: { enum: ["hermes", "hermes-dashboard", "runtime-boundary"] },
    status: { type: "string", minLength: 1, maxLength: 64 },
    containerId: { type: "string", minLength: 1, maxLength: 128 },
    containerName: { type: "string", minLength: 1, maxLength: 200 },
    imageRef: { type: "string", minLength: 1, maxLength: 500 },
    version: { type: "string", maxLength: 200 },
    cpuPercent: { type: "number", minimum: 0 },
    memoryUsedBytes: { type: "integer", minimum: 0 },
    memoryLimitBytes: { type: "integer", minimum: 0 },
    writableBytes: { type: "integer", minimum: 0 },
    startedAt: timestamp
  }
};

export const resourceReportSchema = document("resource-report", {
  title: "ResourceReport",
  type: "object",
  additionalProperties: false,
  required: ["serverId", "samples"],
  properties: {
    serverId: identifier,
    samples: {
      type: "array",
      minItems: 0,
      maxItems: 500,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["agentId", "runtimeId", "deploymentId", "sequence", "status", "cpuPercent", "memoryUsedBytes", "memoryLimitBytes", "agentStorageUsedBytes", "hostStorageUsedBytes", "hostStorageLimitBytes", "osType", "architecture", "operatingSystem", "dockerVersion", "cpuCount", "uptimeSeconds", "observedAt", "containers"],
        properties: {
          agentId: identifier,
          runtimeId: identifier,
          deploymentId: identifier,
          sequence: { type: "integer", minimum: 0 },
          status: { type: "string", minLength: 1, maxLength: 64 },
          cpuPercent: { type: "number", minimum: 0 },
          memoryUsedBytes: { type: "integer", minimum: 0 },
          memoryLimitBytes: { type: "integer", minimum: 0 },
          agentStorageUsedBytes: { type: "integer", minimum: 0 },
          hostStorageUsedBytes: { type: "integer", minimum: 0 },
          hostStorageLimitBytes: { type: "integer", minimum: 0 },
          osType: { type: "string", minLength: 1, maxLength: 64 },
          architecture: { type: "string", minLength: 1, maxLength: 64 },
          operatingSystem: { type: "string", minLength: 1, maxLength: 200 },
          dockerVersion: { type: "string", minLength: 1, maxLength: 200 },
          cpuCount: { type: "integer", minimum: 1 },
          startedAt: timestamp,
          uptimeSeconds: { type: "integer", minimum: 0 },
          observedAt: timestamp,
          containers: { type: "array", minItems: 1, maxItems: 10, items: resourceContainer }
        }
      }
    }
  }
});

export const credentialResolutionSchema = document("credential-resolution", {
  title: "CredentialResolution",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "owner_scope", "authorization", "credential"],
  properties: {
    schema_version: { const: DATA_PROTOCOL_VERSION },
    owner_scope: ownerScope(["runtime_id", "workspace_id"]),
    authorization: {
      type: "object",
      additionalProperties: false,
      required: ["id", "service", "label", "authType", "metadata"],
      properties: {
        id: identifier,
        service: identifier,
        label: { type: "string", minLength: 1, maxLength: 200 },
        authType: { enum: ["api_key", "bearer", "bearer_token", "basic", "oauth_refresh"] },
        endpointUrl: { type: ["string", "null"], format: "uri" },
        metadata: flexibleObject
      }
    },
    credential: {
      type: "object",
      additionalProperties: false,
      required: ["secret"],
      properties: { secret: { type: "string", minLength: 1, maxLength: 65536 } }
    }
  }
});

export const credentialResolutionRequestSchema = document("credential-resolution-request", {
  title: "AgentCredentialResolutionRequest",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "owner_scope", "authorization_id", "expected_service", "trace"],
  properties: {
    schema_version: { const: DATA_PROTOCOL_VERSION },
    owner_scope: ownerScope(["runtime_id", "workspace_id"]),
    authorization_id: identifier,
    expected_service: identifier,
    trace
  }
});

const projectionTarget = {
  type: "object",
  additionalProperties: false,
  required: ["entries", "char_count", "limit"],
  properties: {
    entries: {
      type: "array",
      maxItems: 1000,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["note_id", "content"],
        properties: { note_id: identifier, content: { type: "string", minLength: 1, maxLength: 10000 } }
      }
    },
    char_count: { type: "integer", minimum: 0 },
    limit: { type: "integer", minimum: 1 }
  }
};

export const memoryProjectionSchema = document("memory-projection", {
  title: "MemoryProjection",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "projection_id", "owner_scope", "memory", "user", "included_note_ids", "excluded_note_ids"],
  properties: {
    schema_version: { const: DATA_PROTOCOL_VERSION },
    projection_id: identifier,
    owner_scope: ownerScope(["runtime_id", "workspace_id"]),
    memory: projectionTarget,
    user: projectionTarget,
    included_note_ids: { type: "array", uniqueItems: true, items: identifier },
    excluded_note_ids: { type: "array", uniqueItems: true, items: identifier }
  }
});

export const channelEnvelopeSchema = document("channel-envelope", {
  title: "ChannelEnvelope",
  oneOf: [
    {
      type: "object",
      additionalProperties: false,
      required: ["schema_version", "owner_scope", "message_id", "channel", "channel_account_id", "sender", "conversation", "content", "received_at", "trace"],
      properties: {
        schema_version: { const: CHANNEL_PROTOCOL_VERSION },
        owner_scope: ownerScope(["workspace_id"]),
        message_id: identifier,
        channel: identifier,
        channel_account_id: identifier,
        sender: {
          type: "object",
          additionalProperties: false,
          required: ["channel_user_id"],
          properties: { identity_id: identifier, channel_user_id: identifier, display_name: { type: "string", maxLength: 200 }, roles: { type: "array", uniqueItems: true, items: identifier } }
        },
        conversation: flexibleObject,
        content: flexibleObject,
        attachments: { type: "array", maxItems: 20, items: flexibleObject },
        received_at: timestamp,
        trace
      }
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["schema_version", "owner_scope", "outbound_id", "channel", "conversation", "content", "trace"],
      properties: { schema_version: { const: CHANNEL_PROTOCOL_VERSION }, owner_scope: ownerScope(["workspace_id", "conversation_id"]), outbound_id: identifier, channel: identifier, conversation: flexibleObject, content: flexibleObject, reply_to: identifier, delivery_policy: flexibleObject, trace }
    },
    {
      type: "object",
      additionalProperties: false,
      required: ["schema_version", "owner_scope", "outbound_id", "status", "trace"],
      properties: { schema_version: { const: CHANNEL_PROTOCOL_VERSION }, owner_scope: ownerScope(["workspace_id", "conversation_id"]), outbound_id: identifier, status: { enum: ["delivered", "failed", "retrying", "rate_limited", "skipped"] }, channel_message_id: identifier, error: flexibleObject, delivered_at: timestamp, trace }
    }
  ]
});

export const channelIngressSchema = document("channel-ingress", {
  title: "ChannelIngress",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "owner_scope", "ingress_id", "binding_id", "channel", "channel_account_id", "message_id", "sender", "conversation", "content", "received_at", "trace"],
  properties: {
    schema_version: { const: CHANNEL_PROTOCOL_VERSION },
    owner_scope: ownerScope(["workspace_id"]),
    ingress_id: identifier,
    binding_id: identifier,
    channel: { enum: CHANNELS },
    channel_account_id: identifier,
    message_id: identifier,
    sender: channelSender,
    conversation: channelConversation,
    content: channelContent,
    attachments: { type: "array", maxItems: 20, items: channelAttachment },
    reply_to_message_id: identifier,
    received_at: timestamp,
    trace
  }
});

export const channelIngressAckSchema = document("channel-ingress-ack", {
  title: "ChannelIngressAck",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "owner_scope", "ingress_id", "status", "acknowledged_at", "trace"],
  properties: {
    schema_version: { const: CHANNEL_PROTOCOL_VERSION },
    owner_scope: ownerScope(["workspace_id"]),
    ingress_id: identifier,
    status: { enum: ["accepted", "duplicate", "rejected"] },
    error_code: identifier,
    acknowledged_at: timestamp,
    trace
  }
});

const channelDelivery = {
  type: "object",
  additionalProperties: false,
  required: ["owner_scope", "outbound_id", "binding_id", "channel", "channel_account_id", "conversation", "content", "attempt", "lease_token", "available_at", "trace"],
  properties: {
    owner_scope: ownerScope(["workspace_id", "conversation_id"]),
    outbound_id: identifier,
    binding_id: identifier,
    channel: { enum: CHANNELS },
    channel_account_id: identifier,
    conversation: channelConversation,
    content: channelContent,
    attachments: { type: "array", maxItems: 20, items: channelAttachment },
    reply_to_message_id: identifier,
    attempt: { type: "integer", minimum: 1 },
    lease_token: identifier,
    available_at: timestamp,
    trace
  }
};

export const channelDeliveryLeaseRequestSchema = document("channel-delivery-lease-request", {
  title: "ChannelDeliveryLeaseRequest",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "worker_id", "channels", "limit", "lease_seconds", "requested_at", "trace"],
  properties: {
    schema_version: { const: CHANNEL_PROTOCOL_VERSION },
    worker_id: identifier,
    channels: { type: "array", minItems: 1, maxItems: CHANNELS.length, uniqueItems: true, items: { enum: CHANNELS } },
    binding_ids: { type: "array", maxItems: 100, uniqueItems: true, items: identifier },
    limit: { type: "integer", minimum: 1, maximum: 100 },
    lease_seconds: { type: "integer", minimum: 5, maximum: 300 },
    requested_at: timestamp,
    trace
  }
});

export const channelDeliveryBatchSchema = document("channel-delivery-batch", {
  title: "ChannelDeliveryBatch",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "lease_id", "worker_id", "deliveries", "leased_until", "trace"],
  properties: {
    schema_version: { const: CHANNEL_PROTOCOL_VERSION },
    lease_id: identifier,
    worker_id: identifier,
    deliveries: { type: "array", maxItems: 100, items: channelDelivery },
    leased_until: timestamp,
    trace
  }
});

export const channelDeliveryReceiptSchema = document("channel-delivery-receipt", {
  title: "ChannelDeliveryReceipt",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "owner_scope", "outbound_id", "binding_id", "lease_token", "status", "attempt", "observed_at", "trace"],
  properties: {
    schema_version: { const: CHANNEL_PROTOCOL_VERSION },
    owner_scope: ownerScope(["workspace_id", "conversation_id"]),
    outbound_id: identifier,
    binding_id: identifier,
    lease_token: identifier,
    status: { enum: CHANNEL_DELIVERY_STATUSES },
    attempt: { type: "integer", minimum: 1 },
    channel_message_id: identifier,
    error_code: identifier,
    retry_after_ms: { type: "integer", minimum: 0, maximum: 86400000 },
    observed_at: timestamp,
    trace
  }
});

export const channelHealthReportSchema = document("channel-health-report", {
  title: "ChannelHealthReport",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "owner_scope", "binding_id", "channel", "worker_id", "sequence", "status", "capabilities", "observed_at"],
  properties: {
    schema_version: { const: CHANNEL_PROTOCOL_VERSION },
    owner_scope: ownerScope(["workspace_id"]),
    binding_id: identifier,
    channel: { enum: CHANNELS },
    worker_id: identifier,
    sequence: { type: "integer", minimum: 1 },
    status: { enum: CHANNEL_CONNECTION_STATUSES },
    capabilities: { type: "array", maxItems: 20, uniqueItems: true, items: { enum: ["receive", "send", "reply", "attachments", "webhook", "websocket"] } },
    adapter_version: { type: "string", minLength: 1, maxLength: 200 },
    latency_ms: { type: "number", minimum: 0 },
    last_inbound_at: timestamp,
    last_outbound_at: timestamp,
    error_code: identifier,
    observed_at: timestamp
  }
});

export const channelCredentialResolutionSchema = document("channel-credential-resolution", {
  title: "ChannelCredentialResolution",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "binding", "credential"],
  properties: {
    schema_version: { const: CHANNEL_PROTOCOL_VERSION },
    binding: {
      type: "object",
      additionalProperties: false,
      required: ["id", "owner_scope", "channel", "channel_account_id", "metadata"],
      properties: {
        id: identifier,
        owner_scope: ownerScope(["workspace_id"]),
        channel: { enum: CHANNELS },
        channel_account_id: identifier,
        metadata: flexibleObject
      }
    },
    credential: {
      type: "object",
      additionalProperties: false,
      required: ["values"],
      properties: {
        values: {
          type: "object",
          minProperties: 1,
          maxProperties: 32,
          additionalProperties: { type: "string", minLength: 1, maxLength: 65536 }
        }
      }
    }
  }
});

export const channelCredentialResolutionRequestSchema = document("channel-credential-resolution-request", {
  title: "ChannelCredentialResolutionRequest",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "worker_id", "binding_id", "owner_scope", "trace"],
  properties: {
    schema_version: { const: CHANNEL_PROTOCOL_VERSION },
    worker_id: identifier,
    binding_id: identifier,
    owner_scope: ownerScope(["workspace_id"]),
    trace
  }
});

export const channelBindingInventoryRequestSchema = document("channel-binding-inventory-request", {
  title: "ChannelBindingInventoryRequest",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "worker_id", "channels", "trace"],
  properties: {
    schema_version: { const: CHANNEL_PROTOCOL_VERSION },
    worker_id: identifier,
    channels: { type: "array", minItems: 1, maxItems: CHANNELS.length, uniqueItems: true, items: { enum: CHANNELS } },
    trace
  }
});

export const channelBindingInventorySchema = document("channel-binding-inventory", {
  title: "ChannelBindingInventory",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "worker_id", "bindings", "generated_at", "trace"],
  properties: {
    schema_version: { const: CHANNEL_PROTOCOL_VERSION },
    worker_id: identifier,
    bindings: {
      type: "array",
      maxItems: 10000,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "owner_scope", "channel", "channel_account_id", "status", "connection_generation", "updated_at"],
        properties: {
          id: identifier,
          owner_scope: ownerScope(["workspace_id"]),
          channel: { enum: CHANNELS },
          channel_account_id: identifier,
          status: { enum: [...CHANNEL_CONNECTION_STATUSES, "unconfigured", "unavailable"] },
          connection_generation: { type: "integer", minimum: 0 },
          callback_path: { type: "string", pattern: "^/", maxLength: 1000 },
          updated_at: timestamp
        }
      }
    },
    generated_at: timestamp,
    trace
  }
});

const integrationRequest = {
  type: "object",
  additionalProperties: false,
  required: ["request_id", "owner_scope", "integration_id", "capability", "input", "timeout_ms", "trace"],
  properties: { request_id: identifier, owner_scope: ownerScope(["runtime_id", "workspace_id"]), integration_id: identifier, capability: identifier, input: flexibleObject, options: flexibleObject, timeout_ms: { type: "integer", minimum: 100, maximum: 900000 }, trace }
};

export const integrationRequestEnvelopeSchema = document("integration-request-envelope", {
  title: "IntegrationRequestEnvelope",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "request"],
  properties: { schema_version: { const: DATA_PROTOCOL_VERSION }, request: integrationRequest }
});

export const integrationResultSchema = document("integration-result", {
  title: "IntegrationResult",
  type: "object",
  additionalProperties: false,
  required: ["schema_version", "request_id", "owner_scope", "integration_id", "status", "trace"],
  properties: {
    schema_version: { const: DATA_PROTOCOL_VERSION },
    request_id: identifier,
    owner_scope: ownerScope(["runtime_id", "workspace_id"]),
    integration_id: identifier,
    status: { enum: ["completed", "partial", "failed", "skipped"] },
    output: flexibleObject,
    artifacts: { type: "array", maxItems: 100, items: artifactPointer },
    usage: flexibleObject,
    error: flexibleObject,
    trace,
    completed_at: timestamp
  }
});

export const SCHEMAS = Object.freeze({
  "agent-owner-scope": agentOwnerScopeSchema,
  "artifact-pointer": artifactPointerSchema,
  "control-command": controlCommandSchema,
  "runtime-request-envelope": runtimeRequestEnvelopeSchema,
  "runtime-operation-envelope": runtimeOperationEnvelopeSchema,
  "runtime-stream-envelope": runtimeStreamEnvelopeSchema,
  "scene-snapshot": sceneSnapshotSchema,
  "scene-patch": scenePatchSchema,
  "scene-intent": sceneIntentSchema,
  "runtime-heartbeat": runtimeHeartbeatSchema,
  "resource-report": resourceReportSchema,
  "credential-resolution": credentialResolutionSchema,
  "credential-resolution-request": credentialResolutionRequestSchema,
  "memory-projection": memoryProjectionSchema,
  "channel-envelope": channelEnvelopeSchema,
  "channel-ingress": channelIngressSchema,
  "channel-ingress-ack": channelIngressAckSchema,
  "channel-delivery-lease-request": channelDeliveryLeaseRequestSchema,
  "channel-delivery-batch": channelDeliveryBatchSchema,
  "channel-delivery-receipt": channelDeliveryReceiptSchema,
  "channel-health-report": channelHealthReportSchema,
  "channel-credential-resolution": channelCredentialResolutionSchema,
  "channel-credential-resolution-request": channelCredentialResolutionRequestSchema,
  "channel-binding-inventory-request": channelBindingInventoryRequestSchema,
  "channel-binding-inventory": channelBindingInventorySchema,
  "integration-request-envelope": integrationRequestEnvelopeSchema,
  "integration-result": integrationResultSchema
});

export const OPENAPI_PATHS = Object.freeze({
  "/v1/runtime/requests": ["post", "runtime-request-envelope"],
  "/v1/runtime/operations": ["post", "runtime-operation-envelope"],
  "/v1/runtime/streams": ["post", "runtime-stream-envelope"],
  "/v1/integrations/requests": ["post", "integration-request-envelope"],
  "/api/internal/channels/ingress": ["post", "channel-ingress", "channel-ingress-ack", 202],
  "/api/internal/channels/deliveries/lease": ["post", "channel-delivery-lease-request", "channel-delivery-batch", 200],
  "/api/internal/channels/delivery-receipts": ["post", "channel-delivery-receipt", null, 202],
  "/api/internal/channels/health": ["post", "channel-health-report", null, 202],
  "/api/internal/channels/bindings": ["post", "channel-binding-inventory-request", "channel-binding-inventory", 200],
  "/api/internal/control-plane/heartbeats": ["post", "runtime-heartbeat"],
  "/api/internal/control-plane/resources": ["post", "resource-report"]
});

export { idPattern, identifier, timestamp, stringMap };
