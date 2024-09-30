export type SignupDataType = {
  fullName: string;
  email: string;
  password: string;
  code: string;
};

export type ErrorWithMessageAndStatus = {
  message: string;
  status: number;
} & Error;

export type AdminDataType = {
  _id: string;
  fullName: string;
  email: string;
};

export type LoginDataType = {
  email: string;
  password: string;
};

export type LoginErrorType =
  | "Admin not found"
  | "Invalid password"
  | "Login failed";

export type TransactionType = {
  transactionId: string;
  type: string;
  amount: number;
  status: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
};

export type UserDataType = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  balance: number;
  createdAt: string;
};

export type UserData = {
  email: string;
  fullName: string;
  transactions: TransactionType[];
  users: UserDataType[];
};
export type CustomerData = {
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  transactions: TransactionType[];
};

export type RunTransactionType = {
  id: string;
  action: "approve" | "decline";
};

export type CustomError = Error & {
  message: string;
  status: number;
};
