import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../widgets/ui/app_card.dart';
import '../widgets/ui/app_button.dart';
import '../widgets/ui/app_input.dart';
import '../widgets/navigation/header_voice_button.dart';

class MessagesPage extends StatefulWidget {
  const MessagesPage({super.key});

  @override
  State<MessagesPage> createState() => _MessagesPageState();
}

class _MessagesPageState extends State<MessagesPage> {
  final _newMessage = TextEditingController();

  final List<_Conversation> conversations = const [
    _Conversation(
      id: 1,
      name: 'Dr. Sarah Miller',
      role: 'Primary Care',
      lastMessage: 'Your test results look good',
      time: '2h ago',
      unread: 2,
    ),
    _Conversation(
      id: 2,
      name: 'Nurse John Davis',
      role: 'Care Team',
      lastMessage: 'Reminder: medication refill due',
      time: '5h ago',
      unread: 0,
    ),
    _Conversation(
      id: 3,
      name: 'Care Coordinator',
      role: 'Support',
      lastMessage: 'How are you feeling today?',
      time: '1d ago',
      unread: 0,
    ),
  ];

  final List<_Message> messages = const [
    _Message(id: 1, sender: _Sender.other, text: 'Hello! How are you feeling today?', time: '10:30 AM'),
    _Message(id: 2, sender: _Sender.user, text: "I'm doing well, thank you!", time: '10:32 AM'),
    _Message(id: 3, sender: _Sender.other, text: "That's great to hear. Don't forget your afternoon medication.", time: '10:35 AM'),
    _Message(id: 4, sender: _Sender.user, text: 'Will do, thanks for the reminder!', time: '10:36 AM'),
  ];

  bool get _canSend => _newMessage.text.trim().isNotEmpty;

  void _handleSend() {
    if (!_canSend) return;

    // demo behavior: clear input
    setState(() => _newMessage.clear());

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Message sent (demo).')),
    );
  }

  @override
  void dispose() {
    _newMessage.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: cs.surface,
            surfaceTintColor: cs.surface,
            automaticallyImplyLeading: false,
            titleSpacing: 8,
            title: Row(
              children: [
                IconButton(
                  tooltip: 'Back',
                  onPressed: () => context.pop(),
                  icon: const Icon(Icons.arrow_back),
                ),
                const SizedBox(width: 6),
                Text(
                  'Messages',
                  style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                ),
                const Spacer(),
                const Padding(
                  padding: EdgeInsets.only(right: 8),
                  child: HeaderVoiceButton(),
                ),
              ],
            ),
            bottom: PreferredSize(
              preferredSize: const Size.fromHeight(2),
              child: Container(height: 2, color: theme.dividerColor),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
            sliver: SliverList(
              delegate: SliverChildListDelegate(
                [
                  // Conversations List
                  for (final conv in conversations) ...[
                    AppCard(
                      padding: const EdgeInsets.all(14),
                      onTap: () {
                        // demo: no-op (you can load thread here)
                      },
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Avatar
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: cs.primary,
                              shape: BoxShape.circle,
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              conv.name.isNotEmpty ? conv.name.characters.first : '?',
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18),
                            ),
                          ),
                          const SizedBox(width: 12),

                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(conv.name, style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w900)),
                                const SizedBox(height: 2),
                                Text(conv.role, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                                const SizedBox(height: 6),
                                Text(conv.lastMessage, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                              ],
                            ),
                          ),

                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(conv.time, style: theme.textTheme.bodySmall?.copyWith(color: theme.hintColor)),
                              const SizedBox(height: 10),
                              if (conv.unread > 0)
                                Container(
                                  width: 24,
                                  height: 24,
                                  decoration: BoxDecoration(
                                    color: cs.error,
                                    shape: BoxShape.circle,
                                  ),
                                  alignment: Alignment.center,
                                  child: Text(
                                    '${conv.unread}',
                                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 12),
                                  ),
                                ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                  ],

                  const SizedBox(height: 8),

                  // Message Thread Example
                  AppCard(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Conversation with Dr. Sarah Miller',
                          style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900),
                        ),
                        const SizedBox(height: 10),
                        Container(height: 2, color: theme.dividerColor),
                        const SizedBox(height: 12),

                        ConstrainedBox(
                          constraints: const BoxConstraints(maxHeight: 400),
                          child: ListView.separated(
                            shrinkWrap: true,
                            itemCount: messages.length,
                            separatorBuilder: (_, __) => const SizedBox(height: 12),
                            itemBuilder: (context, i) {
                              final msg = messages[i];
                              final isUser = msg.sender == _Sender.user;

                              return Row(
                                mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
                                children: [
                                  ConstrainedBox(
                                    constraints: BoxConstraints(
                                      maxWidth: MediaQuery.of(context).size.width * 0.80,
                                    ),
                                    child: Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: isUser ? cs.primary : cs.surfaceContainerHighest,
                                        borderRadius: BorderRadius.circular(12),
                                        border: isUser ? null : Border.all(color: theme.dividerColor, width: 2),
                                      ),
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            msg.text,
                                            style: theme.textTheme.bodyMedium?.copyWith(
                                              color: isUser ? Colors.white : cs.onSurface,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          const SizedBox(height: 6),
                                          Text(
                                            msg.time,
                                            style: theme.textTheme.bodySmall?.copyWith(
                                              color: isUser ? Colors.white.withValues(alpha: 0.70) : theme.hintColor,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              );
                            },
                          ),
                        ),

                        const SizedBox(height: 12),
                        Container(height: 2, color: theme.dividerColor),
                        const SizedBox(height: 12),

                        // Message Input row
                        Row(
                          children: [
                            Expanded(
                              child: AppInput(
                                hintText: 'Type your message...',
                                controller: _newMessage,
                                onChanged: (_) => setState(() {}),
                                onSubmitted: (_) => _handleSend(),
                              ),
                            ),
                            const SizedBox(width: 10),
                            AppButton(
                              variant: AppButtonVariant.primary,
                              onPressed: _canSend ? _handleSend : null,
                              icon: const Icon(Icons.send, size: 20),
                              child: const Text('Send'),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

enum _Sender { user, other }

class _Message {
  final int id;
  final _Sender sender;
  final String text;
  final String time;

  const _Message({
    required this.id,
    required this.sender,
    required this.text,
    required this.time,
  });
}

class _Conversation {
  final int id;
  final String name;
  final String role;
  final String lastMessage;
  final String time;
  final int unread;

  const _Conversation({
    required this.id,
    required this.name,
    required this.role,
    required this.lastMessage,
    required this.time,
    required this.unread,
  });
}
