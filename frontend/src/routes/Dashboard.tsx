import ContentWrapper from '../components/ContentWrapper.tsx';
import GreetingTitle from '../components/GreetingTitle.tsx';
import { Box, Button, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { PageConfig, routesConfig } from './config.ts';
import SummaryItem from '../components/SummaryItem.tsx';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

const Dashboard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

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
              <SummaryItem label={'Exercises'} value={'4'} />
              <SummaryItem label={'Total sets'} value={'12'} />
              <SummaryItem label={'Total time'} value={'00:43:16'} />
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={5}>
              <SummaryItem label={'Average sets per exercise'} value={'3'} />
              <SummaryItem label={'Average time per exercise'} value={'10:48'} />
              <SummaryItem label={'Average time per set'} value={'03:36'} />
            </Stack>
          </Stack>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', lg: 'flex-end' }, flex: 1 }}>
            <Stack spacing={1} alignItems={'center'}>
              <Gauge
                width={250}
                height={250}
                value={113}
                valueMin={0}
                valueMax={161}
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
          </Box>
        </Stack>
      </Paper>
    </ContentWrapper>
  );
};
export default Dashboard;
