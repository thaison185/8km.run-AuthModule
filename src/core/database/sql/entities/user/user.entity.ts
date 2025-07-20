import { Gender } from "src/common/enums";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Club } from "../../models/club.model";
import { Record } from "../record.entity";

@Entity("users")
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ nullable: false, unique: true })
	email: string;

	@Column({ nullable: false, unique: true })
	phone: string;

	@Column({ nullable: false })
	password: string;

	@Column({ nullable: false })
	firstname: string;

	@Column({ nullable: false })
	lastname: string;

	@Column({ nullable: false })
	dob: Date;

	@Column({ nullable: false, enum: Gender, type: "enum" })
	gender: Gender;

	@Column({ nullable: true })
	is_pic: boolean;

	@Column({ nullable: true, unique: true })
	qrCode: string;

	@Column({ type: "json", nullable: true })
	clubs: Club;

	@OneToMany(() => Record, (record) => record.user)
	records: Record[];

	@Column({ nullable: false })
	createdAt: Date;
}
