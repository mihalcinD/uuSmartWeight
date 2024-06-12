type SetDetail = {
  points: { value: number; createdAt: string }[];
  numberOfRepetitions: number;
  createdAt: string;
  endedAt: string;
};

type SetDetailResponse = SetDetail;

export type { SetDetail, SetDetailResponse };
