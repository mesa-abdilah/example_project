import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function ApplicationParameterCreate() {
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_system_parameter')).then((access) => {
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
    sys_name: Yup.string().required('Setting Name is required').max(50),
    sys_value: Yup.string().required('Setting Value is required').max(8000)
  });

  const formik = useFormik({
    initialValues: {
      sys_name: '',
      sys_value: '',
      sys_desc: '',
      is_active: true,
      userby: getCurrentUser().userId
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setLoading(true);
      Service.insertApplicationParameter(values)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/application_parameter`, {
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
    <Page title="ORMs Application Parameter">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Application Parameter
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
      </Container>
    </Page>
  );
}
