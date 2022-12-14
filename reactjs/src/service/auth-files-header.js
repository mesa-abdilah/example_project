import Cookies from 'js-cookie';
import { rot47, getCurrentUser } from '../utils/orms_commonly_script';

export default function authHeaderWithFIle() {
  let result = {};
  if (getCurrentUser && Cookies.get('orms_at')) {
    // return { Authorization: 'Bearer ' + user.accessToken }; // api selain express
    result = {
      'Content-Type': 'multipart/form-data',
      'x-access-token': rot47(Cookies.get('orms_at'))
    };
  }
  return result;
}
