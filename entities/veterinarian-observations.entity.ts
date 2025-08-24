import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { VeterinarianTimeUtils } from "../utils";
import { Veterinarian } from "./veterinarian.entity";

interface PerformanceReview {
  date: Date;
  rating: number;
  notes: string;
}

@Entity('veterinarian_observations')
export class VeterinarianObservations {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Professional bio or description'
  })
  biography?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Special interests or research areas'
  })
  specialInterests?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Administrative notes'
  })
  adminNotes?: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Performance reviews and ratings'
  })
  performanceReviews?: PerformanceReview[];

  @OneToOne(() => Veterinarian, veterinarian => veterinarian.observations)
  veterinarian!: Veterinarian;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === MÉTODOS SIMPLES ===

  /**
   * Verifica si tiene biografía completa
   */
  hasCompleteBiography(): boolean {
    return !!(this.biography && this.biography.trim().length > 50);
  }

  /**
   * Agrega nueva review de performance
   */
  addPerformanceReview(rating: number, notes: string): void {
    if (!this.performanceReviews) {
      this.performanceReviews = [];
    }
    
    this.performanceReviews.push({
      date: new Date(),
      rating: Math.max(1, Math.min(10, rating)), // Limitar entre 1-10
      notes: notes.trim()
    });
  }

  /**
   * Obtiene la última review de performance
   */
  getLatestPerformanceReview(): PerformanceReview | null {
    if (!this.performanceReviews || this.performanceReviews.length === 0) return null;
    
    return this.performanceReviews
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }

  /**
   * Calcula rating promedio de performance
   */
  getAverageRating(): number {
    if (!this.performanceReviews || this.performanceReviews.length === 0) return 0;
    
    const total = this.performanceReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / this.performanceReviews.length) * 10) / 10;
  }

  /**
   * Verifica si necesita review reciente
   */
  needsRecentReview(): boolean {
    const latest = this.getLatestPerformanceReview();
    if (!latest) return true;
    
    const daysSince = VeterinarianTimeUtils.daysBetween(latest.date);
    return daysSince > 365;
  }

  /**
   * Actualiza notas administrativas
   */
  updateAdminNotes(notes: string): void {
    const timestamp = new Date().toLocaleDateString();
    const newNote = `[${timestamp}] ${notes.trim()}`;
    
    this.adminNotes = this.adminNotes 
      ? `${this.adminNotes}\n\n${newNote}`
      : newNote;
  }

  /**
   * Obtiene resumen de observaciones
   */
  getObservationsSummary(): {
    hasBiography: boolean;
    hasSpecialInterests: boolean;
    hasAdminNotes: boolean;
    reviewCount: number;
    averageRating: number;
    needsReview: boolean;
    profileCompleteness: number;
  } {
    const hasBio = !!this.biography;
    const hasInterests = !!this.specialInterests;
    const hasNotes = !!this.adminNotes;
    const reviewCount = this.performanceReviews?.length || 0;
    
    // Calcular completeness del perfil (0-100%)
    let completeness = 0;
    if (hasBio) completeness += 40;
    if (hasInterests) completeness += 20;
    if (hasNotes) completeness += 20;
    if (reviewCount > 0) completeness += 20;

    return {
      hasBiography: hasBio,
      hasSpecialInterests: hasInterests,
      hasAdminNotes: hasNotes,
      reviewCount,
      averageRating: this.getAverageRating(),
      needsReview: this.needsRecentReview(),
      profileCompleteness: completeness
    };
  }
}