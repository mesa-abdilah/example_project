import axios from 'axios';
import Cookies from 'js-cookie';
import { encrypt, rot47, getAppSetting } from '../utils/orms_commonly_script';
import { API_ROOT } from '../config/api-config';

class AuthService {
  static async login(username, password) {
    const response = await axios.post(`${API_ROOT}auth/signin`, {
      username,
      password
    });
    if (response.data.accessToken) {
      const data = {
        userId: response.data.userId,
        username: response.data.username,
        fullname: response.data.fullname,
        roleId: response.data.roleId,
        roleName: response.data.roleName,
        groupMenuId: response.data.groupMenuId,
        groupMenuName: response.data.groupMenuName,
        menuType: response.data.menuType,
        img: response.data.img
      };
      Cookies.set('orms_at', rot47(response.data.accessToken), {
        expires: 1,
        domain: process.env.REACT_APP_DOMAIN_COOKIES
      });
      Cookies.set('userIdentity', encrypt(JSON.stringify(data).replace(/</g, '\\u003c')), {
        expires: 1,
        domain: process.env.REACT_APP_DOMAIN_COOKIES
      });
      localStorage.setItem('userIdentity', encrypt(JSON.stringify(data).replace(/</g, '\\u003c')));
    }
  }

  static logout() {
    Cookies.remove('orms_at', { domain: process.env.REACT_APP_DOMAIN_COOKIES });
    Cookies.remove('userIdentity', { domain: process.env.REACT_APP_DOMAIN_COOKIES });
    localStorage.removeItem('userIdentity');
    window.location.href = getAppSetting()?.AP005;
  }
}

export default AuthService;
