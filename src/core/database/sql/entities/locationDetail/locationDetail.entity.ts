import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Location } from "../location";

@Entity("location_details")
export class LocationDetail {
	@PrimaryColumn({ name: "location_id", type: "uuid" })
	locationId: string;

	@ManyToOne(() => Location, (location) => location.details)
	@JoinColumn({ name: "location_id" })
	location: Location;
}
