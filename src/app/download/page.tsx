import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  CheckCircle2,
  Calendar,
  HardDrive,
  AlertCircle,
} from "lucide-react";

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
  openGraph: {
    title: "Download Wagewise Desktop",
    description: "Get the latest version of Wagewise for Windows",
    type: "website",
  },
};

async function getLatestRelease(): Promise<GitHubRelease | null> {
  const owner = "Wagewise-254";
  const repo = "wagewise-app";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "WageWise-Download-Page",
        },
      },
    );

    if (!res.ok) {
      console.error(`GitHub API responded with status: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching release:", error);
    return null;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 MB";
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-lg font-medium text-slate-900">{message}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function DownloadPage() {
  const release = await getLatestRelease();

  if (!release) {
    return (
      <ErrorState message="Could not load download information. Please try again later." />
    );
  }

  const windowsExeAsset = release.assets.find((asset) =>
   asset.name.endsWith(".exe") || asset.name.endsWith(".msi")
  );

  if (!windowsExeAsset) {
    return <ErrorState message="Windows installer not found for the latest release." />;
  }

 const releaseHighlights = [
    "Optimized for Windows 10 and 11",
    "Enhanced security with automatic updates",
    "Improved performance and stability",
    ...(release.body 
      ? release.body
          .split("\n")
          .filter(line => line.trim().startsWith("-") || line.trim().startsWith("*"))
          .slice(0, 3)
          .map(line => line.replace(/^[-*\s]+/, "").trim())
      : [])
  ];

  return (
   <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 p-4">
      {/* Animated background elements */}
      <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-linear-to-r from-[#7F5EFD]/20 to-[#1F3A8A]/20 blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-0 h-75 w-75 rounded-full bg-blue-400/20 blur-[80px]" />
      <div className="absolute left-0 top-1/2 h-75 w-75 rounded-full bg-purple-400/20 blur-[80px]" />

      <Card className="relative w-full max-w-lg border-0 bg-white/80 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-3xl">
        <CardHeader className="space-y-2 pb-4 pt-8 text-center">
          <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-[#7F5EFD] to-[#2D4AA8] shadow-lg shadow-[#1F3A8A]/30 ring-4 ring-white/50">
            <Download className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold tracking-tight">
            WageWise
            <span className="block text-2xl font-medium text-[#1F3A8A]">Desktop Application</span>
          </CardTitle>
          <CardDescription className="text-base text-slate-600">
            Secure, fast, and reliable workflow management for Windows
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 px-8">
          {/* Version and size info */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50/80 p-4 backdrop-blur-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Calendar className="h-3 w-3" />
                Version
              </div>
              <p className="mt-1 text-lg font-bold text-slate-900">{release.tag_name}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <HardDrive className="h-3 w-3" />
                Size
              </div>
              <p className="mt-1 text-lg font-bold text-slate-900">{formatFileSize(windowsExeAsset.size)}</p>
            </div>
          </div>

         {/* Release highlights */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1F3A8A]">
              <span className="h-px flex-1 bg-linear-to-r from-transparent to-[#1F3A8A]/20" />
              What&apos;s New
              <span className="h-px flex-1 bg-linear-to-l from-transparent to-[#1F3A8A]/20" />
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {releaseHighlights.slice(0, 3).map((highlight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
            <p className="pt-2 text-center text-xs text-slate-400">
              Published on {formatDate(release.published_at)}
            </p>
          </div>
        </CardContent>

      <CardFooter className="flex flex-col gap-3 px-8 pb-8">
          <Button
            asChild
            size="lg"
            className="group w-full bg-linear-to-r from-[#7F5EFD] to-[#2D4AA8] text-base font-semibold shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#1F3A8A]/25 active:scale-[0.98]"
          >
            <a 
              href={windowsExeAsset.browser_download_url} 
              download
              className="flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
              Download Installer ({formatFileSize(windowsExeAsset.size)})
            </a>
          </Button>
          
          <p className="text-center text-xs text-slate-400">
            By downloading, you agree to our{" "}
            <a href="/terms" className="underline hover:text-[#1F3A8A] transition-colors">
              Terms of Service
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
