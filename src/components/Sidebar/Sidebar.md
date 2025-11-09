# Sidebar Component

A reusable navigation sidebar component built with react-pro-sidebar, featuring hierarchical menus, dark theme styling, and responsive collapse functionality.

## Features

- **React Pro Sidebar Integration**: Built on top of react-pro-sidebar for advanced functionality
- **Hierarchical Menu Support**: Supports nested menus with SubMenu components
- **Collapsible Design**: Toggle between expanded and collapsed states
- **Dark Theme Optimized**: Custom styling optimized for dark backgrounds
- **Active Route Highlighting**: Automatic highlighting of active menu items based on current route
- **Icon Support**: Integrated Lucide React icons with customizable icon mapping
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `treeData` | `MenuTreeViewModel[]` | ✅ | - | Array of menu items with hierarchical structure |
| `onMenuSelect` | `(menuId: string) => void` | ✅ | - | Callback when a menu item is selected |

## Types and Interfaces

### MenuTreeViewModel

```typescript
interface MenuTreeViewModel {
  [key: string]: any;        // Additional properties
  id: string;                // Unique identifier for the menu item
  name: string;              // Display name for the menu item
  hasChild: boolean;         // Whether this item has child items
  expanded: boolean;         // Whether this item is expanded (for SubMenus)
  pid: string | null;        // Parent ID (null for root items)
  selected: boolean;         // Whether this item is selected
  icon: string;              // Icon name for the menu item
  url: string;               // URL/route for navigation
  child: MenuTreeViewModel[]; // Array of child menu items
}
```

### SidebarProps

```typescript
interface SidebarProps {
  treeData: MenuTreeViewModel[];        // Menu structure data
  onMenuSelect: (menuId: string) => void; // Menu selection callback
}
```

## Usage Examples

### Basic Usage

```tsx
import Sidebar from '../components/Sidebar/Sidebar';

function App() {
  const menuData = [
    {
      id: '1',
      name: 'Dashboard',
      hasChild: false,
      expanded: false,
      pid: null,
      selected: false,
      icon: 'filetext',
      url: 'dashboard',
      child: []
    },
    {
      id: '2',
      name: 'Users',
      hasChild: false,
      expanded: false,
      pid: null,
      selected: false,
      icon: 'user',
      url: 'users',
      child: []
    }
  ];

  const handleMenuSelect = (menuId: string) => {
    console.log('Selected menu:', menuId);
  };

  return (
    <Sidebar
      treeData={menuData}
      onMenuSelect={handleMenuSelect}
    />
  );
}
```

### Hierarchical Menu Structure

```tsx
function AppWithNestedMenu() {
  const menuData = [
    {
      id: '1',
      name: 'Dashboard',
      hasChild: false,
      expanded: false,
      pid: null,
      selected: false,
      icon: 'filetext',
      url: 'dashboard',
      child: []
    },
    {
      id: '2',
      name: 'User Management',
      hasChild: true,
      expanded: false,
      pid: null,
      selected: false,
      icon: 'user',
      url: '',
      child: [
        {
          id: '2.1',
          name: 'All Users',
          hasChild: false,
          expanded: false,
          pid: '2',
          selected: false,
          icon: 'user',
          url: 'users',
          child: []
        },
        {
          id: '2.2',
          name: 'Add User',
          hasChild: false,
          expanded: false,
          pid: '2',
          selected: false,
          icon: 'user',
          url: 'users/add',
          child: []
        }
      ]
    },
    {
      id: '3',
      name: 'Settings',
      hasChild: true,
      expanded: false,
      pid: null,
      selected: false,
      icon: 'settings',
      url: '',
      child: [
        {
          id: '3.1',
          name: 'General',
          hasChild: false,
          expanded: false,
          pid: '3',
          selected: false,
          icon: 'settings',
          url: 'settings/general',
          child: []
        },
        {
          id: '3.2',
          name: 'Security',
          hasChild: false,
          expanded: false,
          pid: '3',
          selected: false,
          icon: 'settings',
          url: 'settings/security',
          child: []
        }
      ]
    }
  ];

  const handleMenuSelect = (menuId: string) => {
    console.log('Selected menu:', menuId);
    // Handle menu selection logic
  };

  return (
    <Sidebar
      treeData={menuData}
      onMenuSelect={handleMenuSelect}
    />
  );
}
```

### With State Management

```tsx
function AppWithSidebarState() {
  const [selectedMenuId, setSelectedMenuId] = useState('1');
  const [menuData, setMenuData] = useState([
    // ... menu structure
  ]);

  const handleMenuSelect = (menuId: string) => {
    setSelectedMenuId(menuId);

    // Update menu data to reflect selection
    setMenuData(prevData =>
      updateMenuSelection(prevData, menuId)
    );
  };

  const updateMenuSelection = (data: MenuTreeViewModel[], selectedId: string): MenuTreeViewModel[] => {
    return data.map(item => ({
      ...item,
      selected: item.id === selectedId,
      child: updateMenuSelection(item.child, selectedId)
    }));
  };

  return (
    <div className="app-layout">
      <Sidebar
        treeData={menuData}
        onMenuSelect={handleMenuSelect}
      />
      <main className="main-content">
        {/* Main content area */}
      </main>
    </div>
  );
}
```

### Dynamic Menu Loading

```tsx
function AppWithDynamicMenu() {
  const [menuData, setMenuData] = useState<MenuTreeViewModel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenuData = async () => {
      try {
        const response = await api.getMenuStructure();
        setMenuData(response.data);
      } catch (error) {
        console.error('Error loading menu:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  const handleMenuSelect = (menuId: string) => {
    // Handle menu selection
    analytics.track('menu_selected', { menuId });
  };

  if (loading) {
    return <div>Loading menu...</div>;
  }

  return (
    <Sidebar
      treeData={menuData}
      onMenuSelect={handleMenuSelect}
    />
  );
}
```

