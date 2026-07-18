# Changelog

## 2.3.0-rc.2

- Reject `approval_id` on canonical non-approval commands and on leased
  non-approval commands while preserving legacy read compatibility.
- Require the signature, timestamp, and nonce transport headers on every
  OpenAPI control-plane mutation.
- Add negative coverage for opaque `sr_` secret references, signature
  chronology, mutation-field completeness, and approval/action binding.
- Record the C00-03 consumer migration matrix without introducing aliases for
  legacy desired-state, observation, lease, receipt, or error-code fields.

## 2.3.0-rc.1

- Add the C00-02 control contract surfaces for `DesiredState`, `Observation`,
  `CommandEvent`, `Approval`, `ReleaseManifest`, `ControlCommandEnvelope`, and
  signed lease request, lease grant, receipt, and control-error envelopes.
- Require new control mutations to carry organization, user, agent, server,
  request, correlation, idempotency, creation time, revision, sequence, and a
  verifiable signature descriptor. Apart from non-secret signature material,
  payloads contain references and evidence identifiers only; configuration
  documents and secret values are not valid control fields.
- Add allow-listed event states, safe control error codes, redacted observation
  records, immutable release artifact references, and lease/receipt binding
  checks.
- Quarantine `config.apply-user` from canonical command envelopes while keeping
  it readable through the legacy `ControlCommand@1.0` compatibility surface.
- Separate desired-revision status from its operational target, require
  observation freshness/source identity, and bind command events to their
  deployment, source, receive time, and state-specific event type.
- Replace Server Agent receipt `succeeded` with `completion_candidate`; only an
  Authority-generated `command.verified` event may represent final success.
- Bind envelope idempotency, approval scope and separation of duties, command
  placement, lease expiry, release compatibility, and signature chronology in
  the runtime validators.
- Generate declarations for the package's validator and protocol exports and
  preserve concrete command/leased-command types instead of `unknown` maps.
- Describe timestamp, nonce, and signature transport headers in OpenAPI and
  return `ControlError` for Control Plane error responses.
- Preserve the accepted `ControlCommand` 1.0, `RuntimeHeartbeat` 2.0, and
  `ResourceReport` 2.0 payloads. The `Heartbeat` schema/validator is a
  compatibility alias for the existing heartbeat contract; `ResourceSample` is
  the existing sample item shape. Legacy `ControlCommand` remains readable as
  the unsigned 1.0 payload; new signed envelopes accept only its canonical safe
  action subset and do not translate quarantined actions.
- Compatibility window: 2.2.x consumers may continue reading the legacy
  contracts throughout the 2.3.x line; removal requires a later major-version
  decision and changelog entry. New producers should dual-read legacy payloads
  and emit the 2.3 control envelopes only after the consumer advertises control
  schema 1.0 support. No implicit field conversion is defined.
- Control error codes include `invalid_schema_version`, `unknown_field`,
  `raw_secret_not_allowed`, `invalid_signature`, `replay_detected`,
  `idempotency_conflict`, `revision_conflict`, `sequence_conflict`,
  `approval_not_valid`, `lease_expired`, `receipt_conflict`, and
  `release_not_immutable`.

## 2.2.1

- Align the Runtime operation contract with the complete Hermes management
  operation registry, including memory provider OAuth, MCP catalog install,
  profile setup commands, and debug share.

## 2.1.0

- Add owner-scoped request contracts for Runtime authorization resolution and
  Channel binding credential resolution.
- Document both request bodies in the generated internal OpenAPI contract.

## 2.0.0

- Add the canonical Organization, User, Agent, Runtime, Workspace, and
  Conversation owner hierarchy.
- Require `owner_scope` on Runtime, integration, memory, credential, Artifact,
  and per-binding Channel data-plane contracts.
- Replace the duplicated Runtime `tenant` object with `owner_scope`; require
  Runtime and Workspace identity on Runtime envelopes.
- Bind session operations to `owner_scope.conversation_id` and reject Actor or
  conversation ownership mismatches.
- Add strict logical `ArtifactPointer` contracts and reject cross-owner
  artifacts in integration results.
- Upgrade the Channel protocol to `2.0`; v1 payloads fail closed.
- Move generated JSON Schema identifiers from the `/v1/` namespace to `/v2/`.

## 1.2.1

- Allow an authenticated Server Agent to submit an empty resource report as
  a node heartbeat before any user Agent has been provisioned.

## 1.2.0

- Add a metadata-only Channel binding inventory request and response so
  independent Workers can hot-load binding generations without receiving
  credentials in discovery payloads.
- Generate the OpenAPI document version from the canonical package version.

## 1.1.0

- Add strict Channel ingress and deduplication acknowledgement contracts.
- Add outbound delivery lease, batch, receipt, and retry contracts.
- Add metadata-only Channel health reports with a bidirectional capability
  requirement for `connected` status.
- Add Channel Worker-scoped binding credential resolution and versioned
  internal OpenAPI operations.

## 1.0.0

- Establish the shared Runtime, Control Plane, telemetry, credential, memory,
  channel, and integration contracts.
- Include `backup.restore`, `backup.expire`, test-run evidence, and upstream
  candidate identifiers in the canonical Control Plane protocol.
## 2.2.0

- Add fixed Hermes management operation names for provider, model, tools, skills, MCP, profiles, cron, diagnostics, analytics, and controlled files.
- Add Agent-scoped Scene Snapshot, Scene Patch, and Scene Intent contracts.
- Add the `hermes-dashboard` resource role for the separately supervised Hermes management service.
