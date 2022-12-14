import { Icon } from '@iconify/react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import { Link as RouterLink } from 'react-router-dom';
import {
  Alert,
  AlertTitle,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  IconButton,
  Tooltip,
  Divider,
  MenuItem,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import parse from 'html-react-parser';
import purify from 'dompurify';
import { check, iconEdit, iconDelete, iconDetail, iconConfirmation, iconMore, iconCancle } from './Icon';
import { shortCrypt } from '../utils/orms_commonly_script';
import Scrollbar from './Scrollbar';
import MenuPopover from './MenuPopover';

const Toast = Swal.mixin({
  toast: true,
  position: 'center',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});
export { Toast };

export const getIcon = (name, size) => <Icon icon={name} width={size} height={size} />;
export const sizeIconGrid = 18;

export const alertAccessDenid = () =>
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Access Denied!'
  });

export function ConfrimTitle(msg) {
  return <DialogTitle id="alert-dialog-title">{msg}</DialogTitle>;
}

export function ConfrimBody(msg) {
  return (
    <DialogContent>
      <DialogContentText id="alert-dialog-description" sx={{ width: 400, textAlign: 'center', padding: 4 }}>
        <Icon icon={iconConfirmation} style={{ color: '#eb9e34', fontSize: '100px' }} />
        <br />
        {msg}
      </DialogContentText>
    </DialogContent>
  );
}

export const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

export function MoreMenuButton(params, accessRights) {
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

export function ActionButton(params, accessRights) {
  return (
    <Scrollbar>
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
      {/* <Tooltip title="Menu Access">
      <IconButton
        component={RouterLink}
        to={`menu_access/${shortCrypt('encrypt', params.value)}`}
        aria-label="detail"
        size="small"
      >
        <Icon icon={iconChecklistAll} />
      </IconButton>
    </Tooltip> */}
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

AlertError.propTypes = { setError: PropTypes.func, error: PropTypes.bool, message: PropTypes.string, id: PropTypes.string };
export function AlertError({ setError, error, message, id }) {
  return (
    <Collapse in={error}>
      <Alert
        id={id}
        severity="error"
        sx={{ mb: 5 }}
        onClose={() => {
          setError(false);
        }}
      >
        <AlertTitle>Error</AlertTitle>
        {parse(purify.sanitize(message))}
      </Alert>
    </Collapse>
  );
}

CofirmDelete.propTypes = {
  setOpenRemove: PropTypes.func,
  openRemove: PropTypes.bool,
  setIDForm: PropTypes.func,
  IDForm: PropTypes.number,
  removeField: PropTypes.func
};
export function CofirmDelete({ setOpenRemove, openRemove, setIDForm, IDForm, removeField }) {
  return (
    <Dialog open={openRemove} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">Are You Sure?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ width: 400, textAlign: 'center', padding: 4 }}>
          <Icon icon={iconConfirmation} style={{ color: '#eb9e34', fontSize: '100px' }} />
          <br />
          You won't be able to revert this!
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<Icon icon={iconCancle} />}
          onClick={() => {
            setOpenRemove(false);
            setIDForm(0);
          }}
        >
          Cancle
        </Button>
        <Button variant="contained" startIcon={<Icon icon={iconDelete} />} onClick={() => removeField(IDForm)}>
          Delele
        </Button>
      </DialogActions>
    </Dialog>
  );
}
