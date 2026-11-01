/** Mission verification must fail closed when any required stage is not PASS. */
export function missionExitCode(stages) {
  if (!Array.isArray(stages) || stages.length === 0) return 1;
  return stages.every(stage => stage?.status === 'PASS') ? 0 : 1;
}
