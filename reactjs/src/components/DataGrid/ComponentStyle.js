import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import QuickSearchToolbar from './SearchToolbar';
import CustomNoRowsOverlay from './NoRows';
import CustomLoadingOverlay from './LoadingOverlay';
import {
  SortedDescendingIcon,
  SortedAscendingIcon,
  FilterIcon,
  UnsortedIcon,
  ColumnIcon,
  BoolTrueIcon,
  BoolFalseIcon
} from './icon';

function customCheckbox() {
  return {
    '& .MuiCheckbox-root svg': {
      width: 20,
      height: 20,
      backgroundColor: 'transparent',
      // border: `1px solid ${theme.palette.mode === 'light' ? '#d9d9d9' : 'rgb(67, 67, 67)'}`,
      borderRadius: 2
    },
    /* '& .MuiCheckbox-root svg path': {
      d: "path('M0 5C0 2.23858 2.23858 0 5 0H15C17.7614 0 20 2.23858 20 5V15C20 17.7614 17.7614 20 15 20H5C2.23858 20 0 17.7614 0 15V5Z')"
    },
    '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
      backgroundColor: '#00AB55',
      borderColor: '#00d66a'
    }, */
    '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
      position: 'absolute',
      display: 'table',
      border: '2px solid #fff',
      borderTop: 0,
      borderLeft: 0,
      transform: 'rotate(45deg) translate(-50%,-50%)',
      opacity: 1,
      transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
      content: '""',
      top: '50%',
      left: '39%',
      width: 5.71428571,
      height: 9.14285714
    },
    '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
      width: 8,
      height: 8,
      backgroundColor: '#1890ff',
      transform: 'none',
      top: '39%',
      border: 0
    }
  };
}

const defaultTheme = createTheme();
const useGridStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        border: 0,
        color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
        fontFamily: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"'
        ].join(','),
        WebkitFontSmoothing: 'auto',
        letterSpacing: 'normal',
        '& .MuiDataGrid-columnsContainer': {
          backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d'
        },
        '& .MuiDataGrid-iconSeparator': {
          display: 'none'
        },
        '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
          borderRight: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'}`
        },
        '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
          borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'}`
        },
        '& .MuiDataGrid-cell': {
          color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)'
        },
        '& .MuiPaginationItem-root': {
          borderRadius: 0
        },
        ...customCheckbox()
      }
    }),
  { defaultTheme }
);

const FilterPanelStyle = {
  sx: {
    '& .MuiFormControl-root': {
      margin: '0px 4px'
    },
    '& .MuiInput-root': {
      marginTop: '24px'
    },
    '& .MuiInput-underline:hover:before': {
      borderBottom: 'none'
    },
    '& .MuiInput-underline:hover:after': {
      borderBottom: 'none'
    },
    '& .MuiInput-underline:before': {
      borderBottom: 'none'
    },
    '& .MuiInput-underline:after': {
      borderBottom: 'none'
    },
    '& .MuiInputLabel-root': {
      fontSize: '0.875rem',
      paddingTop: 1.2,
      paddingLeft: 1,
      zIndex: 1
    },
    '& .MuiInput-input': {
      padding: '6px 8px',
      fontSize: '0.875rem',
      fontFamily: 'Public Sans, sans-serif',
      fontWeight: 400,
      lineHeight: 1.5714285714285714,
      borderRadius: '8px',
      backgroundColor: '#F4F6F8'
    },
    '& .MuiInput-input:focus': {
      borderRadius: '8px'
    }
  }
};

const componentIcon = {
  Toolbar: QuickSearchToolbar,
  NoRowsOverlay: CustomNoRowsOverlay,
  NoResultsOverlay: CustomNoRowsOverlay,
  LoadingOverlay: CustomLoadingOverlay,
  ColumnSortedAscendingIcon: SortedAscendingIcon,
  ColumnSortedDescendingIcon: SortedDescendingIcon,
  OpenFilterButtonIcon: FilterIcon,
  ColumnUnsortedIcon: UnsortedIcon,
  ColumnSelectorIcon: ColumnIcon,
  BooleanCellTrueIcon: BoolTrueIcon,
  BooleanCellFalseIcon: BoolFalseIcon,
  BaseCheckbox: BoolFalseIcon
};

const componentShortIcon = {
  NoRowsOverlay: CustomNoRowsOverlay,
  NoResultsOverlay: CustomNoRowsOverlay,
  ColumnSortedAscendingIcon: SortedAscendingIcon,
  ColumnSortedDescendingIcon: SortedDescendingIcon,
  ColumnUnsortedIcon: UnsortedIcon,
  ColumnSelectorIcon: ColumnIcon,
  BooleanCellTrueIcon: BoolTrueIcon,
  BooleanCellFalseIcon: BoolFalseIcon
};

export { FilterPanelStyle, componentIcon, componentShortIcon, useGridStyles };
