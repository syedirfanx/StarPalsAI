
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Role } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { getIconForTerm } from './icons';

export function RoleCard({ role, compatibilityScore }: { role: Role, compatibilityScore?: number }) {
    const displaySkills = role.required_skills.slice(0, 3);

  return (
      <Card className="h-full flex flex-col hover:border-primary transition-colors">
        <CardHeader>
          <div className='flex justify-between items-start'>
            <div>
              <CardDescription>{role.project_name}</CardDescription>
              <CardTitle className="text-xl font-bold">{role.character_name}</CardTitle>
            </div>
            {compatibilityScore && (
                <Badge className='text-lg'>{compatibilityScore}%</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow">
           <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                    Age: {role.age_range_min}-{role.age_range_max}
                </Badge>
                 <Badge variant="outline">
                    Gender: {role.gender.charAt(0).toUpperCase() + role.gender.slice(1)}
                </Badge>
                 <Badge variant="secondary">{role.genre}</Badge>
           </div>
           <div>
              <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Top Requirements</h4>
              <div className="flex flex-wrap gap-1">
                {displaySkills.map(skill => (
                    <Badge key={skill} variant="outline" className="font-normal gap-1">
                        {getIconForTerm(skill)}
                        {skill}
                    </Badge>
                ))}
                {role.required_skills.length > 3 && (
                    <Badge variant="outline" className="font-normal">...</Badge>
                )}
              </div>
           </div>
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full" variant="secondary">
                <Link href={`/roles/${role.id}`}>View Details & Matches</Link>
            </Button>
        </CardFooter>
      </Card>
  );
}
