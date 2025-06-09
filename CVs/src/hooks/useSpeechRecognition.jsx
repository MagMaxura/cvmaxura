import React, { useState, useEffect, useRef, useCallback } from 'react';

    const SPEECH_END_TIMEOUT = 1500; 
    const SILENCE_DETECTION_TIMEOUT = 3000;

    const useSpeechRecognition = () => {
      const [isListening, setIsListening] = useState(false);
      const [isActivating, setIsActivating] = useState(false);
      const [interimTranscriptState, setInterimTranscriptState] = useState('');
      const [finalTranscriptToSet, setFinalTranscriptToSet] = useState('');
      const [error, setError] = useState(null);
      
      const recognitionRef = useRef(null);
      const audioContextRef = useRef(null);
      const analyserRef = useRef(null);
      const dataArrayRef = useRef(null);
      const sourceRef = useRef(null);
      const streamRef = useRef(null);
      const speechEndTimerRef = useRef(null);
      const silenceDetectionTimerRef = useRef(null);

      const stopMediaStream = useCallback(() => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
        if (sourceRef.current && sourceRef.current.mediaStream && sourceRef.current.mediaStream.active === false) {
            if (sourceRef.current.disconnect) sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        if (analyserRef.current) {
            if (analyserRef.current.disconnect) analyserRef.current.disconnect();
            analyserRef.current = null;
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(e => console.error("Error closing AudioContext:", e));
          audioContextRef.current = null;
        }
      }, []);

      const resetRecognitionState = useCallback(() => {
        setIsListening(false);
        setIsActivating(false);
        clearTimeout(speechEndTimerRef.current);
        clearTimeout(silenceDetectionTimerRef.current);
        stopMediaStream();
      }, [stopMediaStream]);

      useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition'in window)) {
          setError('El reconocimiento de voz no es compatible con este navegador.');
          return;
        }

        const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognitionAPI();
        const recognition = recognitionRef.current;

        recognition.continuous = true; 
        recognition.interimResults = true;
        recognition.lang = 'es-ES'; 

        recognition.onstart = () => {
          setIsListening(true);
          setIsActivating(false);
          setInterimTranscriptState('');
          setFinalTranscriptToSet(''); 
          setError(null);
          clearTimeout(silenceDetectionTimerRef.current); 
          silenceDetectionTimerRef.current = setTimeout(() => {
            if (recognitionRef.current && isListening && interimTranscriptState === '' && finalTranscriptToSet === '') {
               recognitionRef.current.stop();
            }
          }, SILENCE_DETECTION_TIMEOUT);
        };

        recognition.onresult = (event) => {
          clearTimeout(speechEndTimerRef.current); 
          clearTimeout(silenceDetectionTimerRef.current); 

          let currentInterimTranscript = '';
          let currentFinalTranscriptSegment = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              currentFinalTranscriptSegment += event.results[i][0].transcript;
            } else {
              currentInterimTranscript += event.results[i][0].transcript;
            }
          }
          setInterimTranscriptState(currentInterimTranscript); 
          if (currentFinalTranscriptSegment) {
            setFinalTranscriptToSet(prev => (prev + " " + currentFinalTranscriptSegment).trim());
          }

          speechEndTimerRef.current = setTimeout(() => {
            if (recognitionRef.current && isListening) { 
              recognitionRef.current.stop(); 
            }
          }, SPEECH_END_TIMEOUT);
        };
        
        recognition.onspeechend = () => {
          clearTimeout(speechEndTimerRef.current);
           speechEndTimerRef.current = setTimeout(() => {
            if (recognitionRef.current && isListening) { 
              recognitionRef.current.stop(); 
            }
          }, SPEECH_END_TIMEOUT);
        };

        recognition.onerror = (event) => {
          if (event.error === 'aborted') {
             setError(null); 
          } else if (event.error === 'no-speech') {
            setError('No se detectó voz. Inténtalo de nuevo.');
          } else if (event.error === 'audio-capture') {
            setError('Error al capturar audio. Asegúrate de que el micrófono funciona.');
          } else if (event.error === 'not-allowed') {
            setError('Permiso para usar el micrófono denegado.');
          } else {
            setError(`Error de reconocimiento de voz: ${event.error}`);
          }
          resetRecognitionState();
        };

        recognition.onend = () => {
          resetRecognitionState();
        };

        return () => {
          if (recognitionRef.current) {
            recognitionRef.current.onstart = null;
            recognitionRef.current.onresult = null;
            recognitionRef.current.onspeechend = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.onend = null;
            recognitionRef.current.abort(); 
          }
          resetRecognitionState();
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [resetRecognitionState]);

      const startListening = useCallback(async () => {
        if (recognitionRef.current && !isListening && !isActivating) {
          setIsActivating(true);
          setError(null);
          setInterimTranscriptState('');
          setFinalTranscriptToSet(''); 
          try {
            if (!streamRef.current || !streamRef.current.active) {
              streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            }
            
            if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            if (!analyserRef.current) {
                analyserRef.current = audioContextRef.current.createAnalyser();
                analyserRef.current.fftSize = 256; 
                const bufferLength = analyserRef.current.frequencyBinCount;
                dataArrayRef.current = new Uint8Array(bufferLength);
            }

            if (!sourceRef.current || sourceRef.current.mediaStream !== streamRef.current) {
                if (sourceRef.current && sourceRef.current.disconnect) {
                    sourceRef.current.disconnect();
                }
                sourceRef.current = audioContextRef.current.createMediaStreamSource(streamRef.current);
                sourceRef.current.connect(analyserRef.current);
            }
            
            recognitionRef.current.start();

          } catch (err) {
            console.error("Error starting recognition or audio context:", err);
            setError("No se pudo iniciar el reconocimiento o acceso al micrófono. Verifica los permisos.");
            resetRecognitionState();
          }
        }
      }, [isListening, isActivating, resetRecognitionState]);

      const stopListening = useCallback(() => {
        if (recognitionRef.current && (isListening || isActivating)) {
          recognitionRef.current.stop(); 
        } else {
          resetRecognitionState();
        }
      }, [isListening, isActivating, resetRecognitionState]);
      
      const clearFinalTranscript = useCallback(() => {
        setFinalTranscriptToSet('');
        setInterimTranscriptState('');
      }, []);

      return {
        isListening,
        isActivating,
        interimTranscript: interimTranscriptState, 
        finalTranscript: finalTranscriptToSet,
        error,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognitionRef.current,
        clearFinalTranscript,
        analyserNode: analyserRef.current,
        audioDataArray: dataArrayRef.current,
      };
    };

    export default useSpeechRecognition;