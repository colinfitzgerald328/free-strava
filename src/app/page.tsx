"use client";
import ActivityCard, { Activity, Container } from "./strava-card";
import Profile from "./components/Profile";
import { sampleActivities } from "./data/sample-activities";

const activity: Activity = {
  id: "123",
  title: "Afternoon Run",
  description: "A quick run around the block",
  type: "RUN" as const,
  stats: {
    distance: 6.28,
    pace: 6.883333, // Will be formatted as 6:53 /mi
    duration: 2592, // 43m 12s
    achievements: 2,
    elevation: 450
  },
  timestamp: new Date().toISOString(),
  location: "Seattle, Washington",
  routeCoordinates: [],
  kudosUsers: [
    { id: '1', name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces&auto=format' },
    { id: '2', name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=faces&auto=format' }
  ],
  comments: [],
  user: {
    id: "456",
    name: "Garrett MacQuiddy",
    avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=64&h=64&fit=crop&crop=faces&auto=format",
  },
};

const handleKudos = (activityId: string) => {
  // Handle kudos
  console.log("Kudos for activity:", activityId);
};

const handleComment = (activityId: string) => {
  console.log("Comment for activity:", activityId);
  // Handle comment
};

export default function Home() {
  return (
    <Container fullWidth>
      <div className="max-w-[1800px] mx-auto">
        <div className="grid grid-cols-12 gap-8">
          {/* Profile Section */}
          <div className="col-span-3">
            <div className="sticky top-[88px]"> {/* 72px banner height + 16px gap */}
              <Profile 
                stats={{
                  following: 53,
                  followers: 49,
                  activities: 1017
                }}
              />
            </div>
          </div>

          {/* Activities Feed */}
          <div className="col-span-6 space-y-6">
            {sampleActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

          {/* Right sidebar - could be used for challenges, achievements, etc */}
          <div className="col-span-3">
          </div>
        </div>
      </div>
    </Container>
  );
}
