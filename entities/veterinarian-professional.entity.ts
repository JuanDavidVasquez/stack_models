import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { CertificationStatus } from "../enums/veterinarian.enum";
import { Veterinarian } from "./veterinarian.entity";

@Entity('veterinarians')
export class VeterinarianProfessional {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // === INFORMACIÓN PROFESIONAL ===
  @Column({
    unique: true,
    comment: 'Professional license number'
  })
  licenseNumber!: string;

  @Column({
    type: 'enum',
    enum: CertificationStatus,
    default: CertificationStatus.ACTIVE,
    comment: 'Current license status'
  })
  licenseStatus!: CertificationStatus;

  @Column({
    type: 'date',
    comment: 'License issue date'
  })
  licenseIssueDate!: Date;

  @Column({
    type: 'date',
    comment: 'License expiration date'
  })
  licenseExpirationDate!: Date;

  @Column({
    comment: 'Licensing authority/board'
  })
  licensingAuthority!: string;

  @Column({
    comment: 'Veterinary school attended'
  })
  veterinarySchool!: string;

  @Column({
    type: 'date',
    comment: 'Graduation date from veterinary school'
  })
  graduationDate!: Date;

  @OneToOne(() => Veterinarian, veterinarian => veterinarian.professional)
  veterinarian!: Veterinarian;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === MÉTODOS HELPER PARA VALIDACIÓN PROFESIONAL ===

  /**
   * Verifica si la licencia está vigente
   */
  isLicenseValid(): boolean {
    const today = new Date();
    return this.licenseStatus === CertificationStatus.ACTIVE && 
           this.licenseExpirationDate > today;
  }

