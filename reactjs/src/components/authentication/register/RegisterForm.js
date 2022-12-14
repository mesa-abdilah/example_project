import * as Yup from 'yup';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import purify from 'dompurify';
// material
import { Alert, AlertTitle, Collapse, Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Service from '../../../service/custom_module.service';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Username is required').max(16),
    fullname: Yup.string().required('Fullname is required').max(128, 'Must be 128 characters or less'),
    user_email_address: Yup.string()
      .required('Email Address is required')
      .email('Email Address not valid')
      .max(164, 'Must be 164 characters or less'),
    user_password: Yup.string()
      .required('Password is required')
      .max(32, 'Must be 32 characters or less')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ),
    confirm_password: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('user_password'), null], 'Confirm Passwords must match')
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      fullname: '',
      user_email_address: '',
      user_password: '',
      confirm_password: '',
      verify_code: Math.floor(100000 + Math.random() * 900000)
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      setLoading(true);
      Service.sendEmailVerify(values)
        .then((response) => {
          console.log(response);
          if (response.data.code === 200) {
            navigate('/verify', {
              state: { success: true, data: values },
              replace: true
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
            label="Username"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />
          <TextField
            fullWidth
            label="Fullname"
            {...getFieldProps('fullname')}
            error={Boolean(touched.fullname && errors.fullname)}
            helperText={touched.fullname && errors.fullname}
          />
          <TextField
            fullWidth
            label="Email address"
            {...getFieldProps('user_email_address')}
            error={Boolean(touched.user_email_address && errors.user_email_address)}
            helperText={touched.user_email_address && errors.user_email_address}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('user_password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.user_password && errors.user_password)}
            helperText={touched.user_password && errors.user_password}
          />

          <TextField
            fullWidth
            type={showPasswordConfirm ? 'text' : 'password'}
            label="Confirm Password"
            {...getFieldProps('confirm_password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPasswordConfirm((prev) => !prev)}>
                    <Icon icon={showPasswordConfirm ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.confirm_password && errors.confirm_password)}
            helperText={touched.confirm_password && errors.confirm_password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Register
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
