"use client";

import { useState, useMemo } from "react";
import { Grid, List, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventsCalendar from "@/components/EventsCalendar";
import EventCard from "@/components/EventCard";
import { EventWithHashtags, useGetEvents } from "@/hooks/events.hook";

function groupEventsByDate(events: EventWithHashtags[]) {
  const groups = events.reduce((acc: { [key: string]: EventWithHashtags[] }, event) => {
    const date = new Date(event.startAt).toLocaleDateString("en-US", {
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

  const { data: events, isPending } = useGetEvents();

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events
      ?.filter((event) => {
        const eventDate = new Date(event.startAt);
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
              eventTag.title.toLowerCase().includes(tag.toLowerCase())
            )
          );

        const matchesSearch = event.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return matchesDate && matchesHashtags && matchesSearch;
      })
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [selectedDate, selectedHashtags, searchQuery, calendarView]);

  const groupedEvents = useMemo(
    () => groupEventsByDate(filteredEvents ?? []),
    [filteredEvents]
  );

  const uniqueHashtags = useMemo(() => {
    const hashtags = events?.flatMap((event) => event.hashtags || []);
    return [...new Set(hashtags)].slice(0, 10);
  }, [events]);

  return (
    <div className="flex flex-col gap-6 px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full md:hidden mb-2">
        <EventsCalendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          calendarView={calendarView}
          setCalendarView={setCalendarView}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Explore Events
              </h1>
              <div className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-[200px]"
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
                  key={hashtag.id}
                  variant={
                    selectedHashtags.includes(hashtag.title) ? "default" : "outline"
                  }
                  className={`cursor-pointer transition-colors ${
                    selectedHashtags.includes(hashtag.title)
                      ? "hover:bg-primary/90"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => {
                    if (selectedHashtags.includes(hashtag.title)) {
                      setSelectedHashtags(
                        selectedHashtags.filter((tag) => tag !== hashtag.title)
                      );
                    } else {
                      setSelectedHashtags([...selectedHashtags, hashtag.title]);
                    }
                  }}
                >
                  #{hashtag.title}
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
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
                    : "space-y-4 sm:space-y-8"
                }
              >
                {groupedEvents.map(([date, dateEvents]) => (
                  <div key={date} className="space-y-2 sm:space-y-4">
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
                      {dateEvents.map((event, index) => (
                        <div key={event.id} className="relative">
                          {viewMode === "list" &&
                            index !== dateEvents.length - 1 && (
                              <div className="absolute left-16 top-20 bottom-0 w-px bg-border hidden sm:block" />
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

        <div className="hidden md:block md:w-1/4">
          <EventsCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            calendarView={calendarView}
            setCalendarView={setCalendarView}
          />
        </div>
      </div>
    </div>
  );
}
