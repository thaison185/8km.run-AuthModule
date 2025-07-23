import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Location } from "../location/location.entity";
import { Record } from "../record/record.entity";

@Entity("events")
export class Event {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Location, (location) => location.events)
	@JoinColumn({ name: "location_id" })
	location: Location;

	@Column({ type: "varchar", nullable: false, unique: true })
	name: string;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", nullable: false })
	date: Date;

	@OneToMany(() => Record, (record) => record.event)
	records: Record[];

	@Column({ type: "text" })
	description: string;
}
