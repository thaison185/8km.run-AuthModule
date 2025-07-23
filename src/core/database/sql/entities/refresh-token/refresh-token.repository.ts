import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IBaseCRUD, ID } from "src/common/types";
import { FindOneOptions, FindOptionsRelations, Repository } from "typeorm";
import { RefreshToken } from './refresh-token.entity';

@Injectable()
export class RefreshTokenRepository implements IBaseCRUD<RefreshToken> {
    constructor(@InjectRepository(RefreshToken) private readonly repository: Repository<RefreshToken>) {}

    async create(refreshToken: RefreshToken): Promise<RefreshToken> {
        return this.repository.save(refreshToken);
    }

    save(entity: RefreshToken) {
        return this.repository.save(entity);
    }

    isExist(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    getById(id: ID, relations?: string[] | FindOptionsRelations<RefreshToken>): Promise<RefreshToken> {
        return this.repository.findOne({ where: { id }, relations });
    }

    getOne(options: FindOneOptions<RefreshToken>) {
        return this.repository.findOne(options);
    }

    getByKey /* < K extends keyof RefreshToken> */(/* key: K, value: string | ID | boolean */): Promise<RefreshToken[]> {
        throw new Error("Method not implemented.");
    }

    count(/* where?: any */): Promise<number> {
        throw new Error("Method not implemented.");
    }

    list(/*
        limit: number,
        offset: number,
        options?: Omit<FindManyOptions<RefreshToken>, "take" | "skip" | "order">,
        order?: any
    */): Promise<RefreshToken[]> {
        throw new Error("Method not implemented.");
    }

    listAll(/* where?: FindManyOptions<RefreshToken> */): Promise<RefreshToken[]> {
        throw new Error("Method not implemented.");
    }

    updateById(/* id: ID, doc: Partial<Omit<RefreshToken, "id" | "created">> */): Promise<RefreshToken> {
        throw new Error("Method not implemented.");
    }

    deleteById(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
