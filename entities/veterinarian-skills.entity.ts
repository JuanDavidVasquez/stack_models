import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  OneToOne, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { Veterinarian } from "./veterinarian.entity";

@Entity('veterinarian_skills')
export class VeterinarianSkills {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // === COMPETENCIAS Y HABILIDADES ===
  @Column({
    type: 'json',
    nullable: true,
    comment: 'Areas of expertise'
  })
  areasOfExpertise?: string[];

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Languages spoken'
  })
  languages?: string[];

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Authorized to perform behavioral assessments'
  })
  behaviorAssessmentAuthorized!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Authorized to make adoption decisions'
  })
  adoptionDecisionAuthorized!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Authorized to prescribe behavioral medications'
  })
  behaviorMedicationAuthorized!: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Can provide second opinions on difficult cases'
  })
  secondOpinionProvider!: boolean;

  @OneToOne(() => Veterinarian, veterinarian => veterinarian.skills)
  veterinarian!: Veterinarian;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  // === MÉTODOS HELPER PARA COMPETENCIAS ===

  /**
   * Verifica si tiene un área de expertise específica
   */
  hasExpertise(area: string): boolean {
    if (!this.areasOfExpertise) return false;
    
    return this.areasOfExpertise.some(expertise => 
      expertise.toLowerCase().includes(area.toLowerCase())
    );
  }

  /**
   * Verifica si habla un idioma específico
   */
  speaksLanguage(language: string): boolean {
    if (!this.languages) return false;
    
    return this.languages.some(lang => 
      lang.toLowerCase().includes(language.toLowerCase())
    );
  }

  /**
   * Cuenta el número total de áreas de expertise
   */
  getExpertiseCount(): number {
    return this.areasOfExpertise?.length || 0;
  }

  /**
   * Cuenta el número de idiomas que habla
   */
  getLanguageCount(): number {
    return this.languages?.length || 0;
  }

  /**
   * Verifica si es multilingüe (más de un idioma)
   */
  isMultilingual(): boolean {
    return this.getLanguageCount() > 1;
  }

  /**
   * Obtiene nivel de autorización general
   */
  getAuthorizationLevel(): 'Basic' | 'Intermediate' | 'Advanced' | 'Expert' {
    let authCount = 0;
    
    if (this.behaviorAssessmentAuthorized) authCount++;
    if (this.adoptionDecisionAuthorized) authCount++;
    if (this.behaviorMedicationAuthorized) authCount++;
    if (this.secondOpinionProvider) authCount++;
    
    if (authCount === 0) return 'Basic';
    if (authCount === 1) return 'Intermediate';
    if (authCount <= 2) return 'Advanced';
    return 'Expert';
  }

  /**
   * Verifica si puede manejar casos comportamentales complejos
   */
  canHandleComplexBehavioralCases(): boolean {
    return this.behaviorAssessmentAuthorized && 
           this.behaviorMedicationAuthorized;
  }

  /**
   * Verifica si puede tomar decisiones completas de adopción
   */
  canMakeFullAdoptionDecisions(): boolean {
    return this.behaviorAssessmentAuthorized && 
           this.adoptionDecisionAuthorized;
  }

  /**
   * Verifica si es consultor senior (puede dar segundas opiniones)
   */
  isSeniorConsultant(): boolean {
    return this.secondOpinionProvider;
  }

  /**
   * Agrega nueva área de expertise
   */
  addExpertise(area: string): void {
    if (!this.areasOfExpertise) {
      this.areasOfExpertise = [];
    }
    
    // Verificar que no exista ya
    if (!this.hasExpertise(area)) {
      this.areasOfExpertise.push(area.trim());
    }
  }

  /**
   * Remueve área de expertise
   */
  removeExpertise(area: string): void {
    if (!this.areasOfExpertise) return;
    
    this.areasOfExpertise = this.areasOfExpertise.filter(expertise => 
      !expertise.toLowerCase().includes(area.toLowerCase())
    );
    
    if (this.areasOfExpertise.length === 0) {
      this.areasOfExpertise = undefined;
    }
  }

  /**
   * Agrega nuevo idioma
   */
  addLanguage(language: string): void {
    if (!this.languages) {
      this.languages = [];
    }
    
    // Verificar que no exista ya
    if (!this.speaksLanguage(language)) {
      this.languages.push(language.trim());
    }
  }

  /**
   * Remueve idioma
   */
  removeLanguage(language: string): void {
    if (!this.languages) return;
    
    this.languages = this.languages.filter(lang => 
      !lang.toLowerCase().includes(language.toLowerCase())
    );
    
    if (this.languages.length === 0) {
      this.languages = undefined;
    }
  }

  /**
   * Actualiza autorizaciones en lote
   */
  updateAuthorizations(authorizations: {
    behaviorAssessment?: boolean;
    adoptionDecision?: boolean;
    behaviorMedication?: boolean;
    secondOpinion?: boolean;
  }): void {
    if (authorizations.behaviorAssessment !== undefined) {
      this.behaviorAssessmentAuthorized = authorizations.behaviorAssessment;
    }
    if (authorizations.adoptionDecision !== undefined) {
      this.adoptionDecisionAuthorized = authorizations.adoptionDecision;
    }
    if (authorizations.behaviorMedication !== undefined) {
      this.behaviorMedicationAuthorized = authorizations.behaviorMedication;
    }
    if (authorizations.secondOpinion !== undefined) {
      this.secondOpinionProvider = authorizations.secondOpinion;
    }
  }

  /**
   * Obtiene todas las autorizaciones activas
   */
  getActiveAuthorizations(): string[] {
    const authorizations = [];
    
    if (this.behaviorAssessmentAuthorized) {
      authorizations.push('Evaluaciones comportamentales');
    }
    if (this.adoptionDecisionAuthorized) {
      authorizations.push('Decisiones de adopción');
    }
    if (this.behaviorMedicationAuthorized) {
      authorizations.push('Medicación comportamental');
    }
    if (this.secondOpinionProvider) {
      authorizations.push('Segundas opiniones');
    }
    
    return authorizations;
  }

  /**
   * Evalúa competencia para roles específicos
   */
  evaluateRoleCompetency(roleRequirements: {
    requiredExpertise?: string[];
    requiredLanguages?: string[];
    requiredAuthorizations?: ('behaviorAssessment' | 'adoptionDecision' | 'behaviorMedication' | 'secondOpinion')[];
    minimumExpertiseAreas?: number;
    minimumLanguages?: number;
    requiresMultilingual?: boolean;
  }): {
    qualified: boolean;
    score: number;
    strengths: string[];
    gaps: string[];
    recommendations: string[];
  } {
    const strengths = [];
    const gaps = [];
    const recommendations = [];
    let score = 0;

    // Evaluar expertise requerida
    if (roleRequirements.requiredExpertise) {
      const matchingExpertise = roleRequirements.requiredExpertise.filter(area =>
        this.hasExpertise(area)
      );
      
      if (matchingExpertise.length === roleRequirements.requiredExpertise.length) {
        strengths.push(`Todas las expertises requeridas: ${matchingExpertise.join(', ')}`);
        score += 30;
      } else {
        const missingExpertise = roleRequirements.requiredExpertise.filter(area =>
          !this.hasExpertise(area)
        );
        gaps.push(`Falta expertise en: ${missingExpertise.join(', ')}`);
        recommendations.push(`Desarrollar competencias en: ${missingExpertise.join(', ')}`);
      }
    }

    // Evaluar idiomas requeridos
    if (roleRequirements.requiredLanguages) {
      const matchingLanguages = roleRequirements.requiredLanguages.filter(lang =>
        this.speaksLanguage(lang)
      );
      
      if (matchingLanguages.length === roleRequirements.requiredLanguages.length) {
        strengths.push(`Todos los idiomas requeridos: ${matchingLanguages.join(', ')}`);
        score += 20;
      } else {
        const missingLanguages = roleRequirements.requiredLanguages.filter(lang =>
          !this.speaksLanguage(lang)
        );
        gaps.push(`Falta dominio de: ${missingLanguages.join(', ')}`);
        recommendations.push(`Aprender: ${missingLanguages.join(', ')}`);
      }
    }

    // Evaluar autorizaciones requeridas
    if (roleRequirements.requiredAuthorizations) {
      const authorizationMap = {
        behaviorAssessment: this.behaviorAssessmentAuthorized,
        adoptionDecision: this.adoptionDecisionAuthorized,
        behaviorMedication: this.behaviorMedicationAuthorized,
        secondOpinion: this.secondOpinionProvider
      };

      const missingAuthorizations = roleRequirements.requiredAuthorizations.filter(auth =>
        !authorizationMap[auth]
      );

      if (missingAuthorizations.length === 0) {
        strengths.push('Todas las autorizaciones requeridas');
        score += 25;
      } else {
        const authNames = {
          behaviorAssessment: 'Evaluaciones comportamentales',
          adoptionDecision: 'Decisiones de adopción',
          behaviorMedication: 'Medicación comportamental',
          secondOpinion: 'Segundas opiniones'
        };
        
        const missingNames = missingAuthorizations.map(auth => authNames[auth]);
        gaps.push(`Falta autorización para: ${missingNames.join(', ')}`);
        recommendations.push(`Obtener autorización para: ${missingNames.join(', ')}`);
      }
    }

    // Evaluar número mínimo de expertises
    if (roleRequirements.minimumExpertiseAreas) {
      const currentCount = this.getExpertiseCount();
      if (currentCount >= roleRequirements.minimumExpertiseAreas) {
        strengths.push(`${currentCount} áreas de expertise (≥${roleRequirements.minimumExpertiseAreas} requeridas)`);
        score += 10;
      } else {
        gaps.push(`Solo ${currentCount} áreas de expertise, requiere ${roleRequirements.minimumExpertiseAreas}`);
        recommendations.push('Desarrollar más áreas de especialización');
      }
    }

    // Evaluar número mínimo de idiomas
    if (roleRequirements.minimumLanguages) {
      const currentCount = this.getLanguageCount();
      if (currentCount >= roleRequirements.minimumLanguages) {
        strengths.push(`${currentCount} idiomas (≥${roleRequirements.minimumLanguages} requeridos)`);
        score += 10;
      } else {
        gaps.push(`Solo ${currentCount} idiomas, requiere ${roleRequirements.minimumLanguages}`);
        recommendations.push('Aprender idiomas adicionales');
      }
    }

    // Evaluar si requiere ser multilingüe
    if (roleRequirements.requiresMultilingual) {
      if (this.isMultilingual()) {
        strengths.push('Multilingüe');
        score += 5;
      } else {
        gaps.push('Requiere ser multilingüe');
        recommendations.push('Aprender al menos un idioma adicional');
      }
    }

    const qualified = gaps.length === 0;

    return { qualified, score, strengths, gaps, recommendations };
  }

  /**
   * Busca expertise que coincida con términos
   */
  findMatchingExpertise(searchTerms: string[]): string[] {
    if (!this.areasOfExpertise) return [];
    
    return this.areasOfExpertise.filter(expertise =>
      searchTerms.some(term =>
        expertise.toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  /**
   * Verifica si puede manejar comunicación internacional
   */
  canHandleInternationalCommunication(): boolean {
    return this.isMultilingual() || this.speaksLanguage('english');
  }

  /**
   * Obtiene competencias relacionadas con comportamiento animal
   */
  getBehavioralCompetencies(): {
    hasAssessmentSkills: boolean;
    canPrescribeMedication: boolean;
    canMakeDecisions: boolean;
    canProvideSecondOpinion: boolean;
    competencyLevel: string;
  } {
    return {
      hasAssessmentSkills: this.behaviorAssessmentAuthorized,
      canPrescribeMedication: this.behaviorMedicationAuthorized,
      canMakeDecisions: this.adoptionDecisionAuthorized,
      canProvideSecondOpinion: this.secondOpinionProvider,
      competencyLevel: this.getAuthorizationLevel()
    };
  }

  /**
   * Genera resumen completo de competencias
   */
  getCompetencyReport(): {
    expertise: {
      areas: string[];
      count: number;
      behaviorRelated: string[];
    };
    languages: {
      spoken: string[];
      count: number;
      isMultilingual: boolean;
      canHandleInternational: boolean;
    };
    authorizations: {
      active: string[];
      level: string;
      behaviorCompetencies: any;
    };
    overallProfile: {
      isSpecialist: boolean;
      isSeniorLevel: boolean;
      recommendedRoles: string[];
    };
  } {
    const behaviorKeywords = ['behavior', 'behavioural', 'ethology', 'training', 'assessment'];
    const behaviorRelatedExpertise = this.findMatchingExpertise(behaviorKeywords);
    
    const recommendedRoles = [];
    if (this.canHandleComplexBehavioralCases()) {
      recommendedRoles.push('Especialista en Comportamiento Animal');
    }
    if (this.canMakeFullAdoptionDecisions()) {
      recommendedRoles.push('Coordinador de Adopciones');
    }
    if (this.isSeniorConsultant()) {
      recommendedRoles.push('Consultor Senior');
    }
    if (this.isMultilingual()) {
      recommendedRoles.push('Especialista en Comunicación Internacional');
    }

    return {
      expertise: {
        areas: this.areasOfExpertise || [],
        count: this.getExpertiseCount(),
        behaviorRelated: behaviorRelatedExpertise
      },
      languages: {
        spoken: this.languages || [],
        count: this.getLanguageCount(),
        isMultilingual: this.isMultilingual(),
        canHandleInternational: this.canHandleInternationalCommunication()
      },
      authorizations: {
        active: this.getActiveAuthorizations(),
        level: this.getAuthorizationLevel(),
        behaviorCompetencies: this.getBehavioralCompetencies()
      },
      overallProfile: {
        isSpecialist: this.getExpertiseCount() > 2,
        isSeniorLevel: this.getAuthorizationLevel() === 'Expert' || this.secondOpinionProvider,
        recommendedRoles
      }
    };
  }

  /**
   * Compara competencias con otro veterinario
   */
  compareWith(otherSkills: VeterinarianSkills): {
    expertiseComparison: {
      unique: string[];
      shared: string[];
      missing: string[];
    };
    languageComparison: {
      unique: string[];
      shared: string[];
      missing: string[];
    };
    authorizationComparison: {
      thisAdvantages: string[];
      otherAdvantages: string[];
      shared: string[];
    };
  } {
    const thisExpertise = this.areasOfExpertise || [];
    const otherExpertise = otherSkills.areasOfExpertise || [];
    
    const thisLanguages = this.languages || [];
    const otherLanguages = otherSkills.languages || [];
    
    const thisAuths = this.getActiveAuthorizations();
    const otherAuths = otherSkills.getActiveAuthorizations();

    return {
      expertiseComparison: {
        unique: thisExpertise.filter(exp => !otherExpertise.includes(exp)),
        shared: thisExpertise.filter(exp => otherExpertise.includes(exp)),
        missing: otherExpertise.filter(exp => !thisExpertise.includes(exp))
      },
      languageComparison: {
        unique: thisLanguages.filter(lang => !otherLanguages.includes(lang)),
        shared: thisLanguages.filter(lang => otherLanguages.includes(lang)),
        missing: otherLanguages.filter(lang => !thisLanguages.includes(lang))
      },
      authorizationComparison: {
        thisAdvantages: thisAuths.filter(auth => !otherAuths.includes(auth)),
        otherAdvantages: otherAuths.filter(auth => !thisAuths.includes(auth)),
        shared: thisAuths.filter(auth => otherAuths.includes(auth))
      }
    };
  }
}