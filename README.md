This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# NFA Bears MVP

## Local Development

### Venue Setup
1. The `data/venues.json` file includes a `local-dev` venue for testing
2. Default coordinates are set to San Francisco (37.7749, -122.4194)
3. The venue has a 100m radius for testing purposes

### GPS Testing
1. In development, you can skip GPS verification by setting `DEV_SKIP_GPS=true` in your `.env`
2. To test with GPS:
   - Use Chrome DevTools Sensors panel to spoof location
   - Set coordinates within the venue's radius (see venues.json)
   - Refresh the page to apply new coordinates

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in required values:
   - `NEXT_PUBLIC_*` variables for client-side config
   - `REDIS_*` for invite storage
   - `SECRET_KEY` for HMAC signing
   - `DEV_SKIP_GPS` for development testing

### Running Locally
\`\`\`bash
npm install
npm run dev
\`\`\`

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production Deployment
[Existing deployment instructions...]
