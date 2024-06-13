import { Button, Chip, Paper, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.tsx';
import { useGetSetDetailQuery } from '../store/setsSlice.ts';
import { skipToken } from '@reduxjs/toolkit/query';
import { LineChart } from '@mui/x-charts/LineChart';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { ChartsReferenceLine } from '@mui/x-charts';
import RepeatIcon from '@mui/icons-material/Repeat';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
const SetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoading, data } = useGetSetDetailQuery(id ? Number(id) : skipToken);
  const navigate = useNavigate();
  const theme = useTheme();

  const { xData, yData } = useMemo(() => {
    const returnData: { xData: string[]; yData: number[] } = { xData: [], yData: [] };
    if (!data) return returnData;

    const firstTime = dayjs(data.points[0].createdAt);
    const maxValue = data.points.reduce((max, current) => {
      return current.value > max ? current.value : max;
    }, data.points[0].value);

    data.points.forEach(item => {
      const secondsDiff = dayjs(item.createdAt).diff(firstTime) / 1000;
      returnData.xData.push(`${secondsDiff}s`);
      returnData.yData.push((item.value / maxValue) * 100);
    });
    return returnData;
  }, [data]);

  return (
    <ContentWrapper>
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          py: { xs: 3, md: 5 },
          px: { xs: 3, md: 6 },
          display: 'flex',
          gap: 7,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <Typography variant={'h3'} component={'h1'} fontWeight={'bold'}>
          Set detail
        </Typography>
        <Stack direction={'row'} gap={2} flexWrap={'wrap'}>
          <Chip icon={<InfoIcon />} label={'Biceps curls'} size={'medium'} sx={{ fontSize: 20, px: 3, py: 3 }} />
          <Chip
            icon={<RepeatIcon />}
            label={data?.numberOfRepetitions + ' reps'}
            size={'medium'}
            sx={{ fontSize: 20, px: 3, py: 3 }}
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={dayjs(data?.endedAt).diff(data?.createdAt, 'second') + 's'}
            size={'medium'}
            sx={{ fontSize: 20, px: 3, py: 3 }}
          />
          <Chip
            icon={<PlayCircleFilledWhiteIcon />}
            label={dayjs(data?.createdAt).format('HH:mm:ss DD/MM/YYYY')}
            size={'medium'}
            sx={{ fontSize: 20, px: 3, py: 3 }}
          />
          <Chip
            icon={<StopCircleIcon />}
            label={dayjs(data?.endedAt).format('HH:mm:ss DD/MM/YYYY')}
            size={'medium'}
            sx={{ fontSize: 20, px: 3, py: 3 }}
          />
        </Stack>
        {isLoading ? (
          <Skeleton variant={'rounded'} height={400} />
        ) : data ? (
          <LineChart
            height={400}
            series={[{ data: yData, curve: 'linear', valueFormatter: val => `${Math.floor(val || 0)}%` }]}
            xAxis={[{ scaleType: 'point', data: xData, label: 'Relative time in seconds (s)' }]}
            yAxis={[{ label: 'Percentage range of motion', labelStyle: { translate: -10 } }]}
            colors={[theme.palette.primary.main]}>
            <ChartsReferenceLine
              y={0}
              lineStyle={{ stroke: theme.palette.text.primary, strokeDashoffset: 5, strokeDasharray: 5 }}
            />
          </LineChart>
        ) : (
          <Stack sx={{ height: 400, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Typography>Set not found!</Typography>
          </Stack>
        )}
        <Button
          variant={'contained'}
          color={'primary'}
          sx={{ fontWeight: 'bold', minHeight: 50 }}
          onClick={() => navigate(-1)}>
          Go back
        </Button>
      </Paper>
    </ContentWrapper>
  );
};
export default SetDetail;
