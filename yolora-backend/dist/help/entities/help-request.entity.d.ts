import { User } from '../../users/entities/user.entity';
export declare enum HelpRequestStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class HelpRequest {
    id: string;
    requesterId: string;
    requester: User;
    helperId: string | null;
    helper: User | null;
    status: HelpRequestStatus;
    requesterLatitude: number;
    requesterLongitude: number;
    helperLatitude: number | null;
    helperLongitude: number | null;
    description: string | null;
    rating: number | null;
    createdAt: Date;
    updatedAt: Date;
}
