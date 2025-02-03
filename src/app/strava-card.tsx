"use client";

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Timer, Trophy, ThumbsUp, MessageSquare } from 'lucide-react';
import { debounce } from 'lodash';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { sampleUsers } from './data/sample-users';

// Constants
const ACTIVITY_TYPES = {
  RUN: 'RUN',
  BIKE: 'BIKE',
  SWIM: 'SWIM',
  OTHER: 'OTHER'
} as const;

const ACTIVITY_ICONS = {
  [ACTIVITY_TYPES.RUN]: "https://static.vecteezy.com/system/resources/thumbnails/012/742/199/small/running-icon-free-vector.jpg",
  [ACTIVITY_TYPES.BIKE]: "https://static.vecteezy.com/system/resources/thumbnails/000/551/126/small/bicycle_001-vector.jpg",
  [ACTIVITY_TYPES.SWIM]: "https://static.vecteezy.com/system/resources/thumbnails/000/551/164/small/swim_001-vector.jpg",
  [ACTIVITY_TYPES.OTHER]: "https://static.vecteezy.com/system/resources/thumbnails/000/551/164/small/other_001-vector.jpg"
} as const;

// Current user for kudos and comments
const currentUser: User = {
  id: 'colin',
  name: 'Colin Fitzgerald',
  avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop'
};

// Types
type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];

interface BaseUser {
  readonly id: string;
  readonly name: string;
  readonly avatar: string;
}

interface MentionUser extends BaseUser {
  readonly username: string;
}

type User = BaseUser;

interface Coordinates {
  readonly lat: number;
  readonly lng: number;
}

interface ActivityStats {
  readonly distance: number;
  readonly pace: number;
  readonly duration: number;
  readonly achievements: number;
  readonly elevation: number;
}

interface Comment {
  readonly id: string;
  readonly user: User;
  readonly text: string;
  readonly timestamp: string;
  readonly mentions?: User[];
}

interface Activity {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly location: string;
  readonly type: ActivityType;
  readonly routeCoordinates: readonly Coordinates[];
  readonly timestamp: string;
  readonly stats: {
    readonly distance: number;
    readonly pace: number;
    readonly duration: number;
    readonly achievements: number;
    readonly elevation: number;
  };
  readonly kudosUsers: User[];
  readonly comments: Comment[];
  readonly user: User;
}

// Initialize Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiY29saW5maXR6MzI4IiwiYSI6ImNrcTh5Ymp2dTA2dWsydXFtZzBsYnh2bzUifQ.4YFKWK-RJSVdIp15W9Fwfg';

// Error boundary
class MentionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <div className="text-sm text-red-500">Mention functionality unavailable</div>;
    }
    return this.props.children;
  }
}

// Hooks
const useFormattedDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  return `${minutes}m ${remainingSeconds}s`;
};

const useFormattedPace = (pace: number): string => {
  const minutes = Math.floor(pace);
  const seconds = Math.round((pace - minutes) * 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')} /mi`;
};

const formatDate = (timestamp: string): string => {
  if (!timestamp) return '';
  
  // If it's already a relative time string (e.g., "2 hours ago"), return as is
  if (timestamp.includes('ago')) {
    return timestamp;
  }

  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  }
};

// Mock data service
const userService = {
  searchUsers: async (query: string): Promise<readonly MentionUser[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const allUsers: readonly MentionUser[] = [
      { id: '1', name: 'Sarah Johnson', username: 'sarahj', avatar: '/api/placeholder/32/32' },
      { id: '2', name: 'Mike Peterson', username: 'mikep', avatar: '/api/placeholder/32/32' },
      { id: '3', name: 'Emma Wilson', username: 'emmaw', avatar: '/api/placeholder/32/32' },
      { id: '4', name: 'Alex Thompson', username: 'alext', avatar: '/api/placeholder/32/32' },
      { id: '5', name: 'Chris Davis', username: 'chrisd', avatar: '/api/placeholder/32/32' },
    ];

    const lowercaseQuery = query.toLowerCase();
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(lowercaseQuery) || 
      user.username.toLowerCase().includes(lowercaseQuery)
    ).slice(0, 5);
  }
};

