
export interface Actor {
  id: string;
  ownerId: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  physicalAttributes: {
    height: string;
    build: string;
    hairColor: string;
    eyeColor: string;
  };
  skills: string[];
  emotionalTraits: string[];
  portfolioUrl?: string;
  imageUrl: string;
  createdAt: string;
}

export interface Role {
  id: string;
  ownerId: string;
  projectName: string;
  characterName: string;
  ageRangeMin: number;
  ageRangeMax: number;
  gender: 'male' | 'female' | 'any';
  physicalRequirements: {
    height?: string;
    build?: string;
    hairColor?: string;
    eyeColor?: string;
  };
  requiredSkills: string[];
  emotionalTraits: string[];
  genre: string;
  description: string;
  createdAt: string;
}

export interface CompatibilityScore {
  total: number;
  age: number;
  physical: number;
  skills: number;
}
