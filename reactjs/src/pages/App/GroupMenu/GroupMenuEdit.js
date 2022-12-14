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
  Checkbox,
  FormControlLabel,
  Typography,
  FormHelperText,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { checkAccessRights, getCurrentUser, tokenEmpty, shortCrypt } from '../../../utils/orms_commonly_script';
import { textNotifSuccesstoDB, textCancle, textSave, textEditRecord } from '../../../utils/orms_commonly_text';
import { iconCancle, iconSave, check, checked } from '../../../components/Icon';
import { alertAccessDenid } from '../../../components/Common';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';

export default function UserCreate() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [listRole, setListRole] = useState([]);
  const [listMenu, setListMenu] = useState([]);
  const [loadGroupId, setGroupId] = useState('');
  const [loadGroupName, setGroupName] = useState('');
  const [loadGroupDesc, setGroupDesc] = useState('');
  const [loadRoleType, setRoleType] = useState('');
  const [loadMenuType, setMenuType] = useState('');
  const [loadIsAdmin, setIsAdmin] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [loadEdit, setLoadEdit] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_group_menu')).then((access) => {
          if (access[0]?.support_edit) {
            getMenu();
            getRole();
            getGroupMenuBYID();
          } else {
            setLoading(true);
            alertAccessDenid();
          }
        });
      }
      setLoad(false);
    }
  }, [load]);

  const getGroupMenuBYID = () => {
    Service.getGroupMenuBYID(id)
      .then((response) => {
        if (response.status === 200) {
          setGroupId(response.data[0].pk_group_menu_id);
          setGroupName(response.data[0].group_menu_name);
          setGroupDesc(response.data[0].group_menu_desc);
          setIsAdmin(response.data[0].is_admin);
          setRoleType(response.data[0].fk_role_type_id);
          setMenuType(response.data[0].menu_design_code);
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
    Service.getRoleType()
      .then((response) => {
        if (response.status === 200) {
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

  const getMenu = () => {
    Service.getMenuType()
      .then((response) => {
        if (response.status === 200) {
          setListMenu(response.data);
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
    group_menu_name: Yup.string().required('Group Menu Name is required').max(100),
    fk_role_type_id: Yup.string().required('Role Type is required'),
    menu_design_code: Yup.string().required('Menu Type is required')
  });

  const formik = useFormik({
    initialValues: {
      pk_group_menu_id: loadGroupId,
      group_menu_name: loadGroupName,
      group_menu_desc: loadGroupDesc,
      fk_role_type_id: loadRoleType,
      menu_design_code: loadMenuType,
      is_admin: loadIsAdmin,
      is_active: true,
      userby: getCurrentUser().userId
    },
    enableReinitialize: true,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      setLoading(true);
      Service.updateGroupMenu(values)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/group_menu`, {
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
    <Page title="ORMs Group Menu">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Group Menu
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
                  <TextField
                    fullWidth
                    autoComplete="group_menu_name"
                    type="text"
                    label="Group Menu"
                    disabled={loading}
                    {...getFieldProps('group_menu_name')}
                    error={Boolean(touched.group_menu_name && errors.group_menu_name)}
                    helperText={touched.group_menu_name && errors.group_menu_name}
                  />
                  <TextField
                    fullWidth
                    autoComplete="group_menu_desc"
                    multiline
                    rows={4}
                    label="Group Menu Description"
                    disabled={loading}
                    {...getFieldProps('group_menu_desc')}
                    error={Boolean(touched.group_menu_desc && errors.group_menu_desc)}
                    helperText={touched.group_menu_desc && errors.group_menu_desc}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        defaultChecked={loadIsAdmin}
                        icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
                        checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
                        {...getFieldProps('is_admin')}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    }
                    label="Is Admin"
                  />
                  <FormControl
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    error={Boolean(touched.fk_role_type_id && errors.fk_role_type_id)}
                  >
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Role"
                      disabled={loading}
                      {...getFieldProps('fk_role_type_id')}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {listRole.map((data) => (
                        <MenuItem key={data.fk_role_type_id} value={data.fk_role_type_id}>
                          {data.role_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.fk_role_type_id ? <FormHelperText>{errors.fk_role_type_id}</FormHelperText> : null}
                  </FormControl>
                  <FormControl
                    fullWidth
                    sx={{ marginBottom: 2 }}
                    error={Boolean(touched.menu_design_code && errors.menu_design_code)}
                  >
                    <InputLabel id="demo-simple-select-label">Menu Type</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label="Menu Type"
                      value={touched.menu_design_code}
                      disabled={loading}
                      {...getFieldProps('menu_design_code')}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {listMenu.map((data) => (
                        <MenuItem key={data.menu_design_code} value={data.menu_design_code}>
                          {data.menu_design_name}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.menu_design_code ? <FormHelperText>{errors.menu_design_code}</FormHelperText> : null}
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