  /**
   * Calcula días hasta vencimiento de licencia
   */
  getDaysUntilLicenseExpiration(): number {
    const today = new Date();
    const diffTime = this.licenseExpirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica si la licencia vence pronto (30 días por defecto)
   */
  isLicenseExpiringSoon(daysThreshold: number = 30): boolean {
    const daysUntilExpiration = this.getDaysUntilLicenseExpiration();
    return daysUntilExpiration <= daysThreshold && daysUntilExpiration > 0;
  }

  /**
   * Verifica si la licencia ya venció
   */
  isLicenseExpired(): boolean {
    return this.getDaysUntilLicenseExpiration() < 0;
  }

  /**
   * Calcula años de experiencia desde graduación
   */
  getYearsSinceGraduation(): number {
    const today = new Date();
    const diffTime = today.getTime() - this.graduationDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
  }

  /**
   * Calcula meses de experiencia desde graduación
   */
  getMonthsSinceGraduation(): number {
    const today = new Date();
    const diffTime = today.getTime() - this.graduationDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Promedio de días por mes
  }

  /**
   * Determina el nivel de senioridad basado en años de graduación
   */
  getSeniorityLevel(): 'Junior' | 'Mid-Level' | 'Senior' | 'Expert' {
    const years = this.getYearsSinceGraduation();
    
    if (years < 2) return 'Junior';
    if (years < 5) return 'Mid-Level';
    if (years < 10) return 'Senior';
    return 'Expert';
  }

  /**
   * Verifica si puede ejercer legalmente
   */
  canPractice(): boolean {
    return this.isLicenseValid() && 
           this.licenseStatus === CertificationStatus.ACTIVE;
  }

  /**
   * Genera resumen del estado de la licencia
   */
  getLicenseStatusSummary(): {
    status: string;
    isValid: boolean;
    daysUntilExpiration: number;
    needsRenewal: boolean;
    message: string;
  } {
    const daysUntilExpiration = this.getDaysUntilLicenseExpiration();
    const isValid = this.isLicenseValid();
    const needsRenewal = this.isLicenseExpiringSoon();

    let message = '';
    let status = this.licenseStatus;

    if (this.isLicenseExpired()) {
      message = 'Licencia vencida - No puede ejercer';
      status = CertificationStatus.EXPIRED;
    } else if (needsRenewal) {
      message = `Licencia vence en ${daysUntilExpiration} días - Renovar pronto`;
    } else if (isValid) {
      message = `Licencia vigente por ${daysUntilExpiration} días`;
    } else {
      message = 'Estado de licencia inválido';
    }

    return {
      status,
      isValid,
      daysUntilExpiration,
      needsRenewal,
      message
    };
  }

  /**
   * Valida formato del número de licencia (personalizable según país/región)
   */
  isLicenseNumberValid(): boolean {
    // Ejemplo básico - personalizar según el formato requerido
    // Este ejemplo asume formato: 2-4 letras seguidas de 4-8 dígitos
    const licensePattern = /^[A-Z]{2,4}\d{4,8}$/i;
    return licensePattern.test(this.licenseNumber);
  }

  /**
   * Verifica si la fecha de graduación es válida
   */
  isGraduationDateValid(): boolean {
    const today = new Date();
    const minGraduationDate = new Date('1950-01-01'); // Fecha mínima razonable
    
    return this.graduationDate >= minGraduationDate && 
           this.graduationDate <= today;
  }

  /**
   * Verifica si las fechas de licencia son consistentes
   */
  areLicenseDatesConsistent(): boolean {
    // La fecha de emisión debe ser después de la graduación
    // La fecha de vencimiento debe ser después de la emisión
    return this.licenseIssueDate >= this.graduationDate &&
           this.licenseExpirationDate > this.licenseIssueDate;
  }

  /**
   * Calcula duración de la licencia actual en años
   */
  getCurrentLicenseDurationYears(): number {
    const diffTime = this.licenseExpirationDate.getTime() - this.licenseIssueDate.getTime();
    return Number((diffTime / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1));
  }

  /**
   * Genera código de verificación profesional (para validaciones externas)
   */
  generateVerificationCode(): string {
    // Combina elementos únicos para crear un código verificable
    const licenseHash = this.licenseNumber.slice(-4);
    const graduationYear = this.graduationDate.getFullYear().toString().slice(-2);
    const statusCode = this.licenseStatus.charAt(0).toUpperCase();
    
    return `${statusCode}${graduationYear}${licenseHash}`;
  }

  /**
   * Verifica si necesita renovación urgente (7 días o menos)
   */
  needsUrgentRenewal(): boolean {
    return this.isLicenseExpiringSoon(7);
  }

  /**
   * Calcula el porcentaje de tiempo transcurrido en la licencia actual
   */
  getLicenseProgressPercentage(): number {
    const today = new Date();
    const totalDuration = this.licenseExpirationDate.getTime() - this.licenseIssueDate.getTime();
    const elapsed = today.getTime() - this.licenseIssueDate.getTime();
    
    const percentage = (elapsed / totalDuration) * 100;
    return Math.min(100, Math.max(0, Number(percentage.toFixed(1))));
  }

  /**
   * Genera reporte de validación profesional completo
   */
  getValidationReport(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    summary: string;
  } {
    const errors = [];
    const warnings = [];

    // Validaciones críticas
    if (!this.isLicenseNumberValid()) {
      errors.push('Formato de número de licencia inválido');
    }

    if (!this.isLicenseValid()) {
      errors.push('Licencia no válida o vencida');
    }

    if (!this.isGraduationDateValid()) {
      errors.push('Fecha de graduación inválida');
    }

    if (!this.areLicenseDatesConsistent()) {
      errors.push('Fechas de licencia inconsistentes');
    }

    // Advertencias
    if (this.isLicenseExpiringSoon()) {
      warnings.push('Licencia próxima a vencer');
    }

    if (this.getYearsSinceGraduation() < 1) {
      warnings.push('Profesional recién graduado - supervisión recomendada');
    }

    const isValid = errors.length === 0;
    const summary = isValid ? 
      `Veterinario válido - ${this.getSeniorityLevel()} con ${this.getYearsSinceGraduation()} años de experiencia` :
      `Validación fallida - ${errors.length} errores encontrados`;

    return { isValid, errors, warnings, summary };
  }

  /**
   * Obtiene la información de la escuela en formato legible
   */
  getEducationSummary(): string {
    const graduationYear = this.graduationDate.getFullYear();
    return `${this.veterinarySchool} (${graduationYear})`;
  }

  /**
   * Verifica si puede realizar ciertas actividades basado en experiencia
   */
  canPerformActivity(activity: {
    minimumYearsRequired: number;
    requiresValidLicense: boolean;
    minimumSeniorityLevel?: 'Junior' | 'Mid-Level' | 'Senior' | 'Expert';
  }): boolean {
    if (activity.requiresValidLicense && !this.canPractice()) {
      return false;
    }

    if (this.getYearsSinceGraduation() < activity.minimumYearsRequired) {
      return false;
    }

    if (activity.minimumSeniorityLevel) {
      const seniorityLevels = ['Junior', 'Mid-Level', 'Senior', 'Expert'];
      const currentLevelIndex = seniorityLevels.indexOf(this.getSeniorityLevel());
      const requiredLevelIndex = seniorityLevels.indexOf(activity.minimumSeniorityLevel);
      
      if (currentLevelIndex < requiredLevelIndex) {
        return false;
      }
    }

    return true;
  }
}