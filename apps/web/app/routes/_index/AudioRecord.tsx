import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useRef,
  useState,
} from "react";

export default function AudioRecord({
  onRecordingStop,
  ...rest
}: {
  onRecordingStop: (data: Blob) => void;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  const [isRecording, setIsRecording] = useState(false);
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
        console.log("Blob MIME type:", event.data.type);
        onRecordingStop(event.data); // Pass the audio data to the callback
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && streamRef.current) {
      mediaRecorderRef.current.stop();
      streamRef.current.getTracks().forEach((track) => track.stop()); // Stop all tracks
    }
    setIsRecording(false);
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <button
      onClick={toggleRecording}
      style={{ marginBottom: "10px" }}
      {...rest}
    >
      {isRecording ? "Stop Recording" : "Start Recording"}
    </button>
  );
}
