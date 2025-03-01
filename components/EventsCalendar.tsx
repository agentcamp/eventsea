import { Calendar } from "./ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export default function EventsCalendar({
  selectedDate,
  setSelectedDate,
  calendarView,
  setCalendarView,
}: {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  calendarView: "next" | "past" | "date";
  setCalendarView: (view: "next" | "past" | "date") => void;
}) {
  return (
    <div className="sticky top-4 space-y-4">
      <Card>
        <CardHeader className="bg-card rounded-lg py-4">
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 py-4">
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
  );
}
