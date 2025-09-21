"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Play, Pause, Square, Trash2 } from "lucide-react";
import { Button } from "./button";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
}

export function VoiceRecorder({ onRecordingComplete, onRecordingStart, onRecordingStop }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [currentRecording, setCurrentRecording] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        setRecordings(prev => [...prev, audioBlob]);
        setCurrentRecording(audioBlob);
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      onRecordingStart?.();
      
      // Start timer
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Microphone access denied. Please allow microphone access to record voice notes.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onRecordingStop?.();
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playRecording = (recording: Blob) => {
    if (audioRef.current) {
      const audioUrl = URL.createObjectURL(recording);
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
    }
  };

  const deleteRecording = (index: number) => {
    setRecordings(prev => prev.filter((_, i) => i !== index));
    if (currentRecording === recordings[index]) {
      setCurrentRecording(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Recording Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600"
            Icon={Mic}
          >
            <span className="sr-only">Start Recording</span>
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700"
            Icon={MicOff}
          >
            <span className="sr-only">Stop Recording</span>
          </Button>
        )}
        
        {isRecording && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-red-500 font-semibold"
          >
            {formatTime(recordingTime)}
          </motion.div>
        )}
      </div>

      {/* Current Recording */}
      {currentRecording && (
        <div className="p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-foreground">Current Recording</h4>
              <p className="text-sm text-foreground/60">
                {formatTime(Math.floor(currentRecording.size / 1000))} • Ready to process
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => playRecording(currentRecording)}
                size="sm"
                variant="outline"
                Icon={isPlaying ? Pause : Play}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                onClick={() => {
                  setCurrentRecording(null);
                  setRecordings(prev => prev.slice(0, -1));
                }}
                size="sm"
                variant="outline"
                Icon={Trash2}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Previous Recordings */}
      {recordings.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Previous Recordings</h4>
          {recordings.map((recording, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => playRecording(recording)}
                  size="sm"
                  variant="outline"
                  Icon={isPlaying ? Pause : Play}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <span className="text-sm text-foreground/60">
                  Recording {index + 1} • {formatTime(Math.floor(recording.size / 1000))}
                </span>
              </div>
              <Button
                onClick={() => deleteRecording(index)}
                size="sm"
                variant="outline"
                Icon={Trash2}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} />
    </div>
  );
}

