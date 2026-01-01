import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-center py-12 px-6 bg-white dark:bg-black">
        <h1 className="text-4xl font-bold text-center text-black dark:text-zinc-50 mb-10 bg-cyan-400 rounded-4xl w-2xl">
          Welcome to Search school!
        </h1>

        <div className="mt-6 flex gap-4">
          <Link
            href="/addSchool"
            className="px-16 py-6 rounded bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center justify-center"
          >
            Add School
          </Link>
          <Link
            href="/searchSchool"
            className="px-16 py-6 rounded bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center justify-center" 
          >
            Search School
          </Link>
        </div>
      </main>
    </div>
  );
}
