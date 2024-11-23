import {
  CustomerData,
  ErrorWithMessageAndStatus,
  LoginDataType,
  RunTransactionType,
  SignupDataType,
  UserData,
} from "@/types";
import { signIn } from "next-auth/react";

export const validateAdminCode = async (code: string) => {
  try {
    const res = await fetch("/api/admin-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    if (res.status !== 200) {
      throw new Error("Invalid code");
    }

    return res.json();
  } catch (error) {
    throw new Error("Invalid code");
  }
};
export const signUpNewAdmin = async (signupDetail: SignupDataType) => {
  try {
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupDetail),
    });

    if (res.status !== 201) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
};

export const login = async (loginDetail: LoginDataType) => {
  const { email, password } = loginDetail;
  try {
    const signedIn = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!signedIn?.ok) {
      if (signedIn?.error) {
        const error = new Error() as ErrorWithMessageAndStatus;
        error.message = signedIn.error;
        error.status = 401;
        throw error;
      } else {
        const error = new Error() as ErrorWithMessageAndStatus;
        error.message = "Login failed";
        error.status = 500;
        throw error;
      }
    }
  } catch (error) {
    throw error;
  }
};

export const fetchAdmin = async (id: string) => {
  try {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.status !== 200) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return res.json() as Promise<UserData>;
  } catch (error) {
    throw error;
  }
};
export const fetchCustomer = async (userId: string) => {
  try {
    const res = await fetch("/api/customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const errorText = await res.text();

      throw new Error(errorText);
    }

    return res.json() as Promise<CustomerData>;
  } catch (error) {
    throw error;
  }
};
export const fetchTransaction = async (id: string) => {
  try {
    const res = await fetch("/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.status !== 200) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
};

export const runTransaction = async (payload: RunTransactionType) => {
  try {
    const res = await fetch("/api/run-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.status !== 200) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
};
export const topupCustomerBal = async (data: {
  amount: number;
  userId: string;
}) => {
  try {
    const res = await fetch("/api/topup-bal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status !== 200) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
};
export const deleteCustomer = async (data: { userId: string }) => {
  try {
    const res = await fetch("/api/delete-customer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status !== 200) {
      const error = await res.json();
      throw new Error(error.message);
    }

    return res.json();
  } catch (error) {
    throw error;
  }
};

export function formatToUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

// "fastrack2224" is the admin code
