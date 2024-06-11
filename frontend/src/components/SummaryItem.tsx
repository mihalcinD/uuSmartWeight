import { Skeleton, Stack, Typography } from '@mui/material';

type Props = {
  label: string;
  value: string | number | undefined;
  small?: boolean;
  isLoading?: boolean;
};
const SummaryItem = ({ label, value, small, isLoading }: Props) => {
  return (
    <Stack spacing={1}>
      {isLoading ? (
        <>
          <Skeleton variant={'rounded'} width={small ? 150 : 170} height={small ? 24 : 28} />
          <Skeleton variant={'rounded'} width={small ? 120 : 200} height={small ? 50 : 65} />
        </>
      ) : (
        <>
          <Typography variant={small ? 'h6' : 'h5'} component={'h2'}>
            {label}
          </Typography>
          <Typography variant={small ? 'h3' : 'h2'} component={'h3'} fontWeight={'bolder'}>
            {value || 0}
          </Typography>
        </>
      )}
    </Stack>
  );
};
export default SummaryItem;
