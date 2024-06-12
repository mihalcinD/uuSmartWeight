import ContentWrapper from '../components/ContentWrapper.tsx';
import GreetingTitle from '../components/GreetingTitle.tsx';
import { Box, Button, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { PageConfig, routesConfig } from './config.ts';
import SummaryItem from '../components/SummaryItem.tsx';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useGetDeviceDataQuery } from '../store/deviceDataSlice.ts';
import { formatTime } from '../helpers/time.ts';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const Dashboard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { data, isLoading, fulfilledTimeStamp } = useGetDeviceDataQuery(dayjs().format('YYYY-MM-DD'), {
    pollingInterval: 10000,
  });
  const lastUpdate = useMemo(() => dayjs(fulfilledTimeStamp).format('HH:mm:ss'), [fulfilledTimeStamp]);

  const navigateWithParams = ({ path, search }: PageConfig) => {
    navigate({
      pathname: path,
      search: search ? createSearchParams(search).toString() : undefined,
    });
  };

  return (
    <ContentWrapper>
      <GreetingTitle />
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          py: { xs: 3, md: 5 },
          px: { xs: 3, md: 6 },
          display: 'flex',
          gap: 7,
          flexDirection: 'column',
        }}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant={'h4'} component={'h2'} fontWeight={'bold'}>
            Today's summary
          </Typography>
          <Button
            variant={'contained'}
            color={'primary'}
            sx={{ fontWeight: 'bold', minHeight: 50 }}
            onClick={() => navigateWithParams(routesConfig['STATISTICS'])}>
            {isSmallScreen ? 'Statistics' : 'Show detailed statistics'}
          </Button>
        </Stack>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={6}>
          <Stack spacing={7}>
            <Stack direction={'row'} spacing={5}>
              <SummaryItem label={'Exercises'} value={data?.numberOfExercises} isLoading={isLoading} />
              <SummaryItem label={'Total sets'} value={data?.numberOfSets} isLoading={isLoading} />
              <SummaryItem label={'Total time'} value={formatTime(data?.totalTime)} isLoading={isLoading} />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
              <SummaryItem
                label={'Average sets per exercise'}
                value={data?.averageSetsPerExercise}
                isLoading={isLoading}
              />
              <SummaryItem
                label={'Average time per exercise'}
                value={formatTime(data?.averageTimePerExercise)}
                isLoading={isLoading}
              />
              <SummaryItem
                label={'Average time per set'}
                value={formatTime(data?.averageTimePerSet)}
                isLoading={isLoading}
              />
            </Stack>
          </Stack>
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'center', lg: 'flex-end' },
              flexDirection: 'column',
              flex: 1,
              gap: 3,
            }}>
            <Stack spacing={1} alignItems={'center'}>
              <Gauge
                width={250}
                height={250}
                value={data?.points || 0}
                valueMin={0}
                valueMax={data?.bestScore || 0}
                sx={{
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 32,
                    fontWeight: 'bold',
                  },
                }}
                text={({ value, valueMax }) => `${value} / ${valueMax}`}
              />
              <Typography variant={'h4'}>Score</Typography>
            </Stack>
            {fulfilledTimeStamp && (
              <Typography sx={{ textAlign: 'right', color: 'text.secondary', flex: 1 }}>
                Updated at {lastUpdate}
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    </ContentWrapper>
  );
};
export default Dashboard;
