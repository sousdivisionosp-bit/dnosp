import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as XLSX from "xlsx";

// Helper to convert Excel serial date to JS Date
function excelDateToJSDate(serial: number) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001;
  let total_seconds = Math.floor(86400 * fractional_day);

  const seconds = total_seconds % 60;
  total_seconds -= seconds;

  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const results = [];
    const errors = [];
    
    for (let i = 0; i < data.length; i++) {
      const rawRow = data[i] as Record<string, any>;
      try {
        // Normalize keys: trim spaces and lowercase for easy matching
        const row: Record<string, any> = {};
        Object.keys(rawRow).forEach(key => {
          const normalizedKey = key.trim().toLowerCase();
          row[normalizedKey] = rawRow[key];
        });

        // Search for date with multiple possible keys
        const rawDate = row["date de naissance"] || 
                        row["datenaissance"] || 
                        row["date"];
        
        let dateObj: Date;

        if (typeof rawDate === "number") {
          dateObj = excelDateToJSDate(rawDate);
        } else if (rawDate) {
          dateObj = new Date(rawDate);
        } else {
          // Default date if missing to avoid skipping the whole row
          dateObj = new Date(1900, 0, 1);
        }

        // Map Excel columns to database fields using normalized lowercase keys
        const codeEleve = String(row["code élève"] || row["codeélève"] || row["code eleve"] || row["code"] || `TEMP-${Date.now()}-${i}`).trim();
        
        const province = String(row["province"] || row["province éducationnelle"] || "Non spécifiée").trim();
        
        const studentData = {
          province: province,
          etablissement: String(row["etablissement"] || row["etablissements scolaire"] || "Non spécifié").trim(),
          ville: String(row["ville"] || row["ville (cité)"] || row["ville (ou ville (cité) )"] || "Non spécifiée").trim(),
          nom: String(row["nom"] || row["nom du candidat"] || "Inconnu").trim(),
          postNom: String(row["postnom"] || row["post nom"] || row["post nom du candidat"] || "").trim(),
          prenom: String(row["prenom"] || row["prénom"] || row["prénom du candidat"] || "").trim(),
          sexe: String(row["sexe"] || "").trim(),
          lieuNaissance: String(row["lieu de naissance"] || row["lieunaissance"] || "").trim(),
          dateNaissance: isNaN(dateObj.getTime()) ? new Date(1900, 0, 1) : dateObj,
          avisTest: String(row["avis"] || row["avistest"] || row["avis du test"] || "B").trim(),
        };

        // Use upsert to handle existing students by codeEleve
        const student = await prisma.student.upsert({
          where: { codeEleve: codeEleve },
          update: studentData,
          create: {
            ...studentData,
            codeEleve: codeEleve,
          },
        });
        
        results.push(student);
      } catch (err: any) {
        console.error(`Error importing row ${i + 1}:`, err.message);
        errors.push({ row: i + 1, error: err.message });
      }
    }

    console.log(`Import finished: ${results.length} success, ${errors.length} errors.`);
    return NextResponse.json({ 
      success: true, 
      count: results.length,
      errorCount: errors.length,
      errors: errors.slice(0, 10) // Return first 10 errors for debugging
    });
  } catch (error: any) {
    console.error("Error importing students:", error);
    return new Response(error.message, { status: 500 });
  }
}
