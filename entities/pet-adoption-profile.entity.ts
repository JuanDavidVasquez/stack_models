import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { Pet } from "./pet.entity";

export enum AdoptionStatus {
  AVAILABLE = 'available',
  PENDING = 'pending',
  ADOPTED = 'adopted',
  NOT_AVAILABLE = 'not_available',
  QUARANTINE = 'quarantine',
  MEDICAL_HOLD = 'medical_hold',
  BEHAVIORAL_HOLD = 'behavioral_hold',
  FOSTER_CARE = 'foster_care',
  RETURN_PENDING = 'return_pending'
}

export enum IntakeReason {
  STRAY = 'stray',
  SURRENDER = 'surrender',
  ABUSE_NEGLECT = 'abuse_neglect',
  OWNER_DEATH = 'owner_death',
  FINANCIAL_HARDSHIP = 'financial_hardship',
  BEHAVIORAL_ISSUES = 'behavioral_issues',
  ALLERGIES = 'allergies',
  NEW_BABY = 'new_baby',
  MOVING = 'moving',
  TOO_MANY_PETS = 'too_many_pets',
  BITE_INCIDENT = 'bite_incident',
  OTHER = 'other'
}

export enum IdealHomeType {
  ANY = 'any',
  HOUSE_WITH_YARD = 'house_with_yard',
  APARTMENT_OK = 'apartment_ok',
  FARM_RURAL = 'farm_rural',
  SENIORS_ONLY = 'seniors_only',
  ACTIVE_FAMILY = 'active_family',
  QUIET_HOME = 'quiet_home',
  EXPERIENCED_OWNER = 'experienced_owner'
}

export enum AdoptionFee {
  WAIVED = 'waived',
  REDUCED = 'reduced',
  STANDARD = 'standard',
  PREMIUM = 'premium',
  SPECIAL_NEEDS = 'special_needs'
}

@Entity('pet_adoption_profiles')
export class PetAdoptionProfile {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  petId!: string;

  // === ESTADO DE ADOPCIÓN ===
  @Column({ 
    type: 'enum', 
    enum: AdoptionStatus, 
    default: AdoptionStatus.QUARANTINE,
    comment: 'Current adoption status' 
  })
  adoptionStatus!: AdoptionStatus;

  @Column({ 
    type: 'date', 
    nullable: true, 
    comment: 'Date when pet became available for adoption' 
  })
  availableDate?: Date;

