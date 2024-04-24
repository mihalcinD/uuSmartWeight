import { Typography } from '@mui/material';
import ContentWrapper from '../components/ContentWrapper.tsx';

const Dashboard = () => {
  return (
    <ContentWrapper>
      <Typography variant={'h2'} component={'h1'} style={{ fontWeight: 'bold' }}>
        Good morning, David!
      </Typography>
    </ContentWrapper>
  );
};
export default Dashboard;
