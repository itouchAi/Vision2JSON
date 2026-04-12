import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, PerspectiveCamera, Sphere, Box, Cylinder, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { X, Camera, Sun, RotateCcw, Check, User, Image as ImageIcon, Wand2, Copy, Upload, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// --- Constants for Camera Presets ---

const SHOT_SIZES = {
  EWS: { label: 'Uzak Çekim (EWS)', distance: 15, targetY: 3.0, prompt: 'Extreme wide shot, subject is very small in the landscape' },
  WS: { label: 'Geniş Çekim (WS)', distance: 10, targetY: 3.0, prompt: 'Wide shot, full body visible with clear environment' },
  FS: { label: 'Boy Çekim (FS)', distance: 8, targetY: 3.0, prompt: 'Full shot, subject fills the frame vertically' },
  AS: { label: 'Amerikan Plan (AS)', distance: 6, targetY: 3.2, prompt: 'American shot, framed from the knees up' },
  MS: { label: 'Bel Çekim (MS)', distance: 4.5, targetY: 3.5, prompt: 'Medium shot, framed from the waist up' },
  MCU: { label: 'Göğüs Çekim (MCU)', distance: 3.5, targetY: 3.8, prompt: 'Medium close-up, framed from the chest up' },
  CU: { label: 'Yakın Plan (CU)', distance: 2.5, targetY: 4.3, prompt: 'Close-up, head and shoulders fill the frame' },
  BCU: { label: 'Büyük Yakın Plan (BCU)', distance: 1.5, targetY: 4.3, prompt: 'Big close-up, framing only the face from forehead to chin' },
  ECU: { label: 'Detay Çekim (ECU)', distance: 0.8, targetY: 4.3, prompt: 'Extreme close-up, focusing on a specific facial detail' },
};

const HORIZONTAL_ANGLES = {
  Frontal: { label: 'Tam Ön Çekim', azimuth: 0, prompt: 'Frontal shot, full face, direct engagement' },
  ThreeQuarter: { label: 'Üç Çeyrek Ön', azimuth: 45, prompt: 'Three-quarter front shot, 45 degree angle' },
  Profile: { label: 'Profil Çekim', azimuth: 90, prompt: 'Profile shot, side view' },
  RearThreeQuarter: { label: 'Üç Çeyrek Arka', azimuth: 135, prompt: 'Rear three-quarter shot, focusing on the back and side profile' },
  Back: { label: 'Tam Arka Çekim', azimuth: 180, prompt: 'Back shot, rear view, character facing away' },
  LeftProfile: { label: 'Sol Profil Çekim', azimuth: 270, prompt: 'Profile shot from the left side, side view' },
  LeftThreeQuarter: { label: 'Sol Üç Çeyrek Ön', azimuth: 315, prompt: 'Three-quarter front shot from the left side' },
};

const VERTICAL_ANGLES = {
  Overhead: { label: 'Kuş Bakışı', elevation: 10, prompt: 'Bird\'s eye view, overhead shot, looking straight down' },
  High: { label: 'Üst Açı', elevation: 45, prompt: 'High angle shot, looking down at the subject' },
  EyeLevel: { label: 'Göz Hizası', elevation: 85, prompt: 'Eye level shot, neutral perspective' },
  Low: { label: 'Alt Açı', elevation: 115, prompt: 'Low angle shot, looking up at the subject' },
  Ground: { label: 'Yer Seviyesi', elevation: 160, prompt: 'Worm\'s eye view, ground level shot looking up' },
};

const LIGHTING_STYLES = {
  GoldenHour: { label: 'Altın Saat', prompt: 'Golden hour lighting, warm and soft sunlight' },
  Midday: { label: 'Öğlen', prompt: 'Bright midday sunlight, harsh shadows, daylight' },
  Night: { label: 'Gece', prompt: 'Nighttime, dark atmosphere with subtle ambient light' },
  Moody: { label: 'Karanlık / Dramatik', prompt: 'Dark, moody, low-key lighting, cinematic shadows' },
  Studio: { label: 'Stüdyo / Lumen', prompt: 'Professional studio lighting, cinematic, high quality volumetric light' },
  Neon: { label: 'Neon / Cyberpunk', prompt: 'Neon lighting, vibrant colors, cyberpunk atmosphere' },
};

// --- 3D Components ---

const CameraRig = ({ distance, azimuth, elevation, targetY, controlsRef }: any) => {
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const phi = (elevation * Math.PI) / 180;
    const theta = (azimuth * Math.PI) / 180;
    targetPos.current.set(
      distance * Math.sin(phi) * Math.sin(theta),
      targetY + distance * Math.cos(phi),
      distance * Math.sin(phi) * Math.cos(theta)
    );
    targetLook.current.set(0, targetY, 0);
    setAnimating(true);
  }, [distance, azimuth, elevation, targetY]);

  useFrame((state) => {
    if (!controlsRef.current || !animating) return;
    
    state.camera.position.lerp(targetPos.current, 0.08);
    controlsRef.current.target.lerp(targetLook.current, 0.08);
    controlsRef.current.update();

    if (state.camera.position.distanceTo(targetPos.current) < 0.05) {
      setAnimating(false);
    }
  });

  return null;
};

