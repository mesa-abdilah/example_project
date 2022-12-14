// import { useState } from 'react';
// @mui
// import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import {
  // Box,
  Card,
  Table,
  Button,
  // Divider,
  // MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  CardHeader,
  // IconButton,
  TableContainer
} from '@mui/material';
import Scrollbar from '../../../../components/Scrollbar';
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

DeliverRider.propTypes = { title: PropTypes.string, dataList: PropTypes.array };

export default function DeliverRider({ title, dataList }) {
  // const theme = useTheme();
  let dataOrderList = [];
  if (dataList) {
    dataOrderList = dataList;
  }
  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title={title} sx={{ mb: 3 }} />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Helpdesk</TableCell>
                <TableCell>Jenis Perbaikan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataOrderList.map((row) => (
                <>
                  <TableRow key={row.no_ticket}>
                    <TableCell>{row.no_ticket}</TableCell>
                    <TableCell>{row.customer_name}</TableCell>
                    <TableCell>{row.helpdesk_name}</TableCell>
                    <TableCell>{row.jenis_perbaikan}</TableCell>
                  </TableRow>
                  <TableRow key={`${row.no_ticket}address`}>
                    <TableCell colSpan={4}>
                      <strong>Alamat : </strong>
                      <br />
                      <br />
                      {row.alamat_rumah}
                      <br />
                      <Button
                        size="small"
                        sx={{ mt: 2 }}
                        variant="outlined"
                        color="inherit"
                        endIcon={<Iconify icon="eva:map-outline" />}
                        onClick={() =>
                          window.open(
                            `https://www.google.com/maps/dir/?api=1&destination=${row.alamat_rumah.replace(/ /g, '+')}`,
                            '_blank'
                          )
                        }
                      >
                        Maps
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </Card>
  );
}
