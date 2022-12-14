import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// components
import MyAvatar from '../../components/MyAvatar';
import { getCurrentUser } from '../../utils/orms_commonly_script';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter
  })
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool
};

export default function NavbarAccount({ isCollapse }) {
  return (
    <Link underline="none" color="inherit" component={RouterLink} to={`/${process.env.REACT_APP_BASE_URL}/account`}>
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent'
          })
        }}
      >
        <MyAvatar />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0
            })
          }}
        >
          <Typography variant="subtitle2" noWrap>
            {getCurrentUser().fullname}
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {getCurrentUser().groupMenuName}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}
