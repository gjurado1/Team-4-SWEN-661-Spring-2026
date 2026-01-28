import 'package:flutter/material.dart';
import 'router/app_router.dart';

class CareConnectApp extends StatelessWidget {
  const CareConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'CareConnect',
      debugShowCheckedModeBanner: false,
      routerConfig: buildRouter(),
      theme: ThemeData(
        useMaterial3: true,
      ),
    );
  }
}
