import { Column } from "typeorm";

export class Club {
	@Column({ nullable: false, unique: true })
	name: string;

	@Column({ type: "text" })
	description: string;
}
