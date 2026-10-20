import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const globalMongo = globalThis as typeof globalThis & {
    mongoClientPromise?: Promise<MongoClient>;
};

export function getMongoClientPromise() {
    if (!uri || uri.includes("username:password@cluster.example")) {
        throw new Error("MONGODB_URI is not configured with a real Atlas connection string.");
    }
    const clientPromise = globalMongo.mongoClientPromise ?? new MongoClient(uri).connect();
    if (process.env.NODE_ENV !== "production") globalMongo.mongoClientPromise = clientPromise;
    return clientPromise;
}

