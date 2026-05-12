# Finora — Finance + Aura

### _The Intelligent Financial Management Platform_

> **A professional-grade web application for tracking income, assets, and expenses — for families, organizations, and businesses alike.**

---

## 🌟 Project Overview

**Finora** is a modern, full-featured financial management web application that enables individuals, families, businesses, and organizations to record, track, and analyze their financial activities with clarity and precision. Inspired by core accounting principles, Finora brings the power of double-entry bookkeeping and financial reporting into an elegant, accessible interface.

The name **Finora** is a fusion of _Finance_ and _Aura_ — symbolizing a radiant, intelligent financial companion that makes complex accounting feel effortless and beautiful.

---

## 🎯 Target Users

| User Type                   | Use Case                                             |
| --------------------------- | ---------------------------------------------------- |
| **Family / Household**      | Track household income, groceries, bills, savings    |
| **Business / Organization** | Manage revenue streams, assets, liabilities, payroll |
| **NGO / Community Group**   | Monitor donations, project expenses, fund balances   |
| **Freelancer / Individual** | Personal income tracking and expense categorization  |

---

## 🧱 Tech Stack

### Frontend

| Technology                | Version          | Purpose                                 |
| ------------------------- | ---------------- | --------------------------------------- |
| **Next.js**               | 14+ (App Router) | Full-stack React framework with SSR/SSG |
| **TypeScript**            | 5+               | Type-safe development                   |
| **Tailwind CSS**          | 3+               | Utility-first styling                   |
| **Framer Motion**         | Latest           | Animations and micro-interactions       |
| **Zustand**               | Latest           | Global state management                 |
| **React Hook Form**       | Latest           | Form management                         |
| **Zod**                   | Latest           | Schema validation                       |
| **Recharts**              | Latest           | Charts and data visualization           |
| **Lucide React**          | Latest           | Icon library                            |
| **React PDF / jsPDF**     | Latest           | PDF export functionality                |
| **date-fns**              | Latest           | Date formatting and utilities           |
| **clsx + tailwind-merge** | Latest           | Conditional class management            |

### Backend / Database

| Technology             | Purpose                                 |
| ---------------------- | --------------------------------------- |
| **Next.js API Routes** | REST API endpoints                      |
| **Prisma ORM**         | Database abstraction layer              |
| **MongoDB**            | Primary NoSQL database                  |
| **NextAuth.js v5**     | Authentication (Google, Email/Password) |
| **Bcrypt**             | Password hashing                        |

### Deployment & Infrastructure

| Technology     | Purpose                      |
| -------------- | ---------------------------- |
| **Vercel**     | Hosting and deployment       |
| **Supabase**   | Managed PostgreSQL + storage |
| **Cloudinary** | Asset/receipt image uploads  |

---

## 🎨 Design Language

### Visual Identity

- **Theme**: Dark luxury meets modern finance — deep navy/charcoal backgrounds with gold/amber accents and crisp white typography
- **Aesthetic Direction**: _Refined Maximalism_ — rich depth, layered glassmorphism cards, subtle gradients, and ambient glow effects
- **Mood**: Trustworthy, premium, intelligent

### Typography

```
Display Font:   "Playfair Display" or "DM Serif Display" — headings and hero text
Body Font:      "Sora" or "Plus Jakarta Sans" — body text, labels, navigation
Mono Font:      "JetBrains Mono" — financial figures, amounts, codes
```

### Color Palette

```css
--color-background: #0d1117 /* Deep charcoal black */ --color-surface: #161b22
  /* Card background */ --color-surface-alt: #1c2333 /* Elevated surfaces */
  --color-border: #30363d /* Subtle borders */ --color-gold: #d4a853
  /* Primary accent — gold */ --color-gold-light: #f0c96b /* Hover gold */
  --color-emerald: #2ecc71 /* Income / positive values */
  --color-crimson: #e74c3c /* Expense / negative values */ --color-sky: #58a6ff
  /* Links, info, highlights */ --color-text-primary: #e6edf3 /* Primary text */
  --color-text-secondary: #8b949e /* Muted/secondary text */
  --color-text-muted: #484f58 /* Placeholder text */;
```

### Design Principles

1. **Glassmorphism cards** with `backdrop-filter: blur()` for depth
2. **Gradient mesh backgrounds** with animated subtle movement
3. **Micro-animations** on every interaction (hover, focus, submit)
4. **Number counters** animate when values change
5. **Skeleton loaders** for all async data states
6. **Responsive first** — works perfectly on mobile, tablet, desktop
7. **Dark mode default** with optional light mode toggle

