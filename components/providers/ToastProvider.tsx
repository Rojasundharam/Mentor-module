'use client';

import React, { createContext, useContext } from 'react';
import { useToast, ToastContainer } from '@/components/ui/Toast';
import type { ToastType } from '@/components/ui/Toast';

interface ToastContextType {
  success: (message: string, description?: string, duration?: number) => void;
  error: (message: string, description?: string, duration?: number) => void;
  warning: (message: string, description?: string, duration?: number) => void;
  info: (message: string, description?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, toast, removeToast } = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} position="top-right" />
    </ToastContext.Provider>
  );
}

/**
 * Hook to use toast notifications globally
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const toast = useToastNotification();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       toast.success('Saved!', 'Your changes have been saved');
 *     } catch (error) {
 *       toast.error('Error', 'Failed to save changes');
 *     }
 *   };
 * }
 * ```
 */
export function useToastNotification() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastNotification must be used within a ToastProvider');
  }
  return context;
}

// Export alias for convenience
export { useToastNotification as useToast };
