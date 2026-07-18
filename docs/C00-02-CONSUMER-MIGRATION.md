# C00-02 consumer migration and acceptance

## Status

This package is a C00-02 candidate. It defines the shared wire contracts; it
does not implement Platform persistence, Server Agent execution, Authority
verification, or C00-03 PostgreSQL tables. Publishing this package does not
pass `GATE-C00`.

## Canonical control surfaces

New producers use control schema `1.0` for:

- `DesiredState` with lifecycle `status` and separate `target_state`;
- `Observation` with `observation_version`, `freshness`, `components`,
  `source_identity`, `observed_at`, and `received_at`;
- `ControlCommandEnvelope` and leased commands restricted to the canonical
  operations allowlist;
- `CommandEvent`, including explicit `command.verification.started` and
  Authority-derived `command.verified` events;
- `Approval`, with a complete owner/deployment scope and separation of the
  requester and decision maker;
- immutable `ReleaseManifest` artifact digests and compatibility bounds;
- signed lease request, lease grant, receipt, and `ControlError` envelopes.

Every control mutation carries organization, user, Agent, server, request,
correlation, idempotency, revision, sequence, creation time, and signature
metadata. Values crossing the control boundary are identifiers, digests,
numeric observations, or opaque references. Raw secrets, configuration
documents, executable text, and user content are not control payloads.

## Compatibility window

Consumers must dual-read these existing 2.2.x surfaces during the 2.3.x
candidate window:

- unsigned `ControlCommand@1.0`;
- `RuntimeHeartbeat@2.0` (also exported as the `Heartbeat` alias);
- `ResourceReport@2.0` and its `ResourceSample` item shape.

There is no implicit conversion. Producers must not emit a new control
envelope until the receiving service advertises control schema `1.0` support.
Production consumers must pin an immutable Contracts tag or commit and verify
the package checksum; they must not install from `main`.

`config.apply-user` is retained only in the legacy reader. It is quarantined
from `CONTROL_ACTIONS`, `ControlCommandEnvelope`, and `LeaseEnvelope`. A
consumer must not translate the legacy action into a canonical command.

Server Agent completion is `completion_candidate`. A legacy wire `succeeded`
receipt must be mapped to Authority state `verifying`, never directly to final
`succeeded`. Only a matching fresh Observation, required evidence, and fixed
postcondition checks may produce `command.verified` and final success.

## Platform migration requirements

1. Pin the same immutable Contracts candidate consumed by Agent and Server
   Agent; reject startup when the negotiated control schema is unsupported.
2. Validate the exact JSON Schema and runtime semantic validator before any
   database write, queue transition, lease issuance, or outbox publication.
3. Verify transport timestamp, nonce, and HMAC plus the mutation signature;
   persist nonce replay protection and idempotency outcomes.
4. Keep legacy read endpoints during the compatibility window, but emit
   canonical envelopes only to an explicitly compatible peer.
5. Persist desired revisions, observations, command events, approvals, lease
   attempts, receipts, verification, outbox, and dead letters in C00-03.
6. Treat receipts as executor claims. Final success is derived only after
   Observation and evidence verification.
7. Return `ControlError` without raw exception text, secrets, file paths,
   configuration documents, or customer content.

## Agent and Server Agent migration requirements

1. Use `LeaseRequestEnvelope`, verify the returned lease signature and owner,
   Agent, server, deployment, attempt, lease ID, token, and expiry bindings.
2. Reject unknown fields, unknown actions, quarantined actions, mismatched
   placement, expired leases, replayed idempotency keys, and command expiry
   beyond the lease before entering an adapter.
3. Resolve any `secret_refs` only inside the bound local execution context.
   Never return resolved values in receipts, observations, events, logs, or
   support bundles.
4. Emit ordered `accepted`, `running`/`executing`, and
   `completion_candidate` or failure receipts. Do not emit receipt
   `succeeded` or perform Authority verification locally.
5. Emit a fresh, independently measured Observation with source identity and
   evidence references after execution.

## Real-server acceptance conditions

C00-02 consumer integration is not accepted until a Linux production-like
server records all of the following against immutable image digests and a
fixed Contracts package checksum:

1. Platform, Agent Runtime, and Server Agent report the same supported control
   schema and pinned Contracts version.
2. Valid legacy heartbeat/resource payloads remain accepted while canonical
   signed mutations are accepted only after capability negotiation.
3. Missing or stale signatures, reused nonces, duplicate conflicting
   idempotency keys, unknown fields, raw secret fields, and unsupported schema
   versions fail closed with a redacted `ControlError`.
4. Cross-organization, cross-Agent, cross-server, cross-deployment, wrong
   lease ID/token, expired lease, and outliving-command cases are rejected
   before adapter execution.
5. `config.apply-user` cannot be issued or leased through the canonical path.
6. A completion receipt enters `verifying`; it cannot create final success
   without a newer matching Observation and required evidence.
7. Stale or mismatched Observation evidence blocks verification. A valid fresh
   Observation produces exactly one `command.verified` event and one outbox
   result under replay.
8. Logs, database rows, receipts, observations, events, errors, and captured
   network responses contain no provider key, token, password, secret value,
   executable body, or customer conversation content.
9. Restart and network interruption preserve monotonic revision/event
   sequence, idempotency, lease attempt, and replay behavior.

The evidence bundle must include the source commit, package checksum, image
digests, migration revision, command and observation identifiers, redacted
request/response captures, database assertions, and rollback result. These are
consumer and C00-03/C03 acceptance requirements; they are not satisfied by the
Contracts unit tests alone.
