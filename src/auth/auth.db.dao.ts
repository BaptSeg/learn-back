import {v4 as uuid} from 'uuid';

import { Injectable } from "@nestjs/common";
import { Collection } from "mongodb";
import { AuthDbSchemaMapper } from "./auth.db.schema.mapper";
import { IUserWithPassword } from './auth.service';
import { MongoProvider } from 'src/mongo/mongo.provider';

export interface IUserDbSchema {
    userId: string;
    username: string;
    password: string;
}

@Injectable()
export class AuthDbDao {

    private collection!: Collection<IUserDbSchema>;

    constructor(private readonly mongoProvider: MongoProvider) {}

    public async connect(): Promise<void> {
        this.collection = await this.mongoProvider.getCollection<IUserDbSchema>("auth");
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