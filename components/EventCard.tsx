import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { EventWithHashtags, useSubscribeToEvent } from "@/hooks/events.hook";
import { toast } from "sonner";
import { EventParticipant } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { GithubAuthModal } from "./GithubAuthModal";

export default function EventCard({
  event,
  viewMode,
  setSelectedHashtags,
  selectedHashtags,
  subscriptions
}: {
  event: EventWithHashtags;
  viewMode: "grid" | "list";
  setSelectedHashtags: (hashtag: string[]) => void;
  selectedHashtags: string[];
  subscriptions?: EventParticipant[];
}) {
  const { mutate: subscribeToEvent, isPending } = useSubscribeToEvent();
  const { data: session } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const isSubscribed = subscriptions?.some(
    (subscription) => subscription.eventId === event.id
  );
  const queryClient = useQueryClient();

  const truncateText = (text: string, maxLength: number) => {
    if (!text || text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  const handleSubscribe = async () => {
    // Check if the user is authenticated
    if (!session) {
      setShowAuthModal(true);
      return;
    }

    await subscribeToEvent(event.id, {
      onSuccess: () => {
        toast.success("Subscribed to event successfully");
        queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      },
      onError: () => {
        toast.error("Failed to subscribe to event");
      },
    });
  };

  return (
    <>
      <Card
        className={`overflow-hidden ${
          viewMode === "list" ? "flex flex-col sm:flex-row" : ""
        }`}
      >
        {viewMode === "list" && (
          <div className="w-full sm:w-32 flex-shrink-0 flex items-center justify-center p-2 sm:p-4 border-b sm:border-b-0 sm:border-r bg-card">
            <span className="text-xl sm:text-2xl font-bold">
              {new Date(event.startAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        )}
        <div
          className={`${
            viewMode === "list"
              ? "flex flex-1 flex-col sm:flex-row bg-card"
              : "bg-card"
          }`}
        >
          <div
            className={
              viewMode === "list"
                ? "w-full sm:w-1/4 h-32 sm:h-auto relative"
                : "relative w-full h-40 sm:h-48"
            }
          >
            <Image
              src={
                event.imageBase64 ||
                "/placeholder.avif"
              }
              alt={event.title}
              fill
              sizes={
                viewMode === "list"
                  ? "(max-width: 640px) 100vw, 25vw"
                  : "(max-width: 640px) 100vw, 50vw"
              }
              className="object-cover"
            />
          </div>
          <div
            className={`flex flex-col h-full ${
              viewMode === "list" ? "w-full sm:w-3/4" : ""
            }`}
          >
            <CardHeader className="pb-1 sm:pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg sm:text-xl">
                    {event.title}
                  </CardTitle>
                  {viewMode === "grid" && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {new Date(event.startAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant={event.isFree ? "secondary" : "default"}>
                    {event.isFree ? "Free" : "Paid"}
                  </Badge>
                  {/* {event.isSoldOut && (
                    <Badge variant="destructive">Sold Out</Badge>
                  )} */}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 pb-1 sm:pb-2">
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <MapPin className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                {event.location}
              </div>

              {event.description && (
                <p
                  className={`text-xs sm:text-sm mt-1 sm:mt-2 text-muted-foreground ${
                    viewMode === "grid"
                      ? "line-clamp-2 h-8 sm:h-10"
                      : "line-clamp-2 sm:line-clamp-3 h-[3rem] sm:h-[4.5rem]"
                  }`}
                >
                  {viewMode === "list"
                    ? truncateText(event.description, 300)
                    : truncateText(event.description, 160)}
                </p>
              )}

              <div className="flex flex-wrap gap-1 mt-1 sm:mt-2">
                {event.hashtags
                  .slice(0, viewMode === "list" ? 5 : 2)
                  .map((hashtag) => (
                    <Badge
                      key={hashtag.id}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent text-xs"
                      onClick={() => {
                        if (!selectedHashtags.includes(hashtag.title)) {
                          setSelectedHashtags([...selectedHashtags, hashtag.title]);
                        }
                      }}
                    >
                      #{hashtag.title}
                    </Badge>
                  ))}
                {event.hashtags.length > (viewMode === "list" ? 5 : 2) && (
                  <Badge variant="outline" className="text-xs">
                    +{event.hashtags.length - (viewMode === "list" ? 5 : 2)}
                  </Badge>
                )}
              </div>
            </CardContent>
            <div className="mt-auto p-2 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 border-t">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-white shadow-sm ring-2 ring-background overflow-hidden">
                  <AvatarImage
                    src={event.organizer.image}
                    alt={event.organizer.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-primary-foreground font-medium text-xs sm:text-sm">
                    {event.organizer.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-medium leading-none">
                    {event.organizer.name}
                  </span>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    Organizer
                  </span>
                </div>
              </div>
              <Button size="sm" className="w-full sm:w-auto" onClick={handleSubscribe} disabled={isPending || isSubscribed}>
                {isPending ? "Loading..." : (isSubscribed ? "Subscribed" : "Subscribe")}
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <GithubAuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}
