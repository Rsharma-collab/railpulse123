import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI client with required header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

const SYSTEM_INSTRUCTION = `You are "Saarthi" (सारथी - Saarthi AI), an intelligent, voice-first, empathetic, and multilingual passenger assistance companion for the RailPulse Railway Intelligence Platform.

You can fully operate and control all features within the RailPulse application via voice or text in any native language requested by the passenger:
- English
- Hindi (हिन्दी)
- Marathi (मराठी)
- Gujarati (ગુજરાતી)
- Bengali (বাংলা)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Punjabi (ਪੰਜਾਬੀ)

Always respond naturally in the exact native language the passenger speaks or requests (e.g., if asked in Hindi, respond in polite, clear Hindi; if in Marathi, reply in Marathi). Keep spoken answers clear, reassuring, calm (zero-panic philosophy), and scannable.

KNOWLEDGE BASE & ACTIVE TRAIN CONTEXT:
1. Current Active Train: 12951 Mumbai Rajdhani Express (Bhopal Junction BPL -> Mumbai Central MMCT).
   - Speed: ~94 km/h cruising on Western Railway main line.
   - Status: On-Time / minor +3 min operational buffer.
   - Coach Composition: EOG, B1, B2, B3, B4, B5, B6, A1, A2, A3, H1, PC (Pantry Car), B7, B8, EOG.
   - User Coach & Berth: Coach B4, Seat 24 (Lower Berth).
   - Upcoming Stops: Bhopal (13:45), Ratlam (17:35), Vadodara (21:40), Surat (23:15), Borivali (02:40), Mumbai Central (03:15).
2. Supported Trains in System:
   - 20901 Vande Bharat Express (Mumbai Central MMCT -> Gandhinagar Capital GNC via Surat, Vadodara, Ahmedabad).
   - 12002 Bhopal Shatabdi Express (New Delhi NDLS -> Rani Kamlapati RKMP via Mathura, Agra, Gwalior, Jhansi).
   - 12953 August Kranti Tejas Rajdhani Express (Mumbai Central MMCT -> Hazrat Nizamuddin NZM).
   - 12290 Nagpur Duronto Express (Mumbai CSMT -> Nagpur NGP).
3. Station Amenities & Platforms:
   - Platform Concourses, Foot-Over-Bridges (FOB), Escalators, Waiting Lounges, Cloak Rooms, Clean Drinking Water, IRCTC Food Plazas.
4. Issue Lodging & Passenger Assistance:
   - RailMadad Helpline: 139 (24x7 Indian Railways)
   - RPF Security Helpline: 182 / 112
   - Direct In-App Complaints: Cleanliness, AC/Electrical, Water, Security, Food quality.

COMPLETE APP FEATURE ACCESS & VOICE ACTION PROTOCOL:
You have direct execution access to all features in the app. Whenever a passenger asks to navigate, open a tool, switch trains, change theme, start simulations, or report issues, you MUST include the appropriate [ACTION:...] tags at the end of your response so the app executes them automatically:

Navigation Actions:
- [ACTION:navigate:gps] -> Open Live Satellite GPS Map & Train Speedometer
- [ACTION:navigate:station_guide] -> Open Platform & Coach Position Alignment
- [ACTION:navigate:timeline] -> Open Journey Stops & Halts Timetable
- [ACTION:navigate:route_finder] -> Open Route Finder & Search Trains
- [ACTION:navigate:connection] -> Open Connection Protection & Connecting Cabs
- [ACTION:navigate:discovery] -> Open Station Meals, IRCTC Food & Amenities
- [ACTION:navigate:alerts] -> Open Smart Safety Alerts & RailMadad Center
- [ACTION:navigate:operations] -> Open Railway Controller Operations Dashboard
- [ACTION:navigate:historical] -> Open Historical Punctuality & Track Congestion
- [ACTION:navigate:prediction] -> Open Dynamic ETA & Delay Prediction Engine
- [ACTION:navigate:digital_twin] -> Open Signal Block Digital Twin Simulation
- [ACTION:navigate:crew_rake] -> Open Loco Pilot, Guard & Rake Readiness
- [ACTION:navigate:network] -> Open Junction & Network Congestion
- [ACTION:navigate:my_journeys] -> Open Saved Journeys & Tickets
- [ACTION:navigate:simulation] -> Open Live Delay & Signal Simulation
- [ACTION:navigate:settings] -> Open Settings & Preferences
- [ACTION:navigate:home] -> Return to Home Command Center
- [ACTION:go_back] -> Return to previous screen

Modal & Tool Actions:
- [ACTION:modal:report_issue] -> Open Issue Reporting Form
- [ACTION:modal:station_finder] -> Open Station Finder Modal (NDLS, BPL, MMCT, CSMT, HWH, SBC...)
- [ACTION:modal:search_train] -> Open Train Lookup Modal

Direct Train Switching:
- [ACTION:select_train:12951] -> Switch to 12951 Mumbai Rajdhani Express
- [ACTION:select_train:20901] -> Switch to 20901 Vande Bharat Express
- [ACTION:select_train:12002] -> Switch to 12002 Bhopal Shatabdi Express
- [ACTION:select_train:12953] -> Switch to 12953 August Kranti Tejas Rajdhani
- [ACTION:select_train:12290] -> Switch to 12290 Nagpur Duronto Express

Interactive Controls:
- [ACTION:simulation:start] -> Start delay & signal simulation
- [ACTION:simulation:pause] -> Pause simulation
- [ACTION:simulation:reset] -> Reset simulation
- [ACTION:simulation:speed:2] -> Set simulation speed to 2x (or 1, 5)
- [ACTION:save_journey] -> Save active journey to My Journeys
- [ACTION:theme:dark] -> Switch to Dark Theme
- [ACTION:theme:light] -> Switch to Light Theme
- [ACTION:report_issue:cleanliness:Coach B4 washroom cleaning requested] -> Direct issue registration
- [ACTION:report_issue:water:Water shortage in coach B4] -> Direct water issue registration
- [ACTION:report_issue:electrical:Charging point near seat 24 not working] -> Direct electrical registration
- [ACTION:set_language:hi] -> Switch app assistant language to Hindi
- [ACTION:set_language:mr] -> Switch to Marathi
- [ACTION:set_language:gu] -> Switch to Gujarati
- [ACTION:set_language:en] -> Switch to English

Respond with warmth, confidence, and accuracy.`;

