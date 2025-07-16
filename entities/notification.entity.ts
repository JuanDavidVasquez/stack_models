import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn
} from 'typeorm';

export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  WEBHOOK = 'webhook'
}

export enum NotificationStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export enum NotificationPriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

@Entity('notifications')
@Index(['status', 'type'])
@Index(['recipient'])
@Index(['userId'])
@Index(['createdAt'])
@Index(['scheduledAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    comment: 'Tipo de notificación: email, sms, push, webhook'
  })
  type!: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
    comment: 'Estado actual de la notificación'
  })
  status!: NotificationStatus;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.NORMAL,
    comment: 'Prioridad de la notificación'
  })
  priority!: NotificationPriority;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Destinatario (email, teléfono, token, etc.)'
  })
  recipient!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'ID del usuario destinatario (opcional)'
  })
  userId?: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Asunto o título de la notificación'
  })
  subject!: string;

  @Column({
    type: 'text',
    comment: 'Contenido del mensaje'
  })
  content!: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Datos adicionales para personalización'
  })
  data?: Record<string, any>;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Template utilizado para generar el contenido'
  })
  templateId?: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'es',
    comment: 'Idioma de la notificación'
  })
  language!: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Metadatos específicos del canal'
  })
  channelMetadata?: Record<string, any>;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: 'Fecha y hora programada para el envío'
  })
  scheduledAt?: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: 'Fecha y hora de envío real'
  })
  sentAt?: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: 'Fecha y hora de entrega confirmada'
  })
  deliveredAt?: Date;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Número de intentos de envío'
  })
  attempts!: number;

  @Column({
    type: 'int',
    default: 3,
    comment: 'Máximo número de intentos permitidos'
  })
  maxAttempts!: number;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Mensaje de error en caso de fallo'
  })
  errorMessage?: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Historial de intentos de envío'
  })
  attemptHistory?: Array<{
    attempt: number;
    timestamp: Date;
    status: string;
    error?: string;
    response?: any;
  }>;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'ID externo del proveedor (SendGrid, Twilio, etc.)'
  })
  externalId?: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Respuesta completa del proveedor'
  })
  providerResponse?: Record<string, any>;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Proveedor utilizado para el envío'
  })
  provider?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: true,
    comment: 'Costo del envío (si aplica)'
  })
  cost?: number;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'Moneda del costo'
  })
  currency?: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Tags para categorización y filtrado'
  })
  tags?: string[];

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Campaña o contexto de la notificación'
  })
  campaign?: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si la notificación requiere confirmación de lectura'
  })
  requiresConfirmation!: boolean;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: 'Fecha y hora de confirmación de lectura'
  })
  confirmedAt?: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    comment: 'Fecha de expiración de la notificación'
  })
  expiresAt?: Date;

  @CreateDateColumn({
    comment: 'Fecha de creación del registro'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    comment: 'Fecha de última actualización del registro'
  })
  updatedAt!: Date;

  // Métodos de utilidad
  isExpired(): boolean {
    return this.expiresAt ? new Date() > this.expiresAt : false;
  }

  canRetry(): boolean {
    return this.attempts < this.maxAttempts && 
           this.status === NotificationStatus.FAILED &&
           !this.isExpired();
  }

  addAttempt(status: string, error?: string, response?: any): void {
    this.attempts += 1;
    
    if (!this.attemptHistory) {
      this.attemptHistory = [];
    }
    
    this.attemptHistory.push({
      attempt: this.attempts,
      timestamp: new Date(),
      status,
      error,
      response
    });
  }

  markAsSent(externalId?: string, providerResponse?: any): void {
    this.status = NotificationStatus.SENT;
    this.sentAt = new Date();
    if (externalId) this.externalId = externalId;
    if (providerResponse) this.providerResponse = providerResponse;
  }

  markAsDelivered(): void {
    this.status = NotificationStatus.DELIVERED;
    this.deliveredAt = new Date();
  }

  markAsFailed(error: string): void {
    this.status = NotificationStatus.FAILED;
    this.errorMessage = error;
  }

  markAsConfirmed(): void {
    this.confirmedAt = new Date();
  }
}