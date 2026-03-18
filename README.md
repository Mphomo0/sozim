# Sozim Trading Platform

A modern trading education and management platform built with Next.js, designed to provide comprehensive tools for trading education, student management, course delivery, and e-commerce functionality.

## About This Project

Sozim Trading is a comprehensive web application that serves as an all-in-one platform for trading education and student management. The platform enables users to:

- Access trading courses and educational content
- Manage student profiles and track progress
- Browse and purchase trading programs and resources
- View career pathways and professional development opportunities
- Interactive campus information and resources
- Favorites system for saving preferred courses and materials
- Digital library for course materials and resources

## Tech Stack

This project is built with modern web technologies:

- **Frontend Framework**: Next.js 16 with App Router and Turbopack
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Backend/Database**: Convex
- **Forms**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **Animations**: Motion and Framer Motion CSS
- **Email**: Nodemailer
- **Image Management**: ImageKit

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js (version 18 or higher recommended)
- npm, yarn, pnpm, or bun (package manager of your choice)
- Git

## Installation

Follow these steps to get the project up and running on your local machine:

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sozim-trading
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

Or using pnpm:

```bash
pnpm install
```

Or using bun:

```bash
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory based on the `.env` template. You'll need to configure the following services:

**Convex Configuration:**
- `CONVEX_DEPLOYMENT` - Your Convex deployment identifier
- `NEXT_PUBLIC_CONVEX_URL` - Your Convex project URL
- `NEXT_PUBLIC_CONVEX_SITE_URL` - Your Convex site URL

**Clerk Authentication:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `CLERK_JWT_ISSUER_DOMAIN` - Your Clerk JWT issuer domain

**Clerk Webhooks:**
- `CLERK_WEBHOOK_SECRET` - Your Clerk webhook secret for user synchronization

For detailed setup instructions for Convex and Clerk, please refer to their official documentation:
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)

### 4. Run the Development Server

Start the development server with:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will automatically update as you make changes to the code.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code quality issues

## Project Structure

```
sozim-trading/
├── app/                    # Next.js App Router pages and layouts
│   ├── about/             # About page
│   ├── api/               # API routes
│   ├── call-me-back/      # Callback request functionality
│   ├── campus/            # Campus information
│   ├── career-pathway/    # Career development paths
│   ├── contact/           # Contact page
│   ├── contact-learning/   # Learning contact form
│   ├── courses/           # Course catalog and details
│   ├── dashboard/         # Student dashboard
│   ├── favorites/         # Saved favorites
│   ├── library/           # Digital library
│   ├── shop/              # E-commerce store
│   └── student/           # Student management
├── components/            # React components
│   ├── global/           # Global reusable components
│   ├── sections/         # Page section components
│   └── ui/               # UI component library
├── convex/              # Convex backend schema and functions
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and helpers
└── public/              # Static assets
```

## Key Features

### Authentication
Secure authentication system powered by Clerk with support for multiple authentication methods and webhook integration for user management.

### Course Management
Comprehensive course catalog with detailed information, categories, pricing, and enrollment functionality.

### Student Dashboard
Personalized dashboard for students to track their learning progress, access enrolled courses, and manage their profile.

### E-commerce
Integrated shop functionality for purchasing trading programs, resources, and educational materials.

### Contact & Communication
Multiple contact options including callback requests, direct contact forms, and learning inquiries.

### Career Development
Career pathway explorer to help students understand potential career trajectories in trading and finance.

### Digital Library
Centralized repository for course materials, resources, and educational content.

### Favorites System
Save and organize preferred courses and resources for quick access.

## Development

### Code Quality

This project uses ESLint for code linting. Run the linter with:

```bash
npm run lint
```

### Building for Production

To create an optimized production build:

```bash
npm run build
```

Then start the production server:

```bash
npm start
```

## Deployment

The easiest way to deploy this Next.js application is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

For other deployment options, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### Convex Deployment

Convex provides automatic backend deployment. After setting up your Convex project, configure the deployment in your environment variables and commit your Convex schema changes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary. All rights reserved.

## Support

For support and questions, please contact the development team.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Features and API documentation
- [Learn Next.js](https://nextjs.org/learn) - Interactive tutorial
- [Convex Documentation](https://docs.convex.dev) - Backend development
- [Clerk Documentation](https://clerk.com/docs) - Authentication
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling
- [Radix UI](https://www.radix-ui.com/docs) - UI components
