import { 
  AfterLoad, 
  Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn, 
  UpdateDateColumn 
} from "typeorm";
import { PetType } from "../enums/pet.enum";
import { PetPhysicalProfile } from './pet-physical-profile.entity';
import { PetNutritionProfile } from './pet-nutrition-profile.entity';
import { PetActivityProfile } from './pet-activity-profile.entity';
import { PetBehaviorProfile } from './pet-behavior-profile.entity';
import { PetAdoptionProfile } from './pet-adoption-profile.entity';

@Entity('pets')
export class Pet {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        comment: "The name of the pet"
    })
    name!: string;

    @Column({
        type: "enum",
        enum: PetType,
        default: PetType.DOG,
        comment: "The type of the pet"
    })
    type!: PetType;

    @Column({
        type: "int",
        comment: "The age of the pet in months"
    })
    age!: number;

    @Column({
        comment: "The image URL of the pet"
    })
    image!: string;

    @Column({
        type: "text",
        nullable: true,
        comment: "General description or notes about the pet"
    })
    description?: string;

    @Column({
        nullable: true,
        comment: "The breed of the pet"
    })
    breed?: string;

    @Column({
        type: "enum",
        enum: ["male", "female"],
        nullable: true,
        comment: "The gender of the pet"
    })
    gender?: "male" | "female";

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @DeleteDateColumn()
    deletedAt?: Date | null;

    // Relaciones One-to-One
    @OneToOne(() => PetPhysicalProfile, physicalProfile => physicalProfile.pet, { 
        cascade: true,
        eager: false 
    })
    physicalProfile?: PetPhysicalProfile;

    @OneToOne(() => PetNutritionProfile, nutritionProfile => nutritionProfile.pet, { 
        cascade: true,
        eager: false 
    })
    nutritionProfile?: PetNutritionProfile;

    @OneToOne(() => PetActivityProfile, activityProfile => activityProfile.pet, { 
        cascade: true,
        eager: false 
    })
    activityProfile?: PetActivityProfile;

    @OneToOne(() => PetBehaviorProfile, behaviorProfile => behaviorProfile.pet, { 
        cascade: true,
        eager: false 
    })
    behaviorProfile?: PetBehaviorProfile;

    @OneToOne(() => PetAdoptionProfile, adoptionProfile => adoptionProfile.pet, { 
        cascade: true,
        eager: false 
    })
    adoptionProfile?: PetAdoptionProfile;

    // Relaciones One-to-Many
   /*  @OneToMany(() => BehaviorAssessment, assessment => assessment.pet, { 
        cascade: true 
    })
    behaviorAssessments?: BehaviorAssessment[]; */

    @AfterLoad()
    setImageUrl() {
        this.image = this.image ? this.image : 'www.test.com/default-image.png';
    }

    // Método helper para obtener la edad en años
    getAgeInYears(): number {
        return Math.floor(this.age / 12);
    }

    // Método helper para obtener meses restantes
    getAgeMonthsRemainder(): number {
        return this.age % 12;
    }

    // Método helper para formato de edad legible
    getFormattedAge(): string {
        const years = this.getAgeInYears();
        const months = this.getAgeMonthsRemainder();
        
        if (years === 0) {
            return `${months} ${months === 1 ? 'mes' : 'meses'}`;
        } else if (months === 0) {
            return `${years} ${years === 1 ? 'año' : 'años'}`;
        } else {
            return `${years} ${years === 1 ? 'año' : 'años'} y ${months} ${months === 1 ? 'mes' : 'meses'}`;
        }
    }
}