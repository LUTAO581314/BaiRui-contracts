# C00-02 schema audit

This audit started against Contracts `v2.3.0-rc.1`; the approved schema fixes
are published by this change as `v2.3.0-rc.2`. The audit is limited to the shared
contract package. It does not change Platform, Agent, PostgreSQL, or Server
Agent consumers.

## Canonical field matrix

| Surface | Required identity and mutation fields | Canonical payload rules |
| --- | --- | --- |
| `DesiredState` | organization, user, Agent, server, request, correlation, idempotency, revision, sequence, `created_at`, signature | `status` is lifecycle state; `target_state` is desired runtime state; active state requires a concrete revision, release, backup, module map, or module list |
| `Observation` | same mutation block plus observation and deployment identity | requires positive `observation_version`, freshness, redacted components, source identity, observed and received timestamps |
| `ControlCommandEnvelope` | same mutation block plus canonical command | canonical action allowlist only; approval actions require `approval_id`; non-approval actions reject it; command Agent arguments must match envelope Agent |
| `CommandEvent` | same mutation block plus event, command, deployment, attempt and source identity | event type/state pairs are constrained; `command.verified` requires a newer observation version and evidence; executor completion is not a receipt success state |
| `ReceiptEnvelope` | same mutation block plus deployment, lease, command, attempt, sequence and source identity | `completion_candidate` requires `observation_version`, evidence, and completion time; `succeeded` is intentionally absent |

All secret-bearing control references use the dedicated `sr_...` opaque
reference pattern. Generic `ref:`, `id:`, and `hint:` references remain valid
only for non-secret pointers such as leases, evidence, releases, and configs.

## Signature and nonce boundary

The JSON mutation carries a signature descriptor with `algorithm`, `key_id`,
`value`, and `signed_at`. Runtime validators enforce that `signed_at` is not
before `created_at`; cryptographic verification and key lookup remain consumer
responsibilities.

Transport freshness and replay protection are deliberately separate from the
JSON mutation. Every internal control OpenAPI operation requires the three
headers `x-bairui-signature`, `x-bairui-timestamp`, and `x-bairui-nonce`.
Consumers must verify the HMAC, timestamp window, and one-time nonce before
calling the JSON validator. Adding `nonce` to the mutation body would create a
second incompatible replay identity and is not part of this release.

## Compatibility decision

Legacy `ControlCommand`, `Heartbeat`, and `ResourceReport` remain readable
during the `2.2.x` compatibility window. They are not silently converted to
canonical envelopes. `config.apply-user` remains legacy-readable only;
canonical commands and leases reject it. This package provides the schema and
semantic checks, while Authority persistence, replay stores, lease state, and
final verification remain consumer responsibilities.

## C00-03 readiness conclusion

`v2.3.0-rc.2` is sufficient as the basis for the canonical C00-03 wire source
after applying the strict approval-field fix in this audit. The existing tag
does not contain that fix until this commit is released or pinned directly.
Even after the fix, it is not a drop-in contract for the current C00-03
implementation. The current consumer must migrate at its adapter boundary
rather than weakening these schemas with aliases:

- `DesiredState.state` must become `status` plus `target_state`.
- `Observation.version` and `modules` must become
  `observation_version`, `freshness`, and `components`.
- Lease requests must use the signed `LeaseRequestEnvelope`, not the old
  organization/server/limit object.
- Receipts must include deployment/source/observation identity and use
  `completion_candidate`; `succeeded` is Authority-derived only.
- `secret_refs` must be validated as `sr_...`, not generic `ref:`/identifier
  strings.
- Current C00-03 internal error names such as `invalid_schema`,
  `invalid_reference`, `invalid_digest`, `invalid_timestamp`, and
  `invalid_sequence` must be mapped to the published `ControlError` vocabulary
  before crossing the wire. They are not added as undocumented aliases here.

The minimal compatibility strategy is therefore: retain the documented legacy
readers, add a C00-03 canonical adapter, validate the canonical envelope before
persistence, and reject canonical traffic until the peer advertises schema
`1.0`. No additional field aliases are needed in Contracts.
