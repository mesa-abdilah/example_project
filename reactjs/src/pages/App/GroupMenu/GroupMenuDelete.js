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
import { textCancle, textDelete, textError, textDeleteRecord, textNotifDelete } from '../../../utils/orms_commonly_text';
import { iconCancle, iconSave } from '../../../components/Icon';
import { alertAccessDenid } from '../../../components/Common';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';

export default function UserActivation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [groupId, setGroupId] = useState(0);
  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [roleType, setRoleType] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_group_menu')).then((access) => {
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
    Service.getGroupMenuBYID(id)
      .then((response) => {
        if (response.status === 200) {
          setGroupId(response.data[0].pk_group_menu_id);
          setGroupName(response.data[0].group_menu_name);
          setGroupDesc(response.data[0].group_menu_desc);
          setIsAdmin(response.data[0].is_admin);
          setRoleType(response.data[0].role_type);
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
      pk_group_menu_id: null
    },
    onSubmit: () => {
      setSubmitting(true);
      Service.deleteGroupMenu(groupId)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/group_menu`, {
              state: { success: true, msg: textNotifDelete },
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
    <Page title="ORMs Group Menu Delete">
      <Container maxWidth="xl">
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
                      Group Menu Name
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {groupName}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Group Menu Description
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {groupDesc}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      is Admin
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {isBooleantoString(isAdmin)}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Role Type
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {roleType}
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
                {textDelete}
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
