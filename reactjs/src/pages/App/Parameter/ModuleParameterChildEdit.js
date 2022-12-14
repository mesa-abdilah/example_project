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

export default function ModuleParameterEdit() {
  const navigate = useNavigate();
  const { id, param } = useParams();
  const [parameterId, setParameterId] = useState(0);
  const [parameterCode, setParameterCode] = useState('');
  const [parameterName, setParameterName] = useState('');
  const [parameterValue, setParameterValue] = useState('');

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [loadEdit, setLoadEdit] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_module_parameter')).then((access) => {
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
    Service.getModuleParameterDetailBYID(id)
      .then((response) => {
        if (response.status === 200) {
          setParameterId(response.data[0].pk_parameter_detail_id);
          setParameterCode(response.data[0].parameter_detail_code);
          setParameterName(response.data[0].parameter_detail_name);
          setParameterValue(response.data[0].parameter_detail_value);
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
    parameter_detail_name: Yup.string().required('Parameter Detail Name is required').max(50)
  });

  const formik = useFormik({
    initialValues: {
      pk_parameter_detail_id: parameterId,
      fk_parameter_id: shortCrypt('decript', param),
      parameter_detail_name: parameterName,
      parameter_detail_value: parameterValue,
      userby: getCurrentUser().userId
    },
    enableReinitialize: true,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setLoading(true);
      console.log(values);
      Service.updateModuleParameterDetail(values)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/module_param/child/${param}`, {
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
    <Page title="ORMs Module Parameter">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Module Parameter Detail
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
                        Parameter Detail Code
                      </Typography>
                    </Grid>
                    <Grid item xs={8} md={9}>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                        {parameterCode}
                      </Typography>
                    </Grid>
                  </Grid>
                  <TextField
                    fullWidth
                    autoComplete="parameter_detail_name"
                    type="text"
                    label="Parameter Detail Name"
                    disabled={loading}
                    {...getFieldProps('parameter_detail_name')}
                    error={Boolean(touched.parameter_detail_name && errors.parameter_detail_name)}
                    helperText={touched.parameter_detail_name && errors.parameter_detail_name}
                  />
                  <TextField
                    fullWidth
                    autoComplete="parameter_detail_value"
                    multiline
                    rows={4}
                    label="Parameter Detail Value"
                    disabled={loading}
                    {...getFieldProps('parameter_detail_value')}
                    error={Boolean(touched.parameter_detail_value && errors.parameter_detail_value)}
                    helperText={touched.parameter_detail_value && errors.parameparameter_detail_valueter_desc}
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
