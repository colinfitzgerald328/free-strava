"use client";
import ActivityCard, { Activity, Container, User } from "./strava-card";
import Profile from "./components/Profile";

// Sample users with Unsplash profile images
export const sampleUsers: { [key: string]: User } = {
  sarah: {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  },
  mike: {
    id: '2',
    name: 'Mike Peterson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  },
  emma: {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  },
  alex: {
    id: '4',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop'
  },
  chris: {
    id: '5',
    name: 'Chris Davis',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
  }
};

// Add a user for Colin
const currentUser: User = {
  id: 'colin',
  name: 'Colin Fitzgerald',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
};

// Sample coordinates for a route around Golden Gate Park
const sampleRouteCoordinates = [
  { lat: 37.7694, lng: -122.4862 },  // Starting point: Near Chain of Lakes Drive
  { lat: 37.7697, lng: -122.4845 },
  { lat: 37.7699, lng: -122.4825 },
  { lat: 37.7702, lng: -122.4802 },
  { lat: 37.7705, lng: -122.4782 },  // Along MLK Jr Drive
  { lat: 37.7712, lng: -122.4762 },
  { lat: 37.7718, lng: -122.4742 },
  { lat: 37.7725, lng: -122.4722 },  // Near California Academy of Sciences
  { lat: 37.7735, lng: -122.4702 },
  { lat: 37.7745, lng: -122.4682 },  // Music Concourse
  { lat: 37.7755, lng: -122.4662 },
  { lat: 37.7765, lng: -122.4642 },  // Conservatory of Flowers
  { lat: 37.7775, lng: -122.4622 },
  { lat: 37.7772, lng: -122.4602 },  // Heading back
  { lat: 37.7762, lng: -122.4622 },
  { lat: 37.7752, lng: -122.4642 },
  { lat: 37.7742, lng: -122.4662 },
  { lat: 37.7732, lng: -122.4682 },
  { lat: 37.7722, lng: -122.4702 },
  { lat: 37.7712, lng: -122.4722 },
  { lat: 37.7702, lng: -122.4742 },
  { lat: 37.7694, lng: -122.4862 }   // Back to start
];

const presidioRouteCoordinates = [
  { lat: 37.7982, lng: -122.4773 },  // Starting point: Presidio Gate
  { lat: 37.7989, lng: -122.4751 },
  { lat: 37.7999, lng: -122.4729 },
  { lat: 37.8012, lng: -122.4712 },
  { lat: 37.8024, lng: -122.4695 },  // Crissy Field
  { lat: 37.8036, lng: -122.4678 },
  { lat: 37.8048, lng: -122.4661 },
  { lat: 37.8059, lng: -122.4644 },  // Fort Point
  { lat: 37.8048, lng: -122.4661 },
  { lat: 37.8036, lng: -122.4678 },
  { lat: 37.8024, lng: -122.4695 },
  { lat: 37.8012, lng: -122.4712 },
  { lat: 37.7999, lng: -122.4729 },
  { lat: 37.7989, lng: -122.4751 },
  { lat: 37.7982, lng: -122.4773 }   // Back to start
];

const landEndRouteCoordinates = [
  { lat: 37.7827, lng: -122.5110 },  // Starting point: Lands End Lookout
  { lat: 37.7836, lng: -122.5095 },
  { lat: 37.7845, lng: -122.5080 },
  { lat: 37.7854, lng: -122.5065 },
  { lat: 37.7863, lng: -122.5050 },  // Coastal Trail
  { lat: 37.7872, lng: -122.5035 },
  { lat: 37.7881, lng: -122.5020 },
  { lat: 37.7890, lng: -122.5005 },  // Eagles Point
  { lat: 37.7881, lng: -122.5020 },
  { lat: 37.7872, lng: -122.5035 },
  { lat: 37.7863, lng: -122.5050 },
  { lat: 37.7854, lng: -122.5065 },
  { lat: 37.7845, lng: -122.5080 },
  { lat: 37.7836, lng: -122.5095 },
  { lat: 37.7827, lng: -122.5110 }   // Back to start
];

const sampleActivity: Activity = {
  id: '1',
  title: 'Morning Run at Golden Gate Park',
  description: 'A beautiful run around Golden Gate Park',
  location: 'Golden Gate Park, San Francisco',
  type: 'RUN',
  routeCoordinates: sampleRouteCoordinates,
  timestamp: new Date().toISOString(),
  stats: {
    distance: 8.40,
    pace: 5.5,
    duration: 2760,
    achievements: 3
  },
  kudosUsers: [sampleUsers.sarah, sampleUsers.mike],
  comments: [
    {
      id: '1',
      user: sampleUsers.emma,
      text: 'Great pace! @Mike Peterson you should join next time!',
      timestamp: '2 hours ago',
      mentions: [sampleUsers.mike]
    },
    {
      id: '2',
      user: sampleUsers.mike,
      text: 'Thanks @Emma Wilson, definitely next time!',
      timestamp: '1 hour ago',
      mentions: [sampleUsers.emma]
    }
  ],
  user: currentUser
};

// Export sample activities so they can be used in the detail page
export const sampleActivities = [
  sampleActivity,
  {
    id: '2',
    title: 'Evening Run at The Presidio',
    description: 'Beautiful sunset views of the Golden Gate Bridge',
    location: 'The Presidio, San Francisco',
    type: 'RUN',
    routeCoordinates: presidioRouteCoordinates,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    stats: {
      distance: 6.2,
      pace: 6.0,
      duration: 2232,
      achievements: 2
    },
    kudosUsers: [sampleUsers.chris, sampleUsers.emma, sampleUsers.alex],
    comments: [
      {
        id: '1',
        user: sampleUsers.alex,
        text: 'Love that route! @Chris Davis we should do this one',
        timestamp: '3 hours ago',
        mentions: [sampleUsers.chris]
      }
    ],
    user: currentUser
  },
  {
    id: '3',
    title: 'Lands End Trail Run',
    description: 'Coastal trail with amazing ocean views',
    location: 'Lands End, San Francisco',
    type: 'RUN',
    routeCoordinates: landEndRouteCoordinates,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    stats: {
      distance: 4.8,
      pace: 5.8,
      duration: 1670,
      achievements: 1
    },
    kudosUsers: [sampleUsers.sarah],
    comments: [
      {
        id: '1',
        user: sampleUsers.sarah,
        text: 'Those stairs are brutal! @Emma Wilson remember our last run here?',
        timestamp: '5 hours ago',
        mentions: [sampleUsers.emma]
      }
    ],
    user: currentUser
  }
];

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
  },
  timestamp: new Date().toISOString(),
  location: "Seattle, Washington",
  routeCoordinates: [],
  kudos: [
    { id: '1', name: 'Emma Wilson', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop&crop=faces&auto=format' },
    { id: '2', name: 'Michael Chen', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=faces&auto=format' }
  ],
  comments: [],
  user: {
    id: "456",
    name: "Garrett MacQuiddy",
    avatarUrl: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=64&h=64&fit=crop&crop=faces&auto=format",
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
