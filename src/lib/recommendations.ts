export const AVIS_MAPPING: Record<string, string> = {
  "Atout exceptionnel": "hautes compétences et motivation maximale, candidat idéal pour leadership stratégique",
  "Excellent profil": "très performant et fortement motivé, prêt à exceller",
  "Gros potentiel": "passion et compétences en croissance, investissement recommandé",
  "Solide profil": "progression rapide possible avec accompagnement",
  "Niveau correct dans les deux aspects": "progression lente mais stable. cas à surveiller",
  "Inadéquation totale": "échec assuré : l’élève à réorienter",
  "Aucun levier évident": "non adapté",
  "Profil inadapté": "pas d’investissement recommandé l’élève à réorienter",
  "Compétence et motivation faibles": "faible rentabilité de l’investissement",
  "Faible performance et motivation": "peu de chances de succès",
  "Compétence moyenne et motivation faible": "risque de stagnation",
  "Profil peu adapté": "peu de perspectives : compenser les lacunes techniques et créer la motivation",
  "Compétent mais motivation limitée": "prévoir coaching ou redéploiement",
  "Peu d’intérêt malgré de bonnes bases": "risque d’abandon alors il faut créer l’intérêt chez l’élève",
  "Performance forte mais faible engagement": "risque de désengagement, à surveiller",
  "Compétent mais sans motivation": "risque de départ ou inefficacité à long terme",
  "Enthousiasme sans compétences": "incompatible avec exigences actuelles, mais possible reconversion",
  "Motivation présente mais inadéquation majeure avec le poste": "compenser lacunes techniques",
  "Motivation bonne": "compenser lacunes techniques",
  "Motivation forte mais faibles compétences": "idéal pour apprentissage si formation possible",
  "Motivé mais compétences à développer": "investir en formation. cas à surveiller",
  "Bon engagement": "progression technique nécessaire. cas à surveiller",
  "Hautement compétent mais motivation fluctuante": "prévoir actions de stimulation",
  "Potentiel correct": "nécessite encouragement pour maintenir motivation. cas à surveiller",
  "Faiblesse globale": "prévoir repositionnement ou formation lourde",
};

export type MatrixCategory = 
  | "vocation_competences" // Bonne vocation + bonnes compétences
  | "faible_vocation_competences" // Faible vocation + faibles compétences
  | "competences_faible_vocation" // Bonnes compétences + faible vocation
  | "vocation_faibles_competences"; // Bonne vocation + faibles compétences

export function getMatrixCategory(avis: string): MatrixCategory {
  const cleanAvis = avis.toLowerCase();

  // Category: Bonne vocation + bonnes compétences
  if (
    cleanAvis.includes("atout exceptionnel") ||
    cleanAvis.includes("excellent profil") ||
    cleanAvis.includes("gros potentiel") ||
    cleanAvis.includes("solide profil") ||
    cleanAvis.includes("niveau correct")
  ) return "vocation_competences";

  // Category: Faible vocation + faibles compétences
  if (
    cleanAvis.includes("inadéquation totale") ||
    cleanAvis.includes("aucun levier") ||
    cleanAvis.includes("profil inadapté") ||
    cleanAvis.includes("faiblesse globale") ||
    (cleanAvis.includes("compétence") && cleanAvis.includes("motivation") && cleanAvis.includes("faibles")) ||
    (cleanAvis.includes("faible performance") && cleanAvis.includes("motivation"))
  ) return "faible_vocation_competences";

  // Category: Bonnes compétences + faible vocation
  if (
    cleanAvis.includes("compétence moyenne") ||
    cleanAvis.includes("profil peu adapté") ||
    cleanAvis.includes("motivation limitée") ||
    cleanAvis.includes("peu d’intérêt") ||
    cleanAvis.includes("performance forte") ||
    cleanAvis.includes("sans motivation")
  ) return "competences_faible_vocation";

  // Category: Bonne vocation + faibles compétences
  if (
    cleanAvis.includes("enthousiasme sans") ||
    cleanAvis.includes("motivation présente") ||
    cleanAvis.includes("motivation bonne") ||
    cleanAvis.includes("motivation forte") ||
    cleanAvis.includes("motivé mais compétences") ||
    cleanAvis.includes("bon engagement")
  ) return "vocation_faibles_competences";

  // Default fallback
  return "vocation_competences";
}

export function getRecommendation(avis: string): string {
  if (!avis) return "Aucun avis spécifié.";
  const cleanAvis = avis.trim().toLowerCase();
  const match = Object.keys(AVIS_MAPPING).find(key => 
    cleanAvis.startsWith(key.toLowerCase()) || key.toLowerCase().includes(cleanAvis)
  );
  return match ? AVIS_MAPPING[match] : "Avis non répertorié : suivi standard recommandé.";
}

export function getStatusType(avis: string): "normal" | "risk" | "monitor" {
  const category = getMatrixCategory(avis);
  if (category === "vocation_competences") return "normal";
  if (category === "faible_vocation_competences") return "risk";
  return "monitor";
}

