/**
 * This file contains the type definition for the seller profile state.
 *
 * The types are used to define the shape of the state in the Redux store.
 */
export interface SellerProfile {
  id: number;
  storeName: string;
  name: string;
  address: string;
  phoneNumber: string;
  profilePicture?: string;
  active: boolean; // Status active dari state user
  createdAt: string;
  updatedAt: string;

}
export interface SellerState {
  profile: SellerProfile | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateSellerProfileRequest {
  name: string;
  storeName: string;
  phoneNumber: string;
  address: string;
  profilePicture?: File;
}