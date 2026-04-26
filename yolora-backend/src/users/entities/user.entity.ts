import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum UserRole {
  DISABLED = 'disabled',
  ABLE = 'able',
}

export enum DisabilityType {
  BLIND = 'blind',
  DEAF = 'deaf',
  WHEELCHAIR = 'wheelchair',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  firebaseUid: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ type: 'enum', enum: DisabilityType, nullable: true })
  disabilityType: DisabilityType | null;

  @Column()
  displayName: string;

  @Column({ nullable: true })
  passwordHash: string;

  // PostGIS geometry column for location
  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: string | null;

  // Store lat/lng separately for easy access
  @Column({ type: 'double precision', nullable: true })
  latitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  longitude: number | null;

  @Column({ nullable: true })
  fcmToken: string | null;

  @Column({ default: false })
  isOnline: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
