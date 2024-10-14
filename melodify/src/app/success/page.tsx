'use client';

import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get('access_token');

  return (
    <div>
      <h1>Login Successful!</h1>
      <p>Your access token: {accessToken}</p>
    </div>
  );
}