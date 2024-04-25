import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../components/ContentWrapper.tsx';

const SetDetail = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <ContentWrapper>
      <Typography variant={'h3'} component={'h1'}>
        Set detail {id}
      </Typography>
    </ContentWrapper>
  );
};
export default SetDetail;