### With Router Integration

```tsx
import { useNavigate, useLocation } from 'react-router-dom';

function AppWithRouting() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuData = [
    // ... menu structure
  ];

  const handleMenuSelect = (menuId: string) => {
    // Find the selected menu item
    const findMenuItem = (items: MenuTreeViewModel[], id: string): MenuTreeViewModel | null => {
      for (const item of items) {
        if (item.id === id) return item;
        const found = findMenuItem(item.child, id);
        if (found) return found;
      }
      return null;
    };

    const selectedItem = findMenuItem(menuData, menuId);
    if (selectedItem && selectedItem.url) {
      navigate(`/edutrack/${selectedItem.url}`);
    }
  };

  return (
    <Sidebar
      treeData={menuData}
      onMenuSelect={handleMenuSelect}
    />
  );
}
```

## Icon Support

The component includes built-in support for common icons using Lucide React:

### Supported Icons

| Icon Name | Icon Component | Description |
|-----------|----------------|-------------|
| `user` | `<User />` | User/profile related items |
| `file-text`, `filetext` | `<FileText />` | Document/content related items |
| `settings`, `setting` | `<Settings />` | Settings/configuration items |
| `profile` | `<User />` | Profile related items |
| default | `<FileText />` | Default icon for unknown types |

### Custom Icon Integration

```tsx
// Extend the getIcon function to support more icons
const getIcon = (iconName: string) => {
  switch (iconName.toLowerCase()) {
    case 'dashboard':
      return <LayoutDashboard size={20} />;
    case 'chart':
      return <BarChart3 size={20} />;
    case 'calendar':
      return <Calendar size={20} />;
    // ... existing cases
    default:
      return <FileText size={20} />;
  }
};
```

## Styling and Theming

### Dark Theme Colors

The component uses a carefully crafted dark theme:

- **Sidebar Background**: `#24222e`
- **Active Item Background**: `#2a2838`
- **Text Color**: `#e0e0e0`
- **Active Text Color**: `white`
- **Hover Background**: `#2a2838`

### CSS Classes

| Class Name | Description |
|------------|-------------|
| `.sidebar-container` | Main sidebar container |
| `.sidebar-header` | Header section with brand and toggle |
| `.sidebar-brand` | Brand/logo text |
| `.sidebar-toggle` | Collapse/expand toggle button |
| `.sidebar-menu` | Menu container |
| `.active-menu-item` | Active menu item styling |

### Custom Styling

```css
/* Override sidebar styling */
.sidebar-container {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #3a3847;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-brand {
  color: white;
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: #e0e0e0;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

.sidebar-toggle:hover {
  background-color: #2a2838;
}
```

## Features and Behavior

### Collapsible Functionality
- Toggle between expanded and collapsed states
- Hamburger menu button for toggling
- Responsive design maintains usability when collapsed
- Brand text hides when collapsed

### Active Route Detection
- Automatic highlighting of active menu items
- Based on current route/location
- Supports exact and partial URL matching
- Visual feedback with different background color

### Hierarchical Navigation
- Support for nested menu structures
- SubMenu components for parent items
- Recursive rendering of menu trees
- Proper parent-child relationships

### Route Integration
- Built-in React Router Link integration
- Automatic URL construction with `/edutrack/` prefix
- Support for empty URLs (dashboard/home routes)
- Navigation callback for custom handling

## Dependencies

- `react-pro-sidebar` - Core sidebar functionality
- `react-router-dom` - Navigation and routing (Link, useLocation)
- `lucide-react` - Icon components (Menu, User, Settings, FileText)
- React 16.8+ (for hooks support)
- TypeScript (for type definitions)

## Component Architecture

### State Management
- Internal state for collapse/expand functionality
- External state management for menu data and selection
- Location-based active state detection

### Event Handling
- `onMenuSelect`: Called when menu item is clicked
- Collapse/expand toggle handling
- Route change detection and highlighting

### Rendering Strategy
- Recursive menu item rendering
- Conditional rendering for SubMenu vs MenuItem
- Icon mapping and dynamic icon selection
- Active state determination based on current route

## Best Practices

### Menu Structure Design
- Keep menu hierarchy shallow (max 2-3 levels)
- Use meaningful and consistent icon names
- Provide clear and concise menu labels
- Group related functionality under SubMenus

### Performance Optimization
- Use React.memo for menu items if needed
- Implement lazy loading for large menu structures
- Cache menu data when possible
- Optimize icon imports

### Accessibility
- Ensure proper keyboard navigation
- Use semantic HTML structure
- Provide meaningful labels and descriptions
- Support screen readers with proper ARIA attributes

## Troubleshooting

### Styling Issues
- Check that Sidebar.css is properly imported
- Verify that dark theme overrides are applied
- Use browser dev tools to inspect CSS conflicts
- Ensure proper z-index for overlay scenarios

### Navigation Problems
- Verify React Router is properly configured
- Check that routes match the URL patterns in menu data
- Ensure Link components are rendering correctly
- Debug route matching logic in active state detection

### Menu Data Issues
- Validate menu data structure matches MenuTreeViewModel interface
- Check for missing required properties (id, name, hasChild, etc.)
- Verify parent-child relationships are correct
- Ensure URL patterns are consistent

### Icon Display Problems
- Check that Lucide React is properly installed
- Verify icon names match the supported icon mapping
- Import additional icons if needed
- Use default fallback for unknown icon types

### Performance Issues
- Implement virtualization for very large menu structures
- Use React.memo for expensive menu item rendering
- Consider lazy loading for dynamic menu content
- Optimize re-rendering with proper dependency arrays