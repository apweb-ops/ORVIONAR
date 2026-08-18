# ORVIONAR Admissions Hub

A responsive admissions website for ORVIONAR TECH PRIVATE LIMITED. Students can explore career domains, review the three-month program, submit an application, contact the team, and access supporting resources.

## Stack

- React 19 and TypeScript
- Vite with TanStack Start and TanStack Router
- Tailwind CSS and shadcn-style UI components
- Supabase for admissions, contact submissions, and authentication
- React Hook Form, Zod, and Lucide React

## Local Setup

```sh
npm install
npm run dev
```

The development server runs at `http://localhost:5173`.

Create a local `.env` file with the Supabase settings used by the app:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
VITE_WHATSAPP_NUMBER=your-whatsapp-number
```

Do not commit real credentials. The public Supabase key is intended for browser use; service-role keys belong only in server-side environments.

## Commands

```sh
npm run dev       # Start the development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

## Project Layout

- `src/components`: reusable layout, form, program, and section components
- `src/routes`: public pages and protected application routes
- `src/integrations/supabase`: browser, server, authentication, and database helpers
- `src/lib`: site content, analytics, queries, and shared utilities
- `supabase/migrations`: database schema and Row Level Security policies
- `public`: static files such as `robots.txt`

## Supabase

Apply the SQL migration in `supabase/migrations` to the project before testing admissions or contact submissions. Keep Row Level Security enabled so public visitors can submit records without reading other applications.

## Brand

The interface follows the ORVIONAR identity: orange, black, white, and restrained navy accents, with a focus on practical learning, projects, internship experience, and career support.
