import { Icon } from '@iconify/react';
import ExpandMoreIcon from '@iconify/icons-eva/corner-right-down-outline';
import ExpandLessIcon from '@iconify/icons-eva/corner-right-up-outline';
import FilterListIcon from '@iconify/icons-eva/funnel-outline';
import OptionIcon from '@iconify/icons-eva/options-2-outline';
import ExpandIcon from '@iconify/icons-eva/expand-outline';
import BoolTIcon from '@iconify/icons-eva/checkmark-circle-2-fill';
import BoolFIcon from '@iconify/icons-eva/minus-circle-fill';
import CheckIcon from '@iconify/icons-eva/checkmark-square-2-fill';
import iconRefresh from '@iconify/icons-eva/refresh-fill';

export function SortedDescendingIcon() {
  return <Icon icon={ExpandMoreIcon} />;
}

export function SortedAscendingIcon() {
  return <Icon icon={ExpandLessIcon} />;
}

export function RefresIcon() {
  return <Icon icon={iconRefresh} />;
}

export function FilterIcon() {
  return <Icon icon={FilterListIcon} />;
}

export function ColumnIcon() {
  return <Icon icon={OptionIcon} />;
}

export function UnsortedIcon() {
  return <Icon icon={ExpandIcon} />;
}

export function BoolTrueIcon() {
  return <Icon icon={BoolTIcon} style={{ color: 'green', fontSize: '20px' }} />;
}

export function BoolFalseIcon() {
  return <Icon icon={BoolFIcon} style={{ color: '#637381', fontSize: '20px' }} />;
}

export function CheckboxIcon() {
  return <Icon icon={CheckIcon} style={{ color: 'green', fontSize: '20px' }} />;
}
