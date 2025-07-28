import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import '../types/speech.d.ts';

interface JarvisVoiceAssistantProps {}

const JarvisVoiceAssistant: React.FC<JarvisVoiceAssistantProps> = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const lastCommandRef = useRef<string>('');
  const commandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Initialize JARVIS on component mount
  useEffect(() => {
    initializeJarvis();
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Greet user when JARVIS is initialized
  useEffect(() => {
    if (isInitialized && !hasGreeted) {
      setTimeout(() => {
        speak("Good day, sir. JARVIS at your service. How may I assist you today?");
        setHasGreeted(true);
      }, 1000);
    }
  }, [isInitialized, hasGreeted]);

  const initializeJarvis = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          const command = finalTranscript.toLowerCase().trim();
          setTranscript(finalTranscript);
          
          // Prevent duplicate commands
          if (command !== lastCommandRef.current) {
            // Clear any existing timeout
            if (commandTimeoutRef.current) {
              clearTimeout(commandTimeoutRef.current);
            }
            
            // Set new command and process after a short delay to prevent duplicates
            lastCommandRef.current = command;
            commandTimeoutRef.current = setTimeout(() => {
              processCommand(command);
              lastCommandRef.current = '';
            }, 500);
          }
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      synthRef.current = window.speechSynthesis;
      setIsInitialized(true);
    } else {
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive",
      });
    }
  };

  const speak = useCallback((text: string) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 0.9;
      utterance.volume = 0.9;
      
      // Wait for voices to load, then select the best one
      const setVoice = () => {
        const voices = synthRef.current?.getVoices() || [];
        
        // Priority order for more robotic/AI voices
        const preferredVoices = [
          'Microsoft David - English (United States)',
          'Google UK English Male',
          'Alex',
          'Daniel',
          'Microsoft Mark - English (United States)',
          'Google US English'
        ];
        
        let selectedVoice = voices.find(voice => 
          preferredVoices.some(preferred => voice.name.includes(preferred.split(' - ')[0]))
        );
        
        // Fallback to any male voice or first available
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('male') || 
            voice.name.toLowerCase().includes('david') ||
            voice.name.toLowerCase().includes('mark')
          ) || voices[0];
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log('Selected voice:', selectedVoice.name);
        }
      };

      // Set voice immediately if available, or wait for them to load
      if (synthRef.current.getVoices().length > 0) {
        setVoice();
      } else {
        synthRef.current.onvoiceschanged = setVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setResponse(text);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      synthRef.current.speak(utterance);
    }
  }, []);

  const processCommand = useCallback((command: string) => {
    console.log('Processing command:', command);
    console.log('Command length:', command.length);
    console.log('Command words:', command.split(' '));
    
    // Stop listening while processing
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }

    let response = '';
    let action = null;

    // Clean and normalize command
    const cleanCommand = command.toLowerCase().trim();
    console.log('Clean command:', cleanCommand);

    // Command processing logic with better matching
    if (cleanCommand.includes('hello') || cleanCommand.includes('hi')) {
      response = "Hello, sir. How may I assist you?";
    } else if (cleanCommand.includes('time')) {
      const now = new Date();
      response = `The current time is ${now.toLocaleTimeString()}.`;
    } else if (cleanCommand.includes('date')) {
      const now = new Date();
      response = `Today is ${now.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}.`;
    } else if (cleanCommand.includes('weather')) {
      response = "Let me search for current weather for you, sir.";
      action = () => window.open('https://google.com/search?q=current+weather', '_blank');
    } else if (cleanCommand.includes('youtube')) {
      console.log('YouTube command detected');
      response = "Opening YouTube for you, sir.";
      action = () => {
        console.log('Opening YouTube...');
        window.open('https://www.youtube.com', '_blank');
      };
    } else if (cleanCommand.includes('google') && !cleanCommand.includes('maps')) {
      console.log('Google command detected');
      response = "Opening Google for you, sir.";
      action = () => {
        console.log('Opening Google...');
        window.open('https://www.google.com', '_blank');
      };
    } else if (cleanCommand.includes('gmail')) {
      console.log('Gmail command detected');
      response = "Opening Gmail for you, sir.";
      action = () => {
        console.log('Opening Gmail...');
        window.open('https://www.gmail.com', '_blank');
      };
    } else if (cleanCommand.includes('netflix')) {
      console.log('Netflix command detected');
      response = "Opening Netflix for you, sir.";
      action = () => {
        console.log('Opening Netflix...');
        window.open('https://www.netflix.com', '_blank');
      };
    } else if (cleanCommand.includes('spotify')) {
      console.log('Spotify command detected');
      response = "Opening Spotify for you, sir.";
      action = () => {
        console.log('Opening Spotify...');
        window.open('https://www.spotify.com', '_blank');
      };
    } else if (cleanCommand.includes('facebook')) {
      console.log('Facebook command detected');
      response = "Opening Facebook for you, sir.";
      action = () => {
        console.log('Opening Facebook...');
        window.open('https://www.facebook.com', '_blank');
      };
    } else if (cleanCommand.includes('twitter') || cleanCommand.includes(' x ') || cleanCommand.includes('open x')) {
      console.log('Twitter/X command detected');
      response = "Opening X for you, sir.";
      action = () => {
        console.log('Opening X/Twitter...');
        window.open('https://www.x.com', '_blank');
      };
    } else if (cleanCommand.includes('instagram')) {
      console.log('Instagram command detected');
      response = "Opening Instagram for you, sir.";
      action = () => {
        console.log('Opening Instagram...');
        window.open('https://www.instagram.com', '_blank');
      };
    } else if (cleanCommand.includes('maps')) {
      console.log('Maps command detected');
      response = "Opening Google Maps for you, sir.";
      action = () => {
        console.log('Opening Google Maps...');
        window.open('https://www.maps.google.com', '_blank');
      };
    } else if (cleanCommand.includes('news')) {
      console.log('News command detected');
      response = "Opening Google News for you, sir.";
      action = () => {
        console.log('Opening Google News...');
        window.open('https://news.google.com', '_blank');
      };
    } else if (cleanCommand.includes('search for ') || cleanCommand.includes('search ')) {
      const searchTerm = cleanCommand.replace(/search for |search /, '');
      console.log('Search command detected for:', searchTerm);
      response = `Searching for ${searchTerm} on Google, sir.`;
      action = () => {
        console.log('Opening search for:', searchTerm);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
      };
    } else if (cleanCommand.includes('thank you') || cleanCommand.includes('thanks')) {
      response = "You're welcome, sir. Is there anything else I can assist you with?";
    } else if (cleanCommand.includes('stop') || cleanCommand.includes('exit') || cleanCommand.includes('quit')) {
      response = "Shutting down voice recognition. Have a great day, sir.";
      action = () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        setIsListening(false);
      };
    } else {
      // For any unknown command, treat it as a search query
      console.log('Unknown command, treating as search:', cleanCommand);
      response = `Let me search for "${cleanCommand}" for you, sir.`;
      action = () => {
        console.log('Opening search for unknown command:', cleanCommand);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(cleanCommand)}`, '_blank');
      };
    }

    // Execute the response and action
    console.log('About to execute action:', action ? 'YES' : 'NO');
    
    // Execute action immediately to avoid popup blockers
    if (action) {
      console.log('Executing action now...');
      try {
        action();
        console.log('Action executed successfully');
      } catch (error) {
        console.error('Action execution failed:', error);
      }
    }
    
    // Speak the response after action
    setTimeout(() => {
      speak(response);
    }, 300);

    // Clear transcript after processing
    setTimeout(() => {
      setTranscript('');
    }, 3000);
  }, [speak, isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setResponse('');
      recognitionRef.current.start();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
      {/* JARVIS Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold jarvis-text mb-4">
          J.A.R.V.I.S
        </h1>
        <p className="text-xl text-muted-foreground">
          Just A Rather Very Intelligent System
        </p>
      </div>

      {/* Main Voice Interface */}
      <div className="relative flex flex-col items-center space-y-8">
        {/* Voice Visualizer Rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring */}
          <div className={`absolute w-80 h-80 rounded-full border-2 border-jarvis-glow/20 ${isListening ? 'jarvis-ring' : ''}`} />
          
          {/* Middle ring */}
          <div className={`absolute w-64 h-64 rounded-full border-2 border-jarvis-pulse/30 ${isListening ? 'jarvis-ring' : ''}`} 
               style={{ animationDelay: '0.5s', animationDuration: '15s' }} />
          
          {/* Inner ring */}
          <div className={`absolute w-48 h-48 rounded-full border-2 border-jarvis-ring/40 ${isListening ? 'jarvis-ring' : ''}`}
               style={{ animationDelay: '1s', animationDuration: '10s' }} />

          {/* Central Orb */}
          <div className={`relative w-32 h-32 rounded-full jarvis-orb flex items-center justify-center backdrop-blur-sm border border-jarvis-glow/30 ${
            isListening ? 'jarvis-active' : ''
          } ${isSpeaking ? 'animate-pulse' : ''}`}>
            <Button
              onClick={toggleListening}
              variant="ghost"
              size="icon"
              className="w-full h-full rounded-full border-0 bg-transparent hover:bg-transparent"
              disabled={!isInitialized}
            >
              {isListening ? (
                <Mic className="w-12 h-12 text-jarvis-glow" />
              ) : isSpeaking ? (
                <Volume2 className="w-12 h-12 text-jarvis-pulse animate-pulse" />
              ) : (
                <MicOff className="w-10 h-10 text-jarvis-glow/60" />
              )}
            </Button>
          </div>

          {/* Scanning effect when listening */}
          {isListening && (
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="jarvis-scanner absolute top-0 left-0 w-full h-2" />
            </div>
          )}
        </div>

        {/* Status Display */}
        <div className="text-center space-y-4 max-w-2xl">
          {isListening && (
            <div className="bg-card/50 backdrop-blur-sm border border-jarvis-glow/20 rounded-lg p-4">
              <p className="text-sm text-jarvis-glow mb-2">Listening...</p>
              {transcript && (
                <p className="text-foreground font-medium">"{transcript}"</p>
              )}
            </div>
          )}

          {isSpeaking && response && (
            <div className="bg-card/50 backdrop-blur-sm border border-jarvis-pulse/20 rounded-lg p-4">
              <p className="text-sm text-jarvis-pulse mb-2">JARVIS:</p>
              <p className="text-foreground font-medium">"{response}"</p>
            </div>
          )}

          {!isListening && !isSpeaking && hasGreeted && (
            <div className="bg-card/30 backdrop-blur-sm border border-border/20 rounded-lg p-4">
              <p className="text-muted-foreground">
                Click the microphone to start voice commands
              </p>
            </div>
          )}
        </div>

        {/* Command Examples */}
        <div className="bg-card/20 backdrop-blur-sm border border-border/20 rounded-lg p-6 max-w-2xl">
          <h3 className="text-lg font-semibold text-jarvis-glow mb-4">Voice Commands:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>"Open YouTube"</div>
            <div>"Open Google"</div>
            <div>"What time is it?"</div>
            <div>"What's the date?"</div>
            <div>"Search for [anything]"</div>
            <div>"Open Gmail"</div>
            <div>"Open Netflix"</div>
            <div>"Open Maps"</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JarvisVoiceAssistant;
