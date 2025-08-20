import { MongoClient } from 'mongodb'

let client
let db

export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mango'
    
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    await client.connect()
    
    // Extract database name from URI or use default
    const dbName = uri.split('/').pop().split('?')[0] || 'mango'
    db = client.db(dbName)
    
    console.log('MongoDB connected successfully')
    return { client, db }
  } catch (error) {
    console.error('Database connection error:', error)
    throw error
  }
}

export { client, db }
