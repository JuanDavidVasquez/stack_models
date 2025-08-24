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

export enum DietType {
  COMMERCIAL_DRY = 'commercial_dry',
  COMMERCIAL_WET = 'commercial_wet',
  COMMERCIAL_MIXED = 'commercial_mixed',
  HOMEMADE = 'homemade',
  RAW_BARF = 'raw_barf',
  PRESCRIPTION = 'prescription',
  MIXED = 'mixed',
  SPECIAL_DIET = 'special_diet'
}

export enum FeedingFrequency {
  ONCE_DAILY = 'once_daily',
  TWICE_DAILY = 'twice_daily',
  THREE_TIMES_DAILY = 'three_times_daily',
  FOUR_TIMES_DAILY = 'four_times_daily',
  FREE_FEEDING = 'free_feeding',
  MULTIPLE_SMALL_MEALS = 'multiple_small_meals'
}

export enum AppetiteLevel {
  POOR = 'poor',
  FAIR = 'fair',
  GOOD = 'good',
  EXCELLENT = 'excellent',
  EXCESSIVE = 'excessive'
}

@Entity('pet_nutrition_profiles')
export class PetNutritionProfile {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  petId!: string;

  // === TIPO DE DIETA ===
  @Column({ 
    type: 'enum', 
    enum: DietType, 
    default: DietType.COMMERCIAL_DRY,
    comment: 'Type of diet the pet follows' 
  })
  dietType!: DietType;

  @Column({
    nullable: true,
    comment: 'Primary food brand or type'
  })
  primaryFoodBrand?: string;

  @Column({
    nullable: true,
    comment: 'Secondary food brand if mixed feeding'
  })
  secondaryFoodBrand?: string;

  // === CANTIDAD Y FRECUENCIA ===
  @Column({ 
    type: 'decimal', 
    precision: 6, 
    scale: 2, 
    comment: 'Daily food amount in grams' 
  })
  dailyAmountGrams!: number;

