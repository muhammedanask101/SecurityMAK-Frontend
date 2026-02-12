import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
}

export function getErrorMessage(error: unknown): string {
  // Axios error handling
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;

    if (data?.message) {
      return data.message;
    }

    return error.message;
  }

  // Native JS Error
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
