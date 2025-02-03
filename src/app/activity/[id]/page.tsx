"use client";
import { useParams } from 'next/navigation';
import { Activity, Container, ActivityMap } from '../../strava-card';
import { sampleActivities } from '../../page';
import { useMemo } from 'react';
import { ChevronLeft, BarChart2, TrendingUp, Clock, Trophy, MapPin, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';

const StatBox = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon: React.ElementType }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <div className="flex items-center space-x-3 mb-2">
      <Icon className="w-5 h-5 text-gray-500" />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const calculatePaceStats = (activity: Activity) => {
  // For this example, we'll generate some dummy stats
  const avgPace = activity.stats.pace;
  const bestPace = avgPace * 0.9;  // 10% faster than average
  const firstMilePace = avgPace * 1.05;  // 5% slower than average
  const lastMilePace = avgPace * 0.95;  // 5% faster than average

  // Generate splits based on the distance
  const splits = Array.from({ length: Math.floor(activity.stats.distance) }, (_, i) => {
    const variation = Math.sin(i) * 0.2; // Create some variation in pace
    const splitPace = avgPace * (1 + variation);
    const elevation = Math.round(Math.sin(i) * 50); // Dummy elevation data
    
    return {
      mile: i + 1,
      pace: splitPace,
      elevation,
      elevationChange: elevation - (Math.round(Math.sin(i - 1) * 50) || 0)
    };
  });

  return {
    avgPace,
    bestPace,
    firstMilePace,
    lastMilePace,
    splits
  };
};

const formatPace = (pace: number): string => {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')} /mi`;
};

export default function ActivityDetail() {
  const params = useParams();
  const activityId = params.id as string;

  const activity = useMemo(() => {
    return sampleActivities.find(a => a.id === activityId);
  }, [activityId]);

  if (!activity) {
    return (
      <Container>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">Activity not found</h1>
          <Link href="/" className="text-blue-500 hover:text-blue-600 mt-4 inline-block">
            Return to activities
          </Link>
        </div>
      </Container>
    );
  }

  const paceStats = calculatePaceStats(activity);

  return (
    <Container fullWidth>
      <div className="max-w-[1800px] mx-auto">
        {/* Header with back button */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to activities
          </Link>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Mile Splits */}
          <div className="col-span-3">
            <div className="bg-white p-6 rounded-lg border border-gray-200 h-[calc(100vh-12rem)]">
              <h2 className="text-lg font-semibold mb-6">Mile Splits</h2>
              <div className="space-y-4 h-[calc(100%-4rem)] overflow-y-auto">
                {paceStats.splits.map((split) => (
                  <div key={split.mile} className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600 w-16">Mile {split.mile}</span>
                      <span className="font-medium">{formatPace(split.pace)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className={split.elevationChange > 0 ? 'text-green-600' : 'text-red-600'}>
                        {split.elevationChange > 0 ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                      </span>
                      <span className="text-gray-600 w-12 text-right">{Math.abs(split.elevationChange)}ft</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Map */}
          <div className="col-span-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 h-[calc(100vh-12rem)]">
              <h2 className="text-lg font-semibold mb-4">Route</h2>
              <ActivityMap 
                coordinates={activity.routeCoordinates} 
                className="h-[calc(100%-2rem)]" 
                interactive={true}
              />
            </div>
          </div>

          {/* Right Column - Activity Info and Stats */}
          <div className="col-span-3 space-y-6">
            {/* Activity Title */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900">{activity.title}</h1>
              {activity.description && (
                <p className="text-gray-600 mt-2">{activity.description}</p>
              )}
              <div className="flex items-center text-gray-500 text-sm mt-4">
                <MapPin className="w-4 h-4 mr-1" />
                {activity.location}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4">
              <StatBox 
                label="Distance" 
                value={`${activity.stats.distance.toFixed(2)} mi`}
                icon={BarChart2}
              />
              <StatBox 
                label="Average Pace" 
                value={formatPace(paceStats.avgPace)}
                icon={TrendingUp}
              />
              <StatBox 
                label="Duration" 
                value={new Date(activity.stats.duration * 1000).toISOString().substr(11, 8)}
                icon={Clock}
              />
              <StatBox 
                label="Achievements" 
                value={activity.stats.achievements}
                icon={Trophy}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
