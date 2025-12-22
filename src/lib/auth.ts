const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface RegisterResponse {
  session_id: string;
  is_new_user: boolean;
  message: string;
}

export interface TokenResponse {
  access_token: string;
}

export const authApi = {
  async register(mode: "mobile" | "email", value: string): Promise<RegisterResponse> {
    const body = mode === "mobile" 
      ? { mode: "mobile", mobile: value }
      : { mode: "email", email: value };

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Registration failed");
    }

    return response.json();
  },

  async verifyOtp(sessionId: string, otp: string): Promise<TokenResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId, otp }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "OTP verification failed");
    }

    return response.json();
  },

  getToken(): string | null {
    return localStorage.getItem("access_token");
  },

  setToken(token: string): void {
    localStorage.setItem("access_token", token);
  },

  removeToken(): void {
    localStorage.removeItem("access_token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
