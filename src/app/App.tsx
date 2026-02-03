import { useState, useEffect } from "react";
import { Navigation } from "@/app/components/navigation";
import { Dashboard } from "@/app/components/dashboard";
import { Reports } from "@/app/components/reports";
import { AddMedicationForm, MedicationFormData } from "@/app/components/add-medication-form";
import { AuthScreen } from "@/app/components/auth-screen";
import { toast, Toaster } from "sonner";

interface User {
  email: string;
  id: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: number;
  unit: string;
  times: string[];
  startDate: string;
  endDate?: string;
  instructions?: string;
  condition?: string;
  prescribedBy?: string;
}

interface DoseHistory {
  medicationId: string;
  scheduledTime: string;
  takenAt: string;
  date: string;
}

interface UserData {
  medications: Medication[];
  doseHistory: DoseHistory[];
}

const STORAGE_PREFIX = 'meditrack_';

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'reports'>('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseHistory, setDoseHistory] = useState<DoseHistory[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(`${STORAGE_PREFIX}user`);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      loadUserData(parsedUser.id);
    }
  }, []);

  // Update sync time whenever data changes
  useEffect(() => {
    if (user && (medications.length > 0 || doseHistory.length > 0)) {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
      setLastSyncTime(`Today at ${time}`);
    }
  }, [medications, doseHistory, user]);

  const loadUserData = (userId: string) => {
    const savedData = localStorage.getItem(`${STORAGE_PREFIX}data_${userId}`);
    if (savedData) {
      const data: UserData = JSON.parse(savedData);
      setMedications(data.medications || []);
      setDoseHistory(data.doseHistory || []);
    }
  };

  const saveUserData = (userId: string, meds: Medication[], history: DoseHistory[]) => {
    const data: UserData = {
      medications: meds,
      doseHistory: history
    };
    localStorage.setItem(`${STORAGE_PREFIX}data_${userId}`, JSON.stringify(data));
  };

  const handleLogin = (email: string, password: string) => {
    // Simulate authentication - in real app this would call a backend
    const users = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}users`) || '{}');
    
    if (users[email] && users[email].password === password) {
      const user: User = {
        email,
        id: users[email].id
      };
      setUser(user);
      localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(user));
      loadUserData(user.id);
      setShowAuth(false);
      toast.success('Welcome back to MediTrack');
    } else {
      toast.error('Invalid email or password');
    }
  };

  const handleSignUp = (email: string, password: string) => {
    // Simulate user creation - in real app this would call a backend
    const users = JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}users`) || '{}');
    
    if (users[email]) {
      toast.error('An account with this email already exists');
      return;
    }

    const userId = Date.now().toString();
    users[email] = {
      id: userId,
      password,
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(users));
    
    const user: User = { email, id: userId };
    setUser(user);
    localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(user));
    setShowAuth(false);
    toast.success('Account created successfully');
  };

  const handleLogout = () => {
    setUser(null);
    setMedications([]);
    setDoseHistory([]);
    setLastSyncTime('');
    localStorage.removeItem(`${STORAGE_PREFIX}user`);
    setActiveView('dashboard');
    toast.success('Logged out successfully');
  };

  const handleSaveMedication = (formData: MedicationFormData) => {
    if (!user) {
      toast.error('Please sign in to add medications');
      return;
    }

    const newMedication: Medication = {
      id: Date.now().toString(),
      name: formData.name,
      dosage: formData.dosage,
      unit: formData.unit,
      times: formData.times,
      startDate: formData.startDate,
      endDate: formData.endDate,
      instructions: formData.instructions,
      condition: formData.condition,
      prescribedBy: formData.prescribedBy
    };

    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    saveUserData(user.id, updatedMedications, doseHistory);
    toast.success(`${formData.name} added to your medications`);
  };

  const handleMarkTaken = (medicationId: string, scheduledTime: string) => {
    if (!user) {
      toast.error('Please sign in to track doses');
      return;
    }

    const now = new Date();
    const todayDate = now.toISOString().split('T')[0];
    
    const newDose: DoseHistory = {
      medicationId,
      scheduledTime,
      takenAt: now.toISOString(),
      date: todayDate
    };

    const updatedHistory = [...doseHistory, newDose];
    setDoseHistory(updatedHistory);
    saveUserData(user.id, medications, updatedHistory);
    
    const medication = medications.find(m => m.id === medicationId);
    toast.success(`${medication?.name} marked as taken`);
  };

  const handleSignInPrompt = () => {
    setShowAuth(true);
  };

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: '#F7FAF9' }}>
        {showAuth ? (
          <AuthScreen onLogin={handleLogin} onSignUp={handleSignUp} />
        ) : (
          <>
            <Navigation 
              onAddMedication={() => {
                if (!user) {
                  setShowAuth(true);
                  toast.error('Please sign in to add medications');
                } else {
                  setShowAddForm(true);
                }
              }}
              activeView={activeView}
              onViewChange={setActiveView}
              user={user}
              onLogout={handleLogout}
            />
            
            {activeView === 'dashboard' ? (
              <Dashboard 
                medications={medications}
                onAddMedication={() => user ? setShowAddForm(true) : setShowAuth(true)}
                user={user}
                onSignIn={handleSignInPrompt}
                doseHistory={doseHistory}
                onMarkTaken={handleMarkTaken}
                lastSyncTime={lastSyncTime}
              />
            ) : (
              <Reports 
                medications={medications}
                doseHistory={doseHistory}
                user={user}
                onSignIn={handleSignInPrompt}
              />
            )}

            {showAddForm && user && (
              <AddMedicationForm
                onClose={() => setShowAddForm(false)}
                onSave={handleSaveMedication}
              />
            )}
          </>
        )}
      </div>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'white',
            color: '#0F172A',
            border: '1px solid #E6EAF0',
            fontSize: '14px'
          },
          duration: 3000
        }}
      />
    </>
  );
}
