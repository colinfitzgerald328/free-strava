"use client";
import Link from 'next/link';

export default function Banner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-4 shadow-md">
      <div className="max-w-[1800px] mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          {/* Simple logo using emoji and styled text */}
          <div className="flex items-center">
            <span className="text-3xl">🏃‍♂️</span>
            <span className="text-2xl font-bold ml-2 tracking-tight">
              free<span className="text-orange-200">strava</span>
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
