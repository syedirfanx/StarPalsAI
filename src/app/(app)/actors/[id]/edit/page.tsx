
'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { ActorForm } from '@/components/actor-form';
import type { Actor } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export default function EditActorPage() {
  const params = useParams();
  const [actor, setActor] = useState<Actor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;

    async function fetchActor() {
      try {
        const res = await fetch(`/api/actors/${params.id}`);
        if (!res.ok) {
          throw new Error('Actor not found');
        }
        const data = await res.json();
        setActor(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchActor();
  }, [params.id]);

  if (loading) {
    return (
        <div className='container mx-auto'>
            <div className="mb-6">
                <Skeleton className='h-8 w-1/3'/>
                <Skeleton className='h-4 w-1/2 mt-2'/>
            </div>
            <Card>
                <CardContent className='p-6 space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                        <Skeleton className='h-10 w-full' />
                        <Skeleton className='h-10 w-full' />
                    </div>
                     <Skeleton className='h-10 w-full' />
                     <Skeleton className='h-20 w-full' />
                </CardContent>
            </Card>
        </div>
    )
  }

  if (error) {
    return notFound();
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Actor Profile</h1>
        <p className="text-muted-foreground">Update the details for {actor?.name}.</p>
      </div>
      {actor && <ActorForm initialData={actor} />}
    </div>
  );
}
