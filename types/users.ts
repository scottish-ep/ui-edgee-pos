export interface IUser {
    id: string | number;
    isBlock: boolean;
    name: string;
    avatar?: string;
    phone?: string;
    email?: string;
    position?: string;
    gender?: number;
    isSpecialPermissions?: boolean;
    role_id?: string | number;
    birthday?: string;
    specialPermissionId?: string | number;
    groupId?: string | number;
    warehouse_ids?: Array<string | number | undefined>;
    user_role?: IUserRole;
    staff_group_id?: number;
}

export interface IUserRole {
    name: string
}
