
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Copy, RefreshCw, Code, Pencil, Play } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface PreviewPanelProps {
  html: string;
  css: string;
  js: string;
}

export default function PreviewPanel({ html, css, js }: PreviewPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("preview");
  const [iframeKey, setIframeKey] = useState<number>(0);
  
  const combinedCode = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${css}</style>
</head>
<body>
${html}
<script>${js}</script>
</body>
</html>
`;

  const refreshPreview = () => {
    setIframeKey(prev => prev + 1);
    toast({
      title: "Preview refreshed",
      description: "The preview has been updated with the latest code.",
      duration: 2000,
    });
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied to clipboard`,
      description: `The ${type.toLowerCase()} code has been copied to your clipboard.`,
      duration: 2000,
    });
  };

  const downloadAsFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    if (html) downloadAsFile(html, "index.html");
    if (css) downloadAsFile(css, "styles.css");
    if (js) downloadAsFile(js, "script.js");
    toast({
      title: "Files downloaded",
      description: "All code files have been downloaded successfully.",
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 bg-card">
          <TabsList className="bg-muted/50 p-1 rounded-lg">
            <TabsTrigger 
              value="preview" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs flex items-center gap-1"
            >
              <Play className="h-3 w-3" />
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="html" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs flex items-center gap-1"
            >
              <Code className="h-3 w-3" />
              HTML
            </TabsTrigger>
            <TabsTrigger 
              value="css" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              CSS
            </TabsTrigger>
            <TabsTrigger 
              value="js" 
              className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs flex items-center gap-1"
            >
              <Code className="h-3 w-3" />
              JavaScript
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {activeTab === "preview" && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={refreshPreview}
                className="h-8 w-8 rounded-full"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="default" 
              size="sm" 
              onClick={downloadAll}
              className="h-8 text-xs rounded-full px-3 gap-1"
              disabled={!(html || css || js)}
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
        <Separator />
        
        <TabsContent value="preview" className="flex-1 p-0 m-0 bg-secondary/30">
          {(html || css || js) ? (
            <div className="h-full w-full p-4">
              <iframe
                key={iframeKey}
                srcDoc={combinedCode}
                title="Preview"
                className="w-full h-full border-0 rounded-xl shadow-sm bg-white"
                sandbox="allow-scripts allow-popups"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6 max-w-md">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                  <Code className="h-8 w-8 opacity-70" />
                </div>
                <h3 className="text-xl font-medium mb-2">No preview available yet</h3>
                <p className="text-muted-foreground mb-6">
                  Describe a web application in the chat to see it come to life right here.
                </p>
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto text-center">
                  <div className="flex flex-col items-center p-3 bg-card rounded-lg shadow-sm hover-card">
                    <span className="text-xs text-muted-foreground mb-1">Step 1</span>
                    <span className="text-sm font-medium">Describe</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-card rounded-lg shadow-sm hover-card">
                    <span className="text-xs text-muted-foreground mb-1">Step 2</span>
                    <span className="text-sm font-medium">Generate</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-card rounded-lg shadow-sm hover-card">
                    <span className="text-xs text-muted-foreground mb-1">Step 3</span>
                    <span className="text-sm font-medium">Preview</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="html" className="flex-1 p-0 m-0 relative overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 rounded-full shadow-sm bg-white/80 backdrop-blur-sm"
              onClick={() => copyToClipboard(html, "HTML")}
              disabled={!html}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <pre className={cn(
            "h-full overflow-auto p-4 font-mono text-sm bg-secondary/30",
            !html && "flex items-center justify-center text-muted-foreground"
          )}>
            {html || "// No HTML code generated yet. Describe your web application in the chat."}
          </pre>
        </TabsContent>
        
        <TabsContent value="css" className="flex-1 p-0 m-0 relative overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 rounded-full shadow-sm bg-white/80 backdrop-blur-sm"
              onClick={() => copyToClipboard(css, "CSS")}
              disabled={!css}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <pre className={cn(
            "h-full overflow-auto p-4 font-mono text-sm bg-secondary/30",
            !css && "flex items-center justify-center text-muted-foreground"
          )}>
            {css || "/* No CSS code generated yet. Describe your web application in the chat. */"}
          </pre>
        </TabsContent>
        
        <TabsContent value="js" className="flex-1 p-0 m-0 relative overflow-hidden">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8 rounded-full shadow-sm bg-white/80 backdrop-blur-sm"
              onClick={() => copyToClipboard(js, "JavaScript")}
              disabled={!js}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <pre className={cn(
            "h-full overflow-auto p-4 font-mono text-sm bg-secondary/30",
            !js && "flex items-center justify-center text-muted-foreground"
          )}>
            {js || "// No JavaScript code generated yet. Describe your web application in the chat."}
          </pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
