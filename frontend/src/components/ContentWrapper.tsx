import { Box } from '@mui/material';
import { JSX } from 'react';

type Props = { children: JSX.Element | JSX.Element[] };

const HORIZONTAL_PADDING = { xs: 2, md: 5 };
const VERTICAL_PADDING = 5;

const ContentWrapper = ({ children }: Props) => {
  return (
    <Box display={'flex'} flexDirection={'column'} px={HORIZONTAL_PADDING} py={VERTICAL_PADDING} gap={2.5}>
      {children}
    </Box>
  );
};

export default ContentWrapper;
