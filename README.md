# Expense Tracker Web

Next.js 16 frontend for the Expense Tracker application.

## Prerequisites

- Node.js 20+
- pnpm 9+
- Expense Tracker API running (see [expense-tracker-api](https://github.com/Alix35301/expense-tracker-api))

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Update the variables in `.env`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
pnpm build
pnpm start
```

## Docker

### Development

```bash
docker-compose up
```

### Production Build

```bash
docker build -t expense-tracker-web \
  --build-arg NEXT_PUBLIC_API_URL=http://localhost:3001 \
  .

docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=your_secret \
  expense-tracker-web
```

## Project Structure

```
src/
├── app/              # Next.js 16 App Router
├── components/       # React components
├── lib/             # Utility functions and API client
└── types/           # TypeScript type definitions
```

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm dev:turbo` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm clean` - Clean build artifacts and node_modules
- `pnpm docker:build` - Build Docker image
- `pnpm docker:run` - Run with Docker Compose

## Technologies

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Radix UI** - Headless UI components
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Chart.js** - Data visualization

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs/primitives/overview/introduction)
