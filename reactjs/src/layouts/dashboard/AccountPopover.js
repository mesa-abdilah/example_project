import { useRef, useState } from 'react';
import personFill from '@iconify/icons-eva/person-fill';
import settings2Fill from '@iconify/icons-eva/settings-2-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha } from '@mui/material/styles';
import { Box, Divider, MenuItem, Typography, Stack } from '@mui/material';
import AuthService from '../../service/auth.service';
import { getCurrentUser } from '../../utils/orms_commonly_script';
// components
import MyAvatar from '../../components/MyAvatar';
import MenuPopover from '../../components/MenuPopover';
import { IconButtonAnimate } from '../../components/animate';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: personFill,
    linkTo: `/${process.env.REACT_APP_BASE_URL}/dashboard`
  },
  {
    label: 'Account',
    icon: settings2Fill,
    linkTo: `/${process.env.REACT_APP_BASE_URL}/account`
  }
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <>
      <IconButtonAnimate
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
            }
          })
        }}
      >
        <MyAvatar />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={anchorRef.current}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75
          }
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {getCurrentUser().fullname}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {getCurrentUser().roleName}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} to={option.linkTo} component={RouterLink} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </MenuPopover>
    </>
  );
}
