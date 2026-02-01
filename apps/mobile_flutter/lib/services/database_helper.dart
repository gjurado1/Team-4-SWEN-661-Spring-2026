import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/user.dart'; // Import your user model

class DatabaseHelper {
  // 1. The Singleton Pattern
  // This ensures we only ever have one connection to the database.
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  // 2. The Database Getter
  // If the DB exists, return it. If not, initialize it.
  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('app_database.db');
    return _database!;
  }

  // 3. Opening the Database
  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB, // Runs only the very first time the DB is created
    );
  }

  // 4. Creating the Table & Seeding the Default User
  Future _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        password TEXT NOT NULL
      )
    ''');

    // Insert your default "admin" user permanently here
    await db.insert('users', {
      'username': 'admin',
      'password': 'password123',
    });
  }

  // 5. Login Check Method
  Future<User?> login(String username, String password) async {
    final db = await instance.database;

    final result = await db.query(
      'users',
      where: 'username = ? AND password = ?',
      whereArgs: [username, password],
    );

    if (result.isNotEmpty) {
      return User.fromMap(result.first);
    } else {
      return null; // No user found with those credentials
    }
  }

  // 6. Create User (Sign Up)
  Future<int> createUser(User user) async {
    final db = await instance.database;
    return await db.insert('users', user.toMap());
  }
}