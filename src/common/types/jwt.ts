export interface IJwt {
	id: number;
	session: number;
	iat?: number;
	exp?: number;
}
