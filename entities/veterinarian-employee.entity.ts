import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { EmploymentStatus } from "../enums/veterinarian.enum";
import { Veterinarian } from "./veterinarian.entity";

interface WorkingHoursEntry {
  day: string;
  startTime: string;
  endTime: string;
  isWorkingDay?: boolean;
}

@Entity('veterinarian_employees')
export class VeterinarianEmployee {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // === EMPLEO ACTUAL ===
  @Column({
    type: 'enum',
    enum: EmploymentStatus,
    default: EmploymentStatus.FULL_TIME,
    comment: 'Current employment status'
  })
  employmentStatus!: EmploymentStatus;

  @Column({
    type: 'date',
    comment: 'Start date with current organization'
  })
  startDate!: Date;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'End date if no longer employed'
  })
  endDate?: Date;

  @Column({
    nullable: true,
    comment: 'Current job title/position'
  })
  jobTitle?: string;

  @Column({
    nullable: true,
    comment: 'Department or division'
  })
  department?: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Working hours/schedule'
  })
  workingHours?: WorkingHoursEntry[];

  @OneToOne(() => Veterinarian, veterinarian => veterinarian.employee)
  veterinarian!: Veterinarian;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === MÉTODOS HELPER PARA EMPLEO ===

  /**
   * Verifica si está actualmente empleado
   */
  isCurrentlyEmployed(): boolean {
    return !this.endDate && 
           this.employmentStatus !== EmploymentStatus.INACTIVE;
  }

  /**
   * Calcula días trabajados en la organización actual
   */
  getDaysEmployed(): number {
    const endDate = this.endDate || new Date();
    const diffTime = endDate.getTime() - this.startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Calcula meses trabajados en la organización actual
   */
  getMonthsEmployed(): number {
    const days = this.getDaysEmployed();
    return Math.round(days / 30.44); // Promedio de días por mes
  }

  /**
   * Calcula años trabajados en la organización actual
   */
  getYearsEmployed(): number {
    const months = this.getMonthsEmployed();
    return Math.round(months / 12 * 10) / 10; // Redondear a 1 decimal
  }

  /**
   * Determina si es empleado de tiempo completo
   */
  isFullTime(): boolean {
    return this.employmentStatus === EmploymentStatus.FULL_TIME;
  }

  /**
   * Determina si es empleado de medio tiempo
   */
  isPartTime(): boolean {
    return this.employmentStatus === EmploymentStatus.PART_TIME;
  }

  /**
   * Determina si es voluntario
   */
  isVolunteer(): boolean {
    return this.employmentStatus === EmploymentStatus.VOLUNTEER;
  }

  /**
   * Determina si es empleado temporal/contratista
   */
  isTemporary(): boolean {
    return this.employmentStatus === EmploymentStatus.CONTRACT ||
           this.employmentStatus === EmploymentStatus.INTERN ||
           this.employmentStatus === EmploymentStatus.RESIDENT;
  }

  /**
   * Calcula horas de trabajo semanales
   */
  getWeeklyWorkingHours(): number {
    if (!this.workingHours) {
      // Estimaciones por defecto basadas en status de empleo
      switch (this.employmentStatus) {
        case EmploymentStatus.FULL_TIME:
          return 40;
        case EmploymentStatus.PART_TIME:
          return 20;
        case EmploymentStatus.VOLUNTEER:
          return 10;
        default:
          return 30;
      }
    }

    let totalHours = 0;
    
    for (const schedule of this.workingHours) {
      const hours = this.calculateDailyHours(schedule.startTime, schedule.endTime);
      totalHours += hours;
    }
    
    return Math.round(totalHours * 10) / 10; // Redondear a 1 decimal
  }

  /**
   * Calcula horas diarias promedio
   */
  getDailyWorkingHours(): number {
    const weeklyHours = this.getWeeklyWorkingHours();
    const workingDays = this.getWorkingDaysPerWeek();
    
    return workingDays > 0 ? Math.round((weeklyHours / workingDays) * 10) / 10 : 0;
  }

  /**
   * Obtiene días laborables por semana
   */
  getWorkingDaysPerWeek(): number {
    if (!this.workingHours) {
      // Estimaciones por defecto
      switch (this.employmentStatus) {
        case EmploymentStatus.FULL_TIME:
          return 5;
        case EmploymentStatus.PART_TIME:
          return 3;
        case EmploymentStatus.VOLUNTEER:
          return 2;
        default:
          return 4;
      }
    }

    return this.workingHours.filter(schedule => 
      schedule.isWorkingDay !== false && 
      schedule.startTime && 
      schedule.endTime
    ).length;
  }

  /**
   * Verifica si trabaja un día específico
   */
  worksOnDay(dayName: string): boolean {
    if (!this.workingHours) return false;
    
    return this.workingHours.some(schedule => 
      schedule.day.toLowerCase() === dayName.toLowerCase() &&
      schedule.startTime && 
      schedule.endTime &&
      schedule.isWorkingDay !== false
    );
  }

  /**
   * Obtiene horario para un día específico
   */
  getScheduleForDay(dayName: string): WorkingHoursEntry | null {
    if (!this.workingHours) return null;
    
    return this.workingHours.find(schedule => 
      schedule.day.toLowerCase() === dayName.toLowerCase()
    ) || null;
  }

  /**
   * Verifica si está disponible en un horario específico
   */
  isAvailableAt(dayName: string, time: string): boolean {
    const schedule = this.getScheduleForDay(dayName);
    if (!schedule || !schedule.startTime || !schedule.endTime) return false;
    
    return this.isTimeInRange(time, schedule.startTime, schedule.endTime);
  }

  /**
   * Calcula horas entre dos tiempos
   */
  private calculateDailyHours(startTime: string, endTime: string): number {
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);
    
    let duration = end - start;
    if (duration < 0) {
      duration += 24 * 60; // Trabajo nocturno que cruza medianoche
    }
    
    return duration / 60; // Convertir a horas
  }

  /**
   * Convierte tiempo en formato HH:MM a minutos
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Verifica si un tiempo está en un rango
   */
  private isTimeInRange(time: string, startTime: string, endTime: string): boolean {
    const timeMinutes = this.timeToMinutes(time);
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);
    
    if (startMinutes <= endMinutes) {
      return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
    } else {
      // Horario nocturno que cruza medianoche
      return timeMinutes >= startMinutes || timeMinutes <= endMinutes;
    }
  }

  /**
   * Termina el empleo actual
   */
  terminateEmployment(endDate: Date = new Date(), reason?: string): void {
    this.endDate = endDate;
    this.employmentStatus = EmploymentStatus.INACTIVE;
  }

  /**
   * Cambia el status de empleo
   */
  changeEmploymentStatus(newStatus: EmploymentStatus): void {
    this.employmentStatus = newStatus;
    
    // Si se reactiva, remover fecha de fin
    if (newStatus !== EmploymentStatus.INACTIVE && this.endDate) {
      this.endDate = undefined;
    }
  }

  /**
   * Actualiza horario de trabajo
   */
  updateWorkingHours(newSchedule: WorkingHoursEntry[]): void {
    this.workingHours = newSchedule;
  }

  /**
   * Agrega día de trabajo al horario
   */
  addWorkingDay(day: string, startTime: string, endTime: string): void {
    if (!this.workingHours) {
      this.workingHours = [];
    }
    
    // Remover horario existente para ese día
    this.workingHours = this.workingHours.filter(schedule => 
      schedule.day.toLowerCase() !== day.toLowerCase()
    );
    
    // Agregar nuevo horario
    this.workingHours.push({
      day: day.toLowerCase(),
      startTime,
      endTime,
      isWorkingDay: true
    });
  }

  /**
   * Remueve día de trabajo del horario
   */
  removeWorkingDay(day: string): void {
    if (!this.workingHours) return;
    
    this.workingHours = this.workingHours.filter(schedule => 
      schedule.day.toLowerCase() !== day.toLowerCase()
    );
  }

  /**
   * Obtiene resumen del empleo actual
   */
  getEmploymentSummary(): {
    status: EmploymentStatus;
    isActive: boolean;
    duration: {
      days: number;
      months: number;
      years: number;
    };
    schedule: {
      weeklyHours: number;
      dailyHours: number;
      workingDays: number;
    };
    employment: {
      isFullTime: boolean;
      isPartTime: boolean;
      isVolunteer: boolean;
      isTemporary: boolean;
    };
  } {
    return {
      status: this.employmentStatus,
      isActive: this.isCurrentlyEmployed(),
      duration: {
        days: this.getDaysEmployed(),
        months: this.getMonthsEmployed(),
        years: this.getYearsEmployed()
      },
      schedule: {
        weeklyHours: this.getWeeklyWorkingHours(),
        dailyHours: this.getDailyWorkingHours(),
        workingDays: this.getWorkingDaysPerWeek()
      },
      employment: {
        isFullTime: this.isFullTime(),
        isPartTime: this.isPartTime(),
        isVolunteer: this.isVolunteer(),
        isTemporary: this.isTemporary()
      }
    };
  }

  /**
   * Verifica elegibilidad para beneficios
   */
  isEligibleForBenefits(): boolean {
    // Criterios típicos: tiempo completo y más de 90 días empleado
    return this.isFullTime() && this.getDaysEmployed() >= 90;
  }

  /**
   * Verifica si está en período de prueba
   */
  isInProbationPeriod(probationDays: number = 90): boolean {
    return this.isCurrentlyEmployed() && this.getDaysEmployed() <= probationDays;
  }

  /**
   * Calcula salario estimado basado en horas (necesita tasa por hora)
   */
  calculateEstimatedSalary(hourlyRate: number, weeksPerYear: number = 52): number {
    const weeklyHours = this.getWeeklyWorkingHours();
    return weeklyHours * hourlyRate * weeksPerYear;
  }

  /**
   * Obtiene días disponibles en la semana
   */
  getAvailableDays(): string[] {
    if (!this.workingHours) return [];
    
    return this.workingHours
      .filter(schedule => schedule.isWorkingDay !== false)
      .map(schedule => schedule.day);
  }

  /**
   * Genera horario completo de la semana
   */
  getWeeklySchedule(): { [day: string]: { startTime: string; endTime: string; hours: number } | null } {
    const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const schedule: { [day: string]: { startTime: string; endTime: string; hours: number } | null } = {};
    
    for (const day of daysOfWeek) {
      const daySchedule = this.getScheduleForDay(day);
      if (daySchedule && daySchedule.startTime && daySchedule.endTime) {
        schedule[day] = {
          startTime: daySchedule.startTime,
          endTime: daySchedule.endTime,
          hours: this.calculateDailyHours(daySchedule.startTime, daySchedule.endTime)
        };
      } else {
        schedule[day] = null;
      }
    }
    
    return schedule;
  }

  /**
   * Evalúa disponibilidad para tareas específicas
   */
  evaluateAvailabilityForTask(taskRequirements: {
    minimumHoursPerWeek?: number;
    requiredDays?: string[];
    preferredTimeSlots?: { day: string; startTime: string; endTime: string }[];
    requiresFullTime?: boolean;
    requiresWeekends?: boolean;
  }): {
    available: boolean;
    score: number;
    matchedRequirements: string[];
    missingRequirements: string[];
    recommendations: string[];
  } {
    const matchedRequirements = [];
    const missingRequirements = [];
    const recommendations = [];
    let score = 0;

    // Verificar horas mínimas
    if (taskRequirements.minimumHoursPerWeek) {
      const weeklyHours = this.getWeeklyWorkingHours();
      if (weeklyHours >= taskRequirements.minimumHoursPerWeek) {
        matchedRequirements.push(`${weeklyHours} horas semanales (≥${taskRequirements.minimumHoursPerWeek} requeridas)`);
        score += 30;
      } else {
        missingRequirements.push(`Requiere ${taskRequirements.minimumHoursPerWeek} horas, disponible ${weeklyHours}`);
        recommendations.push('Aumentar horas de trabajo disponibles');
      }
    }

    // Verificar días requeridos
    if (taskRequirements.requiredDays) {
      const availableDays = this.getAvailableDays();
      const matchingDays = taskRequirements.requiredDays.filter(day => 
        availableDays.includes(day.toLowerCase())
      );
      
      if (matchingDays.length === taskRequirements.requiredDays.length) {
        matchedRequirements.push(`Disponible todos los días requeridos: ${matchingDays.join(', ')}`);
        score += 25;
      } else {
        const missingDays = taskRequirements.requiredDays.filter(day => 
          !availableDays.includes(day.toLowerCase())
        );
        missingRequirements.push(`No disponible: ${missingDays.join(', ')}`);
        recommendations.push(`Agregar disponibilidad para: ${missingDays.join(', ')}`);
      }
    }

    // Verificar tiempo completo
    if (taskRequirements.requiresFullTime) {
      if (this.isFullTime()) {
        matchedRequirements.push('Empleado de tiempo completo');
        score += 20;
      } else {
        missingRequirements.push('Requiere empleo de tiempo completo');
        recommendations.push('Cambiar a empleo de tiempo completo');
      }
    }

    // Verificar disponibilidad de fines de semana
    if (taskRequirements.requiresWeekends) {
      const worksWeekends = this.worksOnDay('saturday') || this.worksOnDay('sunday');
      if (worksWeekends) {
        matchedRequirements.push('Disponible fines de semana');
        score += 15;
      } else {
        missingRequirements.push('Requiere disponibilidad de fines de semana');
        recommendations.push('Agregar disponibilidad de fin de semana');
      }
    }

    // Verificar horarios específicos
    if (taskRequirements.preferredTimeSlots) {
      const matchingSlots = taskRequirements.preferredTimeSlots.filter(slot =>
        this.isAvailableAt(slot.day, slot.startTime)
      );
      
      if (matchingSlots.length > 0) {
        matchedRequirements.push(`Disponible en ${matchingSlots.length} horarios preferidos`);
        score += 10;
      } else {
        recommendations.push('Ajustar horarios para coincidir con horarios preferidos');
      }
    }

    const available = missingRequirements.length === 0;

    return {
      available,
      score,
      matchedRequirements,
      missingRequirements,
      recommendations
    };
  }
}