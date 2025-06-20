// Helper function to get auth headers for client-side requests
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
});

export interface Patient {
  name: string;
  age: number;
  mobile_number: string;
}

export interface Doctor {
  name: string;
  degree: string;
  registration_number: string;
  signature_image: string;
}

export interface Medication {
  name: string;
  dosage_instruction: {
    en: string;
    hi: string;
  };
  timing: {
    morning: string | null;
    afternoon: string | null;
    night: string | null;
  };
}

export interface PrescriptionDetail {
  prescription_id: string;
  order_number: string;
  order_date: string;
  patient: Patient;
  doctor: Doctor;
  medications: Medication[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PrescriptionListItem {
  _id: string;
  order_number: string;
  order_date: string;
  createdAt: string;
}

export interface PrescriptionListResponse {
  success: boolean;
  count: number;
  data: PrescriptionListItem[];
}

export interface PrescriptionDetailResponse {
  success: boolean;
  data: PrescriptionDetail;
}

export class PrescriptionService {
  /**
   * Fetch list of prescriptions for the authenticated user
   */
  static async getPrescriptionList(): Promise<PrescriptionListResponse> {
    try {
      console.log('Fetching prescriptions from Next.js API');
      
      const response = await fetch('/api/prescriptions', {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Prescription API error response:', errorText);
        throw new Error(`Failed to fetch prescriptions: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Prescription API response:', data);
      return data;
    } catch (error) {
      console.error('PrescriptionService.getPrescriptionList error:', error);
      
      // Return empty list on error to prevent app crash
      return {
        success: true,
        count: 0,
        data: []
      };
    }
  }

  /**
   * Fetch detailed prescription by ID
   */
  static async getPrescriptionDetail(prescriptionId: string): Promise<PrescriptionDetailResponse> {
    try {
      console.log('Fetching prescription detail for:', prescriptionId);
      
      const response = await fetch(`/api/prescriptions/${prescriptionId}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Prescription detail API error response:', errorText);
        throw new Error(`Failed to fetch prescription detail: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Prescription detail API response:', data);
      return data;
    } catch (error) {
      console.error('PrescriptionService.getPrescriptionDetail error:', error);
      throw error;
    }
  }
} 