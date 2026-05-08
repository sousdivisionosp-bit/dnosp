"use client";

import { useState } from "react";
import { X, User, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Student {
  id: string;
  nom: string;
  prenom: string;
  province: string;
  codeEleve: string;
  category: string;
}

interface MatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  students: Student[];
  category: string;
}

export default function MatrixModal({ isOpen, onClose, title, students, category }: MatrixModalProps) {
  if (!isOpen) return null;

  const filteredStudents = students.filter(s => s.category === category);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {filteredStudents.length} élève(s) dans cette catégorie
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div className="flex-grow overflow-y-auto p-6">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-slate-400 font-medium">
              Aucun élève trouvé dans cette catégorie.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredStudents.map((student) => (
                <div 
                  key={student.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {student.nom} {student.prenom}
                      </p>
                      <p className="text-xs text-slate-500">
                        Code: {student.codeEleve} • Province: {student.province}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/students/${student.id}`}
                    className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors px-3 py-2 bg-blue-50 rounded-lg"
                  >
                    Détails
                    <ExternalLink size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
