// src/types.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  participants: boolean[];
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface OrderItem {
  id: number;
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
  participants: string[];
}
