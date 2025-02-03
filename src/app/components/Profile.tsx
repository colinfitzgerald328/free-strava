"use client";

interface ProfileStats {
  following: number;
  followers: number;
  activities: number;
}

export default function Profile({ stats }: { stats: ProfileStats }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      {/* Profile Image */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img
            src="https://avatars.githubusercontent.com/u/8964691"
            alt="Colin FitzGerald"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Name */}
      <h1 className="text-3xl font-bold text-center mb-8">
        Colin FitzGerald
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center mb-8">
        <div>
          <div className="text-2xl font-semibold">{stats.following}</div>
          <div className="text-gray-600">Following</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{stats.followers}</div>
          <div className="text-gray-600">Followers</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{stats.activities}</div>
          <div className="text-gray-600">Activities</div>
        </div>
      </div>

      {/* Latest Activity */}
      <div>
        <h2 className="font-semibold mb-2">Latest Activity</h2>
        <div className="text-lg font-medium">Morning Ride</div>
        <div className="text-gray-600">Jan 25, 2025</div>
      </div>

      {/* Training Log */}
      <div className="mt-6">
        <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-between">
          <span className="font-medium">Your Training Log</span>
          <span className="text-gray-400">→</span>
        </button>
      </div>
    </div>
  );
}
