import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-outline';
import containerFilled from '@iconify/icons-ant-design/container-twotone';
import fileTextFill from '@iconify/icons-ant-design/file-sync-outlined';
import { shortCrypt } from '../../utils/orms_commonly_script';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const sidebarConfig = [
  {
    title: 'dashboard',
    path: `/${process.env.REACT_APP_BASE_URL}/dashboard`,
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'user',
    path: `/${process.env.REACT_APP_BASE_URL}/user`,
    icon: getIcon(peopleFill)
  },
  {
    title: 'module',
    path: `/${process.env.REACT_APP_BASE_URL}/module`,
    icon: getIcon(peopleFill)
  },
  {
    title: 'Helpdesk Specialist',
    path: `/${process.env.REACT_APP_BASE_URL}/module_parameter/${shortCrypt('encrypt', 'orm_mdl_helpdesk_specialist')}`,
    icon: getIcon(peopleFill)
  },
  {
    title: 'Map Helpdesk Specialist',
    path: `/${process.env.REACT_APP_BASE_URL}/module_parameter/${shortCrypt('encrypt', 'orm_mdl_map_helpdesk_spesialis')}`,
    icon: getIcon(peopleFill)
  },
  {
    title: 'ticket',
    path: `/${process.env.REACT_APP_BASE_URL}/ticket`,
    icon: getIcon(containerFilled)
  },
  {
    title: 'History',
    path: `/${process.env.REACT_APP_BASE_URL}/history`,
    icon: getIcon(fileTextFill)
  }
];

export default sidebarConfig;
