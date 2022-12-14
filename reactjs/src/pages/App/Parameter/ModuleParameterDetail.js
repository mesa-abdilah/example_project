import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';
import purify from 'dompurify';
// material
import { Alert, AlertTitle, Card, Collapse, Grid, Stack, Button, Container, Typography } from '@mui/material';
import {
  checkAccessRights,
  getCurrentUser,
  tokenEmpty,
  shortCrypt,
  isBooleantoString
} from '../../../utils/orms_commonly_script';
import { textCancle, textError, textDetailRecord } from '../../../utils/orms_commonly_text';
import { iconCancle } from '../../../components/Icon';
import { alertAccessDenid } from '../../../components/Common';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';

export default function ModuleParameterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [parameterCode, setParameterCode] = useState('');
  const [parameterName, setParameterName] = useState('');
  const [parameterDesc, setParameterDesc] = useState('');
  const [inUseModue, setinUseModue] = useState(false);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_module_parameter')).then((access) => {
          if (access[0]?.support_detail) {
            getData();
          } else {
            alertAccessDenid();
          }
        });
      }
      setLoad(false);
    }
  }, [load]);

  const getData = () => {
    Service.getModuleParameterBYID(id)
      .then((response) => {
        if (response.status === 200) {
          setParameterCode(response.data[0].parameter_code);
          setParameterName(response.data[0].parameter_name);
          setParameterDesc(response.data[0].parameter_desc);
          setinUseModue(response.data[0].use_in_module);
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

  return (
    <Page title="ORMs Module Parameter Detail">
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Module Parameter
          </Typography>
          <Typography variant="caption" display="block">
            <Label variant="outlined">{textDetailRecord}</Label>
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
          <Stack spacing={2}>
            <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
              <Grid item xs={4} md={3}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  Parameter Code
                </Typography>
              </Grid>
              <Grid item xs={8} md={9}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                  {parameterCode}
                </Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
              <Grid item xs={4} md={3}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  Parameter Name
                </Typography>
              </Grid>
              <Grid item xs={8} md={9}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                  {parameterName}
                </Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
              <Grid item xs={4} md={3}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  Parameter Description
                </Typography>
              </Grid>
              <Grid item xs={8} md={9}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                  {parameterDesc}
                </Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
              <Grid item xs={4} md={3}>
                <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                  In Use Module
                </Typography>
              </Grid>
              <Grid item xs={8} md={9}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                  {isBooleantoString(inUseModue)}
                </Typography>
              </Grid>
            </Grid>
          </Stack>

          <Button
            style={{ float: 'right', marginTop: 50, marginRight: 10 }}
            size="medium"
            type="button"
            startIcon={<Icon icon={iconCancle} />}
            onClick={() => navigate(-1)}
          >
            {textCancle}
          </Button>
        </Card>
      </Container>
    </Page>
  );
}
