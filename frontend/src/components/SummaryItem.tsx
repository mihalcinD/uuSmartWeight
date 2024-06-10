import { Stack, Typography } from '@mui/material';

type Props = {
  label: string;
  value: string | number | undefined;
  small?: boolean;
};
const SummaryItem = ({ label, value, small }: Props) => {
  return (
    <Stack spacing={1}>
      <Typography variant={small ? 'h6' : 'h5'} component={'h2'}>
        {label}
      </Typography>
      <Typography variant={small ? 'h3' : 'h2'} component={'h3'} fontWeight={'bolder'}>
        {value || 0}
      </Typography>
    </Stack>
  );
};
export default SummaryItem;
