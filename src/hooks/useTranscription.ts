// src/hooks/useTranscription.ts
import { useState, useEffect, useCallback, useRef } from 'react';

export const useTranscription = (isActive: boolean) => {
    const [transcript, setTranscript] = useState<string>("");
    const recognitionRef = useRef<any>(null);

    const startTranscription = useCallback(() => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setTranscript(prev => (prev ? prev + " " + finalTranscript : finalTranscript));
                }
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                if (event.error === 'not-allowed') {
                    // Handle permission denied
                }
            };
        }

        try {
            recognitionRef.current.start();
        } catch (e) {
            // Already started or other error
        }
    }, []);

    const stopTranscription = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const clearTranscript = useCallback(() => {
        setTranscript("");
    }, []);

    useEffect(() => {
        if (isActive) {
            startTranscription();
        } else {
            stopTranscription();
        }
    }, [isActive, startTranscription, stopTranscription]);

    return { transcript, clearTranscript };
};
