import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { API_CONFIG, authenticatedFetch } from '../config/api';
import type { RefFaculty, RefProgramme, RefRole } from './reference.interface';
import { useAuth } from './AuthContext';

// LocalStorage keys for caching reference data
const STORAGE_KEYS = {
  ROLES: 'ref_roles',
  PROGRAMME: 'ref_programme',
  FACULTY: 'ref_faculty',
  TIMESTAMP: 'ref_timestamp'
};

// Cache duration in milliseconds (24 hours)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Helper function to check if cached data is still valid
const isCacheValid = (): boolean => {
  const timestamp = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);
  if (!timestamp) return false;

  const cacheAge = Date.now() - parseInt(timestamp, 10);
  return cacheAge < CACHE_DURATION;
};

// Helper function to load data from localStorage
const loadFromCache = (): { roles: RefRole[]; programme: RefProgramme[]; faculty: RefFaculty[] } | null => {
  try {
    if (!isCacheValid()) {
      return null;
    }

    const roles = localStorage.getItem(STORAGE_KEYS.ROLES);
    const programme = localStorage.getItem(STORAGE_KEYS.PROGRAMME);
    const faculty = localStorage.getItem(STORAGE_KEYS.FACULTY);

    if (!roles || !programme || !faculty) {
      return null;
    }

    return {
      roles: JSON.parse(roles),
      programme: JSON.parse(programme),
      faculty: JSON.parse(faculty)
    };
  } catch (error) {
    console.error('Error loading from cache:', error);
    return null;
  }
};

// Helper function to save data to localStorage
const saveToCache = (roles: RefRole[], programme: RefProgramme[], faculty: RefFaculty[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles));
    localStorage.setItem(STORAGE_KEYS.PROGRAMME, JSON.stringify(programme));
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
    localStorage.setItem(STORAGE_KEYS.TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

// Define the structure of our reference data state
// This interface describes what data we'll store and share across components
interface ReferenceData {
  roles: RefRole[];        // Array of role objects from the API
  programme: RefProgramme[];
  faculty: RefFaculty[];
  // countries: RefCountry[];        // Array of country objects from the API
  isLoading: boolean;      // Flag to show loading state (true while fetching data)
  error: string | null;    // Error message if something goes wrong (null if no errors)
}

// Create a React Context - this is like a "data pipe" that can share data between components
// The context will hold our ReferenceData and make it available to any component that needs it
// We start with undefined because the context hasn't been initialized yet
const ReferenceDataContext = createContext<ReferenceData | undefined>(undefined);

// Custom hook that components will use to access the reference data
// This hook provides a safe way to get data from the context
export const useReferenceData = () => {
  // Get the current value from the context
  const context = useContext(ReferenceDataContext);
  
  // Safety check: make sure this hook is used inside a ReferenceDataProvider
  // If someone tries to use this hook outside the provider, we'll get an error
  if (context === undefined) {
    throw new Error('useReferenceData must be used within a ReferenceDataProvider');
  }
  
  return context;
};

// Props interface for our provider component
// The provider will wrap our app and provide the reference data to all child components
interface ReferenceDataProviderProps {
  children: ReactNode;  // ReactNode is the type for any valid React content (components, text, etc.)
}

// This is the main provider component that will:
// 1. Load reference data when the app starts
// 2. Store the data in state
// 3. Provide the data to all child components via context
export const ReferenceDataProvider: React.FC<ReferenceDataProviderProps> = ({ children }) => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // useState hook to manage our reference data state
  // This state will be shared with all components that use the context
  const [referenceData, setReferenceData] = useState<ReferenceData>({
    roles: [],  
    programme: [],
    faculty: [],         // Start with empty roles array
    // countries: [],        // Start with empty countries array
    isLoading: true,     // Start with loading = true (we're about to fetch data)
    error: null          // Start with no errors
  });

  // useEffect hook runs when authentication state changes
  // This is where we fetch the reference data from the API
  useEffect(() => {
    // Async function to load our reference data
    const loadReferenceData = async () => {
      // First, try to load from cache
      const cachedData = loadFromCache();

      if (cachedData) {
        // Cache is valid, use cached data
        console.log('Loading reference data from cache');
        setReferenceData({
          ...cachedData,
          isLoading: false,
          error: null
        });
        return;
      }

      // No valid cache, fetch from API
      console.log('Loading reference data from API');
      setReferenceData(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        // Make API calls in parallel for better performance
        // Promise.all runs all three requests simultaneously
        const [rolesResponse, programmeResponse, facultyResponse] = await Promise.all([
          authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/roles`),
          authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/programme`),
          authenticatedFetch(`${API_CONFIG.BASE_URL}/ref/faculty`)
        ]);

        const roles = rolesResponse.data || [];
        const programme = programmeResponse.data || [];
        const faculty = facultyResponse.data || [];

        // Save to cache for future use
        saveToCache(roles, programme, faculty);

        // Update our state with the fetched data
        setReferenceData({
          roles,
          programme,
          faculty,
          isLoading: false,    // Data loaded, so loading is now false
          error: null          // No errors occurred
        });
      } catch (error) {
        // If something goes wrong (network error, API error, etc.)
        console.error('Failed to load reference data:', error);

        // Update state to show the error
        setReferenceData(prev => ({
          ...prev,                    // Keep existing data (roles and countries arrays)
          isLoading: false,           // Loading is done (even though it failed)
          error: 'Failed to load reference data'  // Set error message
        }));
      }
    };

    // Wait for auth to finish loading first
    if (authLoading) {
      return;
    }

    if (isAuthenticated) {
      // User is logged in, so fetch the reference data
      loadReferenceData();
    } else {
      // User is not logged in, clear data and set loading to false
      setReferenceData({
        roles: [],
        programme: [],
        faculty: [],
        isLoading: false,
        error: null
      });
    }
  }, [isAuthenticated, authLoading]); // Re-run when authentication state changes

  // Return the provider component
  // This wraps all child components and gives them access to our reference data
  return (
    <ReferenceDataContext.Provider value={referenceData}>
      {children}  {/* Render all the child components that were passed in */}
    </ReferenceDataContext.Provider>
  );
};