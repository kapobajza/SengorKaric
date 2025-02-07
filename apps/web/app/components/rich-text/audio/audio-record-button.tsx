import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { useCallback, useImperativeHandle, useRef } from "react";
import { Mic } from "lucide-react";

export function AudioRecordButton({
  onRecordingStop,
  isRecording,
  setIsRecording,
  ref,
  ...rest
}: {
  onRecordingStop: (data: Blob) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  ref: React.RefObject<{ stop: () => void } | null>;
} & Omit<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  "ref"
>) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Ref to store MediaRecorder
  const streamRef = useRef<MediaStream | null>(null); // Ref to store the MediaStream

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        onRecordingStop(event.data); // Pass the audio data to the callback
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && streamRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      }); // Stop all tracks
    }
    setIsRecording(false);
  }, [setIsRecording]);

  useImperativeHandle(
    ref,
    () => ({
      stop() {
        stopRecording();
      },
    }),
    [stopRecording],
  );

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      void startRecording();
    }
  };

  return (
    <button onClick={toggleRecording} {...rest}>
      <span className="sr-only">Record audio</span>
      <Mic />
    </button>
  );
}
