import { Db, MongoClient } from 'mongodb';

interface ConnectType {
  db: Db;
  client: MongoClient
}

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
});

export const connectDatabase = async ():Promise<ConnectType> => {
  if (!client.isConnected()) await client.connect();
  const db = client.db('challenge');

  return { db, client };
};
