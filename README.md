# RougeResume - AI-Powered Resume Builder

A modern, intelligent resume builder that helps you create professional, ATS-friendly resumes with AI assistance. Built with Next.js 15, React 19, TypeScript, and Supabase.

![RougeResume](public/rougeresume-logo.png)

## ✨ Features

- **🤖 AI-Powered Suggestions**: Get intelligent recommendations for content, formatting, and keywords tailored to your industry using Google Gemini AI
- **👁️ Live Preview**: See your resume come to life in real-time as you make changes with instant visual feedback
- **📄 Professional Export**: Download high-quality PDFs ready for job applications and ATS systems using Puppeteer
- **🎨 Multiple Templates**: Choose from various professional resume templates
- **🔒 Secure Authentication**: User authentication and data protection with Supabase Auth
- **📱 Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **🌙 Dark Mode**: Built-in theme support with light and dark modes
- **💾 Auto-Save**: Your work is automatically saved as you type

## 🚀 Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Fonts**: Poppins font family

### Backend & Database

- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with SSR support
- **AI Integration**: Google Gemini AI for intelligent suggestions

### Development & Tools

- **PDF Generation**: Puppeteer for high-quality resume exports
- **Form Handling**: React Hook Form with validation
- **Date Handling**: date-fns for date manipulation
- **Development**: Hot reloading with Next.js dev server

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- A Supabase account and project
- A Google AI API key (optional, for AI features)

## 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/zhnuksyh/resume-builder.git
   cd resume-builder
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Google Gemini AI Configuration (optional)
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Set up the database**:
   Run the SQL scripts in your Supabase SQL editor:

   ```bash
   # Run these scripts in order in your Supabase SQL editor
   scripts/001_create_resume_tables.sql
   scripts/002_create_profile_trigger.sql
   ```

5. **Start the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Development Scripts

### Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run check-icons` - Check for missing icon imports
- `npm run pre-commit` - Run icon check and linting (use before commits)

### Icon Import Validation

To prevent missing icon import errors, the project includes an automated script that checks for proper Lucide React icon imports:

```bash
npm run check-icons
```

This script will:

- Scan all TypeScript/TSX files for icon usage
- Verify that all icons are properly imported from `lucide-react`
- Report any missing imports with specific file locations
- Exit with error code 1 if issues are found

**Best Practices:**

- Always import icons from `lucide-react` before using them in JSX
- Use the `check-icons` script before committing changes
- Run `npm run pre-commit` to catch both icon and linting issues

**Example of proper icon import:**

```tsx
import { User, Briefcase, GraduationCap, FileText } from "lucide-react";

// Use in JSX
<User className="h-4 w-4" />
<FileText className="h-4 w-4" />
```

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
resume-builder/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── public/                # Static assets
├── scripts/               # Database migration scripts
├── styles/                # Additional stylesheets
├── middleware.ts          # Next.js middleware
├── next.config.mjs        # Next.js configuration
└── tsconfig.json         # TypeScript configuration
```

## 🗄️ Database Schema

The application uses three main tables:

- **`profiles`**: User profile information
- **`resumes`**: Resume metadata and settings
- **`resume_sections`**: Flexible content sections (experience, education, skills, etc.)

All tables implement Row Level Security (RLS) for data protection.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Deployment Options

- **Netlify**: Works with Next.js static export
- **Railway**: Great for full-stack applications
- **Digital Ocean App Platform**: Scalable deployment option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/zhnuksyh/resume-builder/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Google AI](https://ai.google.dev/) - Powerful generative AI

## 🔮 Roadmap

- [ ] Multiple resume templates
- [ ] Cover letter generator
- [ ] LinkedIn integration
- [ ] Resume analytics and feedback
- [ ] Collaboration features
- [ ] Mobile app

---

Built with ❤️ by [zhnuksyh](https://github.com/zhnuksyh)
