import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar as ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Menu as MenuIcon, User, Settings, FileText, Users } from "lucide-react";
import './Sidebar.css';

interface MenuTreeViewModel {
  [key: string]: any;
  id: string;
  name: string;
  hasChild: boolean;
  expanded: boolean;
  pid: string | null;
  selected: boolean;
  icon: string;
  url: string;
  child: MenuTreeViewModel[];
}

interface SidebarProps {
  treeData: MenuTreeViewModel[];
  onMenuSelect: (menuId: string) => void;
}

export default function Sidebar({ treeData, onMenuSelect }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Hamburger click handler
  const onHamburgerClick = () => {
    setCollapsed(!collapsed);
  };

  // Force dark theme on generated CSS classes
  useEffect(() => {
    const forceDarkTheme = () => {
      // Target the specific generated class
      const sidebarContainer = document.querySelector('[data-testid="ps-sidebar-container-test-id"]');
      if (sidebarContainer) {
        (sidebarContainer as HTMLElement).style.backgroundColor = '#24222e';
        (sidebarContainer as HTMLElement).style.setProperty('background-color', '#24222e', 'important');
      }

      // Target any element with css- class
      const cssElements = document.querySelectorAll('[class*="css-"]');
      cssElements.forEach((element: any) => {
        // Skip sidebar container and menu items - they get special treatment
        if (element.closest('.ps-sidebar-container') || element.closest('.ps-menuitem-root')) {
          return;
        }
        
        if (element.style && element.style.backgroundColor) {
          element.style.backgroundColor = '#24222e';
          element.style.setProperty('background-color', '#24222e', 'important');
        }
      });

      // Target any element with background-color in style
      const styleElements = document.querySelectorAll('[style*="background"]');
      styleElements.forEach((element: any) => {
        // Skip sidebar container and menu items - they get special treatment
        if (element.closest('.ps-sidebar-container') || element.closest('.ps-menuitem-root')) {
          return;
        }
        
        if (element.style && element.style.backgroundColor) {
          element.style.backgroundColor = '#24222e';
          element.style.setProperty('background-color', '#24222e', 'important');
        }
      });

      // Force active menu item styling
      const activeMenuItems = document.querySelectorAll('.active-menu-item, [data-active="true"]');
      activeMenuItems.forEach((element: any) => {
        if (element.style) {
          element.style.backgroundColor = '#2a2838';
          element.style.setProperty('background-color', '#2a2838', 'important');
          element.style.color = 'white';
          element.style.setProperty('color', 'white', 'important');
        }
        
        // Also target the <a> tag inside the active menu item
        const menuButton = element.querySelector('.ps-menu-button');
        if (menuButton) {
          (menuButton as HTMLElement).style.backgroundColor = '#2a2838';
          (menuButton as HTMLElement).style.setProperty('background-color', '#2a2838', 'important');
          (menuButton as HTMLElement).style.color = 'white';
          (menuButton as HTMLElement).style.setProperty('color', 'white', 'important');
        }
        
        // Also target the label inside the active menu item
        const menuLabel = element.querySelector('.ps-menu-label');
        if (menuLabel) {
          (menuLabel as HTMLElement).style.backgroundColor = '#2a2838';
          (menuLabel as HTMLElement).style.setProperty('background-color', '#2a2838', 'important');
        }
      });
      
      // Target all ps-menu-button elements with ps-active class
      const activeMenuButtons = document.querySelectorAll('.ps-menu-button.ps-active');
      activeMenuButtons.forEach((element: any) => {
        if (element.style) {
          element.style.backgroundColor = '#2a2838';
          element.style.setProperty('background-color', '#2a2838', 'important');
          element.style.color = 'white';
          element.style.setProperty('color', 'white', 'important');
        }
      });
      
      // Target the ps-menu-label specifically for active menu items
      const activeMenuLabels = document.querySelectorAll('.ps-menu-label.ps-active');
      activeMenuLabels.forEach((element: any) => {
        if (element.style) {
          element.style.backgroundColor = '#2a2838';
          element.style.setProperty('background-color', '#2a2838', 'important');
        }
      });
      
      // Target any element with css- class that might be overriding our styles
      const cssOverrideElements = document.querySelectorAll('[class*="css-"][style*="background"]');
      cssOverrideElements.forEach((element: any) => {
        // Skip sidebar container and menu items - they get special treatment
        if (element.closest('.ps-sidebar-container') || element.closest('.ps-menuitem-root')) {
          return;
        }
        
        const computedStyle = window.getComputedStyle(element);
        if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          element.style.backgroundColor = '#24222e';
          element.style.setProperty('background-color', '#24222e', 'important');
        }
      });
    };

    // Apply immediately
    forceDarkTheme();

    // Apply after a short delay to catch any late-rendered elements
    const timer = setTimeout(forceDarkTheme, 100);
    const timer2 = setTimeout(forceDarkTheme, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, [treeData]);

  // Render menu item recursively
  const renderMenuItem = (menuItem: MenuTreeViewModel) => {
    const fullUrl = `/edutrack/${menuItem.url || ''}`;
    const isActive = location.pathname === fullUrl || 
                    (menuItem.url === '' && location.pathname === '/edutrack') ||
                    (menuItem.url !== '' && location.pathname.startsWith(fullUrl));
    
    if (menuItem.hasChild) {
      return (
        <SubMenu 
          key={menuItem.id} 
          label={menuItem.name}
          icon={getIcon(menuItem.icon)}
        >
          {menuItem.child.map(child => renderMenuItem(child))}
        </SubMenu>
      );
    } else {
      return (
        <MenuItem 
          key={menuItem.id}
          icon={getIcon(menuItem.icon)}
          component={<Link to={fullUrl} />}
          active={isActive}
          className={isActive ? 'active-menu-item' : ''}
          onClick={() => {
            onMenuSelect(menuItem.id);
          }}
        >
          {menuItem.name}
        </MenuItem>
      );
    }
  };

  // Get icon component based on icon name
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'users':
        return <Users size={20} />;
      case 'file-text':
      case 'filetext':
        return <FileText size={20} />;
      case 'settings':
      case 'setting':
        return <Settings size={20} />;
      case 'user':
        return <User size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  return (
    <ProSidebar 
      collapsed={collapsed}
      className="sidebar-container"
    >
      <div className={`sidebar-header ${collapsed ? 'collapsed' : ''}`}>
        {!collapsed && <h2 className="sidebar-brand">EduTrack</h2>}
        <button 
          onClick={onHamburgerClick}
          className="sidebar-toggle"
        >
          <MenuIcon size={20} />
        </button>
      </div>
      
      <Menu
        className="sidebar-menu"
        menuItemStyles={{
          button: {
            backgroundColor: '#24222e',
            color: '#e0e0e0',
            [`&.active`]: {
              backgroundColor: '#2a2838 !important',
              color: 'white !important',
              '& .ps-menu-label': {
                backgroundColor: '#2a2838 !important',
              },
            },
            '&:hover': {
              backgroundColor: '#2a2838',
              '& .ps-menu-label': {
                backgroundColor: '#2a2838',
              },
            },
          },
          subMenuContent: {
            backgroundColor: '#24222e',
          },
          label: {
            backgroundColor: '#24222e',
            color: '#e0e0e0',
            '&:hover': {
              backgroundColor: '#2a2838',
            },
          },
        }}
      >
        {treeData.map(menuItem => renderMenuItem(menuItem))}
      </Menu>
    </ProSidebar>
  );
}
