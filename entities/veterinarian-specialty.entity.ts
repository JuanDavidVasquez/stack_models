import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { VeterinarianSpecialty } from "../enums/veterinarian.enum";
import { Veterinarian } from "./veterinarian.entity";

@Entity('veterinarian_specialties')
export class VeterinarianSpecialtyEntity {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // === ESPECIALIDADES Y CERTIFICACIONES ===
  @Column({
    type: 'enum',
    enum: VeterinarianSpecialty,
    default: VeterinarianSpecialty.GENERAL_PRACTICE,
    comment: 'Primary specialty'
  })
  primarySpecialty!: VeterinarianSpecialty;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Additional specialties and certifications'
  })
  additionalSpecialties?: VeterinarianSpecialty[];

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Professional certifications and their expiration dates'
  })
  certifications?: { name: string; issuedBy: string; issueDate: Date; expirationDate: Date }[];

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Certified in animal behavior/ethology'
  })
  ethologyCertified!: boolean;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Details about ethology certification'
  })
  ethologyCertificationDetails?: string;

  @OneToOne(() => Veterinarian, veterinarian => veterinarian.specialty)
  veterinarian!: Veterinarian;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === MÉTODOS HELPER PARA ESPECIALIDADES ===

  /**
   * Obtiene todas las especialidades (primaria + adicionales)
   */
  getAllSpecialties(): VeterinarianSpecialty[] {
    const specialties = [this.primarySpecialty];
    
    if (this.additionalSpecialties && this.additionalSpecialties.length > 0) {
      specialties.push(...this.additionalSpecialties);
    }
    
    return [...new Set(specialties)]; // Eliminar duplicados
  }

  /**
   * Verifica si tiene una especialidad específica
   */
  hasSpecialty(specialty: VeterinarianSpecialty): boolean {
    return this.getAllSpecialties().includes(specialty);
  }

  /**
   * Verifica si es especialista en etología/comportamiento animal
   */
  isEthologySpecialist(): boolean {
    return this.ethologyCertified || 
           this.hasSpecialty(VeterinarianSpecialty.ETHOLOGY) ||
           this.hasSpecialty(VeterinarianSpecialty.ANIMAL_BEHAVIOR);
  }

  /**
   * Verifica si es especialista en medicina de refugio
   */
  isShelterMedicineSpecialist(): boolean {
    return this.hasSpecialty(VeterinarianSpecialty.SHELTER_MEDICINE);
  }

  /**
   * Cuenta el número total de especialidades
   */
  getSpecialtyCount(): number {
    return this.getAllSpecialties().length;
  }

  /**
   * Verifica si es especialista (más de práctica general)
   */
  isSpecialist(): boolean {
    return this.primarySpecialty !== VeterinarianSpecialty.GENERAL_PRACTICE ||
           !!(this.additionalSpecialties && this.additionalSpecialties.length > 0);
  }

  /**
   * Obtiene certificaciones vigentes
   */
  getActiveCertifications(): { name: string; issuedBy: string; issueDate: Date; expirationDate: Date }[] {
    if (!this.certifications) return [];
    
    const today = new Date();
    return this.certifications.filter(cert => cert.expirationDate > today);
  }

  /**
   * Obtiene certificaciones vencidas
   */
  getExpiredCertifications(): { name: string; issuedBy: string; issueDate: Date; expirationDate: Date }[] {
    if (!this.certifications) return [];
    
    const today = new Date();
    return this.certifications.filter(cert => cert.expirationDate <= today);
  }

  /**
   * Obtiene certificaciones que vencen pronto
   */
  getCertificationsExpiringSoon(daysThreshold: number = 30): { name: string; issuedBy: string; issueDate: Date; expirationDate: Date; daysUntilExpiration: number }[] {
    if (!this.certifications) return [];
    
    const today = new Date();
    const thresholdDate = new Date(today.getTime() + daysThreshold * 24 * 60 * 60 * 1000);
    
    return this.certifications
      .filter(cert => cert.expirationDate > today && cert.expirationDate <= thresholdDate)
      .map(cert => ({
        ...cert,
        daysUntilExpiration: Math.ceil((cert.expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      }));
  }

  /**
   * Verifica si necesita renovación de certificaciones
   */
  needsCertificationRenewal(): boolean {
    return this.getCertificationsExpiringSoon().length > 0;
  }

  /**
   * Obtiene el nivel de especialización
   */
  getSpecializationLevel(): 'General' | 'Specialist' | 'Multi-Specialist' | 'Expert' {
    const specialtyCount = this.getSpecialtyCount();
    const activeCerts = this.getActiveCertifications().length;
    
    if (this.primarySpecialty === VeterinarianSpecialty.GENERAL_PRACTICE && specialtyCount === 1 && activeCerts === 0) {
      return 'General';
    }
    
    if (specialtyCount === 1 || activeCerts <= 2) {
      return 'Specialist';
    }
    
    if (specialtyCount <= 3 || activeCerts <= 5) {
      return 'Multi-Specialist';
    }
    
    return 'Expert';
  }

  /**
   * Verifica si puede realizar evaluaciones comportamentales
   */
  canPerformBehaviorAssessments(): boolean {
    return this.isEthologySpecialist() || 
           this.hasSpecialty(VeterinarianSpecialty.SHELTER_MEDICINE) ||
           this.hasActiveCertificationByType('behavior') ||
           this.hasActiveCertificationByType('ethology');
  }

  /**
   * Verifica si tiene certificación activa de un tipo específico
   */
  hasActiveCertificationByType(type: string): boolean {
    const activeCerts = this.getActiveCertifications();
    return activeCerts.some(cert => 
      cert.name.toLowerCase().includes(type.toLowerCase())
    );
  }

  /**
   * Obtiene certificaciones por tipo
   */
  getCertificationsByType(type: string): { name: string; issuedBy: string; issueDate: Date; expirationDate: Date }[] {
    if (!this.certifications) return [];
    
    return this.certifications.filter(cert => 
      cert.name.toLowerCase().includes(type.toLowerCase())
    );
  }

  /**
   * Agrega una nueva certificación
   */
  addCertification(certification: { name: string; issuedBy: string; issueDate: Date; expirationDate: Date }): void {
    if (!this.certifications) {
      this.certifications = [];
    }
    
    // Verificar si ya existe la certificación
    const existingIndex = this.certifications.findIndex(cert => 
      cert.name === certification.name && cert.issuedBy === certification.issuedBy
    );
    
    if (existingIndex >= 0) {
      // Actualizar certificación existente
      this.certifications[existingIndex] = certification;
    } else {
      // Agregar nueva certificación
      this.certifications.push(certification);
    }
  }

  /**
   * Agrega una especialidad adicional
   */
  addSpecialty(specialty: VeterinarianSpecialty): void {
    if (specialty === this.primarySpecialty) {
      return; // Ya es la especialidad primaria
    }
    
    if (!this.additionalSpecialties) {
      this.additionalSpecialties = [];
    }
    
    if (!this.additionalSpecialties.includes(specialty)) {
      this.additionalSpecialties.push(specialty);
    }
  }

  /**
   * Remueve una especialidad adicional
   */
  removeSpecialty(specialty: VeterinarianSpecialty): void {
    if (!this.additionalSpecialties) return;
    
    this.additionalSpecialties = this.additionalSpecialties.filter(s => s !== specialty);
    
    if (this.additionalSpecialties.length === 0) {
      this.additionalSpecialties = undefined;
    }
  }

  /**
   * Genera resumen de especialidades
   */
  getSpecialtySummary(): string {
    const specialties = this.getAllSpecialties();
    const primaryText = `Especialidad principal: ${this.primarySpecialty}`;
    
    if (specialties.length === 1) {
      return primaryText;
    }
    
    const additionalText = this.additionalSpecialties ? 
      `Especialidades adicionales: ${this.additionalSpecialties.join(', ')}` : '';
    
    return `${primaryText}${additionalText ? '. ' + additionalText : ''}`;
  }

  /**
   * Genera resumen de certificaciones
   */
  getCertificationSummary(): {
    total: number;
    active: number;
    expired: number;
    expiringSoon: number;
    needsAction: boolean;
  } {
    const total = this.certifications?.length || 0;
    const active = this.getActiveCertifications().length;
    const expired = this.getExpiredCertifications().length;
    const expiringSoon = this.getCertificationsExpiringSoon().length;
    
    return {
      total,
      active,
      expired,
      expiringSoon,
      needsAction: expired > 0 || expiringSoon > 0
    };
  }

  /**
   * Verifica competencia para casos específicos
   */
  isQualifiedForCase(caseRequirements: {
    requiresEthologySpecialist?: boolean;
    requiresShelterMedicine?: boolean;
    requiredSpecialties?: VeterinarianSpecialty[];
    requiredCertifications?: string[];
    minimumSpecializationLevel?: 'General' | 'Specialist' | 'Multi-Specialist' | 'Expert';
  }): {
    qualified: boolean;
    reasons: string[];
    recommendations: string[];
  } {
    const reasons = [];
    const recommendations = [];
    let qualified = true;

    // Verificar especialista en etología
    if (caseRequirements.requiresEthologySpecialist && !this.isEthologySpecialist()) {
      qualified = false;
      reasons.push('Requiere especialista en etología');
      recommendations.push('Obtener certificación en comportamiento animal');
    }

    // Verificar medicina de refugio
    if (caseRequirements.requiresShelterMedicine && !this.isShelterMedicineSpecialist()) {
      qualified = false;
      reasons.push('Requiere especialista en medicina de refugio');
      recommendations.push('Obtener certificación en medicina de refugio');
    }

    // Verificar especialidades específicas
    if (caseRequirements.requiredSpecialties) {
      const missingSpecialties = caseRequirements.requiredSpecialties.filter(
        specialty => !this.hasSpecialty(specialty)
      );
      
      if (missingSpecialties.length > 0) {
        qualified = false;
        reasons.push(`Faltan especialidades: ${missingSpecialties.join(', ')}`);
        recommendations.push(`Considerar especialización en: ${missingSpecialties.join(', ')}`);
      }
    }

    // Verificar certificaciones específicas
    if (caseRequirements.requiredCertifications) {
      const missingCertifications = caseRequirements.requiredCertifications.filter(
        certType => !this.hasActiveCertificationByType(certType)
      );
      
      if (missingCertifications.length > 0) {
        qualified = false;
        reasons.push(`Faltan certificaciones: ${missingCertifications.join(', ')}`);
        recommendations.push(`Obtener certificaciones en: ${missingCertifications.join(', ')}`);
      }
    }

    // Verificar nivel de especialización
    if (caseRequirements.minimumSpecializationLevel) {
      const levels = ['General', 'Specialist', 'Multi-Specialist', 'Expert'];
      const currentLevelIndex = levels.indexOf(this.getSpecializationLevel());
      const requiredLevelIndex = levels.indexOf(caseRequirements.minimumSpecializationLevel);
      
      if (currentLevelIndex < requiredLevelIndex) {
        qualified = false;
        reasons.push(`Nivel de especialización insuficiente (${this.getSpecializationLevel()} < ${caseRequirements.minimumSpecializationLevel})`);
        recommendations.push('Ampliar especialidades y certificaciones');
      }
    }

    return { qualified, reasons, recommendations };
  }

  /**
   * Genera reporte completo de especialidades
   */
  getSpecialtyReport(): {
    level: string;
    specialties: VeterinarianSpecialty[];
    certificationSummary: any;
    capabilities: string[];
    alerts: string[];
    recommendations: string[];
  } {
    const capabilities = [];
    const alerts = [];
    const recommendations = [];

    // Capacidades
    if (this.canPerformBehaviorAssessments()) {
      capabilities.push('Evaluaciones comportamentales');
    }
    
    if (this.isEthologySpecialist()) {
      capabilities.push('Especialista en etología');
    }
    
    if (this.isShelterMedicineSpecialist()) {
      capabilities.push('Medicina de refugio');
    }

    // Alertas
    const expiredCerts = this.getExpiredCertifications();
    if (expiredCerts.length > 0) {
      alerts.push(`${expiredCerts.length} certificación(es) vencida(s)`);
    }

    const expiringSoon = this.getCertificationsExpiringSoon();
    if (expiringSoon.length > 0) {
      alerts.push(`${expiringSoon.length} certificación(es) vence(n) pronto`);
    }

    // Recomendaciones
    if (this.primarySpecialty === VeterinarianSpecialty.GENERAL_PRACTICE && !this.additionalSpecialties) {
      recommendations.push('Considerar especialización adicional');
    }

    if (!this.isEthologySpecialist() && this.isShelterMedicineSpecialist()) {
      recommendations.push('Certificación en comportamiento animal sería beneficial');
    }

    return {
      level: this.getSpecializationLevel(),
      specialties: this.getAllSpecialties(),
      certificationSummary: this.getCertificationSummary(),
      capabilities,
      alerts,
      recommendations
    };
  }
}