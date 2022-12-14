import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import { LoginForm } from '../components/authentication/login';
import AuthSocial from '../components/authentication/AuthSocial';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Login() {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      successAlert();
      setLoad(false);
    }
  }, [load]);

  const successAlert = () => {
    if (location.state?.success) {
      window.history.replaceState({}, null);
      enqueueSnackbar(location.state?.msg, { variant: 'success' });
    }
  };
  return (
    <RootStyle title="Login | Aitigik">
      <AuthLayout>
        Don’t have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          Register
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Sign in to Aitigik
            </Typography>
            {/* <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography> */}
          </Stack>
          <AuthSocial />
          <LoginForm />
          <MHidden width="smUp">
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                textAlign: 'center'
              }}
            >
              Don’t have an account? &nbsp;
              <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
                Register
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
