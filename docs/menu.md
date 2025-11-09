# Sidebar Menu System Documentation

## Overview
This document describes the implementation of the sidebar menu system in the EduTrack application using React Pro Sidebar.

## Table of Contents
- [Architecture](#architecture)
- [Components](#components)
- [Data Flow](#data-flow)
- [Styling System](#styling-system)
- [Active State Management](#active-state-management)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

## Architecture

### Core Components
- **Main.tsx**: Main layout component containing the sidebar
- **Sidebar**: React Pro Sidebar component
- **Menu**: Menu container component
- **MenuItem**: Individual menu item component
- **SubMenu**: Expandable submenu component

### Data Structure
```typescript
interface MenuTreeViewModel {
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
```

## Components

### Main Sidebar Container
```tsx
<Sidebar 
  collapsed={collapsed}
  style={{ 
    height: '100vh',
    border: 'none',
    boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
    backgroundColor: '#24222e'
  }}
>
```

### Menu Header
- **Logo**: "EduTrack" in green (#02cc9a)
- **Hamburger Button**: Toggle sidebar collapse/expand
- **Styling**: Dark theme with border separation

### Menu Items
- **Regular Items**: Direct navigation links
- **Submenu Items**: Expandable with children
- **Icons**: Lucide React icons (User, Settings, FileText, etc.)

## Data Flow

### 1. API Integration
```typescript
// Fetch menu data from API
const fetchMenu = async () => {
  const data = await getMenu();
  setMenus(data.menus);
};
```

### 2. Menu Mapping
```typescript
// Convert API response to tree structure
const mappingMenu = () => {
  const parentMenus = menus.filter((menu) => !menu.parent_id);
  // Recursively map children
  const mapMenuRecursive = (menuItems, parentId) => {
    // Map each menu item with children
  };
};
```

### 3. Rendering
```typescript
// Render menu items recursively
const renderMenuItem = (menuItem: MenuTreeViewModel) => {
  const isActive = location.pathname === `/edutrack${menuItem.url || ''}`;
  
  if (menuItem.hasChild) {
    return <SubMenu>...</SubMenu>;
  } else {
    return <MenuItem active={isActive}>...</MenuItem>;
  }
};
```

## Styling System

### Color Scheme
- **Primary Background**: `#24222e` (Dark purple-gray)
- **Active/Hover Background**: `#2a2838` (Lighter purple-gray)
- **Secondary Background**: `#222030` (Darker purple-gray)
- **Text Colors**: `#e0e0e0` (Light gray), `white` (Active state)
- **Accent Color**: `#02cc9a` (Green for logo)

### Menu Item Styles
```typescript
menuItemStyles={{
  button: {
    backgroundColor: '#24222e',
    color: '#e0e0e0',
    [`&.active`]: {
      backgroundColor: '#2a2838 !important',
      color: 'white !important',
    },
    '&:hover': {
      backgroundColor: '#2a2838',
    },
  },
  label: {
    backgroundColor: '#24222e',
    color: '#e0e0e0',
  },
}}
```

### Force Dark Theme System
The application uses a `forceDarkTheme` function to override React Pro Sidebar's default styling:

```typescript
const forceDarkTheme = () => {
  // Target sidebar container
  const sidebarContainer = document.querySelector('[data-testid="ps-sidebar-container-test-id"]');
  
  // Target generated CSS classes
  const cssElements = document.querySelectorAll('[class*="css-"][style*="background"]');
  
  // Force active menu item styling
  const activeMenuItems = document.querySelectorAll('.active-menu-item, [data-active="true"]');
  
  // Target menu buttons and labels
  const activeMenuButtons = document.querySelectorAll('.ps-menu-button.ps-active');
  const activeMenuLabels = document.querySelectorAll('.ps-menu-label.ps-active');
};
```

## Active State Management

### Active State Detection
```typescript
const isActive = location.pathname === fullUrl || 
                (menuItem.url === '' && location.pathname === '/edutrack') ||
                (menuItem.url !== '' && location.pathname.startsWith(fullUrl));
```

### Active State Application
1. **MenuItem Component**: `active={isActive}` prop
2. **Custom Class**: `className={isActive ? 'active-menu-item' : ''}`
3. **Force Styling**: JavaScript-based style injection with `!important`

### URL Construction
- **Base Path**: `/edutrack`
- **Menu URLs**: Combined as `/edutrack${menuItem.url}`
- **Example**: User menu with URL `/user` becomes `/edutrack/user`

## Icon System

### Icon Mapping
```typescript
const getIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'user':
      return <User size={20} />;
    case 'file-text':
    case 'filetext':
      return <FileText size={20} />;
    case 'settings':
    case 'setting':
      return <Settings size={20} />;
    case 'profile':
      return <User size={20} />;
    default:
      return <FileText size={20} />;
  }
};
```

### Supported Icons
- **User**: Person outline icon
- **Settings**: Gear icon
- **FileText**: Document icon
- **Profile**: Person outline icon (same as User)

## Troubleshooting

### Common Issues

#### 1. Active State Not Working
**Problem**: Menu item shows as active in console but no visual change
**Solution**: Check if `forceDarkTheme` function is running and targeting correct elements

#### 2. Sidebar Background Color Wrong
**Problem**: Entire sidebar shows active color instead of primary color
**Solution**: Ensure CSS targeting excludes sidebar container and menu items

#### 3. Label Background Not Styling
**Problem**: Button background changes but label background doesn't
**Solution**: Target `.ps-menu-label.ps-active` elements specifically

### Debug Steps
1. Check console logs for `isActive` value
2. Verify `active-menu-item` class is applied
3. Inspect DOM for correct CSS classes
4. Check if `forceDarkTheme` function is running

### CSS Selectors to Monitor
- `.ps-sidebar-container` - Main sidebar container
- `.ps-menuitem-root` - Individual menu items
- `.ps-menu-button` - Menu button elements
- `.ps-menu-label` - Menu label text
- `.ps-active` - Active state class

## Future Improvements

### Planned Enhancements
1. **Theme System**: Support for light/dark theme switching
2. **Animation**: Smooth transitions for hover and active states
3. **Responsive Design**: Better mobile sidebar behavior
4. **Accessibility**: ARIA labels and keyboard navigation
5. **Performance**: Optimize style injection and DOM manipulation

### Code Refactoring
1. **Extract Styles**: Move inline styles to CSS modules
2. **Custom Hooks**: Create `useMenuState` hook for menu logic
3. **Type Safety**: Improve TypeScript interfaces
4. **Error Handling**: Better error handling for API failures

### Testing
1. **Unit Tests**: Test menu rendering and state management
2. **Integration Tests**: Test API integration and routing
3. **Visual Tests**: Test styling and responsive behavior

## Dependencies

### Required Packages
```json
{
  "react-pro-sidebar": "^1.4.1",
  "lucide-react": "^0.263.1",
  "react-router-dom": "^6.8.0"
}
```

### Browser Support
- Modern browsers with ES6+ support
- CSS Grid and Flexbox support required
- JavaScript enabled

## Conclusion

The sidebar menu system provides a robust, customizable navigation solution with:
- Dynamic menu generation from API data
- Proper active state management
- Consistent dark theme styling
- Responsive collapse/expand functionality
- Comprehensive icon support

This documentation serves as a reference for future development and maintenance of the menu system.
