"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MapPin, Users, Grid, List, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

// This would typically come from an API or database
const events = [
  {
    id: 1,
    title: "Tech Conference 2023",
    date: "2023-09-15T09:00:00Z",
    location: "San Francisco, CA",
    thumbnail: "https://picsum.photos/600/400",
    price: 199,
    creator: { name: "TechOrg", avatar: "/placeholder.avif" },
    description:
      "Join us for the biggest tech conference of the year. Network with industry leaders, attend workshops, and discover the latest innovations in technology.",
    attendees: 520,
    isFree: false,
    isOnline: false,
    hashtags: ["tech", "conference", "programming"],
    isSoldOut: false,
  },
  {
    id: 2,
    title: "Virtual Yoga Workshop",
    date: "2023-08-20T18:30:00Z",
    location: "Online",
    thumbnail: "https://picsum.photos/600/400",
    price: 0,
    description:
      "Join us for a relaxing virtual yoga workshop. All levels welcome.",
    creator: {
      name: "YogaLife",
      avatar: "/placeholder.avif",
    },
    attendees: 150,
    isFree: true,
    isOnline: true,
    hashtags: ["wellness", "yoga", "health"],
    isSoldOut: false,
  },
  {
    id: 3,
    title: "Local Food Festival",
    date: "2023-10-01T11:00:00Z",
    location: "Central Park, New York",
    thumbnail: "https://picsum.photos/600/400",
    price: 25,
    description:
      "Experience the best local cuisine at our annual food festival. Enjoy live music, cooking demonstrations, and tastings from top chefs.",
    creator: {
      name: "NYCFoodies",
      avatar: "/placeholder.avif",
    },
    attendees: 1200,
    isFree: false,
    isOnline: false,
    hashtags: ["foodie", "drink"],
    isSoldOut: true,
  },
  {
    id: 4,
    title: "Digital Marketing Seminar",
    date: "2023-09-05T14:00:00Z",
    location: "Online",
    thumbnail: "https://picsum.photos/600/400",
    price: 50,
    description:
      "Learn the latest strategies in digital marketing from industry experts. Perfect for marketers of all levels.",
    creator: {
      name: "MarketPros",
      avatar: "/placeholder.avif",
    },
    attendees: 300,
    isFree: false,
    isOnline: true,
    hashtags: ["marketing"],
    isSoldOut: false,
  },
  {
    id: 5,
    title: "Community Art Exhibition",
    date: "2023-09-22T10:00:00Z",
    location: "Downtown Gallery, Chicago",
    thumbnail: "https://picsum.photos/600/400",
    price: 0,
    description:
      "Explore the creativity of local artists at our community art exhibition. Free entry for all.",
    creator: {
      name: "ArtChicago",
      avatar: "/placeholder.avif",
    },
    attendees: 500,
    isFree: true,
    isOnline: false,
    hashtags: ["arts"],
    isSoldOut: false,
  },
];

