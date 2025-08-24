export interface RoleRequirements {
  // Experiencia
  minimumYears?: number;
  requiredShelterExperience?: number;
  requiredBehaviorExperience?: number;
  
  // Competencias
  requiredExpertise?: string[];
  requiredLanguages?: string[];
  requiredAuthorizations?: string[];
  minimumExpertiseAreas?: number;
  minimumLanguages?: number;
  
  // Especialidades
  requiresEthologySpecialist?: boolean;
  requiresShelterMedicine?: boolean;
  requiredSpecialties?: string[];
  requiredCertifications?: string[];
  
  // Empleo
  requiresFullTime?: boolean;
  minimumHoursPerWeek?: number;
  requiredDays?: string[];
  requiresCurrentEmployment?: boolean;
}

export interface EvaluationResult {
  qualified: boolean;
  score: number;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
  matchedRequirements: string[];
  missingRequirements: string[];
}

export class VeterinarianEvaluationUtils {
  
  /**
   * Evaluación integral para cualquier rol
   */
  static evaluateForRole(
    veterinarianData: {
      experience?: any;
      skills?: any;
      specialty?: any;
      employee?: any;
      professional?: any;
    },
    requirements: RoleRequirements
  ): EvaluationResult {
    const strengths: string[] = [];
    const gaps: string[] = [];
    const recommendations: string[] = [];
    const matchedRequirements: string[] = [];
    const missingRequirements: string[] = [];
    let score = 0;

    // Evaluar experiencia
    if (veterinarianData.experience) {
      const expResult = this.evaluateExperience(veterinarianData.experience, requirements);
      score += expResult.score;
      strengths.push(...expResult.strengths);
      gaps.push(...expResult.gaps);
      recommendations.push(...expResult.recommendations);
    }

    // Evaluar competencias
    if (veterinarianData.skills) {
      const skillResult = this.evaluateSkills(veterinarianData.skills, requirements);
      score += skillResult.score;
      strengths.push(...skillResult.strengths);
      gaps.push(...skillResult.gaps);
      recommendations.push(...skillResult.recommendations);
    }

    // Evaluar especialidades
    if (veterinarianData.specialty) {
      const specResult = this.evaluateSpecialty(veterinarianData.specialty, requirements);
      score += specResult.score;
      strengths.push(...specResult.strengths);
      gaps.push(...specResult.gaps);
      recommendations.push(...specResult.recommendations);
    }

    // Evaluar empleo
    if (veterinarianData.employee) {
      const empResult = this.evaluateEmployment(veterinarianData.employee, requirements);
      score += empResult.score;
      strengths.push(...empResult.strengths);
      gaps.push(...empResult.gaps);
      recommendations.push(...empResult.recommendations);
    }

    const qualified = gaps.length === 0;

    return {
      qualified,
      score: Math.min(100, score),
      strengths: [...new Set(strengths)], // Eliminar duplicados
      gaps: [...new Set(gaps)],
      recommendations: [...new Set(recommendations)],
      matchedRequirements,
      missingRequirements
    };
  }

  private static evaluateExperience(experience: any, requirements: RoleRequirements) {
    // Lógica de evaluación de experiencia
    return { score: 0, strengths: [], gaps: [], recommendations: [] };
  }

  private static evaluateSkills(skills: any, requirements: RoleRequirements) {
    // Lógica de evaluación de competencias
    return { score: 0, strengths: [], gaps: [], recommendations: [] };
  }

  private static evaluateSpecialty(specialty: any, requirements: RoleRequirements) {
    // Lógica de evaluación de especialidades
    return { score: 0, strengths: [], gaps: [], recommendations: [] };
  }

  private static evaluateEmployment(employee: any, requirements: RoleRequirements) {
    // Lógica de evaluación de empleo
    return { score: 0, strengths: [], gaps: [], recommendations: [] };
  }
}