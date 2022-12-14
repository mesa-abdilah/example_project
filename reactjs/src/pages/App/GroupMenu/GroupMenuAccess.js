import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// material
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardHeader,
  Collapse,
  IconButton,
  Typography,
  Grid,
  Stack,
  Button,
  Container,
  Checkbox,
  Tooltip,
  TableContainer
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import { check, checked, iconSave, iconCancle, iconRefresh } from '../../../components/Icon';
import {
  shortCrypt,
  getCurrentUser,
  escapeRegExp,
  tokenEmpty,
  isNulltoString,
  checkAccessRights
} from '../../../utils/orms_commonly_script';
import { textSave, textCancle, textError, textNotifSuccesstoDB, textRefresh } from '../../../utils/orms_commonly_text';
import { FilterPanelStyle, componentIcon, useGridStyles } from '../../../components/DataGrid/ComponentStyle';
import { Toast } from '../../../components/Common';
import RenderExpandCell from '../../../components/DataGrid/RenderExpandCell';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';

export default function GroupMenuAccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dataGridClass = useGridStyles();
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [headers, setDataHeader] = useState([]);
  const [accessRights, setAccessRights] = useState([]);
  const [data, setData] = useState([]);
  const [rows, setDataRow] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [load, setLoad] = useState(true);

  const head = [
    {
      field: 'id',
      headerName: 'No',
      align: 'center',
      type: 'number',
      hide: true,
      disableColumnMenu: true,
      width: 70
    },
    {
      field: 'module_label',
      headerName: 'Module',
      disableColumnMenu: true,
      type: 'string',
      width: 200,
      renderCell: RenderExpandCell
    },
    {
      field: 'support_view',
      headerName: 'View',
      disableColumnMenu: true,
      type: 'boolean',
      width: 100,
      renderCell: (params) => (
        <Scrollbar>
          {params.value !== null ? (
            <Checkbox
              checked={params.value}
              icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
              checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
              onChange={(e) => changeData(params.id, params.field, e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            ''
          )}
        </Scrollbar>
      )
    },
    {
      field: 'support_add',
      headerName: 'Add',
      disableColumnMenu: true,
      type: 'boolean',
      width: 100,
      renderCell: (params) => (
        <Scrollbar>
          {params.value !== null ? (
            <Checkbox
              checked={params.value}
              icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
              checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
              onChange={(e) => changeData(params.id, params.field, e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            ''
          )}
        </Scrollbar>
      )
    },
    {
      field: 'support_edit',
      headerName: 'Edit',
      disableColumnMenu: true,
      type: 'boolean',
      width: 100,
      renderCell: (params) => (
        <Scrollbar>
          {params.value !== null ? (
            <Checkbox
              checked={params.value}
              icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
              checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
              onChange={(e) => changeData(params.id, params.field, e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            ''
          )}
        </Scrollbar>
      )
    },
    {
      field: 'support_activation',
      headerName: 'Activation',
      disableColumnMenu: true,
      type: 'boolean',
      width: 100,
      renderCell: (params) => (
        <Scrollbar>
          {params.value !== null ? (
            <Checkbox
              checked={params.value}
              icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
              checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
              onChange={(e) => changeData(params.id, params.field, e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            ''
          )}
        </Scrollbar>
      )
    },
    {
      field: 'support_delete',
      headerName: 'Delete',
      disableColumnMenu: true,
      type: 'boolean',
      width: 100,
      renderCell: (params) => (
        <Scrollbar>
          {params.value !== null ? (
            <Checkbox
              checked={params.value}
              icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
              checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
              onChange={(e) => changeData(params.id, params.field, e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            ''
          )}
        </Scrollbar>
      )
    },
    {
      field: 'support_detail',
      headerName: 'Detail',
      disableColumnMenu: true,
      type: 'boolean',
      width: 100,
      renderCell: (params) => (
        <Scrollbar>
          {params.value !== null ? (
            <Checkbox
              checked={params.value}
              icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
              checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
              onChange={(e) => changeData(params.id, params.field, e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            ''
          )}
        </Scrollbar>
      )
    },
    {
      field: 'support_upload',
      headerName: 'Upload',
      disableColumnMenu: true,
      type: 'boolean',
      width: 100,
      renderCell: (params) => (
        <Scrollbar>
          {params.value !== null ? (
            <Checkbox
              checked={params.value}
              icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
              checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
              onChange={(e) => changeData(params.id, params.field, e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            ''
          )}
        </Scrollbar>
      )
    },
    {
      field: 'support_approval',
      headerName: 'Approval',
      disableColumnMenu: true,
      type: 'boolean',
      width: 100,
      renderCell: (params) => (
        <Scrollbar>
          {params.value !== null ? (
            <Checkbox
              checked={params.value}
              icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
              checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
              onChange={(e) => changeData(params.id, params.field, e.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          ) : (
            ''
          )}
        </Scrollbar>
      )
    }
  ];

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_group_menu_access')).then((access) => {
          setAccessRights(access);
          if (access[0]?.support_view) {
            getData();
          }
        });
      }
      successAlert();
      setLoad(false);
    }
    if (rows.length > 0) {
      setDataHeader(head);
    }
  }, [load, rows, accessRights]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
    const filteredRows = data.filter((row) =>
      Object.keys(row).some((field) => searchRegex.test(isNulltoString(row[field])))
    );
    setDataRow(filteredRows);
  };

  const successAlert = () => {
    if (location.state?.success) {
      window.history.replaceState({}, null);
      Toast.fire({ icon: 'success', title: location.state?.msg });
    }
  };

  const changeData = (id, field, value) => {
    if (rows.length > 0) {
      const dataTemp = rows;
      const objIndex = dataTemp.findIndex((obj) => obj.id === id);
      dataTemp[objIndex][field] = value;
      setDataRow(dataTemp);
    }
  };

  const getData = () => {
    setLoading(true);
    Service.getGroupMenuAccess(id)
      .then((response) => {
        if (response.status === 200) {
          response.data.forEach((value, index) => Object.assign(value, { id: index + 1 }));
          setData(response.data);
          setDataRow(response.data);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(true);
        if (typeof e?.response !== 'undefined') {
          setMessage(e.response?.data?.message);
        } else {
          setMessage(e.toString());
        }
      });
  };

  const save = () => {
    const data = {
      fk_group_menu_id: id,
      menu_access: rows,
      userby: getCurrentUser().userId
    };
    setLoading(true);
    Service.saveMenuAcceess(data)
      .then((response) => {
        if (response.status === 200) {
          navigate(`/${process.env.REACT_APP_BASE_URL}/group_menu`, {
            state: { success: true, msg: textNotifSuccesstoDB },
            replace: true
          });
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(true);
        if (typeof e?.response !== 'undefined') {
          setMessage(e.response?.data?.message);
        } else {
          setMessage(e.toString());
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      });
  };

  return (
    <Page title="ORMs Group Menu Access">
      <Container maxWidth="xl">
        <Collapse in={error}>
          <Alert
            severity="error"
            sx={{ mb: 5 }}
            onClose={() => {
              setError(false);
            }}
          >
            <AlertTitle>{textError}</AlertTitle>
            {message}
          </Alert>
        </Collapse>
        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, mr: 2, ml: 2, mt: 1 }}>
            <Stack direction="row">
              <CardHeader title="Group Menu Access" />
              <Tooltip title={textRefresh}>
                <Stack sx={{ mt: 2.5, ml: -3, backgroundColor: 'transparent' }}>
                  <IconButton
                    size="small"
                    className="ColorButtonTransparent"
                    onClick={() => {
                      if (accessRights[0]?.support_view) {
                        getData();
                      }
                    }}
                  >
                    <Icon icon={iconRefresh} style={{ fontSize: 15 }} />
                  </IconButton>
                </Stack>
              </Tooltip>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                style={{ float: 'right', marginTop: 50, marginRight: 10 }}
                size="medium"
                type="button"
                startIcon={<Icon icon={iconCancle} />}
                onClick={() => navigate(-1)}
              >
                {textCancle}
              </Button>
              {accessRights[0]?.support_add ? (
                <LoadingButton
                  style={{ float: 'right', marginTop: 50 }}
                  size="medium"
                  type="submit"
                  variant="contained"
                  loadingPosition="start"
                  startIcon={<Icon icon={iconSave} />}
                  onClick={() => save()}
                  loading={loading}
                >
                  {textSave}
                </LoadingButton>
              ) : (
                ''
              )}
            </Stack>
          </Stack>
          <Scrollbar>
            <TableContainer sx={{ height: 800 }}>
              <Box sx={{ height: 700, width: '100%' }}>
                {rows.length > 0 ? (
                  <Stack spacing={1} sx={{ marginLeft: 2 }}>
                    <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                      <Grid item xs={2} md={2}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          Group Menu
                        </Typography>
                      </Grid>
                      <Grid item xs={10} md={10}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                          {rows[0]?.group_menu_name}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                      <Grid item xs={2} md={2}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          Role Type
                        </Typography>
                      </Grid>
                      <Grid item xs={10} md={10}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                          {rows[0]?.role_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                ) : (
                  ''
                )}
                {headers.length === 10 ? (
                  <DataGrid
                    className={dataGridClass.root}
                    columns={headers}
                    rows={rows}
                    components={componentIcon}
                    componentsProps={{
                      panel: FilterPanelStyle,
                      toolbar: {
                        value: searchText,
                        onChange: (event) => requestSearch(event.target.value),
                        clearSearch: () => requestSearch('')
                      }
                    }}
                    loading={loading}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                    pagination
                    // checkboxSelection
                    disableSelectionOnClick
                  />
                ) : (
                  ''
                )}
              </Box>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
