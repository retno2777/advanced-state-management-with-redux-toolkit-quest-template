// Interface untuk User Detail yang lengkap
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
  
  // Interface untuk Login Request
  export interface LoginRequest {
	email: string;
	password: string;
	rememberMe: boolean;
  }
  
  // Interface untuk Register Response dari API
  export interface RegisterResponse {
	message: string;
	ok?: boolean;
  }
  
  // Interface untuk Register Request - Seller
  export interface RegisterSellerRequest {
	role: 'seller'; // Fixed role untuk seller
	storeName: string;
	name: string;
	phoneNumber: string;
	address?: string;
	email: string;
	password: string;
  }
  
  // Interface untuk Register Request - Shopper
  export interface RegisterShopperRequest {
	role: 'shopper'; // Fixed role untuk shopper
	firstName: string;
	lastName: string;
	phoneNumber: string;
	birthDay?: string;
	address?: string;
	email: string;
	password: string;
  }
  
  // Interface untuk User Response (termasuk login)
  export interface UserResponse {
	token: string;
	email: string;
	role: string;
	isActive: boolean;
	userDetails: UserDetails;
	status: number;
	ok: boolean;
  }
  
  // User structure yang akan disimpan di state
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
  
  // Type untuk AuthState
  export type AuthState = {
	user: User | null;
	token: string | null;
  };
  
  // Interface untuk LogOut Response
  export interface LogOutResponse {
	message: string;
	ok?: boolean;
  }
  