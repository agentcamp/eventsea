import Image from "next/image";

interface EventTicketProps {
  profileImage: string;
  username: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  subscriptionId: string;
}

export default function EventTicket({
  profileImage,
  username,
  eventName,
  eventDate,
  eventLocation,
  subscriptionId,
}: EventTicketProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="relative flex bg-black text-white rounded-xl overflow-hidden border-2 border-purple-500">
        {/* Main ticket content */}
        <div className="flex-1 p-6">
          {/* Profile section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="rounded-full overflow-hidden w-16 h-16 bg-teal-200">
              <Image
                src={profileImage || "/placeholder.svg"}
                alt={username}
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{username}</h2>
              {username && (
                <div className="flex items-center text-gray-400 gap-1">
                  <Image
                    src="/github.svg"
                    alt="Github Icon"
                    width={16}
                    className="bg-gray-400 rounded-sm"
                    height={16}
                  />
                  <span>{username}</span>
                </div>
              )}
            </div>
          </div>

          {/* Event details */}
          <div className="mb-8">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-purple-500 mb-1">
                {eventName}
              </h3>
            </div>

            <div className="mb-4">
              <p className="text-lg font-medium">{eventDate}</p>
              <p className="text-lg font-medium">{eventLocation}</p>
            </div>

            <div className="text-gray-400 text-sm">
              <p>Created by EventSea</p>
              <p>eventsea.xyz</p>
            </div>
          </div>
        </div>

        {/* Ticket number section with dotted line */}
        <div className="relative">
          <div className="absolute top-0 bottom-0 left-0 border-l border-dashed border-gray-600"></div>
          <div className="h-full flex items-center px-4 py-6">
            <div className="rotate-90 origin-center whitespace-nowrap">
              <p className="text-2xl font-bold">№ {subscriptionId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