---

## 📐 Application Architecture

```
finora/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── income/
│   │   ├── expenses/
│   │   ├── assets/
│   │   ├── liabilities/
│   │   ├── reports/
│   │   ├── categories/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/
│   │   ├── transactions/
│   │   ├── categories/
│   │   ├── reports/
│   │   └── export/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/               # Reusable UI primitives
│   ├── forms/            # Transaction forms, filters
│   ├── charts/           # Financial charts
│   ├── layout/           # Sidebar, topbar, breadcrumbs
│   └── reports/          # Summary cards, ledger tables
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── validations/
│   └── utils/
├── hooks/                # Custom React hooks
├── store/                # Zustand state stores
├── types/                # TypeScript interfaces
└── prisma/
    └── schema.prisma
```

---

## 🗄️ Database Schema

### Core Entities

#### `User`

```prisma
model User {
  id            String        @id @default(cuid())
  name          String
  email         String        @unique
  passwordHash  String?
  avatar        String?
  createdAt     DateTime      @default(now())
  organizations Organization[]
  transactions  Transaction[]
}
```

#### `Organization`

```prisma
model Organization {
  id           String        @id @default(cuid())
  name         String
  type         OrgType       // FAMILY | BUSINESS | NGO | PERSONAL
  currency     String        @default("BDT")
  description  String?
  createdAt    DateTime      @default(now())
  members      User[]
  transactions Transaction[]
  categories   Category[]
  assets       Asset[]
}

enum OrgType {
  FAMILY
  BUSINESS
  NGO
  PERSONAL
}
```

#### `Transaction`

```prisma
model Transaction {
  id             String          @id @default(cuid())
  type           TransactionType // INCOME | EXPENSE | TRANSFER
  amount         Decimal         @db.Decimal(15, 2)
  description    String
  note           String?
  date           DateTime
  receiptUrl     String?
  categoryId     String
  organizationId String
  createdById    String
  category       Category        @relation(fields: [categoryId], references: [id])
  organization   Organization    @relation(fields: [organizationId], references: [id])
  createdBy      User            @relation(fields: [createdById], references: [id])
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}
```

#### `Asset`

```prisma
model Asset {
  id             String       @id @default(cuid())
  name           String
  type           AssetType    // CASH | BANK | PROPERTY | EQUIPMENT | OTHER
  value          Decimal      @db.Decimal(15, 2)
  purchaseDate   DateTime?
  description    String?
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  createdAt      DateTime     @default(now())
}

enum AssetType {
  CASH
  BANK
  PROPERTY
  EQUIPMENT
  VEHICLE
  INVENTORY
  OTHER
}
```

#### `Category`

```prisma
model Category {
  id             String          @id @default(cuid())
  name           String
  type           TransactionType
  color          String
  icon           String
  organizationId String
  organization   Organization    @relation(fields: [organizationId], references: [id])
  transactions   Transaction[]
}
```

---

## 📱 Pages & Features

### 1. Landing Page (`/`)

- Hero section with animated Finora brand + tagline
- Feature highlights with icons
- Demo preview screenshot/animation
- Call-to-action: "Get Started Free"
- Minimalist footer

### 2. Authentication (`/login`, `/register`)

- Email + password authentication
- Google OAuth (optional)
- Animated form transitions
- Organization setup wizard on first login

### 3. Dashboard (`/dashboard`)

**Summary Cards (top row):**

- Total Income (current month)
- Total Expenses (current month)
- Net Balance (Income − Expenses)
- Total Assets value

**Charts Section:**

- Monthly income vs expenses bar chart
- Category-wise expense donut/pie chart
- Balance trend line chart (last 6 months)

**Recent Transactions Table:**

- Last 10 transactions with type badge, amount, category, date
- Quick-add FAB button

**Quick Stats:**

- Largest single expense this month
- Top spending category
- Savings rate percentage

---

### 4. Income Management (`/income`)

**Features:**

- List all income entries with filters (date range, category, source)
- Add income form:
  - Amount
  - Source / Description
  - Category (salary, business, freelance, rental, donation, other)
  - Date
  - Notes (optional)
  - Attachment/receipt upload (optional)
- Edit / Delete income entries
- Pagination with search
- Export filtered income as PDF or CSV

---

### 5. Expense Management (`/expenses`)

**Features:**

