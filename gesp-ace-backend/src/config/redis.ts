import Redis from 'ioredis';
import { CACHE_KEYS, CACHE_TTL } from '../constants/config.js';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('connect', () => {
  console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

export default redis;

export class CacheService {
  private prefix: string;

  constructor(prefix: string = process.env.REDIS_KEY_PREFIX || 'gesp:') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(this.getKey(key));
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return data as unknown as T;
    }
  }

  async set(key: string, value: unknown, ttl?: number): Promise<void> {
    const data = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      await redis.setex(this.getKey(key), ttl, data);
    } else {
      await redis.set(this.getKey(key), data);
    }
  }

  async del(key: string): Promise<void> {
    await redis.del(this.getKey(key));
  }

  async exists(key: string): Promise<boolean> {
    return (await redis.exists(this.getKey(key))) === 1;
  }

  async ttl(key: string): Promise<number> {
    return redis.ttl(this.getKey(key));
  }

  async expire(key: string, seconds: number): Promise<void> {
    await redis.expire(this.getKey(key), seconds);
  }
}

export const cacheService = new CacheService();

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
  console.log('📴 Redis disconnected');
}

process.on('SIGINT', disconnectRedis);
process.on('SIGTERM', disconnectRedis);
