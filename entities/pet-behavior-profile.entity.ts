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

export enum Temperament {
  VERY_CALM = 'very_calm',
  CALM = 'calm',
  BALANCED = 'balanced',
  ENERGETIC = 'energetic',
  HYPERACTIVE = 'hyperactive',
  ANXIOUS = 'anxious',
  FEARFUL = 'fearful',
  AGGRESSIVE = 'aggressive',
  DOMINANT = 'dominant',
  SUBMISSIVE = 'submissive'
}

export enum SocializationLevel {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  UNSOCIALIZED = 'unsocialized'
}

export enum TrainingLevel {
  UNTRAINED = 'untrained',
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional'
}

export enum AggressionLevel {
  NONE = 'none',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  DANGEROUS = 'dangerous'
}

export enum AnxietyLevel {
  NONE = 'none',
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  CLINICAL = 'clinical'
}

export enum StressSignal {
  PANTING = 'panting',
  PACING = 'pacing',
  DROOLING = 'drooling',
  TREMBLING = 'trembling',
  HIDING = 'hiding',
  DESTRUCTIVE_BEHAVIOR = 'destructive_behavior',
  EXCESSIVE_VOCALIZATION = 'excessive_vocalization',
  LOSS_OF_APPETITE = 'loss_of_appetite',
  AGGRESSION = 'aggression',
  WITHDRAWAL = 'withdrawal'
}

@Entity('pet_behavior_profiles')
export class PetBehaviorProfile {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  petId!: string;

  // === TEMPERAMENTO GENERAL ===
  @Column({ 
    type: 'enum', 
    enum: Temperament, 
    default: Temperament.BALANCED,
    comment: 'General temperament of the pet' 
  })
  temperament!: Temperament;

  @Column({ 
    type: 'int',
    default: 5,
    comment: 'Confidence level from 1 (very fearful) to 10 (very confident)' 
  })
  confidenceLevel!: number;

  @Column({ 
    type: 'int',
    default: 5,
    comment: 'Adaptability level from 1 (rigid) to 10 (very adaptable)' 
  })
  adaptabilityLevel!: number;

