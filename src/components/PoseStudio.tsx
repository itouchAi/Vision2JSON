import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls, Grid, PerspectiveCamera, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { X, Camera, Sun, RotateCcw, Check, User, Image as ImageIcon, Wand2, Copy, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

// --- 3D Components ---

const Joint = ({ position, rotation, children, name, onSelect, selectedName }: any) => {
  const ref = useRef<THREE.Group>(null);
  const isSelected = selectedName === name;

  return (
    <group position={position} rotation={rotation} ref={ref} onClick={(e) => {
      e.stopPropagation();
      onSelect(name, ref);
    }}>
      {/* Joint visual */}
      <Sphere args={[0.15, 16, 16]} visible={false}>
        <meshStandardMaterial color={isSelected ? "hotpink" : "gray"} />
      </Sphere>
      {children}
    </group>
  );
};

const Mannequin = ({ gender, selectedJoint, setSelectedJoint, setTransformRef }: any) => {
  // Basic proportions
  const scale = gender === 'male' ? 1.1 : 1.0;
  const shoulderWidth = gender === 'male' ? 0.8 : 0.6;
  const hipWidth = gender === 'male' ? 0.5 : 0.6;

  const handleSelect = (name: string, ref: React.RefObject<THREE.Group>) => {
    setSelectedJoint(name);
    setTransformRef(ref.current);
  };

  return (
    <group scale={[scale, scale, scale]} position={[0, 2, 0]}>
      {/* Torso */}
      <Box args={[shoulderWidth, 1.5, 0.4]} position={[0, -0.75, 0]} castShadow>
        <meshStandardMaterial color="#e2e8f0" />
      </Box>

      {/* Head */}
      <Joint name="neck" position={[0, 0, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
        <Sphere args={[0.3, 32, 32]} position={[0, 0.4, 0]} castShadow>
          <meshStandardMaterial color="#cbd5e1" />
        </Sphere>
      </Joint>

      {/* Left Arm */}
      <Joint name="leftShoulder" position={[shoulderWidth / 2 + 0.2, -0.2, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
        <Cylinder args={[0.1, 0.1, 0.8]} position={[0, -0.4, 0]} castShadow>
          <meshStandardMaterial color="#cbd5e1" />
        </Cylinder>
        <Joint name="leftElbow" position={[0, -0.8, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
          <Cylinder args={[0.08, 0.08, 0.8]} position={[0, -0.4, 0]} castShadow>
            <meshStandardMaterial color="#cbd5e1" />
          </Cylinder>
        </Joint>
      </Joint>

      {/* Right Arm */}
      <Joint name="rightShoulder" position={[-shoulderWidth / 2 - 0.2, -0.2, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
        <Cylinder args={[0.1, 0.1, 0.8]} position={[0, -0.4, 0]} castShadow>
          <meshStandardMaterial color="#cbd5e1" />
        </Cylinder>
        <Joint name="rightElbow" position={[0, -0.8, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
          <Cylinder args={[0.08, 0.08, 0.8]} position={[0, -0.4, 0]} castShadow>
            <meshStandardMaterial color="#cbd5e1" />
          </Cylinder>
        </Joint>
      </Joint>

      {/* Left Leg */}
      <Joint name="leftHip" position={[hipWidth / 2, -1.5, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
        <Cylinder args={[0.15, 0.12, 1]} position={[0, -0.5, 0]} castShadow>
          <meshStandardMaterial color="#cbd5e1" />
        </Cylinder>
        <Joint name="leftKnee" position={[0, -1, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
          <Cylinder args={[0.12, 0.1, 1]} position={[0, -0.5, 0]} castShadow>
            <meshStandardMaterial color="#cbd5e1" />
          </Cylinder>
        </Joint>
      </Joint>

      {/* Right Leg */}
      <Joint name="rightHip" position={[-hipWidth / 2, -1.5, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
        <Cylinder args={[0.15, 0.12, 1]} position={[0, -0.5, 0]} castShadow>
          <meshStandardMaterial color="#cbd5e1" />
        </Cylinder>
        <Joint name="rightKnee" position={[0, -1, 0]} onSelect={handleSelect} selectedName={selectedJoint}>
          <Cylinder args={[0.12, 0.1, 1]} position={[0, -0.5, 0]} castShadow>
            <meshStandardMaterial color="#cbd5e1" />
          </Cylinder>
        </Joint>
      </Joint>
    </group>
  );
};

const Scene = ({ camSettings, lightSettings, gender }: any) => {
  const [selectedJoint, setSelectedJoint] = useState<string | null>(null);
  const [transformRef, setTransformRef] = useState<THREE.Object3D | null>(null);

  // Calculate camera position based on spherical coordinates
  const camX = camSettings.distance * Math.sin(camSettings.elevation * Math.PI / 180) * Math.cos(camSettings.azimuth * Math.PI / 180);
  const camY = camSettings.distance * Math.cos(camSettings.elevation * Math.PI / 180);
  const camZ = camSettings.distance * Math.sin(camSettings.elevation * Math.PI / 180) * Math.sin(camSettings.azimuth * Math.PI / 180);

  // Calculate light position
  const lightX = lightSettings.distance * Math.sin(lightSettings.elevation * Math.PI / 180) * Math.cos(lightSettings.azimuth * Math.PI / 180);
  const lightY = lightSettings.distance * Math.cos(lightSettings.elevation * Math.PI / 180);
  const lightZ = lightSettings.distance * Math.sin(lightSettings.elevation * Math.PI / 180) * Math.sin(lightSettings.azimuth * Math.PI / 180);

  return (
    <>
      <PerspectiveCamera makeDefault position={[camX, camY, camZ]} />
      <OrbitControls 
        makeDefault 
        enablePan={true} 
        enableZoom={false} 
        enableRotate={true}
        mouseButtons={{
          LEFT: undefined, // Disable left click rotation for orbit controls so we can use it for joints
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.ROTATE
        }}
        target={[0, 1, 0]}
      />
      
      <ambientLight intensity={0.2} />
      <directionalLight 
        position={[lightX, lightY, lightZ]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      {/* Light helper visual */}
      <mesh position={[lightX, lightY, lightZ]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="yellow" />
      </mesh>

      <Grid infiniteGrid fadeDistance={10} sectionColor="#94a3b8" cellColor="#cbd5e1" />
      
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
          size={0.5}
          onMouseDown={() => {
            // Disable orbit controls when using transform controls
          }}
        />
      )}
    </>
  );
};

// --- Main Component ---

export const PoseStudioModal = ({ isOpen, onClose, onGenerate, image, onImageUpload }: any) => {
  const [step, setStep] = useState<'gender' | 'pose' | 'prompt' | 'options'>('gender');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  
  // Sliders state
  const [camSettings, setCamSettings] = useState({ azimuth: 90, elevation: 70, distance: 5 });
  const [lightSettings, setLightSettings] = useState({ azimuth: 45, elevation: 45, distance: 5 });

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [useReference, setUseReference] = useState(!!image);
  const [poseScreenshot, setPoseScreenshot] = useState<string | null>(null);

  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep('gender');
      setCamSettings({ azimuth: 90, elevation: 70, distance: 5 });
      setLightSettings({ azimuth: 45, elevation: 45, distance: 5 });
      setGeneratedPrompt('');
      setAdditionalDetails('');
      setUseReference(!!image);
      setPoseScreenshot(null);
    }
  }, [isOpen]);

  // Update useReference if image is uploaded externally while modal is open
  useEffect(() => {
    if (image && !useReference && step === 'options') {
      setUseReference(true);
    }
  }, [image]);

  if (!isOpen) return null;

  const handleCompletePose = () => {
    // Capture canvas
    const canvas = canvasContainerRef.current?.querySelector('canvas');
    if (canvas) {
      setPoseScreenshot(canvas.toDataURL('image/png'));
    }

    // Generate JSON prompt based on settings
    const promptObj = {
      subject: {
        gender: gender,
        pose: "Custom posed mannequin",
      },
      camera: {
        azimuth: camSettings.azimuth,
        elevation: camSettings.elevation,
        distance: camSettings.distance,
        description: `Camera positioned at azimuth ${camSettings.azimuth}°, elevation ${camSettings.elevation}°, distance ${camSettings.distance}m`
      },
      lighting: {
        azimuth: lightSettings.azimuth,
        elevation: lightSettings.elevation,
        distance: lightSettings.distance,
        description: `Main light source at azimuth ${lightSettings.azimuth}°, elevation ${lightSettings.elevation}°, distance ${lightSettings.distance}m`
      }
    };
    
    setGeneratedPrompt(JSON.stringify(promptObj, null, 2));
    setStep('prompt');
  };

  const handleGenerate = () => {
    onGenerate({
      prompt: generatedPrompt,
      additionalDetails,
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
        <div className="flex-1 overflow-hidden relative flex">
          <AnimatePresence mode="wait">
            {step === 'gender' && (
              <motion.div 
                key="gender"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col items-center justify-center p-8 space-y-8"
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
                className="flex-1 flex flex-col lg:flex-row h-full"
              >
                {/* 3D Canvas Area */}
                <div className="flex-1 relative bg-[#1a1d23]" ref={canvasContainerRef}>
                  <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
                    <Scene camSettings={camSettings} lightSettings={lightSettings} gender={gender} />
                  </Canvas>
                  <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-3 rounded-xl text-xs text-white/80 pointer-events-none">
                    <p>• Sol tık: Eklemleri seç ve çevir</p>
                    <p>• Sağ tık basılı tut: Kamerayı döndür</p>
                    <p>• Tekerlek: Yakınlaş/Uzaklaş</p>
                  </div>
                </div>

                {/* Controls Sidebar */}
                <div className="w-full lg:w-80 border-l border-white/10 bg-black/5 p-6 overflow-y-auto flex flex-col gap-8">
                  {/* Camera Controls */}
                  <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-blue-500">
                      <Camera className="w-4 h-4" />
                      Kamera Ayarları
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-gray-400 flex justify-between">
                          <span>Yatay Açı (Azimuth)</span>
                          <span>{camSettings.azimuth}°</span>
                        </label>
                        <input 
                          type="range" min="0" max="360" value={camSettings.azimuth}
                          onChange={(e) => setCamSettings(p => ({...p, azimuth: parseInt(e.target.value)}))}
                          className="w-full accent-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 flex justify-between">
                          <span>Dikey Açı (Elevation)</span>
                          <span>{camSettings.elevation}°</span>
                        </label>
                        <input 
                          type="range" min="10" max="170" value={camSettings.elevation}
                          onChange={(e) => setCamSettings(p => ({...p, elevation: parseInt(e.target.value)}))}
                          className="w-full accent-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 flex justify-between">
                          <span>Uzaklık</span>
                          <span>{camSettings.distance}m</span>
                        </label>
                        <input 
                          type="range" min="2" max="15" step="0.5" value={camSettings.distance}
                          onChange={(e) => setCamSettings(p => ({...p, distance: parseFloat(e.target.value)}))}
                          className="w-full accent-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Light Controls */}
                  <div className="space-y-4">
                    <h4 className="font-bold flex items-center gap-2 text-yellow-500">
                      <Sun className="w-4 h-4" />
                      Işık Ayarları
                    </h4>
                    <div className="space-y-3">
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
                      <div>
                        <label className="text-xs font-bold text-gray-400 flex justify-between">
                          <span>Uzaklık</span>
                          <span>{lightSettings.distance}m</span>
                        </label>
                        <input 
                          type="range" min="2" max="15" step="0.5" value={lightSettings.distance}
                          onChange={(e) => setLightSettings(p => ({...p, distance: parseFloat(e.target.value)}))}
                          className="w-full accent-yellow-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 flex gap-3">
                    <button 
                      onClick={() => {
                        setCamSettings({ azimuth: 90, elevation: 70, distance: 5 });
                        setLightSettings({ azimuth: 45, elevation: 45, distance: 5 });
                        // Resetting pose would require resetting all joint rotations, which is complex without a central state.
                        // For now, we just reset camera and light.
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

            {step === 'prompt' && (
              <motion.div 
                key="prompt"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col p-8 max-w-4xl mx-auto w-full gap-6 overflow-y-auto"
              >
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Wand2 className="w-6 h-6 text-purple-500" />
                  Oluşturulan Prompt JSON
                </h3>
                
                <div className="relative neu-pressed rounded-2xl p-4">
                  <pre className="text-xs font-mono text-blue-400 whitespace-pre-wrap overflow-x-auto">
                    {generatedPrompt}
                  </pre>
                  <button 
                    onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                    className="absolute top-4 right-4 w-8 h-8 neu-flat rounded-lg flex items-center justify-center hover:text-blue-500"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400">Ekstra Detaylar (Kıyafet, Yüz, Arka Plan vb.)</label>
                  <textarea 
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Örn: Kırmızı deri ceket, neon ışıklı sokak arka planı..."
                    className="w-full h-32 neu-pressed rounded-2xl p-4 text-sm bg-transparent border-none focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-4">
                  <button 
                    onClick={() => setStep('pose')}
                    className="px-6 h-12 neu-flat rounded-xl font-bold"
                  >
                    Geri Dön
                  </button>
                  <button 
                    onClick={() => setStep('options')}
                    className="px-6 h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
                  >
                    İleri
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'options' && (
              <motion.div 
                key="options"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex-1 flex flex-col items-center justify-center p-8 space-y-8"
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
                    onClick={handleGenerate}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Wand2 className="w-5 h-5" />
                    Görseli Üret
                  </button>
                  
                  <button 
                    onClick={() => setStep('prompt')}
                    className="w-full h-12 neu-flat rounded-xl font-bold text-sm"
                  >
                    Geri Dön
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
