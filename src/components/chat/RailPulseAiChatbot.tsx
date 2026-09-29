import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRailway, ActiveTab } from '../../context/RailwayContext';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  Minimize2,
  Maximize2,
  RotateCcw,
  Globe,
  ArrowRight,
  ExternalLink,
  Volume2,
  VolumeX,
  Navigation,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Check,
  Mic,
  MicOff,
  Radio,
  Sliders,
  Train as TrainIcon,
  Headphones,
  CheckCircle2,
  Zap,
  Play,
  Pause,
  Moon,
  Sun,
  BookmarkCheck,
  ArrowLeft
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string }[];
  executedActionNotice?: string;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (IN)', speechCode: 'en-IN', flag: '🇮🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', speechCode: 'kn-IN', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', speechCode: 'ml-IN', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', speechCode: 'pa-IN', flag: '🇮🇳' }
];

const VOICE_COMMAND_EXAMPLES: Record<string, { label: string; command: string }[]> = {
  hi: [
    { label: 'लाइव मैप दिखाओ 🗺️', command: 'लाइव मैप दिखाओ' },
    { label: 'शिकायत दर्ज करो ⚠️', command: 'कोच में सफाई की शिकायत दर्ज करो' },
    { label: 'वंदे भारत चुनो 🚄', command: 'वंदे भारत ट्रेन चुनो' },
    { label: 'प्लेटफॉर्म गाइड 📍', command: 'कोच B4 का प्लेटफॉर्म दिखाओ' },
    { label: 'सिम्युलेशन शुरू करो ⚡', command: 'सिम्युलेशन शुरू करो' },
    { label: 'डार्क मोड 🌙', command: 'डार्क मोड करो' },
    { label: 'स्टेशन खोजो 🏢', command: 'स्टेशन खोजक खोलो' }
  ],
  mr: [
    { label: 'थेट नकाशा दाखवा 🗺️', command: 'थेट नकाशा दाखवा' },
    { label: 'तक्रार नोंदवा ⚠️', command: 'अस्वच्छतेची तक्रार नोंदवा' },
    { label: 'फलाट माहिती 📍', command: 'फलाट क्रमांक दाखवा' },
    { label: 'वेळापत्रक पहा ⏱️', command: 'वेळापत्रक दाखवा' },
    { label: 'वंदे भारत निवडा 🚄', command: 'वंदे भारत निवडा' }
  ],
  gu: [
    { label: 'લાઈવ નકશો બતાવો 🗺️', command: 'લાઈવ નકશો બતાવો' },
    { label: 'ફરિયાદ નોંધાવો ⚠️', command: 'સફાઈ અંગે ફરિયાદ કરો' },
    { label: 'પ્લેટફોર્મ ગાઈડ 📍', command: 'પ્લેટફોર્મ ગાઈડ બતાવો' },
    { label: 'સ્ટેશન શોધો 🏢', command: 'સ્ટેશન શોધો' }
  ],
  en: [
    { label: 'Live GPS Map 🗺️', command: 'Show live satellite map' },
    { label: 'Report Issue ⚠️', command: 'Report washroom cleaning needed in coach B4' },
    { label: 'Switch to Vande Bharat 🚄', command: 'Switch train to Vande Bharat Express' },
    { label: 'Platform & Coach 📍', command: 'Where is my coach B4?' },
    { label: 'Start Simulation ⚡', command: 'Start simulation' },
    { label: 'Toggle Dark Theme 🌙', command: 'Switch to dark mode' },
    { label: 'Find Stations 🏢', command: 'Find stations' },
    { label: 'Save Journey 🔖', command: 'Save this journey' }
  ]
};

// Subtle Web Audio tones for feedback during voice recognition
const playAudioChime = (type: 'start' | 'stop' | 'success') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'start') {
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } else if (type === 'stop') {
      osc.frequency.setValueAtTime(720, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(480, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    } else {
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    }
  } catch {
    // Ignore audio context autoplay restrictions
  }
};

interface RailPulseAiChatbotProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onOpenReportIssue?: () => void;
  onOpenStationFinder?: () => void;
  onOpenSearchTrain?: () => void;
}

