import { Injectable, OnModuleInit } from "@nestjs/common";
import { Collection, Document, MongoClient } from "mongodb";

@Injectable()
export class MongoProvider implements OnModuleInit {
    private client!: MongoClient;

    public async onModuleInit(): Promise<void> {
        this.client = new MongoClient("mongodb://127.0.0.1:27017");
        await this.client.connect();
    }

    public async getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
        const db = this.client.db("learn");
        return db.collection(collectionName)
    }

}