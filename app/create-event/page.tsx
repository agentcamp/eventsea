"use client";

import type React from "react";

import { useState } from "react";
import {
  Calendar,
  Clock,
  Globe,
  Link,
  PencilIcon,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import TimezoneSelect, { ITimezone } from "react-timezone-select";

export default function CreateEvent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState("https://picsum.photos/1280/720");
  const [selectedTimezone, setSelectedTimezone] = useState<ITimezone>("");

  const [formData, setFormData] = useState({
    title: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    startTime: "11:30",
    endDate: format(new Date(), "yyyy-MM-dd"),
    endTime: "12:30",
    location: "",
    description: "",
    isPublic: true,
    requireApproval: false,
    capacity: "Unlimited",
    isUnlimitedCapacity: true,
    capacityValue: 100,
    timezone: "" as unknown as ITimezone,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(formData.timezone);
    // Handle form submission
    setIsSubmitting(false);
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
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg p-4">
            <Input
              placeholder="Event Name"
              className="bg-card border-0 text-popover-foreground placeholder-white/60"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-popover-foreground/60" />
                  <Label className="text-popover-foreground/90">Start</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    className="bg-card border-0 text-popover-foreground placeholder-white/60"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                  <Input
                    type="time"
                    className="bg-card border-0 text-popover-foreground placeholder-white/60"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-popover-foreground/60" />
                  <Label className="text-popover-foreground/90">End</Label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    className="bg-card border-0 text-popover-foreground placeholder-white/60"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                  <Input
                    type="time"
                    className="bg-card border-0 text-popover-foreground placeholder-white/60"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-popover-foreground/60" />
                <Label className="text-popover-foreground/90">Timezone</Label>
              </div>

              <TimezoneSelect
                value={selectedTimezone}
                onChange={(timezone) => {
                  setSelectedTimezone(timezone);
                  setFormData({ ...formData, timezone: timezone });
                }}
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
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Link className="w-5 h-5 text-popover-foreground/60" />
                <Label className="text-popover-foreground/90">Location</Label>
              </div>
              <Input
                placeholder="Add event location"
                className="bg-card border-0 text-popover-foreground placeholder-white/60"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>

            <Textarea
              placeholder="Add description"
              className="min-h-[100px] bg-card border-0 text-popover-foreground placeholder-white/60"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <Card className="bg-card backdrop-blur border-0 p-6 space-y-4">
              <h3 className="font-semibold text-xl text-popover-foreground">
                Event Options
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="tickets"
                    className="text-popover-foreground/90"
                  >
                    Tickets
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-popover-foreground/60">
                      Free
                    </span>
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

                {/* <div className="flex items-center justify-between">
                  <Label
                    htmlFor="approval"
                    className="text-popover-foreground/90"
                  >
                    Require Approval
                  </Label>
                  <Switch
                    id="approval"
                    checked={formData.requireApproval}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, requireApproval: checked })
                    }
                  />
                </div> */}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-popover-foreground/60" />
                    <Label className="text-popover-foreground/90">
                      Capacity
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    {formData.isUnlimitedCapacity ? (
                      <>
                        <span className="text-sm text-popover-foreground/60">
                          Unlimited
                        </span>
                        <Button
                          variant="default"
                          size="sm"
                          className="border-white/20 text-popover-foreground hover:bg-white/20"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              isUnlimitedCapacity: false,
                              capacity: formData.capacityValue.toString(),
                            })
                          }
                        >
                          Set Limit
                        </Button>
                      </>
                    ) : (
                      <>
                        <Input
                          type="number"
                          min="1"
                          className="w-20 h-8 bg-card border-0 text-popover-foreground"
                          value={formData.capacityValue}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            setFormData({
                              ...formData,
                              capacityValue: value,
                              capacity: value.toString(),
                            });
                          }}
                        />
                        <Button
                          variant="default"
                          size="sm"
                          className="border-white/20 text-popover-foreground hover:bg-white/20"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              isUnlimitedCapacity: true,
                              capacity: "Unlimited",
                            })
                          }
                        >
                          Unlimited
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Button
              type="submit"
              className="w-full bg-popover text-primary hover:bg-accent hover:text-popover transition-colors font-semibold py-6 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
