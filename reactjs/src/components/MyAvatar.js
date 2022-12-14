import { getCurrentUser } from '../utils/orms_commonly_script';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  return (
    <Avatar
      src={getCurrentUser()?.img}
      alt={getCurrentUser()?.userId}
      color={getCurrentUser()?.img ? 'default' : createAvatar(getCurrentUser()?.fullname).color}
      {...other}
    >
      {createAvatar(getCurrentUser()?.fullname).name}
    </Avatar>
  );
}
