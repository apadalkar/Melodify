'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('message');

  return (
    <div>
      <h1>Error</h1>
      <p>An error occurred: {errorMessage}</p>
    </div>
  );
}