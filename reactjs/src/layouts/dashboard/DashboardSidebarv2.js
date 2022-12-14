import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Drawer } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
import useCollapseDrawer from '../../hooks/useCollapseDrawer';
// utils
import cssStyles from '../../utils/cssStyles';
// config
import { NAVBAR } from '../../config';
// components
import Logo from '../../components/Logo';
import SvgIconStyle from '../../components/SvgIconStyle';
import Scrollbar from '../../components/Scrollbar';
import { NavSectionVertical } from '../../components/nav-section';
import { IconButtonAnimate } from '../../components/animate';
import { getCurrentUser, tokenEmpty } from '../../utils/orms_commonly_script';
import Service from '../../service/core_parameter.service';
//
import NavbarAccount from './NavbarAccount';

const getIcon = (name) => <SvgIconStyle src={`/static/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;
// ----------------------------------------------------------------------
const icon = (
  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fillRule="evenodd">
      <path d="M0 0h24v24H0z" />
      <g fill="currentColor" fillRule="nonzero">
        <path
          d="M14.3283 11.4343 18.5126 7.25c.4142-.4142.4142-1.0858 0-1.5-.4142-.4142-1.0858-.4142-1.5 0l-5.543 5.5429c-.3904.3905-.3904 1.0237 0 1.4142l5.543 5.5429c.4142.4142 1.0858.4142 1.5 0 .4142-.4142.4142-1.0858 0-1.5l-4.1843-4.1843a.8.8 0 0 1 0-1.1314Z"
          opacity=".48"
        />
        <path d="M8.3283 11.4343 12.5126 7.25c.4142-.4142.4142-1.0858 0-1.5-.4142-.4142-1.0858-.4142-1.5 0l-5.543 5.5429c-.3904.3905-.3904 1.0237 0 1.4142l5.543 5.5429c.4142.4142 1.0858.4142 1.5 0 .4142-.4142.4142-1.0858 0-1.5l-4.1843-4.1843a.8.8 0 0 1 0-1.1314Z" />
      </g>
    </g>
  </svg>
);

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    flexShrink: 0,
    transition: theme.transitions.create('width', {
      duration: theme.transitions.duration.shorter
    })
  }
}));

// ----------------------------------------------------------------------

NavbarVertical.propTypes = {
  isOpenSidebar: PropTypes.bool,
  onCloseSidebar: PropTypes.func
};

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }) {
  const theme = useTheme();
  const [load, setLoad] = useState(true);
  const [loadMenuList, setMenuList] = useState([]);
  const [isCollapse, setIsCollapse] = useState(false);

  const { pathname } = useLocation();

  const isDesktop = useResponsive('up', 'lg');

  const { collapseHover, onHoverEnter, onHoverLeave } = useCollapseDrawer();

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        getData();
      }
      setLoad(false);
    }
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, pathname]);

  const getData = () => {
    Service.getGroupMenuList(getCurrentUser().groupMenuId)
      .then((response) => {
        const menuList = [];
        if (response.status === 200) {
          let headerMenu = [];
          response.data.forEach((value) =>
            headerMenu.push({ subheader: value.menu_header_name, no_sequence: value.no_seq })
          );
          headerMenu = headerMenu.filter((v, i, a) => a.findIndex((t) => t.subheader === v.subheader) === i);
          headerMenu.sort((a, b) => (a.no_sequence > b.no_sequence && 1) || -1);
          for (let i = 0; i < headerMenu.length; i += 1) {
            const entryHeader = headerMenu[i];
            const filterHeader = response.data;
            const data = filterHeader.filter((p) => p.menu_header_name.includes(entryHeader.subheader) && p.parent === null);
            data.sort((a, b) => (a.no_sequence > b.no_sequence && 1) || -1);
            if (entryHeader.subheader === 'No Header') {
              for (let i = 0; i < data.length; i += 1) {
                const childList = [];
                const dataHeader = data[i];
                const filterParent = response.data;
                const parent = filterParent.filter((p) => String(dataHeader.pk_menu_list_id).includes(p.parent));
                if (parent.length > 0) {
                  for (let i = 0; i < parent.length; i += 1) {
                    const dataChild = parent[i];
                    childList.push({
                      title: dataChild.menu_name,
                      path: `/${process.env.REACT_APP_BASE_URL}${dataChild.menu_url}`
                    });
                  }
                  menuList.push({
                    items: [
                      {
                        title: dataHeader.menu_name,
                        path: `/${process.env.REACT_APP_BASE_URL}${dataHeader.menu_url}`,
                        icon: getIcon(dataHeader.svg_src),
                        children: childList
                      }
                    ]
                  });
                } else {
                  menuList.push({
                    items: [
                      {
                        title: dataHeader.menu_name,
                        path: `/${process.env.REACT_APP_BASE_URL}${dataHeader.menu_url}`,
                        icon: getIcon(dataHeader.svg_src)
                      }
                    ]
                  });
                }
              }
            } else {
              const subList = [];
              for (let i = 0; i < data.length; i += 1) {
                const childList = [];
                const dataHeader = data[i];
                const filterParent = response.data;
                const parent = filterParent.filter((p) => String(dataHeader.pk_menu_list_id).includes(p.parent));
                if (parent.length > 0) {
                  for (let i = 0; i < parent.length; i += 1) {
                    const dataChild = parent[i];
                    childList.push({
                      title: dataChild.menu_name,
                      path: `/${process.env.REACT_APP_BASE_URL}${dataChild.menu_url}`
                    });
                  }
                  subList.push({
                    title: dataHeader.menu_name,
                    path: `/${process.env.REACT_APP_BASE_URL}${dataHeader.menu_url}`,
                    icon: getIcon(dataHeader.svg_src),
                    children: childList
                  });
                } else {
                  subList.push({
                    title: dataHeader.menu_name,
                    path: `/${process.env.REACT_APP_BASE_URL}${dataHeader.menu_url}`,
                    icon: getIcon(dataHeader.svg_src)
                  });
                }
              }
              menuList.push({
                subheader: data[0]?.menu_header_name,
                items: subList
              });
            }
          }
          setMenuList(menuList);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' }
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: 'center' })
        }}
      >
        {isDesktop && isCollapse && (
          <IconButtonAnimate onClick={() => setIsCollapse(false)}>
            <Box sx={{ lineHeight: 0, transform: 'rotate(180deg)' }}>{icon}</Box>
          </IconButtonAnimate>
        )}
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Logo />
          {isDesktop && !isCollapse && (
            <IconButtonAnimate onClick={() => setIsCollapse(true)}>
              <Box>{icon}</Box>
            </IconButtonAnimate>
          )}
        </Stack>

        <NavbarAccount isCollapse={isCollapse} />
      </Stack>
      {loadMenuList.length > 0 && <NavSectionVertical navConfig={loadMenuList} isCollapse={isCollapse} />}
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH
        }
      }}
    >
      {!isDesktop && loadMenuList && (
        <Drawer open={isOpenSidebar} onClose={onCloseSidebar} PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}>
          {renderContent}
        </Drawer>
      )}

      {isDesktop && loadMenuList && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: 'dashed',
              bgcolor: 'background.default',
              transition: (theme) =>
                theme.transitions.create('width', {
                  duration: theme.transitions.duration.standard
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24
              })
            }
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </RootStyle>
  );
}
