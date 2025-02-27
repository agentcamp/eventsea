import sgMail from "@sendgrid/mail";
import ReactDOMServer from "react-dom/server";
import EventTicket from "@/components/EventTicket";

export async function sendSubscriptionConfirmation(
  userEmail: string,
  profileImage: string,
  username: string,
  eventTitle: string,
  eventDate: Date,
  eventLocation: string,
  subscriptionId: string
) {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  } else {
    console.error("SENDGRID_API_KEY is not set");
    return { success: false, error: "SENDGRID_API_KEY is not set" };
  }

  const formattedDate = new Date(eventDate).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const ticketHtml = renderEventTicketHtml({
    profileImage,
    username,
    eventName: eventTitle,
    eventDate: formattedDate,
    eventLocation: eventLocation || "Online",
    subscriptionId,
  });

  const msg = {
    to: userEmail,
    from: process.env.SENDGRID_FROM_EMAIL || "noreply@eventsea.com", // Your verified sender
    subject: `You're subscribed for ${eventTitle}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Hello ${username}!</h2>
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
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error("Error sending subscription confirmation email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : error,
    };
  }
}

function renderEventTicketHtml(props: {
  profileImage: string;
  username: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  subscriptionId: string;
}) {
  return ReactDOMServer.renderToStaticMarkup(EventTicket({ ...props }));
}