const useMentionSearch = (query: string | null) => {
  const [results, setResults] = useState<readonly MentionUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const debouncedSearch = useMemo(
    () => debounce(async (q: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const users = await userService.searchUsers(q);
        setResults(users);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to search users'));
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 150),
    []
  );

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    } else {
      setResults([]);
      setIsLoading(false);
      setError(null);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  return { results, isLoading, error };
};

interface KudosState {
  readonly kudosUsers: User[];
  readonly hasGivenKudos: boolean;
  readonly toggleKudos: () => void;
}

const useKudos = (initialKudosUsers: User[]) => {
  const [kudosUsers, setKudosUsers] = useState<User[]>(initialKudosUsers);
  const [hasGivenKudos, setHasGivenKudos] = useState(false);

  const toggleKudos = () => {
    if (hasGivenKudos) {
      setKudosUsers(kudosUsers.filter(user => user.id !== currentUser.id));
    } else {
      setKudosUsers([...kudosUsers, currentUser]);
    }
    setHasGivenKudos(!hasGivenKudos);
  };

  return { kudosUsers, hasGivenKudos, toggleKudos };
};

interface CommentState {
  readonly comments: readonly Comment[];
  readonly isCommenting: boolean;
  readonly setIsCommenting: (value: boolean) => void;
  readonly addComment: (text: string) => void;
}

const useComments = (initialComments: readonly Comment[] = []): CommentState => {
  const [comments, setComments] = useState<readonly Comment[]>(initialComments);
  const [isCommenting, setIsCommenting] = useState(false);

  const addComment = useCallback((text: string) => {
    const newComment: Comment = {
      id: String(Date.now()),
      text,
      timestamp: new Date().toISOString(),
      user: {
        id: 'current-user',
        name: 'Current User',
        avatar: '/api/placeholder/32/32'
      }
    };
    setComments(prev => [...prev, newComment]);
    setIsCommenting(false);
  }, []);

  return { comments, isCommenting, setIsCommenting, addComment };
};

// Components
interface AvatarProps {
  readonly url?: string;
  readonly alt: string;
  readonly size?: 'sm' | 'md' | 'lg';
  readonly className?: string;
}

const Avatar = memo(({ 
  url, 
  alt, 
  size = 'md',
  className = '' 
}: AvatarProps): React.JSX.Element => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-200 overflow-hidden ${className}`}>
      {url ? (
        <img 
          src={url} 
          alt={alt} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
          {alt.charAt(0)}
        </div>
      )}
    </div>
  );
});
Avatar.displayName = 'Avatar';

interface StatCardProps {
  readonly label: string;
  readonly value: React.ReactNode;
}

const StatCard = memo(({ label, value }: StatCardProps): React.JSX.Element => (
  <div className="flex flex-col">
    <span className="text-gray-600 text-sm">{label}</span>
    <span className="text-xl font-bold">{value}</span>
  </div>
));
StatCard.displayName = 'StatCard';

interface ActionButtonProps {
  readonly icon: React.ElementType;
  readonly label: string;
  readonly onClick: () => void;
  readonly isActive?: boolean;
  readonly disabled?: boolean;
}

const ActionButton = memo(({ 
  icon: Icon, 
  label, 
  onClick, 
  isActive = false,
  disabled = false 
}: ActionButtonProps): React.JSX.Element => {
  const [isJumping, setIsJumping] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsJumping(true);
      onClick();
      // Remove the animation class after it completes
      setTimeout(() => setIsJumping(false), 300);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        flex items-center gap-1 px-3 py-1.5 rounded-md
        transition-colors duration-200
        ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isJumping ? 'kudos-jump' : ''}
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
});
ActionButton.displayName = 'ActionButton';

interface MentionDropdownProps {
  readonly matches: readonly MentionUser[];
  readonly selectedIndex: number;
  readonly onSelect: (user: MentionUser) => void;
  readonly isLoading?: boolean;
  readonly error?: Error | null;
}

const MentionDropdown = memo(({ 
  matches, 
  selectedIndex,
  onSelect,
  isLoading = false,
  error = null
}: MentionDropdownProps): React.JSX.Element | null => {
  if ((!matches.length && !isLoading) || !matches) return null;

  return (
    <div 
      className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 w-64 max-h-64 overflow-y-auto"
    >
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading...</div>
      ) : error ? (
        <div className="p-4 text-center text-red-500">{error.message}</div>
      ) : (
        matches.map((user, index) => (
          <button
            key={user.id}
            className={`w-full px-4 py-2 flex items-center space-x-3 hover:bg-gray-50 text-left
              ${index === selectedIndex ? 'bg-blue-50' : ''}`}
            onClick={() => onSelect(user)}
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full"
            />
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-gray-500">@{user.username}</div>
            </div>
          </button>
        ))
      )}
    </div>
  );
});
MentionDropdown.displayName = 'MentionDropdown';

interface CommentInputProps {
  readonly onSubmit: (text: string, mentions: User[]) => void;
}

const CommentInput = memo(({ onSubmit }: CommentInputProps): React.JSX.Element => {
  const [text, setText] = useState('');
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [currentMentions, setCurrentMentions] = useState<User[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // For demo, we'll use our sample users
  const allUsers = Object.values(sampleUsers);

  const filteredUsers = useMemo(() => {
    if (!mentionSearch) return allUsers;
    return allUsers.filter(user =>
      user.name.toLowerCase().includes(mentionSearch.toLowerCase())
    );
  }, [mentionSearch]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Get cursor position
    const curPos = e.target.selectionStart || 0;
    setCursorPosition(curPos);
    
    // Check if we're in a mention
    const textUpToCursor = newText.slice(0, curPos);
    const lastAtSymbol = textUpToCursor.lastIndexOf('@');
    
    if (lastAtSymbol !== -1 && lastAtSymbol === textUpToCursor.lastIndexOf('@')) {
      const searchText = textUpToCursor.slice(lastAtSymbol + 1);
      setMentionSearch(searchText);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }

    // Update current mentions
    const mentionPattern = allUsers.map(user => `(@${user.name})`).join('|');
    const regex = new RegExp(mentionPattern, 'g');
    const mentions = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(newText)) !== null) {
      if (match) {
        // Get the matched name without @ if it exists
        const matchedText = match[0];
        const userName = matchedText.startsWith('@') ? matchedText.slice(1) : matchedText;
        const mentionedUser = allUsers.find(user => `@${user.name}` === matchedText);
        
        if (mentionedUser) mentions.push(mentionedUser);
      }
    }
    setCurrentMentions(mentions);
  };

  const insertMention = (user: User) => {
    const textUpToCursor = text.slice(0, cursorPosition);
    const lastAtSymbol = textUpToCursor.lastIndexOf('@');
    const newText = text.slice(0, lastAtSymbol) + `@${user.name} ` + text.slice(cursorPosition);
    setText(newText);
    setShowMentions(false);
    
    // Update mentions
    setCurrentMentions(prev => [...prev, user]);
    
    // Focus back on input
    if (inputRef.current) {
      inputRef.current.focus();
      const newCursorPos = lastAtSymbol + user.name.length + 2; // +2 for @ and space
      inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text, currentMentions);
      setText('');
      setCurrentMentions([]);
      setShowMentions(false);
    }
  };

  return (
    <div className="flex items-start space-x-3 px-4 py-3">
      <img
        src={currentUser.avatar}
        alt={currentUser.name}
        className="w-8 h-8 rounded-full"
      />
      <div className="flex-1">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={text}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Add a comment, @ to mention"
            className={`w-full px-3 py-2 bg-transparent text-[13px] text-gray-700 placeholder-gray-500 resize-none focus:outline-none transition-colors ${
              isFocused ? 'bg-white border border-gray-200 rounded' : 'border border-transparent'
            }`}
            rows={1}
          />
          
          {/* Mention suggestions dropdown */}
          {showMentions && filteredUsers.length > 0 && (
            <div className="absolute z-10 w-64 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  onClick={() => insertMention(user)}
                  className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <div>
                    <div className="text-[13px] font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">@{user.name.toLowerCase().replace(' ', '')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Post button */}
        {text.trim() && (
          <button
            onClick={handleSubmit}
            className="absolute right-6 top-3.5 text-[#fc5200] font-medium text-[13px]"
          >
            Post
          </button>
        )}
      </div>
    </div>
  );
});

interface CommentsListProps {
  readonly comments: readonly Comment[];
}

const CommentsList = memo(({ comments }: CommentsListProps): React.JSX.Element => {
  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-3 px-4 py-2.5">
          <img src={comment.user.avatar} alt={comment.user.name} className="w-8 h-8 rounded-full" />
          <div>
            <div className="text-[13px] space-x-1">
              <span className="font-semibold">{comment.user.name}</span>{' '}
              <CommentText text={comment.text} mentions={comment.mentions} />
            </div>
            <div className="text-gray-500 text-xs mt-0.5">{formatDate(comment.timestamp)}</div>
          </div>
        </div>
      ))}
    </div>
  );
});
CommentsList.displayName = 'CommentsList';

interface CommentsSectionProps {
  readonly comments: readonly Comment[];
  readonly isCommenting: boolean;
  readonly onAddComment: (text: string, mentions: User[]) => void;
}

const CommentsSection = memo(({ 
  comments,
  isCommenting,
  onAddComment 
}: CommentsSectionProps) => {
  return (
    <div className="border-t border-gray-100">
      <div className="py-1">
        {comments.map(comment => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
      {isCommenting && (
        <div className="border-t border-gray-100">
          <CommentInput onSubmit={onAddComment} />
        </div>
      )}
    </div>
  );
});

const MentionedUser = ({ user }: { user: User }) => (
  <span className="inline-flex items-center space-x-1">
    <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full" />
    <span className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
      @{user.name}
    </span>
  </span>
);

const CommentText = memo(({ text, mentions = [] }: { text: string; mentions?: User[] }) => {
  const parts = [];
  let lastIndex = 0;
  
  // Find all mentions in the text (both @Name and direct Name mentions)
  const mentionPattern = mentions.map(user => `(${user.name}|@${user.name})`).join('|');
  const regex = new RegExp(mentionPattern, 'g');
  let match: RegExpExecArray | null;
  
  while ((match = regex.exec(text)) !== null) {
    if (match) {
      // Add the text before the mention
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }
      
      // Get the matched name without @ if it exists
      const matchedText = match[0];
      const userName = matchedText.startsWith('@') ? matchedText.slice(1) : matchedText;
      const mentionedUser = mentions.find(user => `@${user.name}` === matchedText);
      
      if (mentionedUser) {
        parts.push(
          <span 
            key={`mention-${match.index}`} 
            className="text-[#fc5200] font-bold hover:underline cursor-pointer"
          >
            {matchedText.startsWith('@') ? matchedText : `@${userName}`}
          </span>
        );
      } else {
        parts.push(
          <span key={`text-${match.index}`}>
            {matchedText}
          </span>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${lastIndex}`}>
        {text.slice(lastIndex)}
      </span>
    );
  }

  return <span className="text-gray-900">{parts}</span>;
});

