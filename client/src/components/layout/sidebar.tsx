import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Anchor, 
  BarChart3, 
  Bell, 
  Map, 
  Menu, 
  Settings, 
  TrendingUp, 
  Users, 
  Wrench,
  Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  alertCount?: number;
}

export function Sidebar({ alertCount = 0 }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: Gauge, current: true },
    { name: 'Navigation', icon: Map, current: false },
    { name: 'Performance', icon: TrendingUp, current: false },
    { name: 'Alerts', icon: Bell, current: false, badge: alertCount },
    { name: 'Maintenance', icon: Wrench, current: false },
    { name: 'Analytics', icon: BarChart3, current: false },
    { name: 'Users', icon: Users, current: false },
  ];

  return (
    <div
      className={cn(
        "sidebar-transition bg-sidebar border-r border-sidebar-border flex flex-col",
        isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-maritime-blue rounded-lg flex items-center justify-center flex-shrink-0">
            <Anchor className="text-white text-lg" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-sidebar-foreground truncate">
                Marine Ops
              </h1>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Vessel Control
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent flex-shrink-0"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.name}
              variant={item.current ? "default" : "ghost"}
              className={cn(
                "w-full justify-start",
                item.current 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto bg-alert-red text-white animate-pulse"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40"
            alt="Captain Profile"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                Capt. Rodriguez
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                Chief Officer
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
