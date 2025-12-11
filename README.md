# VishGuard

AI-Powered Voice Phishing Simulation Platform for Enterprise Security Awareness

VishGuard conducts simulated voice phishing (vishing) penetration tests to strengthen organizational security. The system orchestrates realistic social engineering attacks via AI-generated voice calls, then provides emotionally intelligent training rather than punitive responses.

---

## Frontend

The frontend is a fully functional Next.js 16 dashboard for managing vishing simulation campaigns.

### Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16 | App Router framework |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling |
| Radix UI | Latest | Accessible components |
| Clerk | Latest | Authentication & multi-tenancy |
| Recharts | 3.5 | Data visualization |
| PapaParse | 5.5 | CSV import |

### Features

- **Campaign Management** - Create, configure, and launch vishing simulations
- **Department Targeting** - Target specific departments or employee groups
- **Safe Hours Enforcement** - Configure allowed calling windows per timezone
- **Do Not Disturb List** - Exclude sensitive employees from campaigns
- **Training Assignment** - Assign courses to employees who fail simulations
- **Rewards System** - Reward employees who resist phishing attempts
- **Real-time Analytics** - Monitor campaign progress and results

### Project Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── campaigns/     # Campaign list and creation wizard
│   │   ├── dnd/           # Do Not Disturb management
│   │   ├── members/       # Employee management
│   │   ├── rewards/       # Rewards and recognition
│   │   ├── settings/      # Safe Hours and org settings
│   │   └── training/      # Training course management
│   ├── org-selection/     # Multi-tenant org picker
│   ├── sign-in/           # Clerk authentication
│   └── sign-up/           # Clerk registration
├── components/
│   ├── dashboard/         # Dashboard-specific components
│   ├── landing/           # Marketing landing page
│   └── ui/                # Reusable UI primitives
├── contexts/              # React context providers
├── lib/                   # Utilities and mock data
└── middleware.ts          # Auth route protection
```

### Getting Started

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Required variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
   - `CLERK_SECRET_KEY` - Clerk secret key

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk publishable key |
| `CLERK_SECRET_KEY` | Yes | Clerk secret key |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | No | Custom sign-in route |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | No | Custom sign-up route |

---

## Backend

*Coming soon*

---

## License

MIT
