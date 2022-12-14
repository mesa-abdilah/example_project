// @mui
import { useState, useEffect } from 'react';
import { Alert, AlertTitle, Collapse, Container } from '@mui/material';
import parse from 'html-react-parser';
import purify from 'dompurify';
// hooks
import { getCurrentUser, tokenEmpty } from '../utils/orms_commonly_script';
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import { DashboardAdmin, DashboardHelpdesk, DashboardCustomer } from './DashboardWidget';
import DeliverRider from '../sections/@dashboard/general/app/DeliverRider';
import Service from '../service/custom_module.service';

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { themeStretch } = useSettings();
  const [orderList, setOrderList] = useState([]);
  const [summary, setSummary] = useState([]);
  const [orderListPickup, setOrderListPickup] = useState([]);
  const [orderListShipping, setOrderShipping] = useState([]);

  const [error, setError] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        dashboardOrder();
        dashboardSumamry();
        if (String(getCurrentUser()?.groupMenuId) === '8') {
          dashboardPickup();
          dashboardShipping();
        }
      }
      setLoad(false);
    }
  }, [load]);

  const dashboardOrder = () => {
    // setLoading(true);
    Service.dashboardOrder(getCurrentUser().userId, getCurrentUser().groupMenuId)
      .then((response) => {
        if (response.status === 200) {
          setOrderList(response.data);
        }
        // setLoading(false);
      })
      .catch((e) => {
        // setLoading(false);
        setError(true);
        if (typeof e?.response !== 'undefined') {
          setMessage(e.response?.data?.message);
        } else {
          setMessage(e.toString());
        }
      });
  };

  const dashboardSumamry = () => {
    // setLoading(true);
    Service.dashboardSumamry(getCurrentUser().userId, getCurrentUser().groupMenuId)
      .then((response) => {
        if (response.status === 200) {
          setSummary(response.data);
        }
        // setLoading(false);
      })
      .catch((e) => {
        // setLoading(false);
        setError(true);
        if (typeof e?.response !== 'undefined') {
          setMessage(e.response?.data?.message);
        } else {
          setMessage(e.toString());
        }
      });
  };

  const dashboardPickup = () => {
    // setLoading(true);
    Service.dashboardPickup(getCurrentUser().userId)
      .then((response) => {
        if (response.status === 200) {
          setOrderListPickup(response.data);
        }
        // setLoading(false);
      })
      .catch((e) => {
        // setLoading(false);
        setError(true);
        if (typeof e?.response !== 'undefined') {
          setMessage(e.response?.data?.message);
        } else {
          setMessage(e.toString());
        }
      });
  };

  const dashboardShipping = () => {
    // setLoading(true);
    Service.dashboardShipping(getCurrentUser().userId)
      .then((response) => {
        if (response.status === 200) {
          setOrderShipping(response.data);
        }
        // setLoading(false);
      })
      .catch((e) => {
        // setLoading(false);
        setError(true);
        if (typeof e?.response !== 'undefined') {
          setMessage(e.response?.data?.message);
        } else {
          setMessage(e.toString());
        }
      });
  };
  return (
    <Page title="Dashboard">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Collapse in={error}>
          <Alert
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
        {String(getCurrentUser()?.groupMenuId) === '1' && <DashboardAdmin orderList={orderList} summary={summary} />}
        {String(getCurrentUser()?.groupMenuId) === '6' && <DashboardHelpdesk orderList={orderList} summary={summary} />}
        {String(getCurrentUser()?.groupMenuId) === '7' && <DashboardCustomer orderList={orderList} summary={summary} />}
        {String(getCurrentUser()?.groupMenuId) === '8' && <DeliverRider title="Order Pickup" dataList={orderListPickup} />}
        {String(getCurrentUser()?.groupMenuId) === '8' && (
          <DeliverRider title="Order Shipping" dataList={orderListShipping} />
        )}
      </Container>
    </Page>
  );
}
