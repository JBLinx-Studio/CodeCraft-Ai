
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { GitHubService } from '@/services/github-service';
import { Loader2 } from 'lucide-react';

interface GitHubIntegrationProps {
  html: string;
  css: string;
  js: string;
}

export const GitHubIntegration = ({ html, css, js }: GitHubIntegrationProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [repoName, setRepoName] = useState('');
  const [repoDescription, setRepoDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const isAuth = GitHubService.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        const token = GitHubService.getToken();
        if (token) {
          const user = await GitHubService.getUserInfo(token);
          setUserInfo(user);
        }
      }
    };
    
    checkAuthStatus();
  }, []);

  const handleLogin = () => {
    GitHubService.initiateAuth();
  };

  const handleLogout = () => {
    GitHubService.logout();
    setIsAuthenticated(false);
    setUserInfo(null);
    toast.info("Logged out from GitHub");
  };

  const handleCreateRepo = async () => {
    if (!repoName.trim()) {
      toast.error("Repository name is required");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const token = GitHubService.getToken();
      if (!token) {
        toast.error("GitHub authentication required");
        setIsLoading(false);
        return;
      }
      
      // Create repository
      const repo = await GitHubService.createRepo({
        name: repoName,
        description: repoDescription,
        private: isPrivate,
        token
      });
      
      if (!repo) {
        setIsLoading(false);
        return;
      }
      
      // Prepare files for commit
      const files = [
        {
          path: 'index.html',
          content: html || `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${repoName}</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello from ${repoName}</h1>
  <script src="script.js"></script>
</body>
</html>`
        },
        {
          path: 'styles.css',
          content: css || `body { font-family: sans-serif; padding: 2rem; }`
        },
        {
          path: 'script.js',
          content: js || `console.log("Hello from ${repoName}");`
        },
        {
          path: 'README.md',
          content: `# ${repoName}\n\n${repoDescription || 'A web application created with WebCraft AI'}`
        }
      ];
      
      // Commit files to the repository
      const commitResult = await GitHubService.commitFiles({
        repoName: repo.name,
        files,
        commitMessage: 'Initial commit from WebCraft AI',
        token,
        owner: repo.owner?.login
      });
      
      if (commitResult) {
        toast.success("Project successfully uploaded to GitHub!", {
          description: "Your code is now available on GitHub",
          duration: 5000,
        });
        
        // Provide link to the repository
        setTimeout(() => {
          toast.info(
            <div className="flex flex-col gap-2">
              <span>View your repository:</span>
              <a 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {repo.html_url}
              </a>
            </div>,
            {
              duration: 8000,
            }
          );
        }, 1000);
        
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Error uploading to GitHub:", error);
      toast.error("Failed to upload to GitHub", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="flex items-center gap-2 border-gray-500/30 hover:border-gray-500/50"
        onClick={() => isAuthenticated ? setIsOpen(true) : handleLogin()}
      >
        <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        {isAuthenticated ? 'Export to GitHub' : 'Connect GitHub'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export to GitHub</DialogTitle>
            <DialogDescription>
              Create a new GitHub repository with your generated code
            </DialogDescription>
          </DialogHeader>

          {userInfo && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-md mb-4">
              <img 
                src={userInfo.avatar_url} 
                alt={userInfo.login} 
                className="w-10 h-10 rounded-full" 
              />
              <div>
                <p className="font-medium">{userInfo.name || userInfo.login}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {userInfo.public_repos} public repositories
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="repo-name" className="text-right">
                Name
              </Label>
              <Input
                id="repo-name"
                placeholder="my-webapp"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                placeholder="A web application created with WebCraft AI"
                value={repoDescription}
                onChange={(e) => setRepoDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="text-right">
                <Label>Visibility</Label>
              </div>
              <div className="flex items-center space-x-2 col-span-3">
                <Checkbox 
                  id="private" 
                  checked={isPrivate} 
                  onCheckedChange={(checked) => setIsPrivate(!!checked)} 
                />
                <Label htmlFor="private">Private repository</Label>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-slate-500 dark:text-slate-400">
            <p>The following files will be added to your repository:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>index.html</li>
              <li>styles.css</li>
              <li>script.js</li>
              <li>README.md</li>
            </ul>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button variant="ghost" onClick={handleLogout} type="button">
              Switch Account
            </Button>
            <Button 
              onClick={handleCreateRepo} 
              disabled={!repoName.trim() || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Repository
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GitHubIntegration;
