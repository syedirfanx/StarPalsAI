
'use client'

import Image from 'next/image';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getIconForTerm } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Globe, Loader2, Wand2, ArrowLeft, Trash, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Actor, Role } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { calculateCompatibilityScore } from '@/lib/matching';
import { RoleCard } from '@/components/role-card';

type AnalysisResult = {
  loading: boolean;
  score?: number;
  analysis?: string;
};

type MatchingRole = {
    role: Role;
    score: number;
}

export default function ActorDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [actor, setActor] = useState<Actor | null>(null);
  const [matchingRoles, setMatchingRoles] = useState<MatchingRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFindingRoles, setIsFindingRoles] = useState(false);

  useEffect(() => {
    async function fetchData() {
        try {
            setLoading(true);
            const res = await fetch(`/api/actors/${params.id}`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch actor');
            const currentActor: Actor = await res.json();
            
            if (currentActor) {
                setActor(currentActor);
            } else {
                notFound();
            }
        } catch(e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }
    if (params.id) {
        fetchData();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!actor) return;
    try {
      const response = await fetch(`/api/actors/${actor.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete actor');
      }
      toast({
        title: 'Actor Deleted',
        description: `${actor.name} has been removed from the database.`,
      });
      router.push('/actors');
      router.refresh();
    } catch (e: any) {
      toast({
        title: 'Deletion Failed',
        description: e.message,
        variant: 'destructive',
      });
    }
  };

  const handleFindMatchingRoles = async () => {
    if (!actor) return;
    setIsFindingRoles(true);
    setMatchingRoles([]);
    try {
        const res = await fetch('/api/roles', { cache: 'no-store' });
        if (!res.ok) throw new Error('Could not fetch roles for matching.');
        const allRoles: Role[] = await res.json();
        
        const scoredRoles = allRoles.map(role => ({
            role,
            score: calculateCompatibilityScore(actor, role).total
        })).filter(r => r.score > 40)
           .sort((a,b) => b.score - a.score)
           .slice(0, 10);
           
        setMatchingRoles(scoredRoles);
        toast({
            title: "Found Matching Roles!",
            description: `Found ${scoredRoles.length} potential roles for ${actor.name}.`
        })

    } catch (e: any) {
        toast({
            title: "Couldn't Find Matches",
            description: e.message,
            variant: "destructive",
        })
    } finally {
        setIsFindingRoles(false);
    }
  }


  if (loading) {
      return (
        <div className="container mx-auto space-y-8">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="flex flex-col md:flex-row gap-8 items-start">
                <Skeleton className="h-[200px] w-[200px] rounded-xl" />
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-8 w-1/3" />
                </div>
            </div>
             <div className="grid md:grid-cols-2 gap-8">
                <Card><CardHeader><Skeleton className="h-6 w-1/2"/></CardHeader><CardContent><Skeleton className="h-20 w-full" /></CardContent></Card>
                <Card><CardHeader><Skeleton className="h-6 w-1/2"/></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent></Card>
             </div>
        </div>
      )
  }

  if (error || !actor) {
    return <div className="text-destructive text-center">{error || "Actor not found."}</div>;
  }
  
  const allTraits = [...actor.skills, ...actor.emotional_traits];

  return (
    <div className="container mx-auto space-y-8">
        <Button variant="outline" size="sm" onClick={() => router.push('/actors')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Talent List
        </Button>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Image
          src={actor.image_url}
          alt={`Headshot of ${actor.name}`}
          width={200}
          height={200}
          className="rounded-xl aspect-square object-cover border-4 border-card"
          data-ai-hint="person headshot"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-headline font-bold">{actor.name}</h1>
          <p className="text-xl text-muted-foreground">{actor.age} years old</p>
          <div className='flex items-center gap-2 mt-4'>
             {actor.portfolio_url && (
                <Button variant="link" asChild className="px-0">
                <a href={actor.portfolio_url} target="_blank" rel="noopener noreferrer">
                    <Globe className="mr-2 h-4 w-4" />
                    View Portfolio
                </a>
                </Button>
              )}
             <Button variant="outline" asChild>
                <Link href={`/actors/${actor.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4"/> Edit
                </Link>
             </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive"><Trash className="mr-2 h-4 w-4"/> Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the profile for <strong>{actor.name}</strong>.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className='bg-destructive hover:bg-destructive/90'>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="mt-6">
            <h3 className="font-headline text-lg font-semibold mb-2">Physical Attributes</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(actor.physical_attributes).map(([key, value]) => (
                <Badge key={key} variant="secondary">{`${key.replace(/_/g, ' ')}: ${value}`}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Skills & Traits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allTraits.map((trait) => (
              <Badge key={trait} variant="outline" className="gap-1.5">
                {getIconForTerm(trait)}
                {trait}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

       <Card className="md:col-span-3">
        <CardHeader>
            <div className='flex justify-between items-center'>
                <div>
                    <CardTitle className="font-headline">Find Matching Roles</CardTitle>
                    <CardDescription>Find roles in the database that are a good fit for {actor.name}.</CardDescription>
                </div>
                <Button onClick={handleFindMatchingRoles} disabled={isFindingRoles}>
                    {isFindingRoles ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                    Find Roles
                </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            {isFindingRoles && <div className='flex justify-center items-center h-40'><Loader2 className='h-8 w-8 animate-spin text-primary' /></div>}
            
            {!isFindingRoles && matchingRoles.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matchingRoles.map(({role, score}) => (
                       <RoleCard key={role.id} role={role} compatibilityScore={score}/>
                    ))}
                </div>
            )}
             {!isFindingRoles && matchingRoles.length === 0 && (
                <p className="text-sm text-muted-foreground text-center p-4">Click "Find Roles" to see potential matches.</p>
            )}
        </CardContent>
    </Card>
    </div>
  );
}
