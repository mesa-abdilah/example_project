import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import parse from 'html-react-parser';
import purify from 'dompurify';
// material
import { Alert, AlertTitle, Card, Collapse, Grid, Stack, Button, Container, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  checkAccessRights,
  getCurrentUser,
  tokenEmpty,
  isBooleantoString,
  shortCrypt
} from '../../../utils/orms_commonly_script';
import { textCancle, textSave, textDeleteRecord, textNotifSuccesstoDB, textError } from '../../../utils/orms_commonly_text';
import { iconCancle, iconSave } from '../../../components/Icon';
import { alertAccessDenid } from '../../../components/Common';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';

export default function UserActivation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pkUserId, setPkUserId] = useState(0);
  const [userId, setuserId] = useState('');
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [groupMenu, setGroupMenu] = useState('');
  const [isActive, setIsActive] = useState(false);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_user')).then((access) => {
          if (access[0]?.support_delete) {
            getData();
          } else {
            setSubmitting(true);
            alertAccessDenid();
          }
        });
      }
      setLoad(false);
    }
  }, [load]);

  const getData = () => {
    Service.getDataUser(id)
      .then((response) => {
        if (response.status === 200) {
          setPkUserId(response.data[0].pk_user_id);
          setuserId(response.data[0].userid);
          setFullname(response.data[0].fullname);
          setUsername(response.data[0].username);
          setEmail(response.data[0].user_email_address);
          setRole(response.data[0].role_name);
          setGroupMenu(response.data[0].group_menu_name);
          setIsActive(response.data[0].is_active);
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

  const formik = useFormik({
    initialValues: {
      pk_user_id: null
    },
    onSubmit: () => {
      setSubmitting(true);
      Service.userDelete(pkUserId)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/user`, {
              state: { success: true, msg: textNotifSuccesstoDB },
              replace: true
            });
          } else if (response.data.code === 400) {
            setError(true);
            setMessage(response.data.message);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
          setSubmitting(false);
        })
        .catch((e) => {
          setError(true);
          if (typeof e?.response !== 'undefined') {
            setMessage(e.response?.data?.message);
          } else {
            setMessage(e.toString());
          }
          setSubmitting(false);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    }
  });

  const { handleSubmit } = formik;

  return (
    <Page title="ORMs User Delete">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
          <Typography variant="caption" display="block">
            <Label variant="outlined">{textDeleteRecord}</Label>
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
            <AlertTitle>{textError}</AlertTitle>
            {parse(purify.sanitize(message))}
          </Alert>
        </Collapse>

        <Card sx={{ padding: 5 }}>
          <FormikProvider value={formik}>
            <Form onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      UserID
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {userId}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Username
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {username}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Fullname
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {fullname}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Email Address
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {email}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Role
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {role}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Group Menu
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {groupMenu}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Activation
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {isBooleantoString(isActive)}
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>

              <LoadingButton
                style={{ float: 'right', marginTop: 50 }}
                size="medium"
                type="submit"
                variant="contained"
                loadingPosition="start"
                startIcon={<Icon icon={iconSave} />}
                loading={submitting}
              >
                {textSave}
              </LoadingButton>
              <Button
                style={{ float: 'right', marginTop: 50, marginRight: 10 }}
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
