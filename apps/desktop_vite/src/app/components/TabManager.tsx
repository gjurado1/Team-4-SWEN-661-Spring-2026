import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import { getPageTitle } from '../lib/routing';

export interface Tab {
  id: string;
  path: string;
  title: string;
  icon?: React.ReactNode;
  params?: Record<string, any>;
}

interface TabManagerProps {
  onTabChange?: (tabId: string) => void;
}

export function TabManager({ onTabChange }: TabManagerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const previousLocationRef = useRef(location.pathname);
  
  // Load tabs from localStorage or create default tab
  const getInitialTabs = (): Tab[] => {
    const saved = localStorage.getItem('careconnect-tabs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [createDefaultTab()];
      } catch {
        return [createDefaultTab()];
      }
    }
    return [createDefaultTab()];
  };

  const getInitialActiveTab = (): string => {
    const saved = localStorage.getItem('careconnect-active-tab');
    return saved || getInitialTabs()[0].id;
  };

  function createDefaultTab(): Tab {
    return {
      id: generateTabId(),
      path: '/dashboard',
      title: 'Dashboard',
    };
  }

  const [tabs, setTabs] = useState<Tab[]>(getInitialTabs);
  const [activeTabId, setActiveTabId] = useState<string>(getInitialActiveTab);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('careconnect-tabs', JSON.stringify(tabs));
  }, [tabs]);

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('careconnect-active-tab', activeTabId);
    if (onTabChange) {
      onTabChange(activeTabId);
    }
  }, [activeTabId, onTabChange]);

  // Update active tab path when location changes
  useEffect(() => {
    // Only update if location actually changed
    if (previousLocationRef.current !== location.pathname) {
      previousLocationRef.current = location.pathname;
      
      setTabs(prevTabs => 
        prevTabs.map(tab => 
          tab.id === activeTabId 
            ? { ...tab, path: location.pathname, title: getPageTitle(location.pathname) }
            : tab
        )
      );
    }
  }, [location.pathname, activeTabId]);

  function generateTabId(): string {
    return `tab-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  function updateActiveTabTitle(title: string) {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === activeTabId
          ? { ...tab, title }
          : tab
      )
    );
  }

  function openNewTab(path: string, params?: Record<string, any>) {
    const newTab: Tab = {
      id: generateTabId(),
      path,
      title: getPageTitle(path),
      params,
    };
    
    setTabs(prevTabs => [...prevTabs, newTab]);
    setActiveTabId(newTab.id);
    previousLocationRef.current = path;
    navigate(path);
  }

  function closeTab(tabId: string) {
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    
    // Don't close if it's the last tab
    if (tabs.length === 1) {
      return;
    }

    // If closing active tab, switch to adjacent tab first
    if (tabId === activeTabId) {
      const newActiveIndex = tabIndex > 0 ? tabIndex - 1 : 0;
      const newActiveTabs = tabs.filter(tab => tab.id !== tabId);
      if (newActiveTabs[newActiveIndex]) {
        const newActiveTab = newActiveTabs[newActiveIndex];
        setActiveTabId(newActiveTab.id);
        previousLocationRef.current = newActiveTab.path;
        navigate(newActiveTab.path);
      }
    }

    // Remove the tab
    setTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
  }

  function switchToTab(tabId: string) {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      setActiveTabId(tabId);
      previousLocationRef.current = tab.path;
      navigate(tab.path);
    }
  }

  // Expose tab management functions globally for other components to use
  useEffect(() => {
    (window as any).tabManager = {
      openNewTab,
      closeTab,
      switchToTab,
      updateActiveTabTitle,
      getTabs: () => tabs,
      getActiveTabId: () => activeTabId,
    };

    return () => {
      delete (window as any).tabManager;
    };
  }, [tabs, activeTabId]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Tab Bar */}
      <div 
        className="flex items-center gap-0 overflow-x-auto"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderBottom: '2px solid var(--color-border)',
          minHeight: '42px',
        }}
      >
        {/* Tabs */}
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          
          return (
            <div
              key={tab.id}
              className="group flex items-center gap-2 px-4 py-2 cursor-pointer transition-all relative"
              style={{
                backgroundColor: isActive ? 'var(--color-surface)' : 'transparent',
                borderRight: '1px solid var(--color-border)',
                borderBottom: isActive ? '2px solid var(--color-focus)' : '2px solid transparent',
                marginBottom: '-2px',
                minWidth: '180px',
                maxWidth: '240px',
                transition: 'var(--transition-fast)',
              }}
              onClick={() => switchToTab(tab.id)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--btn-secondary-hover-bg)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span 
                className="flex-1 truncate"
                style={{
                  fontSize: 'var(--font-size-body)',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                }}
              >
                {tab.title}
              </span>
              
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className="flex-shrink-0 p-1 rounded transition-all outline-none opacity-0 group-hover:opacity-100"
                style={{
                  color: 'var(--color-text-muted)',
                  transition: 'var(--transition-fast)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-danger)';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-muted)';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = `var(--focus-ring-width) solid var(--focus-ring-color)`;
                  e.currentTarget.style.outlineOffset = 'var(--focus-ring-offset)';
                  e.currentTarget.style.opacity = '1';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = 'none';
                }}
                aria-label={`Close ${tab.title}`}
                disabled={tabs.length === 1}
                title={tabs.length === 1 ? 'Cannot close last tab' : `Close ${tab.title}`}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          onClick={() => openNewTab('/dashboard')}
          className="flex-shrink-0 p-2 mx-1 rounded transition-all outline-none"
          style={{
            color: 'var(--color-text-muted)',
            transition: 'var(--transition-medium)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--btn-secondary-hover-bg)';
            e.currentTarget.style.color = 'var(--color-focus)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-text-muted)';
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = `var(--focus-ring-width) solid var(--focus-ring-color)`;
            e.currentTarget.style.outlineOffset = 'var(--focus-ring-offset)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.outline = 'none';
          }}
          aria-label="New Tab"
          title="New Tab (Ctrl+T)"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
