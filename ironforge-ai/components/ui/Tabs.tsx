'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type TabsContextValue = {
  activeTab: string;
  setActiveTab: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a <Tabs>');
  }
  return context;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onValueChange, className, children, ...props }, ref) => {
    const [activeTab, setInternalTab] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentTab = isControlled ? value! : activeTab;

    const setActiveTab = React.useCallback(
      (newValue: string) => {
        if (!isControlled) {
          setInternalTab(newValue);
        }
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange]
    );

    return (
      <TabsContext.Provider value={{ activeTab: currentTab, setActiveTab }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);
Tabs.displayName = 'Tabs';

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {}

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        'inline-flex h-12 items-center justify-center gap-1 p-1 rounded-2xl bg-neutral-800/60 border border-neutral-700/60',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
TabList.displayName = 'TabList';

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ value, className, children, ...props }, ref) => {
    const { activeTab, setActiveTab } = useTabsContext();
    const isActive = activeTab === value;

    return (
      <button
        ref={ref}
        role="tab"
        aria-selected={isActive}
        data-state={isActive ? 'active' : 'inactive'}
        onClick={() => setActiveTab(value)}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/40',
          'disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'bg-neutral-900 text-gray-100 shadow-sm border border-neutral-700/50'
            : 'text-gray-400 hover:text-gray-200 hover:bg-neutral-700/40',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Tab.displayName = 'Tab';

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ value, className, children, ...props }, ref) => {
    const { activeTab } = useTabsContext();
    const isActive = activeTab === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        role="tabpanel"
        data-state={isActive ? 'active' : 'inactive'}
        className={cn(
          'mt-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400/40 rounded-2xl',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabPanel.displayName = 'TabPanel';

export { Tabs, TabList, Tab, TabPanel };
