import { Typography } from '@mui/material';
import { useAppSelector } from '../store/hooks.ts';
import { selectMe } from '../store/meSlice.ts';

const GreetingTitle = () => {
  const me = useAppSelector(selectMe);
  const getGreeting = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };
  return (
    <Typography variant={'h2'} component={'h1'} style={{ fontWeight: 'bold' }}>
      {getGreeting()}, {me?.name}!
    </Typography>
  );
};
export default GreetingTitle;
