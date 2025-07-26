import z from "zod";

export enum Gender {
	MALE = 0,
	FEMALE = 1,
	OTHER = 2
}

export const genderSchema = z.nativeEnum(Gender);
