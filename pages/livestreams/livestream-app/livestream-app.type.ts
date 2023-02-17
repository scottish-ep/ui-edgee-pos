import { LivestreamStatusEnum } from "../../../enums/enums";

export interface IComment {
  id: number;
  comment: string;
  network_provider?: string;
  created_at: Date | number;
  updated_at: Date | number;
  user: ICommentUser;
}

export interface ICommentUser {
  id: number;
  name: string;
  phone: string;
  customer: ICommentCustomer;
}

export interface ICommentCustomer {
  id: number;
  name: string;
}

export interface ILivestreamApp {
  id: string;
  name: string;
  quantity: number;
  started_at: any;
  ended_at: any;
  status: string;
  createdAt: Date | number;
  updated_at: Date;
  updatedAt: Date | number;
}

export interface ILivestreamAppDetail {
  id: string;
  name: string;
  started_at: any;
  ended_at: any;
  status: LivestreamStatusEnum;
  createdAt: Date | number;
  updatedAt: Date | number;
  updated_at: Date | string;
  created_at: Date | number;
  items: ILivestreamProduct[];
  comments_latest: IComment[];
}

export interface ILivestreamProduct {
  id: string;
  item_id: string;
  code: string;
  name: string;
  item_category?: {
    id: number;
    name: string;
  };
  price: number;
  discount_price: number;
}
