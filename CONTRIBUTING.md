# Team Git Workflow & Contribution Guide

This document outlines the **Rebase-First** strategy for our team of three. Our goal is to maintain a clean, linear project history and minimize conflicts in core files like the Flutter router and theme controllers.

## 1. Starting a New Task

Before starting any work, ensure your local environment is synchronized with the server.

1. **Update Main:**
```bash
git checkout main
git pull origin main

```


2. **Create Feature/Fix Branch:**
```bash
git checkout -b <type>/<short-description>
# Types: feature/ fix/ docs/ refactor/

```



---

## 2. Development & Staying in Sync

To prevent "canceling each other out," you must bring changes from `main` into your branch frequently.

### The Daily Sync (Rebase)

1. **Fetch Latest Changes:**
```bash
git checkout main
git pull origin main

```


2. **Rebase Your Branch:**
```bash
git checkout <your-branch-name>
git rebase main

```



---

## 3. Resolving Conflicts

When rebasing, Git may pause if someone else modified the same lines (common in `app_router.dart` or `app_theme_controller.dart`).

1. **Identify Conflicts:** Git will list the conflicted files in the terminal.
2. **Resolve Manually:** Open files in VS Code/Android Studio. Look for the `<<<<<<<` markers and choose the correct code.
3. **Stage Changes:** 

```bash
git add <conflicted-file-path>
```

4. **Continue Rebase:** 

```bash
git rebase --continue
```
_Note_: If you get stuck, use `git rebase --abort` to start over.*



## 4. Submitting Your Work

Once your feature is complete and you have performed a final rebase onto `main`:

1. **Push to Remote:**

```bash
# Use --force-with-lease because rebase rewrites history
git push origin <your-branch-name> --force-with-lease

```


2. **Open a Pull Request (PR):**

* Assign at least one teammate for review.
* Ensure the CI/CD (if applicable) passes.


3. **Merge:**

* After approval, merge the PR into `main`.

---

## 5. Post-Merge Cleanup

After your PR is merged, clean up your local environment:

```bash
git checkout main
git pull origin main
git branch -d <your-finished-branch>

```

---

## 💡 Team Rules & Best Practices

* **High-Traffic Alert:** Send a message in the team chat before making major changes to `app_router.dart`, `app_theme_controller.dart`, or `pubspec.yaml`.
* **Atomic Commits:** Keep commits small and focused. It makes rebasing and conflict resolution much easier.
* **Never Rebase Main:** Only rebase your private feature/fix branches. **Never** rewrite the history of the `main` branch.
* **Test After Rebase:** Always run the app locally after a rebase to ensure teammate changes didn't break your new logic.

---