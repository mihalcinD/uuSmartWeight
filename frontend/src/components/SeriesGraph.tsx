import { BarChart } from '@mui/x-charts';
import { Skeleton, Stack, Typography, useTheme } from '@mui/material';
import no_data from '../assets/no_data.png';
import { SetResponse } from '../types/api/response/device.ts';

type Props = { isLoading?: boolean; data: SetResponse[] | undefined };
const SeriesGraph = ({ isLoading = true, data }: Props) => {
  const theme = useTheme();
  return isLoading ? (
    <Skeleton variant={'rounded'} height={500} />
  ) : data ? (
    <BarChart
      series={[
        { data: [35, 44, 24, 34] },
        { data: [51, 6, 49, 30] },
        { data: [15, 25, 30, 50] },
        { data: [60, 50, 15, 25] },
      ]}
      height={500}
      xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]}
      colors={[theme.palette.primary.main, theme.palette.primary.light]}
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
