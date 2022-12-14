import { delimiter } from './orms_commonly_script';

export function generateTree(value) {
  const dataMenu = {
    id: `0${delimiter}null${delimiter}Menu Root${delimiter}null`,
    name: 'Menu Root',
    children: []
  };
  const dataMenuTemp = [];
  const maxIndex = value.sort((a, b) => (a.menu_id.length < b.menu_id.length && 1) || -1)[0]?.menu_id.split('/').length;

  for (let i = 0; i < maxIndex; i += 1) {
    dataMenuTemp.push([]);
  }
  Object.values(value).forEach((entry) => {
    const index = entry.menu_id.split('/').length;
    if (entry.menu_url !== null) {
      dataMenuTemp[index - 1].push({
        id: entry.menu_id + delimiter + entry.module_name + delimiter + entry.menu_label + delimiter + entry.menu_url,
        name: entry.menu_label,
        menu_id: entry.menu_id,
        menu_parent_id: entry.menu_parent_id
      });
    } else {
      dataMenuTemp[index - 1].push({
        id: entry.menu_id + delimiter + entry.module_name + delimiter + entry.menu_label + delimiter + entry.menu_url,
        name: entry.menu_label,
        menu_id: entry.menu_id,
        menu_parent_id: entry.menu_parent_id,
        children: []
      });
    }
  });
  for (let j = maxIndex - 1; j >= 0; j -= 1) {
    for (let k = 0; k < dataMenuTemp[j].length; k += 1) {
      if (typeof dataMenuTemp[j][k]?.children !== 'undefined') {
        const indexParent = dataMenuTemp[j][k].menu_id.split('/').length;
        const dataChild = dataMenuTemp[indexParent]?.filter((p) => p.menu_parent_id === dataMenuTemp[j][k].menu_id);
        dataMenuTemp[j][k].children = dataChild?.sort((a, b) => (a.id > b.id && 1) || -1);
      }
    }
  }
  dataMenu.children = dataMenuTemp[0].sort((a, b) => (a.id > b.id && 1) || -1);
  return dataMenu;
}
