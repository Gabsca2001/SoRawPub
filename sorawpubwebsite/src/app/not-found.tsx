// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404 - Page not found</h1>
      <p className="mb-4">
        Sorry, the page you're looking for doesn't exist.
      </p>
      <Link href="/" className="underline">
        Go back home
      </Link>
    </main>
  );
}
