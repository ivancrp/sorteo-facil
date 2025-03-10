
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Hash, Users, List, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Números', href: '/sorteio/numeros', icon: Hash },
    { name: 'Nomes', href: '/sorteio/nomes', icon: List },
    { name: 'Equipes', href: '/sorteio/equipes', icon: Users },
    { name: 'Roleta', href: '/sorteio/roleta', icon: Circle },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6",
      scrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Circle className="text-white w-5 h-5" />
          </div>
          <span className="font-semibold text-xl">Sorteio Fácil</span>
        </Link>
        
        <nav className="hidden md:flex items-center">
          <ul className="flex space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href));
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-2 rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "hover:bg-secondary"
                    )}
                  >
                    <item.icon className={cn(
                      "w-4 h-4 mr-2",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="md:hidden flex items-center">
          {/* Mobile menu button would go here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
