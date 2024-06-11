type DeviceDataResponse = {
  numberOfExercises: number;
  series: SetResponse[];
  totalTime: number;
  points: number;
  bestScore: number;
};

type SetResponse = {
  id: number;
  numberOfRepetitions: number;
  createdAt: string;
  endedAt: string;
};

type DeviceDataExtended = DeviceDataResponse & {
  averageSetsPerExercise: number;
  averageTimePerSet: number;
  averageTimePerExercise: number;
};

export type { DeviceDataResponse, SetResponse, DeviceDataExtended };
