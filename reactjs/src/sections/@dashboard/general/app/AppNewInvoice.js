// import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Table,
  Button,
  Divider,
  // MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  // IconButton,
  TableContainer
} from '@mui/material';
import { shortCrypt } from '../../../../utils/orms_commonly_script';
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';

// ----------------------------------------------------------------------

OrderList.propTypes = { dataList: PropTypes.array };

export default function OrderList({ dataList }) {
  const theme = useTheme();
  let dataOrderList = [];
  if (dataList) {
    dataOrderList = dataList;
  }
  return (
    <Card>
      <CardHeader title="List Order Perbaikan" sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Helpdesk</TableCell>
                <TableCell>Jenis Perbaikan</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {dataOrderList.map((row) => (
                <TableRow key={row.no_ticket}>
                  <TableCell>{row.no_ticket}</TableCell>
                  <TableCell>
                    <Label
                      variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                      color={
                        (row.fk_status_code === 'SS001' && 'warning') ||
                        (row.fk_status_code === 'SS002' && 'warning') ||
                        (row.fk_status_code === 'SS003' && 'warning') ||
                        (row.fk_status_code === 'SS004' && 'info') ||
                        (row.fk_status_code === 'SS005' && 'info') ||
                        (row.fk_status_code === 'SS006' && 'success') ||
                        (row.fk_status_code === 'SS007' && 'primary') ||
                        (row.fk_status_code === 'SS008' && 'primary') ||
                        'error'
                      }
                    >
                      {row.status}
                    </Label>
                  </TableCell>
                  <TableCell>{row.customer_name}</TableCell>
                  <TableCell>{row.helpdesk_name}</TableCell>
                  <TableCell>{row.jenis_perbaikan}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      color="inherit"
                      // endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                      to={`/${process.env.REACT_APP_BASE_URL}/order_list/detail/${shortCrypt(
                        'encrypt',
                        row.pk_order_list_id
                      )}`}
                      component={RouterLink}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
          to={`/${process.env.REACT_APP_BASE_URL}/order_list`}
          component={RouterLink}
        >
          View All
        </Button>
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

/* function MoreMenuButton() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 }
        }}
      >
        <MenuItem>
          <Iconify icon="eva:download-fill" sx={{ ...ICON }} />
          Download
        </MenuItem>

        <MenuItem>
          <Iconify icon="eva:printer-fill" sx={{ ...ICON }} />
          Print
        </MenuItem>

        <MenuItem>
          <Iconify icon="eva:share-fill" sx={{ ...ICON }} />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ ...ICON }} />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
} */
