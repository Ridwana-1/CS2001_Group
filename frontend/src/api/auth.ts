/**
 * Auth API Module
 * @author Sultan Jurabekov
 * @functionality Authentication API service that handles:
 * - User registration
 * - Login/logout operations
 * - OTP verification
 * - Password reset
 * - Session management
 * @created February 8, 2024
 */

import axios, { AxiosError } from 'axios';
import api from "./axios";

const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response?.status === 401) {
      throw new Error("Unauthorized access.");
    } else if (axiosError.response?.status === 500) {
      throw new Error("Internal server error. Please try again later.");
    } else {
      throw new Error(axiosError.response?.data?.message || "An error occurred. Please try again.");
    }
  } else {
    throw new Error("An unexpected error occurred.");
  }
};
export const registerUser = async (email: string, fullname: string, password: string) => {
  try {
    const response = await api.post('/auth/register', { email, fullname, password });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const requestOtp = async (email: string) => {
  try {
    const response = await api.post('/auth/request-otp', { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const loginWithOtp = async (email: string, otp: string) => {
  try {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const resetPassword = async (email: string, otp: string, newPassword: string) => {
  try {
    const response = await api.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const signInWithGoogle = async (token: string) => {
  try {
    console.log('Attempting to sign in with Google, token:', token);
    const response = await api.post('/auth/google-signin', { token });
    console.log('Google sign-in response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in signInWithGoogle:', error);
    handleApiError(error);
  }
};
