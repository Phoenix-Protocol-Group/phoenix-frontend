import * as React from 'react';
import Colors from '../Theme/colors';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const SidebarNavigation = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          }
        }}
        PaperProps={{
          sx: {
            background: Colors.backgroundSidenav,
            boxShadow: '-1px 0px 0px 0px rgba(228, 228, 228, 0.10) inset',
          }
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <List>
          <ListSubheader
            sx={{
              paddingLeft: '40px',
              background: 'unset',
              fontSize: '14px',
              lineHeight: '16px',
              marginBottom: '20px'
            }}
          >
            Menu
          </ListSubheader>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem 
              key={text} 
              disablePadding
              sx={{
                margin: '0 16px',
                width: 'unset',
                padding: 0,
                border: '1px solid transparent',
                borderRadius: '12px',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: '#E2491A',
                  background: 'rgba(226, 73, 26, 0.10)'
                }
              }}
            >
              <ListItemButton
                sx={{
                  padding: 0
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: '24px',
                    marginLeft: '20px'
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: '14px',
                    lineHeight: '20px'
                  }} 
                  sx={{
                    padding: '16px 24px 16px 20px'
                  }}
                  primary={text} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
  );
}

export { SidebarNavigation };
