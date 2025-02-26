import Image from 'next/image';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface EventCardProps {
  event: {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    price: string;
    category: string;
  };
  user: User | null;
}

export default function EventCard({ event, user }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
          <span className="px-3 py-1 bg-secondary rounded-full text-sm font-medium">
            {event.price}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <span className="mr-4">📍 {event.location}</span>
          <span>📅 {new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <Link
            href={`/events/${event.id}`}
            className="text-primary hover:text-primary-hover font-medium"
          >
            View Details
          </Link>
          {user && (
            <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors">
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 