import { NextResponse } from 'next/server';
import { actors, roles } from '@/lib/in-memory-db';

export async function GET(
  request: Request,
  { params }: { params: { roleId: string } }
) {
  try {
    const roleId = parseInt(params.roleId);
    
    const role = roles.find((r: any) => r.id === roleId);
    
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }
    
    // Calculate match scores
    const matches = actors.map((actor: any) => {
      const ageMatch = actor.age >= role.age_range_min && 
                       actor.age <= role.age_range_max ? 100 : 0;
      
      const physicalMatch = calculatePhysicalMatch(
        actor.physical_attributes,
        role.physical_requirements
      );
      
      const skillsMatch = calculateSkillsMatch(
        [...(actor.skills || []), ...(actor.emotional_traits || [])],
        [...(role.required_skills || []), ...(role.emotional_traits || [])]
      );
      
      const totalScore = Math.round(
        (ageMatch * 0.3) + (physicalMatch * 0.4) + (skillsMatch * 0.3)
      );
      
      return {
        actor: actor,
        score: {
          total: totalScore,
          age: ageMatch,
          physical: physicalMatch,
          skills: skillsMatch
        }
      };
    }).sort((a: any, b: any) => b.score.total - a.score.total);
    
    return NextResponse.json(matches);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function calculatePhysicalMatch(actorAttrs: any, roleReqs: any) {
  if (!roleReqs) return 50;
  
  const keys = Object.keys(roleReqs).filter(k => roleReqs[k]);
  if (keys.length === 0) return 100;
  
  const matches = keys.filter(key => actorAttrs[key] === roleReqs[key]).length;
  return (matches / keys.length) * 100;
}

function calculateSkillsMatch(actorSkills: string[], roleSkills: string[]) {
  if (!roleSkills || roleSkills.length === 0) return 100;
  
  const actorSkillsSet = new Set(actorSkills.map(s => s.toLowerCase()));
  const matches = roleSkills.filter(skill => 
    actorSkillsSet.has(skill.toLowerCase())
  ).length;
  
  return (matches / roleSkills.length) * 100;
}
