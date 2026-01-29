import 'package:flutter/material.dart';

class AppAvatar extends StatelessWidget {
  final String? imageUrl;
  final String? initials;
  final double size;
  final Color? backgroundColor;

  const AppAvatar({
    super.key,
    this.imageUrl,
    this.initials,
    this.size = 40,
    this.backgroundColor,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final cs = theme.colorScheme;

    final bg = backgroundColor ?? cs.primary.withValues(alpha: 0.12);

    return CircleAvatar(
      radius: size / 2,
      backgroundColor: bg,
      backgroundImage: (imageUrl != null && imageUrl!.isNotEmpty) ? NetworkImage(imageUrl!) : null,
      child: (imageUrl == null || imageUrl!.isEmpty)
          ? Text(
              (initials ?? '').isNotEmpty ? initials! : '?',
              style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w700),
            )
          : null,
    );
  }
}
