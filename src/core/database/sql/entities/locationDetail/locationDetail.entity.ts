import { Entity, JoinColumn, ManyToOne } from "typeorm";
import { Location } from "../location";

@Entity("location_details")
export class LocationDetail {
	@ManyToOne(() => Location, (location) => location.details)
	@JoinColumn({ name: "location_id" })
	location: Location;
}
