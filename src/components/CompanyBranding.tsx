
import { Code, CheckCircle } from "lucide-react";

const CompanyBranding = () => {
  return (
    <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-800 p-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/4 flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-theme-blue to-theme-green rounded-full blur opacity-30"></div>
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative">
              <Code className="h-10 w-10 text-theme-blue" />
            </div>
          </div>
          <h3 className="text-xl font-heading font-semibold mt-4 mb-1">JBLinx Studio</h3>
          <p className="text-sm text-muted-foreground">Enterprise AI Solutions</p>
        </div>
        
        <div className="md:w-3/4">
          <h3 className="text-xl font-heading font-semibold mb-4">About JBLinx Studio</h3>
          <p className="text-muted-foreground mb-6">
            JBLinx Studio specializes in enterprise-grade AI development tools and professional web application solutions.
            Our platform combines cutting-edge artificial intelligence with intuitive design to help businesses create 
            powerful applications faster than ever before.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-theme-blue mt-0.5" />
              <div>
                <h4 className="font-medium">Enterprise Solutions</h4>
                <p className="text-sm text-muted-foreground">Custom solutions for businesses of all sizes</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-theme-blue mt-0.5" />
              <div>
                <h4 className="font-medium">Professional Templates</h4>
                <p className="text-sm text-muted-foreground">Professionally designed templates ready for use</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-theme-blue mt-0.5" />
              <div>
                <h4 className="font-medium">AI-Powered Development</h4>
                <p className="text-sm text-muted-foreground">Accelerate development with intelligent assistance</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-theme-blue mt-0.5" />
              <div>
                <h4 className="font-medium">Protected by License</h4>
                <p className="text-sm text-muted-foreground">All intellectual property is legally protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyBranding;
