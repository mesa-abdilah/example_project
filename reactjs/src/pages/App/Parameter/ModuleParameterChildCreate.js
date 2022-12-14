import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import parse from 'html-react-parser';
import purify from 'dompurify';
// material
import { Alert, AlertTitle, Card, Collapse, Stack, Button, Container, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { checkAccessRights, getCurrentUser, tokenEmpty, shortCrypt } from '../../../utils/orms_commonly_script';
import { textNotifSuccesstoDB, textCancle, textSave, textAddRecord } from '../../../utils/orms_commonly_text';
import { iconCancle, iconSave } from '../../../components/Icon';
import { alertAccessDenid } from '../../../components/Common';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';

export default function ModuleParameterCreate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_module_parameter')).then((access) => {
          if (!access[0]?.support_add) {
            setLoading(true);
            alertAccessDenid();
          }
        });
      }
      setLoad(false);
    }
  }, [load]);

  const LoginSchema = Yup.object().shape({
    parameter_detail_name: Yup.string().required('Parameter Detail Name is required').max(50)
  });

  const formik = useFormik({
    initialValues: {
      fk_parameter_id: shortCrypt('decript', id),
      parameter_detail_name: '',
      parameter_detail_value: '',
      is_active: true,
      userby: getCurrentUser().userId
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setLoading(true);
      console.log(values);
      Service.insertModuleParameterDetail(values)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/module_param/child/${id}`, {
              state: { success: true, msg: textNotifSuccesstoDB }
            });
          } else if (response.data.code === 400) {
            setError(true);
            setMessage(response.data.message);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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
            <Label variant="outlined">{textAddRecord}</Label>
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

        <Card sx={{ padding: 5 }}>
          <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
              <Stack spacing={2}>
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
      </Container>
    </Page>
  );
}
