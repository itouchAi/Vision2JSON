import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { GoogleGenAI, Type } from "@google/genai";
import { HexColorPicker } from "react-colorful";
import { 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  Copy, 
  Check, 
  RefreshCw, 
  Camera, 
  Sun, 
  Moon,
  User, 
  Layout, 
  Maximize2,
  ChevronRight,
  Code,
  Scan,
  Sparkles,
  Zap,
  Wand2,
  X,
  ArrowUp,
  RotateCcw,
  Palette,
  Download,
  Mic,
  MicOff,
  Box,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
const MotionDiv = motion.div as any;
const AnimatePresenceComponent = AnimatePresence as any;
import { cn } from './lib/utils';
import { PoseStudioModal } from './components/PoseStudio';

const revealContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren"
    }
  }
};

const revealItem = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 20,
      mass: 1
    } 
  },
  exit: {
    opacity: 0, 
    y: 40, 
    scale: 0.95,
    transition: { duration: 0.3 }
  }
};

const revealItemLeft = {
  hidden: { opacity: 0, x: -60, filter: 'blur(5px)' },
  show: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: { type: "tween", ease: "easeOut", duration: 0.5 } 
  },
  exit: {
    opacity: 0,
    x: -60,
    filter: 'blur(5px)',
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

const revealItemRight = {
  hidden: { opacity: 0, x: 60, filter: 'blur(5px)' },
  show: { 
    opacity: 1, 
    x: 0, 
    filter: 'blur(0px)',
    transition: { type: "tween", ease: "easeOut", duration: 0.5 } 
  },
  exit: {
    opacity: 0,
    x: 60,
    filter: 'blur(5px)',
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

const TRANSLATIONS = {
  TR: {
    docs: "Dokümantasyon",
    title: "Görsel Analiz",
    subtitle: "Yüklediğiniz görseli profesyonel bir JSON promptuna dönüştürün. Kamera, ışık, giyim ve kompozisyon detaylarını anında alın.",
    dragDrop: "Görseli buraya sürükleyin",
    orClick: "veya tıklayarak seçin",
    analyzing: "Analiz Ediliyor...",
    analyze: "Analiz Et",
    jsonOutput: "JSON Çıktısı",
    generating: "Üretiliyor...",
    generate: "Görsel Üret",
    upgrading: "Dönüştürülüyor...",
    upgrade: "Hyper-Realistik Yap",
    copied: "Kopyalandı",
    copy: "Kopyala",
    resultsPlaceholder: "Analiz sonuçları burada görünecek.",
    processing: "Görsel İşleniyor",
    aiDetails: "Yapay zeka detayları yakalıyor...",
    suggestions: "Öneriler",
    clothingColor: "Kıyafet Rengi",
    apply: "Uygula",
    cancel: "İptal",
    studioTitle: "Influencer Studio",
    studioMode: "Stüdyo Modu",
    single: "Tekli Üretim",
    batch: "Çoklu Üretim (Batch)",
    genMethod: "Üretim Yöntemi",
    reference: "Referans Görsel",
    textPrompt: "Metin Promptu",
    batchMode: "Batch Modu",
    template: "Şablon Seçimi",
    manual: "Manuel Seçimler",
    random: "Rastgele",
    custom: "Özel",
    studioPromptLabel: "Stüdyo Promptu (İsteğe Bağlı)",
    studioPromptPlaceholder: "Örn: Neon ışıklı cyberpunk ortam...",
    studioSettings: "Stüdyo Ayarları",
    generateWithPrompt: "Prompt ile Üret",
    close: "Kapat",
    download: "İndir",
    regenerate: "Görseli Yeniden Üret",
    generatingNew: "Yeni Görsel Üretiliyor...",
    samePose: "Aynı poz",
    sameEnv: "Aynı ortam",
    sameOutfit: "Aynı kıyafet",
    sameCamera: "Aynı açı",
    sameLight: "Aynı ışık",
    still: "Hareketsiz",
    diffPose: "Farklı poz",
    diffEnv: "Farklı ortam",
    diffOutfit: "Farklı kıyafet",
    diffCamera: "Farklı açı",
    diffLight: "Farklı ışık",
    motion: "Hareketli",
    revising: "Revize Ediliyor...",
    revisePrompt: "Promptu Revize Et",
    reset: "Sıfırla",
    goUp: "Yukarı Git",
    angle: "Açı",
    light: "Işık",
    ethnicity: "Etnisite",
    style: "Stil",
    enlarge: "Büyüt",
    generatedImageBadge: "Üretilen Görsel",
    footerPowered: "Gemini 3 Flash Vision Powered",
    footerRights: "© 2026 Vision2JSON. Tüm hakları saklıdır.",
    createPrompt: "Prompt Oluştur",
    generatedDNAPrompt: "Oluşturulan DNA Promptu (Düzenlenebilir)",
    clear: "Temizle",
    generatingImage: "Görsel Üretiliyor...",
    generateImageBtn: "Görseli Üret",
    generateVariations: "4 Varyasyon Üret",
    generatingVariation: "Üretiliyor...",
    originalReference: "Orijinal Referans",
    dnaSource: "DNA Kaynağı",
    newVariation: "Yeni Varyasyon",
    studioPreviewPlaceholder: "Prompt oluşturun ve varyasyonu burada görün.",
    batchVariations: "Toplu Varyasyonlar",
    batchResults: "Toplu Üretim Sonuçları",
    retry: "Yeniden Dene",
    downloadAll: "Tümünü İndir",
    action: "Aksiyon",
    generatedImageTitle: "Üretilen Görsel",
    generatedImageDesc: "Analiz edilen prompt temel alınarak oluşturuldu.",
    suggestionLabels: {
      cameraAngle: "Kamera Açısı",
      lighting: "Işıklandırma",
      expression: "Yüz İfadesi",
      pose: "Poz",
      clothing: "Kıyafet Tarzı",
      background: "Arka Plan"
    },
    historyTitle: "Son İşlemler",
    chatTitle: "AI Sohbeti",
    chatPlaceholder: "Görsel hakkında bir şey sor...",
    send: "Gönder",
    noHistory: "Henüz bir analiz yapılmadı.",
    clearHistory: "Geçmişi Temizle",
    chatContext: "Bu görsel ve analiz sonuçları hakkında bana yardımcı ol."
  },
  ENG: {
    docs: "Documentation",
    title: "Image Analysis",
    subtitle: "Convert your uploaded image into a professional JSON prompt. Instantly get camera, lighting, clothing, and composition details.",
    dragDrop: "Drag image here",
    orClick: "or click to select",
    analyzing: "Analyzing...",
    analyze: "Analyze",
    jsonOutput: "JSON Output",
    generating: "Generating...",
    generate: "Generate Image",
    upgrading: "Upgrading...",
    upgrade: "Make Hyper-Realistic",
    copied: "Copied",
    copy: "Copy",
    resultsPlaceholder: "Analysis results will appear here.",
    processing: "Processing Image",
    aiDetails: "AI is capturing details...",
    suggestions: "Suggestions",
    clothingColor: "Clothing Color",
    apply: "Apply",
    cancel: "Cancel",
    studioTitle: "Influencer Studio",
    studioMode: "Studio Mode",
    single: "Single Generation",
    batch: "Batch Generation",
    genMethod: "Generation Method",
    reference: "Reference Image",
    textPrompt: "Text Prompt",
    batchMode: "Batch Mode",
    template: "Template Selection",
    manual: "Manual Selections",
    random: "Random",
    custom: "Custom",
    studioPromptLabel: "Studio Prompt (Optional)",
    studioPromptPlaceholder: "E.g., Neon lit cyberpunk environment...",
    studioSettings: "Studio Settings",
    generateWithPrompt: "Generate with Prompt",
    close: "Close",
    download: "Download",
    regenerate: "Regenerate Image",
    generatingNew: "Generating New Image...",
    samePose: "Same pose",
    sameEnv: "Same environment",
    sameOutfit: "Same outfit",
    sameCamera: "Same angle",
    sameLight: "Same lighting",
    still: "Still",
    diffPose: "Different pose",
    diffEnv: "Different environment",
    diffOutfit: "Different outfit",
    diffCamera: "Different angle",
    diffLight: "Different lighting",
    motion: "In motion",
    revising: "Revising...",
    revisePrompt: "Revise Prompt",
    reset: "Reset",
    goUp: "Go Up",
    angle: "Angle",
    light: "Light",
    ethnicity: "Ethnicity",
    style: "Style",
    enlarge: "Enlarge",
    generatedImageBadge: "Generated Image",
    footerPowered: "Powered by Gemini 3 Flash Vision",
    footerRights: "© 2026 Vision2JSON. All rights reserved.",
    createPrompt: "Create Prompt",
    generatedDNAPrompt: "Generated DNA Prompt (Editable)",
    clear: "Clear",
    generatingImage: "Generating Image...",
    generateImageBtn: "Generate Image",
    generateVariations: "Generate 4 Variations",
    generatingVariation: "Generating...",
    originalReference: "Original Reference",
    dnaSource: "DNA Source",
    newVariation: "New Variation",
    studioPreviewPlaceholder: "Create a prompt and see the variation here.",
    batchVariations: "Batch Variations",
    batchResults: "Batch Generation Results",
    retry: "Retry",
    downloadAll: "Download All",
    action: "Action",
    generatedImageTitle: "Generated Image",
    generatedImageDesc: "Created based on the analyzed prompt.",
    suggestionLabels: {
      cameraAngle: "Camera Angle",
      lighting: "Lighting",
      expression: "Facial Expression",
      pose: "Pose",
      clothing: "Clothing Style",
      background: "Background"
    },
    historyTitle: "Recent Actions",
    chatTitle: "AI Chat",
    chatPlaceholder: "Ask something about the image...",
    send: "Send",
    noHistory: "No analysis performed yet.",
    clearHistory: "Clear History",
    chatContext: "Help me with this image and analysis results."
  }
};

// Initialize Gemini API
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const translatePromptToTurkish = async (jsonPrompt: string) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: `Aşağıdaki JSON verisi bir 3D sahne ve karakter pozunu tanımlıyor. Lütfen bu JSON'u okuyarak, oluşturulacak fotoğrafı betimleyen akıcı, tek bir Türkçe paragraf yaz. Sadece betimlemeyi ver, ek açıklama yapma.\n\nJSON:\n${jsonPrompt}` }] }]
    });
    return response.text || "Özet oluşturulamadı.";
  } catch (e) {
    console.error("Translation error:", e);
    return "Özet oluşturulurken bir hata oluştu.";
  }
};

export const enhancePromptWithAI = async (jsonPrompt: string, userInput: string) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: `Aşağıdaki JSON bir 3D sahne promptudur. Kullanıcı bu sahneye şu özellikleri eklemek/değiştirmek istiyor: "${userInput}". Lütfen JSON yapısını bozmadan, kullanıcının isteklerini uygun alanlara (örneğin 'subject.clothing', 'environment', 'additional_details' gibi yeni alanlar ekleyerek veya mevcutları güncelleyerek) entegre et. SADECE geçerli ve güncellenmiş JSON çıktısı ver. Markdown (\`\`\`json) KULLANMA.\n\nMevcut JSON:\n${jsonPrompt}` }] }]
    });
    let text = response.text || jsonPrompt;
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return text;
  } catch (e) {
    console.error("Enhancement error:", e);
    return jsonPrompt;
  }
};

export const getAITip = async (settings: any) => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", parts: [{ text: `Bir fotoğraf stüdyosu uygulamasındayız. Kullanıcı şu ayarları seçti:
Çekim Ölçeği: ${settings.shotSize}
Yatay Açı: ${settings.hAngle}
Dikey Açı: ${settings.vAngle}
Işık Stili: ${settings.lightStyle}

