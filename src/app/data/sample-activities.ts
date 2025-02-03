"use client";

import { Activity, ACTIVITY_TYPES, Coordinates } from '../strava-card';
import { sampleUsers } from './sample-users';

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

const presidioRouteCoordinates: Coordinates[] = [
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

const landEndRouteCoordinates: Coordinates[] = [
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

// Sample activities for the feed
export const sampleActivities: Activity[] = [
  {
    id: '1',
    title: 'Morning Run at Golden Gate Park',
    description: 'A beautiful run around Golden Gate Park',
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
    routeCoordinates: presidioRouteCoordinates,
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
    routeCoordinates: landEndRouteCoordinates,
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
