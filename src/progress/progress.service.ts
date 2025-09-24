import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProgressDbDao } from './progress.db.dao';

export interface ICatalogProgressLight {
    catalogId: string;
    userId: string;
    nextIndexToDraw: number;
    nextIndexToRevise: number;
    nbInProgressElement: number;
    nbMasteredElement: number;
}

export interface IProgressResult {
    nbElementMastered: number;
    nextIndexToRevise?: number;
    nextIndexToDraw?: number;
}

const MAX_NB_ELEMENT_IN_PROGRESS = 5;

@Injectable()
export class ProgressService implements OnModuleInit {

    constructor(private progressDbDao: ProgressDbDao) {}

    public async onModuleInit(): Promise<void> {
        await this.progressDbDao.connect();
    }

    public async progress(catalogId: string, userId: string, index: number, success: boolean, drawn: boolean): Promise<IProgressResult> {
        if (drawn) {
            await this.progressDbDao.addProgress(catalogId, userId, index, success);
        } else {
            await this.progressDbDao.updateProgress(catalogId, userId, index, success);
        }

        const catalogProgression = await this.progressDbDao.getCatalogProgressLight(catalogId, userId);

        if (catalogProgression.nbInProgressElement === MAX_NB_ELEMENT_IN_PROGRESS) {
            return {
                nbElementMastered: catalogProgression.nbMasteredElement,
                nextIndexToRevise: catalogProgression.nextIndexToRevise,
            }            
        } else {
            return {
                nbElementMastered: catalogProgression.nbMasteredElement,
                nextIndexToDraw: catalogProgression.nextIndexToDraw
            }  
        }
    }
}