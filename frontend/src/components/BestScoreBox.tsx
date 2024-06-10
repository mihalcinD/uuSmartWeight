import { Box, Stack, Typography } from '@mui/material';

type Props = {
  score: number | undefined;
  bestScore: number | undefined;
};
const BestScoreBox = ({ score, bestScore }: Props) => {
  return (
    <Stack flexDirection={'row'} gap={2} alignItems={'center'} alignSelf={'flex-end'}>
      <Typography variant={'h3'} component={'h3'} fontWeight={'bold'}>
        {score}
      </Typography>
      <Box width={2} height={50} sx={{ backgroundColor: 'primary.main' }} />
      <Stack>
        <Typography>Personal best score</Typography>
        <Typography variant={'h4'} fontWeight={'bold'}>
          {bestScore}
        </Typography>
      </Stack>
    </Stack>
  );
};
export default BestScoreBox;
