import PropTypes from 'prop-types';
import { Grid, Stack } from '@mui/material';
// sections
import { AppNewInvoice, AppWidgetSummary } from '../../sections/@dashboard/general/app';
import { BookingIllustration, CheckInIllustration } from '../../assets';

// ----------------------------------------------------------------------

DashboardHelpdesk.propTypes = { orderList: PropTypes.array, summary: PropTypes.array };

export default function DashboardHelpdesk({ orderList, summary }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={4}>
        <Stack spacing={3}>
          <AppWidgetSummary title="Pengajuan" total={Number(summary[0]?.count)} icon={<CheckInIllustration />} />
          <AppWidgetSummary title="Perbaikan Berjalan" total={Number(summary[1]?.count)} icon={<BookingIllustration />} />
          <AppWidgetSummary title="Pembayaran" total={Number(summary[2]?.count)} icon={<BookingIllustration />} />
          <AppWidgetSummary title="Selesai" total={Number(summary[3]?.count)} icon={<BookingIllustration />} />
        </Stack>
      </Grid>

      <Grid item xs={12} lg={8}>
        <AppNewInvoice dataList={orderList} />
      </Grid>
    </Grid>
  );
}
