import { Plus, LogOut, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

interface NavigationProps {
  onAddMedication: () => void;
  activeView: 'dashboard' | 'reports';
  onViewChange: (view: 'dashboard' | 'reports') => void;
  user: { email: string } | null;
  onLogout: () => void;
}

export function Navigation({ onAddMedication, activeView, onViewChange, user, onLogout }: NavigationProps) {
  return (
    <nav className="border-b bg-white" style={{ borderColor: '#E6EAF0' }}>
      <div className="max-w-[1200px] mx-auto px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0F766E' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2L4 6V10C4 14 10 18 10 18C10 18 16 14 16 10V6L10 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M8 10L9.5 11.5L12.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <ellipse cx="10" cy="10" rx="1.5" ry="2.5" fill="white" opacity="0.9"/>
                <rect x="9" y="9" width="2" height="4" rx="1" fill="#0F766E"/>
              </svg>
            </div>
            <span className="font-semibold" style={{ fontSize: '16px', color: '#0F172A' }}>MediTrack</span>
          </div>
          
          {user && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onViewChange('dashboard')}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: activeView === 'dashboard' ? '#F7FAF9' : 'transparent',
                  color: activeView === 'dashboard' ? '#0F766E' : '#475569'
                }}
              >
                Dashboard
              </button>
              <button
                onClick={() => onViewChange('reports')}
                className="px-4 py-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: activeView === 'reports' ? '#F7FAF9' : 'transparent',
                  color: activeView === 'reports' ? '#0F766E' : '#475569'
                }}
              >
                Reports
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                onClick={onAddMedication}
                className="h-11 px-6 gap-2"
                style={{ backgroundColor: '#0F766E' }}
              >
                <Plus className="w-4 h-4" />
                Add Medication
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="w-10 h-10 rounded-full flex items-center justify-center border"
                    style={{ backgroundColor: '#F7FAF9', borderColor: '#E6EAF0' }}
                  >
                    <User className="w-5 h-5" style={{ color: '#0F766E' }} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-2">
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>Account</p>
                    <p style={{ fontSize: '12px', color: '#475569' }}>{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="px-4 py-2 rounded-lg" style={{ backgroundColor: '#F7FAF9' }}>
              <p style={{ fontSize: '12px', color: '#475569' }}>Preview Mode</p>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
