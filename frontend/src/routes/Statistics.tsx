import { Typography } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import ContentWrapper from '../components/ContentWrapper.tsx';

const Devices = () => {
  const [searchParams] = useSearchParams();
  const date = useMemo(() => searchParams.get('date'), [searchParams]);
  return (
    <ContentWrapper>
      <Typography variant={'h3'} component={'h1'}>
        Statistics {date}
      </Typography>
    </ContentWrapper>
  );
};

export default Devices;