const Comment = memo(({ comment }: { comment: Comment }) => (
  <div className="flex items-start space-x-3 px-4 py-2.5">
    <img
      src={comment.user.avatar}
      alt={comment.user.name}
      className="w-8 h-8 rounded-full"
    />
    <div>
      <div className="text-[13px] space-x-1">
        <span className="font-semibold">{comment.user.name}</span>{' '}
        <CommentText text={comment.text} mentions={comment.mentions} />
      </div>
      <div className="text-gray-500 text-xs mt-0.5">{formatDate(comment.timestamp)}</div>
    </div>
  </div>
));

const ActivityMap = memo(({ 
  coordinates: routeCoordinates,
  className = '',
  interactive = false
}: { 
  coordinates: readonly Coordinates[];
  className?: string;
  interactive?: boolean;
}): React.JSX.Element => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [center, setCenter] = useState<mapboxgl.LngLatLike>([-122.4194, 37.7749]); // San Francisco coordinates
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      accessToken: 'pk.eyJ1IjoiY29saW5maXR6Z2VyYWxkIiwiYSI6ImNscjRtMGN2YzBjOGYya3F3cHpnZmF0eWIifQ.BzLQJZN6cRkPx_qLsE2gjA',
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: center,
      zoom: zoom,
      interactive,
      dragPan: interactive,
      dragRotate: interactive,
      scrollZoom: interactive,
      touchZoomRotate: interactive,
      doubleClickZoom: interactive,
      keyboard: interactive
    });

    if (interactive) {
      // Add navigation controls when interactive
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    map.current.on('load', () => {
      if (!map.current) return;

      map.current.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates.map(coord => [coord.lng, coord.lat] as [number, number])
          }
        }
      });

      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#fc5200',
          'line-width': 4
        }
      });

      // Calculate bounds
      const coordinates = routeCoordinates.map(coord => [coord.lng, coord.lat] as [number, number]);
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

      // Fit the map to show the entire route with padding
      map.current.fitBounds(bounds, {
        padding: 50,
        duration: 0 // Disable animation
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [routeCoordinates, interactive]);

  return <div ref={mapContainer} className={`w-full ${className || 'h-48'}`} />;
});

