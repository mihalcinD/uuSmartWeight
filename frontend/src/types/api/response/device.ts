type DeviceDataResponse = {
  numberOfExercises: number;
  exercises: ExerciseResponse[];
  totalTime: number;
  points: number;
  bestScore: number;
};

type SetResponse = {
  id: number;
  exerciseId: number;
  numberOfRepetitions: number;
  createdAt: string;
  endedAt: string;
};

type ExerciseResponse = {
  id: number;
  series: SetResponse[];
};

type DeviceDataExtended = DeviceDataResponse & {
  averageSetsPerExercise: number;
  averageTimePerSet: number;
  averageTimePerExercise: number;
  numberOfSets: number;
  numberOfExercises: number;
};

export type { DeviceDataResponse, SetResponse, DeviceDataExtended, ExerciseResponse };
