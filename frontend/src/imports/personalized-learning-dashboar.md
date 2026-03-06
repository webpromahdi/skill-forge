You are a senior frontend engineer and UI/UX designer.

Your task is to design a modern, responsive dashboard interface for a web application called:

"Personalized Learning Recommendation System"

IMPORTANT:
For this phase, DO NOT implement real backend functionality. This stage is only for creating a high-quality frontend UI with dummy interactions.

The goal is to create a professional SaaS-style learning dashboard that is responsive, user-friendly, and visually attractive.

--------------------------------------------------

TECH STACK (STRICT)

You MUST use the following technologies:

React
TailwindCSS
Framer Motion (for subtle animations)

Do NOT use other UI frameworks like Bootstrap or Material UI.

Use component-based architecture.

--------------------------------------------------

REFERENCE DESIGN

A reference dashboard image will be provided.

Use that design as inspiration for:

- layout
- card structure
- sidebar layout
- spacing
- color combination

You should follow the overall visual style but improve it where possible.

Do NOT copy blindly. Create a cleaner and more modern version.

--------------------------------------------------

PROJECT STRUCTURE

Organize the React project like this:

src
  components
  layouts
  pages
  assets
  hooks
  utils

Reusable components must be created.

--------------------------------------------------

PAGES TO BUILD

1) Landing Page

Minimal landing page that includes:

- App name
- Short description
- Login button
- Signup button

Buttons should navigate to login/signup pages.

--------------------------------------------------

2) Login Page

Clean login form containing:

- email input
- password input
- login button

Dummy functionality:

Clicking Login should automatically redirect to the Dashboard.

No authentication logic needed.

--------------------------------------------------

3) Signup Page

Signup form with:

- name
- email
- password
- signup button

Dummy functionality:

Clicking Signup redirects to the Dashboard.

--------------------------------------------------

4) Dashboard Layout

The dashboard must contain:

Sidebar
Top Header
Main Content Area

Sidebar navigation items:

Dashboard
Learning Path
Recommendations
Progress
Assessments
Resources
Settings

Each sidebar item should include an icon.

Sidebar must collapse on smaller screens.

--------------------------------------------------

DASHBOARD CONTENT SECTIONS

The main dashboard page should contain the following sections.

1) Welcome Card

Example:

Welcome back, User 👋
Goal: Frontend Developer

--------------------------------------------------

2) Recommendation Card

Title: "Recommendations"

Example content:

Next Topic
DOM Manipulation

Suggested Practice
Build a Todo App

Estimated Time
45 minutes

--------------------------------------------------

3) Learning Progress Section

Display topics such as:

HTML Basics
CSS Fundamentals
JavaScript Basics
React Basics

Include:

progress bars
status badges:

Completed
In Progress
Locked

--------------------------------------------------

4) Activity / Learning Cards

Each card should show:

topic title
lesson progress
time spent
status label
progress bar

Cards should visually resemble the reference design.

--------------------------------------------------

RESPONSIVE DESIGN REQUIREMENTS

The UI must be fully responsive across:

Desktop
Laptop
Tablet
Mobile

Responsive behavior:

Sidebar collapses on mobile
Cards stack vertically on smaller screens
Padding and spacing adjust properly
Typography scales appropriately

--------------------------------------------------

TYPOGRAPHY

Use a modern SaaS-style typography system.

Primary font: Inter

Font weights:

400
500
600
700

Maintain clear hierarchy for headings, cards, labels, and buttons.

--------------------------------------------------

COLOR SYSTEM

Use a color style similar to the provided reference image:

Dark sidebar
Light dashboard background
White cards
Green progress indicators

Suggested palette:

Sidebar: #0F172A
Primary: #2563EB
Success: #22C55E
Background: #F8FAFC
Card: #FFFFFF
Text: #0F172A

Use soft shadows and rounded corners.

--------------------------------------------------

ANIMATIONS (FRAMER MOTION)

Use Framer Motion for subtle UI animations:

Sidebar hover animation
Card hover elevation
Page transition animation
Smooth component appearance
Button interaction feedback

Animations must be subtle and smooth.

Avoid excessive motion.

--------------------------------------------------

COMPONENTS TO CREATE

Create reusable components:

Sidebar
Header
DashboardCard
RecommendationCard
ProgressBar
ActivityCard
StatusBadge

--------------------------------------------------

UX REQUIREMENTS

The interface must feel:

