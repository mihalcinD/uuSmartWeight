import { BarChart, BarItemIdentifier } from '@mui/x-charts';
import { Skeleton, Stack, Typography, useTheme } from '@mui/material';
import no_data from '../assets/no_data.png';
import { ExerciseResponse } from '../types/api/response/device.ts';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = { isLoading?: boolean; data: ExerciseResponse[] | undefined };
const SeriesGraph = ({ isLoading = true, data }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const sets = useMemo(() => data?.flatMap(item => item.series.flatMap(set => set)), [data]);
  const chartSeries = [
    {
      data: sets?.map(item => item.numberOfRepetitions),
      label: 'Repetitions',
    },
  ];

  const onBarPress = (_event: React.MouseEvent<SVGElement, MouseEvent>, item: BarItemIdentifier) => {
    const set = sets?.[item.dataIndex];
    if (set) {
      navigate(`/set/${set.id}`);
    }
  };

  return isLoading ? (
    <Skeleton variant={'rounded'} height={500} />
  ) : sets && sets.length > 0 ? (
    <BarChart
      series={chartSeries}
      height={500}
      xAxis={[{ scaleType: 'band', data: sets.map(set => dayjs(set.createdAt).format('HH:MM:ss')), label: 'Time' }]}
      yAxis={[{ label: 'Repetitions', tickMinStep: 1 }]}
      slotProps={{ legend: { hidden: true } }}
      tooltip={{ trigger: 'axis' }}
      colors={[theme.palette.primary.main, theme.palette.primary.light]}
      onItemClick={onBarPress}
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
