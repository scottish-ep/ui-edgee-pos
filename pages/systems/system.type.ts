export enum ActionSystemLogEnum {
  CREATED = "CREATED",
  LOGIN = "LOGIN",
  DELETED = "DELETED",
}

export interface ISystemLog {
  id?: string;
  staff?: any;
  module?: string;
  action?: string;
  title?: string;
  created_at: Date | string;
  updated_at?: Date | number;
  description: any;
}
