import { Injectable } from "@nestjs/common";
import { Collection } from "mongodb";
import { MongoProvider } from "src/mongo/mongo.provider";
import { ICatalogProgressLight } from "./progress.service";

export interface ICatalogProgressDbSchema {
    catalogId: string;
    userId: string;
    nextIndexToDraw: number;
    progress: IProgressDbSchema[]
    mastered: number[]; // indexes of mastered elements
}

export interface IProgressDbSchema {
    index: number; // position in catalog
    nbSuccess: number;
    lastRevisionAt: Date;
}

const NB_SUCCESS_TO_MASTER = 3;

@Injectable()
export class ProgressDbDao {
    private collection!: Collection<ICatalogProgressDbSchema>;

    constructor(private readonly mongoProvider: MongoProvider) {}

    public async connect(): Promise<void> {
        this.collection = await this.mongoProvider.getCollection<ICatalogProgressDbSchema>("progress");
    }

    public async getCatalogProgressLight(catalogId: string, userId: string): Promise<ICatalogProgressLight> {
        const result = await this.collection.aggregate<ICatalogProgressLight>([
            { $match: { catalogId, userId } },
            {
                $addFields: {
                    nextElementToRevise: { 
                        $first: {
                            $sortArray: { input: "$progress", sortBy: { lastRevisionAt: 1 } }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    catalogId: 1,
                    userId: 1,
                    nextIndexToDraw: 1,
                    nextIndexToRevise: "$nextElementToRevise.index",
                    nbInProgressElement: { $size: { $ifNull: ["$progress", []] } },
                    nbMasteredElement: { $size: { $ifNull: ["$mastered", []] } }
                }
            }
        ]).toArray();

        if (!result.length) {
            throw new Error(`Catalog progression not found for catalogId ${catalogId} and userId ${userId}`);
        }

        return result[0];
    }

    public async addProgress(catalogId: string, userId: string, index: number, success: boolean): Promise<void> {
        const now = new Date();

        // prevent add progress already exists
        const progress = await this.collection.findOne(
            { catalogId, userId, "progress.index": index },
            { projection: { progress: { $elemMatch: { index } } } }
        )

        if (progress) {
            throw new Error(`Progression already exists for ${catalogId} of user ${userId} with index ${index}`);
        }

        await this.collection.updateOne(
            { catalogId, userId },
            {
                $setOnInsert: {
                    catalogId,
                    userId,
                },
                $inc: { nextIndexToDraw: 1 },
                $push: { progress: { index, nbSuccess: success ? 1 : 0, lastRevisionAt: now } }
            },
            { upsert: true }
        )
    }

    public async updateProgress(catalogId: string, userId: string, index: number, success: boolean): Promise<void> {
        const now = new Date();

        if (success) {
            const doc = await this.collection.findOne(
                { catalogId, userId, "progress.index": index },
                { projection: { progress: { $elemMatch: { index } } } }
            );

            if (!doc || !doc.progress?.length) {
                throw new Error(`Progression not found for catalogId ${catalogId} of user ${userId} with index ${index}`);
            }

            if (doc.progress[0].nbSuccess + 1 === NB_SUCCESS_TO_MASTER) {
                await this.collection.updateOne(
                    { catalogId, userId },
                    { 
                        $pull: { progress: { index }},
                        $addToSet: { mastered: index }
                    }
                )
            } else {
                await this.collection.updateOne(
                    { catalogId, userId, "progress.index": index },
                    {
                        $inc: { "progress.$.nbSuccess": success ? 1 : 0 },
                        $set: { "progress.$.lastRevisionAt": now }
                    }
                )
            }
        } else {
            await this.collection.updateOne(
                { catalogId, userId, "progress.index": index },
                {
                    $set: { "progress.$.lastRevisionAt": now }
                }
            )
        }
    }
        
}