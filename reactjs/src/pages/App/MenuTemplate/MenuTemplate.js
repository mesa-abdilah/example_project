import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Icon } from '@iconify/react';
import { useLocation } from 'react-router-dom';
import parse from 'html-react-parser';
import purify from 'dompurify';
// material
import {
  Alert,
  AlertTitle,
  Dialog,
  DialogActions,
  Grid,
  Card,
  CardHeader,
  Collapse,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  Typography,
  Select,
  Button,
  Container,
  Tooltip,
  TextField,
  FormControlLabel,
  Checkbox,
  TableContainer
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import TreeView from '@mui/lab/TreeView';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { checkAccessRights, delimiter, shortCrypt, tokenEmpty, getCurrentUser } from '../../../utils/orms_commonly_script';
import {
  textSave,
  textError,
  textCancle,
  textRemove,
  textRefresh,
  textUpdate,
  textNotifSuccesstoDB,
  textNotifDelete
} from '../../../utils/orms_commonly_text';
import { ConfrimTitle, ConfrimBody } from '../../../components/Common';
import Service from '../../../service/module_parameter.service';
import CoreService from '../../../service/core_parameter.service';
import { generateTree } from '../../../utils/GenerateTree';
import {
  iconAdd,
  iconRefresh,
  iconFolderClose,
  iconFolderOpen,
  iconPage,
  iconNav,
  iconCancle,
  iconSetting,
  iconSave,
  iconEdit,
  iconDelete,
  iconCloseOutline,
  check,
  checked
} from '../../../components/Icon';
import StyledTreeItem from '../../../components/StyledTreeItem';
// components
import Page from '../../../components/Page';
import Scrollbar from '../../../components/Scrollbar';

export default function MenuTemplate() {
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [accessRights, setAccessRights] = useState([]);
  const [menuTemplate, setMenuTemplate] = useState([]);
  const [listModuleActionConst, setListModuleActionConst] = useState([]);
  const [listModuleAction, setListModuleAction] = useState([]);
  const [listModule, setListModule] = useState([]);
  const [moduleIndex, setModuleIndex] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isParent, setIsParent] = useState(false);
  const [actionAdd, setActionAdd] = useState(false);
  const [menuID, setMenuID] = useState('');
  const [parent, setParent] = useState('');
  const [menuName, setMenuName] = useState('');
  const [menuParent, setMenuParent] = useState('');
  const [menuParentBefore, setMenuParentBefore] = useState('');
  const [menuModule, setMenuModule] = useState('');
  const [menuModuleBefore, setMenuModuleBefore] = useState('');
  const [moduleAction, setModuleAction] = useState('');
  const [moduleActionDisabled, setModuleActionDisabled] = useState(true);
  const [menuURL, setMenuURL] = useState('');
  const [selected, setSelected] = useState([]);
  const [openRemove, setOpenRemove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        checkAccessRights(getCurrentUser().groupMenuId, shortCrypt('encrypt', 'app_menu_template')).then((access) => {
          setAccessRights(access);
          if (access[0]?.support_view) {
            getData();
          }
        });
      }
      successAlert();
      setLoad(false);
    }
  }, [load]);

  const successAlert = () => {
    if (location.state?.success) {
      window.history.replaceState({}, null);
      enqueueSnackbar(location.state?.msg, { variant: 'success' });
    }
  };

  const handleSelect = (event, nodeIds) => {
    const menuSelected = nodeIds.split(delimiter);
    if (menuSelected[1] !== 'null' && !actionAdd) {
      setMenuModuleBefore(menuSelected[1]);
      setMenuModule(menuSelected[1]);
      setMenuURL(menuSelected[3]);
      setModuleActionDisabled(false);
    } else if (menuSelected[2] !== 'null' && !actionAdd) {
      setMenuParent(menuSelected[2]);
    }
    if (menuSelected[3] === 'null') {
      setParent(menuSelected[2]);
      setMenuParentBefore(menuSelected[2]);
    } else {
      setParent('');
    }
    setMenuID(menuSelected[0]);
    setMenuName(menuSelected[2]);
    setSelected(nodeIds);
  };

  const getData = () => {
    setLoading(true);
    Service.getModuleActive()
      .then((response) => {
        if (response.status === 200) {
          setListModule(response.data);
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

    setLoading(true);
    CoreService.getMenuTemplateModuleAction()
      .then((response) => {
        if (response.status === 200) {
          setListModuleActionConst(response.data);
          setListModuleAction(response.data);
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

    setLoading(true);
    CoreService.getMenuTemplateActive()
      .then((response) => {
        if (response.status === 200) {
          const dataMenu = generateTree(response.data);
          setMenuTemplate(dataMenu);
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

  const changeModule = (value) => {
    const moduleAct = listModuleActionConst.filter((p) => p.module_name === value);
    setModuleActionDisabled(false);
    setListModuleAction(moduleAct);
    setMenuModule(value);
  };

  const changeModuleAction = (value) => {
    const dataModuleTemp = listModule.filter((p) => p.module_name === menuModule);
    if (dataModuleTemp[0].is_custom === true || dataModuleTemp[0].module_name.substring(0, 3) === 'app') {
      if (value === 'MACT001') {
        setMenuURL(dataModuleTemp[0].url_view);
      }
    } else if (dataModuleTemp[0].is_custom === false) {
      if (value === 'MACT001') {
        setMenuURL(`/${process.env.REACT_APP_MODULE_PARAM_URL}/${shortCrypt('encrypt', menuModule)}`);
      }
    }
    setModuleAction(value);
  };

  const reset = () => {
    setMenuModule('');
    setModuleAction('');
    setParent('');
    setMenuParent('');
    setMenuParentBefore('');
    setMenuModuleBefore('');
    setMenuURL('');
    setModuleActionDisabled(true);
  };

  const changeAction = () => {
    reset();
    setActionAdd(!actionAdd);
  };

  const deleteTemplate = () => {
    setLoading(true);
    if (menuID === '') {
      setOpenRemove(false);
      setError(true);
      setMessage('Menu not selected');
    }
    if (!error) {
      CoreService.deleteMenuTemplate(shortCrypt('encrypt', menuID))
        .then((response) => {
          if (response.data.code === 200) {
            setOpenRemove(false);
            enqueueSnackbar(textNotifDelete, { variant: 'success' });
            getData();
          } else if (response.data.code === 400) {
            setError(true);
            setMessage(response.data.message);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
          setLoading(false);
        })
        .catch((e) => {
          setError(true);
          if (typeof e?.response !== 'undefined') {
            setMessage(e.response?.data?.message);
          } else {
            setMessage(e.toString());
          }
          setLoading(false);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    }
  };

  const saveTemplate = () => {
    setLoading(true);
    let valid = true;
    if (isParent && menuParent === '') {
      valid = false;
      setError(true);
      setMessage('Menu Parent is required <br />');
    } else if (!isParent && menuModule === '') {
      valid = false;
      setError(true);
      setMessage('Module is required <br />');
    }

    if (parent === '' && actionAdd) {
      valid = false;
      setError(true);
      setMessage('Select Menu Parent <br />');
    }

    let data = {};
    if (isParent) {
      data = {
        modeAdd: actionAdd,
        menuId: menuID,
        moduleActionCode: null,
        moduleName: null,
        menuLabel: menuParent,
        menuUrl: null,
        userby: getCurrentUser().userId
      };
    } else {
      const menuLabel = listModuleAction.filter((p) => p.module_action_code === moduleAction)[0];
      data = {
        modeAdd: actionAdd,
        menuId: menuID,
        moduleActionCode: moduleAction,
        moduleName: menuModule,
        menuLabel: menuLabel?.module_action,
        menuUrl: menuURL,
        userby: getCurrentUser().userId
      };
    }
    if (valid) {
      setLoading(true);
      CoreService.createMenuTemplate(data)
        .then((response) => {
          if (response.data.code === 200) {
            enqueueSnackbar(textNotifSuccesstoDB, { variant: 'success' });
            reset();
            getData();
          } else if (response.data.code === 400) {
            setError(true);
            setMessage(response.data.message);
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }
          setLoading(false);
        })
        .catch((e) => {
          setError(true);
          if (typeof e?.response !== 'undefined') {
            setMessage(e.response?.data?.message);
          } else {
            setMessage(e.toString());
          }
          setLoading(false);
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setLoading(false);
    }
  };

  const renderTree = (nodes) => (
    <StyledTreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </StyledTreeItem>
  );

  return (
    <Page title="ORMs Menu Template">
      <Container maxWidth="xl">
        <Card>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, mr: 2, ml: 2, mt: 1 }}>
            <Stack direction="row">
              <CardHeader title="Menu Template" />
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
          </Stack>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, minHeight: 500 }}>
              <Grid container sx={{ padding: 5 }}>
                <Grid item xs={12} md={6}>
                  <Grid item>
                    {accessRights[0]?.support_edit ? (
                      <Tooltip title="Setting">
                        <IconButton
                          size="small"
                          variant="contained"
                          onClick={() => {
                            setIsEdit(!isEdit);
                            setActionAdd(false);
                            reset();
                          }}
                        >
                          <Icon icon={isEdit ? iconCloseOutline : iconSetting} style={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      ''
                    )}
                    {accessRights[0]?.support_add ? (
                      <IconButton size="small" variant="contained" disabled={!isEdit} onClick={() => changeAction()}>
                        <Icon icon={actionAdd ? iconEdit : iconAdd} style={{ fontSize: 15 }} />
                      </IconButton>
                    ) : (
                      ''
                    )}
                    {accessRights[0]?.support_delete ? (
                      <IconButton size="small" variant="contained" disabled={!isEdit} onClick={() => setOpenRemove(true)}>
                        <Icon icon={iconDelete} style={{ fontSize: 15 }} />
                      </IconButton>
                    ) : (
                      ''
                    )}
                  </Grid>
                  <TreeView
                    aria-label="Menu Template"
                    defaultExpanded={[`0${delimiter}null${delimiter}null`]}
                    defaultCollapseIcon={<Icon icon={iconFolderClose} />}
                    defaultExpandIcon={<Icon icon={iconFolderOpen} />}
                    defaultParentIcon={<Icon icon={iconNav} />}
                    defaultEndIcon={<Icon icon={iconPage} style={{ color: 'green' }} />}
                    onNodeSelect={handleSelect}
                    selected={selected}
                    sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto', marginTop: 1 }}
                  >
                    {menuTemplate.length !== 0 && renderTree(menuTemplate)}
                  </TreeView>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={2}>
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
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={isParent}
                          disabled={!isEdit}
                          icon={<Icon icon={check} style={{ fontSize: '20px' }} />}
                          checkedIcon={<Icon icon={checked} style={{ fontSize: '20px' }} />}
                          onChange={(e) => setIsParent(e.target.checked)}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                      }
                      label="Folder?"
                    />
                    <TextField
                      type="text"
                      sx={{ display: isParent ? '' : 'none' }}
                      label="Folder Name"
                      disabled={!isEdit}
                      value={menuParent}
                      onChange={(e) => setMenuParent(e.target.value)}
                    />
                    <Autocomplete
                      fullWidth
                      disabled={!isEdit}
                      sx={{ display: !isParent ? '' : 'none' }}
                      value={listModule[moduleIndex]}
                      options={listModule}
                      getOptionLabel={(option) => option.module_label}
                      filterOptions={createFilterOptions({
                        matchFrom: 'start',
                        stringify: (option) => option.module_label
                      })}
                      onChange={(event, newValue) => {
                        changeModule(newValue?.module_name);
                        setModuleIndex(listModule.findIndex((x) => x.module_name == newValue?.module_name));
                      }}
                      renderInput={(params) => <TextField {...params} label="Module" />}
                    />
                    <FormControl fullWidth disabled={!isEdit} sx={{ display: !isParent ? '' : 'none' }}>
                      <InputLabel id="demo-simple-select-label">Module Action</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Module Action"
                        disabled={moduleActionDisabled}
                        onChange={(e) => changeModuleAction(e.target.value)}
                        value={moduleAction}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {listModuleAction.map((data) => (
                          <MenuItem key={data.module_action_code} value={data.module_action_code}>
                            {data.module_action}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Grid
                      container
                      sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2, display: actionAdd ? '' : 'none' }}
                    >
                      <Grid item xs={2} md={2}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          Parent
                        </Typography>
                      </Grid>
                      <Grid item xs={10} md={10}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                          {parent}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2, display: actionAdd ? 'none' : '' }}
                    >
                      <Grid item xs={2} md={2}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          Before
                        </Typography>
                      </Grid>
                      <Grid item xs={10} md={10}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                          {isParent ? menuParentBefore : menuModuleBefore}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2, display: isParent ? 'none' : '' }}
                    >
                      <Grid item xs={2} md={2}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          Module
                        </Typography>
                      </Grid>
                      <Grid item xs={10} md={10}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                          {menuModule}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      sx={{ borderBottom: '1px dashed #EBEDF3', paddingBottom: 2, display: isParent ? 'none' : '' }}
                    >
                      <Grid item xs={2} md={2}>
                        <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                          URL
                        </Typography>
                      </Grid>
                      <Grid item xs={10} md={10}>
                        <Tooltip title={menuURL}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            <span style={{ marginRight: 15, fontWeight: '600' }}>:</span>
                            {menuURL}
                          </Typography>
                        </Tooltip>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <LoadingButton
                        style={{ float: 'right', marginTop: 5, display: actionAdd ? 'none' : '' }}
                        size="medium"
                        type="button"
                        disabled={!isEdit}
                        variant="contained"
                        loadingPosition="start"
                        onClick={() => saveTemplate()}
                        startIcon={<Icon icon={iconSave} />}
                        loading={loading}
                      >
                        {textUpdate}
                      </LoadingButton>
                      <LoadingButton
                        style={{ float: 'right', marginTop: 5, display: actionAdd ? '' : 'none' }}
                        size="medium"
                        type="button"
                        disabled={!isEdit}
                        variant="contained"
                        loadingPosition="start"
                        onClick={() => saveTemplate()}
                        startIcon={<Icon icon={iconSave} />}
                        loading={loading}
                      >
                        {textSave}
                      </LoadingButton>
                    </Grid>
                  </Stack>
                </Grid>
              </Grid>
            </TableContainer>
          </Scrollbar>
          <Dialog open={openRemove} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            {ConfrimTitle('Are You Sure?')}
            {ConfrimBody(`You won't be able to revert '${menuName}'!`)}
            <DialogActions>
              <Button startIcon={<Icon icon={iconCancle} />} onClick={() => setOpenRemove(false)}>
                {textCancle}
              </Button>
              <Button variant="contained" startIcon={<Icon icon={iconSave} />} onClick={() => deleteTemplate()}>
                {textRemove}
              </Button>
            </DialogActions>
          </Dialog>
        </Card>
      </Container>
    </Page>
  );
}