- List all expense entries with advanced filters
- Add expense form:
  - Amount
  - Payee / Description
  - Category (food, transport, utilities, rent, salary, equipment, etc.)
  - Date
  - Payment method (cash, bank transfer, card)
  - Notes
  - Receipt upload
- Edit / Delete expense entries
- Recurring expense support (daily, weekly, monthly)

---

### 6. Asset Management (`/assets`)

**Features:**

- Register and track all assets:
  - Cash on hand
  - Bank account balances
  - Property / real estate
  - Vehicles
  - Equipment and inventory
- Asset value history
- Asset depreciation notes
- Total asset value summary

---

### 7. Liabilities (`/liabilities`)

**Features:**

- Track loans, payables, dues
- Loan details: principal, interest rate, monthly installment, due date
- Liability vs asset ratio visualization
- Payment schedule tracker

---

### 8. Reports & Summary (`/reports`)

This is the core financial reporting module.

**Available Reports:**
| Report | Description |
|--------|-------------|
| **Income Statement** | Total income − total expenses = net profit/loss for a period |
| **Balance Sheet** | Assets vs liabilities snapshot |
| **Cash Flow Statement** | Where money came from and where it went |
| **Category Breakdown** | Expense and income by category |
| **Monthly Ledger** | Day-by-day transaction log (জের/balance) |
| **Annual Summary** | Year-over-year comparison |

**Filters:**

- Date range (custom, this month, last month, this year, last year, custom range)
- Organization
- Category
- Transaction type

**PDF Export:**

- Click "Export as PDF" on any report
- Generates a branded, formatted PDF with:
  - Finora logo and report title
  - Organization name and date range
  - Summary table
  - Charts (converted to images)
  - Transaction details
  - Running balance / জের (closing balance)
  - Generated timestamp and footer

---

### 9. Category Management (`/categories`)

- Create custom income and expense categories
- Assign color and emoji/icon to each category
- Edit or delete categories
- View total amount per category

---

### 10. Settings (`/settings`)

- **Profile**: Name, email, avatar
- **Organization**: Name, type, currency, description
- **Currency**: Set preferred currency (BDT, USD, EUR, GBP, etc.)
- **Theme**: Dark / Light mode toggle
- **Data Export**: Export all data as JSON or CSV
- **Delete Account**: Confirmation-required destructive action

---

## 💡 Key Functional Requirements

### Accounting Logic

