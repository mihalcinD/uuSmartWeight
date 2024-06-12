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

  return isLoading ? (
    <Skeleton variant={'rounded'} height={500} />
  ) : convertedData && convertedData.length > 0 ? (
    <BarChart
      series={convertedData}
      height={500}
      xAxis={[{ data: convertedData.map(item => item.label), scaleType: 'band' }]}
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
