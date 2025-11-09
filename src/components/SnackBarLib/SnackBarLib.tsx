import React from 'react';
import { Alert, Box, Slide } from '@mui/material';

export type SnackBarType = 'success' | 'warning' | 'error' | 'info';

export type SnackBarPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export type SnackBarAction = 'save' | 'update' | 'delete' | 'custom';

export interface SnackBarLibProps {
  type: SnackBarType;
  description?: string;
  show?: boolean;
  onClose?: () => void;
  autoHideDuration?: number;
  position?: SnackBarPosition;
  action?: SnackBarAction;
  entityName?: string; // Optional: name of entity being acted upon (e.g., "User", "Student")
}

const getNotificationConfig = (type: SnackBarType) => {
  const configs = {
    success: {
      color: '#4caf50',
      bgColor: '#e8f5e8',
      borderColor: '#4caf50'
    },
    warning: {
      color: '#ff9800',
      bgColor: '#fff3e0',
      borderColor: '#ff9800'
    },
    error: {
      color: '#f44336',
      bgColor: '#ffebee',
      borderColor: '#f44336'
    },
    info: {
      color: '#2196f3',
      bgColor: '#e3f2fd',
      borderColor: '#2196f3'
    }
  };

  return configs[type];
};

// Generate automatic message based on action and type
const getActionMessage = (
  action: SnackBarAction | undefined,
  type: SnackBarType,
  entityName?: string
): string => {
  const entity = entityName || 'Data';

  if (action === 'save') {
    return type === 'success'
      ? `${entity} saved successfully!`
      : `Failed to save ${entity.toLowerCase()}. Please try again.`;
  }

  if (action === 'update') {
    return type === 'success'
      ? `${entity} updated successfully!`
      : `Failed to update ${entity.toLowerCase()}. Please try again.`;
  }

  if (action === 'delete') {
    return type === 'success'
      ? `${entity} deleted successfully!`
      : `Failed to delete ${entity.toLowerCase()}. Please try again.`;
  }

  return ''; // For 'custom' action, description must be provided
};

export default function SnackBarLib({
  type,
  description,
  show = true,
  onClose,
  autoHideDuration = 5000,
  position = 'top-right',
  action,
  entityName
}: SnackBarLibProps) {
  const config = getNotificationConfig(type);

  // Use provided description or generate from action
  const displayMessage = description || getActionMessage(action, type, entityName);

  React.useEffect(() => {
    if (autoHideDuration && show) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, show, onClose]);

  const getPositionStyles = () => {
    const positions = {
      'top-right': { top: 20, right: 20 },
      'top-left': { top: 20, left: 20 },
      'bottom-right': { bottom: 20, right: 20 },
      'bottom-left': { bottom: 20, left: 20 },
      'top-center': { top: 20, left: '50%', transform: 'translateX(-50%)' },
      'bottom-center': { bottom: 20, left: '50%', transform: 'translateX(-50%)' }
    };
    
    return positions[position];
  };

  if (!show) return null;

  return (
    <Slide direction="left" in={show} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          zIndex: 9999,
          minWidth: 300,
          maxWidth: 400,
          ...getPositionStyles()
        }}
      >
        <Alert
          severity={type}
          onClose={onClose}
          sx={{
            width: '100%',
            backgroundColor: config.bgColor,
            color: config.color,
            border: `1px solid ${config.borderColor}`,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '& .MuiAlert-icon': {
              color: config.color
            },
            '& .MuiAlert-message': {
              color: config.color
            }
          }}
        >
          {displayMessage}
        </Alert>
      </Box>
    </Slide>
  );
}
