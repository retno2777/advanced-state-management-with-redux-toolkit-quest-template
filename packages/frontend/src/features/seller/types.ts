export interface SellerProfile {
  id: number;
  storeName: string;
  name: string;
  address: string;
  phoneNumber: string;
  profilePicture?: string ;
  active: boolean; // Status active dari state user
  createdAt: string;
  updatedAt: string;
  
}

// State untuk Seller
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