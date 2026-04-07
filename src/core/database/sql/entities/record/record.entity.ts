import { Role } from "src/common/enums";
import { ID } from "src/common/types";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Badge } from "../../models/badge.model";
import { Event } from "../event";
import { User } from "../user";

@Entity("records")
export class Record {
	@PrimaryColumn({ name: "user_id", type: "uuid" })
	userId: ID;

	@PrimaryColumn({ name: "event_id", type: "uuid" })
	eventId: ID;

	@ManyToOne(() => User, (user) => user.records, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	user: User;

	@ManyToOne(() => Event, (event) => event.records, { onDelete: "CASCADE" })
	@JoinColumn({ name: "event_id" })
	event: Event;

	@Column({ type: "int", unsigned: true })
	finishTime: number;

	@Column({ type: "enum", enum: Role, nullable: false })
	role: Role;

	@Column({ type: "json", nullable: true })
	badge: Badge[];
}
