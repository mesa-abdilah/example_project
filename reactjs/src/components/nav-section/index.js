// import { matchPath } from 'react-router-dom';

// ----------------------------------------------------------------------

export { default as NavSectionVertical } from './vertical';

export function isExternalLink(path) {
  return path.includes('http');
}

export function getActive(path, pathname) {
  return path ? pathname === path : false;
}
