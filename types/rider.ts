export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface Rider {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  email: string;
  phone?: string;
  gender?: Gender;
  dateOfBirth?: string;
  clubName?: string;
  feiId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  consentGiven: boolean;
  consentDate?: Date;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
}

export interface RiderWithRelations extends Rider {
  horses: any[];
  documents: any[];
  accreditations: any[];
  registrations?: any[];
}

export interface RiderFilter {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}
