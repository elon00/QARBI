/** Mission verification must fail closed unless every required stage ran and passed. */
export const REQUIRED_MISSION_STAGE_IDS = Object.freeze(
  Array.from({ length: 14 }, (_, index) => String(index + 1).padStart(2, '0'))
);

export function missionExitCode(stages) {
  if (!Array.isArray(stages) || stages.length !== REQUIRED_MISSION_STAGE_IDS.length) return 1;
  return stages.every((stage, index) =>
    stage?.id === REQUIRED_MISSION_STAGE_IDS[index] && stage.status === 'PASS'
  ) ? 0 : 1;
}
