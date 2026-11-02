import { execSync } from 'node:child_process';

// Limit each local verification subprocess, including npm audit network waits.
// This is an execution bound, not an independent verification or a release gate.
export const MAX_RSI_COMMAND_TIMEOUT_MS = 5 * 60 * 1000;

export function runRsiCommand(command, options = {}) {
  const { timeoutMs = MAX_RSI_COMMAND_TIMEOUT_MS, ...execOptions } = options;
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0 ||
      timeoutMs > MAX_RSI_COMMAND_TIMEOUT_MS) {
    throw new Error('BLOCKED: invalid REA/RSI command timeout');
  }
  return execSync(command, { ...execOptions, timeout: timeoutMs });
}
