export type ApiError = {
  message: string;
  status?: number;
};

export function parseApiError(err: any): ApiError {
  if (err?.response?.data?.message) {
    return {
      message: err.response.data.message,
      status: err.response.status,
    };
  }

  return {
    message: "Unexpected error occurred",
  };
}

export function isAuthError(err: any): boolean {
  return err?.response?.status === 401;
}
