import { AppBar, Box, Button, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { useState, MouseEvent } from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useThemeContext } from '../context/ThemeContext.tsx';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import { useMeContext } from '../context/MeContext.tsx';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const pages = [
    { label: 'Home', path: '/' },
    { label: 'Statistics', path: '/statistics' },
  ];
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { toggleMode, mode } = useThemeContext();
  const { me } = useMeContext();

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <AppBar position="static" sx={{ boxShadow: 'none', borderBottom: 1, borderBottomColor: 'primary.main' }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          <FitnessCenterIcon fontSize={'large'} />
        </Stack>

        <Stack direction={'row'} gap={1} alignItems={'center'}>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}>
              {pages.map((page, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    navigate(page.path);
                    handleCloseNavMenu();
                  }}
                  selected={pathname === page.path}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Stack direction={'row'} gap={1} display={{ xs: 'none', md: 'flex' }}>
            {pages.map((page, index) => (
              <Button
                key={index}
                color={'inherit'}
                style={{ background: page.path === pathname ? 'rgba(255, 255, 255, 0.15)' : 'transparent' }}
                onClick={() => navigate(page.path)}>
                {page.label}
              </Button>
            ))}
          </Stack>
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