// Multilingual fallback response generator when API key is not configured or offline
const generateLocalFallback = (prompt: string, language: string) => {
  const p = prompt.toLowerCase();
  
  // 1. Hindi queries & voice commands
  if (language === 'hi' || /कहाँ|ट्रेन|गाड़ी|प्लेटफ़ॉर्म|सफाई|खाना|शिकायत|नमस्ते|हैलो|मदद|मैप|सिम्युलेशन|डार्क|लाइट|वापस|सेव|स्टेशन/i.test(prompt)) {
    if (/मैप|कहाँ|स्थान|लोकेशन|speed|रफ्तार|चाल|live|gps/i.test(p)) {
      return {
        text: `नमस्ते! आपकी ट्रेन **12951 मुम्बई राजधानी एक्सप्रेस** इस समय लगभग 94 किमी/घंटे की गति से चल रही है। अगला प्रमुख ठहराव **भोपाल जंक्शन** है। मैं आपके लिए लाइव सैटेलाइट जीपीएस मैप खोल रहा हूँ। [ACTION:navigate:gps]`,
        suggestedActions: [{ label: 'लाइव जीपीएस मैप', action: 'navigate:gps' }]
      };
    }
    if (/प्लेटफ़ॉर्म|platform|coach|b4|डिब्बा|सीट/i.test(p)) {
      return {
        text: `आपकी सीट **कोच B4, सीट 24 (लोअर बर्थ)** में है। ट्रेन संरचना के अनुसार B4 कोच इंजन की तरफ से चौथे AC कोच (EOG, B1, B2, B3 के बाद) स्थित है। प्लेटफॉर्म व कोच गाइड खोला जा रहा है। [ACTION:navigate:station_guide]`,
        suggestedActions: [{ label: 'प्लेटफॉर्म व कोच गाइड', action: 'navigate:station_guide' }]
      };
    }
    if (/शिकायत|सफाई|टॉयलेट|पानी|बिजली|ac|पंखा|issue|report|madad/i.test(p)) {
      return {
        text: `मैंने आपकी समस्या दर्ज करने के लिए ऑन-बोर्ड सहायता फॉर्म खोल दिया है। किसी भी तात्कालिक आपातकाल के लिए आप सीधे **139 (RailMadad)** पर भी संपर्क कर सकते हैं। [ACTION:modal:report_issue]`,
        suggestedActions: [{ label: 'शिकायत फॉर्म खोलें', action: 'modal:report_issue' }]
      };
    }
    if (/स्टेशन|जंक्शन|खोजो|ढूंढो|station|finder/i.test(p)) {
      return {
        text: `मैंने स्टेशन खोजक खोल दिया है। आप नई दिल्ली, भोपाल, मुंबई सेंट्रल, हावड़ा सहित 20+ प्रमुख जंक्शनों की जानकारी ले सकते हैं। [ACTION:modal:station_finder]`,
        suggestedActions: [{ label: 'स्टेशन खोजें', action: 'modal:station_finder' }]
      };
    }
    if (/वंदे भारत|20901|vande bharat/i.test(p)) {
      return {
        text: `ट्रेन बदल दी गई है: **20901 वंदे भारत एक्सप्रेस (मुंबई सेंट्रल से गांधीनगर कैपिटल)**। यह 130 किमी/घंटे की गति से चल रही है। [ACTION:select_train:20901] [ACTION:navigate:home]`,
        suggestedActions: [{ label: 'वंदे भारत एक्सप्रेस', action: 'select_train:20901' }]
      };
    }
    if (/शताब्दी|12002|shatabdi/i.test(p)) {
      return {
        text: `ट्रेन बदल दी गई है: **12002 भोपाल शताब्दी एक्सप्रेस (नई दिल्ली से रानी कमलापति)**। [ACTION:select_train:12002] [ACTION:navigate:home]`,
        suggestedActions: [{ label: 'भोपाल शताब्दी', action: 'select_train:12002' }]
      };
    }
    if (/राजधानी|12951|rajdhani/i.test(p)) {
      return {
        text: `सक्रिय ट्रेन सेट की गई: **12951 मुम्बई राजधानी एक्सप्रेस (नई दिल्ली से मुंबई सेंट्रल)**। [ACTION:select_train:12951] [ACTION:navigate:home]`,
        suggestedActions: [{ label: 'मुंबई राजधानी', action: 'select_train:12951' }]
      };
    }
    if (/सिम्युलेशन|शुरू करो|start simulation/i.test(p)) {
      return {
        text: `लाइव डिले व सिग्नल सिम्युलेशन शुरू कर दिया गया है। [ACTION:navigate:simulation] [ACTION:simulation:start]`,
        suggestedActions: [{ label: 'सिम्युलेशन मोड', action: 'navigate:simulation' }]
      };
    }
    if (/सिम्युलेशन रोको|pause|stop simulation/i.test(p)) {
      return {
        text: `सिम्युलेशन रोक दिया गया है। [ACTION:simulation:pause]`,
        suggestedActions: [{ label: 'सिम्युलेशन रोकें', action: 'simulation:pause' }]
      };
    }
    if (/डार्क मोड|dark mode/i.test(p)) {
      return {
        text: `डार्क थीम सक्रिय कर दी गई है। [ACTION:theme:dark]`,
        suggestedActions: [{ label: 'डार्क मोड', action: 'theme:dark' }]
      };
    }
    if (/लाइट मोड|light mode/i.test(p)) {
      return {
        text: `लाइट थीम सक्रिय कर दी गई है। [ACTION:theme:light]`,
        suggestedActions: [{ label: 'लाइट मोड', action: 'theme:light' }]
      };
    }
    if (/टाइमटेबल|स्टॉप्स|रुकेगी|timeline|halt/i.test(p)) {
      return {
        text: `ट्रेन की समय सारिणी व आगामी स्टॉप्स खोले जा रहे हैं। [ACTION:navigate:timeline]`,
        suggestedActions: [{ label: 'समय सारिणी देखें', action: 'navigate:timeline' }]
      };
    }
    if (/खाना|भोजन|पैंट्री|food|meal|canteen/i.test(p)) {
      return {
        text: `अगले स्टेशनों पर उपलब्ध आईआरसीटीसी फूड प्लाजा और स्थानीय खान-पान की सूची खोली जा रही है। [ACTION:navigate:discovery]`,
        suggestedActions: [{ label: 'स्टेशन फूड व सुविधाएं', action: 'navigate:discovery' }]
      };
    }
    if (/कनेक्टिंग|कैब|टैक्सी|connection|cab/i.test(p)) {
      return {
        text: `कनेक्टिंग ट्रेन सुरक्षा व स्टेशन कैब ट्रांसफर सुविधा खोली जा रही है। [ACTION:navigate:connection]`,
        suggestedActions: [{ label: 'कनेक्टिंग ट्रेन सुरक्षा', action: 'navigate:connection' }]
      };
    }
    if (/यात्रा सेव|टिकट सेव|save journey/i.test(p)) {
      return {
        text: `आपकी वर्तमान यात्रा 'मेरी यात्राएं' (My Journeys) में सुरक्षित कर दी गई है। [ACTION:save_journey] [ACTION:navigate:my_journeys]`,
        suggestedActions: [{ label: 'मेरी यात्राएं', action: 'navigate:my_journeys' }]
      };
    }
    if (/वापस|पीछे जाओ|back/i.test(p)) {
      return {
        text: `पिछले पेज पर वापस ले जाया जा रहा है। [ACTION:go_back]`,
        suggestedActions: [{ label: 'पीछे जाएं', action: 'go_back' }]
      };
    }

    return {
      text: `नमस्ते! मैं आपका **रेलपल्स एआई सहायक** हूँ। आप मुझे आवाज से कोई भी निर्देश दे सकते हैं — जैसे 'लाइव मैप दिखाओ', 'शिकायत दर्ज करो', 'वंदे भारत चुनो', या 'सिम्युलेशन शुरू करो'। मैं पूरी ऐप को आपकी भाषा में नियंत्रित कर सकता हूँ। [ACTION:navigate:gps]`,
      suggestedActions: [
        { label: 'लाइव ट्रेन मैप', action: 'navigate:gps' },
        { label: 'कोच व प्लेटफॉर्म', action: 'navigate:station_guide' },
        { label: 'स्टेशन खोजक', action: 'modal:station_finder' },
        { label: 'शिकायत दर्ज करें', action: 'modal:report_issue' }
      ]
    };
  }

  // 2. Marathi queries
  if (language === 'mr' || /कुठे|गाडी|स्थानक|डबा|तक्रार|नमस्कार|नकाशा/i.test(prompt)) {
    if (/नकाशा|कुठे|speed|वेग|live|gps/i.test(p)) {
      return {
        text: `नमस्कार! आपली गाडी **12951 मुंबई राजधानी एक्सप्रेस** वेळेवर धावत असून सध्याचा वेग 94 किमी/तास आहे. थेट नकाशा उघडत आहे. [ACTION:navigate:gps]`,
        suggestedActions: [{ label: 'थेट नकाशा पहा', action: 'navigate:gps' }]
      };
    }
    if (/तक्रार|सफाई|पाणी|डबा/i.test(p)) {
      return {
        text: `मी तक्रार निवारण अर्ज उघडला आहे. आपण त्वरित तक्रार नोंदवू शकता किंवा 139 (RailMadad) वर कॉल करू शकता. [ACTION:modal:report_issue]`,
        suggestedActions: [{ label: 'तक्रार नोंदवा', action: 'modal:report_issue' }]
      };
    }
    return {
      text: `नमस्कार! मी आपला **रेलपल्स एआई सहाय्यक** आहे. आपण आवाजाने सर्व ॲप चालवू शकता. थेट नकाशा, फलाट माहिती, किंवा तक्रार निवारणासाठी विचारा. [ACTION:navigate:gps]`,
      suggestedActions: [
        { label: 'थेट नकाशा पहा', action: 'navigate:gps' },
        { label: 'फलाट माहिती', action: 'navigate:station_guide' },
        { label: 'तक्रार नोंदवा', action: 'modal:report_issue' }
      ]
    };
  }

  // 3. Gujarati queries
  if (language === 'gu' || /ક્યાં|ટ્રેન|પ્લેટફોર્મ|ડબ્બો|ફરિયાદ|નમસ્તે|નકશો/i.test(prompt)) {
    if (/નકશો|ક્યાં|લાઈવ|gps/i.test(p)) {
      return {
        text: `નમસ્તે! તમારી ટ્રેન **12951 મુંબઈ રાજધાની એક્સપ્રેસ** સમયસર દોડી રહી છે. લાઈવ નકશો ખોલવામાં આવ્યો છે. [ACTION:navigate:gps]`,
        suggestedActions: [{ label: 'લાઈવ નકશો જુઓ', action: 'navigate:gps' }]
      };
    }
    return {
      text: `નમસ્તે! હું તમારો **રેલપલ્સ એઆઈ સહાયક** છું. તમે અવાજ દ્વારા આખી એપનું સંચાલન કરી શકો છો. લાઈવ ટ્રેકિંગ, પ્લેટફોર્મ અથવા ફરિયાદ માટે પૂછો. [ACTION:navigate:gps]`,
      suggestedActions: [
        { label: 'લાઈવ નકશો જુઓ', action: 'navigate:gps' },
        { label: 'પ્લેટફોર્મ ગાઈડ', action: 'navigate:station_guide' },
        { label: 'ફરિયાદ કરો', action: 'modal:report_issue' }
      ]
    };
  }

  // 4. Default English voice & navigation assistance
  if (/where|location|gps|speed|map|track/i.test(p)) {
    return {
      text: `Your active train **12951 Mumbai Rajdhani Express** is cruising smoothly at **94 km/h**. Signals are clear Green. Next stop: **Bhopal Junction (BPL)**. Opening Live GPS Map for you now. [ACTION:navigate:gps]`,
      suggestedActions: [{ label: 'Open Live Map', action: 'navigate:gps' }]
    };
  }
  if (/platform|coach|b4|stand|seat|where is my coach/i.test(p)) {
    return {
      text: `Your assigned seat is **Coach B4, Berth 24 (Lower)**. In the rake formation, Coach B4 is placed after B1-B3. Opening the Coach & Platform Alignment guide. [ACTION:navigate:station_guide]`,
      suggestedActions: [{ label: 'Platform & Coach Guide', action: 'navigate:station_guide' }]
    };
  }
  if (/report|complaint|issue|clean|dirty|toilet|water|ac|fan|food|thief|security|railmadad/i.test(p)) {
    return {
      text: `Opening the On-Board Issue Reporting module. You can also dial **139 (RailMadad)** or **182 (RPF)** for immediate security assistance. [ACTION:modal:report_issue]`,
      suggestedActions: [{ label: 'Report Issue Form', action: 'modal:report_issue' }]
    };
  }
  if (/station|junction|explore|amenities|find station/i.test(p)) {
    return {
      text: `Opening Station Explorer. You can search 20+ major railway junctions, concourses, and amenities across India. [ACTION:modal:station_finder]`,
      suggestedActions: [{ label: 'Find Stations', action: 'modal:station_finder' }]
    };
  }
  if (/vande bharat|20901/i.test(p)) {
    return {
      text: `Switching active train to **20901 Vande Bharat Express (Mumbai Central to Gandhinagar Capital)**. [ACTION:select_train:20901] [ACTION:navigate:home]`,
      suggestedActions: [{ label: 'Switch to Vande Bharat', action: 'select_train:20901' }]
    };
  }
  if (/shatabdi|12002/i.test(p)) {
    return {
      text: `Switching active train to **12002 Bhopal Shatabdi Express (New Delhi to Rani Kamlapati)**. [ACTION:select_train:12002] [ACTION:navigate:home]`,
      suggestedActions: [{ label: 'Switch to Bhopal Shatabdi', action: 'select_train:12002' }]
    };
  }
  if (/rajdhani|12951/i.test(p)) {
    return {
      text: `Switching active train to **12951 Mumbai Rajdhani Express**. [ACTION:select_train:12951] [ACTION:navigate:home]`,
      suggestedActions: [{ label: 'Switch to Mumbai Rajdhani', action: 'select_train:12951' }]
    };
  }
  if (/start simulation|simulate|run simulation/i.test(p)) {
    return {
      text: `Starting the interactive railway delay and signal simulation mode now. [ACTION:navigate:simulation] [ACTION:simulation:start]`,
      suggestedActions: [{ label: 'Simulation Mode', action: 'navigate:simulation' }]
    };
  }
  if (/pause simulation|stop simulation/i.test(p)) {
    return {
      text: `Simulation has been paused. [ACTION:simulation:pause]`,
      suggestedActions: [{ label: 'Pause Simulation', action: 'simulation:pause' }]
    };
  }
  if (/dark mode|dark theme/i.test(p)) {
    return {
      text: `Dark mode activated. [ACTION:theme:dark]`,
      suggestedActions: [{ label: 'Dark Mode', action: 'theme:dark' }]
    };
  }
  if (/light mode|light theme/i.test(p)) {
    return {
      text: `Light mode activated. [ACTION:theme:light]`,
      suggestedActions: [{ label: 'Light Mode', action: 'theme:light' }]
    };
  }
  if (/save journey|save this train/i.test(p)) {
    return {
      text: `Your current journey has been saved to 'My Journeys'. [ACTION:save_journey] [ACTION:navigate:my_journeys]`,
      suggestedActions: [{ label: 'View My Journeys', action: 'navigate:my_journeys' }]
    };
  }
  if (/go back|back/i.test(p)) {
    return {
      text: `Returning to previous page. [ACTION:go_back]`,
      suggestedActions: [{ label: 'Go Back', action: 'go_back' }]
    };
  }
  if (/timetable|stops|schedule/i.test(p)) {
    return {
      text: `Opening the Journey Halts & Station Timetable. [ACTION:navigate:timeline]`,
      suggestedActions: [{ label: 'View Timetable', action: 'navigate:timeline' }]
    };
  }
  if (/food|meal|pantry|snack/i.test(p)) {
    return {
      text: `Opening Station Dining & IRCTC Food Plaza guide. [ACTION:navigate:discovery]`,
      suggestedActions: [{ label: 'Food & Discovery', action: 'navigate:discovery' }]
    };
  }
  if (/connection|connecting train|cab|taxi/i.test(p)) {
    return {
      text: `Opening Connection Protection & Safe Transfer Cabs. [ACTION:navigate:connection]`,
      suggestedActions: [{ label: 'Connection Protection', action: 'navigate:connection' }]
    };
  }

  return {
    text: `Hello! I am **Saarthi AI** (सारथी), your voice-first multilingual rail assistant. You can speak commands in your native language like "Show live map", "Open complaints", "Switch to Vande Bharat", or "Start simulation", and I will operate the entire app for you.\n\nHow can I help your journey today?`,
    suggestedActions: [
      { label: 'Live Train Map', action: 'navigate:gps' },
      { label: 'Platform & Coach', action: 'navigate:station_guide' },
      { label: 'Find Stations', action: 'modal:station_finder' },
      { label: 'Report Issue', action: 'modal:report_issue' }
    ]
  };
};

