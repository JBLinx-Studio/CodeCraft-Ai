
import React from 'react';
import { Badge } from './ui/badge';

interface LicenseInfoProps {
  className?: string;
}

const LicenseInfo: React.FC<LicenseInfoProps> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center text-xs ${className}`}>
      <Badge variant="outline" className="text-[10px] bg-white/50 dark:bg-slate-900/50 hover:bg-white/60 dark:hover:bg-slate-900/60">
        Professional License
      </Badge>
      <p className="mt-1 text-muted-foreground">Valid until May 2026</p>
    </div>
  );
};

export default LicenseInfo;
