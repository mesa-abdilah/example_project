import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// @mui
import { Alert, AlertTitle, Collapse, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import parse from 'html-react-parser';
import purify from 'dompurify';
import Service from '../../../service/custom_module.service';

// ----------------------------------------------------------------------

ResetPasswordForm.propTypes = {
  onSent: PropTypes.func,
  onGetEmail: PropTypes.func
};

export default function ResetPasswordForm({ onSent, onGetEmail }) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const RegisterSchema = Yup.object().shape({
    user_email_address: Yup.string()
      .required('Email Address is required')
      .email('Email Address not valid')
      .max(164, 'Must be 164 characters or less')
  });

  const formik = useFormik({
    initialValues: {
      domin: process.env.REACT_APP_DOMAIN,
      user_email_address: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
      setLoading(true);
      Service.sendEmailReset(data)
        .then((response) => {
          console.log(response);
          if (response.data.code === 200) {
            onSent();
            onGetEmail(data.email);
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

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
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
        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Email address"
            {...getFieldProps('user_email_address')}
            error={Boolean(touched.user_email_address && errors.user_email_address)}
            helperText={touched.user_email_address && errors.user_email_address}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Reset Password
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
