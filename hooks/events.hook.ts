import { Event } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";

interface CreateEventData {
  title: string;
  startAt: Date;
  endAt: Date;
  location?: string;
  description?: string;
  isUnlimitedCapacity?: boolean;
  isFree?: boolean;
  capacityValue?: number;
  timezone: string;
  imageBase64?: string;
  hashtags?: string[];
}

export interface EventWithHashtags extends Event {
  organizer: {
    name: string;
    image: string;
  },
  hashtags: {
    id: string;
    title: string;
  }[];
}

export const useGetEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const response = await fetch("/api/events");
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = (await response.json()) as EventWithHashtags[];
      return data;
    },
  });
};

export const useCreateEvent = () => {
  return useMutation({
    mutationFn: async (payload: CreateEventData) => {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create event");
      const data = (await response.json()) as Event;
      return data;
    },
  });
};

export const useSubscribeToEvent = () => {
  return useMutation({
    mutationFn: async (eventId: string) => {
      const response = await fetch("/api/events/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) throw new Error("Failed to subscribe to event");
      const data = (await response.json()) as Event;
      return data;
    },
  });
};
