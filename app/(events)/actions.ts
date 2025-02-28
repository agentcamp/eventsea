import nodemailer from "nodemailer";

type SubscriptionEmailParams = {
  user: {
    email?: string | null;
    image?: string | null;
    name?: string | null;
    githubUserName?: string | null;
  }
  eventTitle: string;
  eventDate: Date;
  eventLocation: string;
  subscriptionId: string;
};

export async function sendSubscriptionConfirmation({
  user,
  eventTitle,
  eventDate,
  eventLocation,
  subscriptionId,
}: SubscriptionEmailParams) {
  const emailServerUrl = process.env.EMAIL_SERVER_URL;
  if (!emailServerUrl) {
    throw new Error("EMAIL_SERVER_URL is not defined");
  }

  if (!user.email) {
    throw new Error("User email is not defined");
  }
  
  // Parse the URL
  const url = new URL(emailServerUrl);
  const secure = url.protocol === 'smtps:';
  
  const transporter = nodemailer.createTransport({
    host: url.hostname,
    port: Number(url.port) || (secure ? 465 : 587),
    secure,
    auth: {
      user: decodeURIComponent(url.username),
      pass: decodeURIComponent(url.password),
    }
  });

  const formattedDate = new Date(eventDate).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const ticketHtml = generateEventTicketHtml({
    profileImage: user.image,
    username: user.name,
    githubUserName: user.githubUserName,
    eventName: eventTitle,
    eventDate: formattedDate,
    eventLocation: eventLocation || "Online",
    subscriptionId,
  });

  const msg = {
    to: user.email,
    from: process.env.SENDGRID_FROM_EMAIL || "noreply@eventsea.com",
    subject: `You're subscribed for ${eventTitle}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Hello ${user.name}!</h2>
        <p>You have successfully subscribed to <strong>${eventTitle}</strong>.</p>
        <div style="margin: 20px 0;">
          ${ticketHtml}
        </div>
        <p>We hope to see you there!</p>
        <p>Best regards,<br/>The EventSea Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(msg);
    return { success: true };
  } catch (error) {
    console.error("Error sending subscription confirmation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function generateEventTicketHtml({
  profileImage,
  username,
  githubUserName,
  eventName,
  eventDate,
  eventLocation,
  subscriptionId,
}: {
  profileImage?: string | null;
  username?: string | null;
  githubUserName?: string | null;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  subscriptionId: string;
}): string {
  return `
    <div style="max-width: 500px; margin: 0 auto;">
      <div style="position: relative; display: flex; background-color: #000000; color: #ffffff; border-radius: 12px; overflow: hidden; border: 2px solid #a855f7;">
        <!-- Main ticket content -->
        <div style="flex: 1; padding: 24px;">
          <!-- Profile section -->
          <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 32px;">
            <div style="border-radius: 50%; overflow: hidden; width: 64px; height: 64px; background-color: #99f6e4;">
              <img 
                src="${profileImage || "https://placehold.co/64x64/99f6e4/ffffff?text=" + (username ? username.charAt(0).toUpperCase() : 'U')}" 
                alt="${username}"
                width="64" 
                height="64" 
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </div>
            <div>
              <h2 style="font-size: 1.5rem; font-weight: bold; margin: 0 0 4px 0;">${username}</h2>
              ${githubUserName ? `
              <div style="display: flex; align-items: center; color: #9ca3af; gap: 4px;">
                <img 
                  src="https://raw.githubusercontent.com/github/explore/78df643247d429f6cc873026c0622819ad797942/topics/github/github.png" 
                  alt="Github Icon"
                  width="16" 
                  height="16" 
                  style="background-color: #9ca3af; border-radius: 2px;"
                />
                <span>${githubUserName}</span>
              </div>
              ` : ''}
            </div>
          </div>

          <!-- Event details -->
          <div style="margin-bottom: 32px;">
            <div style="margin-bottom: 16px;">
              <h3 style="font-size: 1.5rem; font-weight: bold; color: #a855f7; margin: 0 0 4px 0;">
                ${eventName}
              </h3>
            </div>

            <div style="margin-bottom: 16px;">
              <p style="font-size: 1.125rem; font-weight: 500; margin: 0 0 8px 0;">${eventDate}</p>
              <p style="font-size: 1.125rem; font-weight: 500; margin: 0;">${eventLocation}</p>
            </div>

            <div style="color: #9ca3af; font-size: 0.875rem;">
              <p style="margin: 0 0 4px 0;">Created by EventSea</p>
              <p style="margin: 0;">eventsea.xyz</p>
            </div>
          </div>
        </div>

        <!-- Ticket number section with dotted line -->
        <div style="position: relative;">
          <div style="position: absolute; top: 0; bottom: 0; left: 0; border-left: 1px dashed #4b5563;"></div>
          <div style="height: 100%; display: flex; align-items: center; padding: 24px 16px;">
            <div style="transform: rotate(90deg); transform-origin: center; white-space: nowrap;">
              <p style="font-size: 1.5rem; font-weight: bold; margin: 0;">№ ${subscriptionId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
