import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { logout as logoutAPI } from '../pages/auth/authService';
import type { RefRole } from './reference.interface';

// Define the User interface based on your login response
interface User {
  id: number;
  name: string;
  idno: string;
  email: string;
  role: RefRole
}

// Auth state interface
interface AuthState {
  user: User | null;
  token: string | null;
  tokenExpiry: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth context actions interface
interface AuthActions {
  login: (userData: { token: string; user: User; expires_at: string }) => void;
  logout: () => void;
  clearError: () => void;
  checkTokenExpiration: () => boolean;
}

// Combined context interface
interface AuthContextType extends AuthState, AuthActions {}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    tokenExpiry: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
  });

  // Function to check if token is expired
  const checkTokenExpiration = (): boolean => {
    const { token, tokenExpiry } = authState;
    
    if (!token || !tokenExpiry) {
      return false;
    }

    const expiryTime = new Date(tokenExpiry).getTime();
    const currentTime = new Date().getTime();
    
    return currentTime < expiryTime;
  };

  // Logout function (defined before useEffect)
  const logout = async () => {
    try {
      // Call API logout if we have a token
      if (authState.token) {
        await logoutAPI(authState.token);
      }
    } catch (error) {
      console.error('Error during logout API call:', error);
      // Continue with local logout even if API call fails
    } finally {
      // Clear all localStorage (auth + reference data cache)
      localStorage.clear();

      // Reset context state
      setAuthState({
        user: null,
        token: null,
        tokenExpiry: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });

      // Redirect to login with session expired reason
      window.location.href = '/edutrack/login?reason=session_expired';
    }
  };

  // Initialize auth state from localStorage and set up token expiration check
  useEffect(() => {
    let tokenExpirationTimer: number;

    const initializeAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        const storedExpiry = localStorage.getItem('tokenExpiry');

        if (storedToken && storedUser && storedExpiry) {
          const userData = JSON.parse(storedUser);
          
          // Check if token is still valid
          const expiryTime = new Date(storedExpiry).getTime();
          const currentTime = new Date().getTime();

          if (currentTime < expiryTime) {
            // Token is still valid
            setAuthState({
              user: userData,
              token: storedToken,
              tokenExpiry: storedExpiry,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });

            // Set up automatic logout when token expires
            const timeUntilExpiry = expiryTime - currentTime;
            tokenExpirationTimer = setTimeout(() => {
              console.log('Token expired, logging out automatically');
              logout();
            }, timeUntilExpiry);

            return;
          } else {
            // Token expired, clean up localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('tokenExpiry');
          }
        }

        // No valid token found
        setAuthState(prev => ({
          ...prev,
          isLoading: false
        }));
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to initialize authentication'
        }));
      }
    };

    initializeAuth();

    // Cleanup timer on unmount
    return () => {
      if (tokenExpirationTimer) {
        clearTimeout(tokenExpirationTimer);
      }
    };
  }, []);

  // Login function
  const login = (userData: { token: string; user: User; expires_at: string }) => {
    try {
      // Store in localStorage for persistence
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData.user));
      localStorage.setItem('tokenExpiry', userData.expires_at);

      // Update context state for reactivity
      setAuthState({
        user: userData.user,
        token: userData.token,
        tokenExpiry: userData.expires_at,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });

      console.log('🔐 Auth State after login:', {
        user: userData.user,
        token: userData.token,
        tokenExpiry: userData.expires_at,
        isAuthenticated: true
      });
      // Set up automatic logout timer for new login
      const expiryTime = new Date(userData.expires_at).getTime();
      const currentTime = new Date().getTime();
      const timeUntilExpiry = expiryTime - currentTime;

      if (timeUntilExpiry > 0) {
        setTimeout(() => {
          console.log('Token expired, logging out automatically');
          logout();
        }, timeUntilExpiry);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to store authentication data'
      }));
    }
  };


  // Clear error function
  const clearError = () => {
    setAuthState(prev => ({
      ...prev,
      error: null
    }));
  };

  // Context value
  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    clearError,
    checkTokenExpiration
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};