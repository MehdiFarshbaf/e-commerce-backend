import UserRoleEnum from '../../../users/enums/userRoleEnum';

export interface RequestUser {
  userId: number;
  mobile: string;
  display_name: string;
  role: string;
}

export interface RequestPayload {
  mobile: string;
  sub: number;
  display_name: string;
  role: UserRoleEnum;
  iat?: number;
  exp?: number;
}
