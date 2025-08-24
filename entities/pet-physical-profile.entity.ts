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

export enum HealthStatus {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  CRITICAL = 'critical'
}

export enum CoatLength {
  HAIRLESS = 'hairless',
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
  VERY_LONG = 'very_long'
}

export enum CoatTexture {
  SMOOTH = 'smooth',
  ROUGH = 'rough',
  CURLY = 'curly',
  WAVY = 'wavy',
  WIRY = 'wiry',
  WOOLLY = 'woolly'
}

@Entity('pet_physical_profiles')
export class PetPhysicalProfile {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  petId!: string;

  // === MEDIDAS FÍSICAS ===
  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    comment: 'Weight in kilograms' 
  })
  weight!: number;

  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    nullable: true,
    comment: 'Height at withers in centimeters' 
  })
  height?: number;

  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    nullable: true,
    comment: 'Body length in centimeters' 
  })
  length?: number;

  // === CARACTERÍSTICAS DEL PELAJE ===
  @Column({
    comment: 'Primary coat color'
  })
  coatColor!: string;

  @Column({
    nullable: true,
    comment: 'Secondary coat color if applicable'
  })
  secondaryCoatColor?: string;

  @Column({
    nullable: true,
    comment: 'Coat pattern or markings (spots, stripes, solid, etc.)'
  })
  coatPattern?: string;

  @Column({
    type: 'enum',
    enum: CoatLength,
    nullable: true,
    comment: 'Length of the coat'
  })
  coatLength?: CoatLength;

  @Column({
    type: 'enum',
    enum: CoatTexture,
    nullable: true,
    comment: 'Texture of the coat'
  })
  coatTexture?: CoatTexture;

  // === CARACTERÍSTICAS FÍSICAS ===
  @Column({
    nullable: true,
    comment: 'Eye color'
  })
  eyeColor?: string;

  @Column({
    nullable: true,
    comment: 'Nose color'
  })
  noseColor?: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Has heterochromia (different colored eyes)'
  })
  hasHeterochromia!: boolean;

  // === ESTADO DE SALUD ===
  @Column({ 
    type: 'enum', 
    enum: HealthStatus, 
    default: HealthStatus.GOOD,
    comment: 'Overall physical condition' 
  })
  overallCondition!: HealthStatus;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Is sterilized/neutered' 
  })
  sterilized!: boolean;

  @Column({ 
    type: 'date',
    nullable: true,
    comment: 'Date of sterilization' 
  })
  sterilizationDate?: Date;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Vaccination up to date' 
  })
  vaccinationUpToDate!: boolean;

  @Column({ 
    type: 'date',
    nullable: true,
    comment: 'Date of last vaccination' 
  })
  lastVaccinationDate?: Date;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Deworming up to date' 
  })
  dewormingUpToDate!: boolean;

  @Column({ 
    type: 'date',
    nullable: true,
    comment: 'Date of last deworming' 
  })
  lastDewormingDate?: Date;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Has microchip' 
  })
  hasMicrochip!: boolean;

  @Column({ 
    nullable: true,
    comment: 'Microchip number' 
  })
  microchipNumber?: string;

  // === CONDICIONES MÉDICAS Y NOTAS ===
  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Known medical conditions or chronic illnesses' 
  })
  medicalConditions?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Current medications' 
  })
  currentMedications?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Known allergies' 
  })
  allergies?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Special physical characteristics, scars, or distinguishing marks' 
  })
  specialCharacteristics?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Additional veterinary notes' 
  })
  veterinaryNotes?: string;

  // === FECHAS ===
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === RELACIÓN ===
  @OneToOne(() => Pet, pet => pet.physicalProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet!: Pet;

  // === MÉTODOS HELPER ===
  
  /**
   * Calcula el IMC aproximado para la mascota (principalmente para perros)
   */
  calculateBMI(): number | null {
    if (!this.height || this.height === 0) {
      return null;
    }
    const heightInMeters = this.height / 100;
    return Number((this.weight / (heightInMeters * heightInMeters)).toFixed(2));
  }

  /**
   * Determina si la mascota tiene sobrepeso basado en parámetros generales
   */
  isOverweight(): boolean | null {
    // Esta es una estimación muy básica, debería ser más específica por raza
    const bmi = this.calculateBMI();
    if (!bmi) return null;
    
    return bmi > 25; // Valor aproximado, varía por especie y raza
  }

  /**
   * Retorna una descripción completa del pelaje
   */
  getCoatDescription(): string {
    const parts = [];
    
    if (this.coatLength) parts.push(this.coatLength);
    if (this.coatTexture) parts.push(this.coatTexture);
    if (this.coatColor) parts.push(this.coatColor);
    if (this.secondaryCoatColor) parts.push(`with ${this.secondaryCoatColor}`);
    if (this.coatPattern) parts.push(this.coatPattern);
    
    return parts.join(' ') || 'No description available';
  }

  /**
   * Verifica si las vacunas están vencidas (más de 1 año)
   */
  areVaccinationsExpired(): boolean | null {
    if (!this.lastVaccinationDate) return null;
    
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return this.lastVaccinationDate < oneYearAgo;
  }

  /**
   * Verifica si el desparasitado está vencido (más de 3 meses)
   */
  isDewormingExpired(): boolean | null {
    if (!this.lastDewormingDate) return null;
    
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    return this.lastDewormingDate < threeMonthsAgo;
  }
}