import { Paper, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import ContentWrapper from '../components/ContentWrapper.tsx';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import BestScoreBox from '../components/BestScoreBox.tsx';
import { useGetDeviceDataQuery } from '../store/deviceDataSlice.ts';
import SummaryItem from '../components/SummaryItem.tsx';
import { formatTime } from '../helpers/time.ts';
import { skipToken } from '@reduxjs/toolkit/query';
import SeriesGraph from '../components/SeriesGraph.tsx';

const Devices = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const date = useMemo(() => searchParams.get('date'), [searchParams]);
  const [dateValue, setDateValue] = useState<Dayjs | null>(dayjs(date));
  const { data, isLoading, fulfilledTimeStamp } = useGetDeviceDataQuery(date ?? skipToken, { pollingInterval: 30000 });
  const lastUpdate = useMemo(() => dayjs(fulfilledTimeStamp).format('HH:mm:ss'), [fulfilledTimeStamp]);
  const onDateChange = (date: Dayjs | null) => {
    if (!date) return;
    setSearchParams({ date: date.format('YYYY-MM-DD') });
  };

  useEffect(() => {
    if (date) {
      setDateValue(dayjs(date));
    }
  }, [date]);

  return (
    <ContentWrapper>
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          py: { xs: 3, md: 5 },
          px: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
        }}>
        <Stack flex={1} gap={5}>
          <Stack flexDirection={'row'} gap={10} justifyContent={'space-between'}>
            <Typography variant={'h3'} component={'h1'} fontWeight={'bold'}>
              Statistics
            </Typography>
            <DatePicker label="Select a date" value={dateValue} onChange={onDateChange} />
          </Stack>
          <SeriesGraph isLoading={isLoading} data={data?.series} />
        </Stack>
        <Stack minWidth={300} gap={5}>
          <BestScoreBox score={data?.points} bestScore={data?.bestScore} isLoading={isLoading} />
          <Stack spacing={1}>
            <SummaryItem label={'Total time'} value={formatTime(data?.totalTime)} isLoading={isLoading} />
            <Stack direction={'row'} spacing={5}>
              <SummaryItem label={'Exercises'} value={data?.numberOfExercises} small isLoading={isLoading} />
              <SummaryItem label={'Total sets'} value={data?.series.length} small isLoading={isLoading} />
            </Stack>
            <SummaryItem
              label={'Average sets per exercise'}
              value={data?.averageSetsPerExercise}
              small
              isLoading={isLoading}
            />
            <SummaryItem
              label={'Average time per exercise'}
              value={formatTime(data?.averageTimePerExercise)}
              small
              isLoading={isLoading}
            />
            <SummaryItem
              label={'Average time per set'}
              value={formatTime(data?.averageTimePerSet)}
              small
              isLoading={isLoading}
            />
          </Stack>
          {fulfilledTimeStamp && (
            <Typography sx={{ textAlign: 'right', color: 'text.secondary' }}>Updated at {lastUpdate}</Typography>
          )}
        </Stack>
      </Paper>
    </ContentWrapper>
  );
};

export default Devices;
