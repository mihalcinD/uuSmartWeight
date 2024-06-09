import { AppBar, Box, Button, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import { useState, MouseEvent, useMemo } from 'react';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import MenuIcon from '@mui/icons-material/Menu';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { PageConfig, routesConfig } from '../routes/config.ts';
import { useAppDispatch, useAppSelector } from '../store/hooks.ts';
import { selectMode, toggleMode } from '../store/themeSlice.ts';
import { selectMe } from '../store/meSlice.ts';

const Header = () => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectMode);
  const me = useAppSelector(selectMe);
  const menuItems = useMemo(() => Object.values(routesConfig).filter(route => route.showInMenu), []);

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

  const navigateWithParams = ({ path, search }: PageConfig) => {
    navigate({
      pathname: path,
      search: search ? createSearchParams(search).toString() : undefined,
    });
  };
  return (
    <AppBar position="static" sx={{ boxShadow: 'none', borderBottom: 0.5, borderBottomColor: 'primary.main' }}>
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
              {menuItems.map((page, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    navigateWithParams(page);
                    handleCloseNavMenu();
                  }}
                  selected={pathname === page.path}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Stack direction={'row'} gap={1} display={{ xs: 'none', md: 'flex' }}>
            {menuItems.map((page, index) => (
              <Button
                key={index}
                color={'inherit'}
                style={{ background: page.path === pathname ? 'rgba(255, 255, 255, 0.15)' : 'transparent' }}
                onClick={() => navigateWithParams(page)}>
                {page.label}
              </Button>
            ))}
          </Stack>
          <IconButton size="large" onClick={() => dispatch(toggleMode())} color="inherit">
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
