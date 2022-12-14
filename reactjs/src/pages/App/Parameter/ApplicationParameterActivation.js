import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import parse from 'html-react-parser';
import purify from 'dompurify';
// material
import { Alert, AlertTitle, Card, Collapse, Grid, Stack, Button, Container, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  checkAccessRights,
  getCurrentUser,
  tokenEmpty,
  isBooleantoString,
  shortCrypt
} from '../../../utils/orms_commonly_script';
import {
  textCancle,
  textSave,
  textActivationRecord,
  textNotifSuccesstoDB,
  textError
} from '../../../utils/orms_commonly_text';
import { iconCancle, iconSave, arrowRight } from '../../../components/Icon';
import { alertAccessDenid } from '../../../components/Common';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';

export default function ApplicationParameterActivation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sysParId, setSysParId] = useState(0);
  const [sysParCode, setSysParCode] = useState('');
  const [sysParName, setSysParName] = useState('');
  const [sysParValue, setSysParValue] = useState('');
  const [sysParDesc, setSysParDesc] = useState('');
  const [isActive, setIsActive] = useState(false);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_system_parameter')).then((access) => {
          if (access[0]?.support_activation) {
            getData();
          } else {
            setSubmitting(true);
            alertAccessDenid();
          }
        });
      }
      setLoad(false);
    }
  }, [load]);

  const getData = () => {
    Service.getApplicationParameterBYID(id)
      .then((response) => {
        if (response.status === 200) {
          setSysParId(response.data[0].pk_system_parameter_id);
          setSysParCode(response.data[0].sys_code);
          setSysParName(response.data[0].sys_name);
          setSysParValue(response.data[0].sys_value);
          setSysParDesc(response.data[0].sys_desc);
          setIsActive(response.data[0].is_active);
        }
      })
      .catch((e) => {
        setError(true);
        if (typeof e?.response !== 'undefined') {
          setMessage(e.response?.data?.message);
        } else {
          setMessage(e.toString());
        }
      });
  };

  const formik = useFormik({
    initialValues: {},
    onSubmit: () => {
      setSubmitting(true);
      const data = {
        pk_system_parameter_id: sysParId,
        is_active: !isActive,
        userby: getCurrentUser().userId
      };
      Service.activationApplicationParameter(data)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/application_parameter`, {
              state: { success: true, msg: textNotifSuccesstoDB },
              replace: true
            });
          } else if (response.data.code === 400) {
            setError(true);
            setMessage(response.data.message);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
          setSubmitting(false);
        })
        .catch((e) => {
          setError(true);
          if (typeof e?.response !== 'undefined') {
            setMessage(e.response?.data?.message);
          } else {
            setMessage(e.toString());
          }
          setSubmitting(false);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    }
  });

  const { handleSubmit } = formik;

  return (
    <Page title="ORMs Application Parameter Activation">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Application Parameter
          </Typography>
          <Typography variant="caption" display="block">
            <Label variant="outlined">{textActivationRecord}</Label>
          </Typography>
        </Stack>

        <Collapse in={error}>
          <Alert
            severity="error"
            sx={{ mb: 5 }}
            onClose={() => {
              setError(false);
            }}
          >
            <AlertTitle>{textError}</AlertTitle>
            {parse(purify.sanitize(message))}
          </Alert>
        </Collapse>

        <Card sx={{ padding: 5 }}>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Setting Code
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {sysParCode}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Setting Name
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {sysParName}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Setting Value
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {sysParValue}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Notes
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {sysParDesc}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Activation
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {isBooleantoString(isActive)}
                      <Icon icon={arrowRight} style={{ marginLeft: 5, marginRight: 5, marginBottom: -1 }} />
                      {isBooleantoString(!isActive)}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>

              <LoadingButton
                style={{ float: 'right', marginTop: 50 }}
                size="medium"
                type="submit"
                variant="contained"
                loadingPosition="start"
                startIcon={<Icon icon={iconSave} />}
                loading={submitting}
              >
                {textSave}
              </LoadingButton>
              <Button
                style={{ float: 'right', marginTop: 50, marginRight: 10 }}
                size="medium"
                type="button"
                startIcon={<Icon icon={iconCancle} />}
                onClick={() => navigate(-1)}
              >
                {textCancle}
              </Button>
            </Form>
          </FormikProvider>
        </Card>
      </Container>
    </Page>
  );
}
