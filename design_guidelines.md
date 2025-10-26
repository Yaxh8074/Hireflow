# Design Guidelines: Pay-As-You-Go HR Platform

## Design Approach

**Selected Approach**: Design System - Modern Productivity Application
**Justification**: As a utility-focused, information-dense HR/hiring tool, this platform prioritizes efficiency, clarity, and data presentation over visual flair. The minimal UI requirement demands clean patterns and consistent components.

**Key Design Principles**:
1. Clarity over decoration - every element serves a functional purpose
2. Scannable data presentation - users need to process information quickly
3. Transparent pricing visibility - costs should be immediately clear
4. Streamlined workflows - minimal clicks to complete core tasks

---

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Background: 0 0% 100% (pure white)
- Surface: 210 20% 98% (subtle cool gray)
- Border: 214 20% 91%
- Text Primary: 222 47% 11%
- Text Secondary: 215 16% 47%
- Primary Brand: 221 83% 53% (professional blue)
- Success: 142 76% 36% (for hired status, positive metrics)
- Warning: 38 92% 50% (for pending actions)
- Destructive: 0 84% 60%

**Dark Mode**:
- Background: 222 47% 11%
- Surface: 217 33% 17%
- Border: 217 27% 24%
- Text Primary: 210 20% 98%
- Text Secondary: 215 20% 65%
- Primary Brand: 217 91% 60%
- Success: 142 71% 45%
- Warning: 38 92% 60%
- Destructive: 0 91% 71%

### B. Typography

**Font Families**:
- Primary: 'Inter' (Google Fonts) - for UI, body text, data tables
- Monospace: 'JetBrains Mono' - for pricing, metrics, IDs

**Type Scale**:
- Display: 2.25rem (36px), font-weight: 700 - dashboard headings
- H1: 1.875rem (30px), font-weight: 600 - page titles
- H2: 1.5rem (24px), font-weight: 600 - section headers
- H3: 1.25rem (20px), font-weight: 500 - card titles
- Body: 0.875rem (14px), font-weight: 400 - primary content
- Small: 0.75rem (12px), font-weight: 400 - metadata, captions
- Mono (Metrics): 1.5rem (24px), font-weight: 600 - key numbers

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 for consistent rhythm
- Component padding: p-4 or p-6
- Section spacing: gap-6 or gap-8
- Card margins: m-4
- Input/button heights: h-10 or h-12
- Icon sizes: w-4 h-4 or w-5 h-5

**Grid System**:
- Dashboard: 12-column grid with gap-6
- Responsive breakpoints: md:grid-cols-2, lg:grid-cols-3, xl:grid-cols-4

### D. Component Library

**Core UI Elements**:

1. **Cards**: Elevated surfaces (border, rounded-lg, bg-surface) for data grouping
   - Stats cards: Include large metric number, label, and trend indicator
   - Job post cards: Compact with status badge, title, and quick actions
   - Invoice cards: Monospace pricing, date, and payment status

2. **Data Tables**: 
   - Alternating row backgrounds for scannability
   - Sticky headers on scroll
   - Sortable columns with arrow indicators
   - Inline actions (view, edit, delete) on hover

3. **Navigation**:
   - Top navbar: Logo left, user menu right, current balance indicator
   - Sidebar: Collapsible with icons + labels, active state highlighting
   - Breadcrumbs: For deep navigation hierarchy

4. **Forms**:
   - Labeled inputs with floating labels
   - Inline validation messages
   - Multi-step forms with progress indicator
   - File upload zones with drag-and-drop

5. **Data Displays**:
   - Pricing breakdown: Itemized list with unit cost × quantity
   - Usage charts: Simple bar/line charts using minimal colors
   - Status badges: Small, rounded pills with semantic colors
   - Progress bars: For candidate pipeline stages

6. **Overlays**:
   - Modal dialogs: For job posting, candidate details
   - Drawer panels: For filters, notifications
   - Tooltips: For pricing explanations, feature descriptions
   - Toast notifications: For action confirmations

### E. Animations

**Minimal Motion**:
- Transitions: 150ms ease for hover states only
- No page transitions or scroll animations
- Subtle opacity changes for interactive elements
- Loading states: Simple spinner, no skeleton screens

---

## Page-Specific Guidelines

### Dashboard Layout
- Top metrics row: 4 stat cards showing balance, active jobs, candidates, month spend
- Usage chart: Full-width bar chart showing daily/weekly costs
- Recent activity feed: 2-column layout (left: job posts, right: recent hires)

### Job Posting Flow
- Single-column form with clear section breaks
- Inline pricing calculator showing cost as fields are filled
- Preview panel (right side on desktop) showing candidate-facing view
- Sticky footer with total cost and "Post Job" CTA

### Candidate Pipeline
- Kanban-style columns for each status stage
- Draggable candidate cards with photo, name, applied job, and days in stage
- Quick filters above: skills, experience level, date range

### Billing Dashboard
- Current balance prominently displayed (top right, always visible)
- Transaction history table with expandable rows for itemized details
- "Add Funds" button with preset amounts ($50, $100, $250, custom)
- Usage breakdown pie chart by service type

---

## Images

No hero images required for this application. This is a utility-first SaaS tool where users log in directly to dashboards. However, use these image types:

1. **Candidate Profile Photos**: Circular avatars (40px × 40px) in cards and lists
2. **Company Logos**: Small rectangular logos (120px × 40px) for multi-company accounts
3. **Empty States**: Simple illustrations for "No jobs posted" or "No candidates" states (max 200px height)
4. **Onboarding**: Optional 3-step visual guide for first-time users (600px × 400px)

All imagery should be minimal, iconographic, and support the clean aesthetic—no photography or decorative elements.