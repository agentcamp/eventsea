'use client';

import { useState } from 'react';
import { useAuth } from '../providers';
import EventCard from '../components/EventCard';

// Mock data for initial development
const MOCK_EVENTS = [
  {
    id: 1,
    title: 'Web3 Developer Summit',
    description: 'Join the biggest Web3 developer conference of the year',
    date: '2024-06-15T09:00:00',
    location: 'Virtual',
    image: '/event-1.jpg',
    price: 'Free',
    category: 'Technology'
  },
  {
    id: 2,
    title: 'NFT Art Exhibition',
    description: 'Discover the future of digital art in this exclusive exhibition',
    date: '2024-06-20T18:00:00',
    location: 'New York, NY',
    image: '/event-2.jpg',
    price: '0.1 ETH',
    category: 'Art'
  },
  {
    id: 3,
    title: 'DeFi Workshop',
    description: 'Learn about decentralized finance from industry experts',
    date: '2024-06-25T14:00:00',
    location: 'London, UK',
    image: '/event-3.jpg',
    price: '50 USDC',
    category: 'Finance'
  },
  // Add more mock events as needed
];

const CATEGORIES = ['All', 'Technology', 'Art', 'Finance', 'Music', 'Sports'];

export default function Events() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();

  const filteredEvents = MOCK_EVENTS.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            Discover Amazing Events
          </h1>
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>
      </header>

      {/* Category Filter */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} user={user} />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-gray-600">No events found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  );
} 