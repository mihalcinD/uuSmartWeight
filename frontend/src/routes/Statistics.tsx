import { Paper, Stack, Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import ContentWrapper from '../components/ContentWrapper.tsx';

const Devices = () => {
  const [searchParams] = useSearchParams();
  const date = useMemo(() => searchParams.get('date'), [searchParams]);
  const formattedDate = useMemo(() => (date ? new Date(date).toLocaleDateString() : ''), [date]);
  return (
    <ContentWrapper>
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          py: { xs: 3, md: 5 },
          px: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: 'row',
        }}>
        <Stack flex={1} sx={{ backgroundColor: 'red' }}>
          <Stack flexDirection={'row'}>
            <Typography variant={'h3'} component={'h1'} fontWeight={'bold'}>
              Statistics {formattedDate}
            </Typography>
          </Stack>
        </Stack>
        <Stack flex={1} sx={{ backgroundColor: 'blue' }}>
          <Typography variant={'h3'} component={'h1'} fontWeight={'bold'} textAlign={'right'}>
            Score
          </Typography>
        </Stack>
      </Paper>
    </ContentWrapper>
  );
};

export default Devices;
