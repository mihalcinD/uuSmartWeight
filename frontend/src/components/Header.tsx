import { AppBar, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { useState, MouseEvent } from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar position="static" sx={{ boxShadow: 'none' }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          <FitnessCenterIcon fontSize={'large'} />
          <Typography variant={'h5'} component={'h1'} style={{ fontWeight: '800' }}>
            uuSmartWeight
          </Typography>
        </Stack>

        <IconButton
          size="large"
          aria-label="Home page"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
          onClick={handleOpenUserMenu}>
          <PermIdentityOutlinedIcon />
        </IconButton>

        <Menu
          sx={{ mt: '45px' }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}>
          <MenuItem onClick={() => {}}>
            <Typography textAlign="center">email@domain.com</Typography>
          </MenuItem>
          <MenuItem onClick={() => {}}>
            <Typography textAlign="center">Logout</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
