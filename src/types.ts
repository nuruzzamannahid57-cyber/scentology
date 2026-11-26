export type Language = 'en' | 'bn';

export interface Mood {
  id: string;
  name: string;
  nameBn: string;
  color: string;
  description: string;
  descriptionBn: string;
}

export interface Product {
  id: string;
  name: string;
  nameBn: string;
  moodId: string;
  price: number;
  sizeMl: number;
  topNotes: string;
  heartNotes: string;
  baseNotes: string;
  description: string;
  descriptionBn: string;
  featured: boolean;
  stock: number;
  badge?: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending verification' | 'Confirmed' | 'Not required';

export interface Order {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    district: string;
    area: string;
    note: string;
  };
  items: Array<{
    productId: string;
    name: string;
    moodName: string;
    price: number;
    qty: number;
    sizeMl: number;
  }>;
  subtotal: number;
  delivery: number;
  total: number;
  payment: {
    method: PaymentMethod;
    trxId: string;
    status: PaymentStatus;
  };
  status: OrderStatus;
}

export interface Settings {
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  freeShippingThreshold: number;
  whatsapp: string;
  messenger: string;
  facebook: string;
  instagram: string;
  email: string;
  phone: string;
  storeAddress: string;
  gatewayNote: string;
}
