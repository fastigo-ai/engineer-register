const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ==================== Token Management ====================
const getToken = (): string | null => localStorage.getItem("access_token");
const setToken = (token: string): void => localStorage.setItem("access_token", token);
const removeToken = (): void => localStorage.removeItem("access_token");
const isAuthenticated = (): boolean => !!getToken();

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

// ==================== Types ====================
export interface RegisterResponse {
  session_id: string;
  is_new_user: boolean;
  message: string;
}

export interface TokenResponse {
  access_token: string;
}

export interface ProfilePayload {
  full_name: string;
  dob: string;
  gender: string;
  contact_number: string;
  email: string;
  skill_category: string;
  specializations: string[];
  preferred_city: string;
  current_location: string;
  willing_to_relocate: boolean;
}

export interface BankDetailsPayload {
  bank_name: string;
  account_number: string;
  ifsc_code: string;
}

export interface StatusResponse {
  profile_status: string;
  kyc_status: string;
  bank_status: string;
  overall_status: string;
}

// ==================== Auth API ====================
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

  getToken,
  setToken,
  removeToken,
  isAuthenticated,
};

// ==================== Engineer API ====================
export const engineerApi = {
  async saveProfile(data: ProfilePayload): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/engineer/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to save profile");
    }

    return response.json();
  },

  async uploadKyc(
    aadhaarNumber: string,
    panNumber: string,
    addressProofType: string,
    addressProofFile: File,
    photoFile: File
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("aadhaar_number", aadhaarNumber);
    formData.append("pan_number", panNumber);
    formData.append("address_proof_type", addressProofType);
    formData.append("address_proof_file", addressProofFile);
    formData.append("photo_file", photoFile);

    const response = await fetch(`${API_BASE_URL}/engineer/kyc`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to upload KYC");
    }

    return response.json();
  },

  async saveBankDetails(
    bankName: string,
    accountNumber: string,
    ifscCode: string,
    proofFile: File
  ): Promise<{ message: string }> {
    const formData = new FormData();
    formData.append("bank_name", bankName);
    formData.append("account_number", accountNumber);
    formData.append("ifsc_code", ifscCode);
    formData.append("proof_file", proofFile);

    const response = await fetch(`${API_BASE_URL}/engineer/bank`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to save bank details");
    }

    return response.json();
  },

  async getStatus(): Promise<StatusResponse> {
    const response = await fetch(`${API_BASE_URL}/engineer/status`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Failed to fetch status");
    }

    return response.json();
  },
};
