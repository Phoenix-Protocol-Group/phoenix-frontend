import * as React from 'react';
import Colors from '../Theme/colors';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

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
        variant="permanent"
        open={open}
      >
        <DrawerHeader
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '30px'
          }}
        >
          <img src="/logo.svg"/>
          <IconButton 
            onClick={handleDrawerClose}
            sx={{
              borderRadius: '8px',
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.025) 100%)',
              transform: theme.direction === 'rtl' ? 'rotate(180deg)' : 'none',
              padding: '10px'
            }}
          >
            <img src="/arrow.svg"/>
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
