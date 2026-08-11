import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // In a real application, you would save this data to a database here.
    // e.g., await db.candidatures.create({ data });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json(
      { message: "Candidature reçue avec succès", data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du traitement de la candidature" },
      { status: 500 }
    );
  }
}
