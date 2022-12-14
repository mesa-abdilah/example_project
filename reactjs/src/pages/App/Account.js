import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
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
  Container,
  IconButton,
  InputAdornment,
  Typography,
  TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { tokenEmpty, getCurrentUser, shortCrypt } from '../../utils/orms_commonly_script';
import { textSave } from '../../utils/orms_commonly_text';
import { iconSave, iconShow, iconHide } from '../../components/Icon';
import Service from '../../service/custom_module.service';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';

export default function UserCreate() {
  const { enqueueSnackbar } = useSnackbar();
  const [loadUserID, setUserID] = useState('');
  const [loadFullname, setFullname] = useState('');
  const [loadUsername, setUsername] = useState('');
  const [loadEmail, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [loadEdit, setLoadEdit] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        getUserBYID();
      }
      setLoad(false);
    }
  }, [load]);

  const getUserBYID = () => {
    Service.getAccount(shortCrypt('encrypt', getCurrentUser()?.userId))
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setUserID(response.data[0].userid);
          setFullname(response.data[0].fullname);
          setUsername(response.data[0].username);
          setEmail(response.data[0].user_email_address);
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
    username: Yup.string().required('Username is required').max(16),
    user_password: Yup.string()
      .max(32, 'Must be 32 characters or less')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ),
    confirm_password: Yup.string().oneOf([Yup.ref('user_password'), null], 'Confirm Passwords must match'),
    fullname: Yup.string().required('Fullname is required').max(128, 'Must be 128 characters or less'),
    user_email_address: Yup.string()
      .required('Email Address is required')
      .email('Email Address not valid')
      .max(164, 'Must be 164 characters or less')
  });

  const formik = useFormik({
    initialValues: {
      userid: loadUserID,
      fullname: loadFullname,
      username: loadUsername,
      user_password: '',
      confirm_password: '',
      user_email_address: loadEmail,
      userby: getCurrentUser().userId
    },
    enableReinitialize: true,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setLoading(true);
      Service.updateAccount(values)
        .then((response) => {
          if (response.data.code === 200) {
            enqueueSnackbar('Successfully update account', { variant: 'success' });
            getUserBYID();
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
          setLoading(false);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };

  return (
    <Page title="ORMs User Edit">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Account
          </Typography>
          <Typography variant="caption" display="block">
            <Label variant="outlined">Edit Record</Label>
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
                  <TextField
                    fullWidth
                    disabled
                    autoComplete="userid"
                    type="text"
                    label="UserID"
                    {...getFieldProps('userid')}
                    error={Boolean(touched.userid && errors.userid)}
                    helperText={touched.userid && errors.userid}
                  />
                  <TextField
                    fullWidth
                    autoComplete="username"
                    type="text"
                    label="Username"
                    disabled={loading}
                    {...getFieldProps('username')}
                    error={Boolean(touched.username && errors.username)}
                    helperText={touched.username && errors.username}
                  />
                  <TextField
                    fullWidth
                    autoComplete="fullname"
                    type="text"
                    label="Fullname"
                    disabled={loading}
                    {...getFieldProps('fullname')}
                    error={Boolean(touched.fullname && errors.fullname)}
                    helperText={touched.fullname && errors.fullname}
                  />
                  <TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    disabled={loading}
                    {...getFieldProps('user_password')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowPassword} edge="end">
                            <Icon icon={showPassword ? iconShow : iconHide} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.user_password && errors.user_password)}
                    helperText={touched.user_password && errors.user_password}
                  />
                  <TextField
                    fullWidth
                    autoComplete="current-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Confirm Password"
                    disabled={loading}
                    {...getFieldProps('confirm_password')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={handleShowConfirmPassword} edge="end">
                            <Icon icon={showConfirmPassword ? iconShow : iconHide} />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(touched.confirm_password && errors.confirm_password)}
                    helperText={touched.confirm_password && errors.confirm_password}
                  />
                  <TextField
                    fullWidth
                    autoComplete="user_email_address"
                    type="email"
                    label="Email Address"
                    disabled={loading}
                    {...getFieldProps('user_email_address')}
                    error={Boolean(touched.user_email_address && errors.user_email_address)}
                    helperText={touched.user_email_address && errors.user_email_address}
                  />
                </Stack>
                <LoadingButton
                  style={{ float: 'right', marginTop: 20 }}
                  size="medium"
                  type="submit"
                  variant="contained"
                  startIcon={<Icon icon={iconSave} />}
                  loading={loading}
                >
                  {textSave}
                </LoadingButton>
              </Form>
            </FormikProvider>
          </Card>
        )}
      </Container>
    </Page>
  );
}
