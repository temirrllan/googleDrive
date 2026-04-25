import { UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";
import DriveLogo from "./drive-logo";

export default function AppTopbar() {
  return (
    <header className="grid grid-cols-[256px_1fr_auto] items-center gap-4 bg-white px-4">
      <div className="flex items-center gap-3">
        <DriveLogo />
        <span className="text-[22px] font-normal text-muted">Drive</span>
      </div>
      <form
        action="/search"
        method="GET"
        className="mx-auto flex w-full max-w-3xl items-center gap-3 rounded-full bg-canvas px-4 py-2 transition focus-within:bg-white focus-within:shadow-card"
      >
        <button type="submit" className="text-muted" aria-label="Search">
          <Search className="h-5 w-5" />
        </button>
        <input
          name="q"
          placeholder="Search in Drive"
          className="flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
        />
      </form>
      <div className="flex items-center pr-2">
        <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
      </div>
    </header>
  );
}
