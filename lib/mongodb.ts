import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your environment variables')
}

interface MongooseCache {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined
}

const cached: MongooseCache = globalThis.mongooseCache || {
  conn: null,
  promise: null,
}

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached
}

export default async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI as string, { bufferCommands: false })
      .then((mongooseInstance) => {
        console.log('MongoDB connected')
        return mongooseInstance
      })
      .catch((err) => {
        console.error('MongoDB connection error:', err)
        cached.promise = null // ❗ allow retry next time
        throw err
      })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (err) {
    // If the awaited promise failed
    cached.promise = null
    throw err
  }
}
