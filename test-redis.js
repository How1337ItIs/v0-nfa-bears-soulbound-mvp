const Redis = require('ioredis');

const redis = new Redis({
  host: '127.0.0.1',
  port: 6379
});

redis.ping()
  .then(() => {
    console.log('Successfully connected to Redis');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to connect to Redis:', err);
    process.exit(1);
  }); 