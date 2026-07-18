# C00-02 fixtures

The `valid` directory contains the new signed control mutations and the legacy
`ControlCommand`, `RuntimeHeartbeat`, and `ResourceReport` payloads that must
remain readable. The `invalid` directory is fail-closed coverage:

- `missing-mutation-fields.json`: missing server identity and signature;
- `forbidden-action.json`: action is outside the deployment/operations allowlist;
- `raw-secret-field.json`: raw credential material is an unknown field;
- `lease-binding.json`: the command lease does not match the outer lease and is
  expired.

The stable error vocabulary is exported as `CONTROL_ERROR_CODES` and is also
used by `ControlError`, `CommandEvent`, and `ReceiptEnvelope`:
`invalid_schema_version`, `unsupported_schema_version`, `unknown_field`,
`missing_field`, `invalid_identifier`, `invalid_action`, `forbidden_action`,
`forbidden_field`, `raw_secret_not_allowed`, `invalid_signature`,
`signature_key_unknown`, `signature_expired`, `replay_detected`,
`idempotency_conflict`, `revision_conflict`, `sequence_conflict`,
`owner_mismatch`, `server_mismatch`, `approval_required`, `approval_not_valid`,
`lease_not_found`, `lease_expired`, `receipt_conflict`,
`release_not_immutable`, and `evidence_not_found`.

`ControlError` is a response object rather than a state mutation, so it carries
request/correlation identity but does not repeat the mutation ownership block.
For state mutations, `server_id` identifies the authoritative control or host
boundary; it is not a place to put a credential.

Legacy readers remain supported through the `2.3.x` line. Removing the legacy
surfaces requires a `2.4.0` or later contract decision; this package does not
silently convert old payloads into new envelopes.

The `signature.value` fields are verification artifacts, not key material. A
consumer must resolve signing keys by `signature.key_id` and must never place a
key, credential, or configuration document in a control payload.
