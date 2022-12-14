import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import Page from '../components/Page';
// sections
import { ChangePasswordForm } from '../components/authentication/change-password';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function ResetPassword() {
  return (
    <Page title="Reset Password" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <Typography variant="h3" paragraph>
              Change Password
            </Typography>

            <ChangePasswordForm />

            <Button fullWidth size="large" component={RouterLink} to="/login" sx={{ mt: 1 }}>
              Back
            </Button>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