  // === SOCIALIZACIÓN ===
  @Column({ 
    type: 'enum', 
    enum: SocializationLevel, 
    default: SocializationLevel.GOOD,
    comment: 'Overall socialization level' 
  })
  socializationLevel!: SocializationLevel;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Gets along well with children' 
  })
  goodWithChildren!: boolean;

  @Column({ 
    type: 'int',
    default: 5,
    comment: 'Comfort level with children (1-10)' 
  })
  childrenComfortLevel!: number;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Gets along well with other dogs' 
  })
  goodWithDogs!: boolean;

  @Column({ 
    type: 'int',
    default: 5,
    comment: 'Comfort level with dogs (1-10)' 
  })
  dogsComfortLevel!: number;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Gets along well with cats' 
  })
  goodWithCats!: boolean;

  @Column({ 
    type: 'int',
    default: 5,
    comment: 'Comfort level with cats (1-10)' 
  })
  catsComfortLevel!: number;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Comfortable with strangers' 
  })
  goodWithStrangers!: boolean;

  @Column({ 
    type: 'int',
    default: 5,
    comment: 'Comfort level with strangers (1-10)' 
  })
  strangersComfortLevel!: number;

  // === ENTRENAMIENTO Y OBEDIENCIA ===
  @Column({ 
    type: 'enum', 
    enum: TrainingLevel, 
    default: TrainingLevel.BASIC,
    comment: 'Current training level' 
  })
  trainingLevel!: TrainingLevel;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Knows basic commands (sit, stay, come)' 
  })
  knowsBasicCommands!: boolean;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'List of commands the pet knows' 
  })
  knownCommands?: string[];

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Responds well to positive reinforcement' 
  })
  respondsToPositiveReinforcement!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'House trained/toilet trained' 
  })
  houseTrained!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Crate trained' 
  })
  crateTrained!: boolean;

  @Column({ 
    type: 'int',
    default: 5,
    comment: 'Attention span during training (1-10)' 
  })
  attentionSpan!: number;

  // === AGRESIÓN ===
  @Column({ 
    type: 'enum', 
    enum: AggressionLevel, 
    default: AggressionLevel.NONE,
    comment: 'General aggression level' 
  })
  aggressionLevel!: AggressionLevel;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Shows food aggression' 
  })
  foodAggression!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Shows toy/resource guarding' 
  })
  resourceGuarding!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Shows territorial aggression' 
  })
  territorialAggression!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Shows fear-based aggression' 
  })
  fearBasedAggression!: boolean;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Known aggression triggers' 
  })
  aggressionTriggers?: string[];

  // === ANSIEDAD Y MIEDOS ===
  @Column({ 
    type: 'enum', 
    enum: AnxietyLevel, 
    default: AnxietyLevel.NONE,
    comment: 'General anxiety level' 
  })
  anxietyLevel!: AnxietyLevel;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Has separation anxiety' 
  })
  separationAnxiety!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Fearful of loud noises' 
  })
  noisePhobia!: boolean;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Specific fears and phobias' 
  })
  specificFears?: string[];

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Stress signals the pet displays' 
  })
  stressSignals?: StressSignal[];

  // === COMPORTAMIENTOS PROBLEMÁTICOS ===
  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Exhibits destructive behavior' 
  })
  destructiveBehavior!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Excessive barking or vocalization' 
  })
  excessiveVocalization!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Jumps on people' 
  })
  jumpsOnPeople!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Pulls strongly on leash' 
  })
  leashPulling!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Tries to escape or run away' 
  })
  escapeBehavior!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Exhibits compulsive behaviors' 
  })
  compulsiveBehaviors!: boolean;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'List of problematic behaviors' 
  })
  problematicBehaviors?: string[];

  // === COMPORTAMIENTOS POSITIVOS ===
  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Very affectionate and loving' 
  })
  affectionate!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Loyal and bonded to family' 
  })
  loyal!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Playful and fun-loving' 
  })
  playful!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Gentle and calm nature' 
  })
  gentle!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Alert and makes a good watchdog' 
  })
  alertWatchdog!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Independent and self-sufficient' 
  })
  independent!: boolean;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'List of positive behavioral traits' 
  })
  positiveTraits?: string[];

  // === EVALUACIÓN ETOLÓGICA ===
  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Professional ethologist assessment notes' 
  })
  ethologistNotes?: string;

  @Column({ 
    type: 'date', 
    nullable: true, 
    comment: 'Date of last behavioral evaluation' 
  })
  lastBehavioralEvaluation?: Date;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Recommended behavioral interventions' 
  })
  recommendedInterventions?: string;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Currently undergoing behavioral training' 
  })
  inBehavioralTraining!: boolean;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Current behavioral training program' 
  })
  currentTrainingProgram?: string;

  // === ADOPCIÓN ===
  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Ideal home environment for this pet' 
  })
  idealHomeEnvironment?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Special considerations for new owners' 
  })
  newOwnerConsiderations?: string;

  @Column({ 
    type: 'int',
    default: 1,
    comment: 'Experience level needed for owner (1=beginner, 10=expert)' 
  })
  requiredOwnerExperience!: number;

  // === FECHAS ===
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === RELACIÓN ===
  @OneToOne(() => Pet, pet => pet.behaviorProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet!: Pet;

  // === MÉTODOS HELPER ===

  /**
   * Calcula un score general de adoptabilidad (0-100)
   */
  getAdoptabilityScore(): number {
    let score = 50; // Base score

    // Factores positivos
    if (this.temperament === Temperament.BALANCED || this.temperament === Temperament.CALM) score += 15;
    if (this.goodWithChildren) score += 10;
    if (this.goodWithDogs) score += 8;
    if (this.houseTrained) score += 10;
    if (this.knowsBasicCommands) score += 8;
    if (this.aggressionLevel === AggressionLevel.NONE) score += 15;
    if (this.anxietyLevel === AnxietyLevel.NONE || this.anxietyLevel === AnxietyLevel.MILD) score += 10;

    // Factores negativos
    if (this.aggressionLevel >= AggressionLevel.MODERATE) score -= 30;
    if (this.anxietyLevel >= AnxietyLevel.SEVERE) score -= 20;
    if (this.destructiveBehavior) score -= 10;
    if (this.separationAnxiety) score -= 15;
    if (this.fearBasedAggression) score -= 20;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Determina si necesita entrenamiento especializado
   */
  needsSpecializedTraining(): boolean {
    return this.aggressionLevel >= AggressionLevel.MODERATE ||
           this.anxietyLevel >= AnxietyLevel.SEVERE ||
           this.separationAnxiety ||
           this.destructiveBehavior ||
           this.fearBasedAggression;
  }

  /**
   * Evalúa si es apto para familias con niños
   */
  isSuitableForFamiliesWithChildren(): boolean {
    return this.goodWithChildren &&
           this.childrenComfortLevel >= 6 &&
           this.aggressionLevel <= AggressionLevel.MILD &&
           !this.fearBasedAggression &&
           (this.temperament === Temperament.CALM || 
            this.temperament === Temperament.BALANCED ||
            this.temperament === Temperament.ENERGETIC);
  }

  /**
   * Evalúa si es apto para dueños primerizos
   */
  isSuitableForFirstTimeOwners(): boolean {
    return this.requiredOwnerExperience <= 4 &&
           this.aggressionLevel === AggressionLevel.NONE &&
           this.anxietyLevel <= AnxietyLevel.MILD &&
           !this.needsSpecializedTraining() &&
           this.trainingLevel >= TrainingLevel.BASIC;
  }

  /**
   * Genera lista de problemas de comportamiento activos
   */
  getActiveBehavioralIssues(): string[] {
    const issues = [];

    if (this.aggressionLevel > AggressionLevel.NONE) {
      issues.push(`Agresión nivel ${this.aggressionLevel}`);
    }
    if (this.anxietyLevel > AnxietyLevel.NONE) {
      issues.push(`Ansiedad nivel ${this.anxietyLevel}`);
    }
    if (this.separationAnxiety) issues.push('Ansiedad por separación');
    if (this.destructiveBehavior) issues.push('Comportamiento destructivo');
    if (this.excessiveVocalization) issues.push('Vocalización excesiva');
    if (this.foodAggression) issues.push('Agresión por comida');
    if (this.resourceGuarding) issues.push('Protección de recursos');
    if (this.fearBasedAggression) issues.push('Agresión por miedo');

    if (this.problematicBehaviors) {
      issues.push(...this.problematicBehaviors);
    }

    return issues;
  }

  /**
   * Genera plan de entrenamiento recomendado
   */
  getRecommendedTrainingPlan(): string[] {
    const plan = [];

    if (!this.houseTrained) {
      plan.push('Entrenamiento de control de esfínteres');
    }

    if (!this.knowsBasicCommands) {
      plan.push('Comandos básicos (sit, stay, come, down)');
    }

    if (this.leashPulling) {
      plan.push('Entrenamiento de correa');
    }

    if (this.jumpsOnPeople) {
      plan.push('Control de saltos');
    }

    if (this.separationAnxiety) {
      plan.push('Terapia de desensibilización para ansiedad por separación');
    }

    if (this.aggressionLevel > AggressionLevel.NONE) {
      plan.push('Entrenamiento especializado para manejo de agresión');
    }

    if (this.anxietyLevel >= AnxietyLevel.MODERATE) {
      plan.push('Técnicas de reducción de ansiedad y manejo del estrés');
    }

    if (this.fearBasedAggression) {
      plan.push('Contracondicionamiento y desensibilización sistemática');
    }

    return plan;
  }

  /**
   * Evalúa compatibilidad con tipo de hogar específico
   */
  isCompatibleWithHomeType(homeType: {
    hasChildren: boolean;
    hasOtherPets: boolean;
    ownerExperience: number;
    timeAvailable: number;
    apartmentLiving: boolean;
  }): {
    compatible: boolean;
    concerns: string[];
    recommendations: string[];
  } {
    const concerns = [];
    const recommendations = [];
    let compatible = true;

    // Verificar niños
    if (homeType.hasChildren && !this.isSuitableForFamiliesWithChildren()) {
      compatible = false;
      concerns.push('No recomendado para familias con niños');
    }

    // Verificar experiencia del dueño
    if (homeType.ownerExperience < this.requiredOwnerExperience) {
      compatible = false;
      concerns.push('Requiere dueño con más experiencia');
      recommendations.push('Considerar clases de entrenamiento profesional');
    }

    // Verificar tiempo disponible
    if (this.needsSpecializedTraining() && homeType.timeAvailable < 2) {
      compatible = false;
      concerns.push('Requiere más tiempo para entrenamiento especializado');
    }

    // Verificar otros pets
    if (homeType.hasOtherPets && (!this.goodWithDogs || !this.goodWithCats)) {
      concerns.push('Socialización gradual requerida con otras mascotas');
      recommendations.push('Introducción supervisada y gradual');
    }

    // Verificar vida en apartamento
    if (homeType.apartmentLiving && (this.excessiveVocalization || this.destructiveBehavior)) {
      concerns.push('Puede no ser adecuado para vida en apartamento');
      recommendations.push('Entrenamiento para reducir vocalización/destructividad');
    }

    return { compatible, concerns, recommendations };
  }

  /**
   * Verifica si necesita evaluación comportamental reciente
   */
  needsRecentBehavioralEvaluation(): boolean {
    if (!this.lastBehavioralEvaluation) return true;

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    return this.lastBehavioralEvaluation < sixMonthsAgo;
  }
}