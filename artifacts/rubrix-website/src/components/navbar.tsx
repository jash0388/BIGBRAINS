import React from "react";
import { Button } from "@/components/ui/button";
import { Boxes } from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 flex items-center">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Boxes className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-rubrix-navy tracking-tight">DataNauts</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#student" className="text-sm font-medium text-rubrix-navy/80 hover:text-rubrix-navy transition-colors">Student Login</a>
          <a href="#faculty" className="text-sm font-medium text-rubrix-navy/80 hover:text-rubrix-navy transition-colors">Faculty Login</a>
          <a href="#nba" className="text-sm font-medium text-rubrix-navy/80 hover:text-rubrix-navy transition-colors">NBA Login</a>
          <Button variant="default" className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
            Contact Sales
          </Button>
        </nav>
      </div>
    </header>
  );
}
