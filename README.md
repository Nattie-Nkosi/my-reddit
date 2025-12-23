# MyReddit

A modern Reddit-like community platform built with Next.js 16, featuring topic-based discussions, nested comments, and real-time voting with optimistic UI updates.

## Features

- **GitHub Authentication** - Secure OAuth-based login with NextAuth v5
- **Topic Creation** - Create and manage discussion topics
- **Post Management** - Create, view, and delete posts within topics
- **Nested Comments** - Multi-level threaded comment discussions
- **Voting System** - Upvote/downvote posts and comments with instant UI feedback
- **Optimistic Updates** - Smooth, responsive UI that updates before server confirmation
- **Responsive Design** - Clean, modern interface built with shadcn/ui and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth v5 with GitHub OAuth
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Language**: TypeScript
- **Validation**: Zod

## Prerequisites

- Node.js 18+ and npm
- A GitHub account
- GitHub OAuth App credentials ([create one here](https://github.com/settings/developers))

## Installation

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

   Create a `.env.local` file in the root directory:
   ```env
   GITHUB_CLIENT_ID=your_github_oauth_app_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_app_secret
   AUTH_SECRET=your_random_secret_string
   ```

   The `.env` file (already configured):
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating a Topic
1. Sign in with your GitHub account
2. Click "Create a Topic" on the homepage
3. Enter a title and description
4. Submit to create your topic

### Creating a Post
1. Navigate to any topic page
2. Click "Create a Post"
3. Write your post title and content
4. Submit to publish

### Commenting
1. Open any post
2. Write your comment in the form at the bottom
3. Reply to existing comments by clicking the "Reply" button
4. Comments support unlimited nesting levels

### Voting
- Click the up arrow to upvote (or remove your upvote)
- Click the down arrow to downvote (or remove your downvote)
- Votes update instantly with optimistic UI

## Project Structure

```
myreddit/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── dev.db                 # SQLite database
├── src/
│   ├── actions/               # Server actions (mutations)
│   ├── app/                   # Next.js app router pages
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── topics/           # Topic-related components
│   │   ├── posts/            # Post-related components
│   │   └── comments/         # Comment-related components
│   ├── lib/                  # Utility functions
│   ├── auth.ts               # NextAuth configuration
│   ├── db.ts                 # Prisma client
│   └── paths.ts              # Route path helpers
└── package.json
```

## Database Commands

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Create and apply a new migration
npx prisma migrate dev --name migration_name

# View/edit database with Prisma Studio
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Key Features Implementation

### Authentication
- Uses NextAuth v5 (beta) with GitHub OAuth provider
- Session management via Prisma adapter
- Protected routes require authentication

### Server Actions Pattern
- All mutations use Next.js Server Actions
- Form validation with Zod
- Automatic path revalidation after updates
- Type-safe error handling

### Optimistic UI Updates
- Votes update instantly before server confirmation
- Automatic rollback on error
- Smooth user experience with no loading states

### Error Handling
- Custom 404 page
- Error boundaries for runtime errors
- Global error handler for critical failures
- Detailed error messages in development mode

## Database Schema

- **User** - GitHub authenticated users
- **Topic** - Discussion categories
- **Post** - User-created posts within topics
- **Comment** - Nested comments on posts
- **Vote** - Upvotes/downvotes on posts and comments
- **NextAuth models** - Account, Session, VerificationToken

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GITHUB_CLIENT_ID` | GitHub OAuth App Client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App Secret | Yes |
| `AUTH_SECRET` | Random string for session encryption | Yes |
| `DATABASE_URL` | SQLite database file path | Yes (auto-configured) |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Authentication via [NextAuth](https://next-auth.js.org/)
- Database ORM by [Prisma](https://www.prisma.io/)
