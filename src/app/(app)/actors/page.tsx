'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TalentTabs } from './talent-tabs';

export default function ActorManagementPage() {
  const [actorsData, setActorsData] = useState<any[]>([]);
  const [rolesData, setRolesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [actorsRes, rolesRes] = await Promise.all([
          fetch('/api/actors'),
          fetch('/api/roles'),
        ]);

        if (!actorsRes.ok) {
          throw new Error('Failed to load actors');
        }

        if (!rolesRes.ok) {
          throw new Error('Failed to load roles');
        }

        const actors = await actorsRes.json();
        const roles = await rolesRes.json();

        setActorsData(actors);
        setRolesData(roles);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <TalentTabs
      actors={actorsData}
      roles={rolesData}
    />
  );
}