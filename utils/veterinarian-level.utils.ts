
export type ExperienceLevel = 'Entry' | 'Junior' | 'Mid-Level' | 'Senior' | 'Expert' | 'Master';
export type AuthorizationLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';
export type SpecializationLevel = 'General' | 'Specialist' | 'Multi-Specialist' | 'Expert';

export class VeterinarianLevelUtils {

  /**
   * Calcula nivel de experiencia basado en años
   */
  static getExperienceLevel(years: number): ExperienceLevel {
    if (years < 1) return 'Entry';
    if (years < 3) return 'Junior';
    if (years < 7) return 'Mid-Level';
    if (years < 12) return 'Senior';
    if (years < 20) return 'Expert';
    return 'Master';
  }
  static calculateSuccessRate(successes: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((successes / total) * 100);
  }

  static getPerformanceLevel(successRate: number, accuracyRate: number): 'Low' | 'Medium' | 'High' | 'Excellent' {
    const avgPerformance = (successRate + accuracyRate) / 2;

    if (avgPerformance >= 90) return 'Excellent';
    if (avgPerformance >= 75) return 'High';
    if (avgPerformance >= 60) return 'Medium';
    return 'Low';
  }
  /**
   * Calcula nivel de autorización basado en permisos
   */
  static getAuthorizationLevel(authorizations: {
    behaviorAssessment?: boolean;
    adoptionDecision?: boolean;
    behaviorMedication?: boolean;
    secondOpinion?: boolean;
  }): AuthorizationLevel {
    let count = 0;
    Object.values(authorizations).forEach(auth => auth && count++);

    if (count === 0) return 'Basic';
    if (count === 1) return 'Intermediate';
    if (count <= 2) return 'Advanced';
    return 'Expert';
  }

  /**
   * Calcula nivel de especialización
   */
  static getSpecializationLevel(
    specialtyCount: number,
    certificationCount: number
  ): SpecializationLevel {
    if (specialtyCount === 1 && certificationCount === 0) return 'General';
    if (specialtyCount === 1 || certificationCount <= 2) return 'Specialist';
    if (specialtyCount <= 3 || certificationCount <= 5) return 'Multi-Specialist';
    return 'Expert';
  }

  /**
   * Calcula nivel general combinado
   */
  static getOverallLevel(
    experienceYears: number,
    authorizationCount: number,
    specialtyCount: number
  ): 'Junior' | 'Mid-Level' | 'Senior' | 'Expert' {
    const expLevel = this.getExperienceLevel(experienceYears);
    const authLevel = this.getAuthorizationLevel({
      behaviorAssessment: authorizationCount > 0,
      adoptionDecision: authorizationCount > 1,
      behaviorMedication: authorizationCount > 2,
      secondOpinion: authorizationCount > 3
    });

    // Lógica combinada para determinar nivel general
    const levelScores = {
      'Entry': 1, 'Junior': 2, 'Mid-Level': 3, 'Senior': 4, 'Expert': 5, 'Master': 6,
      'Basic': 1, 'Intermediate': 2, 'Advanced': 3
    };

    const avgScore = (levelScores[expLevel] + levelScores[authLevel] + specialtyCount) / 3;

    if (avgScore < 2) return 'Junior';
    if (avgScore < 3.5) return 'Mid-Level';
    if (avgScore < 5) return 'Senior';
    return 'Expert';
  }
}