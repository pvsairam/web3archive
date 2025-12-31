import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
      <h1 className="text-6xl font-black italic text-white/10 uppercase tracking-widest">404</h1>
      <p className="text-white/30 font-mono text-sm tracking-tighter">Page not found in the archive.</p>
      <Link 
        href="/" 
        className="text-sm font-mono text-primary hover:underline"
      >
        Return to Registry
      </Link>
    </div>
  );
}
