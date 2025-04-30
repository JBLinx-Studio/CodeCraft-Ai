
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface ExtractedCode {
  html: string;
  css: string;
  js: string;
}

export function extractCodeBlocks(text: string): { code: ExtractedCode; explanation: string } {
  const htmlRegex = /```html([\s\S]*?)```/g;
  const cssRegex = /```css([\s\S]*?)```/g;
  const jsRegex = /```(?:js|javascript)([\s\S]*?)```/g;
  
  // Extract code blocks
  const htmlMatch = htmlRegex.exec(text);
  const cssMatch = cssRegex.exec(text);
  const jsMatch = jsRegex.exec(text);
  
  // Remove code blocks from explanation
  let explanation = text
    .replace(htmlRegex, '')
    .replace(cssRegex, '')
    .replace(jsRegex, '')
    .replace(/```[\s\S]*?```/g, '') // Remove any other code blocks
    .trim();
  
  return {
    code: {
      html: htmlMatch ? htmlMatch[1].trim() : '',
      css: cssMatch ? cssMatch[1].trim() : '',
      js: jsMatch ? jsMatch[1].trim() : '',
    },
    explanation
  };
}
