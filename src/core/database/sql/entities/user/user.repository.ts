import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IBaseCRUD, ID } from "src/common/types";
import { FindManyOptions, FindOneOptions, FindOptionsRelations, Repository } from "typeorm";
import { User } from "./user.entity";

@Injectable()
export class UserRepository implements IBaseCRUD<User> {
	constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

	async create(user: User): Promise<User> {
		return this.repository.save(user);
	}

	save(entity: User) {
		return this.repository.save(entity);
	}

	isExist(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

	getById(id: ID, relations?: string[] | FindOptionsRelations<User>): Promise<User> {
		return this.repository.findOne({ where: { id }, relations });
	}

	getOne(options: FindOneOptions<User>) {
		return this.repository.findOne(options);
	}

	getByKey<K extends keyof User>(key: K, value: string | ID | boolean): Promise<User[]> {
		return this.repository.findBy({ [key]: value });
	}

	count(where?: any): Promise<number> {
		return this.repository.count(where);
	}

	list(
		limit: number,
		offset: number,
		options?: Omit<FindManyOptions<User>, "take" | "skip" | "order">,
		order?: any
	): Promise<User[]> {
		return this.repository.find({
			...options,
			take: limit,
			skip: offset,
			order
		});
	}

	listAll(where?: FindManyOptions<User>): Promise<User[]> {
		return this.repository.find(where);
	}

	updateById(/* id: ID, doc: Partial<Omit<User, "id" | "created">> */): Promise<User> {
		throw new Error("Method not implemented.");
	}

	deleteById(): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
