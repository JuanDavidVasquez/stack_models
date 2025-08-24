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

export enum ActivityLevel {
  VERY_LOW = 'very_low',
  LOW = 'low',
  MODERATE = 'moderate',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum EnergyLevel {
  LETHARGIC = 'lethargic',
  CALM = 'calm',
  MODERATE = 'moderate',
  ENERGETIC = 'energetic',
  HYPERACTIVE = 'hyperactive'
}

export enum PlayStyle {
  GENTLE = 'gentle',
  MODERATE = 'moderate',
  ROUGH = 'rough',
  VERY_ROUGH = 'very_rough'
}

export enum ExercisePreference {
  INDOOR_ONLY = 'indoor_only',
  OUTDOOR_PREFERRED = 'outdoor_preferred',
  MIXED = 'mixed',
  WATER_ACTIVITIES = 'water_activities',
  CLIMBING = 'climbing'
}

@Entity('pet_activity_profiles')
export class PetActivityProfile {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  petId!: string;

  // === NIVEL DE ACTIVIDAD GENERAL ===
  @Column({ 
    type: 'enum', 
    enum: ActivityLevel, 
    default: ActivityLevel.MODERATE,
    comment: 'General activity level of the pet' 
  })
  activityLevel!: ActivityLevel;

  @Column({ 
    type: 'enum', 
    enum: EnergyLevel, 
    default: EnergyLevel.MODERATE,
    comment: 'Energy level throughout the day' 
  })
  energyLevel!: EnergyLevel;

  // === EJERCICIO Y ACTIVIDAD FÍSICA ===
  @Column({ 
    type: 'int', 
    default: 30,
    comment: 'Recommended exercise minutes per day' 
  })
  dailyExerciseMinutes!: number;

  @Column({ 
    type: 'int', 
    default: 0,
    comment: 'Current actual exercise minutes per day' 
  })
  currentExerciseMinutes!: number;

