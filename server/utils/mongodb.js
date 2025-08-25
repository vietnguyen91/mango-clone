import { MongoClient } from 'mongodb'

let client
let db

export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mango-clone'
    
    client = new MongoClient(uri)

    await client.connect()
    
    // Extract database name from URI or use default
    const dbName = uri.split('/').pop().split('?')[0] || 'mango-clone'
    console.log('Connecting to database:', dbName, 'from URI:', uri)
    db = client.db(dbName)

    console.log('MongoDB connected successfully to database:', dbName)
    return { client, db }
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

export { client, db }
