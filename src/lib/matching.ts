
import type { Actor, Role, CompatibilityScore } from './types';

export function calculateCompatibilityScore(actor: Actor, role: Role): CompatibilityScore {
  // 0. Gender Match (Hard Filter)
  if (role.gender && role.gender !== 'any' && actor.gender !== role.gender) {
    return { total: 0, age: 0, physical: 0, skills: 0 };
  }

  // 1. Age Match (30%)
  const ageScore =
    actor.age >= role.age_range_min && actor.age <= role.age_range_max ? 100 : 0;

  // 2. Physical Attributes (40%)
  const requiredAttributes = Object.entries(role.physical_requirements).filter(
    ([_, value]) => value
  );
  let physicalScore: number;
  if (requiredAttributes.length === 0) {
    // If no physical requirements, this is a perfect match.
    physicalScore = 100;
  } else {
    let matchingKeys = 0;
    for (const [key, value] of requiredAttributes) {
      if (
        actor.physical_attributes[key as keyof typeof actor.physical_attributes]?.toLowerCase() === value?.toLowerCase()
      ) {
        matchingKeys++;
      }
    }
    physicalScore = (matchingKeys / requiredAttributes.length) * 100;
  }

  // 3. Skills & Traits (30%)
  const requiredItems = [...role.required_skills, ...role.emotional_traits];
  let skillsAndTraitsScore: number;
  if (requiredItems.length === 0) {
    // If no required skills/traits, this is a perfect match.
    skillsAndTraitsScore = 100;
  } else {
    const actorItems = new Set([
      ...actor.skills.map(s => s.toLowerCase()),
      ...actor.emotional_traits.map(t => t.toLowerCase()),
    ]);
    let matchingItems = 0;
    for (const item of requiredItems) {
      if (actorItems.has(item.toLowerCase())) {
        matchingItems++;
      }
    }
    skillsAndTraitsScore = (matchingItems / requiredItems.length) * 100;
  }

  // Final Weighted Score
  const finalScore =
    ageScore * 0.3 + physicalScore * 0.4 + skillsAndTraitsScore * 0.3;

  return {
    total: Math.round(finalScore),
    age: ageScore,
    physical: physicalScore,
    skills: skillsAndTraitsScore
  };
}
