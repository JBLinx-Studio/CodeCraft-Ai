
import { Code, Shield, Copyright } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CompanyBranding() {
  const [isLicenseOpen, setIsLicenseOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-theme-blue to-theme-green flex items-center justify-center text-white shadow-glow-sm">
            <Code className="h-4 w-4" />
          </div>
          <span className="font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-theme-blue to-theme-green">JBLinx Studio</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Copyright className="h-3 w-3 mr-1" />
          {currentYear} JBLinx Studio. All Rights Reserved.
        </div>
        
        <div className="flex items-center gap-4">
          <Dialog open={isLicenseOpen} onOpenChange={setIsLicenseOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 text-xs flex gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                License
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-theme-blue" />
                  JBLinx Studio Software License
                </DialogTitle>
                <DialogDescription>
                  This software is protected by copyright law and international treaty provisions.
                </DialogDescription>
              </DialogHeader>
              <div className="text-sm space-y-4 mt-4">
                <p className="font-semibold">© {currentYear} JBLinx Studio. All Rights Reserved.</p>
                
                <div>
                  <h3 className="font-semibold mb-2">Proprietary Software License Agreement</h3>
                  <p>This software is the property of JBLinx Studio ("Company") and is protected by copyright law and international treaty provisions. This software is licensed, not sold.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">1. License Grant</h4>
                  <p>Subject to the terms of this Agreement, Company grants you a limited, non-exclusive, non-transferable license to use the software application ("Software") for your personal or internal business purposes.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">2. Restrictions</h4>
                  <p>You may not:</p>
                  <ul className="list-disc pl-5 space-y-1 mt-1">
                    <li>Modify, adapt, translate, reverse engineer, decompile, disassemble or create derivative works based on the Software</li>
                    <li>Remove, alter, or obscure any proprietary notices on the Software</li>
                    <li>Reproduce, copy, distribute, resell, or otherwise use the Software for any commercial purpose</li>
                    <li>Allow any third party to use the Software on behalf of or for the benefit of any third party</li>
                    <li>Use the Software in any way that violates any applicable local, state, national, or international law</li>
                  </ul>
                </div>
                
                <Button 
                  className="mt-4 bg-gradient-to-r from-theme-blue to-theme-green hover:opacity-90 w-full"
                  onClick={() => setIsLicenseOpen(false)}
                >
                  I Acknowledge
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
