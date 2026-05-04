
'use client';

import { TalentTabs } from "./talent-tabs";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Loader2 } from "lucide-react";

export default function ActorManagementPage() {
    const db = useFirestore();

    const actorsQuery = useMemoFirebase(() => {
      return query(collection(db, 'actors'), orderBy('createdAt', 'desc'));
    }, [db]);

    const rolesQuery = useMemoFirebase(() => {
      return query(collection(db, 'roles'), orderBy('createdAt', 'desc'));
    }, [db]);

    const { data: actorsData, isLoading: isLoadingActors } = useCollection(actorsQuery);
    const { data: rolesData, isLoading: isLoadingRoles } = useCollection(rolesQuery);

    if (isLoadingActors || isLoadingRoles) {
      return (
        <div className="flex h-[400px] w-full items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
    }

    return <TalentTabs actors={actorsData || []} roles={rolesData || []} />;
}
