
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Actor, CompatibilityScore } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';


export function ActorCard({ actor, score }: { actor: Actor; score?: CompatibilityScore }) {
  const displaySkills = actor.skills.slice(0, 3);
  
  const getScoreColor = (scoreValue: number) => {
    if (scoreValue >= 80) return 'text-green-400';
    if (scoreValue >= 60) return 'text-yellow-400';
    if (scoreValue >= 40) return 'text-orange-400';
    return 'text-red-500';
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-300">
       <CardHeader className="flex-row gap-4 items-start">
        <Link href={`/actors/${actor.id}`} className="relative h-24 w-24 shrink-0">
            <Image
                src={actor.image_url}
                alt={`Headshot of ${actor.name}`}
                fill
                className="rounded-lg object-cover"
                data-ai-hint="person headshot"
            />
        </Link>
        <div className="flex-1">
          <CardTitle className="text-xl font-bold hover:underline">
            <Link href={`/actors/${actor.id}`}>{actor.name}</Link>
          </CardTitle>
          <CardDescription>{actor.age} years old</CardDescription>
           <div className="flex flex-wrap gap-2 mt-2">
            {displaySkills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
       {score && (
        <CardContent className="flex-grow space-y-3">
            <div className='text-center mb-4'>
                <span className={cn("text-6xl font-bold", getScoreColor(score.total))}>
                    {score.total}
                </span>
                <span className={cn("text-2xl font-semibold text-muted-foreground", getScoreColor(score.total))}>
                    %
                </span>
                <p className="text-sm font-medium text-muted-foreground">Compatibility Score</p>
            </div>
            <div className="space-y-2 text-xs">
                <div>
                    <div className="flex justify-between mb-1">
                        <span>Age Match</span>
                        <span>{Math.round(score.age)}%</span>
                    </div>
                    <Progress value={score.age} className="h-1.5" />
                </div>
                 <div>
                    <div className="flex justify-between mb-1">
                        <span>Physical Match</span>
                        <span>{Math.round(score.physical)}%</span>
                    </div>
                    <Progress value={score.physical} className="h-1.5" />
                </div>
                 <div>
                    <div className="flex justify-between mb-1">
                        <span>Skills & Traits</span>
                        <span>{Math.round(score.skills)}%</span>
                    </div>
                    <Progress value={score.skills} className="h-1.5" />
                </div>
            </div>
        </CardContent>
      )}
      <CardFooter>
        <Button asChild className="w-full" variant="outline">
            <Link href={`/actors/${actor.id}`}>View Full Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
