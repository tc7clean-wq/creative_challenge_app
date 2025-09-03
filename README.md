# Creative Challenge App 🎨

A Next.js-based creative competition platform where artists, designers, and creators showcase their talent, compete for prizes, and build their portfolio.

## ✨ Features

- **User Authentication**: Secure Supabase Auth with email/password and Google OAuth
- **Contest Management**: Create and manage creative contests with customizable themes
- **Artwork Submissions**: Secure file uploads with validation and moderation
- **Voting System**: Community voting with AI-powered judging
- **Payment Integration**: Stripe checkout for contest entry fees
- **Real-time Updates**: Live contest status and submission tracking
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🚀 Performance Optimizations

- **Next.js Image Optimization**: Automatic WebP/AVIF conversion and lazy loading
- **Code Splitting**: Dynamic imports and optimized bundle sizes
- **Database Query Optimization**: Memoized queries and efficient data fetching
- **Caching Strategies**: Browser caching and optimized static assets
- **Font Optimization**: Preloaded fonts with display swap

## 🔒 Security Features

- **Input Validation**: Comprehensive sanitization and validation
- **Rate Limiting**: API endpoint protection against abuse
- **File Upload Security**: Type checking, size limits, and malicious file detection
- **Authentication Guards**: Protected routes with middleware
- **Security Headers**: XSS protection, CSRF prevention, and content security
- **Environment Variable Protection**: Secure credential management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Supabase
- **Storage**: Supabase Storage
- **Payments**: Stripe
- **AI Integration**: OpenAI GPT-4 Vision
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- Stripe account
- OpenAI API key (optional for AI judging)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd creative-challenge-app
npm install
```

### 2. Environment Setup

Create `.env.local` with your credentials:NEXT_PUBLIC_SUPABASE_URL=https://yrbbqxdimyqdfmezxmgp.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_DT78awsp6lKB5NBVaNnSsQ_oZ4yalA1

# OpenAI Configuration
OPENAI_API_KEY=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



```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### 3. Database Setup

Run the SQL scripts in your Supabase SQL Editor:

1. `database-schema.sql` - Core tables and relationships
2. `database-triggers.sql` - User creation triggers
3. `supabase-storage-setup.sql` - Storage bucket configuration
4. `contest-results-schema.sql` - Contest results and winner tracking

### 4. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

### Core Tables

- **profiles**: User profiles and information
- **contests**: Contest details and settings
- **submissions**: Artwork submissions with metadata
- **votes**: User voting records
- **contest_results**: Contest outcomes and winner data

### Key Relationships

- Users can submit multiple artworks to contests
- One vote per user per submission
- Contests track winners and final scores
- Submissions include AI scores and community votes

## 🔐 Security Configuration

### Environment Variables

Ensure these are set in production:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

# Optional but recommended
OPENAI_API_KEY
STRIPE_SECRET_KEY
ADMIN_SECRET_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Security Headers

The app includes comprehensive security headers:

- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin
- Permissions-Policy: restricted camera/microphone/geolocation

### Rate Limiting

- Checkout attempts: 5 per 15 minutes per user
- File uploads: 10MB max per file
- API endpoints: Built-in protection

## 📱 Performance Monitoring

### Core Web Vitals

- **LCP**: Optimized with Next.js Image and font preloading
- **FID**: Debounced interactions and optimized event handlers
- **CLS**: Stable layouts with proper image dimensions

### Bundle Analysis

```bash
npm run build
npm run analyze
```

### Performance Tips

1. Use Next.js Image component for all images
2. Implement proper loading states
3. Optimize database queries with proper indexing
4. Enable compression and caching headers

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Manual Deployment

```bash
npm run build
npm start
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Storage buckets configured
- [ ] SSL certificates enabled
- [ ] Monitoring and logging setup
- [ ] Error tracking configured (Sentry, etc.)

## 🔧 Configuration

### Next.js Config

```typescript
// next.config.ts
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    domains: ['your-supabase-domain.supabase.co'],
    formats: ['image/webp', 'image/avif'],
  },
  // Security headers configured
}
```

### Supabase Configuration

1. Enable Row Level Security (RLS)
2. Configure storage policies
3. Set up authentication providers
4. Configure CORS settings

## 🧪 Testing

### Development Testing

```bash
npm run lint          # ESLint
npm run type-check    # TypeScript
npm run build         # Build verification
```

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Contest creation and management
- [ ] File upload and validation
- [ ] Payment processing
- [ ] Voting system
- [ ] Error handling
- [ ] Mobile responsiveness

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check environment variables
   - Verify Supabase project settings
   - Check browser console for errors

2. **File Upload Issues**
   - Verify storage bucket permissions
   - Check file size and type limits
   - Ensure RLS policies are correct

3. **Database Connection Errors**
   - Verify Supabase URL and keys
   - Check database status
   - Verify table permissions

### Debug Mode

Enable detailed logging in development:

```typescript
// Add to components for debugging
console.log('Debug info:', { data, error })
```

## 📈 Monitoring & Analytics

### Recommended Tools

- **Error Tracking**: Sentry, LogRocket
- **Performance**: Vercel Analytics, Web Vitals
- **User Analytics**: Google Analytics, Mixpanel
- **Database**: Supabase Dashboard, pgAdmin

### Key Metrics

- Page load times
- API response times
- Error rates
- User engagement
- Conversion rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the troubleshooting section
- Review Supabase and Next.js documentation

## 🔄 Updates & Maintenance

### Regular Maintenance

- Update dependencies monthly
- Monitor security advisories
- Review performance metrics
- Backup database regularly

### Version Updates

- Test thoroughly in staging
- Update environment variables
- Run database migrations
- Monitor for breaking changes

---

**Built with ❤️ using Next.js and Supabase**
