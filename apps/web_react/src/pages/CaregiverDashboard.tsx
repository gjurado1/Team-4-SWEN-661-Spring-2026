import React from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/Card";
import { Alert } from "../components/ui/Alert";
import { Badge } from "../components/ui/Badge";
import { BottomNav } from "../components/navigation/BottomNav";
import { Activity, Users, Clock, WifiOff } from "lucide-react";
import { HeaderVoiceButton } from "../components/navigation/HeaderVoiceButton";

export const CaregiverDashboard: React.FC = () => {
  const navigate = useNavigate();

  const upcomingCheckIns = [
    {
      id: 1,
      patient: "Sarah Johnson",
      time: "10:00 AM",
      status: "urgent" as const,
    },
    {
      id: 2,
      patient: "Robert Chen",
      time: "2:00 PM",
      status: "normal" as const,
    },
    {
      id: 3,
      patient: "James Miller",
      time: "4:30 PM",
      status: "normal" as const,
    },
    {
      id: 4,
      patient: "Emily Davis",
      time: "5:15 PM",
      status: "normal" as const,
    },
    {
      id: 5,
      patient: "Michael Brown",
      time: "6:00 PM",
      status: "urgent" as const,
    },
    {
      id: 6,
      patient: "Patricia Wilson",
      time: "7:30 PM",
      status: "normal" as const,
    },
    {
      id: 7,
      patient: "David Martinez",
      time: "8:00 PM",
      status: "normal" as const,
    },
  ];

  return (
    <div
      className="min-h-screen bg-[var(--bg-primary)] relative"
      style={{
        paddingTop: "max(env(safe-area-inset-top, 0px), 24px)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 96px)",
      }}
    >
      {/* Header */}
      <header
        className="bg-[var(--bg-surface)] border-b-2 border-[var(--border)] py-4 sticky top-0 z-40"
        style={{
          marginTop: "calc(-1 * max(env(safe-area-inset-top, 0px), 24px))",
          paddingTop:
            "calc(max(env(safe-area-inset-top, 0px), 24px) + 16px + 1rem)",
          paddingLeft: "calc(20px + env(safe-area-inset-left))",
          paddingRight: "calc(20px + env(safe-area-inset-right))",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[var(--button-primary)] rounded-full flex items-center justify-center text-white font-bold text-xl">
              DC
            </div>
            <div>
              <h2 className="font-semibold">Welcome back</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Timezone: EDT
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="mb-0"></h1>
            <HeaderVoiceButton />
          </div>
        </div>
      </header>

      <div
        className="space-y-6"
        style={{
          paddingTop: "20px",
          paddingLeft: "calc(20px + env(safe-area-inset-left))",
          paddingRight: "calc(20px + env(safe-area-inset-right))",
          paddingBottom: "20px",
        }}
      >
        {/* Alerts */}
        <div className="space-y-3">
          <Alert type="info">
            <div className="flex items-start gap-2">
              <WifiOff size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <strong>Offline Mode</strong>
                <p className="text-sm mt-1">
                  Last synced 2 hours ago. Your data will sync when reconnected.
                </p>
              </div>
            </div>
          </Alert>

          <Alert type="error">
            <strong>Important:</strong>
            <p className="mt-1">
              3 patients have missed their scheduled check-ins today.
            </p>
          </Alert>

          <Alert type="warning">
            <strong>Reminder:</strong>
            <p className="mt-1">
              Sarah Johnson reported severe symptoms. Follow up required.
            </p>
          </Alert>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2 text-[var(--button-primary)]">
              <Users size={28} />
              <div className="text-sm text-[var(--text-secondary)]">
                # of Missed Check-Ins
              </div>
            </div>
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              24
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2 text-[var(--status-success)]">
              <Activity size={28} />
              <div className="text-sm text-[var(--text-secondary)]">
                Active Patients
              </div>
            </div>
            <div className="text-3xl font-bold text-[var(--text-primary)]">
              32
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/caregiver/schedule")}
            className="p-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg hover:border-[var(--button-primary)] transition-colors"
          >
            <Clock
              size={24}
              className="mx-auto mb-2 text-[var(--button-primary)]"
            />
            <div className="font-medium">Schedule</div>
          </button>
          <button
            onClick={() => navigate("/caregiver/patients")}
            className="p-4 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-lg hover:border-[var(--button-primary)] transition-colors"
          >
            <Users
              size={24}
              className="mx-auto mb-2 text-[var(--button-primary)]"
            />
            <div className="font-medium">All Patients</div>
          </button>
        </div>

        {/* Upcoming Check-Ins */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock size={24} className="text-[var(--button-primary)]" />
            <h2>Upcoming Check-Ins</h2>
          </div>

          <div
            className="max-h-[450px] overflow-y-auto pr-2 space-y-3 bg-[var(--bg-surface)] border-2 border-[var(--border)] rounded-xl p-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "var(--border) transparent",
            }}
          >
            {upcomingCheckIns.map((checkIn) => (
              <Card
                key={checkIn.id}
                onClick={() => navigate("/caregiver/patients")}
                className="p-4 cursor-pointer hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{checkIn.patient}</h3>
                      {checkIn.status === "urgent" && (
                        <Badge variant="error">URGENT</Badge>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">
                      Scheduled: {checkIn.time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="p-2 rounded-lg bg-[var(--button-primary)] text-white hover:bg-[var(--button-primary-hover)] transition-colors"
                      aria-label="View details"
                    >
                      <Activity size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
