# Changelog

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