// Helper to parse action tags into structured actions and UI buttons
const parseActionTag = (rawAction: string) => {
  if (rawAction.startsWith('navigate:')) {
    const tab = rawAction.split(':')[1];
    let label = 'Open View';
    if (tab === 'gps') label = 'Live GPS Map';
    else if (tab === 'station_guide') label = 'Platform & Coach Finder';
    else if (tab === 'timeline') label = 'Station Halts & Timetable';
    else if (tab === 'connection') label = 'Connection Protection';
    else if (tab === 'discovery') label = 'Station Food & Amenities';
    else if (tab === 'alerts') label = 'Safety Alerts';
    else if (tab === 'operations') label = 'Operations Dashboard';
    else if (tab === 'historical') label = 'Historical Trends';
    else if (tab === 'prediction') label = 'ETA & Delay Prediction';
    else if (tab === 'digital_twin') label = 'Signal Digital Twin';
    else if (tab === 'crew_rake') label = 'Crew & Rake Status';
    else if (tab === 'network') label = 'Network Congestion';
    else if (tab === 'my_journeys') label = 'My Journeys';
    else if (tab === 'route_finder') label = 'Route Finder';
    else if (tab === 'simulation') label = 'Simulation Mode';
    else if (tab === 'settings') label = 'Settings';
    else if (tab === 'home') label = 'Home Command Center';
    return {
      suggestedAction: { label, action: rawAction },
      executedAction: { type: 'NAVIGATE', payload: { tab } }
    };
  }
  if (rawAction.startsWith('modal:')) {
    const modal = rawAction.split(':')[1];
    let label = 'Open Tool';
    if (modal === 'report_issue') label = 'Report Issue Form';
    else if (modal === 'station_finder') label = 'Station Finder';
    else if (modal === 'search_train') label = 'Search Train';
    return {
      suggestedAction: { label, action: rawAction },
      executedAction: { type: 'OPEN_MODAL', payload: { modal } }
    };
  }
  if (rawAction.startsWith('select_train:')) {
    const trainNum = rawAction.split(':')[1];
    let name = trainNum;
    if (trainNum === '20901') name = 'Vande Bharat (20901)';
    else if (trainNum === '12002') name = 'Bhopal Shatabdi (12002)';
    else if (trainNum === '12951') name = 'Mumbai Rajdhani (12951)';
    else if (trainNum === '12953') name = 'August Kranti (12953)';
    else if (trainNum === '12290') name = 'Nagpur Duronto (12290)';
    return {
      suggestedAction: { label: `Switch to ${name}`, action: rawAction },
      executedAction: { type: 'SWITCH_TRAIN', payload: { trainNumber: trainNum } }
    };
  }
  if (rawAction.startsWith('simulation:')) {
    const parts = rawAction.split(':');
    const action = parts[1];
    const speed = parts[2] ? Number(parts[2]) : undefined;
    return {
      suggestedAction: { label: `Simulation: ${action}`, action: rawAction },
      executedAction: { type: 'SIMULATION_CONTROL', payload: { action, speed } }
    };
  }
  if (rawAction.startsWith('theme:')) {
    const theme = rawAction.split(':')[1];
    return {
      suggestedAction: { label: `${theme === 'dark' ? 'Dark' : 'Light'} Mode`, action: rawAction },
      executedAction: { type: 'SET_THEME', payload: { theme } }
    };
  }
  if (rawAction === 'save_journey') {
    return {
      suggestedAction: { label: 'Save Journey', action: rawAction },
      executedAction: { type: 'SAVE_JOURNEY', payload: {} }
    };
  }
  if (rawAction === 'go_back') {
    return {
      suggestedAction: { label: 'Go Back', action: rawAction },
      executedAction: { type: 'GO_BACK', payload: {} }
    };
  }
  if (rawAction.startsWith('set_language:')) {
    const lang = rawAction.split(':')[1];
    return {
      suggestedAction: { label: `Language: ${lang.toUpperCase()}`, action: rawAction },
      executedAction: { type: 'SET_LANGUAGE', payload: { language: lang } }
    };
  }
  if (rawAction.startsWith('report_issue:')) {
    const parts = rawAction.split(':');
    const category = parts[1] || 'cleanliness';
    const description = parts.slice(2).join(':') || 'Passenger reported issue via Saarthi AI';
    return {
      suggestedAction: { label: 'File Complaint', action: rawAction },
      executedAction: { type: 'REPORT_ISSUE', payload: { category, description } }
    };
  }
  // Legacy shorthand support
  if (rawAction === 'gps') {
    return {
      suggestedAction: { label: 'Live GPS Map', action: 'navigate:gps' },
      executedAction: { type: 'NAVIGATE', payload: { tab: 'gps' } }
    };
  }
  if (rawAction === 'station_guide') {
    return {
      suggestedAction: { label: 'Platform & Coach', action: 'navigate:station_guide' },
      executedAction: { type: 'NAVIGATE', payload: { tab: 'station_guide' } }
    };
  }
  if (rawAction === 'report_issue') {
    return {
      suggestedAction: { label: 'Report Issue Form', action: 'modal:report_issue' },
      executedAction: { type: 'OPEN_MODAL', payload: { modal: 'report_issue' } }
    };
  }
  if (rawAction === 'find_stations') {
    return {
      suggestedAction: { label: 'Find Stations', action: 'modal:station_finder' },
      executedAction: { type: 'OPEN_MODAL', payload: { modal: 'station_finder' } }
    };
  }
  if (rawAction === 'timeline') {
    return {
      suggestedAction: { label: 'Station Halts', action: 'navigate:timeline' },
      executedAction: { type: 'NAVIGATE', payload: { tab: 'timeline' } }
    };
  }
  if (rawAction === 'connection') {
    return {
      suggestedAction: { label: 'Connection Protection', action: 'navigate:connection' },
      executedAction: { type: 'NAVIGATE', payload: { tab: 'connection' } }
    };
  }
  if (rawAction === 'discovery') {
    return {
      suggestedAction: { label: 'Food & Amenities', action: 'navigate:discovery' },
      executedAction: { type: 'NAVIGATE', payload: { tab: 'discovery' } }
    };
  }

  return {
    suggestedAction: { label: 'Quick Action', action: rawAction },
    executedAction: null
  };
};

