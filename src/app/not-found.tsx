import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] p-6">
      <div className="w-full max-w-md rounded-lg border border-[#2A2A2A] bg-[#141414] p-8 text-center shadow-2xl">
        <p className="text-6xl font-bold text-[#FACC15] mb-4">404</p>

        <h1 className="text-xl font-semibold text-white mb-2">Page Not Found</h1>
        <p className="text-sm text-[#6B7280] mb-8">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-[#FACC15] px-5 py-2.5 text-sm font-semibold text-black hover:bg-[#EAB308] transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