function groupEventsByDate(events: any[]) {
  const groups = events.reduce((acc, event) => {
    const date = new Date(event.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {});

  return Object.entries(groups).sort(
    ([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime()
  );
}

export default function ExploreEvents() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [calendarView, setCalendarView] = useState<"next" | "past" | "date">(
    "next"
  );

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((event) => {
        const eventDate = new Date(event.date);
        const matchesDate = selectedDate
          ? eventDate.toDateString() === selectedDate.toDateString()
          : calendarView === "next"
          ? eventDate >= now
          : calendarView === "past"
          ? eventDate < now
          : true;

        const matchesHashtags =
          selectedHashtags.length === 0 ||
          selectedHashtags.some((tag) =>
            event.hashtags.some((eventTag) =>
              eventTag.toLowerCase().includes(tag.toLowerCase())
            )
          );

        const matchesSearch = event.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return matchesDate && matchesHashtags && matchesSearch;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedDate, selectedHashtags, searchQuery, calendarView]);

  const groupedEvents = useMemo(
    () => groupEventsByDate(filteredEvents),
    [filteredEvents]
  );

  const uniqueHashtags = useMemo(() => {
    const hashtags = events.flatMap((event) => event.hashtags || []);
    return [...new Set(hashtags)].slice(0, 10); // Mostrar até 10 hashtags únicas
  }, [events]);

  return (
    <div className="flex flex-col md:flex-row gap-6 px-6 py-12">
      <div className="w-full md:w-3/4">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Explore Events
            </h1>
            <div className="flex items-center space-x-2">
              <Input
                type="search"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[200px]"
              />

              <div className="flex space-x-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {uniqueHashtags.map((hashtag) => (
              <Badge
                key={hashtag}
                variant={
                  selectedHashtags.includes(hashtag) ? "default" : "outline"
                }
                className={`cursor-pointer transition-colors ${
                  selectedHashtags.includes(hashtag)
                    ? "hover:bg-primary/90"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => {
                  if (selectedHashtags.includes(hashtag)) {
                    setSelectedHashtags(
                      selectedHashtags.filter((tag) => tag !== hashtag)
                    );
                  } else {
                    setSelectedHashtags([...selectedHashtags, hashtag]);
                  }
                }}
              >
                #{hashtag}
              </Badge>
            ))}
            {selectedHashtags.length > 0 && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-secondary/80 transition-colors flex items-center gap-1"
                onClick={() => setSelectedHashtags([])}
              >
                <X className="h-3 w-3" />
                <span>Clear all</span>
              </Badge>
            )}
          </div>

          {groupedEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No events found.
            </p>
          ) : (
            <div
              className={
                viewMode === "grid" ? "grid grid-cols-2 gap-6" : "space-y-8"
              }
            >
              {groupedEvents.map(([date, dateEvents]: any) => (
                <div key={date} className="space-y-4">
                  <h2 className="text-lg font-semibold sticky top-0 bg-background py-2 z-10">
                    {date}
                  </h2>
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 gap-4"
                        : "space-y-4"
                    }
                  >
                    {dateEvents.map((event: any, index: number) => (
                      <div key={event.id} className="relative">
                        {viewMode === "list" &&
                          index !== dateEvents.length - 1 && (
                            <div className="absolute left-16 top-20 bottom-0 w-px bg-border" />
                          )}
                        <EventCard
                          event={event}
                          setSelectedHashtags={setSelectedHashtags}
                          selectedHashtags={selectedHashtags}
                          viewMode={viewMode}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="w-full md:w-1/4">
        <div className="sticky top-4 space-y-4 bg-backgrounds">
          <Card>
            <CardHeader className="bg-card mb-4 rounded-lg">
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs
                defaultValue="next"
                onValueChange={(value) => {
                  setCalendarView(value as "next" | "past" | "date");
                  if (value !== "date") setSelectedDate(undefined);
                }}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="next" className="flex-1">
                    Next
                  </TabsTrigger>
                  <TabsTrigger value="date" className="flex-1">
                    Date
                  </TabsTrigger>
                  <TabsTrigger value="past" className="flex-1">
                    Past
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {calendarView === "date" && (
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border bg-card"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function EventCard({
  event,
  viewMode,
  setSelectedHashtags,
  selectedHashtags,
}: {
  event: any;
  viewMode: "grid" | "list";
  setSelectedHashtags: (hashtag: string[]) => void;
  selectedHashtags: string[];
}) {
  function truncateText(text: string, maxLength: number) {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  return (
    <Card className={`overflow-hidden ${viewMode === "list" ? "flex" : ""}`}>
      {viewMode === "list" && (
        <div className="w-32 flex-shrink-0 flex flex-col items-center justify-center p-4 border-r bg-card">
          <span className="text-2xl font-bold">
            {new Date(event.date).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
      <div
        className={`${viewMode === "list" ? "flex flex-1 bg-card" : "bg-card"}`}
      >
        <div
          className={
            viewMode === "list"
              ? "w-1/4 relative h-auto"
              : "relative w-full h-48"
          }
        >
          <Image
            src={
              event.thumbnail ||
              `https://picsum.photos/seed/${event.id}/600/400`
            }
            alt={event.title}
            fill
            sizes={viewMode === "list" ? "25vw" : "100%"}
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAIhQOUfMHzRAAAAABJRU5ErkJggg=="
          />
        </div>
        <div
          className={`flex flex-col h-full ${
            viewMode === "list" ? "w-3/4" : ""
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                {viewMode === "grid" && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {new Date(event.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge variant={event.isFree ? "secondary" : "default"}>
                  {event.isFree ? "Free" : `$${event.price}`}
                </Badge>
                {event.isSoldOut && (
                  <Badge variant="destructive">Sold Out</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow space-y-2 pb-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              {event.location}
            </div>

            {event.description && (
              <p
                className={`text-sm mt-2 text-muted-foreground ${
                  viewMode === "grid"
                    ? "line-clamp-2 h-10"
                    : "line-clamp-3 h-[4.5rem]"
                }`}
              >
                {viewMode === "list"
                  ? truncateText(event.description, 300)
                  : truncateText(event.description, 160)}
              </p>
            )}

            <div className="flex flex-wrap gap-1 mt-2">
              {event.hashtags.map((hashtag: string) => (
                <Badge
                  key={hashtag}
                  variant="outline"
                  className="cursor-pointer hover:bg-accent text-xs"
                  onClick={() => {
                    if (!selectedHashtags.includes(hashtag)) {
                      setSelectedHashtags([...selectedHashtags, hashtag]);
                    }
                  }}
                >
                  #{hashtag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <div className="mt-auto p-4 flex justify-between items-center border-t">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 border-2 border-white shadow-sm ring-2 ring-background overflow-hidden">
                <AvatarImage
                  src={event.creator.avatar}
                  alt={event.creator.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-medium">
                  {event.creator.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">
                  {event.creator.name}
                </span>
                <span className="text-xs text-muted-foreground">Organizer</span>
              </div>
            </div>
            <Button>Register Now</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
