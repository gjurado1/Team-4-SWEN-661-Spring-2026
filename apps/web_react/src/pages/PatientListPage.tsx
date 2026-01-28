import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { HeaderVoiceButton } from "../components/navigation/HeaderVoiceButton";
import { ArrowLeft, Search, Bell, MessageCircle } from "lucide-react";

interface Patient {
  id: number;
  name: string;
  lastUpdate: string;
  status: "urgent" | "normal";
  condition: string;
  nextCheckIn: string;
  mood: string;
  moodIcon: string;
}

export const PatientListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const patients: Patient[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      lastUpdate: "Last Updated: 12/25/2024",
      status: "urgent",
      condition: "Severe symptoms reported",
      nextCheckIn: "Next Check-In: 12/28/2024",
      mood: "Poor",
      moodIcon: "😢",
    },
    {
      id: 2,
      name: "Robert Chen",
      lastUpdate: "Last Updated: 12/24/2024",
      status: "urgent",
      condition: "Missed medication dose",
      nextCheckIn: "Next Check-In: 12/28/2024",
      mood: "Concerned",
      moodIcon: "😐",
    },
    {
      id: 3,
      name: "James Miller",
      lastUpdate: "Last Updated: 12/24/2024",
      status: "normal",
      condition: "Routine check-in",
      nextCheckIn: "Next Check-In: 12/27/2024",
      mood: "Good",
      moodIcon: "🙂",
    },
    {
      id: 4,
      name: "Mary Williams",
      lastUpdate: "Last Updated: 12/23/2024",
      status: "normal",
      condition: "Stable condition",
      nextCheckIn: "Next Check-In: 12/26/2024",
      mood: "Great",
      moodIcon: "😊",
    },
  ];

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        <div>
          {/* Top row: Back + Voice */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/caregiver/dashboard")}
              className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft size={24} />
            </button>

            {/* ✅ Voice button + actions */}
            <HeaderVoiceButton />
          </div>

          <h1 className="mb-2">All Patients</h1>

          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-8 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none"
              size={30}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pr-4 pl-20 text-center border-2 border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] focus:border-[var(--button-primary)] transition-colors placeholder:text-center"
            />
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
        {/* Patient Cards */}
        {filteredPatients.map((patient) => (
          <Card
            key={patient.id}
            className={`p-4 border-l-4 ${
              patient.status === "urgent"
                ? "border-l-[var(--status-error)]"
                : "border-l-[var(--status-success)]"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[var(--text-primary)]">
                    {patient.name}
                  </h3>
                  {patient.status === "urgent" && (
                    <Badge variant="error">URGENT</Badge>
                  )}
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {patient.lastUpdate}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors text-[var(--button-primary)]"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                </button>
                <button
                  onClick={() => navigate("/messages")}
                  className="p-2 rounded-lg hover:bg-[var(--bg-primary)] transition-colors text-[var(--button-primary)]"
                  aria-label="Message patient"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p
                className={`font-medium ${
                  patient.status === "urgent"
                    ? "text-[var(--status-error)]"
                    : "text-[var(--text-primary)]"
                }`}
              >
                {patient.condition}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {patient.nextCheckIn}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[var(--text-secondary)]">
                  Mood:
                </span>
                <span className="text-xl">{patient.moodIcon}</span>
                <span className="text-sm font-medium">{patient.mood}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
