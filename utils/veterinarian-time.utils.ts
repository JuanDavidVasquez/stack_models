export class VeterinarianTimeUtils {
  
  /**
   * Calcula días entre dos fechas
   */
  static daysBetween(startDate: Date, endDate?: Date): number {
    const end = endDate || new Date();
    const diffTime = Math.abs(end.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Calcula meses entre fechas
   */
  static monthsBetween(startDate: Date, endDate?: Date): number {
    const days = this.daysBetween(startDate, endDate);
    return Math.round(days / 30.44);
  }

  /**
   * Calcula años entre fechas
   */
  static yearsBetween(startDate: Date, endDate?: Date): number {
    const months = this.monthsBetween(startDate, endDate);
    return Math.round(months / 12 * 10) / 10;
  }

  /**
   * Convierte tiempo HH:MM a minutos
   */
  static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Calcula horas entre dos tiempos
   */
  static hoursBetweenTimes(startTime: string, endTime: string): number {
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);
    
    let duration = end - start;
    if (duration < 0) {
      duration += 24 * 60; // Trabajo nocturno
    }
    
    return duration / 60;
  }

  /**
   * Verifica si fecha está próxima a vencer
   */
  static isExpiringSoon(expirationDate: Date, daysThreshold: number = 30): boolean {
    const daysUntil = this.daysBetween(new Date(), expirationDate);
    return daysUntil <= daysThreshold && daysUntil > 0;
  }
}
