import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "json-schema-to-typescript";
import { OPENAPI_PATHS, SCHEMAS } from "../src/schemas.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function operation(pathname, method, schemaName, responseSchemaName = null, responseStatus = 200) {
  const success = { description: responseStatus === 202 ? "Accepted" : "Success" };
  if (responseSchemaName) success.content = { "application/json": { schema: { $ref: `#/components/schemas/${SCHEMAS[responseSchemaName].title}` } } };
  return {
    operationId: `${method}${pathname.replace(/[^A-Za-z0-9]+(.)/g, (_, value) => value.toUpperCase())}`,
    security: [{ machineSignature: [] }],
    requestBody: {
      required: true,
      content: { "application/json": { schema: { $ref: `#/components/schemas/${SCHEMAS[schemaName].title}` } } }
    },
    responses: {
      [responseStatus]: success,
      400: { description: "Contract validation failed" },
      401: { description: "Machine authentication failed" }
    }
  };
}

async function typeDeclarations() {
  const declarations = [];
  for (const schema of Object.values(SCHEMAS)) {
    declarations.push((await compile(schema, schema.title, { bannerComment: "", format: false, unreachableDefinitions: true })).trim());
  }
  declarations.push(
    "export type ControlAction = ControlCommand[\"action\"];",
    "export type RuntimeOperation = RuntimeOperationEnvelope[\"operation\"];",
    "export type RuntimeStreamOperation = RuntimeStreamEnvelope[\"operation\"];",
    "export type ModuleLayer = RuntimeHeartbeat[\"components\"][number][\"layer\"];",
    "export type ModuleStatus = RuntimeHeartbeat[\"status\"];"
  );
  return `${declarations.join("\n\n")}\n`;
}

export async function generatedArtifacts() {
  const artifacts = new Map();
  for (const [name, schema] of Object.entries(SCHEMAS)) artifacts.set(`schemas/${name}.schema.json`, json(schema));
  const paths = {};
  for (const [pathname, [method, schemaName, responseSchemaName, responseStatus]] of Object.entries(OPENAPI_PATHS)) {
    paths[pathname] = { [method]: operation(pathname, method, schemaName, responseSchemaName, responseStatus) };
  }
  paths["/api/internal/runtime/agents/{agentId}/authorizations/{authorizationId}/resolve"] = {
    post: {
      operationId: "resolveAgentAuthorization",
      security: [{ machineSignature: [] }],
      parameters: [
        { name: "agentId", in: "path", required: true, schema: { type: "string" } },
        { name: "authorizationId", in: "path", required: true, schema: { type: "string" } }
      ],
      responses: {
        200: { description: "Agent-scoped credential", content: { "application/json": { schema: { $ref: "#/components/schemas/CredentialResolution" } } } },
        401: { description: "Runtime identity rejected" },
        404: { description: "Authorization unavailable" }
      }
    }
  };
  paths["/api/internal/channels/bindings/{bindingId}/resolve"] = {
    post: {
      operationId: "resolveChannelBindingCredential",
      security: [{ machineSignature: [] }],
      parameters: [{ name: "bindingId", in: "path", required: true, schema: { type: "string" } }],
      responses: {
        200: { description: "Channel Worker scoped credential", content: { "application/json": { schema: { $ref: "#/components/schemas/ChannelCredentialResolution" } } } },
        401: { description: "Channel Worker identity rejected" },
        404: { description: "Channel binding unavailable" }
      }
    }
  };
  const openapi = {
    openapi: "3.1.0",
    info: { title: "BaiRui Internal Contracts", version: "1.1.0" },
    paths,
    components: {
      securitySchemes: {
        machineSignature: { type: "apiKey", in: "header", name: "x-bairui-signature", description: "Timestamp, nonce, and HMAC authenticated machine request." }
      },
      schemas: Object.fromEntries(Object.values(SCHEMAS).map((schema) => [schema.title, schema]))
    }
  };
  artifacts.set("openapi/bairui-internal.openapi.json", json(openapi));
  artifacts.set("dist/index.d.ts", await typeDeclarations());
  return artifacts;
}

export async function writeGeneratedArtifacts() {
  for (const [relative, content] of await generatedArtifacts()) {
    const destination = path.join(root, relative);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, content, "utf8");
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await writeGeneratedArtifacts();
