export interface IJwt {
	id: string;
	session: string;
	data?: Record<string, string | number>;
	iat?: number;
	exp?: number;
}
