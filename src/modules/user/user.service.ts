import { Injectable } from "@nestjs/common";
import { ID } from "src/common/types";
import { UserRepository } from "src/core/database/sql/entities/user";
import { CreateUserDto } from "./dtos/create.dto";

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	public async createUser(userId: ID, data: CreateUserDto) /*: Promise<User> */ {
		return this.userRepository.create({
			id: userId,
			email: data.email,
			phone: data.phone,
			firstname: data.firstname,
			lastname: data.lastname,
			dob: data.dob ? new Date(data.dob) : null,
			gender: data.gender ?? null,
			is_pic: data.is_pic ?? false,
			qrCode: data.qrCode ?? null,
			createdAt: new Date(),
			clubs: {
				name: "Default Club",
				description: "Default club for new users"
			},
			records: []

			// Add other required User properties here, using data or default values as needed
		});
	}
}
