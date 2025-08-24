import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { Veterinarian } from "./veterinarian.entity";

@Entity('veterinarian_availabilities')
export class VeterinarianAvailability {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Currently active and available for work'
  })
  isActive!: boolean;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Available for new assessments'
  })
  availableForAssessments!: boolean;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Start date of current leave/unavailability'
  })
  unavailableFrom?: Date;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Expected return date from leave'
  })
  unavailableUntil?: Date;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Reason for unavailability'
  })
  unavailabilityReason?: string;

  @OneToOne(() => Veterinarian, veterinarian => veterinarian.availability)
  veterinarian!: Veterinarian;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === MÉTODOS SIMPLES ===

  /**
   * Verifica si está disponible hoy
   */
  isAvailableToday(): boolean {
    if (!this.isActive) return false;
    
    const today = new Date();
    
    if (this.unavailableFrom && this.unavailableUntil) {
      return today < this.unavailableFrom || today > this.unavailableUntil;
    }
    
    if (this.unavailableFrom && !this.unavailableUntil) {
      return today < this.unavailableFrom;
    }
    
    return true;
  }

  /**
   * Verifica si puede hacer evaluaciones
   */
  canPerformAssessments(): boolean {
    return this.isActive && this.availableForAssessments && this.isAvailableToday();
  }

  /**
   * Calcula días hasta retorno (si está en licencia)
   */
  getDaysUntilReturn(): number | undefined {
    if (!this.unavailableUntil || this.isAvailableToday()) return undefined;
    
    const today = new Date();
    const diffTime = this.unavailableUntil.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Establece período de no disponibilidad
   */
  setUnavailable(from: Date, until?: Date, reason?: string): void {
    this.unavailableFrom = from;
    this.unavailableUntil = until;
    this.unavailabilityReason = reason;
  }

  /**
   * Marca como disponible nuevamente
   */
  setAvailable(): void {
    this.unavailableFrom = undefined;
    this.unavailableUntil = undefined;
    this.unavailabilityReason = undefined;
    this.isActive = true;
  }

  /**
   * Obtiene estado de disponibilidad
   */
  getAvailabilityStatus(): {
    isActive: boolean;
    canWork: boolean;
    canAssess: boolean;
    status: 'Available' | 'Unavailable' | 'Limited' | 'Inactive';
    reason?: string;
    daysUntilReturn?: number;
  } {
    const canWork = this.isAvailableToday();
    const canAssess = this.canPerformAssessments();
    
    let status: 'Available' | 'Unavailable' | 'Limited' | 'Inactive';
    
    if (!this.isActive) {
      status = 'Inactive';
    } else if (!canWork) {
      status = 'Unavailable';
    } else if (!this.availableForAssessments) {
      status = 'Limited';
    } else {
      status = 'Available';
    }

    return {
      isActive: this.isActive,
      canWork,
      canAssess,
      status,
      reason: this.unavailabilityReason,
      daysUntilReturn: this.getDaysUntilReturn()
    };
  }
}