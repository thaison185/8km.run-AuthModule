import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Donation } from "./donation/donation.entity";
import { Event } from "./event.entity";
import { LocationContact } from "./locationContact.entity";
import { LocationDetail } from "./locationDetail.entity";
import { Region } from "./region.entity";

@Entity("locations")
export class Location {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@ManyToOne(() => Region, (region) => region.locations)
	@JoinColumn({ name: "region_id" })
	region: Region;

	@Column({ nullable: false, unique: true })
	name: string;

	@Column({ nullable: false })
	address: string;

	@Column({ nullable: false })
	coordinate: string;

	@Column({ type: "text" })
	description: string;

	@OneToMany(() => Event, (event) => event.location)
	events: Event[];

	@OneToMany(() => LocationDetail, (detail) => detail.location)
	details: LocationDetail[];

	@OneToMany(() => Donation, (donation) => donation.location)
	donations: Donation[];

	@Column({ type: "json", nullable: false })
	contacts: LocationContact;
}
