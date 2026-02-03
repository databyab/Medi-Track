import { Clock, Pill, TrendingUp, Calendar, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";

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

interface DashboardProps {
  medications: Medication[];
  onAddMedication: () => void;
  user: { email: string } | null;
  onSignIn: () => void;
  doseHistory: DoseHistory[];
  onMarkTaken: (medicationId: string, scheduledTime: string) => void;
  lastSyncTime?: string;
}

export function Dashboard({ medications, onAddMedication, user, onSignIn, doseHistory, onMarkTaken, lastSyncTime }: DashboardProps) {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const todayDate = new Date().toISOString().split('T')[0];

  // Get today's scheduled medications
  const todaysMedications = medications.flatMap(med => 
    med.times.map(time => ({
      ...med,
      scheduledTime: time,
      isTaken: doseHistory.some(
        h => h.medicationId === med.id && h.scheduledTime === time && h.date === todayDate
      )
    }))
  ).sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

  // Calculate today's progress
  const totalDosesToday = todaysMedications.length;
  const takenDosesToday = todaysMedications.filter(m => m.isTaken).length;

  // If not logged in, show preview mode
  if (!user) {
    return (
      <div className="max-w-[1200px] mx-auto px-8 py-10">
        <section className="mb-10">
          <h1 className="mb-3" style={{ color: '#0F172A' }}>
            Track your medications, doses, and schedule — clearly and reliably.
          </h1>
        </section>

        <div 
          className="rounded-[18px] p-12 text-center"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0px 8px 24px rgba(2, 6, 23, 0.08)'
          }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#F7FAF9' }}>
            <Lock className="w-10 h-10" style={{ color: '#0F766E' }} />
          </div>
          <h2 className="mb-3">Sign in to save your progress</h2>
          <p style={{ color: '#475569', maxWidth: '420px', margin: '0 auto 32px', lineHeight: '1.6' }}>
            Track medications and access your data from any device.
          </p>
          <Button
            onClick={onSignIn}
            className="h-11 px-8"
            style={{ backgroundColor: '#0F766E' }}
          >
            Sign In or Create Account
          </Button>
          
          <div className="mt-8 pt-8 border-t" style={{ borderColor: '#E6EAF0' }}>
            <p style={{ fontSize: '12px', color: '#475569' }}>
              Your data is private and encrypted
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 py-10">
      {/* Hero Section */}
      <section className="mb-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-3" style={{ color: '#0F172A' }}>
              Track your medications, doses, and schedule — clearly and reliably.
            </h1>
          </div>
          {lastSyncTime && (
            <div className="text-right">
              <p style={{ fontSize: '12px', color: '#4D7C6F', fontWeight: 600 }}>✓ Progress synced</p>
              <p style={{ fontSize: '12px', color: '#475569' }}>{lastSyncTime}</p>
            </div>
          )}
        </div>
      </section>

      {/* Today's Progress Bar */}
      {totalDosesToday > 0 && (
        <section className="mb-6">
          <div 
            className="rounded-xl p-4 flex items-center gap-4"
            style={{ backgroundColor: 'white', border: '1px solid #E6EAF0' }}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                  Today's Progress
                </p>
                <p style={{ fontSize: '14px', color: '#475569' }}>
                  {takenDosesToday} of {totalDosesToday} doses
                </p>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: '#F7FAF9' }}>
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ 
                    backgroundColor: '#4D7C6F',
                    width: `${totalDosesToday > 0 ? (takenDosesToday / totalDosesToday) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
            {takenDosesToday === totalDosesToday && totalDosesToday > 0 && (
              <CheckCircle2 className="w-6 h-6" style={{ color: '#4D7C6F' }} />
            )}
          </div>
        </section>
      )}

      {/* Today's Medications Panel */}
      <section className="mb-10">
        <div 
          className="rounded-[18px] p-8"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0px 8px 24px rgba(2, 6, 23, 0.08)'
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="mb-1">Today's Medications</h2>
              <p style={{ fontSize: '12px', color: '#475569' }}>{today}</p>
            </div>
            <Clock className="w-6 h-6" style={{ color: '#6B9080' }} />
          </div>

          {todaysMedications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F7FAF9' }}>
                <Pill className="w-8 h-8" style={{ color: '#6B9080' }} />
              </div>
              <p style={{ color: '#0F172A', marginBottom: '4px', fontWeight: 600 }}>
                No doses scheduled yet
              </p>
              <p style={{ fontSize: '12px', color: '#475569', marginBottom: '24px' }}>
                Add a medication to get started
              </p>
              <Button 
                onClick={onAddMedication}
                variant="outline"
              >
                Add Your First Medication
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {todaysMedications.map((med, idx) => (
                <div 
                  key={`${med.id}-${idx}`}
                  className="flex items-center justify-between p-4 rounded-xl border"
                  style={{ 
                    backgroundColor: med.isTaken ? '#F0F9F4' : '#F7FAF9', 
                    borderColor: med.isTaken ? '#4D7C6F' : '#E6EAF0'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center" 
                      style={{ backgroundColor: med.isTaken ? '#4D7C6F' : 'white' }}
                    >
                      {med.isTaken ? (
                        <CheckCircle2 className="w-6 h-6" style={{ color: 'white' }} />
                      ) : (
                        <Pill className="w-6 h-6" style={{ color: '#0F766E' }} />
                      )}
                    </div>
                    <div>
                      <h3 className="mb-1">{med.name}</h3>
                      <p style={{ fontSize: '12px', color: '#475569' }}>
                        {med.dosage} {med.unit} • {med.scheduledTime}
                      </p>
                    </div>
                  </div>
                  {!med.isTaken ? (
                    <button 
                      onClick={() => onMarkTaken(med.id, med.scheduledTime)}
                      className="px-4 py-2 rounded-lg"
                      style={{ backgroundColor: '#0F766E', color: 'white' }}
                    >
                      Mark Taken
                    </button>
                  ) : (
                    <div className="px-4 py-2" style={{ color: '#4D7C6F', fontSize: '14px', fontWeight: 600 }}>
                      ✓ Completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="mb-10">
        <h2 className="mb-6">What MediTrack helps you with</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            className="p-6 rounded-[16px]"
            style={{
              backgroundColor: 'white',
              border: '1px solid #E6EAF0'
            }}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#F7FAF9' }}>
              <Pill className="w-6 h-6" style={{ color: '#0F766E' }} />
            </div>
            <h3 className="mb-2">Track every dose</h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              Log doses as you take them
            </p>
          </div>

          <div 
            className="p-6 rounded-[16px]"
            style={{
              backgroundColor: 'white',
              border: '1px solid #E6EAF0'
            }}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#F7FAF9' }}>
              <Calendar className="w-6 h-6" style={{ color: '#4D7C6F' }} />
            </div>
            <h3 className="mb-2">Monitor adherence</h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              See how consistently you take medications
            </p>
          </div>

          <div 
            className="p-6 rounded-[16px]"
            style={{
              backgroundColor: 'white',
              border: '1px solid #E6EAF0'
            }}
          >
            <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#F7FAF9' }}>
              <TrendingUp className="w-6 h-6" style={{ color: '#6B9080' }} />
            </div>
            <h3 className="mb-2">Identify patterns</h3>
            <p style={{ color: '#475569', lineHeight: '1.6' }}>
              Understand missed-dose trends
            </p>
          </div>
        </div>
      </section>

      {/* Health Insights Section (Locked) */}
      <section>
        <h2 className="mb-6">Health Insights</h2>
        <div 
          className="rounded-[18px] p-8"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0px 8px 24px rgba(2, 6, 23, 0.08)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LockedInsightCard 
              title="Adherence Score"
              description="Overall medication compliance"
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <LockedInsightCard 
              title="Missed Dose Patterns"
              description="When you're most likely to miss doses"
              icon={<Clock className="w-5 h-5" />}
            />
            <LockedInsightCard 
              title="Consistency Streaks"
              description="Days of perfect adherence"
              icon={<Calendar className="w-5 h-5" />}
            />
          </div>
          
          <div className="mt-6 pt-6 border-t" style={{ borderColor: '#E6EAF0' }}>
            <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center' }}>
              Available after 7 days of tracking
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function LockedInsightCard({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) {
  return (
    <div 
      className="p-6 rounded-xl relative"
      style={{
        backgroundColor: '#F7FAF9',
        border: '1px solid #E6EAF0',
        opacity: 0.6
      }}
    >
      <div className="absolute top-4 right-4">
        <Lock className="w-4 h-4" style={{ color: '#475569' }} />
      </div>
      <div className="mb-3" style={{ color: '#6B9080' }}>
        {icon}
      </div>
      <h4 className="mb-1">{title}</h4>
      <p style={{ fontSize: '12px', color: '#475569' }}>{description}</p>
    </div>
  );
}