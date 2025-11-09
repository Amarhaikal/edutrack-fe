import { useLocation } from 'react-router-dom';

export default function UnauthorizedAccess() {
  const location = useLocation();
  const message = location.state?.message || 'You do not have permission to access this page';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '400px',
      color: 'white',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        fontSize: '72px',
        marginBottom: '20px',
        color: '#ff6b6b'
      }}>
        🚫
      </div>
      <h2 style={{ marginBottom: '10px' }}>Access Denied</h2>
      <p style={{ color: '#999', maxWidth: '500px' }}>
        {message}
      </p>
      <p style={{ color: '#666', marginTop: '20px' }}>
        Please contact your administrator if you believe you should have access to this resource.
      </p>
    </div>
  );
}
