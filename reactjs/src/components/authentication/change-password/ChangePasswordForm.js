import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// @mui
import { Alert, AlertTitle, Collapse, Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import dateFormat from 'dateformat';
import parse from 'html-react-parser';
import purify from 'dompurify';
import Service from '../../../service/custom_module.service';
import { shortCrypt } from '../../../utils/orms_commonly_script';

// ----------------------------------------------------------------------

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const { valid, id } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const RegisterSchema = Yup.object().shape({
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
      user_id: id,
      user_password: '',
      confirm_password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
      const now = new Date();
      setLoading(true);
      if (Number(dateFormat(now, 'yyyymmdd')) === Number(shortCrypt('decript', valid))) {
        Service.sendChangePassword(data)
          .then((response) => {
            if (response.data.code === 200) {
              navigate('/login', {
                state: { success: true, msg: 'Successfully change password' },
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
      } else {
        setError(true);
        setMessage('Change Password Expired. Reapply!');
      }
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
            Change Password
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
