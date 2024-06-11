import { Button, Paper, Skeleton, Typography, useTheme } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.tsx';
import { useGetSetDetailQuery } from '../store/setsSlice.ts';
import { skipToken } from '@reduxjs/toolkit/query';
import { LineChart } from '@mui/x-charts/LineChart';

const SetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetSetDetailQuery(id ? Number(id) : skipToken);
  const navigate = useNavigate();
  const theme = useTheme();

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
        {isLoading ? (
          <Skeleton variant={'rounded'} height={400} />
        ) : (
          <LineChart
            height={400}
            series={[{ data: [2400, 1398, 9800, 3908, 4800, 3800, 4300], curve: 'linear' }]}
            xAxis={[
              { scaleType: 'point', data: ['Page A', 'Page B', 'Page C', 'Page D', 'Page E', 'Page F', 'Page G'] },
            ]}
            colors={[theme.palette.primary.main]}
          />
        )}
        <Button
          variant={'contained'}
          color={'primary'}
          sx={{ fontWeight: 'bold', minHeight: 50 }}
          onClick={() => navigate(-1)}>
          Go back to statistics
        </Button>
      </Paper>
    </ContentWrapper>
  );
};
export default SetDetail;
