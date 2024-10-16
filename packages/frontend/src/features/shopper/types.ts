/**
 * This file contains the type definition for the shopper profile state.
 *
 * The type definition include the type for the shopper profile state.
 * The shopper profile state is used to store the shopper's information.
 */
export interface ShopperProfile {
  id: number;
  firstName: string;
  lastName: string;
  birthDay: string;
  address: string;
  phoneNumber: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface ShopperState {
  shopper: ShopperProfile | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateShopperProfileRequest {
  name?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string; 
}

export interface ShopperState {
  shopper: ShopperProfile | null; 
  loading: boolean; 
  error: string | null; 
}
