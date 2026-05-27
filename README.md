<<<<<<< HEAD
# Ravelo - Cost of Manual Work Calculator

A premium dark-themed calculator that shows businesses how much repetitive manual work costs them annually.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS v3**
- **Framer Motion** (animations)
- **html-to-image** (PNG export)
- **Zod** (validation)

---

## Getting Started Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - it will redirect to `/tools/cost-of-manual-work`.

---

## Project Structure

```
ravelo-calculator/
├── app/
│   ├── layout.tsx                        ← root layout + metadata
│   ├── page.tsx                          ← redirects to tool
│   ├── globals.css                       ← fonts + base styles + animations
│   ├── api/leads/route.ts               ← lead capture API (stub)
│   └── tools/cost-of-manual-work/
│       ├── page.tsx                      ← tool entry point
│       └── _components/
│           ├── CalculatorFlow.tsx        ← parent controller (screens + state)
│           ├── IntroScreen.tsx           ← landing / hero
│           ├── CalculatorScreen.tsx      ← task input screen
│           ├── TaskRow.tsx               ← single task form
│           ├── PresetPicker.tsx          ← quick-add presets
│           ├── CurrencySelect.tsx        ← USD / INR / AED switcher
│           ├── ResultsScreen.tsx         ← results with count-up + bars
│           ├── ShareCard.tsx             ← downloadable PNG card
│           ├── EmailCaptureCard.tsx      ← lead capture form
│           └── Btn.tsx                   ← shared button component
├── lib/
│   ├── calculator/
│   │   ├── types.ts                     ← Task, CalcResult interfaces
│   │   ├── calc.ts                      ← math engine (yearlyForTask, calculate)
│   │   ├── presets.ts                   ← 7 preset task definitions
│   │   └── automatability.ts            ← badge labels + colors
│   └── currency.ts                      ← formatMoney, CURRENCIES config
```

---

## Deploy to Vercel (Recommended)

### Option A - Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Your app will be live at a `*.vercel.app` URL in under 2 minutes.

### Option B - Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Click Deploy - no config needed

---

## Deploy to Netlify

```bash
npm run build
# then drag the `.next` folder to netlify.com/drop
```

Or connect via GitHub at [netlify.com](https://netlify.com).

---

## Connecting Lead Capture (Optional, after MVP)

When you're ready to capture leads to a database:

1. Create a [Supabase](https://supabase.com) project
2. Run this SQL in the Supabase SQL editor:

```sql
create table leads (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source     text not null,
  name       text,
  email      text not null,
  company    text,
  payload    jsonb,
  notified   boolean default false
);
```

3. Add env vars to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Update `app/api/leads/route.ts` - uncomment the Supabase lines and remove the `console.log`.

---

## Customization

| What | Where |
|------|-------|
| Brand name / colors | `app/globals.css` CSS variables + `IntroScreen.tsx` |
| Default hourly rates | `lib/currency.ts` → `defaultHourly` |
| Preset tasks | `lib/calculator/presets.ts` |
| CTA button links | `ResultsScreen.tsx` → "Get a Free Consultation" button |
| SEO metadata | `app/layout.tsx` + `app/tools/cost-of-manual-work/page.tsx` |
=======
# ravelo-calculator
A premium dark-themed calculator that shows businesses how much repetitive manual work costs them annually — with automated email report delivery
>>>>>>> 47f49da29f9b5e733c8b05f629a8cf8d5cee4d11
