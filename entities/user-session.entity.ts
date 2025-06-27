import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('user_sessions')
@Index(['userId', 'isActive'])
@Index(['sourceTable', 'userId', 'isActive'])
@Index(['sourceTable', 'isActive'])
@Index(['userEmail', 'isActive'])
@Index(['expiresAt'])
@Index(['deviceId'])
export class UserSession {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'session_id', unique: true })
    sessionId!: string;

    @Column({ name: 'user_id' })
    userId!: string;

    @Column({ name: 'source_table', type: 'varchar', length: 64 })
    sourceTable!: string;

    @Column({ name: 'user_email', type: 'varchar', length: 255 })
    userEmail!: string;

    @Column({ name: 'user_role', type: 'varchar', length: 50 })
    userRole!: string;

    @Column({ name: 'refresh_token', type: 'varchar', length: 512, unique: true })
    refreshToken!: string;

    @Column({ name: 'device_id', nullable: true })
    deviceId?: string;

    @Column({ name: 'device_name', nullable: true })
    deviceName?: string;

    @Column({ name: 'device_type', nullable: true })
    deviceType?: string; // 'desktop', 'mobile', 'tablet'

    @Column({ name: 'browser', nullable: true })
    browser?: string;

    @Column({ name: 'browser_version', nullable: true })
    browserVersion?: string;

    @Column({ name: 'os', nullable: true })
    os?: string;

    @Column({ name: 'os_version', nullable: true })
    osVersion?: string;

    @Column({ name: 'ip_address', nullable: true })
    ipAddress?: string;

    @Column({ name: 'location', nullable: true })
    location?: string; // Ciudad, País

    @Column({ name: 'is_active', default: true })
    isActive!: boolean;

    @Column({ name: 'last_activity', type: 'datetime', nullable: true })
    lastActivity?: Date;

    @Column({ name: 'expires_at', type: 'datetime' })
    expiresAt!: Date;

    @Column({ name: 'revoked_at', type: 'datetime', nullable: true })
    revokedAt?: Date;

    @Column({ name: 'revoked_reason', nullable: true })
    revokedReason?: string; // 'logout', 'expired', 'suspicious_activity', 'user_request'

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}