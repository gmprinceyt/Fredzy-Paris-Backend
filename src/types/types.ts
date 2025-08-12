import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  _id: string;
  dob: Date;
  photo: string;
  gender: string;
}

export interface CreateProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
  discription: string;
  photo: string;
}

export type orderItemsType = {
  name: string;
  photo: string;
  price: number;
  quantity: number;
  productId: string;
};

export type ShippinfInfomation = {
  address: string;
  state: string;
  city: string;
  country: string;
  pincode: number;
};

export interface CreateNewOrder {
  shippingInfo: ShippinfInfomation;
  user: string;
  subtotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  total: number;
  status: string;
  orderItems: orderItemsType[];
}

// For Custom async Handler
export type controller<
  Params = Record<string, unknown>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, unknown>
> = (
  req: Request<Params, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<unknown, Record<string, unknown>>>;

export type SearchRequestQuery = {
  search?: string;
  category?: string;
  price?: string;
  sort?: string;
  page?: string;
};

export type SearchBaseQuery = {
  name?: {
    $regex: string;
    $options: string;
  };
  price?: {
    $lte: number;
  };
  category?: string;
};

export type RevailidateCacheType = {
  product?: boolean;
  admin?: boolean;
  order?: boolean;
  orderid?: string;
  userId?: string;
  productId?: string |  string[];
};

