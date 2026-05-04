
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AnalyticsClient } from "./analytics-client";
import { AlertCircle } from "lucide-react";
import { actors, roles } from "@/lib/in-memory-db";

export default async function AnalyticsPage() {
    // Access data directly in Server Components
    const allActors = [...actors];
    const allRoles = [...roles];

    if (!allActors.length || !allRoles.length) {
        return (
             <div className="container mx-auto">
                 <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Not Enough Data</AlertTitle>
                    <AlertDescription>
                        There is not enough actor or role data to display analytics. Please add more data.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }
    
  return <AnalyticsClient actors={allActors} roles={allRoles} />;
}
