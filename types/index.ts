// types/index.ts
export type Role = "SUPER_ADMIN" | "TENANT_ADMIN" | "ORGANIZER" | "JUDGE" | "RIDER";

export interface User {
  id: string;
  tenantId: string;
  role: Role;
  // add other fields as needed
}

export interface ApiResponse<T> {
  data: T;
  meta: {
    total: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

export type AccreditationStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
export type AccreditationType = "RIDER" | "OFFICIAL" | "STAFF" | "MEDIA";

export interface AccreditationWithRelations {
  id: string;
  status: AccreditationStatus;
  type: AccreditationType;
  riderId?: string;
  eventId: string;
  rider?: any;
  event?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface EquiEvent {
  id: string;
  name: string;
  slug?: string | null;
  startDate: Date;
  endDate: Date;
  venue?: string | { name: string } | null;
  status: string;
  activities?: any[];
}

export interface Horse {
  id: string;
  name: string;
  licenseNumber?: string;
  feiId?: string;
  breed?: string;
  color?: string;
  gender?: string;
  dateOfBirth?: Date;
  ownerName?: string;
  tenantId: string;
  status: "ACTIVE" | "INACTIVE" | "INELIGIBLE";
  vaccinations?: any[];
  riders?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAccreditationDto {
  riderId: string;
  eventId?: string;
  type: AccreditationType;
  accessZones?: string[];
  expiresAt?: string;
  photoUrl?: string;
  notes?: string;
}

export interface UpdateAccreditationDto {
  status?: AccreditationStatus;
  accessZones?: string[];
  notes?: string;
}

export interface CreateRegistrationDto {
  eventId: string;
  riderId: string;
  horseId: string;
  eventActivityId?: string;
  termsAccepted: boolean;
  notes?: string;
}

export interface DashboardKPIs {
  totalRiders: number;
  activeRiders: number;
  totalRegistrations: number;
  totalEvents: number;
  activeOrganizers: number;
  platformRevenue: number;
  eventRevenue: number;
  period: string;
}

export interface DashboardAlert {
  id: string;
  severity: "critical" | "warning" | "info";
  message: string;
  link?: string;
  entityType?: string;
  entityId?: string;
}

export interface EventWizardDraft {
  step: number;
  basicInfo?: {
    name?: string;
    description?: string;
    discipline?: string;
  };
  venue?: {
    venueId?: string;
  };
  activities?: any[];
  fees?: any;
}

export interface CreateEventDto {
  name: string;
  description?: string;
  discipline?: string;
  startDate: string;
  endDate: string;
  venueId: string;
  activities: any[];
  fees: any;
}

export interface SubmitScoreDto {
  scheduleSlotId: string;
  eventActivityId: string;
  criteriaScores: Record<string, number>;
  remarks?: string;
  isOfflineDraft?: boolean;
}

export interface CreateRiderDto {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  email: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth?: string;
  clubName?: string;
  feiId?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  consentGiven: boolean | string;
  consentDate?: string;
}

export interface UpdateRiderDto extends Partial<CreateRiderDto> {}

export interface CheckInWithRelations {
  id: string;
  eventId: string;
  riderId: string;
  horseId: string;
  qrToken: string;
  status: string;
  docStatus: string;
  scannedAt?: Date;
  scannedBy?: string;
  rider?: any;
  horse?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckInStats {
  total: number;
  checkedIn: number;
  noShow: number;
  scratched: number;
  docPending: number;
  awaiting: number;
}


// rider.ts types are exported here
export * from "./rider";