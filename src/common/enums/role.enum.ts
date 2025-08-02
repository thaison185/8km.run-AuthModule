import z from "zod";

export enum Role {
	Organizer = 0,
	Volunteer = 1,
	Runner = 2
}

export const roleSchema = z.nativeEnum(Role);
