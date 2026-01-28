import 'package:flutter/material.dart';

class AppAccordionItem {
  final String id;
  final Widget header;
  final Widget body;

  const AppAccordionItem({
    required this.id,
    required this.header,
    required this.body,
  });
}

enum AppAccordionType { single, multiple }

class AppAccordion extends StatefulWidget {
  final List<AppAccordionItem> items;
  final AppAccordionType type;
  final Set<String> initiallyOpenIds;

  const AppAccordion({
    super.key,
    required this.items,
    this.type = AppAccordionType.single,
    this.initiallyOpenIds = const {},
  });

  @override
  State<AppAccordion> createState() => _AppAccordionState();
}

class _AppAccordionState extends State<AppAccordion> {
  late Set<String> _open;

  @override
  void initState() {
    super.initState();
    _open = {...widget.initiallyOpenIds};
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (widget.type == AppAccordionType.single) {
      final openId = _open.isEmpty ? null : _open.first;

      return ExpansionPanelList.radio(
        expandedHeaderPadding: EdgeInsets.zero,
        elevation: 0,
        dividerColor: theme.dividerColor,
        children: widget.items.map((it) {
          return ExpansionPanelRadio(
            value: it.id,
            headerBuilder: (_, __) => ListTile(title: it.header),
            body: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: it.body,
            ),
            canTapOnHeader: true,
          );
        }).toList(),
        expansionCallback: (index, isExpanded) {
          setState(() {
            final id = widget.items[index].id;
            if (isExpanded) {
              _open.remove(id);
            } else {
              _open
                ..clear()
                ..add(id);
            }
          });
        },
      );
    }

    // multiple
    return ExpansionPanelList(
      expandedHeaderPadding: EdgeInsets.zero,
      elevation: 0,
      dividerColor: theme.dividerColor,
      expansionCallback: (index, isExpanded) {
        setState(() {
          final id = widget.items[index].id;
          if (isExpanded) {
            _open.remove(id);
          } else {
            _open.add(id);
          }
        });
      },
      children: widget.items.map((it) {
        final isOpen = _open.contains(it.id);
        return ExpansionPanel(
          isExpanded: isOpen,
          canTapOnHeader: true,
          headerBuilder: (_, __) => ListTile(title: it.header),
          body: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: it.body,
          ),
        );
      }).toList(),
    );
  }
}
