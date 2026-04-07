import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user";

@Entity("sessions")
export class Session {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	userId: string;

	@Column()
	userAgent: string;

	@Column({ nullable: true })
	ip?: string;

	@Column({ nullable: true })
	device?: string;

	@Column({ nullable: true })
	country?: string;

	@Column({ type: "boolean", default: true })
	status: boolean; // true = active, false = revoked

	@Column()
	expiresAt: Date;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@ManyToOne(() => User, (user) => user.sessions, { onDelete: "CASCADE" })
	user: User;
}
