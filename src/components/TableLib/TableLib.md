# TableLib Component

A reusable data table component built with Material-UI's Table components, featuring pagination, loading states, and custom styling for dark themes.

## Features

- **Material-UI Integration**: Built on top of Material-UI's Table components
- **Pagination Support**: Built-in pagination with customizable rows per page
- **Loading States**: Integrated loading spinner and empty state handling
- **Responsive Design**: Sticky header and responsive table container
- **Dark Theme Optimized**: Custom styling optimized for dark backgrounds
- **Auto-numbering**: Automatic row numbering based on pagination
- **TypeScript Support**: Fully typed with TypeScript interfaces

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `any[]` | ✅ | - | Array of data objects to display |
| `columns` | `any[]` | ✅ | - | Array of column definitions |
| `loading` | `boolean` | ✅ | - | Whether the table is in loading state |
| `totalCount` | `number` | ❌ | `data.length` | Total number of records for pagination |
| `onPageChange` | `(page: number, limit: number) => void` | ❌ | - | Callback when page or page size changes |

## Types and Interfaces

### Column Interface

```typescript
interface Column {
  id: string;    // Property key in the data object
  label: string; // Display name for the column header
}
```

### TableLibProps

```typescript
interface TableLibProps {
  data: any[];                                        // Data array
  columns: any[];                                     // Column definitions
  loading: boolean;                                   // Loading state
  totalCount?: number;                               // Total record count
  onPageChange?: (page: number, limit: number) => void; // Page change callback
}
```

## Usage Examples

### Basic Usage

```tsx
import TableLib from '../components/TableLib/TableLib';

function MyComponent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' }
  ];

  const userData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' }
  ];

  return (
    <TableLib
      data={userData}
      columns={columns}
      loading={loading}
    />
  );
}
```

### With Pagination and API Integration

```tsx
function UserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const columns = [
    { id: 'name', label: 'Full Name' },
    { id: 'email', label: 'Email Address' },
    { id: 'department', label: 'Department' },
    { id: 'joinDate', label: 'Join Date' }
  ];

  const fetchUsers = async (page: number, limit: number) => {
    setLoading(true);
    try {
      const response = await api.getUsers({
        page: page + 1, // API uses 1-based pagination
        limit: limit
      });

      setUsers(response.data);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, limit: number) => {
    fetchUsers(page, limit);
  };

  useEffect(() => {
    fetchUsers(0, 10); // Initial load
  }, []);

  return (
    <TableLib
      data={users}
      columns={columns}
      loading={loading}
      totalCount={totalCount}
      onPageChange={handlePageChange}
    />
  );
}
```

### Loading State Example

```tsx
function LoadingTableExample() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'title', label: 'Title' },
    { id: 'description', label: 'Description' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData([
        { id: 1, title: 'Item 1', description: 'Description 1' },
        { id: 2, title: 'Item 2', description: 'Description 2' }
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <TableLib
      data={data}
      columns={columns}
      loading={loading}
    />
  );
}
```

### Empty State Example

```tsx
function EmptyTableExample() {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' }
  ];

  return (
    <TableLib
      data={[]} // Empty array
      columns={columns}
      loading={false}
    />
  );
}
```

### Complex Data with Custom Formatting

```tsx
function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { id: 'studentId', label: 'Student ID' },
    { id: 'fullName', label: 'Full Name' },
    { id: 'course', label: 'Course' },
    { id: 'gpa', label: 'GPA' },
    { id: 'enrollmentDate', label: 'Enrollment Date' }
  ];

  // Transform data before passing to table
  const transformedData = students.map(student => ({
    id: student.id,
    studentId: student.student_id,
    fullName: `${student.first_name} ${student.last_name}`,
    course: student.course_name,
    gpa: student.gpa?.toFixed(2) || 'N/A',
    enrollmentDate: new Date(student.enrollment_date).toLocaleDateString()
  }));

  return (
    <TableLib
      data={transformedData}
      columns={columns}
      loading={loading}
      totalCount={students.length}
    />
  );
}
```

### Real-time Updates

```tsx
function RealTimeTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { id: 'timestamp', label: 'Timestamp' },
    { id: 'event', label: 'Event' },
    { id: 'user', label: 'User' },
    { id: 'status', label: 'Status' }
  ];

  useEffect(() => {
    // Set up WebSocket or polling for real-time updates
    const interval = setInterval(() => {
      // Simulate new data
      const newEvent = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        event: 'User Login',
        user: 'john.doe',
        status: 'Success'
      };

      setData(prev => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 items
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TableLib
      data={data}
      columns={columns}
      loading={loading}
    />
  );
}
```

## Features and Behavior

### Pagination
- Default rows per page: 10
- Available options: 5, 10, 25 rows per page
- Zero-based page indexing internally
- Automatic row numbering based on current page

### Loading States
- Shows centered loading spinner with "Loading..." text
- Covers entire table area during loading
- Dark theme optimized with white spinner and text

### Empty State
- Displays "No data found" message when data array is empty
- Spans entire table width
- Consistent with dark theme styling

### Auto-numbering
- Automatic row numbering in first column
- Numbers calculated as: `(page * rowsPerPage) + rowIndex + 1`
- Maintains continuous numbering across pages

### Styling Features
- Sticky header for scrollable content
- Alternating row colors for better readability
- Dark theme with custom background colors
- Responsive table container
- Custom CSS class support

## Visual Design

### Color Scheme
- **Even rows**: `rgb(42, 40, 56)`
- **Odd rows**: `rgb(37, 36, 48)`
- **Text color**: White
- **Font size**: 11px for data cells
- **Loading spinner**: White

### Layout
- Centered text alignment for all cells
- Sticky header for long tables
- Responsive container with horizontal scrolling if needed
- Pagination controls at bottom

## Dependencies

- `@mui/material` - Material-UI components (Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, CircularProgress, Box)
- React 16.8+ (for hooks support)
- TypeScript (for type definitions)

## Component Architecture

### State Management
- Internal state for current page and rows per page
- Controlled pagination with parent callback support
- Loading state handled externally

### Event Handling
- `onPageChange`: Called when page or page size changes
- Provides zero-based page index and limit to parent
- Parent responsible for data fetching and state management

### Data Flow
- Parent provides data array and loading state
- Component handles pagination UI and calculations
- Row numbering calculated based on pagination state

## Best Practices

### Data Management
- Transform data before passing to component if needed
- Handle loading states appropriately
- Provide meaningful column labels
- Ensure data objects have consistent structure

### Performance
- Use pagination for large datasets
- Implement server-side pagination when possible
- Consider memoization for expensive data transformations
- Handle loading states to improve perceived performance

### Accessibility
- Provide meaningful column labels
- Use semantic HTML structure
- Ensure proper color contrast
- Support keyboard navigation

## Troubleshooting

### Data not displaying
- Check that data prop is an array
- Verify column `id` properties match data object keys
- Ensure data objects have required properties

### Pagination not working
- Verify `onPageChange` callback is implemented
- Check that `totalCount` is provided for server-side pagination
- Ensure parent component updates data when page changes

### Loading state issues
- Make sure `loading` prop is properly managed
- Verify loading state is set to false after data loads
- Check for proper error handling in data fetching

### Styling problems
- Verify TableLib.css is imported
- Check for CSS conflicts with Material-UI styles
- Ensure parent container doesn't override table styles

### Performance issues
- Implement pagination for large datasets
- Consider data virtualization for very large tables
- Use React.memo for expensive row rendering
- Optimize data transformation operations

### Row numbering incorrect
- Check pagination state management
- Verify page and rowsPerPage values are correct
- Ensure totalCount is accurate for server-side pagination