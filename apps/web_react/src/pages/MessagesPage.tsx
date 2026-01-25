import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card } from '../components/ui/Card';
import { BottomNav } from '../components/navigation/BottomNav';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Send } from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'other';
  text: string;
  time: string;
}

export const MessagesPage: React.FC = () => {
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    { id: 1, name: 'Dr. Sarah Miller', role: 'Primary Care', lastMessage: 'Your test results look good', time: '2h ago', unread: 2 },
    { id: 2, name: 'Nurse John Davis', role: 'Care Team', lastMessage: 'Reminder: medication refill due', time: '5h ago', unread: 0 },
    { id: 3, name: 'Care Coordinator', role: 'Support', lastMessage: 'How are you feeling today?', time: '1d ago', unread: 0 }
  ];

  const messages: Message[] = [
    { id: 1, sender: 'other', text: 'Hello! How are you feeling today?', time: '10:30 AM' },
    { id: 2, sender: 'user', text: 'I\'m doing well, thank you!', time: '10:32 AM' },
    { id: 3, sender: 'other', text: 'That\'s great to hear. Don\'t forget your afternoon medication.', time: '10:35 AM' },
    { id: 4, sender: 'user', text: 'Will do, thanks for the reminder!', time: '10:36 AM' }
  ];

  const handleSend = () => {
    if (newMessage.trim()) {
      // Send message logic
      setNewMessage('');
    }
  };

  return (
    <div 
      className="min-h-screen bg-[var(--bg-primary)] relative"
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 24px)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        paddingBottom: 'calc(env(safe-area-inset-bottom) + 96px)'
      }}
    >
      {/* Header */}
      <header className="bg-[var(--bg-surface)] border-b-2 border-[var(--border)] py-4 sticky top-0 z-40" style={{
        marginTop: 'calc(-1 * max(env(safe-area-inset-top, 0px), 24px))',
        paddingTop: 'calc(max(env(safe-area-inset-top, 0px), 24px) + 16px + 1rem)',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))'
      }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1>Messages</h1>
        </div>
      </header>

      <div className="space-y-6" style={{
        paddingTop: '20px',
        paddingLeft: 'calc(20px + env(safe-area-inset-left))',
        paddingRight: 'calc(20px + env(safe-area-inset-right))',
        paddingBottom: '20px'
      }}>
        {/* Conversations List */}
        <div className="space-y-3">
          {conversations.map((conv) => (
            <Card key={conv.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-[var(--button-primary)] rounded-full flex items-center justify-center text-white font-bold">
                    {conv.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{conv.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">{conv.role}</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">{conv.lastMessage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[var(--text-secondary)] mb-2">{conv.time}</p>
                  {conv.unread > 0 && (
                    <div className="w-6 h-6 bg-[var(--status-error)] text-white rounded-full flex items-center justify-center text-xs font-bold ml-auto">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Message Thread Example */}
        <Card className="p-4">
          <h3 className="mb-4 pb-3 border-b-2 border-[var(--border)]">Conversation with Dr. Sarah Miller</h3>
          
          <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-[var(--button-primary)] text-white'
                      : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border-2 border-[var(--border)]'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-[var(--text-secondary)]'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex gap-2 pt-3 border-t-2 border-[var(--border)]">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border-2 border-[var(--border)] rounded-lg bg-[var(--bg-surface)] text-[var(--text-primary)] focus:border-[var(--button-primary)] transition-colors"
            />
            <Button
              variant="primary"
              onClick={handleSend}
              disabled={!newMessage.trim()}
              icon={<Send size={20} />}
            >
              Send
            </Button>
          </div>
        </Card>
      </div>

      <BottomNav variant="patient" />
    </div>
  );
};