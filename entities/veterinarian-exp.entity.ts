import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { Veterinarian } from "./veterinarian.entity";

interface WorkHistoryEntry {
  position: string;
  organization: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  responsibilities?: string[];
}

@Entity('veterinarian_experiences')
export class VeterinarianExperience {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // === EXPERIENCIA PROFESIONAL ===
  @Column({
    type: 'int',
    default: 0,
    comment: 'Years of professional experience'
  })
  yearsOfExperience!: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Years of experience in shelter/rescue work'
  })
  shelterExperience!: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Years of experience in behavioral assessments'
  })
  behaviorAssessmentExperience!: number;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Previous work experience and positions'
  })
  workHistory?: WorkHistoryEntry[];

  @OneToOne(() => Veterinarian, veterinarian => veterinarian.experience)
  veterinarian!: Veterinarian;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === MÉTODOS HELPER PARA EXPERIENCIA ===

  /**
   * Determina el nivel de experiencia general
   */
  getExperienceLevel(): 'Entry' | 'Junior' | 'Mid-Level' | 'Senior' | 'Expert' | 'Master' {
    if (this.yearsOfExperience < 1) return 'Entry';
    if (this.yearsOfExperience < 3) return 'Junior';
    if (this.yearsOfExperience < 7) return 'Mid-Level';
    if (this.yearsOfExperience < 12) return 'Senior';
    if (this.yearsOfExperience < 20) return 'Expert';
    return 'Master';
  }

  /**
   * Determina el nivel de experiencia específico en refugios
   */
  getShelterExperienceLevel(): 'None' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    if (this.shelterExperience === 0) return 'None';
    if (this.shelterExperience < 1) return 'Beginner';
    if (this.shelterExperience < 3) return 'Intermediate';
    if (this.shelterExperience < 7) return 'Advanced';
    return 'Expert';
  }

  /**
   * Determina el nivel de experiencia en evaluaciones comportamentales
   */
  getBehaviorAssessmentLevel(): 'None' | 'Novice' | 'Intermediate' | 'Advanced' | 'Expert' {
    if (this.behaviorAssessmentExperience === 0) return 'None';
    if (this.behaviorAssessmentExperience < 1) return 'Novice';
    if (this.behaviorAssessmentExperience < 3) return 'Intermediate';
    if (this.behaviorAssessmentExperience < 6) return 'Advanced';
    return 'Expert';
  }

  /**
   * Verifica si tiene experiencia mínima requerida
   */
  meetsMinimumExperience(requirements: {
    generalYears?: number;
    shelterYears?: number;
    behaviorAssessmentYears?: number;
  }): boolean {
    if (requirements.generalYears && this.yearsOfExperience < requirements.generalYears) {
      return false;
    }
    
    if (requirements.shelterYears && this.shelterExperience < requirements.shelterYears) {
      return false;
    }
    
    if (requirements.behaviorAssessmentYears && this.behaviorAssessmentExperience < requirements.behaviorAssessmentYears) {
      return false;
    }
    
    return true;
  }

  /**
   * Calcula el porcentaje de experiencia especializada
   */
  getSpecializationPercentage(): {
    shelterPercentage: number;
    behaviorPercentage: number;
  } {
    const shelterPercentage = this.yearsOfExperience > 0 ? 
      Math.round((this.shelterExperience / this.yearsOfExperience) * 100) : 0;
    
    const behaviorPercentage = this.yearsOfExperience > 0 ? 
      Math.round((this.behaviorAssessmentExperience / this.yearsOfExperience) * 100) : 0;
    
    return { shelterPercentage, behaviorPercentage };
  }

  /**
   * Obtiene trabajos actuales (sin fecha de fin)
   */
  getCurrentPositions(): WorkHistoryEntry[] {
    if (!this.workHistory) return [];
    
    return this.workHistory.filter(job => !job.endDate);
  }

  /**
   * Obtiene trabajos anteriores (con fecha de fin)
   */
  getPreviousPositions(): WorkHistoryEntry[] {
    if (!this.workHistory) return [];
    
    return this.workHistory.filter(job => job.endDate);
  }

  /**
   * Calcula la duración total de empleo en meses
   */
  getTotalEmploymentMonths(): number {
    if (!this.workHistory) return 0;
    
    const today = new Date();
    let totalMonths = 0;
    
    for (const job of this.workHistory) {
      const startDate = new Date(job.startDate);
      const endDate = job.endDate ? new Date(job.endDate) : today;
      
      const diffTime = endDate.getTime() - startDate.getTime();
      const months = diffTime / (1000 * 60 * 60 * 24 * 30.44); // Promedio de días por mes
      totalMonths += months;
    }
    
    return Math.round(totalMonths);
  }

  /**
   * Obtiene experiencia en organizaciones específicas
   */
  getExperienceByOrganizationType(organizationType: string): WorkHistoryEntry[] {
    if (!this.workHistory) return [];
    
    return this.workHistory.filter(job => 
      job.organization.toLowerCase().includes(organizationType.toLowerCase())
    );
  }

  /**
   * Verifica si ha trabajado en refugios/rescates
   */
  hasWorkedInShelters(): boolean {
    return this.shelterExperience > 0 || 
           this.getExperienceByOrganizationType('shelter').length > 0 ||
           this.getExperienceByOrganizationType('rescue').length > 0 ||
           this.getExperienceByOrganizationType('refugio').length > 0;
  }

  /**
   * Obtiene el trabajo más reciente
   */
  getMostRecentPosition(): WorkHistoryEntry | null {
    if (!this.workHistory || this.workHistory.length === 0) return null;
    
    // Primero buscar trabajos actuales
    const currentJobs = this.getCurrentPositions();
    if (currentJobs.length > 0) {
      return currentJobs.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
    }
    
    // Si no hay trabajos actuales, buscar el más reciente
    return this.workHistory
      .filter(job => job.endDate)
      .sort((a, b) => new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime())[0];
  }

  /**
   * Calcula años de experiencia en posición específica
   */
  getExperienceInPosition(position: string): number {
    if (!this.workHistory) return 0;
    
    const relevantJobs = this.workHistory.filter(job => 
      job.position.toLowerCase().includes(position.toLowerCase())
    );
    
    const today = new Date();
    let totalMonths = 0;
    
    for (const job of relevantJobs) {
      const startDate = new Date(job.startDate);
      const endDate = job.endDate ? new Date(job.endDate) : today;
      
      const diffTime = endDate.getTime() - startDate.getTime();
      const months = diffTime / (1000 * 60 * 60 * 24 * 30.44);
      totalMonths += months;
    }
    
    return Math.round(totalMonths / 12 * 10) / 10; // Redondear a 1 decimal
  }

  /**
   * Verifica si tiene gaps en el historial laboral
   */
  hasEmploymentGaps(): { hasGaps: boolean; gaps: { start: Date; end: Date; durationMonths: number }[] } {
    if (!this.workHistory || this.workHistory.length < 2) {
      return { hasGaps: false, gaps: [] };
    }
    
    const sortedJobs = [...this.workHistory]
      .filter(job => job.endDate) // Solo trabajos terminados
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    const gaps = [];
    
    for (let i = 0; i < sortedJobs.length - 1; i++) {
      const currentEnd = new Date(sortedJobs[i].endDate!);
      const nextStart = new Date(sortedJobs[i + 1].startDate);
      
      const gapDays = (nextStart.getTime() - currentEnd.getTime()) / (1000 * 60 * 60 * 24);
      
      // Considerar gap si es mayor a 30 días
      if (gapDays > 30) {
        gaps.push({
          start: currentEnd,
          end: nextStart,
          durationMonths: Math.round(gapDays / 30.44)
        });
      }
    }
    
    return { hasGaps: gaps.length > 0, gaps };
  }

  /**
   * Agrega nueva experiencia laboral
   */
  addWorkExperience(experience: WorkHistoryEntry): void {
    if (!this.workHistory) {
      this.workHistory = [];
    }
    
    this.workHistory.push(experience);
    this.updateExperienceCounters();
  }

  /**
   * Actualiza experiencia laboral existente
   */
  updateWorkExperience(index: number, updates: Partial<WorkHistoryEntry>): void {
    if (!this.workHistory || index < 0 || index >= this.workHistory.length) {
      return;
    }
    
    this.workHistory[index] = { ...this.workHistory[index], ...updates };
    this.updateExperienceCounters();
  }

  /**
   * Termina un trabajo actual (agrega fecha de fin)
   */
  endCurrentPosition(organizationName: string, endDate: Date = new Date()): void {
    if (!this.workHistory) return;
    
    const jobIndex = this.workHistory.findIndex(job => 
      job.organization === organizationName && !job.endDate
    );
    
    if (jobIndex >= 0) {
      this.workHistory[jobIndex].endDate = endDate;
      this.updateExperienceCounters();
    }
  }

  /**
   * Actualiza automáticamente los contadores de experiencia basado en el historial
   */
  private updateExperienceCounters(): void {
    if (!this.workHistory) return;
    
    const today = new Date();
    let totalMonths = 0;
    let shelterMonths = 0;
    let behaviorMonths = 0;
    
    for (const job of this.workHistory) {
      const startDate = new Date(job.startDate);
      const endDate = job.endDate ? new Date(job.endDate) : today;
      
      const months = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
      totalMonths += months;
      
      // Identificar experiencia en refugios
      if (this.isJobShelterRelated(job)) {
        shelterMonths += months;
      }
      
      // Identificar experiencia en comportamiento
      if (this.isJobBehaviorRelated(job)) {
        behaviorMonths += months;
      }
    }
    
    this.yearsOfExperience = Math.round(totalMonths / 12);
    this.shelterExperience = Math.round(shelterMonths / 12);
    this.behaviorAssessmentExperience = Math.round(behaviorMonths / 12);
  }

  /**
   * Verifica si un trabajo está relacionado con refugios
   */
  private isJobShelterRelated(job: WorkHistoryEntry): boolean {
    const shelterKeywords = ['shelter', 'rescue', 'refugio', 'santuario', 'spca', 'humane society'];
    const orgLower = job.organization.toLowerCase();
    const posLower = job.position.toLowerCase();
    
    return shelterKeywords.some(keyword => 
      orgLower.includes(keyword) || posLower.includes(keyword)
    );
  }

  /**
   * Verifica si un trabajo está relacionado con comportamiento
   */
  private isJobBehaviorRelated(job: WorkHistoryEntry): boolean {
    const behaviorKeywords = ['behavior', 'behaviorist', 'etholog', 'comportamiento', 'assessment'];
    const posLower = job.position.toLowerCase();
    
    return behaviorKeywords.some(keyword => posLower.includes(keyword));
  }

  /**
   * Genera resumen de experiencia
   */
  getExperienceSummary(): {
    totalYears: number;
    experienceLevel: string;
    shelterExperience: { years: number; level: string; percentage: number };
    behaviorExperience: { years: number; level: string; percentage: number };
    currentPositions: number;
    totalPositions: number;
    hasGaps: boolean;
  } {
    const specialization = this.getSpecializationPercentage();
    const gapInfo = this.hasEmploymentGaps();
    
    return {
      totalYears: this.yearsOfExperience,
      experienceLevel: this.getExperienceLevel(),
      shelterExperience: {
        years: this.shelterExperience,
        level: this.getShelterExperienceLevel(),
        percentage: specialization.shelterPercentage
      },
      behaviorExperience: {
        years: this.behaviorAssessmentExperience,
        level: this.getBehaviorAssessmentLevel(),
        percentage: specialization.behaviorPercentage
      },
      currentPositions: this.getCurrentPositions().length,
      totalPositions: this.workHistory?.length || 0,
      hasGaps: gapInfo.hasGaps
    };
  }

  /**
   * Evalúa idoneidad para roles específicos
   */
  evaluateRoleFitness(roleRequirements: {
    minimumYears?: number;
    requiredShelterExperience?: number;
    requiredBehaviorExperience?: number;
    preferredPositions?: string[];
    requiresCurrentEmployment?: boolean;
  }): {
    suitable: boolean;
    score: number;
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  } {
    const strengths = [];
    const gaps = [];
    const recommendations = [];
    let score = 0;

    // Evaluar experiencia general
    if (roleRequirements.minimumYears) {
      if (this.yearsOfExperience >= roleRequirements.minimumYears) {
        strengths.push(`${this.yearsOfExperience} años de experiencia general`);
        score += 30;
      } else {
        gaps.push(`Requiere ${roleRequirements.minimumYears} años, tiene ${this.yearsOfExperience}`);
        recommendations.push('Ganar más experiencia general');
      }
    }

    // Evaluar experiencia en refugios
    if (roleRequirements.requiredShelterExperience) {
      if (this.shelterExperience >= roleRequirements.requiredShelterExperience) {
        strengths.push(`${this.shelterExperience} años de experiencia en refugios`);
        score += 25;
      } else {
        gaps.push(`Requiere ${roleRequirements.requiredShelterExperience} años en refugios, tiene ${this.shelterExperience}`);
        recommendations.push('Buscar experiencia en refugios o rescates');
      }
    }

    // Evaluar experiencia en comportamiento
    if (roleRequirements.requiredBehaviorExperience) {
      if (this.behaviorAssessmentExperience >= roleRequirements.requiredBehaviorExperience) {
        strengths.push(`${this.behaviorAssessmentExperience} años en evaluaciones comportamentales`);
        score += 25;
      } else {
        gaps.push(`Requiere ${roleRequirements.requiredBehaviorExperience} años en comportamiento, tiene ${this.behaviorAssessmentExperience}`);
        recommendations.push('Obtener experiencia en evaluaciones comportamentales');
      }
    }

    // Evaluar posiciones preferidas
    if (roleRequirements.preferredPositions) {
      const matchingPositions = roleRequirements.preferredPositions.filter(pos => 
        this.getExperienceInPosition(pos) > 0
      );
      
      if (matchingPositions.length > 0) {
        strengths.push(`Experiencia en posiciones relevantes: ${matchingPositions.join(', ')}`);
        score += 15;
      } else {
        recommendations.push(`Experiencia en: ${roleRequirements.preferredPositions.join(', ')} sería beneficial`);
      }
    }

    // Evaluar empleo actual
    if (roleRequirements.requiresCurrentEmployment) {
      if (this.getCurrentPositions().length > 0) {
        strengths.push('Actualmente empleado');
        score += 5;
      } else {
        gaps.push('No tiene empleo actual');
      }
    }

    const suitable = gaps.length === 0;

    return { suitable, score, strengths, gaps, recommendations };
  }
}