export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
}

export function userToString(user: IUser): string {
  return `${user.firstName} ${user.lastName}`;
}
