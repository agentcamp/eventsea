"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { MapPin, Users, Grid, List } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// This would typically come from an API or database
const events = [
  {
    id: 1,
    title: "Tech Conference 2023",
    date: "2023-09-15T09:00:00Z",
    location: "San Francisco, CA",
    thumbnail: "/placeholder.avif",
    price: 199,
    creator: { name: "TechOrg", avatar: "/placeholder.avif" },
    attendees: 520,
    isFree: false,
    isOnline: false,
    category: "Technology",
    isSoldOut: false,
  },
  {
    id: 2,
    title: "Virtual Yoga Workshop",
    date: "2023-08-20T18:30:00Z",
    location: "Online",
    thumbnail: "/placeholder.avif",
    price: 0,
    creator: {
      name: "YogaLife",
      avatar: "/placeholder.avif",
    },
    attendees: 150,
    isFree: true,
    isOnline: true,
    category: "Health & Wellness",
    isSoldOut: false,
  },
  {
    id: 3,
    title: "Local Food Festival",
    date: "2023-10-01T11:00:00Z",
    location: "Central Park, New York",
    thumbnail: "/placeholder.avif",
    price: 25,
    creator: {
      name: "NYCFoodies",
      avatar: "/placeholder.avif",
    },
    attendees: 1200,
    isFree: false,
    isOnline: false,
    category: "Food & Drink",
    isSoldOut: true,
  },
  {
    id: 4,
    title: "Digital Marketing Seminar",
    date: "2023-09-05T14:00:00Z",
    location: "Online",
    thumbnail: "/placeholder.avif",
    price: 50,
    creator: {
      name: "MarketPros",
      avatar: "/placeholder.avif",
    },
    attendees: 300,
    isFree: false,
    isOnline: true,
    category: "Business",
    isSoldOut: false,
  },
  {
    id: 5,
    title: "Community Art Exhibition",
    date: "2023-09-22T10:00:00Z",
    location: "Downtown Gallery, Chicago",
    thumbnail: "/placeholder.avif",
    price: 0,
    creator: {
      name: "ArtChicago",
      avatar: "/placeholder.avif",
    },
    attendees: 500,
    isFree: true,
    isOnline: false,
    category: "Arts & Culture",
    isSoldOut: false,
  },
];

const categories = [
  "All",
  "Technology",
  "Health & Wellness",
  "Food & Drink",
  "Business",
  "Arts & Culture",
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
  const [selectedCategory, setSelectedCategory] = useState("All");
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
        const matchesCategory =
          selectedCategory === "All" || event.category === selectedCategory;
        const matchesSearch = event.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesDate && matchesCategory && matchesSearch;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedDate, selectedCategory, searchQuery, calendarView]);

  const groupedEvents = useMemo(
    () => groupEventsByDate(filteredEvents),
    [filteredEvents]
  );

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
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                        <EventCard event={event} viewMode={viewMode} />
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
}: {
  event: any;
  viewMode: "grid" | "list";
}) {
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
        <div className={viewMode === "list" ? "w-1/4" : ""}>
          <img
            src={event.thumbnail || "/placeholder.svg"}
            alt={event.title}
            className={`object-cover ${
              viewMode === "list" ? "h-full" : "w-full h-48"
            }`}
          />
        </div>
        <div className={`flex flex-col ${viewMode === "list" ? "w-3/4" : ""}`}>
          <CardHeader>
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
          <CardContent className="space-y-2 p-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1  h-4 w-4" />
              {event.location}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-1 h-4 w-4" />
              {event.attendees} attending
            </div>
            <Badge variant="outline">{event.category}</Badge>
          </CardContent>
          <div className="mt-auto p-4 flex justify-between items-center border-t">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={event.creator.avatar}
                  alt={event.creator.name}
                />
                <AvatarFallback>{event.creator.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {event.creator.name}
              </span>
            </div>
            <Link href={`/events/${event.id}`}>
              <Button>View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}