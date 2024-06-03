import { Address } from "@/common/models/address";

export interface User {
	id: number;
	name: string;
	email: string;
	address: Address;
};

export type UserPayload = Omit<User, 'id'>;
