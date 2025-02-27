"use client";

import type React from "react";

import { useState } from "react";
import {
  AlignLeft,
  BookText,
  Calendar,
  Globe,
  Hash,
  MapPin,
  PencilIcon,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import TimezoneSelect, { ITimezone } from "react-timezone-select";
import { useCreateEvent } from "@/hooks/events.hook";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  hashtags: z.array(z.string()).default([]),
  startDate: z.string().min(1, { message: "Start date is required" }),
  startTime: z.string().min(1, { message: "Start time is required" }),
  endDate: z.string().min(1, { message: "End date is required" }),
  endTime: z.string().min(1, { message: "End time is required" }),
  location: z.string().optional(),
  description: z.string().optional(),
  isUnlimitedCapacity: z.boolean().default(true),
  capacityValue: z.number().optional(),
  timezone: z.any().optional(),
  imageBase64: z.string().optional(),
})

export default function CreateEvent() {
  const [currentHashtag, setCurrentHashtag] = useState("");
  const [image, setImage] = useState("https://picsum.photos/1280/720");
  const { mutate: createEvent, isPending } = useCreateEvent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      hashtags: [],
      startDate: format(new Date(), "yyyy-MM-dd"),
      startTime: "11:30",
      endDate: format(new Date(), "yyyy-MM-dd"),
      endTime: "12:30",
      location: "",
      description: "",
      capacityValue: 100,
      isUnlimitedCapacity: true,
      timezone: "",
    },
  })

  const hashtags = form.watch('hashtags');

  const addHashtag = () => {
    if (currentHashtag.trim() && !form.getValues().hashtags.includes(currentHashtag.trim())) {
      form.setValue("hashtags", [...form.getValues().hashtags, currentHashtag.trim()]);
      setCurrentHashtag("");
    }
  };

  const removeHashtag = (index: number) => {
    const currentHashtags = form.getValues().hashtags;
    form.setValue("hashtags", currentHashtags.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const startAt = new Date(`${data.startDate}T${data.startTime}:00`);
    const endAt = new Date(`${data.endDate}T${data.endTime}:00`);

    const timezoneString =
      typeof data.timezone === "string"
        ? data.timezone
        : data.timezone?.value ||
          Intl.DateTimeFormat().resolvedOptions().timeZone;

    let imageBase64: undefined | string = undefined;
    if (image && !image.startsWith("https://picsum.photos")) {
      try {
        const response = await fetch(image);
        const blob = await response.blob();
        imageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string ?? undefined);
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    const eventData = {
      title: data.title,
      startAt,
      endAt,
      location: data.location,
      description: data.description,
      isUnlimitedCapacity: data.isUnlimitedCapacity,
      capacityValue: data.isUnlimitedCapacity ? undefined : data.capacityValue,
      timezone: timezoneString,
      imageBase64,
      hashtags: data.hashtags,
    };

    await createEvent(eventData);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-[300px,1fr] gap-8">
          {/* Image Upload */}
          <div>
            <Card className="bg-card backdrop-blur border-0 aspect-square flex items-center justify-center relative overflow-hidden group cursor-pointer">
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setImage(url);
                  }
                }}
              />
              {image && (
                <Image
                  src={image || "https://picsum.photos/1280/720"}
                  alt="Event cover"
                  quality={100}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              )}
              <div className="absolute bottom-3 right-3 bg-black/70 rounded-full p-2 text-white z-[1] shadow-md">
                <PencilIcon className="w-4 h-4" />
              </div>
            </Card>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-lg p-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="flex items-center gap-2">
                      <BookText className="w-5 h-5 text-popover-foreground/60" />
                      <FormLabel className="text-popover-foreground/90">Event Name</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Event Name"
                        className="bg-card border-0 text-popover-foreground placeholder-white/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-popover-foreground/60" />
                  <Label className="text-popover-foreground/90">Hashtags</Label>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add event hashtag (e.g. tech, music)"
                    className="bg-card border-0 text-popover-foreground placeholder-white/60"
                    value={currentHashtag}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Remove # if user typed it
                      if (value.startsWith("#")) {
                        value = value.substring(1);
                      }
                      setCurrentHashtag(value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && currentHashtag.trim()) {
                        e.preventDefault();
                        addHashtag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="default"
                    className="border-white/20 text-popover-foreground hover:bg-white/20"
                    onClick={addHashtag}
                  >
                    Add
                  </Button>
                </div>

                {/* Display hashtags as badges */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {hashtags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-card border border-white/20 text-popover-foreground rounded-full px-3 py-1 text-sm flex items-center gap-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        className="text-popover-foreground/60 hover:text-popover-foreground ml-1 focus:outline-none"
                        onClick={() => removeHashtag(index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-popover-foreground/60" />
                    <Label className="text-popover-foreground/90">Start</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-card border-0 text-popover-foreground placeholder-white/60"
                            {...field}
                          />
                        </FormControl>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="time"
                            className="bg-card border-0 text-popover-foreground placeholder-white/60"
                            {...field}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-popover-foreground/60" />
                    <Label className="text-popover-foreground/90">End</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-card border-0 text-popover-foreground placeholder-white/60"
                            {...field}
                          />
                        </FormControl>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormControl>
                          <Input
                            type="time"
                            className="bg-card border-0 text-popover-foreground placeholder-white/60"
                            {...field}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-popover-foreground/60" />
                      <FormLabel className="text-popover-foreground/90">Timezone</FormLabel>
                    </div>
                    <FormControl>
                      <TimezoneSelect
                        value={field.value}
                        onChange={field.onChange}
                        styles={{
                          control: (base, state) => ({
                            ...base,
                            borderRadius: "0.375rem",
                            backgroundColor: "hsl(240 11.11% 94.71%)",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: state.isFocused ? "0 0 0 2px #ff7f7f" : "none",
                            "&:hover": {
                              border: "none",
                            },
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: "hsl(228 8.77% 11.18%)",
                          }),
                          option: (base, state) => ({
                            ...base,
                            color: state.isSelected ? "white" : "hsl(228 8.77% 11.18%)",
                          }),
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-popover-foreground/60" />
                      <FormLabel className="text-popover-foreground/90">Location</FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Add event location"
                        className="bg-card border-0 text-popover-foreground placeholder-white/60"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <div className="flex items-center gap-2">
                      <AlignLeft className="w-5 h-5 text-popover-foreground/60" />
                      <FormLabel className="text-popover-foreground/90">Event Description</FormLabel>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Add description"
                        className="min-h-[100px] bg-card border-0 text-popover-foreground placeholder-white/60"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Card className="bg-card backdrop-blur border-0 p-6 space-y-4">
                <h3 className="font-semibold text-xl text-popover-foreground">Event Options</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-popover-foreground/60" />
                      <Label htmlFor="tickets" className="text-popover-foreground/90">Tickets</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-popover-foreground/60">Free</span>
                      <Button
                        variant="default"
                        size="sm"
                        disabled
                        className="border-white/20 text-popover-foreground hover:bg-white/20"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-popover-foreground/60" />
                      <Label className="text-popover-foreground/90">Capacity</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name="isUnlimitedCapacity"
                        render={({ field }) => (
                          <>
                            {field.value ? (
                              <>
                                <span className="text-sm text-popover-foreground/60">Unlimited</span>
                                <Button
                                  type="button"
                                  variant="default"
                                  size="sm"
                                  className="border-white/20 text-popover-foreground hover:bg-white/20"
                                  onClick={() => form.setValue("isUnlimitedCapacity", false)}
                                >
                                  Set Limit
                                </Button>
                              </>
                            ) : (
                              <>
                                <FormField
                                  control={form.control}
                                  name="capacityValue"
                                  render={({ field: capacityField }) => (
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min="1"
                                        className="w-20 h-8 bg-card border-0 text-popover-foreground"
                                        {...capacityField}
                                        onChange={(e) => {
                                          const value = parseInt(e.target.value) || 1;
                                          capacityField.onChange(value);
                                        }}
                                      />
                                    </FormControl>
                                  )}
                                />
                                <Button
                                  type="button"
                                  variant="default"
                                  size="sm"
                                  className="border-white/20 text-popover-foreground hover:bg-white/20"
                                  onClick={() => form.setValue("isUnlimitedCapacity", true)}
                                >
                                  Unlimited
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Button
                type="submit"
                className="w-full bg-popover text-primary hover:bg-accent hover:text-popover transition-colors font-semibold py-6 text-lg"
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
