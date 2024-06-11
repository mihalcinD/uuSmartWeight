import { Box, Skeleton, Stack, Typography } from '@mui/material';

type Props = {
  score: number | undefined;
  bestScore: number | undefined;
  isLoading?: boolean;
};
const BestScoreBox = ({ score, bestScore, isLoading }: Props) => {
  return (
    <Stack flexDirection={'row'} gap={2} alignItems={'center'} alignSelf={'flex-end'}>
      {isLoading ? (
        <Skeleton variant={'rounded'} width={60} height={45} />
      ) : (
        <Typography variant={'h3'} component={'h3'} fontWeight={'bold'}>
          {score ?? 0}
        </Typography>
      )}
      <Box width={2} height={50} sx={{ backgroundColor: 'primary.main' }} />
      <Stack gap={isLoading ? 1 : 0}>
        {isLoading ? (
          <>
            <Skeleton variant={'rounded'} width={140} height={18} />
            <Skeleton variant={'rounded'} width={60} height={32} />
          </>
        ) : (
          <>
            <Typography>Personal best score</Typography>
            <Typography variant={'h4'} fontWeight={'bold'}>
              {bestScore ?? 0}
            </Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
};
export default BestScoreBox;
