
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
    primary: "from-blue-500 to-blue-700",
    secondary: "from-cyan-400 to-cyan-600",
    accent: "from-violet-500 to-purple-600",
    warning: "from-amber-400 to-orange-500",
    destructive: "from-red-500 to-red-700",
  };

  const bgGradients = {
    primary: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10",
    secondary: "from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/10",
    accent: "from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/10",
    warning: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-orange-900/10",
    destructive: "from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10",
  };

  return (
    <Link 
      to={href}
      className="block card-hover"
    >
      <div className={cn(
        "relative rounded-xl overflow-hidden h-full bg-gradient-to-br border",
        bgGradients[color as keyof typeof bgGradients] || bgGradients.primary,
        "border-gray-200 dark:border-gray-800"
      )}>
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b" 
          style={{ backgroundImage: `linear-gradient(to bottom, hsl(var(--${color})), transparent)` }} />
          
        <div className="p-7 relative z-10 h-full flex flex-col">
          <div 
            className={cn(
              "flex items-center justify-center w-14 h-14 rounded-lg mb-5 shadow-lg bg-gradient-to-br",
              colorVariants[color as keyof typeof colorVariants] || colorVariants.primary
            )}
          >
            <Icon className="w-7 h-7 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold mb-3">{title}</h3>
          <p className="text-muted-foreground text-sm flex-grow mb-4">{description}</p>
          
          <div className="flex justify-end mt-auto">
            <span className={cn(
              "text-sm font-medium inline-flex items-center",
              color === 'primary' && "text-blue-600 dark:text-blue-400",
              color === 'secondary' && "text-cyan-600 dark:text-cyan-400",
              color === 'accent' && "text-violet-600 dark:text-violet-400",
              color === 'warning' && "text-amber-600 dark:text-amber-400", 
              color === 'destructive' && "text-red-600 dark:text-red-400"
            )}>
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
