
import { useState } from "react";
import { Code, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LicenseInfoProps {
  className?: string;
}

const LicenseInfo = ({ className }: LicenseInfoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  
  return (
    <>
      <div className={className}>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Code className="h-3 w-3" />
          <span>JBLinx Studio License • Copyright © {currentYear}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs" 
            onClick={() => setIsOpen(true)}
          >
            <Eye className="h-3 w-3 mr-1" /> View License
          </Button>
        </p>
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="h-4 w-4" /> JBLinx Studio License
            </DialogTitle>
          </DialogHeader>
          
          <div className="border rounded-lg p-4 max-h-96 overflow-y-auto bg-slate-50 dark:bg-slate-900 my-4">
            <h3 className="font-semibold">JBLINX STUDIO SOFTWARE LICENSE AGREEMENT</h3>
            <p className="mt-2">Copyright © {currentYear} JBLinx Studio. All rights reserved.</p>
            
            <div className="mt-4 space-y-4 text-sm">
              <p>
                By using the software and services provided by JBLinx Studio ("the Services"), 
                you are agreeing to be bound by the terms and conditions of this License Agreement.
              </p>
              
              <h4 className="font-medium">1. LICENSE GRANT</h4>
              <p>
                Subject to the terms and conditions of this Agreement, JBLinx Studio grants you 
                a limited, non-exclusive, non-transferable license to use the Services and any 
                code generated through the Services for your personal or internal business purposes.
              </p>
              
              <h4 className="font-medium">2. RESTRICTIONS</h4>
              <p>
                You may not: (a) modify, reverse engineer, decompile, or disassemble the Services; 
                (b) rent, lease, loan, sell, sublicense, or create derivative works based upon the Services; 
                (c) use the Services or generated code to build applications that compete with JBLinx Studio; 
                (d) reproduce, distribute, or publicly display the generated code without attribution to JBLinx Studio.
              </p>
              
              <h4 className="font-medium">3. OWNERSHIP</h4>
              <p>
                JBLinx Studio retains all right, title, and interest in and to the Services. 
                You acknowledge that you obtain no ownership rights in or to the Services.
              </p>
              
              <h4 className="font-medium">4. CODE OWNERSHIP</h4>
              <p>
                Code generated through the Services is owned by you, subject to the restrictions in Section 2. 
                JBLinx Studio makes no claim of ownership over applications that you build using the generated code.
              </p>
              
              <h4 className="font-medium">5. LIMITATION OF LIABILITY</h4>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, JBLINX STUDIO SHALL NOT BE LIABLE FOR ANY 
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF 
                PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
              </p>
              
              <h4 className="font-medium">6. TERMINATION</h4>
              <p>
                This Agreement is effective until terminated. Your rights under this Agreement will 
                terminate automatically if you fail to comply with any of its terms.
              </p>
              
              <h4 className="font-medium">7. GOVERNING LAW</h4>
              <p>
                This Agreement shall be governed by the laws of the jurisdiction in which JBLinx Studio operates.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LicenseInfo;
