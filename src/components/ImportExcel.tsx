"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ImportExcel() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/students/import", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Erreur lors de l'importation");
      }

      const result = await res.json();
      setMessage({
        type: "success",
        text: `${result.count} élèves ont été importés avec succès.`,
      });
      setFile(null);
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <FileSpreadsheet className="text-green-600" size={24} />
        <h2 className="text-lg font-bold text-gray-800">Importation groupée (Excel)</h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Importez un fichier Excel (.xlsx ou .xls) contenant les données des élèves. 
        Les colonnes doivent correspondre aux champs du formulaire (Province, Nom, Code élève, etc.).
      </p>

      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-auto">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
            id="excel-upload"
          />
          <label
            htmlFor="excel-upload"
            className="flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition w-full sm:w-auto"
          >
            <Upload size={18} className="text-gray-500" />
            <span className="text-sm text-gray-700">
              {file ? file.name : "Choisir un fichier Excel"}
            </span>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed w-full sm:w-auto font-medium"
        >
          {uploading ? "Importation..." : "Importer les données"}
        </button>
      </div>

      {message && (
        <div
          className={`mt-4 p-4 rounded-md flex items-start space-x-2 ${
            message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 size={20} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}
    </div>
  );
}
