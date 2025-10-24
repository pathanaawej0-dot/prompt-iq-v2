# Git Commands for PromptIQ Deployment 🚀

## Step-by-Step Git Setup

### 1. Verify Files Are Not Tracked

First, check that sensitive files are properly ignored:

```bash
# Check git status
git status

# Check ignored files
git status --ignored

# Verify these files are in ignored list:
# - .env.local
# - serviceAccountKey.json
# - node_modules/
# - .next/
```

**Expected Output:**
```
Ignored files:
  .env.local
  serviceAccountKey.json
  node_modules/
  .next/
```

---

### 2. Initialize Git Repository (if needed)

```bash
# Check if git is already initialized
git status

# If not initialized, run:
git init

# Set default branch to main
git branch -M main
```

---

### 3. Configure Git (if first time)

```bash
# Set your name and email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

---

### 4. Add All Files

```bash
# Add all files (respects .gitignore)
git add .

# Verify what will be committed
git status

# Should show:
# - All source files
# - .env.example (allowed)
# - Documentation files
# Should NOT show:
# - .env.local
# - serviceAccountKey.json
```

---

### 5. Create Initial Commit

```bash
# Create commit with descriptive message
git commit -m "PromptIQ v1.0 - Production ready

Features:
- User authentication with Firebase
- AI prompt generation with Gemini
- Quick Mode and Pro Mode
- Share links with 7-day expiry
- Payment integration with PhonePe
- Waitlist system for First 250 campaign
- Dark/light theme support
- Responsive design
- Comprehensive error handling
- Production-ready deployment configuration"

# Verify commit
git log --oneline
```

---

### 6. Create GitHub Repository

**Option A: Via GitHub Website**

1. Go to https://github.com/new
2. Repository name: `promptiq-v2`
3. Description: "AI-powered prompt engineering platform"
4. Visibility: **Private** (recommended)
5. **DO NOT** check "Initialize with README"
6. Click "Create repository"

**Option B: Via GitHub CLI (if installed)**

```bash
# Create private repository
gh repo create promptiq-v2 --private --source=. --remote=origin

# Or create public repository
gh repo create promptiq-v2 --public --source=. --remote=origin
```

---

### 7. Add Remote Origin

**Using HTTPS (easier for beginners):**

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/promptiq-v2.git

# Verify remote
git remote -v
```

**Using SSH (more secure, requires SSH key setup):**

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin git@github.com:YOUR_USERNAME/promptiq-v2.git

# Verify remote
git remote -v
```

**If remote already exists:**

```bash
# Remove existing remote
git remote remove origin

# Add new remote
git remote add origin https://github.com/YOUR_USERNAME/promptiq-v2.git
```

---

### 8. Push to GitHub

```bash
# Push to main branch
git push -u origin main

# Enter GitHub credentials if using HTTPS
# (Username and Personal Access Token, NOT password)
```

**Expected Output:**
```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (120/120), done.
Writing objects: 100% (150/150), 1.5 MiB | 2.0 MiB/s, done.
Total 150 (delta 30), reused 0 (delta 0)
To https://github.com/YOUR_USERNAME/promptiq-v2.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

### 9. Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/promptiq-v2
2. Verify all files are present
3. **CRITICAL:** Check that these files are NOT visible:
   - `.env.local`
   - `serviceAccountKey.json`
4. Verify `.env.example` IS visible

---

## Future Git Workflow

### Making Changes

```bash
# Check current status
git status

# Add specific files
git add path/to/file.ts

# Or add all changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

### Creating Feature Branches

```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push branch to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# After merge, switch back to main
git checkout main
git pull origin main
```

### Viewing History

```bash
# View commit history
git log

# View compact history
git log --oneline

# View last 5 commits
git log -5

# View changes in a commit
git show <commit-hash>
```

### Undoing Changes

```bash
# Discard changes in working directory
git checkout -- path/to/file.ts

# Unstage file
git reset HEAD path/to/file.ts

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

---

## Troubleshooting

### Problem: "Permission denied (publickey)"

**Solution:** Use HTTPS instead of SSH, or set up SSH keys:

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings > SSH Keys > New SSH Key
```

### Problem: "Authentication failed"

**Solution:** Use Personal Access Token instead of password:

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `workflow`
4. Copy token
5. Use token as password when pushing

### Problem: "Remote already exists"

**Solution:**

```bash
# Remove existing remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/promptiq-v2.git
```

### Problem: ".env.local is being tracked"

**Solution:**

```bash
# Remove from git tracking
git rm --cached .env.local

# Verify it's in .gitignore
cat .gitignore | grep .env.local

# Commit the removal
git commit -m "Remove .env.local from tracking"
git push origin main
```

### Problem: "serviceAccountKey.json is being tracked"

**Solution:**

```bash
# Remove from git tracking
git rm --cached serviceAccountKey.json

# Verify it's in .gitignore
cat .gitignore | grep serviceAccountKey.json

# Commit the removal
git commit -m "Remove serviceAccountKey.json from tracking"
git push origin main
```

---

## Security Checklist Before Pushing

Run this checklist BEFORE pushing to GitHub:

```bash
# 1. Check for sensitive files
git status

# 2. Check what will be committed
git diff --cached

# 3. Verify .gitignore is working
git status --ignored

# 4. Search for potential secrets in code
grep -r "API_KEY" --include="*.ts" --include="*.tsx" .
grep -r "SECRET" --include="*.ts" --include="*.tsx" .
grep -r "PASSWORD" --include="*.ts" --include="*.tsx" .

# 5. Verify no hardcoded credentials
grep -r "firebase" --include="*.ts" --include="*.tsx" . | grep -v "import"
```

**If you find any secrets:**
1. Remove them immediately
2. Move to `.env.local`
3. Use `process.env.VARIABLE_NAME`
4. Commit the fix before pushing

---

## Quick Reference

### Most Common Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View history
git log --oneline

# Create branch
git checkout -b branch-name

# Switch branch
git checkout main

# Merge branch
git merge branch-name
```

---

## Next Steps After Pushing

1. ✅ Verify repository on GitHub
2. ✅ Check no sensitive files are visible
3. ✅ Go to Vercel and import repository
4. ✅ Configure environment variables in Vercel
5. ✅ Deploy!

---

**Ready to push? Run these commands:**

```bash
# Final check
git status
git status --ignored

# If everything looks good:
git add .
git commit -m "PromptIQ v1.0 - Production ready"
git remote add origin https://github.com/YOUR_USERNAME/promptiq-v2.git
git push -u origin main
```

**Good luck with your deployment! 🚀**
