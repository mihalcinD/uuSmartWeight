import ContentWrapper from '../components/ContentWrapper.tsx';
import GreetingTitle from '../components/GreetingTitle.tsx';
import { Paper, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <ContentWrapper>
      <GreetingTitle />
      <Paper elevation={8} sx={{ borderRadius: 4, py: 4, px: 3 }}>
        <Typography variant={'h5'} component={'h2'} fontWeight={'bold'}>
          Today's summary
        </Typography>
      </Paper>
    </ContentWrapper>
  );
};
export default Dashboard;
