
'use client'

import { ActorCard } from '@/components/actor-card';
import { notFound, useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getIconForTerm } from '@/components/icons';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Edit, Trash, ArrowLeft } from 'lucide-react';
import type { Actor, Role, CompatibilityScore } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

type ScoredActor = {
    actor: Actor;
    score: CompatibilityScore;
};

export default function RoleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [role, setRole] = useState<Role | null>(null);
  const [scoredActors, setScoredActors] = useState<ScoredActor[]>([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleId = params.id as string;

  useEffect(() => {
    async function getRole() {
        setLoading(true);
        try {
            const rolesRes = await fetch(`/api/roles/${roleId}`, { cache: 'no-store' });
            if (!rolesRes.ok) throw new Error('Failed to fetch role');
            const roleData: Role = await rolesRes.json();
            setRole(roleData);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    if(roleId) getRole();
  }, [roleId]);

  const handleRunMatching = async () => {
    setMatching(true);
    setError(null);
    try {
        const matchRes = await fetch(`/api/match/${roleId}`, { cache: 'no-store' });
        if (!matchRes.ok) throw new Error('Failed to fetch matches');
        const scoredActorsData = await matchRes.json();
        setScoredActors(scoredActorsData);
    } catch (error: any) {
        setError(error.message);
    } finally {
        setMatching(false);
    }
  }

  const handleDelete = async () => {
    if (!role) return;
    try {
      const response = await fetch(`/api/roles/${role.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete role');
      toast({
        title: 'Role Deleted',
        description: `The role for ${role.character_name} has been removed.`,
      });
      router.push('/actors?tab=roles');
      router.refresh();
    } catch (e: any) {
      toast({
        title: 'Deletion Failed',
        description: e.message,
        variant: 'destructive',
      });
    }
  };


  if (loading) {
    return <div className="container mx-auto"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  if (error && !role) {
    return (
        <div className="container mx-auto">
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    )
  }

  if (!role) {
    notFound();
  }

  const filteredActors = scoredActors.filter((match) => match.score.total > 20);
  const allRequirements = [...role.required_skills, ...role.emotional_traits];

  return (
    <div className="container mx-auto space-y-8">
        <Button variant="outline" size="sm" onClick={() => router.push('/actors?tab=roles')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Roles List
        </Button>
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky lg:top-20 space-y-6">
            <Card>
                 <CardHeader>
                    <CardDescription>{role.project_name}</CardDescription>
                    <CardTitle className="text-3xl font-bold">{role.character_name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <p className="text-card-foreground/80">{role.description}</p>
                    <div>
                        <h4 className="font-semibold mb-2">Role Requirements</h4>
                         <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">Age: {role.age_range_min}-{role.age_range_max}</Badge>
                          <Badge variant="outline">Gender: {role.gender.charAt(0).toUpperCase() + role.gender.slice(1)}</Badge>
                           <Badge variant="secondary">{role.genre}</Badge>
                          {Object.entries(role.physical_requirements).map(([key, value]) => value && (
                            <Badge key={key} variant="outline">{`${key.replace('_', ' ')}: ${value}`}</Badge>
                          ))}
                          {allRequirements.map((req) => (
                            <Badge key={req} variant="outline" className="gap-1.5">
                              {getIconForTerm(req)}
                              {req}
                            </Badge>
                          ))}
                        </div>
                    </div>
                    <div className='flex gap-2 pt-4'>
                         <Button size="lg" className="w-full" onClick={handleRunMatching} disabled={matching}>
                            {matching ? <Loader2 className="mr-2 animate-spin"/> : <Wand2 className="mr-2" />}
                            Run Matching
                        </Button>
                        <Button asChild variant="secondary"><Link href={`/roles/${roleId}/edit`}><Edit/></Link></Button>
                        <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive"><Trash/></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this role.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>

                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <h2 className="text-3xl font-headline font-bold mb-6">Top Actor Matches</h2>
             {matching ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Card><CardContent className="p-4"><Skeleton className="h-48 w-full"/></CardContent></Card>
                     <Card><CardContent className="p-4"><Skeleton className="h-48 w-full"/></CardContent></Card>
                 </div>
             ) : error ? (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Matching Failed</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
             ) : filteredActors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredActors.map(({ actor, score }) => (
                    <ActorCard key={actor.id} actor={actor} score={score} />
                ))}
                </div>
            ) : (
                <Card className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Run matching to find compatible actors.</p>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