export const RailPulseAiChatbot: React.FC<RailPulseAiChatbotProps> = ({
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  onOpenReportIssue,
  onOpenStationFinder,
  onOpenSearchTrain
}) => {
  const {
    activeTab,
    setActiveTab,
    canGoBack,
    goBack,
    selectedTrain,
    setSelectedTrain,
    trains,
    gps,
    theme,
    setTheme,
    addAlert,
    saveCurrentJourney,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setSimSpeed
  } = useRailway();
  const isDark = theme === 'dark';

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleOpen = controlledOnToggle || (() => setInternalIsOpen(!internalIsOpen));

  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [showLanguagePicker, setShowLanguagePicker] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [autoSpeakEnabled, setAutoSpeakEnabled] = useState<boolean>(true);
  const [continuousVoiceMode, setContinuousVoiceMode] = useState<boolean>(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);

  // Speech Recognition state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `Hello! I am **Saarthi AI** (सारथी), your voice-first rail travel companion. You can talk to me in **Hindi, Marathi, Gujarati, English** or any native language to control the entire app hands-free.\n\nActive train: **${selectedTrain.name} (${selectedTrain.number})**. Try saying *"Live map dikhao"* or *"Report dirty coach"*!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: 'Live Train Map', action: 'navigate:gps' },
        { label: 'Platform & Coach Finder', action: 'navigate:station_guide' },
        { label: 'Find Stations', action: 'modal:station_finder' },
        { label: 'Report Issue', action: 'modal:report_issue' }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLangObj =
    SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  // 1. EXECUTE ACTIONS WITHIN THE APP (Total App Control)
  const executeAppAction = useCallback(
    (actionObj: { type: string; payload?: any } | string) => {
      let type = '';
      let payload: any = {};

      if (typeof actionObj === 'string') {
        const raw = actionObj;
        if (raw.startsWith('navigate:')) {
          type = 'NAVIGATE';
          payload = { tab: raw.split(':')[1] };
        } else if (raw.startsWith('modal:')) {
          type = 'OPEN_MODAL';
          payload = { modal: raw.split(':')[1] };
        } else if (raw.startsWith('select_train:')) {
          type = 'SWITCH_TRAIN';
          payload = { trainNumber: raw.split(':')[1] };
        } else if (raw.startsWith('simulation:')) {
          const parts = raw.split(':');
          type = 'SIMULATION_CONTROL';
          payload = { action: parts[1], speed: parts[2] ? Number(parts[2]) : undefined };
        } else if (raw.startsWith('theme:')) {
          type = 'SET_THEME';
          payload = { theme: raw.split(':')[1] };
        } else if (raw === 'save_journey') {
          type = 'SAVE_JOURNEY';
        } else if (raw === 'go_back') {
          type = 'GO_BACK';
        } else if (raw.startsWith('set_language:')) {
          type = 'SET_LANGUAGE';
          payload = { language: raw.split(':')[1] };
        } else if (raw === 'gps') {
          type = 'NAVIGATE';
          payload = { tab: 'gps' };
        } else if (raw === 'station_guide') {
          type = 'NAVIGATE';
          payload = { tab: 'station_guide' };
        } else if (raw === 'report_issue') {
          type = 'OPEN_MODAL';
          payload = { modal: 'report_issue' };
        } else if (raw === 'find_stations') {
          type = 'OPEN_MODAL';
          payload = { modal: 'station_finder' };
        } else if (raw === 'timeline') {
          type = 'NAVIGATE';
          payload = { tab: 'timeline' };
        } else if (raw === 'connection') {
          type = 'NAVIGATE';
          payload = { tab: 'connection' };
        } else if (raw === 'discovery') {
          type = 'NAVIGATE';
          payload = { tab: 'discovery' };
        }
      } else {
        type = actionObj.type;
        payload = actionObj.payload || {};
      }

      let notice = '';

      if (type === 'NAVIGATE' && payload.tab) {
        const tab = payload.tab as ActiveTab;
        setActiveTab(tab);
        notice = `Navigated to ${tab.replace('_', ' ').toUpperCase()}`;
      } else if (type === 'OPEN_MODAL') {
        if (payload.modal === 'report_issue') {
          if (onOpenReportIssue) onOpenReportIssue();
          else window.dispatchEvent(new CustomEvent('open-report-issue'));
          notice = 'Opened Issue Reporting Form';
        } else if (payload.modal === 'station_finder') {
          if (onOpenStationFinder) onOpenStationFinder();
          else window.dispatchEvent(new CustomEvent('open-station-finder'));
          notice = 'Opened Station Finder';
        } else if (payload.modal === 'search_train') {
          if (onOpenSearchTrain) onOpenSearchTrain();
          else window.dispatchEvent(new CustomEvent('open-search-train'));
          notice = 'Opened Train Search';
        }
      } else if (type === 'SWITCH_TRAIN') {
        const match = trains.find(t => t.number === payload.trainNumber);
        if (match) {
          setSelectedTrain(match);
          notice = `Switched active train to ${match.name} (${match.number})`;
        }
      } else if (type === 'SIMULATION_CONTROL') {
        if (payload.action === 'start') {
          setActiveTab('simulation');
          startSimulation();
          notice = 'Railway simulation started';
        } else if (payload.action === 'pause') {
          pauseSimulation();
          notice = 'Simulation paused';
        } else if (payload.action === 'reset') {
          resetSimulation();
          notice = 'Simulation reset';
        } else if (payload.action === 'speed' && payload.speed) {
          setSimSpeed(payload.speed as 1 | 2 | 5);
          notice = `Simulation speed set to ${payload.speed}x`;
        }
      } else if (type === 'SET_THEME') {
        if (payload.theme === 'dark' || payload.theme === 'light') {
          setTheme(payload.theme);
          notice = `Switched to ${payload.theme} theme`;
        }
      } else if (type === 'SAVE_JOURNEY') {
        saveCurrentJourney('4820194829', 'B4', '24');
        notice = 'Journey saved to My Journeys';
      } else if (type === 'REPORT_ISSUE') {
        addAlert({
          type: 'ROUTE_DISRUPTION',
          title: 'Passenger Issue Logged',
          message: payload.description || 'Assistance requested via Saarthi AI',
          severity: 'warning',
          category: 'journey'
        });
        notice = 'On-board issue registered with superintendent';
      } else if (type === 'GO_BACK') {
        goBack();
        notice = 'Returned to previous screen';
      } else if (type === 'SET_LANGUAGE') {
        if (payload.language) {
          setSelectedLanguage(payload.language);
          notice = `Language switched to ${payload.language.toUpperCase()}`;
        }
      }

      if (notice) {
        setVoiceNotice(notice);
        setTimeout(() => setVoiceNotice(null), 3500);
      }
      return notice;
    },
    [
      setActiveTab,
      setSelectedTrain,
      trains,
      setTheme,
      saveCurrentJourney,
      addAlert,
      goBack,
      startSimulation,
      pauseSimulation,
      resetSimulation,
      setSimSpeed,
      onOpenReportIssue,
      onOpenStationFinder,
      onOpenSearchTrain
    ]
  );

  // 2. TEXT-TO-SPEECH (TTS) - Multilingual Voice Readout
  const speakText = useCallback(
    (text: string, onComplete?: () => void) => {
      if (!('speechSynthesis' in window)) {
        if (onComplete) onComplete();
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[*#_`]/g, '')
        .replace(/\[ACTION:[^\]]+\]/g, '')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = currentLangObj.speechCode;
      utterance.rate = 0.98;
      utterance.pitch = 1.0;

      // Select matching regional voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        v =>
          v.lang.toLowerCase().startsWith(currentLangObj.speechCode.toLowerCase()) ||
          v.lang.toLowerCase().includes(currentLangObj.code) ||
          (currentLangObj.code === 'en' && v.lang.includes('IN'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onComplete) onComplete();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (onComplete) onComplete();
      };

      window.speechSynthesis.speak(utterance);
    },
    [currentLangObj]
  );

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // 3. SEND MESSAGE & PROCESS AI ACTIONS
  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputMessage).trim();
    if (!messageContent || isLoading) return;

    // Check for instant client-side intent matching for ultra-fast native speech execution
    const p = messageContent.toLowerCase();
    let instantNotice = '';

    if (/लाइव मैप|लाइव नक़्शा|नकाशा|લાઈવ નકશો|show live map|live map|track train/i.test(p)) {
      instantNotice = executeAppAction('navigate:gps');
    } else if (/प्लेटफॉर्म|फलाट|પ્લેટફોર્મ|platform guide|coach position/i.test(p)) {
      instantNotice = executeAppAction('navigate:station_guide');
    } else if (/शिकायत|तक्रार|ફરિયાદ|report issue|complain|toilet dirty|water short/i.test(p)) {
      instantNotice = executeAppAction('modal:report_issue');
    } else if (/स्टेशन खोज|स्टेशन ढूंढ|स्थानक शोधा|સ્ટેશન શોધો|find station/i.test(p)) {
      instantNotice = executeAppAction('modal:station_finder');
    } else if (/वंदे भारत|20901|vande bharat/i.test(p)) {
      instantNotice = executeAppAction('select_train:20901');
    } else if (/शताब्दी|12002|shatabdi/i.test(p)) {
      instantNotice = executeAppAction('select_train:12002');
    } else if (/राजधानी|12951|rajdhani/i.test(p)) {
      instantNotice = executeAppAction('select_train:12951');
    } else if (/डार्क मोड|dark theme|dark mode/i.test(p)) {
      instantNotice = executeAppAction('theme:dark');
    } else if (/लाइट मोड|light theme|light mode/i.test(p)) {
      instantNotice = executeAppAction('theme:light');
    } else if (/सिम्युलेशन शुरू|start simulation/i.test(p)) {
      instantNotice = executeAppAction('simulation:start');
    } else if (/सिम्युलेशन रोको|stop simulation|pause simulation/i.test(p)) {
      instantNotice = executeAppAction('simulation:pause');
    } else if (/यात्रा सेव|save journey/i.test(p)) {
      instantNotice = executeAppAction('save_journey');
    } else if (/पीछे जाओ|वापस जाओ|go back/i.test(p)) {
      instantNotice = executeAppAction('go_back');
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          language: selectedLanguage,
          userContext: {
            trainNumber: selectedTrain.number,
            trainName: selectedTrain.name,
            source: selectedTrain.source,
            destination: selectedTrain.destination,
            speed: gps.speedKmph
          }
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      // Execute actions returned from server
      let executedNotices: string[] = [];
      if (data.executedActions && Array.isArray(data.executedActions)) {
        data.executedActions.forEach((act: any) => {
          const res = executeAppAction(act);
          if (res) executedNotices.push(res);
        });
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am ready to assist with your journey.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: data.suggestedActions || [],
        executedActionNotice: executedNotices.join(', ') || instantNotice
      };

      setMessages(prev => [...prev, botMsg]);

      // If auto-speak is enabled, speak the answer aloud
      if (autoSpeakEnabled) {
        speakText(botMsg.content, () => {
          // In continuous voice mode, reopen the mic when assistant finishes speaking!
          if (continuousVoiceMode) {
            setTimeout(() => startListening(), 400);
          }
        });
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackContent =
        selectedLanguage === 'hi'
          ? `आपकी ट्रेन **${selectedTrain.name} (${selectedTrain.number})** 94 किमी/घंटे की गति से चल रही है। किसी भी असुविधा या ऑन-बोर्ड शिकायत के लिए आप 139 (RailMadad) पर संपर्क कर सकते हैं।`
          : `Your train **${selectedTrain.name} (${selectedTrain.number})** is active. Current speed is ${gps.speedKmph} km/h. For RailMadad assistance, dial 139.`;

      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: fallbackContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Live Train Map', action: 'navigate:gps' },
          { label: 'Platform Guide', action: 'navigate:station_guide' }
        ]
      };
      setMessages(prev => [...prev, fallbackMsg]);

      if (autoSpeakEnabled) {
        speakText(fallbackMsg.content);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 4. SPEECH RECOGNITION (STT) - Robust Multilingual Voice Input
  const startListening = useCallback(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setVoiceNotice('Voice recognition is not supported in this browser. Please use text or quick chips.');
      setTimeout(() => setVoiceNotice(null), 4000);
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    // Stop TTS if speaking when user activates mic
    stopSpeaking();

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = currentLangObj.speechCode;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
        playAudioChime('start');
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
        }

        if (final) {
          setInterimTranscript(final);
          setInputMessage(final);
          playAudioChime('success');
          // Auto-send recognized native speech
          setTimeout(() => {
            handleSendMessage(final);
            setInterimTranscript('');
          }, 300);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        setInterimTranscript('');
        playAudioChime('stop');
        if (event.error === 'not-allowed') {
          setVoiceNotice('Microphone access denied. Please grant permission in browser settings.');
          setTimeout(() => setVoiceNotice(null), 4500);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        playAudioChime('stop');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition:', e);
      setIsListening(false);
    }
  }, [currentLangObj, isListening, handleSendMessage]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Global open-railpulse-ai listener
  useEffect(() => {
    const handleOpenAi = (e: Event) => {
      setInternalIsOpen(true);
      const customEvent = e as CustomEvent;
      if (customEvent?.detail?.language) {
        setSelectedLanguage(customEvent.detail.language);
      }
      if (customEvent?.detail?.autoStartVoice) {
        setTimeout(() => startListening(), 300);
      }
    };
    window.addEventListener('open-railpulse-ai', handleOpenAi);
    return () => window.removeEventListener('open-railpulse-ai', handleOpenAi);
  }, [startListening]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, interimTranscript]);

  const handleResetChat = () => {
    stopSpeaking();
    stopListening();
    setMessages([
      {
        id: 'msg-welcome-reset',
        role: 'assistant',
        content:
          selectedLanguage === 'hi'
            ? `नमस्ते! मैं आपका **रेलपल्स एआई सहायक** हूँ। आप मुझे आवाज से ट्रेन स्थिति, कोच गाइड, भोजन व ऑन-बोर्ड सहायता का निर्देश दे सकते हैं।`
            : `Hello! How can I assist your journey on **${selectedTrain.name} (${selectedTrain.number})** today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Live Train Map', action: 'navigate:gps' },
          { label: 'Platform & Coach', action: 'navigate:station_guide' },
          { label: 'Find Stations', action: 'modal:station_finder' },
          { label: 'Report Issue', action: 'modal:report_issue' }
        ]
      }
    ]);
  };

  const currentVoiceSuggestions =
    VOICE_COMMAND_EXAMPLES[selectedLanguage] || VOICE_COMMAND_EXAMPLES.en;

  return (
    <>
      {/* 1. FLOATING VOICE LAUNCHER BUTTON */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          aria-label="Open RailPulse Multilingual AI Voice Assistant"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-linear-to-r from-blue-600 via-indigo-600 to-teal-500 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
        >
          <div className="relative">
            <Bot className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight pr-1 flex items-center gap-1.5">
            <span>Saarthi AI</span>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold">
              <Mic className="h-2.5 w-2.5 animate-pulse text-amber-300" />
              <span>Voice</span>
            </span>
          </span>
          <Sparkles className="h-4 w-4 opacity-80 group-hover:rotate-12 transition-transform text-amber-300" />
        </button>
      )}

      {/* 2. CHATBOT WINDOW */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-200 flex flex-col shadow-2xl rounded-2xl border overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-6 md:inset-10'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[95vw] sm:w-[460px] h-[600px] max-h-[92vh]'
          } ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-slate-100'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3 border-b flex items-center justify-between shrink-0 bg-linear-to-r ${
              isDark
                ? 'from-slate-950 via-slate-900 to-indigo-950/60 border-slate-800'
                : 'from-slate-900 via-indigo-950 to-blue-900 text-white border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 relative">
                <Bot className="h-5 w-5" />
                {isListening && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-none">
                    Saarthi AI Voice Companion
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Native Voice Control · Train {selectedTrain.number}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Hands-Free Voice Mode Toggle */}
              <button
                onClick={() => setContinuousVoiceMode(!continuousVoiceMode)}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                  continuousVoiceMode
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title={continuousVoiceMode ? 'Continuous Voice Talk is ON' : 'Turn ON Continuous Voice Conversation'}
              >
                <Headphones className="h-3.5 w-3.5" />
              </button>

              {/* Auto Speak Toggle */}
              <button
                onClick={() => {
                  setAutoSpeakEnabled(!autoSpeakEnabled);
                  if (isSpeaking) stopSpeaking();
                }}
                className={`p-1.5 rounded-lg transition-colors ${
                  autoSpeakEnabled
                    ? 'text-emerald-400 hover:bg-white/10'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/10'
                }`}
                title={autoSpeakEnabled ? 'Voice Readout Enabled' : 'Voice Readout Muted'}
              >
                {autoSpeakEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>

              {/* Language Selector Button */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguagePicker(!showLanguagePicker)}
                  className="px-2 py-1 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1"
                  title="Switch Language"
                >
                  <Globe className="h-3 w-3" />
                  <span className="font-mono text-[11px]">{currentLangObj.code.toUpperCase()}</span>
                </button>

                {showLanguagePicker && (
                  <div
                    className={`absolute right-0 top-full mt-1.5 w-48 rounded-xl border shadow-xl p-1 z-50 animate-in fade-in zoom-in-95 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Select Native Voice Language
                    </div>
                    <div className="space-y-0.5 max-h-56 overflow-y-auto">
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLanguage(lang.code);
                            setShowLanguagePicker(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            selectedLanguage === lang.code
                              ? 'bg-blue-600 text-white font-semibold'
                              : isDark
                              ? 'hover:bg-slate-800 text-slate-200'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span>{lang.nativeName}</span>
                          </span>
                          {selectedLanguage === lang.code && <Check className="h-3.5 w-3.5" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Chat */}
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title="Restart Chat"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              {/* Expand / Minimize */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
                title={isExpanded ? 'Minimize' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>

              {/* Close */}
              <button
                onClick={toggleOpen}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Language bar */}
          <div
            className={`px-3 py-1.5 border-b flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider shrink-0 ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Native Language:
            </span>
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`px-2 py-0.5 rounded-md font-medium transition-all whitespace-nowrap ${
                  selectedLanguage === lang.code
                    ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                    : isDark
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>

          {/* Action Notification Banner */}
          {voiceNotice && (
            <div className="px-3 py-1.5 bg-blue-600 text-white text-[11px] font-medium flex items-center justify-between shrink-0 animate-in fade-in slide-in-from-top-2">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                <span>{voiceNotice}</span>
              </span>
              <button onClick={() => setVoiceNotice(null)} className="opacity-70 hover:opacity-100">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map(msg => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="h-7 w-7 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed transition-all ${
                      isAssistant
                        ? isDark
                          ? 'bg-slate-800/80 border border-slate-700/80 text-slate-200'
                          : 'bg-slate-100/90 border border-slate-200/80 text-slate-800'
                        : 'bg-blue-600 text-white shadow-xs'
                    }`}
                  >
                    {/* Execution confirmation tag */}
                    {isAssistant && msg.executedActionNotice && (
                      <div className="mb-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Action: {msg.executedActionNotice}</span>
                      </div>
                    )}

                    {/* Message content */}
                    <div className="whitespace-pre-line space-y-1">
                      {msg.content.split('\n').map((line, idx) => {
                        const parts = line.split(/(\*\*[^*]+\*\*)/g);
                        return (
                          <p key={idx} className="min-h-[1em]">
                            {parts.map((p, pIdx) => {
                              if (p.startsWith('**') && p.endsWith('**')) {
                                return (
                                  <strong
                                    key={pIdx}
                                    className={
                                      isAssistant
                                        ? isDark
                                          ? 'text-white font-bold'
                                          : 'text-slate-900 font-bold'
                                        : 'font-bold'
                                    }
                                  >
                                    {p.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return p;
                            })}
                          </p>
                        );
                      })}
                    </div>

                    {/* Interactive Action Buttons */}
                    {isAssistant && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/30 flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => executeAppAction(act.action)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                              isDark
                                ? 'bg-slate-900 hover:bg-blue-950/40 text-blue-400 border-slate-700 hover:border-blue-500/50'
                                : 'bg-white hover:bg-blue-50 text-blue-600 border-slate-200 hover:border-blue-300 shadow-2xs'
                            }`}
                          >
                            <span>👉 {act.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Message Footer */}
                    <div className="flex items-center justify-between gap-3 mt-1.5 text-[10px] opacity-70">
                      <span>{msg.timestamp}</span>
                      {isAssistant && (
                        <button
                          onClick={() => {
                            if (isSpeaking) stopSpeaking();
                            else speakText(msg.content);
                          }}
                          className="hover:opacity-100 flex items-center gap-1 transition-opacity cursor-pointer"
                          title="Listen to message in native language"
                        >
                          {isSpeaking ? (
                            <VolumeX className="h-3 w-3 text-rose-400" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                          <span className="text-[9px]">{isSpeaking ? 'Stop' : 'Speak'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Listening Indicator with Audio Waveform */}
            {isListening && (
              <div
                className={`p-3 rounded-2xl border flex flex-col gap-2 animate-in fade-in duration-200 ${
                  isDark
                    ? 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                    <span className="text-xs font-bold">
                      Listening in {currentLangObj.nativeName}...
                    </span>
                  </div>

                  {/* Pulsing Audio Bar Waves */}
                  <div className="flex items-center gap-1 h-4">
                    <span className="w-1 bg-rose-500 rounded-full animate-bounce h-3"></span>
                    <span
                      className="w-1 bg-rose-500 rounded-full animate-bounce h-4"
                      style={{ animationDelay: '0.15s' }}
                    ></span>
                    <span
                      className="w-1 bg-rose-500 rounded-full animate-bounce h-2"
                      style={{ animationDelay: '0.3s' }}
                    ></span>
                    <span
                      className="w-1 bg-rose-500 rounded-full animate-bounce h-4"
                      style={{ animationDelay: '0.45s' }}
                    ></span>
                  </div>
                </div>

                {interimTranscript && (
                  <p className="text-xs font-medium italic opacity-90 pl-5">
                    "{interimTranscript}"
                  </p>
                )}
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-9 animate-pulse">
                <Bot className="h-4 w-4 animate-spin text-blue-500" />
                <span>Saarthi is thinking in {currentLangObj.nativeName}...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Native Voice Command Chips */}
          <div
            className={`px-3 py-2 border-t flex items-center gap-1.5 overflow-x-auto shrink-0 ${
              isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/70 border-slate-100'
            }`}
          >
            <span
              className={`text-[10px] font-semibold shrink-0 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Voice Actions:
            </span>
            {currentVoiceSuggestions.map((sugg, sIdx) => (
              <button
                key={sIdx}
                onClick={() => handleSendMessage(sugg.command)}
                className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors border cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-blue-500 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 shadow-2xs'
                }`}
              >
                {sugg.label}
              </button>
            ))}
          </div>

          {/* Input & Voice Controls */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className={`p-3 border-t flex items-center gap-2 shrink-0 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
            }`}
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-2.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center justify-center relative ${
                isListening
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105'
                  : isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
              }`}
              title={isListening ? 'Stop listening' : `Speak in ${currentLangObj.nativeName}`}
            >
              {isListening ? (
                <MicOff className="h-4 w-4 animate-pulse" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={
                isListening
                  ? `Listening to your native voice in ${currentLangObj.nativeName}...`
                  : selectedLanguage === 'hi'
                  ? 'बोलें या लिखें: ट्रेन स्थिति, शिकायत, प्लेटफॉर्म, सिम्युलेशन...'
                  : selectedLanguage === 'mr'
                  ? 'बोला किंवा टाईप करा: थेट नकाशा, तक्रार, फलाट...'
                  : selectedLanguage === 'gu'
                  ? 'બોલો અથવા લખો: લાઈવ નકશો, ફરિયાદ, પ્લેટફોર્મ...'
                  : 'Speak or type: live map, report issue, switch train, simulation...'
              }
              className={`flex-1 px-3.5 py-2.5 rounded-xl border text-xs transition-colors ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-hidden'
              }`}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white transition-colors shrink-0 shadow-xs cursor-pointer"
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
