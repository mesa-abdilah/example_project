import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import parse from 'html-react-parser';
import purify from 'dompurify';
// material
import { Alert, AlertTitle, Card, Collapse, Stack, Grid, Button, Container, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { checkAccessRights, getCurrentUser, tokenEmpty, shortCrypt } from '../../../utils/orms_commonly_script';
import { textNotifSuccesstoDB, textCancle, textSave, textEditRecord } from '../../../utils/orms_commonly_text';
import { iconCancle, iconSave } from '../../../components/Icon';
import { alertAccessDenid } from '../../../components/Common';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';

export default function ApplicationParameterEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [sysParId, setSysParId] = useState(0);
  const [sysParCode, setSysParCode] = useState('');
  const [sysParName, setSysParName] = useState('');
  const [sysParValue, setSysParValue] = useState('');
  const [sysParDesc, setSysParDesc] = useState('');

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [loadEdit, setLoadEdit] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_system_parameter')).then((access) => {
          if (access[0]?.support_edit) {
            getData();
          } else {
            setLoading(true);
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
          setLoadEdit(true);
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

  const LoginSchema = Yup.object().shape({
    sys_name: Yup.string().required('Setting Name is required').max(50),
    sys_value: Yup.string().required('Setting Value is required').max(8000)
  });

  const formik = useFormik({
    initialValues: {
      pk_system_parameter_id: sysParId,
      sys_name: sysParName,
      sys_value: sysParValue,
      sys_desc: sysParDesc,
      userby: getCurrentUser().userId
    },
    enableReinitialize: true,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setLoading(true);
      Service.updateApplicationParameter(values)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/application_parameter`, {
              state: { success: true, msg: textNotifSuccesstoDB }
            });
          } else if (response.data.code === 400) {
            setError(true);
            setLoading(false);
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
          setLoading(false);
        });
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  return (
    <Page title="ORMs Application Parameter">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Application Parameter
          </Typography>
          <Typography variant="caption" display="block">
            <Label variant="outlined">{textEditRecord}</Label>
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
            <AlertTitle>Error</AlertTitle>
            {parse(purify.sanitize(message))}
          </Alert>
        </Collapse>
        {loadEdit && (
          <Card sx={{ padding: 5 }}>
            <FormikProvider value={formik}>
              <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
                  <TextField
                    fullWidth
                    autoComplete="sys_name"
                    type="text"
                    label="Setting Name"
                    disabled={loading}
                    {...getFieldProps('sys_name')}
                    error={Boolean(touched.sys_name && errors.sys_name)}
                    helperText={touched.sys_name && errors.sys_name}
                  />
                  <TextField
                    fullWidth
                    autoComplete="sys_value"
                    multiline
                    rows={4}
                    label="Setting Value"
                    disabled={loading}
                    {...getFieldProps('sys_value')}
                    error={Boolean(touched.sys_value && errors.sys_value)}
                    helperText={touched.sys_value && errors.sys_value}
                  />
                  <TextField
                    fullWidth
                    autoComplete="sys_desc"
                    multiline
                    rows={4}
                    label="Notes"
                    disabled={loading}
                    {...getFieldProps('sys_desc')}
                    error={Boolean(touched.sys_desc && errors.sys_desc)}
                    helperText={touched.sys_desc && errors.sys_desc}
                  />
                </Stack>
                <LoadingButton
                  style={{ float: 'right', marginTop: 20 }}
                  size="medium"
                  type="submit"
                  variant="contained"
                  startIcon={<Icon icon={iconSave} />}
                  disabled={loading}
                  loading={isSubmitting}
                >
                  {textSave}
                </LoadingButton>
                <Button
                  style={{ float: 'right', marginTop: 20, marginRight: 10 }}
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
        )}
      </Container>
    </Page>
  );
}
