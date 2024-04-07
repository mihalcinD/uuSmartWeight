import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';

const SetDetail = () => {
  const { id } = useParams<{ id: string }>();
  return <Box>Set detail {id}</Box>;
};
export default SetDetail;
