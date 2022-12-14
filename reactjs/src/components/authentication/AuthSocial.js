import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import GoogleLogin from 'react-google-login';
import { gapi } from 'gapi-script';
import googleFill from '@iconify/icons-eva/google-fill';
// material
import { Stack, Button, Divider, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_KEY,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
  });
  const onSuccess = (res) => {
    console.log('success', res.profileObj);
  };

  const onFailure = (err) => {
    console.log('failed', err);
  };
  return (
    <>
      <Stack direction="row" spacing={2}>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_KEY}
          render={(renderProps) => (
            <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <Icon icon={googleFill} color="#DF3E30" height={24} />
            </Button>
          )}
          buttonText="Login"
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy="single_host_origin"
        />
        {/* <Button fullWidth size="large" color="inherit" variant="outlined">
          <Icon icon={facebookFill} color="#1877F2" height={24} />
        </Button>

        <Button fullWidth size="large" color="inherit" variant="outlined">
          <Icon icon={twitterFill} color="#1C9CEA" height={24} />
        </Button> */}
      </Stack>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          OR
        </Typography>
      </Divider>
    </>
  );
}
