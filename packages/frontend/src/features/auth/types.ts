/**
 * This file contains all the types used in the auth feature
 * 
 * All the types are exported from this file
 * 
 * @package auth
 * @subpackage types
 */
export interface UserDetails {
	id: number;
	firstName: string;
	lastName: string;
	birthDay: string;
	address: string;
	phoneNumber: string;
	profilePicture: string | null;
	pictureFormat: string | null;
	userId: number;
	createdAt: string;
	updatedAt: string;
}


export interface LoginRequest {
	email: string;
	password: string;
	rememberMe: boolean;
}
export interface RegisterResponse {
	message: string;
	ok?: boolean;
}

export interface RegisterSellerRequest {
	role: 'seller'; // Fixed role for seller
	storeName: string;
	name: string;
	phoneNumber: string;
	address?: string;
	email: string;
	password: string;
}

export interface RegisterShopperRequest {
	role: 'shopper'; // Fixed role for shopper
	firstName: string;
	lastName: string;
	phoneNumber: string;
	birthDay?: string;
	address?: string;
	email: string;
	password: string;
}
export interface UserResponse {
	token: string;
	email: string;
	role: string;
	isActive: boolean;
	userDetails: UserDetails;
	status: number;
	ok: boolean;
}

export interface User {
	id: number;
	name: string;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
	phoneNumber: string;
	address: string;
	birthDay: string;
	isActive: boolean;
}

export type AuthState = {
	user: User | null;
	token: string | null;
	error: string | null;
};

export interface LogOutResponse {
	message: string;
	ok?: boolean;
}
