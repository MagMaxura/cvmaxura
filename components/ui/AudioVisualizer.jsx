import React, { useRef, useEffect } from 'react';
    import { motion } from 'framer-motion';

    const AudioVisualizer = ({ analyserNode, audioDataArray, isListening }) => {
      const canvasRef = useRef(null);
      const animationFrameIdRef = useRef(null);

      useEffect(() => {
        if (!analyserNode || !audioDataArray || !isListening) {
          if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
          }
          const canvas = canvasRef.current;
          if (canvas) {
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
          }
          return;
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const bufferLength = analyserNode.frequencyBinCount;

        const draw = () => {
          animationFrameIdRef.current = requestAnimationFrame(draw);
          analyserNode.getByteFrequencyData(audioDataArray);

          context.clearRect(0, 0, canvas.width, canvas.height);
          
          const barWidth = (canvas.width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = audioDataArray[i] / 2;
            
            const R = barHeight + (25 * (i/bufferLength));
            const G = 250 * (i/bufferLength);
            const B = 50;

            context.fillStyle = `rgb(${R},${G},${B})`;
            context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
          }
        };

        draw();

        return () => {
          if (animationFrameIdRef.current) {
            cancelAnimationFrame(animationFrameIdRef.current);
          }
        };
      }, [analyserNode, audioDataArray, isListening]);

      if (!isListening) {
        return null;
      }

      return (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 50 }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full flex justify-center items-center my-2"
        >
          <canvas ref={canvasRef} width="300" height="50" className="rounded-lg bg-slate-200 dark:bg-slate-700/50 shadow-inner"></canvas>
        </motion.div>
      );
    };

    export default AudioVisualizer;