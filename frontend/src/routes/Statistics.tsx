import { Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';

const Devices = () => {
  const [searchParams] = useSearchParams();
  const date = useMemo(() => searchParams.get('date'), [searchParams]);
  return <Box>Statistics {date}</Box>;
};

export default Devices;