  @Column({ 
    type: 'enum',
    enum: ExercisePreference,
    default: ExercisePreference.MIXED,
    comment: 'Preferred exercise environment' 
  })
  exercisePreference!: ExercisePreference;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Preferred physical activities (walk, run, fetch, swim, etc.)' 
  })
  preferredActivities?: string[];

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Enjoys walking on leash' 
  })
  enjoysWalking!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Can be off-leash safely' 
  })
  canBeOffLeash!: boolean;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Good behavior on leash' 
  })
  goodOnLeash!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Enjoys swimming or water activities' 
  })
  enjoysWater!: boolean;

  // === JUEGO Y ENTRETENIMIENTO ===
  @Column({ 
    type: 'int', 
    default: 2,
    comment: 'Play sessions per day' 
  })
  playSessionsPerDay!: number;

  @Column({ 
    type: 'int', 
    default: 15,
    comment: 'Average duration of play sessions in minutes' 
  })
  playSessionDuration!: number;

  @Column({ 
    type: 'enum',
    enum: PlayStyle,
    default: PlayStyle.MODERATE,
    comment: 'Style of play the pet prefers' 
  })
  playStyle!: PlayStyle;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Favorite toys and play items' 
  })
  favoriteToys?: string[];

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Enjoys interactive play with humans' 
  })
  enjoysInteractivePlay!: boolean;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Enjoys solo play' 
  })
  enjoysSoloPlay!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Destructive when bored' 
  })
  destructiveWhenBored!: boolean;

  // === SOCIALIZACIÓN Y JUEGO CON OTROS ===
  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Plays well with other pets' 
  })
  playsWellWithOthers!: boolean;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Enjoys playing with other dogs' 
  })
  enjoysPlayWithDogs!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Plays well with cats' 
  })
  playsWithCats!: boolean;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Good with children during play' 
  })
  goodWithChildrenPlay!: boolean;

  // === ESTIMULACIÓN MENTAL ===
  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Enjoys puzzle toys and mental challenges' 
  })
  enjoysPuzzleToys!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Responds well to training games' 
  })
  enjoysTrainingGames!: boolean;

  @Column({ 
    type: 'int', 
    default: 0,
    comment: 'Minutes of mental stimulation needed daily' 
  })
  mentalStimulationMinutes!: number;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Preferred mental enrichment activities' 
  })
  mentalEnrichmentActivities?: string[];

  // === COMPORTAMIENTO DURANTE ACTIVIDADES ===
  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Gets overstimulated easily during play' 
  })
  getsOverstimulated!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Resource guards toys or play items' 
  })
  resourceGuardsToys!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Shows signs of exercise intolerance' 
  })
  exerciseIntolerance!: boolean;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Signs of fatigue or when to stop exercise' 
  })
  fatigueSignals?: string;

  // === HORARIOS Y RUTINAS ===
  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Preferred exercise times during the day' 
  })
  preferredExerciseTimes?: string[];

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'More active in the morning' 
  })
  morningActive!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'More active in the evening' 
  })
  eveningActive!: boolean;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Adapts well to routine changes' 
  })
  adaptsToRoutineChanges!: boolean;

  // === LIMITACIONES Y CONSIDERACIONES ===
  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Physical limitations or restrictions for exercise' 
  })
  physicalLimitations?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Activities to avoid' 
  })
  activitiesToAvoid?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Weather preferences or restrictions' 
  })
  weatherConsiderations?: string;

  // === NOTAS Y OBSERVACIONES ===
  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Additional activity and exercise notes' 
  })
  activityNotes?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Recommendations for new owners' 
  })
  ownerRecommendations?: string;

  // === FECHAS ===
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === RELACIÓN ===
  @OneToOne(() => Pet, pet => pet.activityProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet!: Pet;

  // === MÉTODOS HELPER ===

  /**
   * Calcula el total de minutos de actividad diaria recomendada
   */
  getTotalRecommendedActivityMinutes(): number {
    return this.dailyExerciseMinutes + 
           (this.playSessionsPerDay * this.playSessionDuration) + 
           this.mentalStimulationMinutes;
  }

  /**
   * Calcula el déficit de ejercicio actual vs recomendado
   */
  getExerciseDeficit(): number {
    return Math.max(0, this.dailyExerciseMinutes - this.currentExerciseMinutes);
  }

  /**
   * Verifica si la mascota está recibiendo suficiente actividad
   */
  isGettingAdequateActivity(): boolean {
    const deficit = this.getExerciseDeficit();
    return deficit <= 10; // Tolerancia de 10 minutos
  }

  /**
   * Calcula el porcentaje de cumplimiento del ejercicio
   */
  getExerciseCompliancePercentage(): number {
    if (this.dailyExerciseMinutes === 0) return 100;
    
    const compliance = (this.currentExerciseMinutes / this.dailyExerciseMinutes) * 100;
    return Math.min(100, Number(compliance.toFixed(1)));
  }

  /**
   * Determina si es un candidato para adopción en apartamento
   */
  isApartmentSuitable(): boolean {
    return this.activityLevel <= ActivityLevel.MODERATE && 
           this.energyLevel <= EnergyLevel.MODERATE &&
           this.exercisePreference !== ExercisePreference.OUTDOOR_PREFERRED &&
           this.dailyExerciseMinutes <= 60;
  }

  /**
   * Evalúa la compatibilidad con familias con niños basado en juego
   */
  isGoodForFamiliesWithChildren(): boolean {
    return this.goodWithChildrenPlay && 
           this.playStyle !== PlayStyle.VERY_ROUGH &&
           !this.getsOverstimulated &&
           !this.resourceGuardsToys;
  }

  /**
   * Genera recomendaciones de actividad personalizadas
   */
  getActivityRecommendations(): string[] {
    const recommendations = [];

    if (this.getExerciseDeficit() > 0) {
      recommendations.push(`Incrementar ejercicio diario en ${this.getExerciseDeficit()} minutos`);
    }

    if (this.destructiveWhenBored) {
      recommendations.push('Proporcionar más estimulación mental y juguetes interactivos');
    }

    if (this.enjoysWater && this.preferredActivities?.includes('swim')) {
      recommendations.push('Incluir actividades acuáticas en la rutina');
    }

    if (this.energyLevel === EnergyLevel.HYPERACTIVE) {
      recommendations.push('Considerar actividades de alta intensidad y entrenamiento de impulso');
    }

    if (this.mentalStimulationMinutes < 15) {
      recommendations.push('Agregar 15-30 minutos de estimulación mental diaria');
    }

    return recommendations;
  }

  /**
   * Evalúa el nivel de mantenimiento requerido
   */
  getMaintenanceLevel(): 'Low' | 'Medium' | 'High' | 'Very High' {
    const totalMinutes = this.getTotalRecommendedActivityMinutes();
    
    if (totalMinutes <= 30) return 'Low';
    if (totalMinutes <= 60) return 'Medium';
    if (totalMinutes <= 120) return 'High';
    return 'Very High';
  }

  /**
   * Verifica compatibilidad con el estilo de vida del adoptante
   */
  isCompatibleWithLifestyle(lifestyle: {
    availableTimeMinutes: number;
    hasYard: boolean;
    activeFamily: boolean;
    hasChildren: boolean;
  }): boolean {
    const requiredTime = this.getTotalRecommendedActivityMinutes();
    
    // Verificar tiempo disponible
    if (lifestyle.availableTimeMinutes < requiredTime) return false;
    
    // Si prefiere actividades al aire libre pero no hay patio
    if (this.exercisePreference === ExercisePreference.OUTDOOR_PREFERRED && !lifestyle.hasYard) {
      return false;
    }
    
    // Si hay niños pero no es bueno con ellos durante el juego
    if (lifestyle.hasChildren && !this.isGoodForFamiliesWithChildren()) {
      return false;
    }
    
    // Si es muy activo pero la familia no
    if (this.activityLevel >= ActivityLevel.HIGH && !lifestyle.activeFamily) {
      return false;
    }
    
    return true;
  }
}