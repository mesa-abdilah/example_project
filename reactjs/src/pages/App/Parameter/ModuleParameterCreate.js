import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import parse from 'html-react-parser';
import purify from 'dompurify';
// material
import {
  Alert,
  AlertTitle,
  Card,
  Collapse,
  Stack,
  Button,
  Container,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { checkAccessRights, getCurrentUser, tokenEmpty, shortCrypt } from '../../../utils/orms_commonly_script';
import { textNotifSuccesstoDB, textCancle, textSave, textAddRecord } from '../../../utils/orms_commonly_text';
import { iconCancle, iconSave, check, checked } from '../../../components/Icon';
import { alertAccessDenid } from '../../../components/Common';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';

export default function ModuleParameterCreate() {
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
    parameter_code: Yup.string()
      .required('Parameter Code is required')
      .max(8)
      .matches(/^(\S+$)/, 'This field cannot contain blankspaces')
      .matches(/^[A-Z\s]+$/, 'Only uppercase are allowed for this field'),
    parameter_name: Yup.string().required('Parameter Name is required').max(50)
  });

  const formik = useFormik({
    initialValues: {
      parameter_code: '',
      parameter_name: '',
      parameter_desc: '',
      use_in_module: false,
      is_active: true,
      userby: getCurrentUser().userId
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setLoading(true);
      Service.insertModuleParameter(values)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/module_param`, {
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
            Module Parameter
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
                  autoComplete="parameter_code"
                  type="text"
                  label="Parameter Code"
                  disabled={loading}
                  {...getFieldProps('parameter_code')}
                  error={Boolean(touched.parameter_code && errors.parameter_code)}
                  helperText={touched.parameter_code && errors.parameter_code}
                />
                <TextField
                  fullWidth
                  autoComplete="parameter_name"
                  type="text"
                  label="Parameter Name"
                  disabled={loading}
                  {...getFieldProps('parameter_name')}
                  error={Boolean(touched.parameter_name && errors.parameter_name)}
                  helperText={touched.parameter_name && errors.parameter_name}
                />
                <TextField
                  fullWidth
                  autoComplete="parameter_desc"
                  multiline
                  rows={4}
                  label="Parameter Description"
                  disabled={loading}
                  {...getFieldProps('parameter_desc')}
                  error={Boolean(touched.parameter_desc && errors.parameter_desc)}
                  helperText={touched.parameter_desc && errors.parameter_desc}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      {...getFieldProps('use_in_module')}
                      icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
                      checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                  label="In Use Module?"
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
