
import { useState, useEffect } from 'react';
import ChatPanel from "@/components/ChatPanel";
import PreviewPanel from "@/components/PreviewPanel";
import Header from "@/components/Header";
import { Toaster } from "sonner";

export default function Home() {
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [js, setJs] = useState("");
  
  // Check if we have a selected template from the templates page
  useEffect(() => {
    const selectedTemplate = localStorage.getItem("selected_template");
    if (selectedTemplate) {
      try {
        const template = JSON.parse(selectedTemplate);
        if (template && template.code) {
          // Set template code
          setHtml(template.code.html || "");
          setCss(template.code.css || "");
          setJs(template.code.js || "");
        }
      } catch (error) {
        console.error("Error parsing selected template:", error);
      }
    }
  }, []);

  const handleCodeGenerated = (html: string, css: string, js: string) => {
    setHtml(html);
    setCss(css);
    setJs(js);
  };

  return (
    <div className="flex flex-col min-h-screen bg-subtle-grid bg-fixed">
      <Header />
      
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 mt-16 container">
        <div className="lg:w-1/2 flex flex-col min-h-[500px] rounded-xl overflow-hidden premium-panel">
          <ChatPanel onCodeGenerated={handleCodeGenerated} />
        </div>
        
        <div className="lg:w-1/2 flex flex-col min-h-[500px] rounded-xl overflow-hidden premium-panel">
          <PreviewPanel html={html} css={css} js={js} />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 text-center">
        <p className="text-sm text-muted-foreground">
          CodeCraft AI by JBLinx Studio • Copyright © {new Date().getFullYear()} • All rights reserved
        </p>
      </footer>
      
      <Toaster />
    </div>
  );
}
