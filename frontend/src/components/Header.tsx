import { AppBar, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { useState, MouseEvent } from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useThemeContext } from '../context/ThemeContext.tsx';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useMeContext } from '../context/MeContext.tsx';

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { toggleMode, mode } = useThemeContext();
  const { me } = useMeContext();

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

        <Stack direction={'row'} gap={1}>
          <IconButton size="large" onClick={toggleMode} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton
            size="large"
            aria-label="Home page"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            onClick={handleOpenUserMenu}>
            <PermIdentityOutlinedIcon />
          </IconButton>
        </Stack>

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
          {me && (
            <MenuItem onClick={() => {}}>
              <Typography textAlign="center">{me.email}</Typography>
            </MenuItem>
          )}
          <MenuItem onClick={() => {}}>
            <Typography textAlign="center">{me ? 'Logout' : 'Login'}</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
