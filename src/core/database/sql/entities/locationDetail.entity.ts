import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Location } from "./location.entity";

@Entity("location_details")
export class LocationDetail {
	@PrimaryColumn('uuid')
	location_id: string

	@ManyToOne(() => Location, (location) => location.details)
	@JoinColumn({ name: "location_id" })
	location: Location;
}
