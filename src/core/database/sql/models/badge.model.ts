import { Column } from "typeorm";

export class Badge {
	@Column({ nullable: false, unique: true })
	name: string;

	@Column({ type: "text" })
	description: string;
}
