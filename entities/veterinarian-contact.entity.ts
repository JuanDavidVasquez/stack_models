import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { Veterinarian } from "./veterinarian.entity";

@Entity('veterinarian_contacts')
export class VeterinarianContact {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Office or clinic address'
  })
  address?: string;

  @Column({
    nullable: true,
    comment: 'Emergency contact number'
  })
  emergencyContact?: string;

  @Column({
    nullable: true,
    comment: 'Preferred communication method'
  })
  preferredCommunication?: string;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Available for emergency consultations'
  })
  emergencyAvailable!: boolean;

  @OneToOne(() => Veterinarian, veterinarian => veterinarian.contact)
  veterinarian!: Veterinarian;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === MÉTODOS SIMPLES ===

  /**
   * Verifica si tiene información de contacto completa
   */
  hasCompleteContactInfo(): boolean {
    return !!(this.address && this.emergencyContact);
  }

  /**
   * Valida formato básico del teléfono de emergencia
   */
  hasValidEmergencyContact(): boolean {
    if (!this.emergencyContact) return false;
    return this.emergencyContact.replace(/\s/g, '').length >= 10;
  }

  /**
   * Actualiza información de contacto
   */
  updateContactInfo(updates: {
    address?: string;
    emergencyContact?: string;
    preferredCommunication?: string;
    emergencyAvailable?: boolean;
  }): void {
    Object.assign(this, updates);
  }

  /**
   * Obtiene resumen de contacto
   */
  getContactSummary(): {
    hasAddress: boolean;
    hasEmergencyContact: boolean;
    isAvailableForEmergencies: boolean;
    preferredMethod: string;
  } {
    return {
      hasAddress: !!this.address,
      hasEmergencyContact: !!this.emergencyContact,
      isAvailableForEmergencies: this.emergencyAvailable,
      preferredMethod: this.preferredCommunication || 'Email'
    };
  }
}