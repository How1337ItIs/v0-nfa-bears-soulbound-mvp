import { rateLimit } from 'next-rate-limit';
 
export const limiter = rateLimit({
  window: 60 * 1000, // 1 minute
  limit: 4, // 4 requests per minute
  keyGenerator: (req) => req.headers.get('x-forwarded-for') ?? 'local'
}); 