const Banner = dynamic(() => import('./components/Banner'), { ssr: false });

const Container = memo(({ 
  children, 
  fullWidth = false 
}: { 
  children: React.ReactNode;
  fullWidth?: boolean;
}): React.JSX.Element => (
  <div className="min-h-screen w-full bg-gray-100">
    <Banner />
    <div className="py-8 px-4 mt-[72px]">
      <div className={fullWidth ? 'w-full' : 'max-w-2xl mx-auto'}>
        {children}
      </div>
    </div>
  </div>
));
Container.displayName = 'Container';

interface ActivityCardProps {
  readonly activity: Activity;
  readonly onKudos?: (activityId: string, kudosCount: number) => void;
  readonly onComment?: (activityId: string) => void;
  readonly className?: string;
}

interface KudosSectionProps {
  readonly kudosUsers: User[];
  readonly hasGivenKudos: boolean;
  readonly onKudos: () => void;
}

const KudosSection = memo(({ 
  kudosUsers = [], 
  hasGivenKudos, 
  onKudos 
}: { 
  kudosUsers: User[];
  hasGivenKudos: boolean;
  onKudos: () => void;
}) => {
  const handleKudosClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onKudos();
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Kudos users */}
      <div className="flex items-center">
        {kudosUsers.length > 0 && (
          <div className="flex -space-x-2 mr-2">
            {kudosUsers.slice(0, 3).map((user) => (
              <img
                key={user.id}
                src={user.avatar}
                alt={user.name}
                className="w-5 h-5 rounded-full border-2 border-white"
              />
            ))}
          </div>
        )}
      </div>

      {/* Kudos button */}
      <button
        onClick={handleKudosClick}
        className="flex items-center space-x-1 hover:text-[#fc5200] transition-colors group"
      >
        <ThumbsUp 
          className={`w-4 h-4 ${
            hasGivenKudos ? 'text-[#fc5200] fill-[#fc5200]' : 'group-hover:text-[#fc5200]'
          }`} 
        />
        <span className={hasGivenKudos ? 'text-[#fc5200]' : ''}>
          {kudosUsers.length} {kudosUsers.length === 1 ? 'kudo' : 'kudos'}
        </span>
      </button>
    </div>
  );
});

