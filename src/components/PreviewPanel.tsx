
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied to clipboard`,
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
      title: "All files downloaded",
      duration: 2000,
    });
  };

  return (
    <div className="flex flex-col h-full border-l">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="flex justify-between items-center px-4 py-2">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="css">CSS</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            {activeTab === "preview" && (
              <Button variant="ghost" size="icon" onClick={refreshPreview}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={downloadAll}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <Separator />
        
        <TabsContent value="preview" className="flex-1 p-0 m-0">
          {(html || css || js) ? (
            <iframe
              key={iframeKey}
              srcDoc={combinedCode}
              title="Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-popups"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-8 w-8 opacity-50" />
                </div>
                <h3 className="text-lg font-medium">No preview available</h3>
                <p className="text-muted-foreground mt-2">
                  Describe a web app in the chat to see it come to life here
                </p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="html" className="flex-1 p-0 m-0 relative">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => copyToClipboard(html, "HTML")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <pre className="h-full overflow-auto p-4 font-mono text-sm bg-muted/30">{html || "// No HTML code generated yet"}</pre>
        </TabsContent>
        
        <TabsContent value="css" className="flex-1 p-0 m-0 relative">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => copyToClipboard(css, "CSS")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <pre className="h-full overflow-auto p-4 font-mono text-sm bg-muted/30">{css || "/* No CSS code generated yet */"}</pre>
        </TabsContent>
        
        <TabsContent value="js" className="flex-1 p-0 m-0 relative">
          <div className="absolute top-2 right-2 z-10">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => copyToClipboard(js, "JavaScript")}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <pre className="h-full overflow-auto p-4 font-mono text-sm bg-muted/30">{js || "// No JavaScript code generated yet"}</pre>
        </TabsContent>
      </Tabs>
    </div>
  );
}
