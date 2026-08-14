import { prisma } from "@/lib/prisma";


type NotificationOptions = {
  userId: string;
  type: string;
  title: string;
  message: string;
  lienUrl?: string;
  canal?: "IN_APP" | "EMAIL" | "BOTH";
  emailTemplate?: "welcome" | "evaluation" | "interview" | "recommendations" | "general";
  userEmail?: string;
};

/**
 * Utility to send notifications both In-App and via Email
 */
export async function sendNotification({
  userId,
  type,
  title,
  message,
  lienUrl,
  canal = "BOTH",
  emailTemplate = "general",
  userEmail,
}: NotificationOptions) {
  try {
    // 1. IN-APP NOTIFICATION (Save to Database)
    if (canal === "IN_APP" || canal === "BOTH") {
      await prisma.notification.create({
        data: {
          userId,
          type,
          titre: title,
          message,
          lienUrl,
          canal: "IN_APP",
        },
      });
    }

    // 2. EMAIL NOTIFICATION
    if (canal === "EMAIL" || canal === "BOTH") {
      // In a real production environment, you would use Resend, Nodemailer, etc.
      // e.g., await resend.emails.send({...})
      
      console.log(`\n==============================================`);
      console.log(`📧 NEW EMAIL DISPATCHED`);
      console.log(`==============================================`);
      console.log(`TO:       ${userEmail || "Unknown Email (Pass userEmail to log)"}`);
      console.log(`SUBJECT:  ${title}`);
      console.log(`TEMPLATE: ${emailTemplate}`);
      console.log(`MESSAGE:\n${message}`);
      if (lienUrl) console.log(`LINK:     ${lienUrl}`);
      console.log(`==============================================\n`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending notification:", error);
    return { success: false, error };
  }
}
