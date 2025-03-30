
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-24 h-24 mb-4">
        <img 
          src="/lovable-uploads/2a5b9d6d-fbd8-4e4a-ab5b-1f4f6c6bfffe.png" 
          alt="GFG KIIT Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-center card-glow p-8 rounded-lg">
        <h1 className="text-6xl font-bold mb-4 trapped-glow text-primary">404</h1>
        <p className="text-xl text-foreground mb-6">Oops! This page seems to be trapped in another dimension</p>
        <a href="/" className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors">
          Return to Safety
        </a>
      </div>
    </div>
  );
};

export default NotFound;
