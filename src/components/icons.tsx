import { Award, Drama, Frown, Languages, Laugh, Mic, Music, Palette, PersonStanding, Smile, Swords, Target } from 'lucide-react';
import type { ReactElement } from 'react';

const SKILL_ICONS: Record<string, ReactElement> = {
  'fencing': <Swords className="h-4 w-4 text-muted-foreground" />,
  'stunts': <Award className="h-4 w-4 text-muted-foreground" />,
  'improvisation': <Drama className="h-4 w-4 text-muted-foreground" />,
  'singing': <Mic className="h-4 w-4 text-muted-foreground" />,
  'dancing': <Music className="h-4 w-4 text-muted-foreground" />,
  'judo': <Award className="h-4 w-4 text-muted-foreground" />,
  'method acting': <Drama className="h-4 w-4 text-muted-foreground" />,
  'horse riding': <PersonStanding className="h-4 w-4 text-muted-foreground" />,
  'archery': <Target className="h-4 w-4 text-muted-foreground" />,
  'comedy': <Laugh className="h-4 w-4 text-muted-foreground" />,
  'russian': <Languages className="h-4 w-4 text-muted-foreground" />,
  'combat training': <Award className="h-4 w-4 text-muted-foreground" />,
  'intimidation': <Frown className="h-4 w-4 text-muted-foreground" />,
};

const TRAIT_ICONS: Record<string, ReactElement> = {
  'charismatic': <Smile className="h-4 w-4 text-muted-foreground" />,
  'witty': <Laugh className="h-4 w-4 text-muted-foreground" />,
  'brave': <Award className="h-4 w-4 text-muted-foreground" />,
  'intense': <Frown className="h-4 w-4 text-muted-foreground" />,
  'graceful': <Palette className="h-4 w-4 text-muted-foreground" />,
  'mysterious': <Frown className="h-4 w-4 text-muted-foreground" />,
  'brooding': <Frown className="h-4 w-4 text-muted-foreground" />,
  'stoic': <PersonStanding className="h-4 w-4 text-muted-foreground" />,
  'loyal': <Award className="h-4 w-4 text-muted-foreground" />,
  'energetic': <Smile className="h-4 w-4 text-muted-foreground" />,
  'naive': <Smile className="h-4 w-4 text-muted-foreground" />,
  'resourceful': <Award className="h-4 w-4 text-muted-foreground" />,
  'cunning': <Award className="h-4 w-4 text-muted-foreground" />,
  'pragmatic': <Award className="h-4 w-4 text-muted-foreground" />,
};

const iconMap = { ...SKILL_ICONS, ...TRAIT_ICONS };

export function getIconForTerm(term: string): ReactElement {
  return iconMap[term.toLowerCase()] || <Award className="h-4 w-4 text-muted-foreground" />;
}
