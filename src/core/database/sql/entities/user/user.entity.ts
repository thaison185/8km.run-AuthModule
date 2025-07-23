import { Gender } from "src/common/enums";
import { ID } from "src/common/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Club } from "../../models/club.model";
import { Record } from "../record";

@Entity("users")
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: ID;

	@Column({ type: "varchar", nullable: false, unique: true })
	email: string;

	@Column({ type: "varchar", nullable: false, unique: true })
	phone: string;

	@Column({ type: "varchar", nullable: false })
	password: string;

	@Column({ type: "varchar", nullable: false })
	firstname: string;

	@Column({ type: "varchar", nullable: false })
	lastname: string;

	@Column({ type: "date", nullable: false })
	dob: Date;

	@Column({ type: "enum", nullable: false, enum: Gender })
	gender: Gender;

	@Column({ type: "boolean", nullable: true })
	is_pic: boolean;

	@Column({ type: "varchar", nullable: true, unique: true }) // length
	qrCode: string;

	@Column({ type: "json", nullable: true })
	clubs: Club;

	@OneToMany(() => Record, (record) => record.user)
	records: Record[];

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: false })
	createdAt: Date;
}
