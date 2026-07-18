# C00-02 fixtures

The `valid` directory contains the new signed control mutations and the legacy
`ControlCommand`, `RuntimeHeartbeat`, and `ResourceReport` payloads that must
remain readable. The `invalid` directory is fail-closed coverage:

- `missing-mutation-fields.json`: missing server identity and signature;
- `forbidden-action.json`: otherwise complete event whose action is outside the
  deployment/operations allowlist;
- `raw-secret-field.json`: otherwise complete manifest whose only invalid field
  is raw credential material;
- `lease-binding.json`: otherwise complete lease whose command lease ID does
  not match the outer lease.

The stable error vocabulary is exported as `CONTROL_ERROR_CODES` and is also
used by `ControlError`, `CommandEvent`, and `ReceiptEnvelope`:
`invalid_schema_version`, `unsupported_schema_version`, `unknown_field`,
`missing_field`, `invalid_identifier`, `invalid_action`, `quarantined_action`,
`forbidden_action`,
`forbidden_field`, `raw_secret_not_allowed`, `invalid_signature`,
`signature_key_unknown`, `signature_expired`, `replay_detected`,
`idempotency_conflict`, `revision_conflict`, `sequence_conflict`,
`owner_mismatch`, `server_mismatch`, `approval_required`, `approval_not_valid`,
`lease_not_found`, `lease_expired`, `receipt_conflict`,
`release_not_immutable`, `evidence_not_found`, `stale_observation`, and
`verification_failed`.

`ControlError` is a response object rather than a state mutation, so it carries
request/correlation identity but does not repeat the mutation ownership block.
For state mutations, `server_id` identifies the authoritative control or host
boundary; it is not a place to put a credential.

Legacy readers remain supported through the `2.3.x` line. Removing the legacy
surfaces requires a later major-version contract decision; this package does not
silently convert old payloads into new envelopes.

`config.apply-user` remains readable only in the legacy `ControlCommand@1.0`
surface. Canonical command and lease envelopes reject it. A canonical receipt
uses `completion_candidate`; `succeeded` is an Authority-derived event state,
not a Server Agent receipt state.

The `signature.value` fields are verification artifacts, not key material. A
consumer must resolve signing keys by `signature.key_id` and must never place a
key, credential, or configuration document in a control payload.
