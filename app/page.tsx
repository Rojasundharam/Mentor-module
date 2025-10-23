'use client';

import Image from "next/image";
import { useAuth } from "@/components/providers/AuthProvider";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        {user ? (
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                  Welcome, {user.full_name}!
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">{user.email}</p>
              </div>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
                Your Profile
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">User ID:</span>
                  <span className="text-black dark:text-zinc-50 font-mono">{user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Role:</span>
                  <span className="text-black dark:text-zinc-50 capitalize">{user.role}</span>
                </div>
                {user.institution_id && (
                  <div className="flex justify-between">
                    <span className="text-zinc-600 dark:text-zinc-400">Institution:</span>
                    <span className="text-black dark:text-zinc-50">{user.institution_id}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              You are successfully authenticated with MyJKKN OAuth 2.0! Your session is managed securely with automatic token refresh.
            </p>

            <LogoutButton />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Welcome to {process.env.NEXT_PUBLIC_APP_NAME}
            </h1>
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              This application uses MyJKKN OAuth 2.0 authentication. Sign in to get started.
            </p>

            <LoginButton />
          </div>
        )}

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
