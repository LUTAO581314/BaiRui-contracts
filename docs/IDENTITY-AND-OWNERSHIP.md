# Identity And Ownership Contract

This document defines the canonical identity hierarchy for BaiRui user data.
It applies to the Platform BFF, Agent Runtime Boundary, service integrations,
memory projections, artifacts, and channel adapters.

## Identity Hierarchy

The six identities are opaque, stable identifiers:

```text
Organization
  -> User
    -> Agent
      -> Runtime
      -> Workspace
        -> Conversation
```

An identifier is not an email address, display name, URL, file-system path, or
secret. Renaming a user-facing object must not change its identifier.

`AgentOwnerScope` always requires:

- `organization_id`
- `user_id`
- `agent_id`

Runtime, integration, and memory operations additionally require
`runtime_id` and `workspace_id`. A request that addresses an existing
conversation also carries `conversation_id`. A conversation cannot exist in a
scope without a workspace.

External channel account, sender, thread, and message identifiers are adapter
identities. They never replace BaiRui owner identities. The Platform resolves
and verifies their binding before a Runtime call.

## Actor Versus Owner

`owner_scope.user_id` identifies the user who owns the Agent data. `actor`
identifies the authenticated caller. Version 2 Runtime data-plane contracts
require `actor.user_id` to match `owner_scope.user_id`; delegated access must be
introduced by a later explicit contract rather than by reusing an administrator
role.

Control Plane administrators do not become owners of user data. Control Plane
protocols remain separate and cannot carry prompts, conversations, memory
content, user files, or secrets.

## Lookup Order

Every user-resource request must use this order:

1. Authenticate the caller and derive organization and user IDs from the
   authenticated session or machine credential.
2. Parse the requested Agent and child resource IDs.
3. Load the resource using the complete owner scope, not a bare child ID.
4. Compare the stored owner scope with the authenticated scope.
5. Check the action permission.
6. Only then call Runtime, storage, a credential resolver, or an adapter.

Body fields and query parameters cannot override authenticated owner IDs.
Runtime, Channel Worker, and Server Agent credentials must be bound to the
same Agent or worker scope before payload validation is trusted.

## Error Semantics

- Return `404` when an ID does not exist inside the authenticated owner scope,
  including when the same ID exists for another organization, user, or Agent.
  This prevents identifier enumeration.
- Return `403` only when the resource belongs to the authenticated scope but
  the authenticated actor lacks permission for the requested action.
- Return `409` when a previously valid asynchronous job detects that resource
  ownership changed before completion.
- Return `400` for malformed scope fields or a contract mismatch.

Error bodies must not disclose the actual owner, internal path, Runtime route,
database key, or secret reference.

## Artifacts

`ArtifactPointer` is a logical, owner-scoped reference. It carries identity,
kind, media type, size, digest, and creation time. It does not expose a host
path, storage credential, or permanent download URL. A short-lived download
capability belongs to the Platform API and must re-check the same owner scope.

## Compatibility

Contracts `2.0.0` intentionally break version 1 payloads. Consumers must pin
the same immutable Contracts tag. A v1 payload without `owner_scope`, or with
the former Runtime `tenant` object, must fail closed instead of being upgraded
implicitly at runtime.
