# BaiRui Contracts

`@bairui/contracts` is the protocol source of truth shared by BaiRui Agent and
BaiRui Cloud Agent Platform. It contains no credentials, deployment values, or
user content.

The package owns versioned JSON Schema and OpenAPI contracts for:

- Runtime requests and operations;
- Control Plane commands;
- Runtime and host telemetry;
- Agent-scoped credential resolution;
- Obsidian-compatible memory projection;
- channel messages and delivery receipts;
- service integration requests and results.

Consumers must pin an immutable Git tag. Production must never consume a branch
or an unversioned archive.

## Compatibility

Protocol fields use semantic versioning. A patch release may clarify validation
without changing accepted payloads. A minor release may add optional fields. A
major release is required to remove fields, change meaning, or add required
fields.

Run `pnpm verify` after every change. Generated schemas and TypeScript types
must match `src/schemas.mjs` exactly.
