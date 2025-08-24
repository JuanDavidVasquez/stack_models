import { 
  Column, 
  Entity, 
  Index, 
  OneToMany,
  OneToOne,
  JoinColumn
} from "typeorm";
import { BaseUser } from "./base-user.entity";

// Imports de entidades relacionadas
import { VeterinarianProfessional } from "./veterinarian-professional.entity";
import { VeterinarianEmployee } from "./veterinarian-employee.entity";
import { VeterinarianContact } from "./veterinarian-contact.entity";
import { VeterinarianProfessionalStatistics } from "./veterinarian-professional-statistics.entity";
import { VeterinarianObservations } from "./veterinarian-observations.entity";
import { VeterinarianExperience } from "./veterinarian-exp.entity";
import { VeterinarianSpecialtyEntity } from "./veterinarian-specialty.entity";
import { VeterinarianAvailability } from "./veterinarian-availability.entity";
import { VeterinarianSkills } from "./veterinarian-skills.entity";
import { VeterinarianSpecialty } from "../enums/veterinarian.enum";

@Entity('veterinarians')
@Index(['email'], { unique: true })
@Index(['phone'], { unique: true, where: "phone IS NOT NULL" })
export class Veterinarian extends BaseUser {

  @Column({
    nullable: true,
    comment: 'Phone number'
  })
  phone?: string;

  @Column({
    nullable: true,
    comment: 'Alternative phone number'
  })
  alternativePhone?: string;

  @Column({
    type: 'enum',
    enum: VeterinarianSpecialty,
  })
  role?: VeterinarianSpecialty

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Date of birth'
  })
  dateOfBirth?: Date;

  // === RELACIONES ONE-TO-ONE ===
  @OneToOne(() => VeterinarianProfessional, professional => professional.veterinarian, { cascade: true, eager: false })
  @JoinColumn()
  professional?: VeterinarianProfessional;

  @OneToOne(() => VeterinarianSpecialtyEntity, specialty => specialty.veterinarian, { cascade: true, eager: false })
  @JoinColumn()
  specialty?: VeterinarianSpecialtyEntity;

  @OneToOne(() => VeterinarianExperience, experience => experience.veterinarian, { cascade: true, eager: false })
  @JoinColumn()
  experience?: VeterinarianExperience;

  @OneToOne(() => VeterinarianEmployee, employee => employee.veterinarian, { cascade: true, eager: false })
  @JoinColumn()
  employee?: VeterinarianEmployee;

  @OneToOne(() => VeterinarianSkills, skills => skills.veterinarian, { cascade: true, eager: false })
  @JoinColumn()
  skills?: VeterinarianSkills;

  @OneToOne(() => VeterinarianContact, contact => contact.veterinarian, { cascade: true, eager: false })
  @JoinColumn()
  contact?: VeterinarianContact;

  @OneToOne(() => VeterinarianAvailability, availability => availability.veterinarian, { cascade: true, eager: false })
  @JoinColumn()
  availability?: VeterinarianAvailability;

  @OneToOne(() => VeterinarianProfessionalStatistics, statistics => statistics.veterinarian, { cascade: true, eager: false })
  @JoinColumn()
  statistics?: VeterinarianProfessionalStatistics;

  @OneToOne(() => VeterinarianObservations, observations => observations.veterinarian, { cascade: true, eager: false })
  @JoinColumn()
  observations?: VeterinarianObservations;

  // === RELACIONES ONE-TO-MANY ===
/*   @OneToMany(() => BehaviorAssessment, assessment => assessment.veterinarian)
  behaviorAssessments?: BehaviorAssessment[]; */

  // === SOLO MÉTODOS SIMPLES DE LA ENTIDAD ===
  
  /**
   * Verifica si tiene información de contacto básica
   */
  hasBasicContactInfo(): boolean {
    return !!(this.email && this.phone);
  }

  /**
   * Verifica si es un veterinario activo
   */
  isActiveVeterinarian(): boolean {
    return this.isActive && !!this.professional?.licenseNumber;
  }
}
