import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarColumnsButton } from '@mui/x-data-grid';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { iconSearch, iconCloseOutline } from '../Icon';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(1, 1, 0),
        justifyContent: 'space-between',
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        '& .MuiButton-root': {
          color: '#637381',
          marginRight: '12px'
        }
      },
      textField: {
        [theme.breakpoints.down('xs')]: {
          width: '100%'
        },
        margin: theme.spacing(1, 0.5, 1.5),
        '& .MuiSvgIcon-root': {
          marginRight: theme.spacing(0.5)
        }
      }
    }),
  { defaultTheme }
);

function QuickSearchToolbar(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div style={{ paddingTop: 15 }}>
        <GridToolbarFilterButton />
        <GridToolbarColumnsButton />
        <GridToolbarDensitySelector />
      </div>
      <TextField
        placeholder="Search…"
        size="small"
        value={props.value}
        onChange={props.onChange}
        className={classes.textField}
        InputProps={{
          startAdornment: <Icon icon={iconSearch} style={{ marginRight: 10, fontSize: '25px' }} />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? 'visible' : 'hidden' }}
              onClick={props.clearSearch}
            >
              <Icon icon={iconCloseOutline} />
            </IconButton>
          )
        }}
      />
    </div>
  );
}

QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
};

export default QuickSearchToolbar;