modern
clean
minimal
professional
easy to understand

Use consistent spacing and alignment.

Avoid clutter.

--------------------------------------------------

RULES (CUSTOMIZABLE)

Follow these rules strictly:

1️⃣ UI Design & Component Library Guide (React Ecosystem)

Purpose:
Follow modern industry-standard patterns when selecting UI components, design systems, and libraries for React applications.

This project is a modern SaaS-style dashboard built with React + Tailwind CSS.

--------------------------------

PRIMARY UI SYSTEM (STRICT)

Use the following stack as the primary UI foundation:

shadcn/ui + Radix UI + Tailwind CSS

Reason:
- shadcn provides production-ready UI components
- Radix ensures accessibility and interaction logic
- Tailwind ensures design flexibility and consistency

Installation example:

npx shadcn@latest init
npx shadcn@latest add button card dialog input dropdown-menu

Components should live inside:

/src/components/ui

--------------------------------

DO NOT USE HEAVY UI FRAMEWORKS

Avoid full UI frameworks such as:

Material UI (MUI)
Ant Design
Chakra UI
Mantine
PrimeReact

Reason:
They add unnecessary bundle size and styling conflicts with Tailwind.

--------------------------------

ICONS

Use modern React icon libraries:

lucide-react (preferred)
heroicons
tabler-icons

Example:

npm install lucide-react

--------------------------------

ANIMATION SYSTEM

Use Framer Motion for UI animations.

Allowed animations:

- card hover animation
- sidebar transition
- page transitions
- smooth component appearance

Avoid excessive or complex animations.

--------------------------------

FORMS

Preferred form stack:

React Hook Form + Zod

npm install react-hook-form zod @hookform/resolvers

Used for:

Login form
Signup form
Future dashboard forms

--------------------------------

CHARTS (OPTIONAL)

If charts are needed for dashboard analytics:

Use Recharts.

npm install recharts

Example uses:

progress charts
learning statistics
weekly activity

--------------------------------

TABLES (OPTIONAL)

If table views are needed:

Use TanStack Table.

npm install @tanstack/react-table

--------------------------------

STATE MANAGEMENT

For simple client state:

Use Zustand.

Avoid Redux unless absolutely necessary.

--------------------------------

UTILITY LIBRARIES

Recommended small utilities:

clsx
class-variance-authority
tailwind-merge
date-fns

--------------------------------

DESIGN PRINCIPLES

Follow these UI principles:

- Build reusable components
- Use Tailwind utility classes
- Use CSS variables for colors
- Maintain consistent spacing
- Follow accessible component patterns

--------------------------------

PROJECT TYPE REFERENCE

This project follows the recommended SaaS Dashboard stack:

UI:
shadcn/ui + Radix UI + Tailwind CSS

Animations:
Framer Motion

Forms:
React Hook Form + Zod

Charts:
Recharts (optional)

State:
Zustand

--------------------------------

ACCESSIBILITY

Components must support:

- keyboard navigation
- ARIA labels
- focus states

Radix primitives should be used whenever possible.

2️⃣ Code Quality & Architecture Rule

Purpose:
Ensure that all generated code follows industry-level architecture, maintainability standards, and clean code practices suitable for scalable React applications.

--------------------------------------------------

PROJECT ARCHITECTURE

The project must follow a scalable folder structure.

Use this structure:

src
 ├ components
 │   ├ ui          # Base UI components (buttons, cards, inputs)
 │   ├ features    # Feature-specific components
 │   └ layouts     # Layout components (Sidebar, Header)
 │
 ├ pages           # Page-level components
 ├ hooks           # Custom React hooks
 ├ services        # API services or external integrations
 ├ lib             # Utility functions and helpers
 ├ constants       # Global constants
 ├ types           # TypeScript type definitions
 └ styles          # Global styles

Avoid deeply nested folders (max 3–4 levels).

--------------------------------------------------

SEPARATION OF CONCERNS

Ensure clear separation between:

UI components
business logic
API/services
utility functions

Do NOT place API logic inside UI components.

Use services or hooks instead.

--------------------------------------------------

COMPONENT DESIGN PRINCIPLES

All components must follow these rules:

Single Responsibility
Reusable and composable
Configurable via props
Avoid hardcoded values
Support children when appropriate

Example good component design:

Reusable card components
Configurable buttons
Flexible layout components

--------------------------------------------------

REACT BEST PRACTICES

