import { Redis } from 'ioredis';

let redis: Redis;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
      console.log(`Redis retry attempt ${times}`);
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 5,
    connectTimeout: 5000,
    lazyConnect: false,
    enableOfflineQueue: true,
    showFriendlyErrorStack: true,
    enableReadyCheck: true,
    autoResendUnfulfilledCommands: true,
    reconnectOnError: (err) => {
      console.error('Redis reconnection error:', err);
      return true;
    },
    commandTimeout: 5000,
    keepAlive: 10000,
    family: 4
  });

  // Add event listeners
  redis.on('error', (err) => {
    console.error('Redis error:', err);
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
  });

  redis.on('ready', () => {
    console.log('Redis is ready');
  });

  redis.on('close', () => {
    console.log('Redis connection closed');
  });

  redis.on('reconnecting', () => {
    console.log('Redis reconnecting...');
  });

  redis.on('end', () => {
    console.log('Redis connection ended');
  });

  // Test the connection immediately
  console.log('Testing Redis connection...');
  redis.ping()
    .then(() => console.log('Redis ping successful'))
    .catch(err => console.error('Redis ping failed:', err));
} catch (error) {
  console.error('Failed to create Redis instance:', error);
  throw error;
}

export { redis }; 