// API Endpoint for Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, language = 'en', userContext } = req.body;
    const latestMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : '';

    const ai = getGeminiClient();

    if (ai) {
      // Build conversation history for generateContent
      const contents = (messages || []).map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Add dynamic context if provided
      let dynamicInstruction = SYSTEM_INSTRUCTION;
      if (userContext) {
        dynamicInstruction += `\n\nCURRENT CLIENT CONTEXT: Active Train: ${userContext.trainNumber} ${userContext.trainName}, Source: ${userContext.source}, Destination: ${userContext.destination}, Speed: ${userContext.speed} km/h, Selected Language: ${language}.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: dynamicInstruction,
          temperature: 0.7
        }
      });

      const responseText = response.text || 'I am ready to assist with your journey!';
      
      // Parse any [ACTION:xxx] tags for UI shortcuts & execution
      const actionMatches = responseText.match(/\[ACTION:([^\]]+)\]/g) || [];
      const parsedResults = actionMatches.map(tag => {
        const rawAction = tag.replace(/\[ACTION:|\]/g, '');
        return parseActionTag(rawAction);
      });

      const suggestedActions = parsedResults.map(r => r.suggestedAction);
      const executedActions = parsedResults.map(r => r.executedAction).filter(Boolean);

      // Remove the action tags from clean display text
      const cleanText = responseText.replace(/\[ACTION:[^\]]+\]/g, '').trim();

      return res.json({
        reply: cleanText,
        suggestedActions,
        executedActions
      });
    }

    // Fallback if no Gemini API Key is configured
    const fallback = generateLocalFallback(latestMessage, language);
    const actionMatches = fallback.text.match(/\[ACTION:([^\]]+)\]/g) || [];
    const parsedResults = actionMatches.map(tag => {
      const rawAction = tag.replace(/\[ACTION:|\]/g, '');
      return parseActionTag(rawAction);
    });

    const suggestedActions = fallback.suggestedActions.length > 0
      ? fallback.suggestedActions
      : parsedResults.map(r => r.suggestedAction);
    const executedActions = parsedResults.map(r => r.executedAction).filter(Boolean);

    const cleanText = fallback.text.replace(/\[ACTION:[^\]]+\]/g, '').trim();
    return res.json({
      reply: cleanText,
      suggestedActions,
      executedActions
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    const fallback = generateLocalFallback(req.body?.messages?.[req.body?.messages?.length - 1]?.content || '', req.body?.language || 'en');
    const actionMatches = fallback.text.match(/\[ACTION:([^\]]+)\]/g) || [];
    const parsedResults = actionMatches.map(tag => {
      const rawAction = tag.replace(/\[ACTION:|\]/g, '');
      return parseActionTag(rawAction);
    });
    return res.json({
      reply: fallback.text.replace(/\[ACTION:[^\]]+\]/g, '').trim(),
      suggestedActions: fallback.suggestedActions,
      executedActions: parsedResults.map(r => r.executedAction).filter(Boolean)
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'RailPulse Railway Intelligence API' });
});

// Download app as a zip file endpoint
app.get('/api/download-zip', (req, res) => {
  const zipPath = path.resolve(__dirname, 'railpulse-app.zip');
  res.download(zipPath, 'railpulse-app.zip', (err) => {
    if (err) {
      console.error('Error sending zip file:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download zip file' });
      }
    }
  });
});

// Handle Vite middleware or static dist
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`RailPulse Server running on http://0.0.0.0:${PORT}`);
});
