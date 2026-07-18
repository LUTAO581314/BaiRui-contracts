# BaiRui Contracts

`@bairui/contracts` is the protocol source of truth shared by BaiRui Agent and
BaiRui Cloud Agent Platform. It contains no credentials, deployment values, or
user content.

The package owns versioned JSON Schema and OpenAPI contracts for:

- the Organization, User, Agent, Runtime, Workspace, and Conversation identity
  hierarchy and mandatory Agent owner scope;
- Runtime requests and operations;
- signed Control Plane desired state, observations, commands, events,
  approvals, release manifests, command leases, receipts, and safe errors;
- Runtime and host telemetry;
- owner-scoped Runtime and Channel credential resolution requests and
  responses;
- Obsidian-compatible memory projection;
- channel ingress, deduplication acknowledgements, delivery leases, receipts,
  health reports, metadata-only binding inventory, and Worker-scoped
  credential resolution;
- service integration requests and results.
- logical owner-scoped Artifact pointers without storage paths or credentials.

The normative ownership rules and 404/403 behavior are defined in
[`docs/IDENTITY-AND-OWNERSHIP.md`](docs/IDENTITY-AND-OWNERSHIP.md).
The C00-02 consumer migration and real-server acceptance requirements are in
[`docs/C00-02-CONSUMER-MIGRATION.md`](docs/C00-02-CONSUMER-MIGRATION.md).

Consumers must pin an immutable Git tag. Production must never consume a branch
or an unversioned archive.

## Compatibility

Protocol fields use semantic versioning. A patch release may clarify validation
without changing accepted payloads. A minor release may add optional fields. A
major release is required to remove fields or change existing field meaning.
New protocol surfaces may be introduced in a minor release while existing
contracts remain compatible.

Version `2.0.0` is intentionally incompatible with v1 data-plane envelopes.
There is no implicit server-side conversion from a v1 `tenant` object to a v2
`owner_scope`.

Channel binding status is evidence based. A binding may report `connected`
only when its adapter has completed vendor authentication and has both receive
and send capability. Credential storage by itself is never connection proof.

Run `pnpm verify` after every change. Generated schemas and TypeScript types
must match `src/schemas.mjs` exactly.
