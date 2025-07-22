import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react"; // You might need to install lucide-react: npm install lucide-react

interface ReleaseAsset {
  browser_download_url: string;
  name: string;
  size: number;
}

interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  assets: ReleaseAsset[];
  body: string; // Release notes
}

export const metadata: Metadata = {
    title: "Wagewise Desktop Download",
    description: "Download the latest version of Wagewise for Windows.",
    };

async function getLatestRelease(): Promise<GitHubRelease | null> {
  const owner = 'Wagewise-254'; // Replace with your GitHub username or organization
  const repo = 'wagewise-app'; // Replace with your desktop app repository name

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
      // Revalidate data every hour (3600 seconds)
      next: { revalidate: 3600 }, 
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!res.ok) {
      console.error(`GitHub API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const data: GitHubRelease = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching latest release:", error);
    return null;
  }
}

export default async function DownloadPage() {
  const release = await getLatestRelease();

  if (!release) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
        <p className="text-lg">Could not load download information. Please try again later.</p>
      </div>
    );
  }

  const windowsExeAsset = release.assets.find(asset => asset.name.endsWith('.exe'));

  if (!windowsExeAsset) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
        <p className="text-lg">No Windows (.exe) release found for download.</p>
      </div>
    );
  }

  const formattedDate = new Date(release.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fileSizeMB = (windowsExeAsset.size / (1024 * 1024)).toFixed(2);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md bg-white text-black shadow-lg border border-[#7F5EFD]">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-[#7F5EFD]">Wagewise Desktop</CardTitle>
          <CardDescription className="text-gray-600">
            Download the latest version for Windows.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="text-center">
            <h3 className="text-2xl font-semibold mb-2">Version {release.tag_name}</h3>
            <p className="text-gray-700">Released on: {formattedDate}</p>
            <p className="text-gray-700">File size: {fileSizeMB} MB</p>
          </div>

          <div className="prose prose-sm max-w-none text-gray-800">
            <h4 className="text-xl font-semibold mb-2">Release Notes:</h4>
            {/* Simple rendering of markdown. For more complex markdown, use a library like react-markdown */}
            {/*<p className="whitespace-pre-wrap">{release.body}</p>*/}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-6">
          <Button
            asChild
            className="w-full py-3 text-lg font-semibold bg-[#7F5EFD] text-white hover:bg-[#6a47e6]" 
          >
            <a href={windowsExeAsset.browser_download_url} download>
              <DownloadIcon className="mr-2 h-5 w-5" /> Download for Windows
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}