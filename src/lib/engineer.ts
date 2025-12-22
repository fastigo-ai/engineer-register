import { authApi } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const getAuthHeaders = () => {
  const token = authApi.getToken();
  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface ProfilePayload {
  full_name: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pin_code: string;
  skills: string[];
  dob?: string;
}

export interface StatusResponse {
  profile_status: "pending" | "completed";
  kyc_status: "pending" | "approved" | "rejected";
  bank_status: "pending" | "approved" | "rejected";
  overall_status: "verified" | "rejected" | "pending_review";
}

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
