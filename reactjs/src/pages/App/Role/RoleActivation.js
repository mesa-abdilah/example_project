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
import {
  textCancle,
  textSave,
  textActivationRecord,
  textNotifSuccesstoDB,
  textError
} from '../../../utils/orms_commonly_text';
import { iconCancle, iconSave, arrowRight } from '../../../components/Icon';
import { alertAccessDenid } from '../../../components/Common';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';

export default function RoleActivation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roleId, setRoleId] = useState(0);
  const [roleName, setRoleName] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [isActive, setIsActive] = useState(false);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_role')).then((access) => {
          if (access[0]?.support_activation) {
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
    Service.getRoleBYID(id)
      .then((response) => {
        if (response.status === 200) {
          setRoleId(response.data[0].pk_role_id);
          setRoleName(response.data[0].role_name);
          setRoleDesc(response.data[0].role_description);
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
      roleId: null
    },
    onSubmit: () => {
      setSubmitting(true);
      const data = {
        pk_role_id: roleId,
        is_active: !isActive,
        userby: getCurrentUser().userId
      };
      Service.activationRole(data)
        .then((response) => {
          if (response.data.code === 200) {
            navigate(`/${process.env.REACT_APP_BASE_URL}/roles`, {
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
    <Page title="ORMs Roles Activation">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Roles
          </Typography>
          <Typography variant="caption" display="block">
            <Label variant="outlined">{textActivationRecord}</Label>
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
                      Role Name
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {roleName}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                  <Grid item xs={4} md={3}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                      Role Description
                    </Typography>
                  </Grid>
                  <Grid item xs={8} md={9}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                      {roleDesc}
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
                      <Icon icon={arrowRight} style={{ marginLeft: 5, marginRight: 5, marginBottom: -1 }} />
                      {isBooleantoString(!isActive)}
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
