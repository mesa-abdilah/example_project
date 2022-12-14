import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
//
import { encrypt, tokenEmpty, getCurrentUser } from '../../utils/orms_commonly_script';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import DashboardSidebarv2 from './DashboardSidebarv2';
import Service from '../../service/core_parameter.service';

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden'
});

const MainStyle = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflow: 'auto',
  minHeight: '100%',
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('lg')]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (tokenEmpty()) {
        navigate('/', { replace: true });
      }
      getData();
      setLoad(false);
    }
  }, [load]);

  const getData = () => {
    Service.getSystemSetting()
      .then((response) => {
        if (response.status === 200) {
          const data = {};
          response.data.forEach((value) => (data[value.sys_code] = value.sys_value));
          localStorage.setItem('appSetting', encrypt(JSON.stringify(data).replace(/</g, '\\u003c')));
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <RootStyle>
      <DashboardNavbar onOpenSidebar={() => setOpen(true)} />
      {getCurrentUser().menuType === 'MENU002' ? (
        <DashboardSidebarv2 isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      ) : (
        <DashboardSidebar isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      )}
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
