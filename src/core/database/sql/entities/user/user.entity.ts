import { Gender } from "src/common/enums";
import { ID } from "src/common/types";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Club } from "../../models/club.model";
import { Record } from "../record";
import { Session } from "../session";

@Entity("users")
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: ID;

	@Column({ type: "varchar", nullable: true, unique: true })
	email: string;

	@Column({ type: "boolean", default: false, nullable: false })
	emailVerified: boolean;

	@Column({ type: "boolean", default: false, nullable: false })
	emailNotificationEnabled: boolean;

	@Column({ type: "varchar", nullable: false, unique: true })
	phone: string;

	@Column({ type: "varchar", nullable: false })
	firstname: string;

	@Column({ type: "varchar", nullable: false })
	lastname: string;

	@Column({ type: "date", nullable: true })
	dob: Date;

	@Column({ type: "enum", nullable: true, enum: Gender })
	gender: Gender;

	@Column({ type: "boolean", nullable: true })
	is_pic: boolean;

	@Column({ name: "google_id", nullable: true })
	googleId: string;

	@Column({ type: "varchar", nullable: true, unique: true }) // length
	qrCode: string;

	@Column({ type: "json", nullable: true })
	clubs: Club;

	@Column({ type: "varchar", nullable: true })
	emergencyContactName: string;

	@Column({ type: "varchar", nullable: true })
	emergencyContactPhone: string;

	@OneToMany(() => Record, (record) => record.user)
	records: Record[];

	@OneToMany(() => Session, (session) => session.user, { cascade: true })
	sessions: Session[];

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: false })
	createdAt: Date;
}
