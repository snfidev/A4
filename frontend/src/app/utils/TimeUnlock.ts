export function getUnlockedLevels(): number {
  const now = new Date();
  const currentHour = now.getHours();

  const startHour = 6;
  const totalLevels = 8;

  const unlocked = currentHour - startHour + 1;

  return Math.max(0, Math.min(totalLevels, unlocked));
}