import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum HelpRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('help_requests')
export class HelpRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requesterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requesterId' })
  requester: User;

  @Column({ nullable: true })
  helperId: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'helperId' })
  helper: User | null;

  @Column({ type: 'enum', enum: HelpRequestStatus, default: HelpRequestStatus.PENDING })
  status: HelpRequestStatus;

  @Column({ type: 'double precision' })
  requesterLatitude: number;

  @Column({ type: 'double precision' })
  requesterLongitude: number;

  @Column({ type: 'double precision', nullable: true })
  helperLatitude: number | null;

  @Column({ type: 'double precision', nullable: true })
  helperLongitude: number | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', nullable: true })
  rating: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
