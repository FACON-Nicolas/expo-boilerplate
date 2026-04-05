const DBFS_FLOOR = -60;

export type AmplitudeSample = {
  value: number;
  capturedAtMs: number;
};

export const normalizeDbfs = (dbfs: number): number => {
  const clamped = Math.max(DBFS_FLOOR, Math.min(0, dbfs));
  return (clamped - DBFS_FLOOR) / (0 - DBFS_FLOOR);
};
