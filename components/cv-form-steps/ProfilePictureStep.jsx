import React, { useState, useRef, useEffect, useCallback } from 'react';
    import { Button } from '@/components/ui/button';
    import { useToast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { UploadCloud, Camera, XCircle, CheckCircle, Trash2, User as UserIcon } from 'lucide-react';

    const ProfilePictureStep = ({ cvData, handleChange, onStepComplete }) => {
      const { toast } = useToast();
      const [imagePreview, setImagePreview] = useState(null);
      const [isCameraOpen, setIsCameraOpen] = useState(false);
      const [isStreamReady, setIsStreamReady] = useState(false);
      const videoRef = useRef(null);
      const canvasRef = useRef(null);
      const fileInputRef = useRef(null);
      const streamRef = useRef(null);

      useEffect(() => {
        if (cvData && cvData.personalInfo) {
          setImagePreview(cvData.personalInfo.profilePicture || null);
        }
      }, [cvData]);

      const stopCurrentStream = useCallback(() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        setIsStreamReady(false);
      }, []);

      useEffect(() => {
        return () => {
          stopCurrentStream();
        };
      }, [stopCurrentStream]);

      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({ title: "Archivo demasiado grande", description: "Por favor, selecciona una imagen de menos de 5MB.", variant: "destructive" });
            return;
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
            handleChange('personalInfo', 'profilePicture', reader.result);
            toast({ title: "Foto cargada", description: "Tu foto de perfil ha sido actualizada.", variant: "default" });
          };
          reader.onerror = () => {
            toast({ title: "Error al leer archivo", description: "No se pudo cargar la imagen. Inténtalo de nuevo.", variant: "destructive" });
          };
          reader.readAsDataURL(file);
        } else if (file) {
          toast({ title: "Archivo no válido", description: "Por favor, selecciona un archivo de imagen (JPEG, PNG, GIF, etc.).", variant: "destructive" });
        }
      };

      const openCamera = async () => {
        stopCurrentStream(); 
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: "user"
              }
            });
            streamRef.current = stream;
            setIsCameraOpen(true);
            setIsStreamReady(false); 
            
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              
              const playPromise = videoRef.current.play();

              if (playPromise !== undefined) {
                playPromise.then(() => {
                  // Esperar un poco para asegurar que el video esté renderizado y tenga dimensiones
                  setTimeout(() => {
                    if (videoRef.current && videoRef.current.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
                      setIsStreamReady(true);
                    }
                  }, 100); // Pequeño retraso para asegurar la renderización
                }).catch(playError => {
                  console.error("Error playing video:", playError);
                  toast({ title: "Error de Cámara", description: "No se pudo reproducir el video de la cámara. Asegúrate de que los permisos estén concedidos.", variant: "destructive" });
                  closeCamera();
                });
              }
              
              // Asegurarse de que isStreamReady se establezca solo cuando el video tenga dimensiones válidas
              videoRef.current.onloadedmetadata = () => {
                if (videoRef.current && videoRef.current.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
                    setIsStreamReady(true);
                }
              };
              videoRef.current.oncanplay = () => {
                if (videoRef.current && videoRef.current.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
                     setIsStreamReady(true);
                }
              };
            }
          } catch (error) {
            console.error("Error accessing camera:", error);
            let description = "No se pudo acceder a la cámara. Verifica los permisos y que no esté en uso por otra aplicación.";
            if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
              description = "Permiso para acceder a la cámara denegado. Por favor, habilita el acceso en la configuración de tu navegador.";
            } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
              description = "No se encontró una cámara compatible. Asegúrate de que haya una cámara conectada y funcionando.";
            } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
              description = "La cámara ya está en uso o no se puede leer. Cierra otras aplicaciones que puedan estar usándola.";
            }
            toast({ title: "Error de Cámara", description: description, variant: "destructive" });
            setIsCameraOpen(false);
            setIsStreamReady(false);
          }
        } else {
          toast({ title: "Cámara no Soportada", description: "Tu navegador no soporta el acceso a la cámara.", variant: "destructive" });
        }
      };

      const captureImage = () => {
        if (videoRef.current && canvasRef.current && videoRef.current.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0 && isStreamReady) {
          const video = videoRef.current;
          const canvas = canvasRef.current;

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const context = canvas.getContext('2d');
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(video, 0, 0, canvas.width, canvas.height);

          try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            if (dataUrl && dataUrl.length > 'data:image/jpeg;base64,'.length) {
              setImagePreview(dataUrl);
              handleChange('personalInfo', 'profilePicture', dataUrl);
              closeCamera();
              toast({ title: "Foto capturada", description: "Tu foto de perfil ha sido tomada.", variant: "default" });
            } else {
              throw new Error("Generated Data URL is empty or invalid.");
            }
          } catch (e) {
            console.error("Error generating data URL:", e);
            toast({ title: "Error al capturar", description: "No se pudo procesar la imagen de la cámara. Inténtalo de nuevo.", variant: "destructive" });
          }
        } else {
          let errorMsg = "Cámara no lista. ";
          if (!isStreamReady) errorMsg += "El stream de video no está listo. ";
          if (videoRef.current && videoRef.current.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA) errorMsg += "Video no tiene suficientes datos. ";
          if (videoRef.current && (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0)) errorMsg += "Video no tiene dimensiones válidas. ";
          toast({ title: "Cámara no lista", description: errorMsg + "Intenta abrir la cámara de nuevo o espera un momento.", variant: "destructive" });
        }
      };
      
      const closeCamera = useCallback(() => {
        stopCurrentStream();
        setIsCameraOpen(false);
        setIsStreamReady(false);
      }, [stopCurrentStream]);


      const removeImage = () => {
        setImagePreview(null);
        handleChange('personalInfo', 'profilePicture', null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast({ title: "Foto eliminada", description: "Tu foto de perfil ha sido eliminada.", variant: "default" });
      };

      const handleSubmit = () => {
        if (onStepComplete) onStepComplete();
      };

      const buttonClass = "bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-500 transition-all duration-200 shadow-sm hover:shadow-md";

      return (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6 p-2 flex flex-col items-center w-full max-w-md"
        >
          <h3 className="text-xl font-semibold text-slate-800 dark:text-gray-100 mb-2 text-center">Foto de Perfil (Opcional)</h3>

          {isCameraOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-xs flex flex-col items-center space-y-4 p-4 border rounded-xl bg-white dark:bg-slate-800 shadow-xl"
            >
              <div className="relative w-full aspect-[4/3] bg-black rounded-lg overflow-hidden">
                <video ref={videoRef} playsInline autoPlay className="w-full h-full object-cover" />
                {!isStreamReady && (
                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                     <p className="text-white text-sm">Cargando cámara...</p>
                   </div>
                )}
              </div>
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="flex space-x-3 w-full">
                <Button onClick={captureImage} className="flex-1 bg-green-500 hover:bg-green-600 text-white shadow-md" disabled={!isStreamReady}>
                  <Camera className="h-5 w-5 mr-2" /> Capturar
                </Button>
                <Button onClick={closeCamera} variant="outline" className={`flex-1 ${buttonClass}`}>
                  <XCircle className="h-5 w-5 mr-2" /> Cerrar
                </Button>
              </div>
            </motion.div>
          )}

          {!isCameraOpen && (
            <div className="w-full max-w-xs flex flex-col items-center space-y-4">
              <div className="relative group w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-primary/40 dark:border-teal-500/60 shadow-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Vista previa de perfil" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="h-24 w-24 text-slate-400 dark:text-slate-500" />
                )}
                {imagePreview && (
                  <Button
                    onClick={removeImage}
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full w-9 h-9 bg-red-500/80 hover:bg-red-600/90 backdrop-blur-sm"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                )}
              </div>
              <div className="flex flex-col space-y-3 w-full">
                <Button onClick={() => fileInputRef.current?.click()} className={`w-full ${buttonClass} py-3 text-base`}>
                  <UploadCloud className="h-5 w-5 mr-2" /> Subir Foto
                </Button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <Button onClick={openCamera} className={`w-full ${buttonClass} py-3 text-base`}>
                  <Camera className="h-5 w-5 mr-2" /> Usar Cámara
                </Button>
              </div>
            </div>
          )}

          <div className="w-full max-w-xs pt-4">
            <Button onClick={handleSubmit} className="w-full bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white py-3 text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
              {imagePreview ? 'Confirmar Foto y Continuar' : 'Continuar sin Foto'}
              <CheckCircle className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      );
    };

    export default ProfilePictureStep;