import { Stack, Typography } from '@mui/material';

type Props = {
  label: string;
  value: string | number | undefined;
};
const SummaryItem = ({ label, value }: Props) => {
  return (
    <Stack spacing={1}>
      <Typography variant={'h5'} component={'h2'}>
        {label}
      </Typography>
      <Typography variant={'h2'} component={'h3'} fontWeight={'bolder'}>
        {value || 0}
      </Typography>
    </Stack>
  );
};
export default SummaryItem;