1. Every transaction is categorized as **INCOME** or **EXPENSE**
2. **Net Balance** = Total Income − Total Expenses
3. **Closing Balance (জের)** is shown for any selected date range
4. Assets are tracked separately from income (an asset isn't income until sold/used)
5. Running balance shown in ledger view: each row shows cumulative total after that transaction
6. Transfers between accounts do not count as income or expense

### PDF Export Requirements

The PDF export must include:

- Cover section: Organization name, report type, date range
- Financial summary table (income, expense, net balance)
- Detailed transaction table with columns: Date | Description | Category | Debit | Credit | Balance
- Category-wise subtotals
- Closing balance prominently displayed
- Finora branding (logo, footer)
- Page numbers
- Print-ready A4 format

### Validation Rules

- Amount must be a positive number
- Date cannot be in the future (configurable)
- Description is required (min 3 characters)
- Category is required
- Receipt upload: max 5MB, formats: JPG, PNG, PDF

---

## 🔐 Security Requirements

- All routes behind `/dashboard` are protected — unauthenticated users redirect to `/login`
- Passwords hashed with bcrypt (min 12 rounds)
- CSRF protection via NextAuth
- Input sanitization on all form fields
- SQL injection prevention via Prisma parameterized queries
- Rate limiting on API routes (max 100 req/min per IP)
- Users can only access their own organization's data
- Environment variables for all secrets (never hardcoded)

---

## 🧩 Component Library

Build the following reusable components:

| Component              | Description                                         |
| ---------------------- | --------------------------------------------------- |
| `<FinancialCard />`    | Glassmorphism summary card with icon, amount, trend |
| `<TransactionTable />` | Sortable, filterable data table with pagination     |
| `<TransactionForm />`  | Modal form for adding/editing transactions          |
| `<DateRangePicker />`  | Custom date range selection component               |
| `<AmountDisplay />`    | Animated counter for financial amounts              |
| `<CategoryBadge />`    | Colored pill badge with category icon               |
| `<BalanceIndicator />` | Color-coded positive/negative balance display       |
| `<ChartContainer />`   | Wrapper for Recharts with loading state             |
| `<PDFPreview />`       | In-browser preview before PDF download              |
| `<EmptyState />`       | Illustrated empty state for no data                 |
| `<Sidebar />`          | Collapsible navigation sidebar                      |
| `<Topbar />`           | Top navigation with org switcher and user menu      |

---

## 📊 API Endpoints

### Transactions

```
GET    /api/transactions          # List with filters
POST   /api/transactions          # Create new transaction
GET    /api/transactions/:id      # Get single transaction
PUT    /api/transactions/:id      # Update transaction
DELETE /api/transactions/:id      # Delete transaction
```

### Reports

```
GET    /api/reports/summary       # Income, expense, balance summary
GET    /api/reports/income-statement   # Income statement for date range
GET    /api/reports/balance-sheet      # Asset vs liability snapshot
GET    /api/reports/ledger        # Running balance ledger
POST   /api/reports/export-pdf    # Generate and return PDF
```

### Assets

```
GET    /api/assets                # List all assets
POST   /api/assets                # Add asset
PUT    /api/assets/:id            # Update asset value
DELETE /api/assets/:id            # Remove asset
```

### Categories

```
GET    /api/categories            # List all categories
POST   /api/categories            # Create category
PUT    /api/categories/:id        # Update category
DELETE /api/categories/:id        # Delete category
```

---

## 🚀 Performance Requirements

- **Page load**: Initial LCP < 2.5 seconds
- **API response**: All endpoints < 500ms
- **PDF generation**: < 5 seconds for standard reports
- **Lighthouse score**: > 85 on all metrics
- **Mobile responsiveness**: Full functionality on screens ≥ 375px
- **Pagination**: Max 25 rows per page; infinite scroll optional for mobile

---

## 📦 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Storage (Cloudinary)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Finora
```

---

## 📋 Development Setup

```bash
# Clone and install
git clone https://github.com/your-org/finora.git
cd finora
npm install

# Set up environment
cp .env.example .env.local
# Fill in all environment variables

# Database setup
npx prisma generate
npx prisma db push
npx prisma db seed    # Seeds demo data

# Development server
npm run dev           # Starts on http://localhost:3000

# Build for production
npm run build
npm run start

# Linting and formatting
npm run lint
npm run format
```

---

## 🧪 Testing Requirements

- **Unit tests**: Utility functions, calculation logic (Jest)
- **Component tests**: React Testing Library for key UI components
- **E2E tests**: Playwright for critical flows (login, add transaction, export PDF)
- **Test coverage target**: > 70%

---

## 🌍 Localization

- Default language: **English**
- Secondary language support: **Bengali (বাংলা)** — all UI strings should use an i18n setup (next-intl recommended) so Bengali can be added without code changes
- Currency formatting: locale-aware number formatting

---

## ✅ Acceptance Criteria

A developer should confirm these before delivery:

- [ ] User can register, login, and create an organization
- [ ] User can add income entries with categories and dates
- [ ] User can add expense entries with categories and dates
- [ ] User can add and manage assets
- [ ] Dashboard shows correct totals and charts
- [ ] Reports page generates accurate income statement, balance sheet, and ledger
- [ ] Running balance (জের) is correctly calculated in ledger
- [ ] PDF export works and contains all required data
- [ ] All forms validate correctly and show helpful error messages
- [ ] App is fully responsive on mobile
- [ ] Authentication is secure and routes are protected
- [ ] Performance benchmarks are met

---

## 🗓️ Suggested Development Phases

### Phase 1 — Foundation (Week 1–2)

- Project setup (Next.js, TypeScript, Tailwind, Prisma)
- Database schema and migrations
- Authentication (NextAuth)
- Layout components (Sidebar, Topbar)
- Landing page

### Phase 2 — Core Features (Week 3–4)

- Transaction CRUD (income, expenses)
- Category management
- Dashboard with summary cards
- Basic charts (Recharts)

### Phase 3 — Advanced Features (Week 5–6)

- Asset and liability tracking
- Reports module (income statement, balance sheet, ledger)
- Running balance calculation
- Date range filters

### Phase 4 — Export & Polish (Week 7–8)

- PDF export (jsPDF or react-pdf)
- Animations (Framer Motion)
- Mobile optimization
- Performance tuning
- Testing

---

## 📄 License

This project is proprietary. All rights reserved by the project owner.

---

_Built with ❤️ by the Finora team — Where Finance Meets Aura._
