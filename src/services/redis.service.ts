import Redis from "ioredis";
import env from "@/environment";
import { Log } from "@/utils/logger";

class RedisService {
  private client: Redis;

  private log(functionName: string, message = "called") {
    Log.info(`RedisService:::${functionName}:::: ${message}`);
  }

  constructor() {
    this.log("constructor", "initializing redis client");
    this.client = new Redis({
      host: env.REDIS_HOST || "localhost",
      port: Number(env.REDIS_PORT) || 6379,
      password: env.REDIS_PASSWORD || undefined,
      db: Number(env.REDIS_DB) || 0,
    });

    this.client.on("connect", () => {
      Log.info(`RedisService:::constructor:::: connected to redis`);
    });

    this.client.on("error", (err) => {
      Log.error(`RedisService:::constructor:::: redis connection error ${err}`);
    });
  }

  // ============================================================
  // STRING
  // ============================================================

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    this.log("set");
    if (ttlSeconds) {
      await this.client.set(key, value, "EX", ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    this.log("get");
    return this.client.get(key);
  }

  async setIfNotExists(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    this.log("setIfNotExists");
    const result = ttlSeconds
      ? await this.client.set(key, value, "EX", ttlSeconds, "NX")
      : await this.client.set(key, value, "NX");
    return result === "OK";
  }

  async mset(data: Record<string, string>): Promise<void> {
    this.log("mset");
    await this.client.mset(data);
  }

  async mget(keys: string[]): Promise<(string | null)[]> {
    this.log("mget");
    return this.client.mget(...keys);
  }

  // ============================================================
  // JSON (objects, arrays, any serializable data)
  // ============================================================

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    this.log("setJson");
    const stringified = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, stringified, "EX", ttlSeconds);
    } else {
      await this.client.set(key, stringified);
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    this.log("getJson");
    const data = await this.client.get(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      Log.error(`RedisService:::getJson:::: failed to parse JSON for key: ${key}`);
      return null;
    }
  }

  // ============================================================
  // NUMERIC COUNTERS
  // ============================================================

  async increment(key: string, by = 1): Promise<number> {
    this.log("increment");
    return by === 1 ? this.client.incr(key) : this.client.incrby(key, by);
  }

  async decrement(key: string, by = 1): Promise<number> {
    this.log("decrement");
    return by === 1 ? this.client.decr(key) : this.client.decrby(key, by);
  }

  // ============================================================
  // HASH (good for storing structured objects like user profiles)
  // ============================================================

  async setHashField(key: string, field: string, value: string): Promise<void> {
    this.log("setHashField");
    await this.client.hset(key, field, value);
  }

  async setHash(key: string, data: Record<string, string | number>): Promise<void> {
    this.log("setHash");
    await this.client.hset(key, data);
  }

  async getHashField(key: string, field: string): Promise<string | null> {
    this.log("getHashField");
    return this.client.hget(key, field);
  }

  async getAllHash(key: string): Promise<Record<string, string>> {
    this.log("getAllHash");
    return this.client.hgetall(key);
  }

  async deleteHashField(key: string, field: string): Promise<number> {
    this.log("deleteHashField");
    return this.client.hdel(key, field);
  }

  async hashFieldExists(key: string, field: string): Promise<boolean> {
    this.log("hashFieldExists");
    const result = await this.client.hexists(key, field);
    return result === 1;
  }

  // Store/retrieve a JSON-serializable object inside one hash field
  async setHashJson<T>(key: string, field: string, value: T): Promise<void> {
    this.log("setHashJson");
    await this.client.hset(key, field, JSON.stringify(value));
  }

  async getHashJson<T>(key: string, field: string): Promise<T | null> {
    this.log("getHashJson");
    const data = await this.client.hget(key, field);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      Log.error(`RedisService:::getHashJson:::: failed to parse JSON for key: ${key}, field: ${field}`);
      return null;
    }
  }

  // ============================================================
  // LIST (queues, recent activity feeds, ordered logs)
  // ============================================================

  async pushToList(key: string, value: string, direction: "left" | "right" = "right"): Promise<number> {
    this.log("pushToList");
    return direction === "left" ? this.client.lpush(key, value) : this.client.rpush(key, value);
  }

  async getList(key: string, start = 0, end = -1): Promise<string[]> {
    this.log("getList");
    return this.client.lrange(key, start, end);
  }

  async popFromList(key: string, direction: "left" | "right" = "right"): Promise<string | null> {
    this.log("popFromList");
    return direction === "left" ? this.client.lpop(key) : this.client.rpop(key);
  }

  async getListLength(key: string): Promise<number> {
    this.log("getListLength");
    return this.client.llen(key);
  }

  async removeFromList(key: string, value: string, count = 0): Promise<number> {
    this.log("removeFromList");
    return this.client.lrem(key, count, value);
  }

  // ============================================================
  // SET (unique collections, tags, membership checks)
  // ============================================================

  async addToSet(key: string, ...members: string[]): Promise<number> {
    this.log("addToSet");
    return this.client.sadd(key, ...members);
  }

  async getSetMembers(key: string): Promise<string[]> {
    this.log("getSetMembers");
    return this.client.smembers(key);
  }

  async removeFromSet(key: string, ...members: string[]): Promise<number> {
    this.log("removeFromSet");
    return this.client.srem(key, ...members);
  }

  async isSetMember(key: string, member: string): Promise<boolean> {
    this.log("isSetMember");
    const result = await this.client.sismember(key, member);
    return result === 1;
  }

  async getSetSize(key: string): Promise<number> {
    this.log("getSetSize");
    return this.client.scard(key);
  }

  // ============================================================
  // SORTED SET (leaderboards, rankings, time-ordered data)
  // ============================================================

  async addToSortedSet(key: string, score: number, member: string): Promise<number> {
    this.log("addToSortedSet");
    return this.client.zadd(key, score, member);
  }

  async getSortedSetRange(key: string, start = 0, end = -1, withScores = false): Promise<string[]> {
    this.log("getSortedSetRange");
    return withScores
      ? this.client.zrange(key, start, end, "WITHSCORES")
      : this.client.zrange(key, start, end);
  }

  async getSortedSetRank(key: string, member: string): Promise<number | null> {
    this.log("getSortedSetRank");
    return this.client.zrank(key, member);
  }

  async getSortedSetScore(key: string, member: string): Promise<number | null> {
    this.log("getSortedSetScore");
    const score = await this.client.zscore(key, member);
    return score !== null ? Number(score) : null;
  }

  async removeFromSortedSet(key: string, member: string): Promise<number> {
    this.log("removeFromSortedSet");
    return this.client.zrem(key, member);
  }

  async incrementSortedSetScore(key: string, member: string, by: number): Promise<number> {
    this.log("incrementSortedSetScore");
    const newScore = await this.client.zincrby(key, by, member);
    return Number(newScore);
  }

  // ============================================================
  // KEY MANAGEMENT (works across all data types)
  // ============================================================

  async delete(key: string): Promise<number> {
    this.log("delete");
    return this.client.del(key);
  }

  async deleteMany(keys: string[]): Promise<number> {
    this.log("deleteMany");
    if (keys.length === 0) return 0;
    return this.client.del(...keys);
  }

  async exists(key: string): Promise<boolean> {
    this.log("exists");
    const result = await this.client.exists(key);
    return result === 1;
  }

  async addTtl(key: string, ttlSeconds: number): Promise<boolean> {
    this.log("addTtl");
    const result = await this.client.expire(key, ttlSeconds);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    this.log("ttl");
    return this.client.ttl(key);
  }

  async getType(key: string): Promise<string> {
    this.log("getType");
    return this.client.type(key);
  }

  async getKeysByPattern(pattern: string): Promise<string[]> {
    this.log("getKeysByPattern");
    return this.client.keys(pattern);
  }

  async rename(oldKey: string, newKey: string): Promise<void> {
    this.log("rename");
    await this.client.rename(oldKey, newKey);
  }

  // ============================================================
  // UTILITY
  // ============================================================

  async ping(): Promise<string> {
    this.log("ping");
    return this.client.ping();
  }

  async flushAll(): Promise<void> {
    this.log("flushAll");
    await this.client.flushall();
  }

  getClient(): Redis {
    this.log("getClient");
    return this.client;
  }

  async disconnect(): Promise<void> {
    this.log("disconnect");
    await this.client.quit();
  }
}

export default new RedisService();