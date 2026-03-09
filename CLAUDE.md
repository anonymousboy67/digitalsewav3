# DigitalSewa v3 — Project Context

## What This Is
Nepal's hyperlocal freelancing platform (like Fiverr but for Nepal). Clients post projects, freelancers apply with proposals, payments are demo-only (NPR). Built on Next.js 16 App Router + TypeScript + Tailwind CSS v4.

---

## Tech Stack
- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn "base-nova" style — uses `@base-ui/react` (NOT radix-ui)
- **Auth**: next-auth v5 beta (Credentials provider, JWT sessions)
- **Database**: MongoDB Atlas via Mongoose
- **Animations**: framer-motion
- **State**: Zustand (`src/store/useStore.ts`)
- **Toasts**: sonner
- **Charts**: recharts
- **Forms**: react-hook-form + zod

---

## Critical: base-ui vs radix-ui Differences

shadcn "base-nova" uses `@base-ui/react` — APIs differ from the usual radix-ui shadcn:

### Select — MUST use the wrapper
- base-ui `Select.onValueChange` signature: `(value: string | null, event) => void`
- We created `src/components/ui/select-wrapper.tsx` that normalizes it to `(value: string) => void`
- **Always import Select from `@/components/ui/select-wrapper`**, never from `@/components/ui/select`

### Dialog / Sheet / AlertDialog — NO `asChild` prop
- `DialogTrigger`, `SheetTrigger` etc. do NOT support `asChild` in base-ui
- **Pattern**: Use controlled state instead:
  ```tsx
  const [open, setOpen] = useState(false);
  <Button onClick={() => setOpen(true)}>Open</Button>
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>...</DialogContent>
  </Dialog>
  ```

### DropdownMenuTrigger — renders its own `<button>`
- Never put a `<Button>` inside `<DropdownMenuTrigger>` — causes nested button hydration error
- Style `DropdownMenuTrigger` directly with className instead:
  ```tsx
  <DropdownMenuTrigger className="inline-flex items-center justify-center ...">
    <Icon />
  </DropdownMenuTrigger>
  ```

---

## Project Structure
```
src/
  app/
    (auth)/           # login, register pages
    (dashboard)/
      client/         # 8 sub-pages
      freelancer/     # 9 sub-pages
    api/              # all API routes
    layout.tsx        # root layout (fonts, Providers)
    page.tsx          # landing page
    globals.css
  components/
    layout/           # Sidebar, Topbar, MobileNav, Providers
    shared/           # ProjectCard, FreelancerCard, ChatInterface, etc.
    landing/          # Hero, HowItWorks, Categories, etc.
    ui/               # shadcn components
  lib/
    auth.ts           # full NextAuth (bcrypt + mongoose) — API routes only
    auth.config.ts    # edge-safe auth config — used by proxy.ts
    db.ts             # MongoDB singleton
    constants.ts      # DISTRICTS, SKILLS, CATEGORIES, PAYMENT_METHODS
    utils.ts          # cn, formatNPR, formatRelativeTime, etc.
    seed.ts           # database seeder
    validations.ts    # zod schemas
  models/             # User, Project, Proposal, Conversation, Message, Review, Transaction, Notification
  hooks/              # useCurrentUser, useNotifications, useProjects (useDebounce)
  store/              # useStore.ts (Zustand)
  types/              # index.ts (all interfaces)
proxy.ts              # Next.js 16 middleware (edge-safe, uses auth.config.ts)
```

---

## Key Architecture Decisions

### Auth Split (important)
- `src/lib/auth.ts` — imports bcrypt + mongoose. Used ONLY in API routes.
- `src/lib/auth.config.ts` — edge-safe (no Node.js modules). Used in `proxy.ts`.
- This split is required because Next.js 16 proxy runs in the Edge runtime which doesn't support Node.js `crypto` module.

### Middleware → proxy.ts
- Next.js 16 deprecated `middleware.ts` — now uses `proxy.ts` at project root
- Old `middleware.ts` and `src/middleware.ts` have been deleted

### Single App Directory
- Only `src/app/` exists (root `app/` was deleted — it was Create Next App boilerplate)
- Having both `app/` and `src/app/` caused 404s on all routes except `/`

### Payments
- Demo only — no real Khalti/eSewa integration
- All payment flows show "DEMO MODE" badge and simulate with setTimeout

### Messages
- Polling every 5 seconds (no WebSockets)
- `ChatInterface` component handles this

---

## Environment Variables (.env.local)
```
MONGODB_URI=mongodb+srv://aashishad67_db_user:BYb98KPYDFIACmeM@digitalsewav3.hukzo16.mongodb.net/digitalsewa?appName=digitalsewav3
NEXTAUTH_SECRET=digitalsewa-secret-key-change-in-production-2024
NEXTAUTH_URL=http://localhost:3000
```

---

## Test Accounts (seeded via `npm run seed`)
**Freelancers** — password: `password123`
- sita@example.com, hari@example.com, anjali@example.com, bishal@example.com, priya@example.com

**Clients** — password: `password123`
- ram@example.com, sunita@example.com, deepak@example.com

---

## Common Commands
```bash
npm run dev       # start dev server
npm run build     # production build
npm run seed      # seed MongoDB with test data
```

---

## Bugs Fixed
1. **`crypto` module in edge runtime** — split auth into `auth.ts` + `auth.config.ts`
2. **`DialogTrigger asChild` error** — base-ui doesn't support `asChild`; use controlled state
3. **Nested button hydration error** — `DropdownMenuTrigger` renders `<button>`; don't put `<Button>` inside it
4. **`SelectRootProps` type error** — `select-wrapper.tsx` uses plain interface instead of importing generic type
5. **404 on all routes except `/`** — deleted root `app/` directory; Next.js now uses only `src/app/`
6. **Recharts `formatter` type** — use `(v) => [String(Number(v).toLocaleString()), "label"]` instead of `(v: number) => ...`
7. **`middleware.ts` + `proxy.ts` conflict** — can't have both; deleted `middleware.ts`

---

## Design
- Colors: deep teal (`teal-600`) + emerald (`emerald-600`) as primary
- Fonts: Plus Jakarta Sans (body) + Outfit (headings) via next/font/google
- Font variables: `--font-plus-jakarta`, `--font-outfit`
- Mobile: sidebar collapses to Sheet (mobile drawer)
- Animations: framer-motion throughout (page transitions, stagger, scale)
