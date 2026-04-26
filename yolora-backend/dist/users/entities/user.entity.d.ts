export declare enum UserRole {
    DISABLED = "disabled",
    ABLE = "able"
}
export declare enum DisabilityType {
    BLIND = "blind",
    DEAF = "deaf",
    WHEELCHAIR = "wheelchair"
}
export declare class User {
    id: string;
    email: string;
    firebaseUid: string;
    role: UserRole;
    disabilityType: DisabilityType | null;
    displayName: string;
    passwordHash: string;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    fcmToken: string | null;
    isOnline: boolean;
    createdAt: Date;
    updatedAt: Date;
}
