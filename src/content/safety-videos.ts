// YouTube video IDs from the League of American Bicyclists (bikeleague.org).
// Each entry has an English and Spanish version.
export type SafetyVideo = {
  key: string;
  title: { en: string; es: string };
  blurb: { en: string; es: string };
  youtubeId: { en: string; es: string };
};

export const safetyVideos: SafetyVideo[] = [
  {
    key: "traffic",
    title: { en: "Biking in Traffic: Top Safety Tips", es: "Consejos de Tráfico y Seguridad" },
    blurb: {
      en: "Our core orientation video. Lane position, intersections, signaling, and riding predictably.",
      es: "Nuestro video de orientación principal. Posición en el carril, intersecciones, señales y cómo conducir de forma predecible.",
    },
    youtubeId: { en: "rVMCz7UJZvM", es: "snmqXYwKKI0" },
  },
  {
    key: "parking",
    title: { en: "Bike Parking and Sidewalks", es: "Aparcar y Aceras" },
    blurb: {
      en: "How to lock up properly and when (not) to ride on the sidewalk.",
      es: "Cómo asegurar la bicicleta correctamente y cuándo (no) andar por la acera.",
    },
    youtubeId: { en: "Bfgdd5_OSlA", es: "etwYoajipWI" },
  },
];
