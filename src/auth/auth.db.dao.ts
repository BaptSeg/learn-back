import {v4 as uuid} from 'uuid';

import { Injectable } from "@nestjs/common";
import { Collection, MongoClient } from "mongodb";
import { AuthDbSchemaMapper } from "./auth.db.schema.mapper";
import { IUserWithPassword } from './auth.service';

export interface IUserDbSchema {
    userId: string;
    username: string;
    password: string;
}

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

@Injectable()
export class AuthDbDao {

    private collection!: Collection<IUserDbSchema>;

    constructor() {}

    public async connect(): Promise<void> {
        await client.connect();
        const db = client.db('learn');
        this.collection = db.collection('auth');
        // await this.collection.insertOne({ userId: uuid(), username: "learn", password: "$2b$10$0GidP4BfTWZIOXt6Az1QGeKEuY9WuRqmM.jxPsHBUD6TsADIkH4xS" })
    }
    
    public async findUserByUsername(username: string): Promise<IUserWithPassword | undefined> {
        const user = await this.collection.findOne<IUserDbSchema>({ username });
        if (user) {
            return AuthDbSchemaMapper.mapUserSchemaToUser(user);
        }
        return undefined;
    }

}