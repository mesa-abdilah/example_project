import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import LoadingScreen from './components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) =>
  function load(props) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { pathname } = useLocation();

    return (
      <Suspense fallback={<LoadingScreen isDashboard={pathname.includes(`/${process.env.REACT_APP_BASE_URL}`)} />}>
        <Component {...props} />
      </Suspense>
    );
  };

export default function Router() {
  return useRoutes([
    {
      path: `/${process.env.REACT_APP_BASE_URL}`,
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard" replace /> },
        { path: 'dashboard', element: <DashboardApp /> },
        { path: 'menu_template', element: <MenuTemplate /> },
        { path: 'account', element: <Account /> },
        { path: `${process.env.REACT_APP_MODULE_PARAM_URL}/:module`, element: <ModuleParameter /> },
        { path: `${process.env.REACT_APP_MODULE_PARAM_URL}/:module/create`, element: <ModuleParameterCreate /> },
        { path: `${process.env.REACT_APP_MODULE_PARAM_URL}/:module/edit/:id`, element: <ModuleParameterEdit /> },
        { path: `${process.env.REACT_APP_MODULE_PARAM_URL}/:module/activation/:id`, element: <ModuleParameterActivation /> },
        { path: `${process.env.REACT_APP_MODULE_PARAM_URL}/:module/detail/:id`, element: <ModuleParameterDetail /> },
        { path: `${process.env.REACT_APP_MODULE_PARAM_URL}/:module/delete/:id`, element: <ModuleParameterDelete /> },
        {
          path: 'user',
          children: [
            { element: <User />, index: true },
            { path: 'create', element: <UserCreate /> },
            { path: 'edit/:id', element: <UserEdit /> },
            { path: 'activation/:id', element: <UserActivation /> },
            { path: 'detail/:id', element: <UserDetail /> },
            { path: 'delete/:id', element: <UserDelete /> }
          ]
        },
        {
          path: 'group_menu',
          children: [
            { element: <GroupMenu />, index: true },
            { path: 'create', element: <GroupMenuCreate /> },
            { path: 'edit/:id', element: <GroupMenuEdit /> },
            { path: 'activation/:id', element: <GroupMenuActivation /> },
            { path: 'detail/:id', element: <GroupMenuDetail /> },
            { path: 'delete/:id', element: <GroupMenuDelete /> },
            { path: 'menu_access/:id', element: <GroupMenuAccess /> }
          ]
        },
        {
          path: 'module',
          children: [
            { element: <Module />, index: true },
            { path: 'create', element: <ModuleCreate /> },
            { path: 'edit/:module', element: <ModuleEdit /> },
            { path: 'activation/:module', element: <ModuleActivation /> },
            { path: 'detail/:module', element: <ModuleDetail /> },
            { path: 'delete/:module', element: <ModuleDelete /> },
            { path: 'replace/:module', element: <ModuleReplace /> }
          ]
        },
        {
          path: 'application_parameter',
          children: [
            { element: <ApplicationParameter />, index: true },
            { path: 'create', element: <ApplicationParameterCreate /> },
            { path: 'edit/:id', element: <ApplicationParameterEdit /> },
            { path: 'activation/:id', element: <ApplicationParameterActivation /> },
            { path: 'detail/:id', element: <ApplicationParameterDetail /> },
            { path: 'delete/:id', element: <ApplicationParameterDelete /> }
          ]
        },
        {
          path: 'module_param',
          children: [
            { element: <ModuleParam />, index: true },
            { path: 'create', element: <ModuleParamCreate /> },
            { path: 'edit/:id', element: <ModuleParamEdit /> },
            { path: 'activation/:id', element: <ModuleParamActivation /> },
            { path: 'detail/:id', element: <ModuleParamDetail /> },
            { path: 'delete/:id', element: <ModuleParamDelete /> },
            { path: 'child/:id', element: <ModuleParamChild /> },
            { path: 'child/:id/create', element: <ModuleParamChildCreate /> },
            { path: 'child/:param/edit/:id', element: <ModuleParamChildEdit /> },
            { path: 'child/:param/activation/:id', element: <ModuleParamChildActivation /> },
            { path: 'child/:param/detail/:id', element: <ModuleParamChildDetail /> },
            { path: 'child/:param/delete/:id', element: <ModuleParamChildDelete /> }
          ]
        },
        {
          path: 'roles',
          children: [
            { element: <Role />, index: true },
            { path: 'create', element: <RoleCreate /> },
            { path: 'edit/:id', element: <RoleEdit /> },
            { path: 'activation/:id', element: <RoleActivation /> },
            { path: 'detail/:id', element: <RoleDetail /> },
            { path: 'delete/:id', element: <RoleDelete /> }
          ]
        },
        {
          path: 'order_list',
          children: [
            { element: <OrderList />, index: true },
            { path: 'create', element: <OrderCreate /> },
            { path: 'detail/:id', element: <OrderDetail /> }
          ]
        },
        {
          path: 'order_summary',
          children: [
            { element: <OrderSummary />, index: true },
            { path: 'detail/:id', element: <OrderDetail /> },
            { path: 'invoice/:id', element: <Invoice /> }
          ]
        },
        { path: '*', element: <NotFoundInPage /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'verify', element: <VerifyCode /> },
        { path: 'reset', element: <ResetPassword /> },
        { path: 'change_password/:valid/:id', element: <ChangePassword /> },
        { path: 'search_ticket', element: <SearchTicket /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/login" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}

const Login = Loadable(lazy(() => import('./pages/Login')));
const Register = Loadable(lazy(() => import('./pages/Register')));
const VerifyCode = Loadable(lazy(() => import('./pages/VerifyCode')));
const ResetPassword = Loadable(lazy(() => import('./pages/ResetPassword')));
const ChangePassword = Loadable(lazy(() => import('./pages/ChangePassword')));
const SearchTicket = Loadable(lazy(() => import('./pages/SearchTicket')));
const NotFound = Loadable(lazy(() => import('./pages/Page404')));
const NotFoundInPage = Loadable(lazy(() => import('./pages/InPage404')));

const DashboardApp = Loadable(lazy(() => import('./pages/DashboardApp')));
const ModuleParameter = Loadable(lazy(() => import('./pages/Module/ModuleParameter')));
const ModuleParameterCreate = Loadable(lazy(() => import('./pages/Module/ModuleParameterCreate')));
const ModuleParameterEdit = Loadable(lazy(() => import('./pages/Module/ModuleParameterEdit')));
const ModuleParameterDetail = Loadable(lazy(() => import('./pages/Module/ModuleParameterDetail')));
const ModuleParameterActivation = Loadable(lazy(() => import('./pages/Module/ModuleParameterActivation')));
const ModuleParameterDelete = Loadable(lazy(() => import('./pages/Module/ModuleParameterDelete')));
const Module = Loadable(lazy(() => import('./pages/Module/Module')));
const ModuleCreate = Loadable(lazy(() => import('./pages/Module/ModuleCreate')));
const ModuleReplace = Loadable(lazy(() => import('./pages/Module/ModuleReplace')));
const ModuleEdit = Loadable(lazy(() => import('./pages/Module/ModuleEdit')));
const ModuleDetail = Loadable(lazy(() => import('./pages/Module/ModuleDetail')));
const ModuleActivation = Loadable(lazy(() => import('./pages/Module/ModuleActivation')));
const ModuleDelete = Loadable(lazy(() => import('./pages/Module/ModuleDelete')));
const User = Loadable(lazy(() => import('./pages/App/User/User')));
const UserCreate = Loadable(lazy(() => import('./pages/App/User/UserCreate')));
const UserEdit = Loadable(lazy(() => import('./pages/App/User/UserEdit')));
const UserActivation = Loadable(lazy(() => import('./pages/App/User/UserActivation')));
const UserDelete = Loadable(lazy(() => import('./pages/App/User/UserDelete')));
const UserDetail = Loadable(lazy(() => import('./pages/App/User/UserDetail')));
const MenuTemplate = Loadable(lazy(() => import('./pages/App/MenuTemplate/MenuTemplate')));
const GroupMenu = Loadable(lazy(() => import('./pages/App/GroupMenu/GroupMenu')));
const GroupMenuAccess = Loadable(lazy(() => import('./pages/App/GroupMenu/GroupMenuAccess')));
const GroupMenuCreate = Loadable(lazy(() => import('./pages/App/GroupMenu/GroupMenuCreate')));
const GroupMenuEdit = Loadable(lazy(() => import('./pages/App/GroupMenu/GroupMenuEdit')));
const GroupMenuActivation = Loadable(lazy(() => import('./pages/App/GroupMenu/GroupMenuActivation')));
const GroupMenuDelete = Loadable(lazy(() => import('./pages/App/GroupMenu/GroupMenuDelete')));
const GroupMenuDetail = Loadable(lazy(() => import('./pages/App/GroupMenu/GroupMenuDetail')));
const ApplicationParameter = Loadable(lazy(() => import('./pages/App/Parameter/ApplicationParameter')));
const ApplicationParameterActivation = Loadable(lazy(() => import('./pages/App/Parameter/ApplicationParameterActivation')));
const ApplicationParameterCreate = Loadable(lazy(() => import('./pages/App/Parameter/ApplicationParameterCreate')));
const ApplicationParameterDelete = Loadable(lazy(() => import('./pages/App/Parameter/ApplicationParameterDelete')));
const ApplicationParameterDetail = Loadable(lazy(() => import('./pages/App/Parameter/ApplicationParameterDetail')));
const ApplicationParameterEdit = Loadable(lazy(() => import('./pages/App/Parameter/ApplicationParameterEdit')));
const ModuleParam = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameter')));
const ModuleParamActivation = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterActivation')));
const ModuleParamCreate = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterCreate')));
const ModuleParamDelete = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterDelete')));
const ModuleParamDetail = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterDetail')));
const ModuleParamEdit = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterEdit')));
const ModuleParamChild = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterChild')));
const ModuleParamChildActivation = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterChildActivation')));
const ModuleParamChildCreate = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterChildCreate')));
const ModuleParamChildDelete = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterChildDelete')));
const ModuleParamChildDetail = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterChildDetail')));
const ModuleParamChildEdit = Loadable(lazy(() => import('./pages/App/Parameter/ModuleParameterChildEdit')));
const Role = Loadable(lazy(() => import('./pages/App/Role/Role')));
const RoleActivation = Loadable(lazy(() => import('./pages/App/Role/RoleActivation')));
const RoleCreate = Loadable(lazy(() => import('./pages/App/Role/RoleCreate')));
const RoleDelete = Loadable(lazy(() => import('./pages/App/Role/RoleDelete')));
const RoleDetail = Loadable(lazy(() => import('./pages/App/Role/RoleDetail')));
const RoleEdit = Loadable(lazy(() => import('./pages/App/Role/RoleEdit')));
const OrderList = Loadable(lazy(() => import('./pages/Custom/OrderList')));
const OrderCreate = Loadable(lazy(() => import('./pages/Custom/OrderList/OrderCreate')));
const OrderDetail = Loadable(lazy(() => import('./pages/Custom/OrderList/OrderDetail')));
const OrderSummary = Loadable(lazy(() => import('./pages/Custom/OrderSummary')));
const Invoice = Loadable(lazy(() => import('./pages/Custom/OrderSummary/Invoice')));
const Account = Loadable(lazy(() => import('./pages/App/Account')));
