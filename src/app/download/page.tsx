import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadIcon, CheckCircle2 } from "lucide-react";

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
  body: string;
}

export const metadata: Metadata = {
  title: "Download Wagewise Desktop",
  description: "Get the latest version of Wagewise for Windows.",
};

async function getLatestRelease(): Promise<GitHubRelease | null> {
  const owner = 'Wagewise-254'; 
  const repo = 'wagewise-app'; 

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
      next: { revalidate: 3600 }, 
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching release:", error);
    return null;
  }
}

export default async function DownloadPage() {
  const release = await getLatestRelease();

  if (!release) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 text-slate-900">
        <p className="text-lg font-medium">Could not load download information. Please try again later.</p>
      </div>
    );
  }

  const windowsExeAsset = release.assets.find(asset => asset.name.endsWith('.exe'));

  if (!windowsExeAsset) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 text-slate-900">
        <p className="text-lg font-medium">No Windows (.exe) release found.</p>
      </div>
    );
  }

  const formattedDate = new Date(release.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const fileSizeMB = (windowsExeAsset.size / (1024 * 1024)).toFixed(1);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F9FF] p-6">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[#7F5EFD]/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-400/10 blur-[120px]" />

      <Card className="relative w-full max-w-[440px] border-none bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl">
        <CardHeader className="space-y-1 pt-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7F5EFD] text-white shadow-lg shadow-[#7F5EFD]/30">
            <DownloadIcon className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
            Wagewise <span className="text-[#7F5EFD]">Desktop</span>
          </CardTitle>
          <CardDescription className="text-base font-medium text-slate-500">
            Securely manage your workflow on Windows
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 px-8 py-6">
          <div className="flex justify-around rounded-2xl bg-slate-50/50 p-4 border border-slate-100">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Version</p>
              <p className="text-lg font-bold text-slate-800">{release.tag_name}</p>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Size</p>
              <p className="text-lg font-bold text-slate-800">{fileSizeMB} MB</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-[#7F5EFD]">Release Highlights</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                <span>Optimized performance for Windows 10/11</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                <span>Updated security protocols</span>
              </li>
              <li className="flex items-start gap-2 text-slate-400 italic">
                <span>Last updated {formattedDate}</span>
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="pb-10 px-8">
          <Button
            asChild
            className="group w-full h-14 rounded-xl bg-[#7F5EFD] text-lg font-bold shadow-xl transition-all duration-200 hover:scale-[1.02] hover:bg-[#6a47e6] active:scale-[0.98]"
          >
            <a href={windowsExeAsset.browser_download_url} download>
              <DownloadIcon className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" />
              Download for Windows
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}