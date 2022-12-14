import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useLocation } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Alert, AlertTitle, Collapse, Box, Button, Link, Container, Typography } from '@mui/material';
import parse from 'html-react-parser';
import purify from 'dompurify';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
// sections
import { VerifyCodeForm } from '../components/authentication/verify-code';
import Service from '../service/custom_module.service';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function VerifyCode() {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const [data, setData] = useState({});
  const [load, setLoad] = useState(true);
  const [countDown, setCountDown] = useState(0);
  const [runTimer, setRunTimer] = useState(false);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    if (load) {
      if (location.state?.success) {
        setData(location.state?.data);
      }
      setRunTimer(true);
      setLoad(false);
    }
  }, [load]);

  useEffect(() => {
    let timerId;
    if (runTimer) {
      setCountDown(60 * 2);
      timerId = setInterval(() => {
        setCountDown((countDown) => countDown - 1);
      }, 1000);
    } else {
      clearInterval(timerId);
    }
    return () => clearInterval(timerId);
  }, [runTimer]);

  useEffect(() => {
    if (countDown < 0 && runTimer) {
      console.log('expired');
      setRunTimer(false);
      setCountDown(0);
    }
  }, [countDown, runTimer]);
  const seconds = String(countDown % 60).padStart(2, 0);
  const minutes = String(Math.floor(countDown / 60)).padStart(2, 0);

  const resendCode = () => {
    if (!runTimer) {
      Service.sendEmailVerify(data)
        .then((response) => {
          console.log(response);
          if (response.data.code === 200) {
            enqueueSnackbar('Verify Code resend successfully', { variant: 'info' });
            setRunTimer(true);
            setCountDown(60 * 2);
          } else if (response.data.code === 400) {
            setError(true);
            setMessage(response.data.message);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
        })
        .catch((e) => {
          setError(true);
          if (typeof e?.response !== 'undefined') {
            setMessage(e.response?.data?.message);
          } else {
            setMessage(e.toString());
          }
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    }
  };

  return (
    <Page title="Verify" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: 'auto' }}>
            <Button
              size="small"
              component={RouterLink}
              to="/register"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={20} height={20} />}
              sx={{ mb: 3 }}
            >
              Back
            </Button>
            <Typography variant="h3" paragraph>
              Please check your email!
            </Typography>
            {data ? (
              <Typography sx={{ color: 'text.secondary' }}>
                We have emailed a 6-digit confirmation code to {data?.user_email_address}, please enter the code in below box
                to verify your email.
              </Typography>
            ) : (
              <Typography sx={{ color: 'text.danger' }}>verify code expired</Typography>
            )}
            <Box sx={{ mt: 5, mb: 3 }}>
              <VerifyCodeForm dataRegister={data} />
            </Box>
            <Collapse in={error}>
              <Alert
                severity="error"
                sx={{ mb: 5 }}
                onClose={() => {
                  setError(false);
                }}
              >
                <AlertTitle>Error</AlertTitle>
                {parse(purify.sanitize(message))}
              </Alert>
            </Collapse>
            {runTimer ? (
              <Typography variant="subtitle1" align="center" style={{ marginBottom: 5 }}>
                {minutes}:{seconds}
              </Typography>
            ) : (
              <Typography variant="body2" align="center">
                Don’t have a code? &nbsp;
                <Link
                  style={{ cursor: !runTimer ? 'pointer' : 'text' }}
                  variant="subtitle2"
                  underline="none"
                  onClick={() => resendCode()}
                >
                  Resend code
                </Link>
              </Typography>
            )}
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
