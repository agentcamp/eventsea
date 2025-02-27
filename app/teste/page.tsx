import EventTicket from "@/components/EventTicket"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
      <EventTicket
        profileImage="https://avatars.githubusercontent.com/u/83927877?v=4"
        username="mattzell"
        eventName="ACME"
        eventDate="01 JANUARY 2022"
        eventLocation="ONLINE"
        subscriptionId="00'191"
      />
    </main>
  )
}

