import {
  CONTROL_ACTIONS,
  CONTROL_RECEIPT_STATES,
  validateControlCommandEnvelope,
  validateDesiredState,
  validateLeaseEnvelope,
  validateReceiptEnvelope,
  type ControlAction,
  type CanonicalControlCommandEnvelope,
  type CanonicalLeaseEnvelope,
  type ControlCommandEnvelope,
  type DesiredState,
  type LeaseEnvelope,
  type LegacyControlAction,
  type ReceiptEnvelope
} from "@bairui/contracts";

declare const input: unknown;

const desired: DesiredState = validateDesiredState(input);
const command: CanonicalControlCommandEnvelope = validateControlCommandEnvelope(input);
const lease: CanonicalLeaseEnvelope = validateLeaseEnvelope(input);
const receipt: ReceiptEnvelope = validateReceiptEnvelope(input);
const action: ControlAction = command.command.action;
const legacyAction: LegacyControlAction = "config.apply-user";

CONTROL_ACTIONS.includes(action);
CONTROL_RECEIPT_STATES.includes(receipt.state);
lease.commands.at(0)?.placement.server_id;
desired.target_state;
legacyAction.toUpperCase();

if (command.command.action === "deployment.start") {
  command.command.arguments.agent_id.toUpperCase();
  // @ts-expect-error action-specific command arguments reject undeclared fields.
  command.command.arguments.release_id;
}

// @ts-expect-error config.apply-user is readable only through the legacy ControlCommand contract.
const quarantinedCanonicalAction: ControlAction = "config.apply-user";
// @ts-expect-error succeeded is Authority-derived and cannot be emitted by ReceiptEnvelope.
const forgedReceiptState: ReceiptEnvelope["state"] = "succeeded";

void quarantinedCanonicalAction;
void forgedReceiptState;