Follow modern React standards:

Use functional components only
Use hooks instead of class components
Use custom hooks to extract logic
Use proper dependency arrays in useEffect

Avoid:

Direct state mutations
Infinite render loops
Unnecessary re-renders

--------------------------------------------------

ASYNC & ERROR HANDLING

All async logic must follow modern patterns.

Use:

async/await
try/catch error handling

Avoid nested callbacks (callback hell).

Use Promise.all when parallel requests are needed.

--------------------------------------------------

PERFORMANCE PRACTICES

Apply basic performance optimizations:

Use React.memo for heavy components
Use useMemo and useCallback when needed
Lazy load large components
Avoid unnecessary renders

Avoid rendering large lists without optimization.

--------------------------------------------------

RESPONSIVE DESIGN

Follow a mobile-first approach.

Use Tailwind breakpoints:

sm
md
lg
xl
2xl

Layouts must use:

Flexbox or Grid
Fluid widths
No fixed pixel layouts

No horizontal scrolling on mobile.

--------------------------------------------------

CODE QUALITY STANDARDS

Maintain clean and readable code.

Follow these limits:

Maximum file size: ~300 lines
Maximum function size: ~50 lines
Maximum nesting depth: 3–4 levels

Avoid:

Duplicated code
Magic numbers
Unused variables
Dead code

--------------------------------------------------

NAMING CONVENTIONS

Use consistent naming.

PascalCase → React components
camelCase → functions and utilities
kebab-case → file names if needed

Example:

Sidebar.tsx
DashboardCard.tsx
useUserProgress.ts

--------------------------------------------------

REUSABILITY

Prefer reusable components over duplicated code.

Common reusable components include:

Card
Button
Modal
ProgressBar
StatCard

--------------------------------------------------

BUILD & TOOLING STANDARDS

The project should assume the following tooling:

TypeScript in strict mode
ESLint
Prettier
Proper environment variable handling

--------------------------------------------------

CODE REVIEW PRINCIPLES

Before finalizing generated code ensure:

No console.log debugging
No commented unused code
Proper formatting
Clear component structure
Meaningful variable names

3️⃣ Responsive Layout & UX Enforcement Rule

Purpose:
Ensure the dashboard interface is fully responsive, mobile-friendly, and maintains usability across all device sizes.

--------------------------------------------------

RESPONSIVE DESIGN PRINCIPLE

Use a mobile-first design approach.

Design should scale smoothly from:

Mobile → Tablet → Laptop → Desktop → Large screens.

Tailwind breakpoints must be used:

sm 640px
md 768px
lg 1024px
xl 1280px
2xl 1536px

--------------------------------------------------

LAYOUT RESPONSIVENESS

The dashboard layout must adapt based on screen size.

Desktop Layout:

Sidebar visible on the left
Main dashboard content on the right

Tablet Layout:

Sidebar collapses into a compact navigation
Content area expands

Mobile Layout:

Sidebar becomes a slide-in drawer menu
Content stacks vertically

--------------------------------------------------

GRID & CARD BEHAVIOR

Dashboard cards must adapt to screen size.

Example behavior:

Desktop:
3–4 cards per row

Tablet:
2 cards per row

Mobile:
1 card per row

Use Tailwind grid utilities:

grid
grid-cols-1
md:grid-cols-2
lg:grid-cols-3
xl:grid-cols-4

--------------------------------------------------

TOUCH FRIENDLY INTERACTION

Mobile UI must be touch friendly.

Minimum tap target size:

44px × 44px

Buttons, cards, and navigation elements must be easily clickable.

--------------------------------------------------

TEXT & TYPOGRAPHY SCALING

Typography should scale appropriately.

Example:

Headings:
text-xl → text-2xl → text-3xl

Body text must remain readable on mobile.

Minimum font size: 16px.

--------------------------------------------------

NO MOBILE UX ISSUES

The layout must avoid:

Horizontal scrolling
Overflowing cards
Cut-off text
Hidden navigation
Broken grids

--------------------------------------------------

SIDEBAR BEHAVIOR

Desktop:
Sidebar permanently visible.

Tablet:
Sidebar collapsible.

Mobile:
Sidebar becomes a slide-in drawer menu.

--------------------------------------------------

PERFORMANCE ON MOBILE

Avoid heavy animations on mobile.

Use lightweight Framer Motion animations only when necessary.

--------------------------------------------------