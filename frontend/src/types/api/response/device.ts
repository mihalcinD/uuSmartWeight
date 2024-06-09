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

export type { DeviceDataResponse, SetResponse };
