import { BarChart } from '@mui/x-charts';
import { Skeleton, Stack, Typography, useTheme } from '@mui/material';
import no_data from '../assets/no_data.png';
import { ExerciseResponse } from '../types/api/response/device.ts';

type Props = { isLoading?: boolean; data: ExerciseResponse[] | undefined };
const SeriesGraph = ({ isLoading = true, data }: Props) => {
  const theme = useTheme();
  const convertedData = data?.map(item => ({
    label: 'Exercise ' + item.id,
    data: item.series.map(set => set.numberOfRepetitions),
    id: item.id,
  }));

  const _data = [
    { label: 'Exercise 1', data: [10, 20], id: 1 },
    { label: 'Exercise 2', data: [20, 3], id: 2 },
  ];

  const series = [
    {
      label: 'Exercise 1',
      data: [2423, 2210, 764, 1879],
    },
    {
      label: 'Exercise 2',
      data: [2423, 2210, 764, 1879],
    },
    {
      label: 'Exercise 3',
      data: [2423, 2210, 764],
    },
    {
      label: 'Exercise 4',
      data: [2423, 2210, 764, 1879],
    },
  ];

  return isLoading ? (
    <Skeleton variant={'rounded'} height={500} />
  ) : convertedData && convertedData.length > 0 ? (
    <BarChart
      series={series}
      height={500}
      xAxis={[{ data: _data.map(item => item.label), scaleType: 'band' }]}
      slotProps={{ legend: { hidden: true } }}
      colors={[theme.palette.primary.main, theme.palette.primary.light]}
      onItemClick={(_event, item) => {
        console.log(item);
      }}
    />
  ) : (
    <Stack flex={1} justifyContent={'center'} alignItems={'center'}>
      <img src={no_data} alt={'No data'} width={300} />
      <Typography variant={'h5'} fontWeight={'bold'}>
        Looks like you've been lazy this day
      </Typography>
    </Stack>
  );
};
export default SeriesGraph;
