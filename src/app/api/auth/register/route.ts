import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendNotification } from "@/lib/notifications";


export async function POST(req: Request) {
  try {
    const { email, password, fullName, companyName, accountType } = await req.json();

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Veuillez remplir tous les champs obligatoires." }, { status: 400 });
    }

    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Cet e-mail est déjà utilisé." }, { status: 409 });
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. Create User only
    const newUser = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: "PORTEUR_STARTUP",
      },
    });

    // 4. Send Welcome Email & Notification
    await sendNotification({
      userId: newUser.id,
      userEmail: newUser.email,
      type: "WELCOME",
      title: "Bienvenue sur IN-CUBATOR 🎉",
      message: `Bonjour ${fullName},\n\nVotre compte a été créé avec succès. Vous pouvez maintenant présenter votre projet et soumettre votre candidature intelligente.\n\nL'équipe IN-CUBATOR.`,
      emailTemplate: "welcome",
      canal: "BOTH",
    });

    return NextResponse.json({ success: true, user: { id: newUser.id, email: newUser.email } }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription." }, { status: 500 });
  }
}
