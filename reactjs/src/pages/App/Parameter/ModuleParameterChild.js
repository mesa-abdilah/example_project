import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';
// material
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardHeader,
  Collapse,
  IconButton,
  Stack,
  Button,
  Grid,
  Typography,
  Container,
  Tooltip,
  TableContainer
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { iconAdd, iconRefresh } from '../../../components/Icon';
import {
  getCurrentUser,
  getAppSetting,
  checkAccessRights,
  escapeRegExp,
  shortCrypt,
  tokenEmpty,
  pageOption,
  isNulltoString
} from '../../../utils/orms_commonly_script';
import { textAddRecord, textError, /* textExport, */ textRefresh } from '../../../utils/orms_commonly_text';
import { FilterPanelStyle, componentIcon, useGridStyles } from '../../../components/DataGrid/ComponentStyle';
import { ActionButton, MoreMenuButton } from '../../../components/Common';
import RenderExpandCell from '../../../components/DataGrid/RenderExpandCell';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';

export default function ModuleParameterChild() {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const dataGridClass = useGridStyles();
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(pageOption[0]);
  const [accessRights, setAccessRights] = useState([]);
  const [headers, setDataHeader] = useState([]);
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
      disableColumnMenu: true,
      width: 70
    },
    {
      field: 'pk_parameter_detail_id',
      headerName: 'Action',
      cellClassName: 'headerCenter',
      type: 'actions',
      sortable: false,
      width: getAppSetting()?.AP006 === '1' ? 150 : 10,
      renderCell: (params) =>
        getAppSetting()?.AP006 === '1' ? ActionButton(params, accessRights[0]) : MoreMenuButton(params, accessRights[0])
    },
    {
      field: 'parameter_detail_code',
      headerName: 'Parameter Detail Code',
      disableColumnMenu: true,
      type: 'string',
      width: 150,
      renderCell: RenderExpandCell
    },
    {
      field: 'parameter_detail_name',
      headerName: 'Parameter Detail Name',
      disableColumnMenu: true,
      type: 'string',
      width: 200,
      renderCell: RenderExpandCell
    },
    {
      field: 'parameter_detail_value',
      headerName: 'Parameter Detail Value',
      disableColumnMenu: true,
      type: 'string',
      width: 200,
      renderCell: RenderExpandCell
    },
    {
      field: 'is_active',
      headerName: 'Is Active',
      disableColumnMenu: true,
      type: 'boolean',
      width: 100
    }
  ];

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_module_parameter')).then((access) => {
          setAccessRights(access);
          if (access[0]?.support_view) {
            getData();
          }
        });
      }
      successAlert();
      setLoad(false);
    }
    if (accessRights.length > 0) {
      setDataHeader(head);
    }
  }, [load, accessRights]);

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
      enqueueSnackbar(location.state?.msg, { variant: 'success' });
    }
  };

  const getData = () => {
    setLoading(true);
    Service.getModuleParameterDetailView(id)
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

  return (
    <Page title="ORMs Module Parameter Detail">
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
              <CardHeader title="Module Parameter Detail" />
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
              <Stack>
                {/* <Button
                  sx={{ mt: 3 }}
                  color="inherit"
                  variant="contained"
                  component={RouterLink}
                  to="create"
                  startIcon={<Icon icon={iconExport} />}
                >
                  {textExport}
                </Button> */}
              </Stack>
              <Stack>
                {accessRights[0]?.support_add ? (
                  <Button
                    sx={{ mt: 3 }}
                    variant="contained"
                    component={RouterLink}
                    to="create"
                    startIcon={<Icon icon={iconAdd} />}
                  >
                    {textAddRecord}
                  </Button>
                ) : (
                  ''
                )}
              </Stack>
            </Stack>
          </Stack>
          <Scrollbar>
            <TableContainer sx={{ height: 555 }}>
              <Box sx={{ height: 500, width: '100%', marginTop: 2 }}>
                {rows.length > 0 ? (
                  <Stack spacing={1} sx={{ marginLeft: 2 }}>
                    <Grid container sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2 }}>
                      <Grid item xs={2} md={2}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          Parameter Name
                        </Typography>
                      </Grid>
                      <Grid item xs={10} md={10}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                          {rows[0]?.parameter_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                ) : (
                  ''
                )}
                {headers.length === 6 ? (
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
                    rowsPerPageOptions={pageOption}
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
