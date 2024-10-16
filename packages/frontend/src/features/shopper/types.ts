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
  active: boolean; // Status active diambil dari state auth
}

export interface ShopperState {
  shopper: ShopperProfile | null;
  loading: boolean;
  error: string | null;
}

// Interface untuk request update profile shopper
export interface UpdateShopperProfileRequest {
  name?: string;
  phoneNumber?: string;
  address?: string;
  profilePicture?: string; // Opsional, jika pengguna memperbarui gambar profil
}

// Interface untuk state Shopper dalam Redux store
export interface ShopperState {
  shopper: ShopperProfile | null; // Profil shopper, bisa null jika belum dimuat
  loading: boolean; // Status loading untuk menampilkan spinner atau loading state
  error: string | null; // Error message jika terjadi kesalahan
}
