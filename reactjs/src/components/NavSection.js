import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import TreeView from '@mui/lab/TreeView';
import { useNavigate } from 'react-router-dom';
// material
import { Collapse, AlertTitle, Alert, Box, List } from '@mui/material';
import { getCurrentUser, tokenEmpty, delimiter } from '../utils/orms_commonly_script';
import { textError } from '../utils/orms_commonly_text';
import { generateTree } from '../utils/GenerateTree';
import { iconFolderClose, iconFolderOpen, iconPage, iconNav } from './Icon';
import StyledTreeItem from './StyledTreeItem';
import Scrollbar from './Scrollbar';
import Service from '../service/core_parameter.service';

function NavItem() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [menuTemplate, setMenuTemplate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (load) {
      if (!tokenEmpty()) {
        getData();
      }
      setLoad(false);
    }
  }, [load]);

  const getData = () => {
    setLoading(true);
    Service.getGroupMenuTemplate(getCurrentUser().groupMenuId)
      .then((response) => {
        if (response.status === 200) {
          const dataMenu = generateTree(response.data);
          setMenuTemplate(dataMenu);
        }
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError(true);
        if (typeof e?.response !== 'undefined') {
          setMessage(e.response?.data?.message);
        } else {
          setMessage(e.toString());
        }
      });
  };

  const handleSelect = (event, nodeIds) => {
    const menuSelected = nodeIds.split(delimiter);
    if (menuSelected[3] !== 'null') {
      navigate(`/${process.env.REACT_APP_BASE_URL}${menuSelected[3]}`, { replace: true });
    }
    setSelected(nodeIds);
  };
  const renderTree = (nodes) => (
    <StyledTreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </StyledTreeItem>
  );

  return (
    <Scrollbar>
      <Collapse in={error}>
        <Alert
          severity="error"
          sx={{ mb: 5 }}
          onClose={() => {
            setError(false);
          }}
        >
          <AlertTitle>{textError}</AlertTitle>
          {message}
        </Alert>
      </Collapse>
      <TreeView
        aria-label="rich object"
        defaultExpanded={['root']}
        defaultCollapseIcon={<Icon icon={iconFolderClose} />}
        defaultExpandIcon={<Icon icon={iconFolderOpen} />}
        defaultParentIcon={<Icon icon={iconNav} />}
        defaultEndIcon={<Icon icon={iconPage} />}
        disableSelection={loading}
        onNodeSelect={handleSelect}
        selected={selected}
        sx={{ flexGrow: 1, overflowY: 'auto', minWidth: '500px', marginBottom: 3 }}
      >
        {Array.isArray(menuTemplate.children) ? menuTemplate.children.map((node) => renderTree(node)) : null}
      </TreeView>
    </Scrollbar>
  );
}

export default function NavSection() {
  return (
    <Box>
      <List disablePadding>
        <NavItem />
      </List>
    </Box>
  );
}
