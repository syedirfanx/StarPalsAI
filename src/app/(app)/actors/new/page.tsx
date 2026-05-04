'use client';

import { ActorForm } from '@/components/actor-form';

export default function NewActorPage() {
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Add New Actor</h1>
        <p className="text-muted-foreground">Fill in the details for the new actor profile.</p>
      </div>
      <ActorForm />
    </div>
  );
}
