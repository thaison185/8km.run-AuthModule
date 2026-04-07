import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("email_otp")
export class EmailOtp {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	otp_hash: string;

	@Column({ type: "timestamp" })
	expires_at: Date;

	@Column({ default: 0 })
	attempt_count: number;

	@Column({ default: false })
	used: boolean;

	@CreateDateColumn()
	created_at: Date;
}
