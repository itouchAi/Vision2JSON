import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
const MotionDiv = motion.div as any;
const AnimatePresenceComponent = AnimatePresence as any;
import { cn } from './lib/utils';

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
  <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-60 dark:opacity-30">
    <MotionDiv
      animate={{
        x: [0, 150, 0],
        y: [0, -100, 0],
        scale: [1, 1.5, 1],
        rotate: [0, 180, 0],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -top-[20%] -left-[20%] w-[60%] h-[60%] bg-blue-400/40 rounded-full blur-[120px]"
    />
    <MotionDiv
      animate={{
        x: [0, -120, 0],
        y: [0, 180, 0],
        scale: [1, 1.3, 1],
        rotate: [0, -180, 0],
      }}
      transition={{
        duration: 30,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute top-[30%] -right-[20%] w-[50%] h-[50%] bg-orange-400/40 rounded-full blur-[120px]"
    />
    <MotionDiv
      animate={{
        x: [0, 80, 0],
        y: [0, 120, 0],
        scale: [1, 1.6, 1],
      }}
      transition={{
        duration: 22,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute -bottom-[20%] left-[10%] w-[70%] h-[70%] bg-purple-400/30 rounded-full blur-[120px]"
    />
  </div>
);

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
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
  const [selectedSuggestions, setSelectedSuggestions] = useState<Record<string, string>>({});
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [themeColor, setThemeColor] = useState('#e6e9f0');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [language, setLanguage] = useState<'TR' | 'ENG'>('TR');
  const [history, setHistory] = useState<{ id: string; image: string; result: AnalysisResult; date: string }[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
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
    setHistory(updatedHistory);
    localStorage.setItem('analysis_history', JSON.stringify(updatedHistory));
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

  const askAI = async () => {
    if (!chatInput.trim() || !image || !result) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput("");
    setIsChatLoading(true);

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
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      setThemeColor('#1e2128');
    } else {
      document.body.classList.remove('dark-theme');
      setThemeColor('#e6e9f0');
    }
  }, [isDarkMode]);

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
        setSelectedSuggestions({}); // Clear selections after revision
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

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDarkMode ? "bg-[#0f1115] text-white" : "bg-[#e6e9f0] text-[#2d3748]"
    )}>
      <LiquidBackground />
      {/* Header */}
      <header className="neu-flat sticky top-0 z-50 mb-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 neu-flat rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
              <Maximize2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#2d3748] dark:text-white">
              Vision2JSON
            </h1>
          </div>
          <div className="flex items-center gap-4">
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
      </header>

      <main className="max-w-7xl mx-auto px-6 py-4">
        {/* Headers Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8 items-end">
          <div className="lg:col-span-5 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 neu-flat rounded-xl flex items-center justify-center text-blue-500">
                <Scan className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#2d3748] dark:text-white">{t.title}</h2>
            </div>
            <p className="text-[#718096] dark:text-gray-400 text-sm max-w-md ml-[52px]">
              {t.subtitle}
            </p>
          </div>
          <div className="lg:col-span-2"></div>
          <div className="lg:col-span-5">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 neu-flat rounded-xl flex items-center justify-center text-orange-500">
                  <Code className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-[#2d3748] dark:text-white text-xl">{t.jsonOutput}</h3>
              </div>
              <div className="grid grid-cols-4 gap-3 w-full">
                <button
                  onClick={() => setIsStudioOpen(true)}
                  disabled={!result}
                  className="h-10 neu-flat text-green-600 hover:text-green-700 active:neu-pressed rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden xl:inline">{t.studioTitle}</span>
                </button>
                <button
                  onClick={generateImage}
                  disabled={!result || isGeneratingImage || isAnalyzing || isUpgrading}
                  className="h-10 neu-flat text-green-600 hover:text-green-700 active:neu-pressed rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold disabled:opacity-40 disabled:cursor-not-allowed w-full"
                >
                  {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span className="hidden xl:inline">{isGeneratingImage ? t.generating : t.generate}</span>
                </button>
                <button
                  onClick={upgradeToHyperRealistic}
                  disabled={!result || isUpgrading || isAnalyzing}
                  className="h-10 neu-flat text-blue-600 hover:text-blue-700 active:neu-pressed rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold disabled:opacity-40 disabled:cursor-not-allowed w-full"
                >
                  {isUpgrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span className="hidden xl:inline">{isUpgrading ? t.upgrading : t.upgrade}</span>
                </button>
                <button
                  onClick={copyToClipboard}
                  disabled={!result}
                  className="h-10 neu-flat text-[#4a5568] hover:text-blue-500 active:neu-pressed rounded-xl transition-all flex items-center justify-center gap-2 text-[10px] font-bold w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden xl:inline">{copied ? t.copied : t.copy}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Bento Item 1: Upload/Preview (Left) */}
          <div className="lg:col-span-5 space-y-6">
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
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-[#f0f2f5] dark:bg-[#1a1d23] relative">
                    <img 
                      src={image} 
                      alt="Preview" 
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-6 left-6 right-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="flex-1 h-12 glass-panel bg-white/20 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-white/40 dark:border-white/20 shadow-2xl backdrop-blur-2xl"
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t.analyzing}
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-5 h-5" />
                            {t.analyze}
                          </>
                        )}
                      </button>
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
          </div>

          {/* Bento Item 2: Stats (Middle - Vertical) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {result && (
              <>
                <div className="neu-flat p-4 rounded-2xl flex flex-col items-center gap-2 group hover:neu-pressed transition-all text-center">
                  <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#718096] dark:text-gray-500 uppercase tracking-wider">{t.angle}</p>
                    <p className="text-xs font-bold text-[#2d3748] dark:text-white">{result.camera.angle}</p>
                  </div>
                </div>
                <div className="neu-flat p-4 rounded-2xl flex flex-col items-center gap-2 group hover:neu-pressed transition-all text-center">
                  <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#718096] dark:text-gray-500 uppercase tracking-wider">{t.light}</p>
                    <p className="text-xs font-bold text-[#2d3748] dark:text-white">{result.lighting.quality}</p>
                  </div>
                </div>
                <div className="neu-flat p-4 rounded-2xl flex flex-col items-center gap-2 group hover:neu-pressed transition-all text-center">
                  <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#718096] dark:text-gray-500 uppercase tracking-wider">{t.ethnicity}</p>
                    <p className="text-xs font-bold text-[#2d3748] dark:text-white">{result.subject.ethnicity}</p>
                  </div>
                </div>
                <div className="neu-flat p-4 rounded-2xl flex flex-col items-center gap-2 group hover:neu-pressed transition-all text-center">
                  <div className="w-10 h-10 rounded-xl neu-pressed flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                    <Layout className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#718096] dark:text-gray-500 uppercase tracking-wider">{t.style}</p>
                    <p className="text-xs font-bold text-[#2d3748] dark:text-white">{result.technical.style}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bento Item 3: JSON Output (Right) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="relative h-[500px] rounded-3xl neu-flat overflow-hidden flex flex-col">
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
                <div ref={resultsContainerRef} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                  <MotionDiv 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 font-mono text-[11px] leading-relaxed flex-1"
                  >
                    <pre className="text-[#4a5568] dark:text-gray-300 whitespace-pre-wrap">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </MotionDiv>
                </div>
              )}
            </div>
          </div>

          {/* Bento Item 4: Suggestions & AI Chat (Side-by-Side) */}
          {result && (
            <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Suggestions */}
              <div className="neu-flat rounded-3xl overflow-hidden flex flex-col h-[450px]">
                <div className="p-6 border-b border-[#c8cbd2]/20 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-blue-500" />
                    <h4 className="text-sm font-bold text-[#2d3748] dark:text-white uppercase tracking-wider">{t.suggestions}</h4>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#f8fafc]/50 dark:bg-[#1a1d23]/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Object.entries(result.suggestions).map(([key, options]) => (
                      <div key={key} className="space-y-3">
                        <label className="text-[10px] font-bold text-[#718096] dark:text-gray-500 uppercase tracking-widest ml-1">
                          {currentSuggestionLabels[key as keyof typeof currentSuggestionLabels] || key}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {options.map((option) => (
                            <button
                              key={option}
                              onClick={() => setSelectedSuggestions(prev => ({
                                ...prev,
                                [key]: prev[key] === option ? undefined : option
                              }))}
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
                  <h4 className="text-sm font-bold text-[#2d3748] dark:text-white uppercase tracking-wider">{t.chatTitle}</h4>
                  {chatMessages.length > 0 && (
                    <button 
                      onClick={() => setChatMessages([])} 
                      className="ml-auto text-[10px] text-[#718096] hover:text-red-500 font-bold uppercase tracking-widest transition-colors"
                    >
                      Temizle
                    </button>
                  )}
                </div>
                
                <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1 bg-[#f8fafc]/30 dark:bg-[#1a1d23]/30">
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 opacity-50">
                      <div className="w-16 h-16 rounded-full neu-pressed flex items-center justify-center text-blue-500">
                        <Wand2 className="w-8 h-8" />
                      </div>
                      <p className="text-sm text-[#718096] max-w-xs">{t.chatContext}</p>
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
                          : "neu-flat text-[#2d3748] dark:text-gray-200 rounded-tl-none border border-white/5"
                      )}>
                        {msg.text}
                      </div>
                    </MotionDiv>
                  ))}
                  {isChatLoading && (
                    <div className="flex items-center gap-3 text-[#718096] ml-2">
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
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && askAI()}
                    placeholder={t.chatPlaceholder}
                    className="flex-1 bg-transparent neu-pressed rounded-2xl px-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                  />
                  <button
                    onClick={askAI}
                    disabled={isChatLoading || !chatInput.trim()}
                    className="px-4 py-3 neu-flat text-blue-600 font-bold rounded-2xl hover:neu-pressed disabled:opacity-50 transition-all flex items-center gap-2 group"
                  >
                    <RefreshCw className={cn("w-4 h-4 group-hover:rotate-180 transition-transform duration-500", isChatLoading && "animate-spin")} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Generated Image Preview Card */}
          <AnimatePresenceComponent>
            {generatedImageUrl && (
              <div className="lg:col-span-12">
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="relative group rounded-3xl neu-flat overflow-hidden p-4"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/2 aspect-square rounded-2xl overflow-hidden relative">
                      <img 
                        src={generatedImageUrl} 
                        alt="Generated Preview" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 px-4 py-2 glass-panel rounded-full text-[10px] font-bold text-[#2d3748] uppercase tracking-wider shadow-sm">
                        {t.generatedImageBadge}
                      </div>
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
              </div>
            )}
          </AnimatePresenceComponent>

        </div>
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
          <GeneratedImageModal url={generatedImageUrl} onClose={() => setIsModalOpen(false)} t={t} />
        )}
      </AnimatePresenceComponent>

      {/* Influencer Studio Modal */}
      <AnimatePresenceComponent>
        {isStudioOpen && result && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#e6e9f0]/80 dark:bg-[#1a202c]/80 backdrop-blur-md">
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
              <div className="flex-1 overflow-auto p-4 sm:p-8 grid lg:grid-cols-5 gap-8 bg-[#e6e9f0] dark:bg-[#1a202c]">
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
                            <div className="px-4 py-2 glass-panel rounded-full text-[10px] font-bold text-[#2d3748] uppercase tracking-wider shadow-sm">
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
                              <div className="px-3 py-1 glass-panel rounded-full text-[10px] font-bold text-[#2d3748] uppercase tracking-wider shadow-sm">
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
                                  <div className="absolute inset-0 bg-[#e6e9f0]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
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
                              <div className="absolute top-3 left-3 px-2 py-0.5 glass-panel rounded-md text-[8px] font-bold text-[#2d3748] uppercase shadow-sm">
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
    </div>
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

function GeneratedImageModal({ url, onClose, t }: { url: string, onClose: () => void, t: any }) {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-[#e6e9f0]/90 dark:bg-[#1a202c]/90 backdrop-blur-md cursor-zoom-out"
    >
      <MotionDiv
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className="relative flex flex-col neu-base rounded-2xl sm:rounded-3xl overflow-hidden shadow-[20px_20px_60px_#c8cbd2,-20px_-20px_60px_#ffffff] dark:shadow-[10px_10px_30px_#121418,-10px_-10px_30px_#2a2e39] cursor-default p-2 sm:p-4"
        style={{ width: 'min(90vw, 90vh)', height: 'min(90vw, 90vh)' }}
      >
        <img src={url} alt="Generated" className="w-full h-full object-contain rounded-xl sm:rounded-2xl" referrerPolicy="no-referrer" />
        
        {/* Top Right Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 neu-flat text-red-500 rounded-full flex items-center justify-center hover:text-red-600 active:neu-pressed transition-all z-50"
          title={t.close}
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-6 glass-panel rounded-xl sm:rounded-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[#2d3748] dark:text-[#f8fafc] font-bold text-lg sm:text-xl tracking-tight">{t.generatedImageTitle}</p>
              <p className="text-[#718096] dark:text-[#94a3b8] text-xs sm:text-sm max-w-md font-medium hidden sm:block">{t.generatedImageDesc}</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 sm:px-6 sm:py-3 neu-flat text-[#4a5568] dark:text-[#94a3b8] hover:text-red-500 dark:hover:text-red-400 active:neu-pressed rounded-xl text-xs sm:text-sm font-bold transition-all"
            >
              {t.close}
            </button>
          </div>
        </div>
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
