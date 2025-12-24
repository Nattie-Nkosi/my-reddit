# MyReddit

A modern, full-featured Reddit-like community platform built with Next.js 16. Create topics, share posts, engage in nested discussions, and build your reputation through karma points.

🔗 **[Live Demo](https://your-app.vercel.app)** | 📖 [Documentation](#installation)

## ✨ Features

- **🔐 GitHub Authentication** - Secure OAuth-based login with NextAuth v5
- **💬 Topic-Based Discussions** - Create and manage community topics
- **📝 Post Management** - Create, edit, and delete posts with rich text content
- **🧵 Nested Comments** - Unlimited-level threaded comment discussions
- **⬆️ Voting System** - Upvote/downvote posts and comments with real-time updates
- **👤 User Profiles** - Personal profiles with karma tracking, post history, and comment activity
- **⚡ Optimistic UI** - Instant feedback with optimistic updates before server confirmation
- **📱 Responsive Design** - Beautiful interface that works on all devices
- **🎨 Modern UI** - Clean design built with shadcn/ui and Tailwind CSS v4

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Neon](https://neon.tech/) (serverless)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth v5](https://next-auth.js.org/) with GitHub OAuth
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📋 Prerequisites

- Node.js 18+ and npm
- A GitHub account
- GitHub OAuth App credentials ([create one here](https://github.com/settings/developers))
- (For production) Neon PostgreSQL database ([create one here](https://neon.tech/))

## 🛠️ Installation

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd myreddit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file:
   ```env
   # Database (PostgreSQL - Neon)
   DATABASE_URL="your_neon_database_url"

   # GitHub OAuth
   GITHUB_CLIENT_ID="your_github_oauth_app_client_id"
   GITHUB_CLIENT_SECRET="your_github_oauth_app_secret"

   # NextAuth
   NEXTAUTH_SECRET="your_random_secret_string"
   NEXTAUTH_URL="http://localhost:3000"
   ```

   **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Creating a Topic
1. Sign in with your GitHub account
2. Click **"Create Topic"** on the homepage
3. Enter a slug (URL-friendly name) and description
4. Submit to create your community

### Creating a Post
1. Navigate to any topic page
2. Click **"Create Post"**
3. Write your post title and content
4. Submit to publish in the community

### Engaging with Content
- **Comment**: Write a comment at the bottom of any post
- **Reply**: Click "Reply" on any comment to start a thread
- **Vote**: Use ⬆️ and ⬆️ arrows to upvote/downvote content
- **Profile**: Click on any username to view their profile and activity

### Building Karma
- Earn karma when others upvote your posts and comments
- Lose karma when others downvote your content
- View your total karma and activity on your profile page

## 📁 Project Structure

```
myreddit/
├── prisma/
│   ├── schema.prisma          # Database schema (PostgreSQL)
│   └── migrations/            # Database migrations
├── src/
│   ├── actions/               # Server Actions (mutations)
│   │   ├── create-topic.ts
│   │   ├── create-post.ts
│   │   ├── create-comment.ts
│   │   ├── vote-post.ts
│   │   └── ...
│   ├── app/                   # Next.js App Router pages
│   │   ├── page.tsx          # Home page
│   │   ├── topics/           # Topic routes
│   │   └── users/            # User profile routes
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── topics/           # Topic components
│   │   ├── posts/            # Post components
│   │   ├── comments/         # Comment components
│   │   └── users/            # User profile components
│   ├── lib/                  # Utility functions
│   │   ├── format-time.ts    # Relative time formatting
│   │   └── utils.ts          # Helper utilities
│   ├── auth.ts               # NextAuth v5 configuration
│   ├── db.ts                 # Prisma client instance
│   └── paths.ts              # Centralized route paths
└── package.json
```

## 🗄️ Database Commands

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create and apply a new migration (development)
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# View/edit database with Prisma Studio
npx prisma studio

# Pull schema from existing database
npx prisma db pull

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 💻 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run ESLint
npm run lint

# Type check with TypeScript
npx tsc --noEmit
```

## 🏗️ Key Architecture Decisions

### Server Components & Server Actions
- **Server Components by default** - All components are Server Components unless client interactivity is needed
- **Server Actions** - All mutations (create, update, delete, vote) use Next.js Server Actions
- **Type-safe forms** - Zod validation with automatic error handling
- **Path revalidation** - Automatic cache invalidation after mutations

### Optimistic UI Updates
- **Instant feedback** - Votes update immediately before server confirmation
- **React transitions** - Uses `useTransition` for smooth state updates
- **Automatic rollback** - Failed operations revert to previous state
- **No loading states** - Users never wait for vote operations

### Authentication Flow
- **NextAuth v5** - Latest authentication framework with GitHub OAuth
- **Prisma Adapter** - Session storage in PostgreSQL
- **Protected actions** - Server-side authentication checks for all mutations
- **Secure sessions** - HTTP-only cookies with encrypted tokens

### Database Design
- **PostgreSQL** - Production-grade relational database
- **Prisma ORM** - Type-safe database queries with auto-generated types
- **Cascade deletes** - Automatic cleanup of related data
- **Unique constraints** - Prevent duplicate votes per user
- **Indexes** - Optimized queries for user profiles and posts

## 📊 Database Schema

| Model | Description |
|-------|-------------|
| **User** | GitHub authenticated users with OAuth data |
| **Account** | OAuth provider accounts (GitHub) |
| **Session** | User authentication sessions |
| **Topic** | Discussion communities with slug-based URLs |
| **Post** | User-created posts within topics |
| **Comment** | Nested comments with self-referential parent/child relationships |
| **Vote** | Upvotes/downvotes on posts and comments (unique per user) |

## 🔐 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (pooled for serverless) | Yes | `postgresql://user:pass@host/db?sslmode=require&pgbouncer=true` |
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | Yes | `Ov23li...` |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Secret | Yes | `b1002c3d...` |
| `NEXTAUTH_SECRET` | Random string for session encryption | Yes | Generated with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | App URL for auth callbacks | Yes (production) | `https://your-app.vercel.app` |

### Setting up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set **Homepage URL**: `http://localhost:3000` (or your production URL)
4. Set **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret to your `.env.local`

## 🚀 Deployment

This project is deployed on **Vercel** with **Neon PostgreSQL**.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

### Manual Deployment Steps

1. **Create Neon Database**
   - Sign up at [Neon](https://neon.tech/)
   - Create a new project
   - Copy the **pooled** connection string

2. **Deploy to Vercel**
   - Push code to GitHub
   - Import project in Vercel
   - Add environment variables (see table above)
   - Deploy

3. **Update GitHub OAuth**
   - Update callback URL to your Vercel domain
   - Redeploy if needed

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit with clear messages (`git commit -m 'Add amazing feature'`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style
- Follow existing patterns and conventions
- Use TypeScript strict mode
- Keep components small and focused
- Prefer Server Components when possible
- Use Server Actions for mutations

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built with amazing open-source tools:

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [NextAuth](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Vercel](https://vercel.com/) - Deployment platform

---

Made with ❤️ using Next.js and PostgreSQL
