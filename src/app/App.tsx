import { useState, useEffect } from "react";
import { Navigation } from "@/app/components/navigation";
import { Dashboard } from "@/app/components/dashboard";
import { Reports } from "@/app/components/reports";
import { AddMedicationForm, MedicationFormData } from "@/app/components/add-medication-form";
import { AuthScreen } from "@/app/components/auth-screen";
import { useAuth } from "@/context/AuthContext";
import { toast, Toaster } from "sonner";

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
  status?: 'taken' | 'missed';
}

interface UserData {
  medications: Medication[];
  doseHistory: DoseHistory[];
}

const STORAGE_PREFIX = 'meditrack_';

export default function App() {
  const { user, loading, signOut, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'reports'>('dashboard');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doseHistory, setDoseHistory] = useState<DoseHistory[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Load user data when user logs in
  useEffect(() => {
    if (user) {
      loadUserData(user.id);
      setShowAuth(false);
    } else {
      setMedications([]);
      setDoseHistory([]);
      setLastSyncTime('');
    }
  }, [user]);

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

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signInWithEmail(email, password);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Welcome back to MediTrack');
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    const { error } = await signUpWithEmail(email, password);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Account created successfully! Check your email to confirm.');
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error(error);
    }
  };

  const handleLogout = async () => {
    await signOut();
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
      date: todayDate,
      status: 'taken'
    };

    const updatedHistory = [...doseHistory, newDose];
    setDoseHistory(updatedHistory);
    saveUserData(user.id, medications, updatedHistory);

    const medication = medications.find(m => m.id === medicationId);
    toast.success(`${medication?.name} marked as taken`);
  };

  const handleMarkMissed = (medicationId: string, scheduledTime: string) => {
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
      date: todayDate,
      status: 'missed'
    };

    const updatedHistory = [...doseHistory, newDose];
    setDoseHistory(updatedHistory);
    saveUserData(user.id, medications, updatedHistory);

    const medication = medications.find(m => m.id === medicationId);
    toast.error(`${medication?.name} marked as missed`);
  };

  const handleSignInPrompt = () => {
    setShowAuth(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F7FAF9' }}>
        <div className="text-center">
          <div
            className="w-10 h-10 mx-auto mb-4 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#0F766E', borderTopColor: 'transparent' }}
          />
          <p style={{ color: '#475569', fontSize: '14px' }}>Loading...</p>
        </div>
      </div>
    );
  }

  const userForComponents = user ? { email: user.email ?? '' } : null;

  return (
    <>
      <div className="min-h-screen" style={{ backgroundColor: '#F7FAF9' }}>
        {showAuth && !user ? (
          <AuthScreen
            onLogin={handleLogin}
            onSignUp={handleSignUp}
            onGoogleSignIn={handleGoogleSignIn}
          />
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
              user={userForComponents}
              onLogout={handleLogout}
            />

            {activeView === 'dashboard' ? (
              <Dashboard
                medications={medications}
                onAddMedication={() => user ? setShowAddForm(true) : setShowAuth(true)}
                user={userForComponents}
                onSignIn={handleSignInPrompt}
                doseHistory={doseHistory}
                onMarkTaken={handleMarkTaken}
                onMarkMissed={handleMarkMissed}
                lastSyncTime={lastSyncTime}
              />
            ) : (
              <Reports
                medications={medications}
                doseHistory={doseHistory}
                user={userForComponents}
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
