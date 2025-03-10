
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: string;
}

const DrawCard = ({ title, description, href, icon: Icon, color = "primary" }: DrawCardProps) => {
  const colorVariants = {
    primary: "from-blue-500 to-blue-600",
    secondary: "from-cyan-500 to-cyan-600",
    accent: "from-purple-500 to-violet-600",
    warning: "from-amber-500 to-amber-600",
  };

  return (
    <Link 
      to={href}
      className="block card-hover"
    >
      <div className="relative rounded-xl overflow-hidden bg-white dark:bg-card shadow-md h-full">
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r opacity-90" 
          style={{ backgroundImage: `linear-gradient(to right, hsl(var(--primary)), hsl(var(--accent)))` }} />
          
        <div className="p-6 pt-8 relative z-10 h-full flex flex-col">
          <div 
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-lg -mt-10 mb-4 shadow-lg bg-gradient-to-br",
              colorVariants[color as keyof typeof colorVariants] || colorVariants.primary
            )}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm flex-grow">{description}</p>
          
          <div className="flex justify-end mt-4">
            <span className="text-primary text-sm font-medium inline-flex items-center">
              Iniciar sorteio
              <svg className="ml-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DrawCard;
