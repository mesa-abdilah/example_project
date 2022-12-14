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
  Divider,
  MenuItem,
  TableContainer
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  check,
  iconEdit,
  iconDelete,
  iconAdd,
  iconDetail,
  iconRefresh,
  iconDataChild,
  iconMore
} from '../../../components/Icon';
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
import RenderExpandCell from '../../../components/DataGrid/RenderExpandCell';
import Service from '../../../service/core_parameter.service';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';
import MenuPopover from '../../../components/MenuPopover';

export default function ModuleParameter() {
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

  function ActionButton(params, accessRights) {
    return (
      <Scrollbar>
        <Tooltip title="Data Child">
          <IconButton
            component={RouterLink}
            to={`child/${shortCrypt('encrypt', params.value)}`}
            aria-label="detail"
            size="small"
          >
            <Icon icon={iconDataChild} />
          </IconButton>
        </Tooltip>
        {accessRights?.support_detail ? (
          <Tooltip title="Detail">
            <IconButton
              component={RouterLink}
              to={`detail/${shortCrypt('encrypt', params.value)}`}
              aria-label="detail"
              size="small"
            >
              <Icon icon={iconDetail} />
            </IconButton>
          </Tooltip>
        ) : (
          ''
        )}
        {accessRights?.support_edit ? (
          <Tooltip title="Edit">
            <IconButton
              component={RouterLink}
              to={`edit/${shortCrypt('encrypt', params.value)}`}
              aria-label="edit"
              size="small"
            >
              <Icon icon={iconEdit} />
            </IconButton>
          </Tooltip>
        ) : (
          ''
        )}
        {accessRights?.support_activation ? (
          <Tooltip title="Activation">
            <IconButton
              component={RouterLink}
              to={`activation/${shortCrypt('encrypt', params.value)}`}
              aria-label="activation"
              size="small"
            >
              <Icon icon={check} />
            </IconButton>
          </Tooltip>
        ) : (
          ''
        )}
        {accessRights?.support_delete ? (
          <Tooltip title="Delete">
            <IconButton
              component={RouterLink}
              to={`delete/${shortCrypt('encrypt', params.value)}`}
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
    );
  }

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
      field: 'pk_parameter_id',
      headerName: 'Action',
      cellClassName: 'headerCenter',
      type: 'actions',
      sortable: false,
      width: getAppSetting()?.AP006 === '1' ? 165 : 10,
      renderCell: (params) =>
        getAppSetting()?.AP006 === '1' ? ActionButton(params, accessRights[0]) : MoreMenuButton(params, accessRights[0])
    },
    {
      field: 'parameter_code',
      headerName: 'Parameter Code',
      disableColumnMenu: true,
      type: 'string',
      width: 150,
      renderCell: RenderExpandCell
    },
    {
      field: 'parameter_name',
      headerName: 'Parameter Name',
      disableColumnMenu: true,
      type: 'string',
      width: 200,
      renderCell: RenderExpandCell
    },
    {
      field: 'parameter_desc',
      headerName: 'Parameter Deskripsion',
      disableColumnMenu: true,
      type: 'string',
      width: 200,
      renderCell: RenderExpandCell
    },
    {
      field: 'use_in_module',
      headerName: 'Use In Module',
      disableColumnMenu: true,
      type: 'boolean',
      width: 150
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
    Service.getModuleParameterView()
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
    <Page title="ORMs Module Parameter">
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
              <CardHeader title="Module Parameter" />
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

function MoreMenuButton(params, accessRights) {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    marginRight: 5,
    width: 20,
    height: 20
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <Icon icon={iconMore} style={{ width: '20px', height: '20px' }} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          padding: 1,
          mt: 5,
          ml: 6,
          width: 150,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 }
        }}
      >
        <MenuItem component={RouterLink} to={`child/${shortCrypt('encrypt', params.value)}`}>
          <Icon icon={iconDataChild} style={{ ...ICON }} />
          Detail Child
        </MenuItem>
        {accessRights?.support_detail ? (
          <MenuItem component={RouterLink} to={`detail/${shortCrypt('encrypt', params.value)}`}>
            <Icon icon={iconDetail} style={{ ...ICON }} />
            Detail
          </MenuItem>
        ) : (
          ''
        )}
        {accessRights?.support_edit ? (
          <MenuItem component={RouterLink} to={`edit/${shortCrypt('encrypt', params.value)}`}>
            <Icon icon={iconEdit} style={{ ...ICON }} />
            Edit
          </MenuItem>
        ) : (
          ''
        )}
        {accessRights?.support_activation ? (
          <MenuItem component={RouterLink} to={`activation/${shortCrypt('encrypt', params.value)}`}>
            <Icon icon={check} style={{ ...ICON }} />
            Activation
          </MenuItem>
        ) : (
          ''
        )}
        {accessRights?.support_delete ? <Divider sx={{ borderStyle: 'dashed' }} /> : ''}
        {accessRights?.support_delete ? (
          <MenuItem sx={{ color: 'error.main' }} component={RouterLink} to={`delete/${shortCrypt('encrypt', params.value)}`}>
            <Icon icon={iconDelete} style={{ ...ICON }} />
            Delete
          </MenuItem>
        ) : (
          ''
        )}
      </MenuPopover>
    </>
  );
}
