import axios from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
  baseURL: process.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${process.env.VITE_API_URL}/user/refresh-token/`,
          {},
          { withCredentials: true }
        );

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    if (status === 429) {
      const message =
        error.response?.data?.message ||
        'Too many requests. Please try again later.';
    toast.warning('Too many requests.',{
        description : message
    })
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
