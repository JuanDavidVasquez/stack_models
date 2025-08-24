import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { VeterinarianTimeUtils,VeterinarianLevelUtils } from "../utils";
import { Veterinarian } from "./veterinarian.entity";

@Entity('veterinarian_professional_statistics')
export class VeterinarianProfessionalStatistics {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Total number of behavioral assessments conducted'
  })
  totalAssessments!: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Number of successful adoptions facilitated'
  })
  successfulAdoptions!: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    comment: 'Average assessment accuracy rate'
  })
  assessmentAccuracyRate?: number;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Date of last behavioral assessment'
  })
  lastAssessmentDate?: Date;

  @OneToOne(() => Veterinarian, veterinarian => veterinarian.statistics)
  veterinarian!: Veterinarian;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === MÉTODOS SIMPLES USANDO UTILIDADES ===

  /**
   * Calcula tasa de éxito en adopciones (usando utilidades)
   */
  getAdoptionSuccessRate(): number {
    return VeterinarianLevelUtils.calculateSuccessRate(this.successfulAdoptions, this.totalAssessments);
  }

  /**
   * Incrementa contador de evaluaciones
   */
  incrementAssessments(): void {
    this.totalAssessments++;
    this.lastAssessmentDate = new Date();
  }

  /**
   * Incrementa contador de adopciones exitosas
   */
  incrementSuccessfulAdoptions(): void {
    this.successfulAdoptions++;
  }

  /**
   * Actualiza tasa de precisión
   */
  updateAccuracyRate(rate: number): void {
    this.assessmentAccuracyRate = Math.max(0, Math.min(100, rate));
  }

  /**
   * Calcula días desde última evaluación (usando utilidades)
   */
  getDaysSinceLastAssessment(): number | null {
    if (!this.lastAssessmentDate) return null;
    return VeterinarianTimeUtils.daysBetween(this.lastAssessmentDate);
  }

  /**
   * Obtiene resumen de estadísticas (usando utilidades)
   */
  getStatisticsSummary(): {
    totalAssessments: number;
    successfulAdoptions: number;
    adoptionSuccessRate: number;
    assessmentAccuracyRate: number;
    daysSinceLastAssessment: number | null;
    performanceLevel: 'Low' | 'Medium' | 'High' | 'Excellent';
  } {
    const successRate = this.getAdoptionSuccessRate();
    const accuracyRate = this.assessmentAccuracyRate || 0;
    
    // Usar utilidad para calcular nivel de performance
    const performanceLevel = VeterinarianLevelUtils.getPerformanceLevel(successRate, accuracyRate);

    return {
      totalAssessments: this.totalAssessments,
      successfulAdoptions: this.successfulAdoptions,
      adoptionSuccessRate: successRate,
      assessmentAccuracyRate: accuracyRate,
      daysSinceLastAssessment: this.getDaysSinceLastAssessment(),
      performanceLevel
    };
  }

  /**
   * Resetea estadísticas
   */
  resetStatistics(): void {
    this.totalAssessments = 0;
    this.successfulAdoptions = 0;
    this.assessmentAccuracyRate = undefined;
    this.lastAssessmentDate = undefined;
  }
}