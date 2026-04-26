import { useState, useEffect, useCallback } from 'react';
import Voice, { SpeechResultsEvent } from 'react-native-voice';
import Tts from 'react-native-tts';
import { VoiceCommand } from '../types';

export const useVoice = (commands: VoiceCommand[] = []) => {
  const [isListening, setIsListening] = useState(false);
  const [lastResult, setLastResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechError = (e) => {
      setIsListening(false);
      setError(e.error?.message || 'Voice recognition error');
    };
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      const results = e.value;
      if (results && results.length > 0) {
        const text = results[0].toLowerCase();
        setLastResult(text);
        
        // Find matching command
        for (const cmd of commands) {
          if (cmd.keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
            cmd.action();
            break;
          }
        }
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [commands]);

  const startListening = useCallback(async () => {
    setError(null);
    try {
      await Voice.start('en-US');
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const stopListening = useCallback(async () => {
    try {
      await Voice.stop();
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const speak = useCallback((text: string) => {
    Tts.speak(text);
  }, []);

  return {
    isListening,
    lastResult,
    error,
    startListening,
    stopListening,
    speak,
  };
};