  @Column({ 
    type: 'enum',
    enum: FeedingFrequency,
    default: FeedingFrequency.TWICE_DAILY,
    comment: 'How often the pet is fed per day' 
  })
  feedingFrequency!: FeedingFrequency;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Specific feeding times (e.g., ["08:00", "18:00"])' 
  })
  feedingTimes?: string[];

  @Column({ 
    type: 'decimal', 
    precision: 4, 
    scale: 2, 
    nullable: true,
    comment: 'Amount per meal in grams (calculated from daily amount)' 
  })
  amountPerMeal?: number;

  // === APETITO Y COMPORTAMIENTO ALIMENTARIO ===
  @Column({ 
    type: 'enum',
    enum: AppetiteLevel,
    default: AppetiteLevel.GOOD,
    comment: 'Pet\'s appetite level' 
  })
  appetiteLevel!: AppetiteLevel;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Eats food quickly/gulps' 
  })
  eatsQuickly!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Is a picky eater' 
  })
  isPickyEater!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Guards food aggressively' 
  })
  foodGuarding!: boolean;

  // === RESTRICCIONES Y ALERGIAS ===
  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Known food allergies or intolerances' 
  })
  foodAllergies?: string;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'List of foods that must be avoided' 
  })
  foodsToAvoid?: string[];

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Requires special dietary management' 
  })
  requiresSpecialDiet!: boolean;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Details about special dietary requirements' 
  })
  specialDietDetails?: string;

  // === TREATS Y SUPLEMENTOS ===
  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Preferred treats and snacks' 
  })
  preferredTreats?: string[];

  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    nullable: true,
    comment: 'Daily treat allowance in grams' 
  })
  dailyTreatAllowance?: number;

  @Column({ 
    type: 'json', 
    nullable: true, 
    comment: 'Current supplements being given' 
  })
  supplements?: string[];

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Details about supplement dosage and frequency' 
  })
  supplementDetails?: string;

  // === HIDRATACIÓN ===
  @Column({ 
    type: 'decimal', 
    precision: 5, 
    scale: 2, 
    nullable: true,
    comment: 'Estimated daily water intake in ml' 
  })
  dailyWaterIntake?: number;

  @Column({ 
    type: 'boolean', 
    default: true, 
    comment: 'Drinks adequate amount of water' 
  })
  adequateWaterIntake!: boolean;

  @Column({ 
    type: 'boolean', 
    default: false, 
    comment: 'Prefers wet food over dry' 
  })
  prefersWetFood!: boolean;

  // === HISTORIAL Y NOTAS ===
  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Previous diet history or changes' 
  })
  dietHistory?: string;

  @Column({ 
    type: 'date', 
    nullable: true, 
    comment: 'Date of last diet change' 
  })
  lastDietChange?: Date;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Additional nutrition notes from veterinarian' 
  })
  nutritionNotes?: string;

  @Column({ 
    type: 'text', 
    nullable: true, 
    comment: 'Feeding instructions for caregivers' 
  })
  feedingInstructions?: string;

  // === FECHAS ===
  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === RELACIÓN ===
  @OneToOne(() => Pet, pet => pet.nutritionProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'petId' })
  pet!: Pet;

  // === MÉTODOS HELPER ===

  /**
   * Calcula la cantidad de comida por porción basada en la frecuencia
   */
  calculateAmountPerMeal(): number {
    const mealsPerDay = this.getMealsPerDay();
    if (mealsPerDay === 0) return this.dailyAmountGrams;
    
    return Number((this.dailyAmountGrams / mealsPerDay).toFixed(2));
  }

  /**
   * Obtiene el número de comidas por día basado en la frecuencia
   */
  getMealsPerDay(): number {
    switch (this.feedingFrequency) {
      case FeedingFrequency.ONCE_DAILY:
        return 1;
      case FeedingFrequency.TWICE_DAILY:
        return 2;
      case FeedingFrequency.THREE_TIMES_DAILY:
        return 3;
      case FeedingFrequency.FOUR_TIMES_DAILY:
        return 4;
      case FeedingFrequency.FREE_FEEDING:
        return 0; // No aplica
      case FeedingFrequency.MULTIPLE_SMALL_MEALS:
        return 6; // Estimado
      default:
        return 2;
    }
  }

  /**
   * Verifica si la cantidad de agua diaria es adecuada para el peso
   */
  isWaterIntakeAdequate(petWeight: number): boolean | null {
    if (!this.dailyWaterIntake || !petWeight) return null;
    
    // Regla general: 50-100ml por kg de peso corporal
    const minWater = petWeight * 50;
    const maxWater = petWeight * 100;
    
    return this.dailyWaterIntake >= minWater && this.dailyWaterIntake <= maxWater;
  }

  /**
   * Calcula el porcentaje de calorías que representan los treats
   */
  calculateTreatPercentage(): number | null {
    if (!this.dailyTreatAllowance) return 0;
    
    // Estimación básica: 4 kcal por gramo (varía según el tipo de comida)
    const mainFoodCalories = this.dailyAmountGrams * 4;
    const treatCalories = this.dailyTreatAllowance * 4;
    
    return Number(((treatCalories / (mainFoodCalories + treatCalories)) * 100).toFixed(1));
  }

  /**
   * Verifica si los treats exceden el 10% recomendado de calorías diarias
   */
  areTreatsExcessive(): boolean {
    const treatPercentage = this.calculateTreatPercentage();
    return treatPercentage !== null && treatPercentage > 10;
  }

  /**
   * Genera un resumen del plan alimentario
   */
  getFeedingSummary(): string {
    const summary = [];
    
    summary.push(`${this.dailyAmountGrams}g daily of ${this.dietType}`);
    
    if (this.primaryFoodBrand) {
      summary.push(`(${this.primaryFoodBrand})`);
    }
    
    summary.push(`divided into ${this.getMealsPerDay()} meals`);
    
    if (this.feedingTimes && this.feedingTimes.length > 0) {
      summary.push(`at ${this.feedingTimes.join(', ')}`);
    }
    
    return summary.join(' ');
  }

  /**
   * Verifica si ha pasado mucho tiempo desde el último cambio de dieta
   */
  isRecentDietChange(): boolean | null {
    if (!this.lastDietChange) return null;
    
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    return this.lastDietChange > oneMonthAgo;
  }
}