  @Column({ 
    type: 'date', 
    nullable: true, 
    comment: 'Date of adoption if adopted' 
  })
  adoptionDate?: Date;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Featured pet for promotion' 
  })
  featuredPet!: boolean;

  @Column({ 
    type: 'int', 
    default: 0, 
    comment: 'Number of days in shelter' 
  })
  daysInShelter!: number;

  // === HISTORIAL DE INGRESO ===
  @Column({ 
    type: 'date', 
    comment: 'Date when pet was brought to shelter' 
  })
  intakeDate!: Date;

  @Column({ 
    type: 'enum', 
    enum: IntakeReason, 
    comment: 'Reason for surrender/intake' 
  })
  intakeReason!: IntakeReason;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Detailed intake story or circumstances' 
  })
  intakeStory?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Information from previous owner' 
  })
  previousOwnerInfo?: string;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Has lived in a home before (not stray)' 
  })
  hasLivedInHome!: boolean;

  @Column({ 
    type: 'int', 
    nullable: true, 
    comment: 'Estimated time with previous owner in months' 
  })
  timeWithPreviousOwner?: number;

  // === TIPO DE HOGAR IDEAL ===
  @Column({ 
    type: 'enum', 
    enum: IdealHomeType, 
    default: IdealHomeType.ANY,
    comment: 'Ideal home type for this pet' 
  })
  idealHomeType!: IdealHomeType;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Suitable for apartment living' 
  })
  apartmentFriendly!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Needs a yard' 
  })
  needsYard!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Requires fenced yard' 
  })
  needsFencedYard!: boolean;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Good with children' 
  })
  goodWithKids!: boolean;

  @Column({ 
    type: 'int', 
    nullable: true, 
    comment: 'Minimum age of children recommended' 
  })
  minimumChildAge?: number;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Can live with other pets' 
  })
  canLiveWithOtherPets!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Must be only pet in home' 
  })
  mustBeOnlyPet!: boolean;

  // === REQUISITOS DEL ADOPTANTE ===
  @Column({ 
    type: 'int', 
    default: 1, 
    comment: 'Required experience level (1=beginner, 10=expert)' 
  })
  requiredExperienceLevel!: number;

  @Column({ 
    type: 'int', 
    default: 1, 
    comment: 'Minimum hours per day owner should be available' 
  })
  minimumTimeCommitment!: number;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Requires stay-at-home owner or minimal alone time' 
  })
  requiresStayAtHomeOwner!: boolean;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Special requirements for adopter' 
  })
  specialRequirements?: string[];

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Additional adoption requirements or considerations' 
  })
  adoptionRequirements?: string;

  // === COSTO DE ADOPCIÓN ===
  @Column({ 
    type: 'enum', 
    enum: AdoptionFee, 
    default: AdoptionFee.STANDARD,
    comment: 'Adoption fee category' 
  })
  adoptionFeeCategory!: AdoptionFee;

  @Column({ 
    type: 'decimal', 
    precision: 8, 
    scale: 2, 
    default: 0,
    comment: 'Adoption fee amount' 
  })
  adoptionFeeAmount!: number;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'What is included in adoption fee' 
  })
  feeIncludes?: string;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Sponsored adoption (fee paid by sponsor)' 
  })
  sponsoredAdoption!: boolean;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Sponsor information if applicable' 
  })
  sponsorInfo?: string;

  // === PROCESO DE ADOPCIÓN ===
  @Column({ 
    type: 'int', 
    default: 0, 
    comment: 'Number of applications received' 
  })
  applicationCount!: number;

  @Column({ 
    type: 'int', 
    default: 0, 
    comment: 'Number of meet and greets scheduled' 
  })
  meetAndGreetCount!: number;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Application pending approval' 
  })
  applicationPending!: boolean;

  @Column({ 
    type: 'date', 
    nullable: true, 
    comment: 'Date application was submitted' 
  })
  applicationDate?: Date;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Prospective adopter information' 
  })
  prospectiveAdopterInfo?: string;

  // === MARKETING Y PROMOCIÓN ===
  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Marketing description for adoption listings' 
  })
  marketingDescription?: string;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Keywords for search and matching' 
  })
  searchKeywords?: string[];

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Urgent adoption needed' 
  })
  urgentAdoption!: boolean;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Reason for urgent adoption' 
  })
  urgencyReason?: string;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Social media platforms where pet is promoted' 
  })
  promotionChannels?: string[];

  // === HISTORIAL DE ADOPCIÓN ===
  @Column({ 
    type: 'int', 
    default: 0, 
    comment: 'Number of times returned to shelter' 
  })
  returnCount!: number;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Reasons for previous returns' 
  })
  returnReasons?: string[];

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Notes about previous adoption attempts' 
  })
  previousAdoptionNotes?: string;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Follow-up required after adoption' 
  })
  requiresFollowUp!: boolean;

  @Column({ 
    type: 'int', 
    nullable: true, 
    comment: 'Days after adoption for follow-up' 
  })
  followUpDays?: number;

  // === NOTAS Y OBSERVACIONES ===
  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Staff notes about adoption prospects' 
  })
  staffNotes?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Volunteer observations and feedback' 
  })
  volunteerFeedback?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Special instructions for showing to potential adopters' 
  })
  showingInstructions?: string;

  // === FECHAS ===
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === RELACIÓN ===
  @OneToOne(() => Pet, pet => pet.adoptionProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet!: Pet;

  // === MÉTODOS HELPER ===

  /**
   * Calcula automáticamente los días en el refugio
   */
  updateDaysInShelter(): void {
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - this.intakeDate.getTime());
    this.daysInShelter = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Determina si es adopción de larga estancia
   */
  isLongStay(): boolean {
    return this.daysInShelter > 90; // Más de 3 meses
  }

  /**
   * Calcula la tasa de aplicaciones por día
   */
  getApplicationRate(): number {
    if (this.daysInShelter === 0) return 0;
    return Number((this.applicationCount / this.daysInShelter).toFixed(2));
  }

  /**
   * Evalúa si necesita promoción especial
   */
  needsSpecialPromotion(): boolean {
    return this.isLongStay() || 
           this.getApplicationRate() < 0.1 || 
           this.urgentAdoption ||
           this.returnCount > 0;
  }

  /**
   * Genera score de adoptabilidad basado en historial
   */
  getAdoptabilityScore(): number {
    let score = 100;

    // Penalizar por tiempo en refugio
    if (this.daysInShelter > 30) score -= 10;
    if (this.daysInShelter > 90) score -= 20;
    if (this.daysInShelter > 180) score -= 30;

    // Penalizar por devoluciones
    score -= this.returnCount * 15;

    // Penalizar por requisitos especiales
    if (this.mustBeOnlyPet) score -= 10;
    if (this.requiresStayAtHomeOwner) score -= 15;
    if (this.requiredExperienceLevel > 7) score -= 20;

    // Bonificar por características positivas
    if (this.apartmentFriendly) score += 5;
    if (this.goodWithKids) score += 5;
    if (this.canLiveWithOtherPets) score += 5;

    // Bonificar si está siendo promovido
    if (this.featuredPet) score += 10;
    if (this.sponsoredAdoption) score += 15;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Determina compatibilidad con perfil de adoptante
   */
  isCompatibleWithAdopter(adopter: {
    hasChildren: boolean;
    childrenAges: number[];
    hasOtherPets: boolean;
    housingType: 'apartment' | 'house' | 'farm';
    hasYard: boolean;
    experienceLevel: number;
    timeAvailable: number;
    budget: number;
  }): {
    compatible: boolean;
    matchScore: number;
    concerns: string[];
    recommendations: string[];
  } {
    const concerns = [];
    const recommendations = [];
    let matchScore = 100;
    let compatible = true;

    // Verificar niños
    if (adopter.hasChildren && !this.goodWithKids) {
      compatible = false;
      concerns.push('No recomendado para familias con niños');
      matchScore -= 50;
    }

    if (this.minimumChildAge && adopter.hasChildren) {
      const youngestChild = Math.min(...adopter.childrenAges);
      if (youngestChild < this.minimumChildAge) {
        compatible = false;
        concerns.push(`Requiere niños de al menos ${this.minimumChildAge} años`);
      }
    }

    // Verificar otras mascotas
    if (this.mustBeOnlyPet && adopter.hasOtherPets) {
      compatible = false;
      concerns.push('Debe ser la única mascota en el hogar');
      matchScore -= 30;
    }

    // Verificar tipo de vivienda
    if (!this.apartmentFriendly && adopter.housingType === 'apartment') {
      compatible = false;
      concerns.push('No apto para vida en apartamento');
      matchScore -= 40;
    }

    if (this.needsYard && !adopter.hasYard) {
      compatible = false;
      concerns.push('Requiere patio o jardín');
      matchScore -= 30;
    }

    // Verificar experiencia
    if (adopter.experienceLevel < this.requiredExperienceLevel) {
      if (this.requiredExperienceLevel - adopter.experienceLevel > 3) {
        compatible = false;
        concerns.push('Requiere adoptante con más experiencia');
      } else {
        recommendations.push('Recomendamos clases de entrenamiento');
        matchScore -= 10;
      }
    }

    // Verificar tiempo disponible
    if (adopter.timeAvailable < this.minimumTimeCommitment) {
      compatible = false;
      concerns.push(`Requiere al menos ${this.minimumTimeCommitment} horas diarias de atención`);
      matchScore -= 25;
    }

    // Verificar presupuesto
    if (adopter.budget < this.adoptionFeeAmount) {
      concerns.push('Costo de adopción excede presupuesto');
      if (!this.sponsoredAdoption) {
        compatible = false;
        matchScore -= 20;
      } else {
        recommendations.push('Adopción patrocinada disponible');
      }
    }

    // Bonificaciones por match perfecto
    if (adopter.housingType === 'house' && this.idealHomeType === IdealHomeType.HOUSE_WITH_YARD) {
      matchScore += 10;
    }

    if (adopter.experienceLevel > this.requiredExperienceLevel + 2) {
      matchScore += 5;
    }

    return { 
      compatible, 
      matchScore: Math.max(0, Math.min(100, matchScore)), 
      concerns, 
      recommendations 
    };
  }

  /**
   * Genera descripción optimizada para marketing
   */
  generateMarketingDescription(pet: Pet, behaviorProfile?: any): string {
    const traits = [];
    
    if (this.goodWithKids) traits.push('excelente con niños');
    if (this.canLiveWithOtherPets) traits.push('sociable con otras mascotas');
    if (this.apartmentFriendly) traits.push('perfecto para apartamentos');
    
    if (behaviorProfile?.affectionate) traits.push('muy cariñoso');
    if (behaviorProfile?.playful) traits.push('juguetón');
    if (behaviorProfile?.gentle) traits.push('gentil');

    const ageText = pet.age < 12 ? 'cachorro' : pet.age < 96 ? 'adulto' : 'senior';
    
    let description = `${pet.name} es un/a ${ageText} ${pet.type.toLowerCase()} de ${pet.breed || 'raza mixta'}`;
    
    if (traits.length > 0) {
      description += `, ${traits.join(', ')}`;
    }

    if (this.featuredPet) {
      description += '. ¡Mascota destacada de la semana!';
    }

    if (this.urgentAdoption) {
      description += ` ¡ADOPCIÓN URGENTE! ${this.urgencyReason || ''}`;
    }

    if (this.sponsoredAdoption) {
      description += ' ¡Adopción patrocinada - sin costo!';
    }

    return description;
  }

  /**
   * Calcula prioridad para mostrar en listings
   */
  getListingPriority(): number {
    let priority = 50;

    // Urgencia
    if (this.urgentAdoption) priority += 40;
    if (this.featuredPet) priority += 30;
    
    // Tiempo en refugio
    if (this.daysInShelter > 180) priority += 25;
    else if (this.daysInShelter > 90) priority += 15;
    else if (this.daysInShelter > 30) priority += 10;

    // Facilidad de adopción
    if (this.apartmentFriendly) priority += 5;
    if (this.goodWithKids) priority += 5;
    if (this.canLiveWithOtherPets) priority += 5;

    // Penalizar requisitos difíciles
    if (this.mustBeOnlyPet) priority -= 10;
    if (this.requiresStayAtHomeOwner) priority -= 15;
    if (this.requiredExperienceLevel > 7) priority -= 10;

    // Historial de devoluciones
    priority -= this.returnCount * 5;

    return Math.max(0, Math.min(100, priority));
  }

  /**
   * Verifica si necesita seguimiento post-adopción
   */
  needsPostAdoptionFollowUp(): boolean {
    return this.requiresFollowUp || 
           this.returnCount > 0 || 
           this.requiredExperienceLevel > 6 ||
           this.mustBeOnlyPet;
  }
}