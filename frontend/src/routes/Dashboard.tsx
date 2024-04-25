import ContentWrapper from '../components/ContentWrapper.tsx';
import GreetingTitle from '../components/GreetingTitle.tsx';
import { Button, Paper, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';

const Dashboard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ContentWrapper>
      <GreetingTitle />
      <Paper elevation={8} sx={{ borderRadius: 4, py: 4, px: 3 }}>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant={'h5'} component={'h2'} fontWeight={'bold'}>
            Today's summary
          </Typography>
          <Button variant={'contained'} color={'primary'} sx={{ fontWeight: 'bold', minHeight: 50 }}>
            {isSmallScreen ? 'Statistics' : 'Show detailed statistics'}
          </Button>
        </Stack>
      </Paper>
    </ContentWrapper>
  );
};
export default Dashboard;
