import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { fullName, email, password, expertise, secteurs, langues, bio, tarifIndicatif } = body;

    if (!fullName || !email) {
      return NextResponse.json(
        { error: { message: "Le nom complet et l'email sont requis." } },
        { status: 400 }
      );
    }

    if (!expertise || !secteurs || !langues || !bio) {
      return NextResponse.json(
        { error: { message: "Les informations du profil expert sont requises." } },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: { message: "Cet email est déjà utilisé." } },
        { status: 400 }
      );
    }

    // Generate password if manual one was not provided
    const plainPassword = password || crypto.randomBytes(8).toString("hex");
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // Create User and MentorProfile in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: "MENTOR_EXPERT",
          actif: true,
        },
      });

      const mentorProfile = await tx.mentorProfile.create({
        data: {
          userId: user.id,
          nomComplet: fullName,
          expertise: expertise, // This is an array from the frontend
          secteurs: secteurs,
          langues: langues,
          bio,
          tarifIndicatif: tarifIndicatif || null,
          noteMoyenne: 5.0, // Default rating for new mentors
          actif: true,
        },
      });

      return { user, mentorProfile };
    });

    return NextResponse.json(
      { message: "Mentor créé avec succès", userId: newUser.user.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating mentor:", error);
    return NextResponse.json(
      { error: { message: "Une erreur est survenue lors de la création du mentor." } },
      { status: 500 }
    );
  }
}
