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
  Container,
  Tooltip,
  TableContainer
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { iconAdd, iconRefresh /* , iconExport */ } from '../../components/Icon';
import {
  escapeRegExp,
  shortCrypt,
  tokenEmpty,
  checkAccessRights,
  encrypt,
  decrypt,
  isNulltoString,
  formatDateTime,
  formatDate,
  formatTime,
  formatNumber,
  pageOption,
  getAppSetting,
  getCurrentUser,
  isEmpty
} from '../../utils/orms_commonly_script';
import { textAddRecord, textError, /* textExport, */ textRefresh } from '../../utils/orms_commonly_text';
import { ActionButton, MoreMenuButton } from '../../components/Common';
import Service from '../../service/module_parameter.service';
// components
import renderExpandCell from '../../components/DataGrid/RenderExpandCell';
import { FilterPanelStyle, componentIcon, useGridStyles } from '../../components/DataGrid/ComponentStyle';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';

export default function User() {
  const { module } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const dataGridClass = useGridStyles();
  const [searchText, setSearchText] = useState('');
  const [pageSize, setPageSize] = useState(pageOption[0]);
  const [headers, setDataHeader] = useState([]);
  const [accessRights, setAccessRights] = useState([]);
  const [headersCount, setHeaderCount] = useState(-1);
  const [data, setData] = useState([]);
  const [rows, setDataRow] = useState([]);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [load, setLoad] = useState(true);
  const [loading, setLoading] = useState(false);
  let URLModule = window.location.href.split('/').pop();

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, URLModule).then((access) => {
          setAccessRights(access);
          if (access[0]?.support_view) {
            generateModule(URLModule);
          }
        });
      }
      successAlert();
      setLoad(false);
    }
    return function getCurrentModule() {
      URLModule = window.location.href.split('/').pop();
      if (!tokenEmpty() && module !== URLModule) {
        generateModule(URLModule);
      }
    };
  }, [load, module, URLModule]);

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

  const generateModule = (moduleName) => {
    setLoading(true);
    if (shortCrypt('decript', moduleName) !== 'E12012') {
      Service.getModuleParameterView(
        getCurrentUser().groupMenuId,
        getCurrentUser().roleId,
        shortCrypt('decript', moduleName),
        getCurrentUser().userId
      )
        .then((response) => {
          if (response.status === 200) {
            localStorage.setItem('moduleLabel', encrypt(response.data.result.module[0].module_label));
            const menuAccess = response.data.result.access[0];
            const head = [
              {
                field: 'id',
                headerName: 'No',
                type: 'number',
                disableColumnMenu: true,
                width: 70
              }
            ];
            response.data.result.header.forEach((value) => {
              if (value.is_primary_key) {
                head.push({
                  field: value.field_name,
                  headerName: 'Action',
                  cellClassName: 'headerCenter',
                  type: 'actions',
                  sortable: false,
                  width: getAppSetting()?.AP006 === '1' ? 150 : 10,
                  renderCell: (params) =>
                    getAppSetting()?.AP006 === '1' ? ActionButton(params, menuAccess) : MoreMenuButton(params, menuAccess)
                });
              } else if (['string', 'ref'].includes(value.field_type)) {
                const moduleParam =
                  value.field_id === '50' ? `module_${value.field_name}` : `ref_${value.field_display_name}`;
                if (value.field_code === 'COMTYP005') {
                  const valueSelect = [];
                  const dateSelect = response.data.result.data.filter((p) => p.key === value.field_name)[0]?.data;
                  Object.values(dateSelect).forEach((entry) => valueSelect.push(entry.name));
                  head.push({
                    field: moduleParam,
                    headerName: value.field_label,
                    disableColumnMenu: true,
                    cellClassName: 'headerCenter',
                    type: 'singleSelect',
                    width: getColumnWidth(value.field_length),
                    valueOptions: valueSelect,
                    renderCell: (params) => <Scrollbar>{isEmpty(params.value) ? '' : params.value}</Scrollbar>
                  });
                } else if (value.field_code === 'COMTYP017') {
                  head.push({
                    field: value.field_name,
                    headerName: value.field_label,
                    disableColumnMenu: true,
                    cellClassName: 'headerCenter',
                    type: 'string',
                    width: getColumnWidth(value.field_length),
                    renderCell: (params) => (
                      <Scrollbar>
                        {isEmpty(params.value) ? (
                          ''
                        ) : (
                          <Label
                            variant="outlined"
                            sx={{ mr: 1, cursor: 'pointer' }}
                            onClick={() => window.open(params.value, '_blank', 'noopener,noreferrer')}
                          >
                            <Iconify icon="eva:link-fill" sx={{ marginRight: '3px' }} />
                            {params.value}
                          </Label>
                        )}
                      </Scrollbar>
                    )
                  });
                } else if (value.field_length >= 150) {
                  head.push({
                    field: value.field_type === 'ref' ? moduleParam : value.field_name,
                    headerName: value.field_label,
                    disableColumnMenu: true,
                    type: value.field_type === 'ref' ? 'string' : value.field_type,
                    width: getColumnWidth(value.field_length),
                    renderCell: renderExpandCell
                  });
                } else {
                  head.push({
                    field: value.field_type === 'ref' ? moduleParam : value.field_name,
                    headerName: value.field_label,
                    disableColumnMenu: true,
                    cellClassName: 'headerCenter',
                    type: value.field_type === 'ref' ? 'string' : value.field_type,
                    width: getColumnWidth(value.field_length),
                    renderCell: (params) => <Scrollbar>{isEmpty(params.value) ? '' : params.value}</Scrollbar>
                  });
                }
              } else if (value.field_type === 'dateTime') {
                head.push({
                  field: value.field_name,
                  headerName: value.field_label,
                  disableColumnMenu: true,
                  type: value.field_type,
                  width: getColumnWidth(value.field_length),
                  valueFormatter: (params) => formatDateTime(params.value)
                });
              } else if (value.field_type === 'date') {
                head.push({
                  field: value.field_name,
                  headerName: value.field_label,
                  disableColumnMenu: true,
                  type: value.field_type,
                  width: getColumnWidth(value.field_length),
                  valueFormatter: (params) => formatDate(params.value)
                });
              } else if (value.field_type === 'time') {
                head.push({
                  field: value.field_name,
                  headerName: value.field_label,
                  disableColumnMenu: true,
                  type: value.field_type,
                  width: getColumnWidth(value.field_length),
                  valueFormatter: (params) => formatTime(params.value)
                });
              } else if (['number', 'money'].includes(value.field_type)) {
                head.push({
                  field: value.field_name,
                  headerName: value.field_label,
                  disableColumnMenu: true,
                  cellClassName: 'headerRight',
                  type: value.field_type,
                  width: getColumnWidth(value.field_length),
                  renderCell: (params) => <Scrollbar>{isEmpty(params.value) ? '' : formatNumber(params.value)}</Scrollbar>
                });
              } else if (value.field_code === 'COMTYP006') {
                head.push({
                  field: value.field_name,
                  headerName: value.field_label,
                  disableColumnMenu: true,
                  cellClassName: 'headerCenter',
                  type: 'string',
                  width: 170,
                  renderCell: (params) => (
                    <Scrollbar>
                      {isEmpty(params.value) ? (
                        ''
                      ) : (
                        <Label
                          variant="outlined"
                          sx={{ mr: 1, cursor: 'pointer' }}
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_BACKEND_HOST}/${params?.value?.split('|')[1]}`,
                              '_blank',
                              'noopener,noreferrer'
                            )
                          }
                        >
                          <Iconify icon="eva:link-fill" sx={{ marginRight: '3px' }} />
                          {params?.value?.split('|')[0]}
                        </Label>
                      )}
                    </Scrollbar>
                  )
                });
              } else {
                head.push({
                  field: value.field_name,
                  headerName: value.field_label,
                  disableColumnMenu: true,
                  type: value.field_type === 'ref' ? 'string' : value.field_type,
                  width: getColumnWidth(value.field_length)
                });
              }
            });
            response.data.result.body.forEach((value, index) => Object.assign(value, { id: index + 1 }));
            setAccessRights(menuAccess);
            setDataHeader(head);
            setDataRow(response.data.result.body);
            setData(response.data.result.body);
            setHeaderCount(head.length);
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
    }
  };

  const getData = (moduleName) => {
    setLoading(true);
    Service.getModuleParameterView(
      getCurrentUser().groupMenuId,
      getCurrentUser().roleId,
      shortCrypt('decript', moduleName),
      getCurrentUser().userId
    )
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem('moduleLabel', encrypt(response.data.result.module[0].module_label));
          response.data.result.body.forEach((value, index) => Object.assign(value, { id: index + 1 }));
          setDataRow(response.data.result.body);
          setData(response.data.result.body);
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

  const getColumnWidth = (value) => {
    let result = 0;
    if (value <= 100) {
      result = 100 * 2;
    } else if (value >= 300) {
      result = 300 * 2;
    } else return (result = value);
    return result;
  };

  return (
    <Page title={decrypt(localStorage.getItem('moduleLabel'))}>
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
              <CardHeader title={decrypt(localStorage.getItem('moduleLabel'))} />
              <Tooltip title={textRefresh}>
                <Stack sx={{ mt: 2.5, ml: -3, backgroundColor: 'transparent' }}>
                  <IconButton
                    size="small"
                    className="ColorButtonTransparent"
                    onClick={() => {
                      if (accessRights?.support_view) {
                        getData(URLModule);
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
                {accessRights?.support_add ? (
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
            <TableContainer>
              <Box sx={{ height: 500, width: '100%' }}>
                {headers.length === headersCount ? (
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
