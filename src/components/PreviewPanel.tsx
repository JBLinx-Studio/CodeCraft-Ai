
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Copy, RefreshCw, Code, Pencil, Play, LinkIcon, MonitorSmartphone } from "lucide-react";
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
    <div className="flex flex-col h-full cyber-panel overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-slate-800/90 to-slate-900/90 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center shadow-glow-sm cyber-pulse">
              <MonitorSmartphone className="h-3.5 w-3.5 text-white" />
            </div>
            <h2 className="font-medium text-sm bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">Live Preview</h2>
          </div>
          
          <TabsList className="bg-slate-800/80 p-1 rounded-lg border border-slate-700/30">
            <TabsTrigger 
              value="preview" 
              className="rounded-md data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-purple-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border-t data-[state=active]:border-cyan-500/30 data-[state=active]:shadow-glow-sm text-xs flex items-center gap-1"
            >
              <Play className="h-3 w-3" />
              Preview
            </TabsTrigger>
            <TabsTrigger 
              value="html" 
              className="rounded-md data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-purple-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border-t data-[state=active]:border-cyan-500/30 data-[state=active]:shadow-glow-sm text-xs flex items-center gap-1"
            >
              <Code className="h-3 w-3" />
              HTML
            </TabsTrigger>
            <TabsTrigger 
              value="css" 
              className="rounded-md data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-purple-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border-t data-[state=active]:border-cyan-500/30 data-[state=active]:shadow-glow-sm text-xs flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              CSS
            </TabsTrigger>
            <TabsTrigger 
              value="js" 
              className="rounded-md data-[state=active]:bg-gradient-to-r from-cyan-500/20 to-purple-500/20 data-[state=active]:text-cyan-300 data-[state=active]:border-t data-[state=active]:border-cyan-500/30 data-[state=active]:shadow-glow-sm text-xs flex items-center gap-1"
            >
              <Code className="h-3 w-3" />
              JavaScript
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 z-10">
          <div className="flex flex-col gap-1">
            <div className="h-20 w-1.5 bg-gradient-to-b from-cyan-500/50 to-transparent rounded-r"></div>
            <div className="h-1.5 w-1.5 bg-cyan-500/70 rounded-full shadow-glow-sm"></div>
            <div className="h-20 w-1.5 bg-gradient-to-t from-purple-500/50 to-transparent rounded-r"></div>
          </div>
        </div>
        
        <TabsContent value="preview" className="flex-1 p-0 m-0 bg-slate-900/80 overflow-hidden">
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
                <div className="h-24 w-24 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full border border-cyan-500/20 flex items-center justify-center mx-auto mb-6 cyber-pulse">
                  <div className="h-16 w-16 rounded-full bg-slate-800/90 flex items-center justify-center">
                    <Code className="h-8 w-8 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2 text-gradient-primary">No preview available yet</h3>
                <p className="text-slate-400 mb-6">
                  Describe a web application in the chat to see it come to life right here.
                </p>
                <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto text-center">
                  <div className="cyber-card cyber-hover p-3">
                    <span className="text-xs text-cyan-400 mb-1 block">Step 1</span>
                    <span className="text-sm font-medium">Describe</span>
                  </div>
                  <div className="cyber-card cyber-hover p-3">
                    <span className="text-xs text-purple-400 mb-1 block">Step 2</span>
                    <span className="text-sm font-medium">Generate</span>
                  </div>
                  <div className="cyber-card cyber-hover p-3">
                    <span className="text-xs text-cyan-400 mb-1 block">Step 3</span>
                    <span className="text-sm font-medium">Preview</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="html" className="flex-1 p-0 m-0 relative overflow-hidden bg-slate-900/80">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 hover:bg-cyan-500/20 backdrop-blur-sm"
              onClick={() => copyToClipboard(html, "HTML")}
              disabled={!html}
            >
              <Copy className="h-4 w-4 text-cyan-400" />
            </Button>
          </div>
          <pre className={cn(
            "h-full overflow-auto p-4 font-mono text-sm text-slate-300",
            !html && "flex items-center justify-center text-slate-500"
          )}>
            {html || "// No HTML code generated yet. Describe your web application in the chat."}
          </pre>
        </TabsContent>
        
        <TabsContent value="css" className="flex-1 p-0 m-0 relative overflow-hidden bg-slate-900/80">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 hover:bg-cyan-500/20 backdrop-blur-sm"
              onClick={() => copyToClipboard(css, "CSS")}
              disabled={!css}
            >
              <Copy className="h-4 w-4 text-cyan-400" />
            </Button>
          </div>
          <pre className={cn(
            "h-full overflow-auto p-4 font-mono text-sm text-slate-300",
            !css && "flex items-center justify-center text-slate-500"
          )}>
            {css || "/* No CSS code generated yet. Describe your web application in the chat. */"}
          </pre>
        </TabsContent>
        
        <TabsContent value="js" className="flex-1 p-0 m-0 relative overflow-hidden bg-slate-900/80">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 hover:bg-cyan-500/20 backdrop-blur-sm"
              onClick={() => copyToClipboard(js, "JavaScript")}
              disabled={!js}
            >
              <Copy className="h-4 w-4 text-cyan-400" />
            </Button>
          </div>
          <pre className={cn(
            "h-full overflow-auto p-4 font-mono text-sm text-slate-300",
            !js && "flex items-center justify-center text-slate-500"
          )}>
            {js || "// No JavaScript code generated yet. Describe your web application in the chat."}
          </pre>
        </TabsContent>
        
        <div className="flex justify-end items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-900/90 to-slate-800/90 border-t border-slate-700/30">
          {activeTab === "preview" && (
            <Button 
              variant="outline" 
              size="icon" 
              onClick={refreshPreview}
              className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 hover:bg-cyan-500/20"
            >
              <RefreshCw className="h-4 w-4 text-cyan-400" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadAll}
            className="h-8 text-xs rounded-full px-3 gap-1 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 hover:bg-cyan-500/20"
            disabled={!(html || css || js)}
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" />
            Export
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
