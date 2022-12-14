import * as Yup from 'yup';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  IconButton,
  InputAdornment,
  Typography,
  FormHelperText,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { checkAccessRights, shortCrypt, tokenEmpty, getCurrentUser } from '../../../utils/orms_commonly_script';
import { textCancle, textSave } from '../../../utils/orms_commonly_text';
import { iconCancle, iconSave, iconShow, iconHide } from '../../../components/Icon';
import { alertAccessDenid } from '../../../components/Common';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';

export default function UserCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [pkUserId, setPkUserId] = useState(0);
  const [loadUserID, setUserID] = useState('');
  const [loadFullname, setFullname] = useState('');
  const [loadUsername, setUsername] = useState('');
  const [loadEmail, setEmail] = useState('');
  const [loadRole, setRole] = useState('');
  const [loadGroupMenu, setGroupMenu] = useState('');
  const [listRole, setListRole] = useState([]);
  const [listGroupMenu, setListGroupMenu] = useState([]);
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
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_user')).then((access) => {
          if (access[0]?.support_edit) {
            getRole();
            getGroupMenu();
            getUserBYID();
          } else {
            setLoading(true);
            alertAccessDenid();
          }
        });
      }
      setLoad(false);
    }
  }, [load]);

  const getUserBYID = () => {
    Service.getUserBYID(id)
      .then((response) => {
        if (response.status === 200) {
          setPkUserId(response.data[0].pk_user_id);
          setUserID(response.data[0].userid);
          setFullname(response.data[0].fullname);
          setUsername(response.data[0].username);
          setEmail(response.data[0].user_email_address);
          setRole(response.data[0].fk_role_id);
          setGroupMenu(response.data[0].fk_group_menu_id);
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

  const getRole = () => {
    Service.getRoleActive()
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setListRole(response.data);
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

  const getGroupMenu = () => {
    Service.getGroupMenuActive()
      .then((response) => {
        if (response.status === 200) {
          setListGroupMenu(response.data);
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
      .max(164, 'Must be 164 characters or less'),
    fk_role_id: Yup.string().required('Role is required'),
    fk_group_menu_id: Yup.string().required('Group Menu is required')
  });

  const formik = useFormik({
    initialValues: {
      pk_user_id: pkUserId,
      userid: loadUserID,
      fullname: loadFullname,
      username: loadUsername,
      user_password: '',
      confirm_password: '',
      user_email_address: loadEmail,
      fk_role_id: loadRole,
      fk_group_menu_id: loadGroupMenu,
      userby: getCurrentUser().userId
    },
    enableReinitialize: true,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      Service.userUpdate(values)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/user`, {
              state: { success: true, msg: 'Successfully saved into database' }
            });
          } else if (response.data.code === 400) {
            setError(true);
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
        });
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

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
            Users
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
                  <FormControl fullWidth sx={{ marginBottom: 2 }} error={Boolean(touched.fk_role_id && errors.fk_role_id)}>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Role"
                      disabled={loading}
                      {...getFieldProps('fk_role_id')}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {listRole.map((data) => (
                        <MenuItem key={data.pk_role_id} value={data.pk_role_id}>
                          {data.role_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.fk_role_id ? <FormHelperText>{errors.fk_role_id}</FormHelperText> : null}
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    error={Boolean(touched.fk_group_menu_id && errors.fk_group_menu_id)}
                  >
                    <InputLabel id="demo-simple-select-label">Group Menu</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Group Menu"
                      {...getFieldProps('fk_group_menu_id')}
                      onChange={(e) => setGroupMenu(e.target.value)}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {listGroupMenu.map((data) => (
                        <MenuItem key={data.pk_group_menu_id} value={data.pk_group_menu_id}>
                          {data.group_menu_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.fk_group_menu_id ? <FormHelperText>{errors.fk_group_menu_id}</FormHelperText> : null}
                  </FormControl>
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
