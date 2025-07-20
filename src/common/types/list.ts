export type IPagination = {
	limit: number;
	page: number;
};

export type IOrder = {
	sortDirection: "ASC" | "DESC";
	sortField: string;
};

export type IPaginatedList<T> = {
	count: number;
	rows: T[];
};
