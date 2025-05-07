
import { toast } from "sonner";

interface GitHubAuthParams {
  code: string;
}

interface GitHubRepoCreateParams {
  name: string;
  description?: string;
  private?: boolean;
  token: string;
}

interface GitHubCommitParams {
  repoName: string;
  files: {path: string, content: string}[];
  commitMessage: string;
  token: string;
  owner?: string;
}

interface GitHubUserInfo {
  login: string;
  avatar_url: string;
  name: string;
  bio?: string;
  public_repos: number;
  html_url: string;
}

export class GitHubService {
  private static CLIENT_ID = "YOUR_GITHUB_CLIENT_ID"; // In production, this should be stored securely
  private static REDIRECT_URI = `${window.location.origin}/github/callback`;
  private static AUTH_URL = "https://github.com/login/oauth/authorize";
  private static API_BASE = "https://api.github.com";

  /**
   * Initialize GitHub OAuth authentication flow
   */
  static initiateAuth() {
    const state = this.generateRandomState();
    localStorage.setItem("github_auth_state", state);
    
    const authUrl = new URL(this.AUTH_URL);
    authUrl.searchParams.append("client_id", this.CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", this.REDIRECT_URI);
    authUrl.searchParams.append("state", state);
    authUrl.searchParams.append("scope", "repo user");
    
    window.location.href = authUrl.toString();
  }

  /**
   * Exchange code for access token after successful authentication
   * This would typically be handled server-side to protect client_secret
   */
  static async handleAuthCallback({ code }: GitHubAuthParams): Promise<string | null> {
    // In a real implementation, this would call your backend endpoint
    // which safely handles the exchange of code for token
    try {
      console.log("Exchanging code for token via backend proxy");
      
      // Simulated token response for demo purposes
      // In production, this would call a backend endpoint that exchanges the code for a token
      // const response = await fetch('/api/github/token', {
      //   method: 'POST',
      //   body: JSON.stringify({ code }),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Simulate token exchange
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Log auth flow for debugging (would be removed in production)
      console.log("GitHub auth flow completed successfully");
      toast.success("Successfully authenticated with GitHub");
      
      // Simulate token - in production, this would come from your backend
      const simulatedToken = "github_pat_simulated_token";
      localStorage.setItem("github_token", simulatedToken);
      return simulatedToken;
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      toast.error("Failed to authenticate with GitHub");
      return null;
    }
  }

  /**
   * Create a new GitHub repository
   */
  static async createRepo({ name, description = "", private: isPrivate = false, token }: GitHubRepoCreateParams) {
    try {
      const response = await fetch(`${this.API_BASE}/user/repos`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          private: isPrivate,
          auto_init: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create repository");
      }

      const repo = await response.json();
      toast.success(`Repository ${name} created successfully`);
      return repo;
    } catch (error) {
      console.error("Error creating repository:", error);
      toast.error(`Failed to create repository: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Commit files to a repository
   */
  static async commitFiles({ repoName, files, commitMessage, token, owner }: GitHubCommitParams) {
    try {
      // Get the current user if owner is not provided
      if (!owner) {
        const userInfo = await this.getUserInfo(token);
        if (!userInfo) throw new Error("Could not determine repository owner");
        owner = userInfo.login;
      }
      
      // Show progress notification
      toast.loading(`Uploading files to ${repoName}...`);
      
      // Get the default branch reference
      const refsResponse = await fetch(`${this.API_BASE}/repos/${owner}/${repoName}/git/refs/heads`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!refsResponse.ok) {
        throw new Error("Could not get repository references");
      }
      
      const refs = await refsResponse.json();
      const defaultBranchRef = Array.isArray(refs) && refs.length > 0 ? refs[0] : null;
      
      if (!defaultBranchRef) {
        throw new Error("Could not determine the default branch");
      }
      
      // Get the commit that the branch points to
      const commitResponse = await fetch(`${this.API_BASE}/repos/${owner}/${repoName}/git/commits/${defaultBranchRef.object.sha}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (!commitResponse.ok) {
        throw new Error("Could not get the latest commit");
      }
      
      const latestCommit = await commitResponse.json();
      
      // Create blobs for each file
      const blobPromises = files.map(file => 
        fetch(`${this.API_BASE}/repos/${owner}/${repoName}/git/blobs`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: btoa(unescape(encodeURIComponent(file.content))),
            encoding: "base64"
          })
        }).then(res => res.json())
      );
      
      const blobs = await Promise.all(blobPromises);
      
      // Create tree with new files
      const treeItems = files.map((file, index) => ({
        path: file.path,
        mode: "100644",
        type: "blob",
        sha: blobs[index].sha
      }));
      
      const treeResponse = await fetch(`${this.API_BASE}/repos/${owner}/${repoName}/git/trees`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base_tree: latestCommit.tree.sha,
          tree: treeItems
        })
      });
      
      if (!treeResponse.ok) {
        throw new Error("Could not create tree");
      }
      
      const tree = await treeResponse.json();
      
      // Create new commit
      const newCommitResponse = await fetch(`${this.API_BASE}/repos/${owner}/${repoName}/git/commits`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage,
          tree: tree.sha,
          parents: [latestCommit.sha]
        })
      });
      
      if (!newCommitResponse.ok) {
        throw new Error("Could not create commit");
      }
      
      const newCommit = await newCommitResponse.json();
      
      // Update branch reference
      const updateRefResponse = await fetch(`${this.API_BASE}/repos/${owner}/${repoName}/git/${defaultBranchRef.ref}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sha: newCommit.sha,
          force: true
        })
      });
      
      if (!updateRefResponse.ok) {
        throw new Error("Could not update branch reference");
      }
      
      toast.success(`Successfully committed ${files.length} files to ${repoName}`);
      return newCommit;
    } catch (error) {
      console.error("Error committing files:", error);
      toast.error(`Failed to commit files: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Get information about the authenticated user
   */
  static async getUserInfo(token: string): Promise<GitHubUserInfo | null> {
    try {
      const response = await fetch(`${this.API_BASE}/user`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!response.ok) {
        throw new Error("Could not fetch user information");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  }

  /**
   * Check if the user is authenticated
   */
  static isAuthenticated(): boolean {
    return Boolean(localStorage.getItem("github_token"));
  }

  /**
   * Get the stored access token
   */
  static getToken(): string | null {
    return localStorage.getItem("github_token");
  }

  /**
   * Logout by removing the token
   */
  static logout(): void {
    localStorage.removeItem("github_token");
    toast.info("Logged out from GitHub");
  }

  /**
   * Generate a random state string for OAuth security
   */
  private static generateRandomState(): string {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}
