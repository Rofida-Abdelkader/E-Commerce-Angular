export interface Category {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
}

export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  stock: number; 
}

export interface ProductFilters {
  category?: string;
  search?: string;
  page: number;
  pageSize: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}