Lütfen bu kombinasyon hakkında profesyonel bir fotoğrafçı gibi kısa, tek cümlelik bir ipucu veya yorum ver. Örneğin: "Alt açı ve dramatik ışık karakteri çok güçlü gösterecektir." veya "Öğlen ışığı ile yakın plan çekimlerde yüzdeki gölgelere dikkat etmelisin."
Sadece tek bir cümle ver, ek açıklama yapma.` }] }]
    });
    return response.text || "Güzel bir kompozisyon!";
  } catch (e) {
    console.error("Tip generation error:", e);
    return null;
  }
};

interface AnalysisResult {
  camera: {
    angle: string;
    focalLength: string;
    depthOfField: string;
    shotType: string;
    millimetricPosition: string;
    lensDistortion: string;
  };
  lighting: {
    source: string;
    quality: string;
    colorTemperature: string;
    direction: string;
    shadowDetail: string;
  };
  subject: {
    ethnicity: string;
    ageEstimation: string;
    hair: {
      color: string;
      texture: string;
      strandDetail: string;
      style: string;
      growthPattern: string;
    };
    face: {
      expression: {
        primaryEmotion: string;
        intensity: string;
        microExpressions: string;
      };
      features: {
        eyes: string;
        nose: string;
        lips: string;
        teeth: string;
        dimples: string;
        molesAndFreckles: string;
      };
    };
    body: {
      posture: string;
      poseDescription: string;
      skinTexture: string;
      nails: string;
      bodyArt: {
        tattoos: string[];
        piercings: string[];
      };
    };
    clothing: {
      items: string[];
      materials: string[];
      colors: string[];
      stitchingAndWear: string;
    };
    accessories: string[];
  };
  environment: {
    background: string;
    locationType: string;
    atmosphere: string;
    colorPalette: string[];
    depthLayers: string;
  };
  technical: {
    style: string;
    filmStockOrSensor: string;
    colorGrading: string;
    resolutionDetail: string;
    grainAndNoise: string;
  };
  suggestions: {
    cameraAngle: string[];
    lighting: string[];
    expression: string[];
    pose: string[];
    clothing: string[];
    background: string[];
  };
  negativePrompt: string[];
}

interface StudioConfig {
  pose: string;
  environment: string;
  outfit: string;
  camera: string;
  lighting: string;
  action: string;
}

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    camera: {
      type: Type.OBJECT,
      properties: {
        angle: { type: Type.STRING, description: "Precise camera angle" },
        focalLength: { type: Type.STRING, description: "Estimated focal length" },
        depthOfField: { type: Type.STRING, description: "Focus depth details" },
        shotType: { type: Type.STRING, description: "Shot size" },
        millimetricPosition: { type: Type.STRING, description: "Millimetric camera position and height" },
        lensDistortion: { type: Type.STRING, description: "Lens characteristics like chromatic aberration or barrel distortion" },
      },
      required: ["angle", "focalLength", "depthOfField", "shotType", "millimetricPosition", "lensDistortion"]
    },
    lighting: {
      type: Type.OBJECT,
      properties: {
        source: { type: Type.STRING },
        quality: { type: Type.STRING },
        colorTemperature: { type: Type.STRING },
        direction: { type: Type.STRING },
        shadowDetail: { type: Type.STRING, description: "Sharpness and depth of shadows" },
      },
      required: ["source", "quality", "colorTemperature", "direction", "shadowDetail"]
    },
    subject: {
      type: Type.OBJECT,
      properties: {
        ethnicity: { type: Type.STRING, description: "Specific ethnic background identification" },
        ageEstimation: { type: Type.STRING },
        hair: {
          type: Type.OBJECT,
          properties: {
            color: { type: Type.STRING },
            texture: { type: Type.STRING },
            strandDetail: { type: Type.STRING, description: "Description of individual hair strands, flyaways, and sheen" },
            style: { type: Type.STRING },
            growthPattern: { type: Type.STRING },
          },
          required: ["color", "texture", "strandDetail", "style", "growthPattern"]
        },
        face: {
          type: Type.OBJECT,
          properties: {
            expression: {
              type: Type.OBJECT,
              properties: {
                primaryEmotion: { type: Type.STRING },
                intensity: { type: Type.STRING },
                microExpressions: { type: Type.STRING },
              },
              required: ["primaryEmotion", "intensity", "microExpressions"]
            },
            features: {
              type: Type.OBJECT,
              properties: {
                eyes: { type: Type.STRING },
                nose: { type: Type.STRING },
                lips: { type: Type.STRING },
                teeth: { type: Type.STRING, description: "Detailed description of teeth alignment, size, and color" },
                dimples: { type: Type.STRING, description: "Presence and location of dimples" },
                molesAndFreckles: { type: Type.STRING, description: "Specific location and appearance of moles, freckles, or scars" },
              },
              required: ["eyes", "nose", "lips", "teeth", "dimples", "molesAndFreckles"]
            },
          },
          required: ["expression", "features"]
        },
        body: {
          type: Type.OBJECT,
          properties: {
            posture: { type: Type.STRING },
            poseDescription: { type: Type.STRING },
            skinTexture: { type: Type.STRING, description: "Pores, sweat, fine lines, and skin imperfections" },
            nails: { type: Type.STRING, description: "Nail color, shape, and condition for each finger" },
            bodyArt: {
              type: Type.OBJECT,
              properties: {
                tattoos: { type: Type.ARRAY, items: { type: Type.STRING } },
                piercings: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["tattoos", "piercings"]
            },
          },
          required: ["posture", "poseDescription", "skinTexture", "nails", "bodyArt"]
        },
        clothing: {
          type: Type.OBJECT,
          properties: {
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
            materials: { type: Type.ARRAY, items: { type: Type.STRING } },
            colors: { type: Type.ARRAY, items: { type: Type.STRING } },
            stitchingAndWear: { type: Type.STRING, description: "Details of seams, threads, and fabric wear" },
          },
          required: ["items", "materials", "colors", "stitchingAndWear"]
        },
        accessories: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["ethnicity", "ageEstimation", "hair", "face", "body", "clothing", "accessories"]
    },
    environment: {
      type: Type.OBJECT,
      properties: {
        background: { type: Type.STRING },
        locationType: { type: Type.STRING },
        atmosphere: { type: Type.STRING },
        colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
        depthLayers: { type: Type.STRING, description: "Foreground, midground, and background separation" },
      },
      required: ["background", "locationType", "atmosphere", "colorPalette", "depthLayers"]
    },
    technical: {
      type: Type.OBJECT,
      properties: {
        style: { type: Type.STRING },
        filmStockOrSensor: { type: Type.STRING },
        colorGrading: { type: Type.STRING },
        resolutionDetail: { type: Type.STRING },
        grainAndNoise: { type: Type.STRING },
      },
      required: ["style", "filmStockOrSensor", "colorGrading", "resolutionDetail", "grainAndNoise"]
    },
    suggestions: {
      type: Type.OBJECT,
      properties: {
        cameraAngle: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 alternative camera angle suggestions" },
        lighting: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 alternative lighting suggestions" },
        expression: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 alternative facial expression suggestions" },
        pose: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 alternative pose suggestions" },
        clothing: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 alternative clothing style suggestions" },
        background: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 alternative background/environment suggestions" },
      },
      required: ["cameraAngle", "lighting", "expression", "pose", "clothing", "background"]
    },
    negativePrompt: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["camera", "lighting", "subject", "environment", "technical", "suggestions", "negativePrompt"]
};

const SUGGESTION_LABELS: Record<string, string> = {
  cameraAngle: "Kamera Açısı",
  lighting: "Işıklandırma",
  expression: "Mimik",
  pose: "Duruş",
  clothing: "Kıyafet",
  background: "Arka Plan"
};

const STUDIO_OPTIONS = {
  pose: ["Aynı poz", "Oturuyor", "Yürüyor", "Selfie", "Model duruşu", "Gülümseyen", "Koşuyor", "Dans ediyor", "Uzanmış"],
  environment: ["Aynı ortam", "Modern Kafe", "Şehir Sokakları", "Lüks Otel", "Doğa/Orman", "Stüdyo", "Plaj", "Ofis", "Gece Kulübü"],
  outfit: ["Aynı kıyafet", "Spor Giyim", "Abiye/Şık", "Casual/Günlük", "Business/Takım", "Sokak Stili", "Yazlık Elbise", "Kışlık Mont", "Pijama"],
  camera: ["Aynı açı", "Geniş Açı", "Yakın Çekim", "Düşük Açı", "Göz Hizası", "Sinematik", "Drone Çekimi", "Balık Gözü", "Portre Modu"],
  lighting: ["Aynı ışık", "Altın Saat", "Yumuşak Işık", "Neon/Gece", "Doğal Gün Işığı", "Dramatik", "Stüdyo Flaşı", "Mum Işığı", "Sert Gölgeler"],
  action: ["Hareketsiz", "Kahve İçiyor", "Telefona Bakıyor", "Kitap Okuyor", "Gülüyor", "Yürüyor", "Müzik Dinliyor", "Düşünüyor", "El Sallıyor"]
};

const BATCH_TEMPLATES = [
  { name: "Yandan", config: { camera: "Düşük Açı", pose: "Model duruşu" } },
  { name: "Uzaktan", config: { camera: "Geniş Açı", environment: "Şehir Sokakları" } },
  { name: "Yukarıdan", config: { camera: "Drone Çekimi", pose: "Oturuyor" } },
  { name: "Rastgele", config: {} }
];

const MANUAL_CATEGORIES = [
  { id: "pose", name: "Poz" },
  { id: "environment", name: "Ortam" },
  { id: "outfit", name: "Kıyafet" },
  { id: "camera", name: "Kamera" },
  { id: "lighting", name: "Işık" },
  { id: "action", name: "Aksiyon" }
];

const LiquidBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    {/* Base Solid Color (Magenta) */}
    <div className="absolute inset-0 bg-[#a6006a]"></div>
    
    {/* Dark fade at the top for the banner area - shorter and sharper */}
    <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#05050a] to-transparent"></div>
  </div>
);

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isPoseStudioOpen, setIsPoseStudioOpen] = useState(false);
  const [poseScreenshot, setPoseScreenshot] = useState<string | null>(null);
  const [lastPoseData, setLastPoseData] = useState<any>(null);
  const [isPoseComparisonOpen, setIsPoseComparisonOpen] = useState(false);
  const [isStudioGenerating, setIsStudioGenerating] = useState(false);
  const [studioImageUrl, setStudioImageUrl] = useState<string | null>(null);
  const [studioImages, setStudioImages] = useState<(string | null)[]>([]);
  const [studioMode, setStudioMode] = useState<'single' | 'batch'>('single');
  const [generationMethod, setGenerationMethod] = useState<'reference' | 'text'>('reference');
  const [batchMode, setBatchMode] = useState<'template' | 'manual'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>("Rastgele");
  const [manualSlots, setManualSlots] = useState<string[]>(["pose", "camera", "outfit", "action"]);
  const [currentBatchIndex, setCurrentBatchIndex] = useState<number>(-1);
  const [studioPrompt, setStudioPrompt] = useState<string | null>(null);
  const [studioConfig, setStudioConfig] = useState<StudioConfig>({
    pose: "Aynı poz",
    environment: "Aynı ortam",
    outfit: "Aynı kıyafet",
    camera: "Aynı açı",
    lighting: "Aynı ışık",
    action: "Hareketsiz"
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [initialResult, setInitialResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'prompt' | 'json'>('prompt');
  const [selectedSuggestions, setSelectedSuggestions] = useState<Record<string, string>>({});
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeMode, setThemeMode] = useState<'classic' | 'liquid' | 'beta'>('beta');
  const [themeColor, setThemeColor] = useState('#e6e9f0');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [language, setLanguage] = useState<'TR' | 'ENG'>('TR');
  const [history, setHistory] = useState<{ id: string; image: string; result: AnalysisResult; date: string }[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isAutoListeningRef = useRef(false);
  const isChatLoadingRef = useRef(false);
  const askAIRef = useRef<((overrideText?: string) => Promise<void>) | null>(null);

  const [userPrompt, setUserPrompt] = useState('');
  const [bottomInput, setBottomInput] = useState('');
  const [isBottomListening, setIsBottomListening] = useState(false);
  const bottomRecognitionRef = useRef<any>(null);
  const [jsonText, setJsonText] = useState("");
  const [voicePromptState, setVoicePromptState] = useState<'idle' | 'awaiting_random'>('idle');
  const [showEmptyPromptWarning, setShowEmptyPromptWarning] = useState(false);
  const [showGeneratedModal, setShowGeneratedModal] = useState(false);
  const promptScrollRef = useRef<HTMLDivElement>(null);
  const jsonScrollRef = useRef<HTMLDivElement>(null);
  
  // New states for enhancements
  const [toasts, setToasts] = useState<{id: number, message: string, type: 'success'|'info'|'error'}[]>([]);
  const [loadingText, setLoadingText] = useState("Görsel üretiliyor...");
  const [isEnhancingMainPrompt, setIsEnhancingMainPrompt] = useState(false);

  const addToast = useCallback((message: string, type: 'success'|'info'|'error' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);
  
  const userPromptRef = useRef(userPrompt);
  useEffect(() => { userPromptRef.current = userPrompt; }, [userPrompt]);

  const voicePromptStateRef = useRef(voicePromptState);
  useEffect(() => { voicePromptStateRef.current = voicePromptState; }, [voicePromptState]);

  const activeTabRef = useRef(activeTab);
  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);

  useEffect(() => {
    if (result && activeTab === 'json' && !isRevising) {
      setJsonText(JSON.stringify(result, null, 2));
    }
  }, [result, activeTab, isRevising]);

  const generateRandomImage = async () => {
    const randomPrompt = "A hyper-realistic portrait of the subject in a random cinematic environment, wearing random stylish clothes, shot from a random dynamic camera angle with dramatic lighting.";
    handleGenerateFromBottom(randomPrompt);
  };

  const enhanceMainPrompt = async () => {
    if (!userPrompt.trim()) {
      addToast("Lütfen önce geliştirmek için bir şeyler yazın.", "info");
      return;
    }
    setIsEnhancingMainPrompt(true);
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Aşağıdaki kısa metni, yapay zeka görsel üretimi için harika, detaylı ve profesyonel bir prompta dönüştür. Sadece İngilizce promptu ver, başka hiçbir açıklama yazma. Metin: "${userPrompt}"`,
      });
      const enhanced = response.text?.trim();
      if (enhanced) {
        setUserPrompt(enhanced);
        addToast("Prompt başarıyla geliştirildi! 🪄", "success");
      }
    } catch (err) {
      addToast("Prompt geliştirilirken bir hata oluştu.", "error");
    } finally {
      setIsEnhancingMainPrompt(false);
    }
  };

  const getChangedValues = (current: any, initial: any): string[] => {
    if (!current || !initial) return [];
    let changes: string[] = [];
    
    const compare = (curr: any, init: any) => {
      if (typeof curr === 'string' && curr !== init) {
        changes.push(curr);
      } else if (Array.isArray(curr)) {
        curr.forEach((item, index) => {
          if (init && Array.isArray(init)) {
            compare(item, init[index]);
          } else {
            if (typeof item === 'string') changes.push(item);
          }
        });
      } else if (typeof curr === 'object' && curr !== null) {
        Object.keys(curr).forEach(key => {
          if (init && typeof init === 'object') {
            compare(curr[key], init[key]);
          } else {
            if (typeof curr[key] === 'string') changes.push(curr[key]);
          }
        });
      }
    };
    
    compare(current, initial);
    return changes.filter(Boolean);
  };

  const highlightText = (text: string, wordsToHighlight: (string | undefined)[]) => {
    if (!text) return "";
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const validWords = wordsToHighlight.filter(Boolean) as string[];
    if (validWords.length === 0) return html;
    
    validWords.sort((a, b) => b.length - a.length);
    
    validWords.forEach(word => {
      const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      html = html.replace(regex, `<span class="rounded-sm" style="color: transparent; background-color: rgba(59, 130, 246, 0.4);">$1</span>`);
    });
    
    if (html.endsWith('\n')) {
      html += '<br/>';
    }
    return html;
  };

  const handleGenerateFromBottom = async (promptText: string) => {
    if (!promptText.trim() && activeTab === 'prompt') return;
    setIsGeneratingImage(true);
    setError(null);
    setGeneratedImageUrl(null);

    const loadingPhrases = [
      "Pikseller hizalanıyor...",
      "Işık ve gölgeler ayarlanıyor...",
      "Yapay zeka fırçasını hazırlıyor...",
      "Detaylar işleniyor...",
      "Harika bir şeyler ortaya çıkıyor...",
      "Neredeyse hazır..."
    ];
    setLoadingText(loadingPhrases[0]);
    let phraseIndex = 0;
    const loadingInterval = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % loadingPhrases.length;
      setLoadingText(loadingPhrases[phraseIndex]);
    }, 2000);

    try {
      let finalPrompt = promptText;
      if (activeTab === 'json') {
         const promptResponse = await genAI.models.generateContent({
           model: "gemini-3-flash-preview",
           contents: [{ parts: [{ text: `Convert this detailed image analysis JSON into a single, highly descriptive paragraph prompt for an AI image generator. JSON: ${promptText}` }] }]
         });
         finalPrompt = promptResponse.text || "A high quality photo based on the provided details.";
      }

      let parts: any[] = [{ text: finalPrompt }];
      if (image) {
        const base64Data = image.split(',')[1];
        parts = [
          { inlineData: { data: base64Data, mimeType: "image/jpeg" } },
          { text: `[CRITICAL INSTRUCTION: Use the provided image as a STRICT character reference. Preserve the exact facial features and identity.]\n\n${finalPrompt}` }
        ];
      }

      const imageResponse = await genAI.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [{ parts }],
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImageUrl(`data:image/png;base64,${part.inlineData.data}`);
          setIsModalOpen(true);
          addToast("Görsel başarıyla üretildi! 🎨", "success");
          break;
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Görsel üretilirken bir hata oluştu.");
      addToast("Görsel üretilirken bir hata oluştu.", "error");
    } finally {
      clearInterval(loadingInterval);
      setIsGeneratingImage(false);
    }
  };

  const reviseAnalysisWithText = async (instruction: string) => {
    if (!result) return;
    setIsRevising(true);
    setError(null);
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `Update the following image analysis JSON based on this user instruction: "${instruction}". Maintain the same schema and extreme precision.\n\nCurrent JSON:\n${JSON.stringify(result)}` }
            ]
          }
        ],
        config: { responseMimeType: "application/json", responseSchema: ANALYSIS_SCHEMA }
      });
      if (response.text) setResult(JSON.parse(response.text));
    } catch (err) {
      console.error(err);
      setError("Revizyon sırasında bir hata oluştu.");
    } finally {
      setIsRevising(false);
    }
  };

  const handleBottomSubmit = () => {
    const suggestionsText = Object.values(selectedSuggestions).filter(Boolean).join(", ");
    const fullInstruction = [bottomInput, suggestionsText].filter(Boolean).join(". ");
    
    if (!fullInstruction.trim()) return;

    if (activeTab === 'prompt') {
      setUserPrompt(prev => prev + (prev ? " " : "") + fullInstruction);
      setBottomInput("");
    } else {
      if (result) {
        reviseAnalysisWithText(fullInstruction);
        setBottomInput("");
      }
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'TR' ? 'tr-TR' : 'en-US';

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          const lowerText = finalTranscript.toLocaleLowerCase('tr-TR');
          
          if (voicePromptStateRef.current === 'awaiting_random') {
             if (lowerText.includes('rastgele')) {
                setVoicePromptState('idle');
                setIsBottomListening(false);
                bottomRecognitionRef.current?.stop();
                generateRandomImage();
             } else {
                setVoicePromptState('idle');
                setUserPrompt(finalTranscript);
             }
             return;
          }

          if (lowerText.includes('görsel oluştur')) {
             const cleanedText = lowerText.replace(/görsel oluştur/ig, '').trim();
             const finalPrompt = userPromptRef.current + " " + cleanedText;
             
             if (!finalPrompt.trim() && activeTabRef.current === 'prompt') {
                setIsBottomListening(false);
                bottomRecognitionRef.current?.stop();
                
                const utterance = new SpeechSynthesisUtterance("Prompt girmek ister misiniz veya rastgele üretim yapalım mı?");
                utterance.lang = 'tr-TR';
                utterance.onend = () => {
                   setVoicePromptState('awaiting_random');
                   setIsBottomListening(true);
                   try { bottomRecognitionRef.current?.start(); } catch(e){}
                };
                window.speechSynthesis.speak(utterance);
             } else {
                handleGenerateFromBottom(finalPrompt);
             }
          } else {
             setBottomInput(prev => prev + (prev ? " " : "") + finalTranscript.trim());
          }
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          setIsBottomListening(false);
        }
      };

      recognition.onend = () => {
        if (isBottomListening) {
          try { recognition.start(); } catch(e) {}
        }
      };

      bottomRecognitionRef.current = recognition;
    }
  }, [language, isBottomListening]);

  const toggleBottomListening = () => {
    if (isBottomListening) {
      setIsBottomListening(false);
      bottomRecognitionRef.current?.stop();
    } else {
      setIsBottomListening(true);
      addToast("Mikrofon dinleniyor... 🎤", "info");
      try { bottomRecognitionRef.current?.start(); } catch(e) {}
    }
  };

  useEffect(() => {
    isChatLoadingRef.current = isChatLoading;
  }, [isChatLoading]);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'TR' ? 'tr-TR' : 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setChatInput(finalTranscript);
          if (isAutoListeningRef.current && askAIRef.current) {
            askAIRef.current(finalTranscript);
          }
        } else {
          setChatInput(interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
          isAutoListeningRef.current = false;
          if (event.error === 'not-allowed') {
            setChatInput(language === 'TR' ? "Mikrofon izni reddedildi. Lütfen tarayıcı ayarlarından izin verin." : "Microphone permission denied. Please allow it in browser settings.");
            setTimeout(() => setChatInput(''), 3000);
          }
        }
      };

      recognition.onend = () => {
        if (isAutoListeningRef.current && !isChatLoadingRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        } else if (!isAutoListeningRef.current) {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      isAutoListeningRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setChatInput('');
      isAutoListeningRef.current = true;
      try {
        recognitionRef.current?.start();
      } catch (e) {}
      setIsListening(true);
      addToast("Sohbet mikrofonu dinleniyor... 🎤", "info");
    }
  };
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const savedHistory = localStorage.getItem('analysis_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("History parse error", e);
      }
    }
  }, []);

  const saveToHistory = (newResult: AnalysisResult, img: string) => {
    const newItem = {
      id: Date.now().toString(),
      image: img,
      result: newResult,
      date: new Date().toLocaleString()
    };
    const updatedHistory = [newItem, ...history].slice(0, 10);
    
    let currentHistoryToSave = [...updatedHistory];
    let saved = false;
    
    while (!saved && currentHistoryToSave.length > 0) {
      try {
        localStorage.setItem('analysis_history', JSON.stringify(currentHistoryToSave));
        setHistory(currentHistoryToSave);
        saved = true;
      } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.message?.includes('quota') || e.message?.includes('exceeded')) {
          // Remove the oldest item and try again
          currentHistoryToSave = currentHistoryToSave.slice(0, currentHistoryToSave.length - 1);
        } else {
          console.error("Error saving history:", e);
          setHistory(currentHistoryToSave); // Still update state even if localstorage fails for other reasons
          break;
        }
      }
    }
  };

  const loadFromHistory = (item: { image: string; result: AnalysisResult }) => {
    setImage(item.image);
    setResult(item.result);
    setInitialResult(item.result);
    setChatMessages([]);
    setIsHistoryOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('analysis_history');
    setIsHistoryOpen(false);
  };

  const askAI = async (overrideText?: string) => {
    const textToUse = overrideText || chatInput;
    if (!textToUse.trim() || !image || !result) return;

    const userMessage = textToUse.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput("");
    setIsChatLoading(true);
    
    if (isAutoListeningRef.current) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        User is asking a question about an image they uploaded and its analysis results.
        Analysis Results: ${JSON.stringify(result)}
        User Question: ${userMessage}
        
        Please provide a helpful, concise answer based on the image and the analysis.
        Answer in the same language as the user's question.
      `;

      const response = await ai.models.generateContent({
        model,
        contents: [
          { parts: [{ text: prompt }, { inlineData: { data: image.split(',')[1], mimeType: 'image/jpeg' } }] }
        ]
      });

      setChatMessages(prev => [...prev, { role: 'ai', text: response.text || "Üzgünüm, bir hata oluştu." }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'ai', text: "Bir hata oluştu, lütfen tekrar deneyin." }]);
    } finally {
      setIsChatLoading(false);
      if (isAutoListeningRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch (e) {}
        }, 500);
      }
    }
  };

  useEffect(() => {
    askAIRef.current = askAI;
  }, [askAI]);

  useEffect(() => {
    if (isDarkMode || themeMode === 'liquid' || themeMode === 'beta') {
      document.body.classList.add('dark-theme');
      setThemeColor(themeMode === 'liquid' ? '#05050a' : themeMode === 'beta' ? '#000000' : '#1e2128');
    } else {
      document.body.classList.remove('dark-theme');
      setThemeColor('#e6e9f0');
    }
  }, [isDarkMode, themeMode]);

  useEffect(() => {
    if (themeMode === 'liquid') {
      document.body.classList.add('liquid-theme');
    } else {
      document.body.classList.remove('liquid-theme');
    }
    if (themeMode === 'beta') {
      document.body.classList.add('beta-theme');
    } else {
      document.body.classList.remove('beta-theme');
    }
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--bg-base', themeColor);
    
    // Calculate shadows for neumorphism based on background color
    const hexToRgb = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const adjustColor = (hex: string, amount: number) => {
      const { r, g, b } = hexToRgb(hex);
      const clamp = (num: number) => Math.min(255, Math.max(0, num));
      const toHex = (num: number) => clamp(num).toString(16).padStart(2, '0');
      return `#${toHex(r + amount)}${toHex(g + amount)}${toHex(b + amount)}`;
    };

    const shadowLight = adjustColor(themeColor, 25);
    const shadowDark = adjustColor(themeColor, -25);
    
    document.documentElement.style.setProperty('--shadow-light', shadowLight);
    document.documentElement.style.setProperty('--shadow-dark', shadowDark);
  }, [themeColor]);

  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const clothingColorRef = useRef<HTMLInputElement>(null);

  const t = TRANSLATIONS[language];

  // We need to update SUGGESTION_LABELS dynamically based on language
  const currentSuggestionLabels = t.suggestionLabels;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setResult(null);
        setSelectedSuggestions({});
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions);

  const analyzeImage = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const base64Data = image.split(',')[1];
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `You are an expert forensic image analyst and professional cinematographer. 
                Analyze the provided image with EXTREME precision. Your goal is to capture every single micro-detail for a hyper-realistic reconstruction.
                
                CRITICAL REQUIREMENTS:
                1. ETHNICITY: Identify the specific ethnic background of the subject(s).
                2. MICRO-DETAILS: 
                   - Hair: Describe individual strands, flyaways, texture, and sheen.
                   - Face: Identify moles, freckles, scars, dimples, and micro-expressions.
                   - Teeth: Describe alignment (e.g., one tooth slightly larger), color, and visibility.
                   - Nails: Detail the color, shape, and condition of nails on each visible finger.
                   - Skin: Describe pores, fine lines, sweat, and imperfections.
                3. CAMERA: Provide millimetric positioning, estimated focal length, and lens characteristics (distortion, grain).
                4. CLOTHING: Detail the stitching, fabric wear, and exact materials.
                5. ENVIRONMENT: Describe depth layers (foreground/midground/background) and atmospheric conditions.
                6. SUGGESTIONS: Provide 3 creative alternative suggestions for each category (cameraAngle, lighting, expression, pose, clothing, background) that would change the mood or style while keeping the subject consistent.
                
                Output the analysis strictly in the following JSON format. Be as exhaustive as possible in each field.` },
              { inlineData: { data: base64Data, mimeType: "image/jpeg" } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA
        }
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        setResult(parsed);
        setInitialResult(parsed);
        saveToHistory(parsed, image);
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429") || errMsg.includes("quota")) {
        setError("API kotanız doldu. Lütfen Google AI Studio faturalandırma detaylarınızı kontrol edin.");
      } else {
        setError("Görsel analiz edilirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const upgradeToHyperRealistic = async () => {
    if (!result) return;

    setIsUpgrading(true);
    setError(null);

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `Take the following image analysis JSON and transform it into a "Hyper-Realistic" version. 
              
              CRITICAL RULES for Hyper-Realism:
              - DO NOT use computer-generated or animation terms like "Unreal Engine", "Octane Render", "CGI", "3D Render", "V-Ray", or "Animation".
              - USE real-world photography and cinematography terms ONLY.
              - Technical details MUST include: "RAW photo", "8k UHD", "high-resolution film grain", "sharp focus", "natural skin texture with visible pores", "hyper-detailed textures".
              - Enhance the camera details to professional photography standards (e.g., "shot on Sony A7R IV", "85mm f/1.2 G-Master lens", "shutter speed 1/250", "ISO 100").
              - Describe lighting with natural/studio terms: "natural soft sunlight", "golden hour glow", "professional studio three-point lighting", "softbox diffusion".
              - The negative prompt MUST be updated to strictly exclude: "illustration", "painting", "drawing", "cartoon", "cgi", "3d render", "unreal engine", "anime", "sketch", "distorted features", "plastic skin".
              
              PRESERVE AND ENHANCE MICRO-DETAILS:
              - Maintain the identified ethnicity and age.
              - Enhance hair strand descriptions (e.g., "individual hair follicles visible").
              - Refine descriptions of teeth, nails, dimples, and moles to be even more photographic.
              - Ensure millimetric camera positioning is maintained or refined.
              - Provide updated creative suggestions that align with the hyper-realistic style.
              
              Return the updated JSON following the same schema. Keep descriptions concise but highly technical to avoid exceeding token limits.
              
              Current JSON:
              ${JSON.stringify(result)}` }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA
        }
      });

      const text = response.text;
      if (text) {
        try {
          // Clean the text in case there are trailing characters or markdown blocks
          const cleanedText = text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
          setResult(JSON.parse(cleanedText));
        } catch (parseErr) {
          console.error("JSON Parse Error:", parseErr, "Text:", text);
          setError("Model yanıtı geçerli bir JSON formatında değil veya çok uzun olduğu için kesildi.");
        }
      }
    } catch (err: any) {
      console.error("Upgrade failed:", err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429") || errMsg.includes("quota")) {
        setError("API kotanız doldu. Lütfen Google AI Studio faturalandırma detaylarınızı kontrol edin.");
      } else {
        setError("Hyper-realistik dönüşüm sırasında bir hata oluştu.");
      }
    } finally {
      setIsUpgrading(false);
    }
  };

  const generateBatchVariations = async () => {
    if (!result) return;

    setIsStudioGenerating(true);
    setStudioImages([null, null, null, null]);
    setCurrentBatchIndex(0);
    setError(null);

    const newImages = [null, null, null, null] as (string | null)[];

    for (let i = 0; i < 4; i++) {
      setCurrentBatchIndex(i);
      try {
        let currentConfig = { ...studioConfig };

        if (batchMode === 'template') {
          const template = BATCH_TEMPLATES.find(t => t.name === selectedTemplate) || BATCH_TEMPLATES[3];
          if (template.name === "Rastgele") {
            currentConfig = {
              pose: STUDIO_OPTIONS.pose[Math.floor(Math.random() * STUDIO_OPTIONS.pose.length)],
              environment: STUDIO_OPTIONS.environment[Math.floor(Math.random() * STUDIO_OPTIONS.environment.length)],
              outfit: STUDIO_OPTIONS.outfit[Math.floor(Math.random() * STUDIO_OPTIONS.outfit.length)],
              camera: STUDIO_OPTIONS.camera[Math.floor(Math.random() * STUDIO_OPTIONS.camera.length)],
              lighting: STUDIO_OPTIONS.lighting[Math.floor(Math.random() * STUDIO_OPTIONS.lighting.length)],
              action: STUDIO_OPTIONS.action[Math.floor(Math.random() * STUDIO_OPTIONS.action.length)],
            };
          } else {
            currentConfig = { ...currentConfig, ...template.config };
            // Add some variety to other fields for template
            if (i > 0) {
              currentConfig.action = STUDIO_OPTIONS.action[Math.floor(Math.random() * STUDIO_OPTIONS.action.length)];
              currentConfig.lighting = STUDIO_OPTIONS.lighting[Math.floor(Math.random() * STUDIO_OPTIONS.lighting.length)];
            }
          }
        } else {
          // Manual mode: 4 slots, each slot has a category.
          const categoryId = manualSlots[i] as keyof typeof STUDIO_OPTIONS;
          const randomValue = STUDIO_OPTIONS[categoryId][Math.floor(Math.random() * STUDIO_OPTIONS[categoryId].length)];
          currentConfig = { ...currentConfig, [categoryId]: randomValue };
        }

        // Step 1: Generate a DNA-preserving prompt for the variation
        const promptResponse = await genAI.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { text: `You are an expert prompt engineer for hyper-realistic AI influencers. 
                Your task is to create a master prompt that preserves the EXACT physical DNA of the subject from the provided analysis but changes the scene according to the user's studio configuration.
                
                SUBJECT DNA (MUST PRESERVE):
                - Ethnicity: ${result.subject.ethnicity}
                - Age: ${result.subject.ageEstimation}
                - Hair: ${result.subject.hair.color}, ${result.subject.hair.texture}, ${result.subject.hair.style}
                - Face: ${result.subject.face.features.eyes}, ${result.subject.face.features.nose}, ${result.subject.face.features.lips}, ${result.subject.face.features.molesAndFreckles}
                - Body: ${result.subject.body.skinTexture}, ${result.subject.body.bodyArt.tattoos.join(', ')}
                
                NEW STUDIO CONFIGURATION:
                - Pose: ${currentConfig.pose}
                - Environment: ${currentConfig.environment}
                - Outfit: ${currentConfig.outfit}
                - Camera: ${currentConfig.camera}
                - Lighting: ${currentConfig.lighting}
                - Action: ${currentConfig.action}
                
                OUTPUT REQUIREMENTS:
                - Create a single, highly detailed paragraph in English.
                - Use professional photography terms (RAW photo, 8k, specific lenses).
                - Focus on consistency. The person must look identical to the original analysis.
                
                Output ONLY the prompt text.` }
              ]
            }
          ]
        });

        const variationPrompt = promptResponse.text;

        let parts: any[] = [
          { text: variationPrompt || "A high quality photo of the subject." }
        ];

        if (generationMethod === 'reference' && image) {
          const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          if (matches && matches.length === 3) {
            parts = [
              {
                inlineData: {
                  mimeType: matches[1],
                  data: matches[2]
                }
              },
              {
                text: `CRITICAL INSTRUCTION: Use the provided image as a STRICT character reference. You MUST preserve the exact facial features, identity, ethnicity, and core physical appearance of the person in the reference image. Do not change their face. Generate a new photo of THIS EXACT PERSON based on the following settings:\n\n${variationPrompt}`
              }
            ];
          }
        }

        // Step 2: Generate the image
        const imageResponse = await genAI.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [
            {
              parts
            }
          ],
          config: {
            imageConfig: {
              aspectRatio: "1:1"
            }
          }
        });

        for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            newImages[i] = `data:image/png;base64,${base64Data}`;
            setStudioImages([...newImages]);
            break;
          }
        }
      } catch (err: any) {
        console.error(`Batch generation failed at index ${i}:`, err);
        const errMsg = err?.message || String(err);
        if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429") || errMsg.includes("quota")) {
          setError("API kotanız doldu. Lütfen Google AI Studio faturalandırma detaylarınızı kontrol edin.");
          break; // Stop the batch process if quota is exceeded
        }
      }
    }

    setIsStudioGenerating(false);
    setCurrentBatchIndex(-1);
  };

  const downloadAllBatchImages = async () => {
    for (let i = 0; i < studioImages.length; i++) {
      const imgUrl = studioImages[i];
      if (imgUrl) {
        const a = document.createElement('a');
        a.href = imgUrl;
        a.download = `influencer-variation-${i + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Small delay to prevent browser from blocking multiple downloads
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  };

  const generateInfluencerVariation = async (customPrompt?: string) => {
    if (!result) return;

    setIsStudioGenerating(true);
    setError(null);
    if (!customPrompt) setStudioImageUrl(null);

    try {
      let variationPrompt = customPrompt;

      if (!variationPrompt) {
        // Step 1: Generate a DNA-preserving prompt for the variation
        const promptResponse = await genAI.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { text: `You are an expert prompt engineer for hyper-realistic AI influencers. 
                Your task is to create a master prompt that preserves the EXACT physical DNA of the subject from the provided analysis but changes the scene according to the user's studio configuration.
                
                SUBJECT DNA (MUST PRESERVE):
                - Ethnicity: ${result.subject.ethnicity}
                - Age: ${result.subject.ageEstimation}
                - Hair: ${result.subject.hair.color}, ${result.subject.hair.texture}, ${result.subject.hair.style}
                - Face: ${result.subject.face.features.eyes}, ${result.subject.face.features.nose}, ${result.subject.face.features.lips}, ${result.subject.face.features.molesAndFreckles}
                - Body: ${result.subject.body.skinTexture}, ${result.subject.body.bodyArt.tattoos.join(', ')}
                
                NEW STUDIO CONFIGURATION:
                - Pose: ${studioConfig.pose}
                - Environment: ${studioConfig.environment}
                - Outfit: ${studioConfig.outfit}
                - Camera: ${studioConfig.camera}
                - Lighting: ${studioConfig.lighting}
                - Action: ${studioConfig.action}
                
                OUTPUT REQUIREMENTS:
                - Create a single, highly detailed paragraph in English.
                - Use professional photography terms (RAW photo, 8k, specific lenses).
                - Focus on consistency. The person must look identical to the original analysis.
                - Include negative prompt elements in the description (e.g., "avoiding any cartoonish features").
                
                Output ONLY the prompt text.` }
              ]
            }
          ]
        });

        variationPrompt = promptResponse.text;
        setStudioPrompt(variationPrompt || null);
      }

      let parts: any[] = [
        { text: variationPrompt || "A high quality photo of the subject." }
      ];

      if (generationMethod === 'reference' && image) {
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          parts = [
            {
              inlineData: {
                mimeType: matches[1],
                data: matches[2]
              }
            },
            {
              text: `CRITICAL INSTRUCTION: Use the provided image as a STRICT character reference. You MUST preserve the exact facial features, identity, ethnicity, and core physical appearance of the person in the reference image. Do not change their face. Generate a new photo of THIS EXACT PERSON based on the following settings:\n\n${variationPrompt}`
            }
          ];
        }
      }

      // Step 2: Generate the image
      const imageResponse = await genAI.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [
          {
            parts
          }
        ],
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setStudioImageUrl(`data:image/png;base64,${base64Data}`);
          break;
        }
      }
    } catch (err: any) {
      console.error("Studio generation failed:", err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429") || errMsg.includes("quota")) {
        setError("API kotanız doldu. Lütfen Google AI Studio faturalandırma detaylarınızı kontrol edin.");
      } else {
        setError("Influencer varyasyonu üretilirken bir hata oluştu.");
      }
    } finally {
      setIsStudioGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!result) return;

    setIsGeneratingImage(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      // First, we convert the JSON into a descriptive prompt for the image model
      const promptResponse = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `Convert this detailed image analysis JSON into a single, highly descriptive paragraph prompt for an AI image generator. 
              The prompt should be in English and focus on visual fidelity, lighting, composition, and specific subject details mentioned in the JSON.
              JSON: ${JSON.stringify(result)}` }
            ]
          }
        ]
      });

      const descriptivePrompt = promptResponse.text;

      // Now generate the image using the descriptive prompt
      const imageResponse = await genAI.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: [
          {
            parts: [
              { text: descriptivePrompt || "A high quality photo based on the provided details." }
            ]
          }
        ],
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setGeneratedImageUrl(`data:image/png;base64,${base64Data}`);
          break;
        }
      }
    } catch (err: any) {
      console.error("Image generation failed:", err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429") || errMsg.includes("quota")) {
        setError("API kotanız doldu. Lütfen Google AI Studio faturalandırma detaylarınızı kontrol edin.");
      } else {
        setError("Görsel üretilirken bir hata oluştu.");
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const generateFromPoseStudio = async (data: { prompt: string, additionalDetails: string, useReference: boolean, poseScreenshot: string | null }) => {
    setIsGeneratingImage(true);
    setError(null);
    setGeneratedImageUrl(null);
    setPoseScreenshot(data.poseScreenshot);
    setLastPoseData(data);
    // Don't open the normal modal, we will open the comparison modal after generation
    // setIsModalOpen(true);

    try {
      // Create a descriptive prompt from the JSON and additional details
      const promptResponse = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `Convert this 3D Pose Studio data into a highly descriptive paragraph prompt for an AI image generator. 
              The prompt should be in English and focus on the pose, camera angle, lighting, and any additional details provided.
              
              Pose JSON: ${data.prompt}
              
              Additional Details: ${data.additionalDetails}
              
              Create a cohesive, hyper-realistic image prompt.` }
            ]
          }
        ]
      });

      const descriptivePrompt = promptResponse.text;

      // Prepare contents for image generation
      const contents: any[] = [
        {
          parts: [
            { text: descriptivePrompt || "A high quality photo based on the provided details." }
          ]
        }
      ];

      // Add reference image if requested and available
      if (data.useReference && image) {
        const base64Data = image.split(',')[1];
        contents[0].parts.push({
          inlineData: { data: base64Data, mimeType: "image/jpeg" }
        });
        contents[0].parts[0].text = `[CRITICAL INSTRUCTION: The attached image is the EXACT subject. You MUST preserve their exact facial features, identity, ethnicity, and hair. Do NOT generate a generic person. Match the face perfectly.]\n\n` + contents[0].parts[0].text + " Use the provided image as a strong reference for the character's appearance, face, and clothing style, but apply the new pose, lighting, and camera angles described.";
      }

      // Generate the image
      const imageResponse = await genAI.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: contents,
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          setGeneratedImageUrl(`data:image/png;base64,${base64Data}`);
          setIsPoseComparisonOpen(true);
          break;
        }
      }
    } catch (err: any) {
      console.error("Image generation failed:", err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429") || errMsg.includes("quota")) {
        setError("API kotanız doldu. Lütfen Google AI Studio faturalandırma detaylarınızı kontrol edin.");
      } else {
        setError("Görsel üretilirken bir hata oluştu.");
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const reviseAnalysis = async () => {
    if (!result || Object.keys(selectedSuggestions).length === 0) return;

    setIsRevising(true);
    setError(null);

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `Update the following image analysis JSON by replacing the specific fields with these user-selected values. 
              If "clothingColor" is provided, update the clothing colors in the JSON with that specific hex code.
              Maintain the same level of extreme precision and hyper-realism for all other fields.
              
              USER OVERRIDES:
              ${JSON.stringify(selectedSuggestions, null, 2)}
              
              Current JSON:
              ${JSON.stringify(result)}` }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: ANALYSIS_SCHEMA
        }
      });

      const text = response.text;
      if (text) {
        setResult(JSON.parse(text));
      }
    } catch (err: any) {
      console.error("Revision failed:", err);
      const errMsg = err?.message || String(err);
      if (errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("429") || errMsg.includes("quota")) {
        setError("API kotanız doldu. Lütfen Google AI Studio faturalandırma detaylarınızı kontrol edin.");
      } else {
        setError("Revizyon sırasında bir hata oluştu.");
      }
    } finally {
      setIsRevising(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(JSON.stringify(result, null, 2));
      setCopied(true);
      addToast("JSON başarıyla kopyalandı! 📋", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const scrollToTop = () => {
    if (resultsContainerRef.current) {
      resultsContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      resultsContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const resetToInitial = () => {
    if (initialResult) {
      setResult(initialResult);
      setSelectedSuggestions({});
      scrollToTop();
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setInitialResult(null);
    setError(null);
    setSelectedSuggestions({});
    setGeneratedImageUrl(null);
  };

  const toggleThemeMode = (e: React.MouseEvent) => {
    const isLiquid = themeMode === 'liquid';
    const nextTheme = isLiquid ? 'classic' : 'liquid';

    // @ts-ignore - View Transitions API
    if (!document.startViewTransition) {
      setThemeMode(nextTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // @ts-ignore
    const transition = document.startViewTransition(() => {
      setThemeMode(nextTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: isLiquid ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 800,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          pseudoElement: isLiquid
            ? "::view-transition-old(root)"
            : "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <MotionDiv
      initial="hidden"
      animate="show"
      exit="exit"
      variants={{
        hidden: { opacity: 0, scale: 0.98 },
        show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeInOut", staggerChildren: 0.1 } },
        exit: { opacity: 0, transition: { duration: 0.5, ease: "easeInOut", staggerChildren: 0.05, staggerDirection: -1, when: "afterChildren" } }
      }}
      className={cn(
        "min-h-screen transition-colors duration-500 bg-transparent flex flex-col w-full z-10",
        (isDarkMode || themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748]"
      )}
    >
      {themeMode === 'liquid' && <LiquidBackground />}
      {themeMode === 'beta' && (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-black flex items-center justify-center">
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4"
            className="absolute object-cover object-top"
            style={{ width: '120vw', height: '120vh', filter: 'blur(35px) brightness(0.5)' }}
            autoPlay muted loop playsInline
          />
        </div>
      )}
      <header className={cn(
        "sticky top-0 z-50 mb-8 transition-colors duration-500",
        themeMode === 'liquid' 
          ? "bg-[#05050a] border-none" 
          : themeMode === 'beta'
            ? "border-b border-white/5 bg-transparent backdrop-blur-sm"
            : "border-b neu-flat border-white/5"
      )}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-10 h-10 neu-flat rounded-xl flex items-center justify-center text-blue-500 shadow-sm hover:text-blue-600 transition-all active:neu-pressed active:scale-95" title="Şov Ekranına Dön">
              <Maximize2 className="w-5 h-5" />
            </Link>
            <h1 className={cn(
              "text-xl font-bold tracking-tight",
              (themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748] dark:text-white"
            )}>
              Vision2JSON
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPoseStudioOpen(true)}
              className="flex items-center gap-2 px-4 h-10 neu-flat rounded-xl text-sm font-bold text-blue-500 hover:text-blue-600 transition-colors"
            >
              <Box className="w-4 h-4" />
              3D Pose Studio
            </button>
            <button
              onClick={() => {
                if (!result) {
                  addToast(language === 'TR' ? 'Lütfen önce bir görsel yükleyip analiz edin.' : 'Please upload and analyze an image first.', 'info');
                  return;
                }
                setIsStudioOpen(true);
              }}
              className="flex items-center gap-2 px-4 h-10 neu-flat rounded-xl text-sm font-bold text-green-500 hover:text-green-600 transition-colors"
            >
              <User className="w-4 h-4" />
              Influencer Studio
            </button>
            <a 
              href="https://github.com" 
              target="_blank" 
              className="text-sm font-medium text-[#718096] hover:text-blue-500 transition-colors"
            >
              {t.docs}
            </a>
            
            <div className="h-6 w-px bg-[#c8cbd2] dark:bg-[#1f222a] mx-2"></div>
            
            <div className="flex items-center gap-3">
              {/* History Toggle */}
              <div className="relative">
                <button
                  onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                  className="w-10 h-10 rounded-full neu-flat flex items-center justify-center text-[#718096] hover:text-blue-500 transition-all"
                  title={t.historyTitle}
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                
                <AnimatePresenceComponent>
                  {isHistoryOpen && (
                    <MotionDiv
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-72 neu-flat rounded-3xl overflow-hidden z-[60] border border-white/10 p-4 shadow-2xl"
                    >
                      <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-[10px] font-bold text-[#718096] dark:text-gray-500 uppercase tracking-widest">{t.historyTitle}</h3>
                        {history.length > 0 && (
                          <button 
                            onClick={clearHistory} 
                            className="text-[9px] text-red-500 hover:text-red-600 transition-colors font-bold uppercase"
                          >
                            {t.clearHistory}
                          </button>
                        )}
                      </div>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-1">
                        {history.length === 0 ? (
                          <div className="neu-pressed rounded-2xl p-6 text-center border border-white/5">
                            <p className="text-[10px] text-[#718096] font-medium">{t.noHistory}</p>
                          </div>
                        ) : (
                          history.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => loadFromHistory(item)}
                              className="w-full neu-flat hover:neu-pressed p-2 rounded-2xl transition-all group flex items-center gap-3 border border-white/5"
                            >
                              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div className="text-left overflow-hidden">
                                <p className="text-[9px] text-[#2d3748] dark:text-white font-bold truncate">{item.result.subject.ethnicity} - {item.result.technical.style}</p>
                                <p className="text-[8px] text-[#718096] font-medium">{item.date}</p>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </MotionDiv>
                  )}
                </AnimatePresenceComponent>
              </div>

              {/* Language Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLanguage('TR')}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    language === 'TR' ? "neu-pressed text-blue-500" : "neu-flat text-[#718096] hover:text-blue-500"
                  )}
                >
                  TR
                </button>
                <button
                  onClick={() => setLanguage('ENG')}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    language === 'ENG' ? "neu-pressed text-blue-500" : "neu-flat text-[#718096] hover:text-blue-500"
                  )}
                >
                  ENG
                </button>
              </div>

              {/* Theme & Color Toggle */}
              <div className="flex items-center gap-2">
                {/* Liquid Theme Toggle */}
                <button
                  onClick={() => {
                    // @ts-ignore - View Transitions API
                    if (document.startViewTransition) {
                      document.startViewTransition(() => setThemeMode(themeMode === 'beta' ? 'classic' : 'beta'));
                    } else {
                      setThemeMode(themeMode === 'beta' ? 'classic' : 'beta');
                    }
                  }}
                  className={cn(
                    "px-4 h-10 rounded-xl flex items-center justify-center transition-all relative overflow-hidden font-bold text-sm",
                    themeMode === 'beta' ? "bg-white text-black hover:bg-gray-100" : "neu-flat text-[#718096] hover:text-white"
                  )}
                >
                  Beta Geçiş
                </button>

                <button
                  onClick={toggleThemeMode}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all relative overflow-hidden",
                    themeMode === 'liquid' ? "neu-pressed text-blue-500" : "neu-flat text-[#718096] hover:text-blue-500"
                  )}
                  title={themeMode === 'liquid' ? "Klasik Temaya Dön" : "Likit Temaya Geç"}
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="w-10 h-10 rounded-full neu-flat flex items-center justify-center text-[#718096] hover:text-blue-500 transition-all relative overflow-hidden"
                >
                  {/* Corner lines for "shirt" style */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t-2 border-l-2 border-current opacity-50 rounded-tl-sm"></div>
                  <div className="absolute top-2 right-2 w-2 h-2 border-t-2 border-r-2 border-current opacity-50 rounded-tr-sm"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 border-b-2 border-l-2 border-current opacity-50 rounded-bl-sm"></div>
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b-2 border-r-2 border-current opacity-50 rounded-br-sm"></div>
                  
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Color Picker Toggle */}
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    className="w-10 h-10 rounded-full neu-flat flex items-center justify-center text-[#718096] hover:text-blue-500 transition-all relative overflow-hidden"
                  >
                    <Palette className="w-4 h-4" />
                    <div 
                      className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: themeColor }}
                    />
                  </button>

                  <AnimatePresenceComponent>
                    {showColorPicker && (
                      <MotionDiv
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute right-0 mt-4 p-4 neu-flat rounded-2xl z-[100] flex flex-col gap-4 min-w-[200px]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#4a5568]">Arka Plan Rengi</span>
                          <button 
                            onClick={() => setShowColorPicker(false)}
                            className="p-1 hover:text-blue-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="custom-color-picker">
                          <HexColorPicker 
                            color={themeColor} 
                            onChange={setThemeColor}
                          />
                        </div>

                        <button
                          onClick={() => setShowColorPicker(false)}
                          className="w-full py-2 neu-flat text-xs font-bold text-blue-500 hover:neu-pressed transition-all rounded-xl"
                        >
                          Tamam
                        </button>
                      </MotionDiv>
                    )}
                  </AnimatePresenceComponent>
                </div>
              </div>
            </div>
          </div>
        </div>
        {themeMode === 'liquid' && (
          <div className="absolute top-full left-0 right-0 h-16 bg-gradient-to-b from-[#05050a] to-transparent pointer-events-none" />
        )}
      </header>

      <main className="max-w-7xl mx-auto px-6 py-4">
        {/* Headers Row */}
        <MotionDiv 
          variants={revealContainer}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-end"
        >
          <MotionDiv variants={revealItemLeft} className="lg:col-span-5 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 neu-flat rounded-xl flex items-center justify-center text-blue-500">
                <Scan className="w-5 h-5" />
              </div>
              <h2 className={cn("text-xl font-bold tracking-tight", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748] dark:text-white")}>{t.title}</h2>
            </div>
            <p className={cn("text-sm max-w-md ml-[52px]", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white/80" : "text-[#718096] dark:text-gray-400")}>
              {t.subtitle}
            </p>
          </MotionDiv>
          <div className="lg:col-span-2"></div>
          <MotionDiv variants={revealItemRight} className="lg:col-span-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 neu-flat rounded-xl flex items-center justify-center text-orange-500">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className={cn("font-bold text-xl", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748] dark:text-white")}>
                  {activeTab === 'prompt' ? "Prompt Girişi" : "JSON Çıktısı"}
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3 w-full">
                <button
                  onClick={() => setActiveTab('prompt')}
                  className={cn("h-10 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold w-full", activeTab === 'prompt' ? "neu-pressed text-blue-600" : "neu-flat text-[#4a5568] hover:text-blue-500")}
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden xl:inline">Prompt Girişi</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('json');
                    if (!result && image && !isAnalyzing) {
                      analyzeImage();
                    }
                  }}
                  className={cn("h-10 rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold w-full", activeTab === 'json' ? "neu-pressed text-blue-600" : "neu-flat text-[#4a5568] hover:text-blue-500")}
                >
                  <Code className="w-4 h-4" />
                  <span className="hidden xl:inline">JSON Kodu</span>
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={activeTab === 'prompt' ? !userPrompt : !result}
                  className="h-10 neu-flat text-[#4a5568] hover:text-blue-500 active:neu-pressed rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden xl:inline">{copied ? t.copied : t.copy}</span>
                </button>
              </div>
            </div>
          </MotionDiv>
        </MotionDiv>

        <MotionDiv 
          variants={revealContainer}
          initial="hidden"
          animate="show"
          exit="exit"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        >
          
          {/* Bento Item 1: Upload/Preview (Left) */}
          <MotionDiv variants={revealItemLeft} className="lg:col-span-5 space-y-6">
            <AnimatePresenceComponent mode="wait">
              {!image ? (
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  {...getRootProps()}
                  className={cn(
                    "relative group cursor-pointer h-[500px] rounded-3xl transition-all duration-300 flex flex-col items-center justify-center gap-4 overflow-hidden",
                    isDragActive 
                      ? "neu-pressed border-2 border-blue-400" 
                      : "neu-flat hover:neu-pressed"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="w-16 h-16 rounded-2xl neu-flat flex items-center justify-center group-hover:scale-110 transition-transform duration-500 text-blue-500">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#4a5568]">{t.dragDrop}</p>
                    <p className="text-xs text-[#718096] mt-1">{t.orClick}</p>
                  </div>
                </MotionDiv>
              ) : (
                <MotionDiv
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative h-[500px] rounded-3xl overflow-hidden neu-flat p-4 group"
                >
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-transparent relative">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-6 left-6 right-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <label className="flex-1 h-12 glass-panel bg-white/20 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/40 dark:border-white/20 shadow-2xl backdrop-blur-2xl cursor-pointer">
                        <Upload className="w-5 h-5" />
                        Görseli Değiştir
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setImage(reader.result as string);
                              setResult(null);
                              setSelectedSuggestions({});
                              setError(null);
                              setUserPrompt('');
                            };
                            reader.readAsDataURL(file);
                          }
                        }} />
                      </label>
                      <button
                        onClick={reset}
                        disabled={isAnalyzing}
                        className="w-12 h-12 glass-panel bg-white/20 dark:bg-white/10 text-red-500 rounded-xl flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 border border-white/40 dark:border-white/20 shadow-2xl backdrop-blur-2xl"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </MotionDiv>
              )}
            </AnimatePresenceComponent>

            {error && (
              <div className="p-4 neu-pressed rounded-2xl text-red-500 text-sm flex items-center gap-3 font-medium">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </div>
            )}
          </MotionDiv>

          {/* Bento Item 2: Stats (Middle - Vertical) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <AnimatePresenceComponent>
              {result && (
                <MotionDiv 
                  variants={revealContainer}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col gap-4"
                >
                  <MotionDiv variants={revealItem} className="neu-flat p-4 rounded-2xl flex flex-col items-center gap-2 group hover:neu-pressed transition-all text-center">
                    <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white/70" : "text-[#718096] dark:text-gray-500")}>{t.angle}</p>
                      <p className={cn("text-xs font-bold", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748] dark:text-white")}>{result.camera.angle}</p>
                    </div>
                  </MotionDiv>
                  <MotionDiv variants={revealItem} className="neu-flat p-4 rounded-2xl flex flex-col items-center gap-2 group hover:neu-pressed transition-all text-center">
                    <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                      <Sun className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white/70" : "text-[#718096] dark:text-gray-500")}>{t.light}</p>
                      <p className={cn("text-xs font-bold", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748] dark:text-white")}>{result.lighting.quality}</p>
                    </div>
                  </MotionDiv>
                  <MotionDiv variants={revealItem} className="neu-flat p-4 rounded-2xl flex flex-col items-center gap-2 group hover:neu-pressed transition-all text-center">
                    <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white/70" : "text-[#718096] dark:text-gray-500")}>{t.ethnicity}</p>
                      <p className={cn("text-xs font-bold", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748] dark:text-white")}>{result.subject.ethnicity}</p>
                    </div>
                  </MotionDiv>
                  <MotionDiv variants={revealItem} className="neu-flat p-4 rounded-2xl flex flex-col items-center gap-2 group hover:neu-pressed transition-all text-center">
                    <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                      <Layout className="w-5 h-5" />
                    </div>
                    <div>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white/70" : "text-[#718096] dark:text-gray-500")}>{t.style}</p>
                      <p className={cn("text-xs font-bold", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748] dark:text-white")}>{result.technical.style}</p>
                    </div>
                  </MotionDiv>
                </MotionDiv>
              )}
            </AnimatePresenceComponent>
          </div>

          {/* Bento Item 3: JSON Output (Right) */}
          <MotionDiv variants={revealItemRight} className="lg:col-span-5 flex flex-col space-y-6">
            <div className="relative h-[500px] rounded-3xl neu-flat overflow-hidden flex flex-col">
              {activeTab === 'prompt' ? (
                <div className="flex-1 relative flex flex-col p-4">
                  <div 
                    ref={promptScrollRef}
                    className="absolute inset-0 p-4 text-sm leading-relaxed font-sans whitespace-pre-wrap pointer-events-none break-words overflow-y-auto custom-scrollbar"
                    style={{ color: 'transparent' }}
                    dangerouslySetInnerHTML={{ __html: highlightText(userPrompt, Object.values(selectedSuggestions)) }}
                  />
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    onScroll={(e) => {
                      if (promptScrollRef.current) {
                        promptScrollRef.current.scrollTop = e.currentTarget.scrollTop;
                        promptScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
                      }
                    }}
                    placeholder="Analiz yaparsanız burada gözükecek veya kendi promptunuzu da buraya yazabilirsiniz..."
                    className="absolute inset-0 w-full h-full bg-transparent resize-none focus:outline-none text-sm leading-relaxed font-sans p-4 text-[#2d3748] dark:text-gray-300 custom-scrollbar"
                    style={{ color: 'inherit', background: 'transparent' }}
                  />
                  {/* Magic Wand Button */}
                  <button
                    onClick={enhanceMainPrompt}
                    disabled={isEnhancingMainPrompt || !userPrompt.trim()}
                    className="absolute top-4 right-4 p-2 neu-flat text-blue-500 rounded-xl hover:text-blue-600 active:neu-pressed transition-all disabled:opacity-50 z-10"
                    title="Promptu Yapay Zeka ile Geliştir"
                  >
                    {isEnhancingMainPrompt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  </button>
                </div>
              ) : (
                <>
                  {!result && !isAnalyzing && (
                    <div className="flex-1 flex flex-col items-center justify-center text-[#718096] dark:text-gray-400 p-12 text-center">
                      <div className="w-12 h-12 rounded-full neu-pressed flex items-center justify-center mb-4 text-orange-500">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium">{t.resultsPlaceholder}</p>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 space-y-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-[#e6e9f0] dark:border-gray-800 border-t-blue-500 animate-spin shadow-lg" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 animate-pulse" />
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-sm font-bold text-[#2d3748] dark:text-white">{t.processing}</p>
                        <p className="text-xs text-[#718096] dark:text-gray-400">{t.aiDetails}</p>
                      </div>
                    </div>
                  )}

                  {result && (
                    <div className="flex-1 relative flex flex-col p-6 font-mono text-[11px] leading-relaxed">
                      <div 
                        ref={jsonScrollRef}
                        className="absolute inset-0 p-6 whitespace-pre-wrap pointer-events-none break-words overflow-y-auto custom-scrollbar"
                        style={{ color: 'transparent' }}
                        dangerouslySetInnerHTML={{ __html: highlightText(jsonText, getChangedValues(result, initialResult)) }}
                      />
                      <textarea
                        value={jsonText}
                        onChange={(e) => {
                           setJsonText(e.target.value);
                           try { setResult(JSON.parse(e.target.value)); } catch(e) {}
                        }}
                        onScroll={(e) => {
                          if (jsonScrollRef.current) {
                            jsonScrollRef.current.scrollTop = e.currentTarget.scrollTop;
                            jsonScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
                          }
                        }}
                        className="absolute inset-0 w-full h-full bg-transparent resize-none focus:outline-none text-[#4a5568] dark:text-gray-300 custom-scrollbar p-6"
                        style={{ color: 'inherit', background: 'transparent' }}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Empty Prompt Warning Overlay */}
              {showEmptyPromptWarning && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-3xl">
                  <div className="neu-base p-6 rounded-2xl max-w-sm text-center space-y-4 shadow-2xl">
                    <p className="text-sm font-bold text-[#2d3748] dark:text-white">
                      Prompt girişi yapmalısınız veya rastgele üretim yapılmasını ister misiniz?
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => setShowEmptyPromptWarning(false)} className="px-4 py-2 neu-flat rounded-xl text-xs font-bold text-[#718096] hover:text-[#2d3748] transition-colors">
                        Prompt Gir
                      </button>
                      <button onClick={() => { setShowEmptyPromptWarning(false); generateRandomImage(); }} className="px-4 py-2 neu-flat rounded-xl text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">
                        Rastgele Üret
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Input Area */}
              <div className="p-4 border-t border-[#c8cbd2]/20 dark:border-gray-800 flex gap-2 flex-shrink-0 bg-white/10">
                <div className="flex-1 relative flex items-center">
                  <input
                    type="text"
                    value={bottomInput}
                    onChange={(e) => setBottomInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleBottomSubmit()}
                    placeholder="Buraya yazın veya konuşun..."
                    className="w-full bg-transparent neu-pressed rounded-xl pl-4 pr-10 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                  <button
                    onClick={toggleBottomListening}
                    className={cn(
                      "absolute right-2 p-1.5 rounded-full transition-all",
                      isBottomListening ? "bg-red-500 text-white animate-pulse" : "text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"
                    )}
                  >
                    {isBottomListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  onClick={() => {
                    setUserPrompt("");
                    setBottomInput("");
                    setSelectedSuggestions({});
                    if (initialResult) {
                      setResult(initialResult);
                      setJsonText(JSON.stringify(initialResult, null, 2));
                    }
                  }}
                  className="px-3 py-2 neu-flat text-red-500 font-bold rounded-xl hover:neu-pressed transition-all text-xs flex items-center justify-center"
                  title="Sıfırla"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleBottomSubmit}
                  className="px-3 py-2 neu-flat text-blue-600 font-bold rounded-xl hover:neu-pressed transition-all text-xs"
                >
                  Gönder
                </button>
                <button
                  onClick={upgradeToHyperRealistic}
                  disabled={isUpgrading || isGeneratingImage || isAnalyzing || !result}
                  className="px-3 py-2 neu-flat text-purple-600 font-bold rounded-xl hover:neu-pressed transition-all flex items-center justify-center disabled:opacity-50"
                  title={t.upgrade}
                >
                  {isUpgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    if (activeTab === 'prompt' && !userPrompt.trim() && !bottomInput.trim()) {
                      setShowEmptyPromptWarning(true);
                    } else {
                      const promptToUse = activeTab === 'prompt' ? (userPrompt + " " + bottomInput) : jsonText;
                      handleGenerateFromBottom(promptToUse);
                    }
                  }}
                  disabled={isGeneratingImage}
                  className="px-3 py-2 neu-flat text-green-600 font-bold rounded-xl hover:neu-pressed transition-all text-xs flex items-center gap-1 disabled:opacity-50"
                >
                  {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  {isGeneratingImage ? 'Üretiliyor...' : 'Oluştur'}
                </button>
              </div>
            </div>
          </MotionDiv>

          {/* Bento Item 4: Suggestions & AI Chat (Side-by-Side) */}
          {image && (
            <MotionDiv variants={revealItem} className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Suggestions */}
              <div className="neu-flat rounded-3xl overflow-hidden flex flex-col h-[450px]">
                <div className="p-6 border-b border-[#c8cbd2]/20 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-blue-500" />
                    <h4 className={cn("text-sm font-bold uppercase tracking-wider", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748] dark:text-white")}>{t.suggestions}</h4>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white/40 dark:bg-black/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.entries(result ? result.suggestions : {
                      lighting: ["Cinematic lighting", "Neon lights", "Golden hour", "Studio lighting"],
                      cameraAngle: ["Close up", "Wide angle", "Eye level", "Low angle"],
                      style: ["Hyper-realistic", "Cyberpunk", "Vintage film", "Anime style"]
                    }).map(([key, options]) => (
                      <div key={key} className="space-y-3">
                        <label className={cn("text-[10px] font-bold uppercase tracking-widest ml-1", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white/70" : "text-[#718096] dark:text-gray-500")}>
                          {currentSuggestionLabels[key as keyof typeof currentSuggestionLabels] || key}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {options.map((option) => (
                            <button
                              key={option}
                              onClick={() => {
                                if (activeTab === 'prompt') {
                                  setUserPrompt(prev => prev + (prev ? ", " : "") + option);
                                } else {
                                  setSelectedSuggestions(prev => ({
                                    ...prev,
                                    [key]: prev[key] === option ? undefined : option
                                  }));
                                }
                              }}
                              className={cn(
                                "px-3 py-2 rounded-xl text-[11px] font-bold transition-all",
                                selectedSuggestions[key] === option
                                  ? "neu-pressed text-blue-600 dark:text-blue-400"
                                  : "neu-flat text-[#4a5568] dark:text-gray-300 hover:text-blue-500"
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        {key === 'clothing' && (
                          <div className="flex items-center gap-3 mt-3 p-2 neu-flat rounded-xl border border-white/5">
                            <input
                              type="color"
                              ref={clothingColorRef}
                              onChange={(e) => setSelectedSuggestions(prev => ({
                                ...prev,
                                clothingColor: e.target.value
                              }))}
                              className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                            />
                            <span className={cn("text-[10px] font-bold uppercase tracking-widest", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white/70" : "text-[#718096] dark:text-gray-500")}>
                              {t.clothingColor}
                            </span>
                            {selectedSuggestions.clothingColor && (
                              <button
                                onClick={() => setSelectedSuggestions(prev => {
                                  const next = { ...prev };
                                  delete next.clothingColor;
                                  if (clothingColorRef.current) clothingColorRef.current.value = '#000000';
                                  return next;
                                })}
                                className="ml-auto text-[9px] text-red-500 hover:text-red-600 font-bold uppercase tracking-widest"
                              >
                                {t.cancel}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {Object.values(selectedSuggestions).some(v => v !== undefined) && (
                    <div className="mt-8 pt-8 border-t border-[#c8cbd2]/20 flex justify-center">
                      <button
                        onClick={reviseAnalysis}
                        disabled={isRevising}
                        className="w-full h-12 neu-flat text-blue-600 hover:text-blue-700 active:neu-pressed text-xs font-bold rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                      >
                        {isRevising ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        {isRevising ? t.revising : t.revisePrompt}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Chat */}
              <div className="neu-flat rounded-3xl overflow-hidden flex flex-col h-[450px]">
                <div className="p-6 border-b border-[#c8cbd2]/20 dark:border-gray-800 flex items-center gap-2 flex-shrink-0">
                  <div className="w-10 h-10 neu-flat rounded-xl flex items-center justify-center text-yellow-500">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className={cn("text-sm font-bold uppercase tracking-wider", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748] dark:text-white")}>{t.chatTitle}</h4>
                  {chatMessages.length > 0 && (
                    <button 
                      onClick={() => setChatMessages([])} 
                      className={cn("ml-auto text-[10px] hover:text-red-500 font-bold uppercase tracking-widest transition-colors", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white/70" : "text-[#718096]")}
                    >
                      Temizle
                    </button>
                  )}
                </div>
                
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-white/20 dark:bg-black/10">
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-50">
                      <div className="w-16 h-16 rounded-full neu-pressed flex items-center justify-center text-blue-500">
                        <Wand2 className="w-8 h-8" />
                      </div>
                      <p className={cn("text-sm max-w-xs", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white/80" : "text-[#718096]")}>{t.chatContext}</p>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <MotionDiv
                      key={idx}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={cn(
                        "flex flex-col max-w-[85%] space-y-1",
                        msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                      )}
                    >
                      <div className={cn(
                        "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                        msg.role === 'user' 
                          ? "bg-blue-600 text-white rounded-tr-none" 
                          : cn("neu-flat rounded-tl-none border border-white/5", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white" : "text-[#2d3748] dark:text-gray-200")
                      )}>
                        {msg.text}
                      </div>
                    </MotionDiv>
                  ))}
                  {isChatLoading && (
                    <div className={cn("flex items-center gap-3 ml-2", (themeMode === 'liquid' || themeMode === 'beta') ? "text-white/70" : "text-[#718096]")}>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t.aiDetails}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-[#c8cbd2]/20 dark:border-gray-800 flex gap-3 flex-shrink-0">
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && askAI()}
                      placeholder={isListening ? (language === 'TR' ? "Dinleniyor..." : "Listening...") : t.chatPlaceholder}
                      className="w-full bg-transparent neu-pressed rounded-2xl pl-6 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                    />
                    <button
                      onClick={toggleListening}
                      className={cn(
                        "absolute right-3 p-1.5 rounded-full transition-all",
                        isListening ? "bg-red-500 text-white animate-pulse" : "text-gray-400 hover:text-blue-500 hover:bg-blue-500/10"
                      )}
                      title={language === 'TR' ? "Sesli Asistan" : "Voice Assistant"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={askAI}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="px-4 py-3 neu-flat text-blue-600 font-bold rounded-2xl hover:neu-pressed disabled:opacity-50 transition-all flex items-center gap-2 group"
                  >
                    <RefreshCw className={cn("w-4 h-4 group-hover:rotate-180 transition-transform duration-500", isChatLoading && "animate-spin")} />
                  </button>
                </div>
              </div>
            </MotionDiv>
          )}

          {/* Generated Image Preview Card */}
          <AnimatePresenceComponent>
            {generatedImageUrl && (
              <MotionDiv variants={revealItem} className="lg:col-span-12">
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="relative group rounded-3xl neu-flat overflow-hidden p-4"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2 aspect-square rounded-2xl overflow-hidden relative group/img">
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 px-4 py-2 glass-panel rounded-full text-[10px] font-bold text-[#2d3748] dark:text-white uppercase tracking-wider shadow-sm">
                        {t.generatedImageBadge}
                      </div>
                      <a 
                        href={generatedImageUrl} 
                        download="generated.png" 
                        className="absolute bottom-4 right-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-lg hover:bg-blue-700"
                        title="İndir"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="md:w-1/2 flex flex-col justify-center space-y-6 p-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-[#2d3748]">Varyasyon Hazır!</h3>
                        <p className="text-[#718096] text-sm">AI tarafından oluşturulan yeni görseliniz yukarıdaki kriterlere göre optimize edildi.</p>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setIsModalOpen(true)}
                          className="flex-1 h-12 neu-flat text-blue-600 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:text-blue-700 active:neu-pressed transition-all"
                        >
                          <Maximize2 className="w-4 h-4" />
                          {t.enlarge}
                        </button>
                        <button
                          onClick={() => setGeneratedImageUrl(null)}
                          className="w-12 h-12 neu-flat text-red-500 rounded-xl flex items-center justify-center hover:text-red-600 active:neu-pressed transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              </MotionDiv>
            )}
          </AnimatePresenceComponent>

        </MotionDiv>
      </main>

      {/* Footer */}
      <footer className="mt-24 py-12 neu-flat">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-[#718096] font-bold text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            {t.footerPowered}
          </div>
          <div className="text-[#a0aec0] font-medium text-xs">
            {t.footerRights}
          </div>
        </div>
      </footer>

      <AnimatePresenceComponent>
        {generatedImageUrl && isModalOpen && (
          <GeneratedImageModal url={generatedImageUrl} onClose={() => setIsModalOpen(false)} t={t} referenceImage={image} />
        )}
      </AnimatePresenceComponent>

      <AnimatePresenceComponent>
        {generatedImageUrl && isPoseComparisonOpen && poseScreenshot && (
          <PoseComparisonModal 
            generatedUrl={generatedImageUrl} 
            poseUrl={poseScreenshot} 
            onClose={() => setIsPoseComparisonOpen(false)} 
            t={t}
            image={image}
            onImageUpload={setImage}
            onRetry={(useReference) => {
              if (lastPoseData) {
                generateFromPoseStudio({ ...lastPoseData, useReference });
              }
            }}
          />
        )}
      </AnimatePresenceComponent>

      {/* Loading Indicator Pill */}
      <AnimatePresenceComponent>
        {isGeneratingImage && (
          <MotionDiv
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[200] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl font-bold text-sm pointer-events-none bg-blue-600 text-white"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <div className="relative overflow-hidden h-5 min-w-[200px]">
              <AnimatePresenceComponent mode="wait">
                <MotionDiv
                  key={loadingText}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 whitespace-nowrap"
                >
                  {loadingText}
                </MotionDiv>
              </AnimatePresenceComponent>
            </div>
          </MotionDiv>
        )}
      </AnimatePresenceComponent>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
        <AnimatePresenceComponent>
          {toasts.map(toast => (
            <MotionDiv
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl font-bold text-sm pointer-events-auto",
                toast.type === 'success' ? "bg-green-500 text-white" :
                toast.type === 'error' ? "bg-red-500 text-white" :
                "bg-blue-500 text-white"
              )}
            >
              {toast.type === 'success' && <Check className="w-4 h-4" />}
              {toast.type === 'error' && <X className="w-4 h-4" />}
              {toast.type === 'info' && <Sparkles className="w-4 h-4" />}
              {toast.message}
            </MotionDiv>
          ))}
        </AnimatePresenceComponent>
      </div>

      <PoseStudioModal 
        isOpen={isPoseStudioOpen} 
        onClose={() => setIsPoseStudioOpen(false)} 
        image={image}
        onImageUpload={setImage}
        onGenerate={generateFromPoseStudio}
        onTranslatePrompt={translatePromptToTurkish}
        onEnhancePrompt={enhancePromptWithAI}
        onGetAITip={getAITip}
      />

      {/* Influencer Studio Modal */}
      <AnimatePresenceComponent>
        {isStudioOpen && result && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
            style={{ backgroundColor: 'color-mix(in srgb, var(--bg-base) 80%, transparent)' }}
          >
            <MotionDiv
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="neu-base w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-[20px_20px_60px_#c8cbd2,-20px_-20px_60px_#ffffff] dark:shadow-[10px_10px_30px_#121418,-10px_-10px_30px_#2a2e39]"
            >
              {/* Modal Header */}
              <div className="p-6 neu-flat flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 neu-pressed rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#2d3748]">{t.studioTitle}</h3>
                    <p className="text-xs font-medium text-[#718096]">Karakter DNA'sını koruyarak yeni varyasyonlar üretin</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsStudioOpen(false)}
                  className="w-12 h-12 rounded-xl neu-flat hover:text-red-500 active:neu-pressed flex items-center justify-center text-[#718096] transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-auto p-4 sm:p-8 grid lg:grid-cols-5 gap-8 neu-base">
                {/* Controls - 2 Columns */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Generation Method Selector */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                      <ImageIcon className="w-4 h-4 text-orange-500" />
                      <h3 className="text-sm font-bold text-[#2d3748]">{t.genMethod}</h3>
                    </div>
                    <div className="flex p-1.5 neu-pressed rounded-xl">
                      <button 
                        onClick={() => setGenerationMethod('reference')}
                        className={cn(
                          "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                          generationMethod === 'reference' ? "neu-flat text-blue-600" : "text-[#718096] hover:text-[#4a5568]"
                        )}
                      >
                        {t.reference}
                      </button>
                      <button 
                        onClick={() => setGenerationMethod('text')}
                        className={cn(
                          "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                          generationMethod === 'text' ? "neu-flat text-blue-600" : "text-[#718096] hover:text-[#4a5568]"
                        )}
                      >
                        {t.textPrompt}
                      </button>
                    </div>
                  </div>

                  {/* Mode Selector */}
                  <div className="flex p-1.5 neu-pressed rounded-xl">
                    <button 
                      onClick={() => setStudioMode('single')}
                      className={cn(
                        "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                        studioMode === 'single' ? "neu-flat text-green-600" : "text-[#718096] hover:text-[#4a5568]"
                      )}
                    >
                      {t.single}
                    </button>
                    <button 
                      onClick={() => setStudioMode('batch')}
                      className={cn(
                        "flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all",
                        studioMode === 'batch' ? "neu-flat text-green-600" : "text-[#718096] hover:text-[#4a5568]"
                      )}
                    >
                      {t.batch}
                    </button>
                  </div>

                  {studioMode === 'single' ? (
                    <div className="grid grid-cols-2 gap-4">
                      <StudioControl 
                        label={t.suggestionLabels.pose} 
                        value={studioConfig.pose} 
                        options={STUDIO_OPTIONS.pose}
                        onChange={(v) => setStudioConfig(prev => ({ ...prev, pose: v }))}
                      />
                      <StudioControl 
                        label={t.suggestionLabels.background} 
                        value={studioConfig.environment} 
                        options={STUDIO_OPTIONS.environment}
                        onChange={(v) => setStudioConfig(prev => ({ ...prev, environment: v }))}
                      />
                      <StudioControl 
                        label={t.suggestionLabels.clothing} 
                        value={studioConfig.outfit} 
                        options={STUDIO_OPTIONS.outfit}
                        onChange={(v) => setStudioConfig(prev => ({ ...prev, outfit: v }))}
                      />
                      <StudioControl 
                        label={t.suggestionLabels.cameraAngle} 
                        value={studioConfig.camera} 
                        options={STUDIO_OPTIONS.camera}
                        onChange={(v) => setStudioConfig(prev => ({ ...prev, camera: v }))}
                      />
                      <StudioControl 
                        label={t.suggestionLabels.lighting} 
                        value={studioConfig.lighting} 
                        options={STUDIO_OPTIONS.lighting}
                        onChange={(v) => setStudioConfig(prev => ({ ...prev, lighting: v }))}
                      />
                      <StudioControl 
                        label={t.action} 
                        value={studioConfig.action} 
                        options={STUDIO_OPTIONS.action}
                        onChange={(v) => setStudioConfig(prev => ({ ...prev, action: v }))}
                      />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Batch Mode Selector */}
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setBatchMode('template')}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                            batchMode === 'template' ? "neu-pressed text-blue-600" : "neu-flat text-[#718096] hover:text-[#4a5568]"
                          )}
                        >
                          {t.template}
                        </button>
                        <button 
                          onClick={() => setBatchMode('manual')}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-xs font-bold transition-all",
                            batchMode === 'manual' ? "neu-pressed text-blue-600" : "neu-flat text-[#718096] hover:text-[#4a5568]"
                          )}
                        >
                          {t.manual}
                        </button>
                      </div>

                      {batchMode === 'template' ? (
                        <div className="grid grid-cols-2 gap-3">
                          {BATCH_TEMPLATES.map(template => (
                            <button
                              key={template.name}
                              onClick={() => setSelectedTemplate(template.name)}
                              className={cn(
                                "p-4 rounded-xl text-left transition-all",
                                selectedTemplate === template.name ? "neu-pressed border-blue-500/50" : "neu-flat hover:border-[#cbd5e0]"
                              )}
                            >
                              <p className={cn("text-xs font-bold", selectedTemplate === template.name ? "text-blue-600" : "text-[#2d3748]")}>{template.name}</p>
                              <p className="text-[10px] text-[#718096] mt-1">4 farklı varyasyon</p>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {manualSlots.map((slot, index) => (
                            <div key={index} className="space-y-2">
                              <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1">{index + 1}. Seçenek</label>
                              <select 
                                value={slot}
                                onChange={(e) => {
                                  const newSlots = [...manualSlots];
                                  newSlots[index] = e.target.value;
                                  setManualSlots(newSlots);
                                }}
                                className="w-full h-11 neu-flat rounded-xl px-4 text-xs text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                              >
                                {MANUAL_CATEGORIES.map(cat => (
                                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    {studioMode === 'single' ? (
                      <>
                        <button
                          onClick={() => generateInfluencerVariation()}
                          disabled={isStudioGenerating}
                          className="w-full h-12 neu-flat text-blue-600 font-bold rounded-xl flex items-center justify-center gap-3 transition-all active:neu-pressed disabled:opacity-50"
                        >
                          {isStudioGenerating && !studioPrompt ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Sparkles className="w-5 h-5" />
                          )}
                          {t.createPrompt}
                        </button>

                        {studioPrompt && (
                          <div className="space-y-3">
                            <div className="p-4 neu-pressed rounded-2xl space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest">{t.generatedDNAPrompt}</p>
                                <button 
                                  onClick={() => setStudioPrompt(null)}
                                  className="text-[10px] text-red-500 hover:text-red-600 font-bold uppercase"
                                >
                                  {t.clear}
                                </button>
                              </div>
                              <textarea
                                value={studioPrompt}
                                onChange={(e) => setStudioPrompt(e.target.value)}
                                className="w-full h-32 bg-transparent text-xs text-[#4a5568] leading-relaxed italic resize-none focus:outline-none focus:ring-1 focus:ring-blue-500/30 rounded-lg p-1"
                              />
                            </div>
                            <button
                              onClick={() => generateInfluencerVariation(studioPrompt)}
                              disabled={isStudioGenerating}
                              className="w-full h-14 neu-flat text-green-600 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:neu-pressed disabled:opacity-50"
                            >
                              {isStudioGenerating ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                              ) : (
                                <Zap className="w-6 h-6" />
                              )}
                              {isStudioGenerating ? t.generatingImage : t.generateImageBtn}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={generateBatchVariations}
                        disabled={isStudioGenerating}
                        className="w-full h-14 neu-flat text-green-600 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all active:neu-pressed disabled:opacity-50"
                      >
                        {isStudioGenerating ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <Sparkles className="w-6 h-6" />
                        )}
                        {isStudioGenerating ? `${currentBatchIndex + 1}/4 ${t.generatingVariation}` : t.generateVariations}
                      </button>
                    )}
                  </div>
                </div>

                {/* Preview Area - 3 Columns for Side-by-Side */}
                <div className="lg:col-span-3">
                  {studioMode === 'single' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Original Reference */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1">Orijinal Referans</p>
                        <div className="relative aspect-square rounded-3xl neu-pressed overflow-hidden p-2">
                          <img 
                            src={image!} 
                            alt="Original Reference" 
                            className="w-full h-full object-cover rounded-2xl opacity-80 grayscale-[0.2]"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="px-4 py-2 glass-panel rounded-full text-[10px] font-bold text-[#2d3748] dark:text-white uppercase tracking-wider shadow-sm">
                              DNA Kaynağı
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* New Variation */}
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest ml-1">Yeni Varyasyon</p>
                        <div className="relative aspect-square rounded-3xl neu-flat overflow-hidden flex items-center justify-center group p-2">
                          {studioImageUrl ? (
                            <>
                              <img 
                                src={studioImageUrl} 
                                alt="Studio Variation" 
                                className="w-full h-full object-cover rounded-2xl"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute bottom-6 left-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                                <a 
                                  href={studioImageUrl} 
                                  download="influencer-variation.png"
                                  className="flex-1 h-12 neu-flat text-blue-600 font-bold rounded-xl flex items-center justify-center gap-2 hover:text-blue-700 active:neu-pressed transition-all"
                                >
                                  İndir
                                </a>
                              </div>
                            </>
                          ) : (
                            <div className="text-center space-y-4 p-8">
                              {isStudioGenerating ? (
                                <div className="space-y-4">
                                  <div className="w-12 h-12 rounded-full border-4 border-[#e6e9f0] border-t-green-500 animate-spin mx-auto shadow-lg" />
                                  <p className="text-xs text-[#718096] font-medium">{t.generatingVariation}</p>
                                </div>
                              ) : (
                                <>
                                  <div className="w-16 h-16 rounded-2xl neu-pressed flex items-center justify-center mx-auto">
                                    <Sparkles className="w-8 h-8 text-[#a0aec0]" />
                                  </div>
                                  <p className="text-xs text-[#718096] max-w-[180px] mx-auto font-medium">{t.studioPreviewPlaceholder}</p>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] font-bold text-[#718096] uppercase tracking-widest">{t.batchResults}</p>
                        <div className="flex items-center gap-2">
                          {isStudioGenerating && (
                            <div className="flex items-center gap-2 mr-2">
                              <Loader2 className="w-3 h-3 animate-spin text-green-500" />
                              <span className="text-[10px] text-[#718096] font-bold uppercase">{currentBatchIndex + 1} / 4</span>
                            </div>
                          )}
                          {studioImages.length === 4 && studioImages.every(img => img !== null) && !isStudioGenerating && (
                            <>
                              <button 
                                onClick={generateBatchVariations} 
                                className="px-3 py-1.5 neu-flat text-blue-600 hover:text-blue-700 active:neu-pressed text-[10px] font-bold rounded-lg flex items-center gap-1.5 transition-all"
                              >
                                <RefreshCw className="w-3 h-3" /> {t.retry}
                              </button>
                              <button 
                                onClick={downloadAllBatchImages} 
                                className="px-3 py-1.5 neu-flat text-green-600 hover:text-green-700 active:neu-pressed text-[10px] font-bold rounded-lg flex items-center gap-1.5 transition-all"
                              >
                                <Download className="w-3 h-3" /> {t.downloadAll}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Original Reference */}
                        <div className="sm:col-span-1 flex flex-col">
                          <div className="relative w-full aspect-square sm:aspect-auto sm:flex-1 rounded-2xl neu-pressed overflow-hidden p-2">
                            <img 
                              src={image!} 
                              alt="Original Reference" 
                              className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] object-cover rounded-xl opacity-80 grayscale-[0.2]"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="px-3 py-1 glass-panel rounded-full text-[10px] font-bold text-[#2d3748] dark:text-white uppercase tracking-wider shadow-sm">
                                DNA Kaynağı
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 4 Variations */}
                        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                          {[0, 1, 2, 3].map(i => (
                            <div key={i} className="relative aspect-square rounded-2xl neu-flat overflow-hidden group p-1.5">
                              {studioImages[i] ? (
                                <>
                                  <img 
                                    src={studioImages[i]!} 
                                    alt={`Variation ${i + 1}`} 
                                    className="w-full h-full object-cover rounded-xl"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div 
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl"
                                    style={{ backgroundColor: 'color-mix(in srgb, var(--bg-base) 40%, transparent)' }}
                                  >
                                    <a 
                                      href={studioImages[i]!} 
                                      download={`variation-${i + 1}.png`}
                                      className="w-10 h-10 neu-flat text-blue-600 rounded-full flex items-center justify-center hover:text-blue-700 active:neu-pressed transition-all"
                                    >
                                      <Download className="w-5 h-5" />
                                    </a>
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {isStudioGenerating && currentBatchIndex === i ? (
                                    <div className="w-8 h-8 rounded-full border-2 border-[#e6e9f0] border-t-green-500 animate-spin shadow-sm" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-xl neu-pressed flex items-center justify-center">
                                      <ImageIcon className="w-4 h-4 text-[#a0aec0]" />
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="absolute top-3 left-3 px-2 py-0.5 glass-panel rounded-md text-[8px] font-bold text-[#2d3748] dark:text-white uppercase shadow-sm">
                                Poz {i + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </MotionDiv>
          </div>
        )}
      </AnimatePresenceComponent>
    </MotionDiv>
  );
}

function StudioControl({ label, value, options, onChange }: { label: string, value: string, options: string[], onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-[#718096] uppercase tracking-widest ml-1">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 neu-flat rounded-xl px-4 text-xs text-[#4a5568] focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function GeneratedImageModal({ url, onClose, t, referenceImage }: { url: string, onClose: () => void, t: any, referenceImage?: string | null }) {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 backdrop-blur-md cursor-zoom-out"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg-base) 90%, transparent)' }}
    >
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className={`relative flex flex-col neu-base rounded-2xl sm:rounded-3xl overflow-hidden shadow-[20px_20px_60px_#c8cbd2,-20px_-20px_60px_#ffffff] dark:shadow-[10px_10px_30px_#121418,-10px_-10px_30px_#2a2e39] cursor-default ${referenceImage ? 'p-4 sm:p-8 w-full max-w-6xl h-[90vh]' : 'p-2 sm:p-4'}`}
        style={!referenceImage ? { width: 'min(90vw, 90vh)', height: 'min(90vw, 90vh)' } : {}}
      >
        {referenceImage ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6 text-[#2d3748] dark:text-white">Üretilen Görsel</h2>
            <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
              <div className="flex-1 flex flex-col gap-3">
                <h3 className="font-bold text-center text-[#718096] dark:text-gray-500 uppercase tracking-widest text-sm">Referans</h3>
                <div className="flex-1 neu-pressed rounded-2xl overflow-hidden p-2 relative">
                  <img src={referenceImage} alt="Reference" className="w-full h-full object-contain rounded-xl" />
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <h3 className="font-bold text-center text-blue-500 uppercase tracking-widest text-sm">Üretilen Görsel</h3>
                <div className="flex-1 neu-flat rounded-2xl overflow-hidden p-2 relative">
                  <img src={url} alt="Generated" className="w-full h-full object-contain rounded-xl" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
            {/* Download Button */}
            <div className="mt-6 flex justify-end">
              <a 
                href={url} 
                download="generated.png" 
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
              >
                <Download className="w-4 h-4" />
                İndir
              </a>
            </div>
          </>
        ) : (
          <>
            <img src={url} alt="Generated" className="w-full h-full object-contain rounded-xl sm:rounded-2xl" referrerPolicy="no-referrer" />
            <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-6 glass-panel rounded-xl sm:rounded-2xl">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-[#2d3748] dark:text-white font-bold text-lg sm:text-xl tracking-tight">{t.generatedImageTitle}</p>
                  <p className="text-[#718096] dark:text-[#94a3b8] text-xs sm:text-sm max-w-md font-medium hidden sm:block">{t.generatedImageDesc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href={url} 
                    download="generated.png" 
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25 text-xs sm:text-sm"
                  >
                    <Download className="w-4 h-4" />
                    İndir
                  </a>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 sm:px-6 sm:py-3 neu-flat text-[#4a5568] dark:text-[#94a3b8] hover:text-red-500 dark:hover:text-red-400 active:neu-pressed rounded-xl text-xs sm:text-sm font-bold transition-all"
                  >
                    {t.close}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Top Right Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 neu-flat text-red-500 rounded-full flex items-center justify-center hover:text-red-600 active:neu-pressed transition-all z-50"
          title={t.close}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </MotionDiv>
    </MotionDiv>
  );
}

function PoseComparisonModal({ generatedUrl, poseUrl, onClose, t, onRetry, image, onImageUpload }: { generatedUrl: string, poseUrl: string, onClose: () => void, t: any, onRetry: (useReference: boolean) => void, image: string | null, onImageUpload: (img: string | null) => void }) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 backdrop-blur-md cursor-zoom-out"
      style={{ backgroundColor: 'color-mix(in srgb, var(--bg-base) 90%, transparent)' }}
    >
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="relative flex flex-col neu-base rounded-2xl sm:rounded-3xl overflow-hidden shadow-[20px_20px_60px_#c8cbd2,-20px_-20px_60px_#ffffff] dark:shadow-[10px_10px_30px_#121418,-10px_-10px_30px_#2a2e39] cursor-default p-4 sm:p-8 w-full max-w-6xl h-[90vh]"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-[#2d3748] dark:text-white">Poz Karşılaştırması</h2>
        
        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
          {/* 3D Pose Reference */}
          <div className="flex-1 flex flex-col gap-3">
            <h3 className="font-bold text-center text-[#718096] dark:text-gray-500 uppercase tracking-widest text-sm">3D Poz Referansı</h3>
            <div className="flex-1 neu-pressed rounded-2xl overflow-hidden p-2 relative">
              <img src={poseUrl} alt="3D Pose" className="w-full h-full object-contain rounded-xl" />
            </div>
          </div>
          
          {/* Generated Image */}
          <div className="flex-1 flex flex-col gap-3">
            <h3 className="font-bold text-center text-blue-500 uppercase tracking-widest text-sm">Üretilen Görsel</h3>
            <div className="flex-1 neu-flat rounded-2xl overflow-hidden p-2 relative">
              <img src={generatedUrl} alt="Generated" className="w-full h-full object-contain rounded-xl" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 neu-flat rounded-2xl">
          {/* Reference Controls */}
          <div className="flex items-center gap-4">
            {image ? (
               <div className="flex items-center gap-3">
                 <img src={image} className="w-12 h-12 rounded-lg object-cover" alt="Reference" />
                 <div className="flex flex-col gap-1">
                   <span className="text-xs font-bold text-green-500">Referans Aktif</span>
                   <div className="flex gap-2">
                     <label className="text-[10px] cursor-pointer text-blue-500 hover:text-blue-600 font-bold uppercase tracking-wider">
                       Değiştir
                       <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                     </label>
                     <button onClick={() => onImageUpload(null)} className="text-[10px] text-red-500 hover:text-red-600 font-bold uppercase tracking-wider">Kaldır</button>
                   </div>
                 </div>
               </div>
            ) : (
               <label className="flex items-center gap-2 px-4 py-2 neu-pressed rounded-xl cursor-pointer hover:text-blue-500 transition-colors text-sm font-bold text-[#718096] dark:text-gray-400">
                 <Upload className="w-4 h-4" />
                 Referans Ekle
                 <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
               </label>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onRetry(!!image)} 
              className="px-6 py-3 neu-flat rounded-xl font-bold flex items-center gap-2 text-[#4a5568] dark:text-gray-300 hover:text-blue-500 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Yeniden Dene
            </button>
            <a 
              href={generatedUrl} 
              download="pose-generated.png" 
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/25"
            >
              <Download className="w-4 h-4" />
              İndir
            </a>
          </div>
        </div>
        
        {/* Top Right Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 neu-flat text-red-500 rounded-full flex items-center justify-center hover:text-red-600 active:neu-pressed transition-all z-50"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </MotionDiv>
    </MotionDiv>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#718096] font-bold">
        {icon}
        {label}
      </div>
      <div className="text-xs text-[#2d3748] truncate font-bold">
        {value}
      </div>
    </div>
  );
}
