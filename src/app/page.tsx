import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getOrCreateRootFolder } from "@/server/db/queries";
import DriveLogo from "@/components/drive-logo";

export default async function HomePage() {
  const { userId } = await auth();
  if (userId) {
    const root = await getOrCreateRootFolder(userId);
    redirect(`/f/${root.id}`);
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 0%, #e8f0fe 0%, transparent 60%), radial-gradient(60% 60% at 100% 100%, #fce8e6 0%, transparent 55%)",
        }}
      />
      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center text-center">
        <DriveLogo className="mb-6 h-14 w-14" />
        <h1 className="text-5xl font-normal tracking-tight text-ink">
          Welcome to <span className="text-brand">Drive</span>
        </h1>
        <p className="mt-4 text-lg text-muted">
          A clean, fast place to keep your files. Upload anything, organize into
          folders, and pick up right where you left off.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <SignInButton mode="modal">
            <button className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white shadow-card hover:bg-[#1765cc]">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="rounded-full border border-outline bg-white px-6 py-2.5 text-sm font-medium text-brand hover:bg-canvas">
              Create account
            </button>
          </SignUpButton>
        </div>
        <p className="mt-12 text-xs text-muted">
          Built with Next.js, Clerk, Neon, UploadThing.
        </p>
      </div>
    </main>
  );
}
