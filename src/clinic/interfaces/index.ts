export interface ItemInterface {
  item: number;
  type: string;
  p_id: number;
}

export interface consultationPriceListInterface {
  id: number;
  itemId: number;
  price: number;
  insuranceId: number;
  clinicId: number;
  Type: string;
  private: boolean;
  type: string;
  description: string;
  consultation: string;
  name: string;
  rate: number;
}

export interface examPriceListInterface {
  id: number;
  itemId: number;
  price: number;
  insuranceId: number;
  clinicId: number;
  Type: string;
  private: boolean;
  Name: string;
  Code: string;
  description: string;
  name: string;
  rate: number;
}

export interface stockPriceListInterface {
  id: number;
  itemId: number;
  price: number;
  insuranceId: number;
  clinicId: number;
  Type: string;
  private: false;
  createdAt: Date;
  updatedAt: Date;
  expirationDate: Date;
  quantity: number;
  item: string;
  category: string;
  name: string;
  rate: number;
}
