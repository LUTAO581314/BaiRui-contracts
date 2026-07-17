# Changelog

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