interface ActivityTypeIconProps {
  readonly type: ActivityType;
  readonly className?: string;
}

const ActivityTypeIcon = memo(({ type, className = '' }: ActivityTypeIconProps) => {
  return (
    <div className={`inline-flex items-center justify-center w-5 h-5 bg-[#1E90FF] bg-opacity-20 rounded p-0.5 ${className}`}>
      <img 
        src={ACTIVITY_ICONS[type]}
        alt={type}
        className="w-full h-full object-contain"
      />
    </div>
  );
});

interface ActivityHeaderProps {
  readonly user: User;
  readonly timestamp: string;
  readonly location: string;
}

const ActivityHeader = memo(({ user, timestamp, location }: ActivityHeaderProps): React.JSX.Element => {
  const formattedDate = formatDate(timestamp);
  
  return (
    <div className="flex items-center space-x-3">
      <img
        src={user.avatar}
        alt={user.name}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h2 className="font-semibold text-[15px] text-gray-900">{user.name}</h2>
        <p className="text-[13px] text-gray-600">
          {formattedDate} • {location}
        </p>
      </div>
    </div>
  );
});

const ActivityCard = memo(({ activity }: { activity: Activity }) => {
  const [kudosUsers, setKudosUsers] = useState<User[]>(activity.kudosUsers || []);
  const [hasGivenKudos, setHasGivenKudos] = useState(false);
  const [comments, setComments] = useState<Comment[]>(activity.comments || []);
  const [showComments, setShowComments] = useState(true);

  const handleKudos = () => {
    if (!hasGivenKudos) {
      setKudosUsers(prev => [...prev, currentUser]);
      setHasGivenKudos(true);
    } else {
      setKudosUsers(prev => prev.filter(user => user.id !== currentUser.id));
      setHasGivenKudos(false);
    }
  };

  const handleComment = (text: string, mentions: User[]) => {
    const newComment: Comment = {
      id: String(Date.now()),
      text,
      mentions,
      user: currentUser,
      timestamp: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Activity Details - Clickable */}
      <Link href={`/activity/${activity.id}`} className="block">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-3">
            <img src={activity.user.avatar} alt="" className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-semibold">{activity.user.name}</div>
              <div className="text-xs text-gray-500">{formatDate(activity.timestamp)}</div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold mb-4 flex items-center group">
            {activity.type === ACTIVITY_TYPES.RUN && (
              <Timer className="w-5 h-5 mr-2 text-gray-600 group-hover:text-[#007FB6]" />
            )}
            <span className="group-hover:text-[#007FB6] transition-colors">
              {activity.title}
            </span>
          </h2>

          {/* Stats */}
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <div className="flex space-x-6">
                <div className="flex flex-col items-start">
                  <div className="text-lg font-semibold">{activity.stats.distance}mi</div>
                  <div className="text-xs text-gray-600">Distance</div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-lg font-semibold">{useFormattedPace(activity.stats.pace)}</div>
                  <div className="text-xs text-gray-600">Pace</div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-lg font-semibold">{useFormattedDuration(activity.stats.duration)}</div>
                  <div className="text-xs text-gray-600">Time</div>
                </div>
                <div className="flex flex-col items-start">
                  <div className="text-lg font-semibold">{activity.stats.elevation}ft</div>
                  <div className="text-xs text-gray-600">Elevation</div>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="h-48 bg-gray-100 rounded-lg">
            <ActivityMap coordinates={activity.routeCoordinates} />
          </div>
        </div>
      </Link>

      {/* Actions and Comments - Not Clickable */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-[13px] text-gray-600">
            <KudosSection 
              kudosUsers={kudosUsers}
              hasGivenKudos={hasGivenKudos}
              onKudos={handleKudos}
            />
            <span>•</span>
            <span>{comments.length} comments</span>
          </div>
          <div>
            <button
              onClick={() => setShowComments(true)}
              className="flex items-center space-x-2 text-[13px] text-gray-600"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Comment</span>
            </button>
          </div>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4">
            <CommentsSection
              comments={comments}
              isCommenting={true}
              onAddComment={handleComment}
            />
          </div>
        )}
      </div>
    </div>
  );
});

// Exports
export type { Activity, ActivityStats, User, Coordinates, Comment };
export { ACTIVITY_TYPES };
export { Container };
export { ActivityMap };
export default ActivityCard;