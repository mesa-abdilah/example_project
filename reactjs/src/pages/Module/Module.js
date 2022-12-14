import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
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
import { check, iconCopy, iconDelete, iconAdd, iconDetail, iconRefresh, iconEdit } from '../../components/Icon';
import {
  getCurrentUser,
  checkAccessRights,
  escapeRegExp,
  shortCrypt,
  tokenEmpty,
  pageOption,
  isNulltoString
} from '../../utils/orms_commonly_script';
import { textAddRecord, textError, /* textExport, */ textRefresh } from '../../utils/orms_commonly_text';
import { FilterPanelStyle, componentIcon, useGridStyles } from '../../components/DataGrid/ComponentStyle';
import RenderExpandCell from '../../components/DataGrid/RenderExpandCell';
import Service from '../../service/module_parameter.service';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';

export default function User() {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
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
      field: 'pk_module_id',
      headerName: 'Action',
      cellClassName: 'headerCenter',
      type: 'actions',
      sortable: false,
      width: 180,
      renderCell: (params) => (
        <Scrollbar>
          {accessRights[0]?.support_detail ? (
            <Tooltip title="Detail">
              <IconButton
                component={RouterLink}
                to={`detail/${shortCrypt('encrypt', params.row.module_name)}`}
                aria-label="detail"
                size="small"
              >
                <Icon icon={iconDetail} />
              </IconButton>
            </Tooltip>
          ) : (
            ''
          )}
          {accessRights[0]?.support_edit ? (
            <Tooltip title="Edit">
              <IconButton
                component={RouterLink}
                disabled={params.row.module_name.substring(0, 3) === 'app'}
                to={`edit/${shortCrypt('encrypt', params.row.module_name)}`}
                aria-label="Edit"
                size="small"
              >
                <Icon icon={iconEdit} />
              </IconButton>
            </Tooltip>
          ) : (
            ''
          )}
          {accessRights[0]?.support_edit ? (
            <Tooltip title="Replace">
              <IconButton
                component={RouterLink}
                disabled={params.row.module_name.substring(0, 3) === 'app'}
                to={`replace/${shortCrypt('encrypt', params.row.module_name)}`}
                aria-label="Replace"
                size="small"
              >
                <Icon icon={iconCopy} />
              </IconButton>
            </Tooltip>
          ) : (
            ''
          )}
          {accessRights[0]?.support_activation ? (
            <Tooltip title="Activation">
              <IconButton
                component={RouterLink}
                to={`activation/${shortCrypt('encrypt', params.row.module_name)}`}
                aria-label="activation"
                size="small"
              >
                <Icon icon={check} />
              </IconButton>
            </Tooltip>
          ) : (
            ''
          )}
          {accessRights[0]?.support_delete ? (
            <Tooltip title="Delete">
              <IconButton
                component={RouterLink}
                disabled={params.row.module_name.substring(0, 3) === 'app'}
                to={`delete/${shortCrypt('encrypt', params.row.module_name)}`}
                aria-label="delete"
                size="small"
              >
                <Icon icon={iconDelete} />
              </IconButton>
            </Tooltip>
          ) : (
            ''
          )}
        </Scrollbar>
      )
    },
    {
      field: 'module_name',
      headerName: 'Module Name',
      disableColumnMenu: true,
      type: 'string',
      width: 200,
      renderCell: RenderExpandCell
    },
    {
      field: 'module_label',
      headerName: 'Module Label',
      disableColumnMenu: true,
      type: 'string',
      width: 300,
      renderCell: RenderExpandCell
    },
    {
      field: 'module_desc',
      headerName: 'Module Description',
      disableColumnMenu: true,
      type: 'string',
      width: 400,
      renderCell: RenderExpandCell
    },
    {
      field: 'is_custom',
      headerName: 'Is Custom',
      disableColumnMenu: true,
      type: 'boolean',
      width: 100
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
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_module')).then((access) => {
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
    Service.getModuleView()
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
    <Page title="ORMs Module">
      <Container maxWidth="xl" className="scrollbar-custom">
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
              <CardHeader title="Module" />
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
            <TableContainer>
              <Box sx={{ height: 500, width: '100%' }}>
                {headers.length === 7 ? (
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
