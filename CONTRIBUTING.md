# Contributing to PromptIQ v2

Thank you for your interest in contributing to PromptIQ! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Install dependencies: `npm install`
4. Copy environment template: `cp env.template .env.local`
5. Fill in your credentials in `.env.local`
6. Start development server: `npm run dev`

## Project Structure

```
promptiq-v2/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── landing/          # Landing page sections
│   ├── dashboard/        # Dashboard components
│   └── shared/           # Shared components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
└── types/                # TypeScript types
```

## Code Style

### TypeScript
- Use TypeScript for all new files
- Avoid `any` types - use proper typing
- Export types from `types/index.ts`

### React Components
- Use functional components with hooks
- Use `'use client'` directive for client components
- Keep components small and focused
- Use proper prop typing

### Naming Conventions
- Components: PascalCase (e.g., `QuickMode.tsx`)
- Files: kebab-case for utilities (e.g., `firebase.ts`)
- Functions: camelCase (e.g., `generatePrompt`)
- Constants: UPPER_SNAKE_CASE (e.g., `PLAN_LIMITS`)

### File Organization
```typescript
// 1. Imports (external first, then internal)
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface Props {
  userId: string;
}

// 3. Component
export function MyComponent({ userId }: Props) {
  // Component logic
}
```

## Git Workflow

### Branches
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates

### Commit Messages
Follow conventional commits:
```
feat: add PDF export functionality
fix: resolve authentication redirect issue
docs: update setup guide
style: format code with prettier
refactor: simplify prompt generation logic
test: add unit tests for quality scoring
```

### Pull Request Process
1. Create a feature branch from `develop`
2. Make your changes
3. Test thoroughly
4. Update documentation if needed
5. Submit PR to `develop` branch
6. Wait for review and address feedback

## Testing

### Manual Testing Checklist
- [ ] Authentication (signup/login/logout)
- [ ] Prompt generation (Quick & Pro modes)
- [ ] Quality scoring accuracy
- [ ] History page functionality
- [ ] Payment flow (sandbox mode)
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Error handling

### Before Submitting PR
```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

## Adding New Features

### New Framework
1. Add to `lib/constants.ts`:
```typescript
export const FRAMEWORKS = {
  // ...existing
  'new-framework': {
    name: 'New Framework',
    description: 'Description here',
  },
};
```

2. Update `lib/gemini.ts` to handle new framework
3. Update type in `types/index.ts`

### New Component
1. Create component file in appropriate directory
2. Export from component file
3. Import and use in parent component
4. Add to documentation if public-facing

### New API Route
1. Create route file in `app/api/`
2. Implement proper error handling
3. Add authentication check if needed
4. Update types if necessary

## Common Issues

### Firebase Connection
- Verify environment variables
- Check Firebase project settings
- Ensure Firestore rules are correct

### Build Errors
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

### Type Errors
- Run `npm run type-check` to see all errors
- Fix types before committing

## Code Review Guidelines

### For Reviewers
- Check code quality and style
- Verify functionality works as expected
- Test edge cases
- Ensure documentation is updated
- Check for security issues

### For Contributors
- Respond to feedback promptly
- Make requested changes
- Update PR description if scope changes
- Keep commits clean and focused

## Feature Requests

To request a new feature:
1. Check existing issues first
2. Create new issue with template
3. Describe use case clearly
4. Provide examples if possible

## Bug Reports

To report a bug:
1. Check if already reported
2. Create new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

## Documentation

### Update Documentation When:
- Adding new features
- Changing existing functionality
- Fixing bugs that affect usage
- Updating setup process

### Documentation Files
- `README.md` - Overview and quick start
- `SETUP_GUIDE.md` - Detailed setup instructions
- `CONTRIBUTING.md` - This file
- Code comments - For complex logic

## Performance Guidelines

- Minimize API calls
- Use proper loading states
- Implement error boundaries
- Optimize images
- Lazy load components when appropriate
- Use React.memo for expensive components

## Security Guidelines

- Never commit `.env.local` or credentials
- Validate all user inputs
- Sanitize data before storing
- Use proper authentication checks
- Follow Firebase security rules
- Keep dependencies updated

## Questions?

If you have questions:
- Check documentation first
- Search existing issues
- Create new issue with question
- Email: support@promptiq.com

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to PromptIQ! 🚀
