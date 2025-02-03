import { User, Activity, ACTIVITY_TYPES, Coordinates } from '../strava-card';

// Sample users with Unsplash profile images
export const sampleUsers: { [key: string]: User } = {
  colin: {
    id: 'colin',
    name: 'Colin Fitzgerald',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
  },
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

// Sample coordinates for a route around Golden Gate Park
const sampleRouteCoordinates: Coordinates[] = [
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

// Sample activities for the feed
export const sampleActivities: Activity[] = [
  {
    id: '1',
    title: 'Morning Run in Golden Gate Park',
    description: 'Beautiful morning for a run through the park! ',
    location: 'Golden Gate Park, San Francisco',
    type: ACTIVITY_TYPES.RUN,
    routeCoordinates: sampleRouteCoordinates,
    timestamp: new Date().toISOString(),
    stats: {
      distance: 8.40,
      pace: 5.5,
      duration: 2760,
      achievements: 3,
      elevation: 420
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
    user: sampleUsers.colin
  },
  {
    id: '2',
    title: 'Evening Run at The Presidio',
    description: 'Beautiful sunset views of the Golden Gate Bridge',
    location: 'The Presidio, San Francisco',
    type: ACTIVITY_TYPES.RUN,
    routeCoordinates: sampleRouteCoordinates.map(coord => ({
      lat: coord.lat + 0.01,
      lng: coord.lng + 0.01
    })),
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    stats: {
      distance: 6.2,
      pace: 6.0,
      duration: 2232,
      achievements: 2,
      elevation: 380
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
    user: sampleUsers.colin
  },
  {
    id: '3',
    title: 'Lands End Trail Run',
    description: 'Coastal trail with amazing ocean views',
    location: 'Lands End, San Francisco',
    type: ACTIVITY_TYPES.RUN,
    routeCoordinates: sampleRouteCoordinates.map(coord => ({
      lat: coord.lat - 0.01,
      lng: coord.lng - 0.01
    })),
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    stats: {
      distance: 4.8,
      pace: 5.8,
      duration: 1670,
      achievements: 1,
      elevation: 520
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
    user: sampleUsers.colin
  }
];
