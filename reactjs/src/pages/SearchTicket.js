import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Alert, AlertTitle, Collapse, Box, Button, Card, Stack, Container, Typography, OutlinedInput } from '@mui/material';
import parse from 'html-react-parser';
import purify from 'dompurify';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// components
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import Image from '../components/Image';
import LoadingScreen from '../components/LoadingScreen';
// sections
import AnalyticsOrderTimeline from './Custom/OrderList/section/AnalyticsOrderTimeline';
import { shortCrypt } from '../utils/orms_commonly_script';
import Service from '../service/custom_module.service';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  height: '100%',
  alignItems: 'center',
  padding: theme.spacing(12, 0)
}));

const ContentStyle = styled(Card)(({ theme }) => ({
  marginTop: -120,
  boxShadow: 'none',
  padding: theme.spacing(5),
  paddingTop: theme.spacing(16),
  color: theme.palette.common.white,
  backgroundImage: `linear-gradient(135deg,
    ${theme.palette.primary.main} 0%,
    ${theme.palette.primary.dark} 100%)`
}));

// ----------------------------------------------------------------------

export default function VerifyCode() {
  const { enqueueSnackbar } = useSnackbar();
  const [data, setData] = useState([]);
  const [keyword, setKeyword] = useState('');

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const getDataListOrderStatus = (no_ticket) => {
    setLoading(true);
    Service.searchDataListOrderStatus(shortCrypt('encrypt', no_ticket))
      .then((response) => {
        if (response.status === 200) {
          setData(response.data);
          if (response.data.length === 0) {
            enqueueSnackbar('No Ticket not found', { variant: 'warning' });
          }
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(true);
        if (typeof e?.response !== 'undefined') {
          setMessage(e.response?.data?.message);
        } else {
          setMessage(e.toString());
        }
        setLoading(false);
      });
  };

  return (
    <Page title="Verify" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />
        {loading && <LoadingScreen isDashboard={Boolean(false)} />}
        <Container>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Button
              size="small"
              component={RouterLink}
              to="/login"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={20} height={20} />}
              sx={{ mb: 3 }}
            >
              Back
            </Button>

            <div>
              <Image
                crossOrigin="anonymous"
                visibleByDefault
                disabledEffect
                src="https://minimal-assets-api.vercel.app/assets/illustrations/illustration_invite.png"
                sx={{
                  left: 40,
                  zIndex: 9,
                  width: 140,
                  position: 'relative',
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.24))'
                }}
              />
              <ContentStyle>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="h4">Search Ticket</Typography>
                  {/* <Typography variant="h2">$50</Typography> */}
                </Stack>

                <Typography variant="body2" sx={{ mt: 2, mb: 3 }}>
                  Pencarian status tiket terakhir:
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                  <OutlinedInput
                    size="small"
                    placeholder="No Ticket"
                    value={keyword}
                    sx={{
                      width: 1,
                      color: 'common.white',
                      fontWeight: 'fontWeightMedium',
                      bgcolor: (theme) => alpha(theme.palette.common.black, 0.16),
                      '& input::placeholder': {
                        color: (theme) => alpha(theme.palette.common.white, 0.48)
                      },
                      '& fieldset': { display: 'none' }
                    }}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                  <Button color="warning" variant="contained" onClick={() => getDataListOrderStatus(keyword)}>
                    Cari
                  </Button>
                </Stack>
              </ContentStyle>
              <br />
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
              <AnalyticsOrderTimeline OrderList={data} />
              <br />
            </div>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
