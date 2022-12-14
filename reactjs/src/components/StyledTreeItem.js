import { alpha, styled } from '@mui/material/styles';
import TreeItem, { treeItemClasses } from '@mui/lab/TreeItem';

const StyledTreeItem = styled((props) => <TreeItem {...props} />)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3
    }
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.2)}`
  }
}));

export default StyledTreeItem;
