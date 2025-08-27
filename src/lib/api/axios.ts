import axios from "axios";

export const createApiClient = (accessToken?: string) => {
  const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    timeout: 10000,
  });

  return client;
};

export const api = createApiClient();
