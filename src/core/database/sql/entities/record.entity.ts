import { Role } from "src/common/enums";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Badge } from "../models/badge.model";
import { Event } from "./event.entity";
import { User } from "./user/user.entity";

@Entity("records")
export class Record {
	@ManyToOne(() => User, (user) => user.records)
	@JoinColumn({ name: "user_id" })
	user: User;

	@ManyToOne(() => Event, (event) => event.records)
	@JoinColumn({ name: "event_id" })
	event: Event;

	@Column({ type: "int", unsigned: true })
	finishTime: number;

	@Column({ type: "enum", enum: Role, nullable: false })
	role: Role;

	@Column({ type: "json", nullable: true })
	badge: Badge[];
}