const Joint = ({ position, rotation, children, name, onSelect, selectedName }: any) => {
  const ref = useRef<THREE.Group>(null);
  const isSelected = selectedName === name;

  return (
    <group position={position} rotation={rotation} ref={ref} onClick={(e) => {
      e.stopPropagation();
      onSelect(name, ref);
    }}>
      {/* Joint visual */}
      <Sphere args={[0.12, 16, 16]} visible={isSelected}>
        <meshBasicMaterial color="hotpink" depthTest={false} transparent opacity={0.8} />
      </Sphere>
      {children}
    </group>
  );
};

const Mannequin = ({ gender, selectedJoint, setSelectedJoint, setTransformRef }: any) => {
  // Proportions based on gender
  const isFemale = gender === 'female';
  const scale = isFemale ? 0.95 : 1.05;
  const shoulderWidth = isFemale ? 0.6 : 0.85;
  const hipWidth = isFemale ? 0.7 : 0.6;
  const waistWidth = isFemale ? 0.45 : 0.55;

  const handleSelect = (name: string, ref: React.RefObject<THREE.Group>) => {
    setSelectedJoint(name);
    setTransformRef(ref.current);
  };

  const materialProps = {
    color: isFemale ? "#f8bbd0" : "#bbdefb",
    roughness: 0.4,
    metalness: 0.1,
  };

  // The total height from torso center to bottom of feet is approx 3.25
  // Positioning the group at y=3.25 places the feet exactly on the ground (y=0)
  return (
    <group scale={[scale, scale, scale]} position={[0, 3.25, 0]}>
      {/* Torso */}
      <Box args={[shoulderWidth, 0.8, 0.35]} position={[0, 0.35, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...materialProps} />
      </Box>
      {/* Waist/Abdomen */}
      <Box args={[waistWidth, 0.7, 0.3]} position={[0, -0.4, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...materialProps} />
      </Box>

      {/* Head */}
      <Joint name="neck" position={[0, 0.75, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
        <Sphere args={[0.25, 32, 32]} position={[0, 0.35, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial {...materialProps} />
        </Sphere>
      </Joint>

      {/* Left Arm */}
      <Joint name="leftShoulder" position={[shoulderWidth / 2 + 0.15, 0.6, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
        <Cylinder args={[0.09, 0.08, 1.1]} position={[0, -0.55, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial {...materialProps} />
        </Cylinder>
        <Joint name="leftElbow" position={[0, -1.1, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
          <Cylinder args={[0.08, 0.06, 1.0]} position={[0, -0.5, 0]} castShadow receiveShadow>
            <meshPhysicalMaterial {...materialProps} />
          </Cylinder>
        </Joint>
      </Joint>

      {/* Right Arm */}
      <Joint name="rightShoulder" position={[-shoulderWidth / 2 - 0.15, 0.6, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
        <Cylinder args={[0.09, 0.08, 1.1]} position={[0, -0.55, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial {...materialProps} />
        </Cylinder>
        <Joint name="rightElbow" position={[0, -1.1, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
          <Cylinder args={[0.08, 0.06, 1.0]} position={[0, -0.5, 0]} castShadow receiveShadow>
            <meshPhysicalMaterial {...materialProps} />
          </Cylinder>
        </Joint>
      </Joint>

      {/* Left Leg */}
      <Joint name="leftHip" position={[hipWidth / 2, -0.75, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
        <Cylinder args={[0.14, 0.11, 1.2]} position={[0, -0.6, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial {...materialProps} />
        </Cylinder>
        <Joint name="leftKnee" position={[0, -1.2, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
          <Cylinder args={[0.11, 0.08, 1.2]} position={[0, -0.6, 0]} castShadow receiveShadow>
            <meshPhysicalMaterial {...materialProps} />
          </Cylinder>
          {/* Foot */}
          <Joint name="leftAnkle" position={[0, -1.2, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
             <Box args={[0.2, 0.1, 0.35]} position={[0, -0.05, 0.1]} castShadow receiveShadow>
               <meshPhysicalMaterial {...materialProps} />
             </Box>
          </Joint>
        </Joint>
      </Joint>

      {/* Right Leg */}
      <Joint name="rightHip" position={[-hipWidth / 2, -0.75, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
        <Cylinder args={[0.14, 0.11, 1.2]} position={[0, -0.6, 0]} castShadow receiveShadow>
          <meshPhysicalMaterial {...materialProps} />
        </Cylinder>
        <Joint name="rightKnee" position={[0, -1.2, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
          <Cylinder args={[0.11, 0.08, 1.2]} position={[0, -0.6, 0]} castShadow receiveShadow>
            <meshPhysicalMaterial {...materialProps} />
          </Cylinder>
          {/* Foot */}
          <Joint name="rightAnkle" position={[0, -1.2, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
             <Box args={[0.2, 0.1, 0.35]} position={[0, -0.05, 0.1]} castShadow receiveShadow>
               <meshPhysicalMaterial {...materialProps} />
             </Box>
          </Joint>
        </Joint>
      </Joint>
    </group>
  );
};

const Scene = ({ shotSize, hAngle, vAngle, lightSettings, gender }: any) => {
  const [selectedJoint, setSelectedJoint] = useState<string | null>(null);
  const [transformRef, setTransformRef] = useState<THREE.Object3D | null>(null);
  const controlsRef = useRef<any>(null);

  const currentShot = SHOT_SIZES[shotSize as keyof typeof SHOT_SIZES];
  const currentHAngle = HORIZONTAL_ANGLES[hAngle as keyof typeof HORIZONTAL_ANGLES];
  const currentVAngle = VERTICAL_ANGLES[vAngle as keyof typeof VERTICAL_ANGLES];

  // Calculate light position
  const lightX = lightSettings.distance * Math.sin(lightSettings.elevation * Math.PI / 180) * Math.sin(lightSettings.azimuth * Math.PI / 180);
  const lightY = lightSettings.distance * Math.cos(lightSettings.elevation * Math.PI / 180);
  const lightZ = lightSettings.distance * Math.sin(lightSettings.elevation * Math.PI / 180) * Math.cos(lightSettings.azimuth * Math.PI / 180);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 8]} />
      <CameraRig 
        distance={currentShot.distance}
        azimuth={currentHAngle.azimuth}
        elevation={currentVAngle.elevation}
        targetY={currentShot.targetY}
        controlsRef={controlsRef}
      />
      <OrbitControls 
        ref={controlsRef}
        makeDefault 
        enablePan={true} 
        enableZoom={true} 
        enableRotate={true}
        mouseButtons={{
          LEFT: undefined, // Disable left click rotation for orbit controls so we can use it for joints
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE
        }}
        target={[0, 3, 0]}
      />
      
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[lightX, lightY, lightZ]} 
        intensity={2} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      />
      {/* Light helper visual */}
      <mesh position={[lightX, lightY, lightZ]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#fbbf24" />
      </mesh>

      {/* Ground Plane & Shadows */}
      <Grid infiniteGrid fadeDistance={20} sectionColor="#94a3b8" cellColor="#cbd5e1" position={[0, 0, 0]} />
      <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={10} blur={2} far={4} />

      <Mannequin 
        gender={gender} 
        selectedJoint={selectedJoint} 
        setSelectedJoint={setSelectedJoint}
        setTransformRef={setTransformRef}
      />

      {transformRef && (
        <TransformControls 
          object={transformRef} 
          mode="rotate" 
          size={0.6}
        />
      )}
    </>
  );
};

// --- Main Component ---

export const PoseStudioModal = ({ isOpen, onClose, onGenerate, image, onImageUpload, onTranslatePrompt, onEnhancePrompt, onGetAITip }: any) => {
  const [step, setStep] = useState<'gender' | 'pose' | 'options' | 'ai_editor'>('gender');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  
  // Camera Presets State
  const [shotSize, setShotSize] = useState<keyof typeof SHOT_SIZES>('FS');
  const [hAngle, setHAngle] = useState<keyof typeof HORIZONTAL_ANGLES>('Frontal');
  const [vAngle, setVAngle] = useState<keyof typeof VERTICAL_ANGLES>('EyeLevel');

  // Light State
  const [lightSettings, setLightSettings] = useState({ azimuth: 45, elevation: 60, distance: 6 });
  const [lightStyle, setLightStyle] = useState<keyof typeof LIGHTING_STYLES>('Studio');

  const [semanticDescription, setSemanticDescription] = useState('');
  const [useReference, setUseReference] = useState(!!image);
  const [poseScreenshot, setPoseScreenshot] = useState<string | null>(null);

  // AI Editor State
  const [originalJson, setOriginalJson] = useState('');
  const [currentJson, setCurrentJson] = useState('');
  const [turkishSummary, setTurkishSummary] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  // AI Tip State
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isGeneratingTip, setIsGeneratingTip] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('gender');
      setShotSize('FS');
      setHAngle('Frontal');
      setVAngle('EyeLevel');
      setLightSettings({ azimuth: 45, elevation: 60, distance: 6 });
      setLightStyle('Studio');
      setSemanticDescription('');
      setUseReference(!!image);
      setPoseScreenshot(null);
      setOriginalJson('');
      setCurrentJson('');
      setTurkishSummary('');
      setAiInput('');
      setIsProcessingAI(false);
      setAiTip(null);
      setIsGeneratingTip(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step !== 'pose' || !onGetAITip) return;
    
    setIsGeneratingTip(true);
    const timeoutId = setTimeout(async () => {
      const tip = await onGetAITip({
        shotSize: SHOT_SIZES[shotSize].label,
        hAngle: HORIZONTAL_ANGLES[hAngle].label,
        vAngle: VERTICAL_ANGLES[vAngle].label,
        lightStyle: LIGHTING_STYLES[lightStyle].label
      });
      setAiTip(tip);
      setIsGeneratingTip(false);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [shotSize, hAngle, vAngle, lightStyle, step, onGetAITip]);

  // Update useReference if image is uploaded externally while modal is open
  useEffect(() => {
    if (image && !useReference && step === 'options') {
      setUseReference(true);
    }
  }, [image]);

  if (!isOpen) return null;

  const getLightDirectionText = () => {
    const camAzi = HORIZONTAL_ANGLES[hAngle].azimuth;
    const lightAzi = lightSettings.azimuth;
    let diff = (lightAzi - camAzi) % 360;
    if (diff < 0) diff += 360;

    let direction = "";
    if (diff > 315 || diff <= 45) direction = "from the front";
    else if (diff > 45 && diff <= 135) direction = "from the right side";
    else if (diff > 135 && diff <= 225) direction = "from behind (backlighting)";
    else if (diff > 225 && diff <= 315) direction = "from the left side";

    let height = "";
    if (lightSettings.elevation < 45) height = "from above";
    else if (lightSettings.elevation > 135) height = "from below";
    else height = "at eye level";

    let dist = lightSettings.distance > 8 ? "distant" : "close";

    return `A ${dist} light source hitting the subject ${direction} and ${height}.`;
  };

  const generateSemanticDescription = () => {
    const descriptions = [];
    
    // Gender & Physics
    descriptions.push(`The subject is a ${gender === 'female' ? 'woman with feminine physical proportions' : 'man with masculine physical proportions'}.`);

    // Camera Presets
    descriptions.push(SHOT_SIZES[shotSize].prompt + ".");
    descriptions.push(HORIZONTAL_ANGLES[hAngle].prompt + ".");
    descriptions.push(VERTICAL_ANGLES[vAngle].prompt + ".");

    // Lighting Logic
    descriptions.push(LIGHTING_STYLES[lightStyle].prompt + ".");
    descriptions.push(getLightDirectionText());

    return descriptions.join(" ");
  };

  const handleCompletePose = () => {
    // Capture canvas
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (canvas) {
      setPoseScreenshot(canvas.toDataURL('image/png'));
    }

    const semanticText = generateSemanticDescription();
    setSemanticDescription(semanticText);

    // Generate JSON prompt based on settings
    const promptObj = {
      subject: {
        gender: gender,
      },
      camera: `${SHOT_SIZES[shotSize].prompt}, ${HORIZONTAL_ANGLES[hAngle].prompt}, ${VERTICAL_ANGLES[vAngle].prompt}`,
      lighting: {
        style: LIGHTING_STYLES[lightStyle].prompt,
        direction: getLightDirectionText(),
      },
      generation_parameters: {
        prompts: [semanticText]
      }
    };
    
    const jsonStr = JSON.stringify(promptObj, null, 2);
    setOriginalJson(jsonStr);
    setCurrentJson(jsonStr);
    setStep('options');
  };

  const updateSummary = async (jsonStr: string) => {
    setIsProcessingAI(true);
    const summary = await onTranslatePrompt(jsonStr);
    setTurkishSummary(summary);
    setIsProcessingAI(false);
  };

  const goToAIEditor = () => {
    setStep('ai_editor');
    updateSummary(currentJson);
  };

  const handleAIEnhance = async () => {
    if (!aiInput.trim()) return;
    setIsProcessingAI(true);
    const newJson = await onEnhancePrompt(currentJson, aiInput);
    setCurrentJson(newJson);
    setAiInput('');
    // Update summary with new JSON
    const newSummary = await onTranslatePrompt(newJson);
    setTurkishSummary(newSummary);
    setIsProcessingAI(false);
  };

  const handleReset = () => {
    setCurrentJson(originalJson);
    updateSummary(originalJson);
  };

  const handleGenerate = () => {
    onGenerate({
      prompt: currentJson,
      semanticDescription,
      additionalDetails: '', // handled by JSON now
      useReference,
      poseScreenshot
    });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target?.result as string);
        setUseReference(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 backdrop-blur-md bg-black/40">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-6xl h-[90vh] neu-base rounded-3xl overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/10">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            3D Pose Studio
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full neu-flat flex items-center justify-center hover:text-red-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative w-full h-full block">
          <AnimatePresence mode="wait">
            {step === 'gender' && (
              <motion.div 
                key="gender"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-8 overflow-y-auto w-full h-full"
              >
                <h3 className="text-2xl font-bold">Model Cinsiyetini Seçin</h3>
                <div className="flex gap-8">
                  <button 
                    onClick={() => { setGender('female'); setStep('pose'); }}
                    className="w-48 h-64 neu-flat rounded-3xl flex flex-col items-center justify-center gap-4 hover:neu-pressed transition-all group"
                  >
                    <div className="w-24 h-24 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="w-12 h-12 text-pink-500" />
                    </div>
                    <span className="font-bold text-lg">Kadın</span>
                  </button>
                  <button 
                    onClick={() => { setGender('male'); setStep('pose'); }}
                    className="w-48 h-64 neu-flat rounded-3xl flex flex-col items-center justify-center gap-4 hover:neu-pressed transition-all group"
                  >
                    <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <User className="w-12 h-12 text-blue-500" />
                    </div>
                    <span className="font-bold text-lg">Erkek</span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'pose' && (
              <motion.div 
                key="pose"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex flex-col lg:flex-row overflow-hidden w-full h-full"
              >
                {/* 3D Canvas Area */}
                <div className="h-[50vh] lg:h-auto lg:flex-1 relative bg-[#1a1d23] min-w-0 min-h-0 flex-shrink-0 lg:flex-shrink" ref={canvasContainerRef}>
                  <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
                    <Scene 
                      shotSize={shotSize} 
                      hAngle={hAngle} 
                      vAngle={vAngle} 
                      lightSettings={lightSettings} 
                      gender={gender} 
                    />
                  </Canvas>
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-3 rounded-xl text-xs text-white/80 pointer-events-none">
                    <p>• Sol tık: Eklemleri seç ve çevir</p>
                    <p>• Sağ tık basılı tut: Kamerayı manuel döndür</p>
                    <p>• Tekerlek: Yakınlaş/Uzaklaş</p>
                  </div>
                </div>

                {/* Controls Sidebar */}
                <div className="flex-1 lg:flex-none w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/10 bg-black/5 p-6 overflow-y-auto flex flex-col gap-6 min-w-0 min-h-0">
                  
                  {/* Semantic Camera Controls */}
                  <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-blue-500">
                      <Camera className="w-4 h-4" />
                      Sinematik Kamera
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Çekim Ölçeği</label>
                        <select 
                          value={shotSize}
                          onChange={(e) => setShotSize(e.target.value as keyof typeof SHOT_SIZES)}
                          className="w-full h-10 neu-pressed rounded-xl px-3 text-sm font-bold text-[#2d3748] dark:text-white bg-transparent border-none outline-none cursor-pointer"
                        >
                          {Object.entries(SHOT_SIZES).map(([key, data]) => (
                            <option key={key} value={key} className="bg-white dark:bg-gray-800">{data.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Yatay Açı</label>
                        <select 
                          value={hAngle}
                          onChange={(e) => setHAngle(e.target.value as keyof typeof HORIZONTAL_ANGLES)}
                          className="w-full h-10 neu-pressed rounded-xl px-3 text-sm font-bold text-[#2d3748] dark:text-white bg-transparent border-none outline-none cursor-pointer"
                        >
                          {Object.entries(HORIZONTAL_ANGLES).map(([key, data]) => (
                            <option key={key} value={key} className="bg-white dark:bg-gray-800">{data.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dikey Açı</label>
                        <select 
                          value={vAngle}
                          onChange={(e) => setVAngle(e.target.value as keyof typeof VERTICAL_ANGLES)}
                          className="w-full h-10 neu-pressed rounded-xl px-3 text-sm font-bold text-[#2d3748] dark:text-white bg-transparent border-none outline-none cursor-pointer"
                        >
                          {Object.entries(VERTICAL_ANGLES).map(([key, data]) => (
                            <option key={key} value={key} className="bg-white dark:bg-gray-800">{data.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Live Prompt Preview */}
                    <div className="mt-4 p-3 neu-pressed rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Canlı Prompt</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 italic break-words whitespace-pre-wrap">
                        {generateSemanticDescription()}
                      </p>
                    </div>

                    {/* AI Co-pilot Tip */}
                    <div className="mt-4 p-3 neu-flat rounded-xl bg-purple-500/10 border border-purple-500/30 relative overflow-hidden">
                      <div className="flex items-center gap-2 mb-2">
                        <Wand2 className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">Yapay Zeka Asistanı</span>
                      </div>
                      {isGeneratingTip ? (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <div className="w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                          Yorumluyor...
                        </div>
                      ) : (
                        <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                          {aiTip || "Seçimlerinizi analiz ediyorum..."}
                        </p>
                      )}
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Light Controls */}
                  <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-yellow-500">
                      <Sun className="w-4 h-4" />
                      Işık Ayarları
                    </h4>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Işık Stili / Atmosfer</label>
                        <select 
                          value={lightStyle}
                          onChange={(e) => setLightStyle(e.target.value as keyof typeof LIGHTING_STYLES)}
                          className="w-full h-10 neu-pressed rounded-xl px-3 text-sm font-bold text-[#2d3748] dark:text-white bg-transparent border-none outline-none cursor-pointer"
                        >
                          {Object.entries(LIGHTING_STYLES).map(([key, data]) => (
                            <option key={key} value={key} className="bg-white dark:bg-gray-800">{data.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 flex justify-between">
                          <span>Yatay Açı (Azimuth)</span>
                          <span>{lightSettings.azimuth}°</span>
                        </label>
                        <input 
                          type="range" min="0" max="360" value={lightSettings.azimuth}
                          onChange={(e) => setLightSettings(p => ({...p, azimuth: parseInt(e.target.value)}))}
                          className="w-full accent-yellow-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 flex justify-between">
                          <span>Dikey Açı (Elevation)</span>
                          <span>{lightSettings.elevation}°</span>
                        </label>
                        <input 
                          type="range" min="10" max="170" value={lightSettings.elevation}
                          onChange={(e) => setLightSettings(p => ({...p, elevation: parseInt(e.target.value)}))}
                          className="w-full accent-yellow-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex gap-3">
                    <button 
                      onClick={() => {
                        setShotSize('FS');
                        setHAngle('Frontal');
                        setVAngle('EyeLevel');
                        setLightSettings({ azimuth: 45, elevation: 60, distance: 6 });
                        setLightStyle('Studio');
                      }}
                      className="flex-1 h-12 neu-flat rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:text-red-500"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Sıfırla
                    </button>
                    <button 
                      onClick={handleCompletePose}
                      className="flex-1 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-blue-700"
                    >
                      <Check className="w-4 h-4" />
                      Tamamla
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 'options' && (
              <motion.div 
                key="options"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-8 overflow-y-auto"
              >
                <h3 className="text-2xl font-bold">Üretim Seçenekleri</h3>
                
                <div className="w-full max-w-md space-y-6">
                  <div className="neu-flat p-6 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-blue-500" />
                        <span className="font-bold">Referans Görsel Kullan</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={useReference}
                          onChange={(e) => setUseReference(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    {useReference && (
                      <div className="mt-4">
                        {image ? (
                          <div className="relative w-full h-40 rounded-xl overflow-hidden group">
                            <img src={image} className="w-full h-full object-cover" alt="Reference" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => {
                                  onImageUpload(null);
                                  setUseReference(false);
                                }} 
                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold text-sm hover:bg-red-600"
                              >
                                Kaldır
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-40 border-2 border-dashed border-gray-500 rounded-xl flex flex-col items-center justify-center relative hover:border-blue-500 hover:bg-blue-500/5 transition-all">
                            <input 
                              type="file" 
                              accept="image/*" 
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              onChange={handleFileUpload} 
                            />
                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-sm font-bold text-gray-400">Görsel Yükle</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={goToAIEditor}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-5 h-5" />
                    Promptu İncele ve Düzenle
                  </button>
                  
                  <button 
                    onClick={() => setStep('pose')}
                    className="w-full h-12 neu-flat rounded-xl font-bold text-sm"
                  >
                    Geri Dön
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'ai_editor' && (
              <motion.div 
                key="ai_editor"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute inset-0 flex flex-col p-6 max-w-5xl mx-auto w-full gap-4 overflow-y-auto"
              >
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Wand2 className="w-6 h-6 text-purple-500" />
                  Yapay Zeka Prompt Düzenleyici
                </h3>

                {/* Top: Turkish Summary */}
                <div className="neu-pressed rounded-2xl p-4 bg-purple-500/5 border border-purple-500/20 relative min-h-[80px]">
                  <h4 className="text-xs font-bold text-purple-500 uppercase tracking-wider mb-2">Sahne Özeti</h4>
                  {isProcessingAI ? (
                    <div className="flex items-center gap-2 text-gray-500">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      Yapay zeka sahneyi analiz ediyor...
                    </div>
                  ) : (
                    <p className="text-sm text-[#2d3748] dark:text-gray-300 italic break-words whitespace-pre-wrap">{turkishSummary}</p>
                  )}
                </div>

                {/* Middle: JSON */}
                <div className="flex-1 flex flex-col gap-2 min-h-[200px]">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">JSON Prompt Verisi</label>
                  <textarea
                    value={currentJson}
                    onChange={(e) => setCurrentJson(e.target.value)}
                    className="flex-1 w-full neu-pressed rounded-2xl p-4 text-xs font-mono text-blue-400 bg-transparent border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                {/* Bottom: AI Input */}
                <div className="neu-flat rounded-2xl p-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Örn: Sahilde gün batımı olsun, kırmızı bir elbise giysin..."
                    className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-[#2d3748] dark:text-white"
                    onKeyDown={(e) => e.key === 'Enter' && handleAIEnhance()}
                    disabled={isProcessingAI}
                  />
                  <button
                    onClick={handleAIEnhance}
                    disabled={isProcessingAI || !aiInput.trim()}
                    className="px-6 h-10 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                  >
                    <Wand2 className="w-4 h-4" />
                    Koda Ekle
                  </button>
                </div>

                {/* Footer Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigator.clipboard.writeText(currentJson)}
                      className="px-4 h-10 neu-flat rounded-xl text-sm font-bold flex items-center gap-2 hover:text-blue-500"
                    >
                      <Copy className="w-4 h-4" />
                      JSON Kopyala
                    </button>
                    <button
                      onClick={handleReset}
                      disabled={isProcessingAI}
                      className="px-4 h-10 neu-flat rounded-xl text-sm font-bold flex items-center gap-2 hover:text-red-500"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Sıfırla
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 h-12 neu-flat rounded-xl text-sm font-bold hover:text-red-500"
                    >
                      Kapat
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={isProcessingAI}
                      className="px-8 h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                    >
                      <ImageIcon className="w-5 h-5" />
                      Yeniden Dene / Üret
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
