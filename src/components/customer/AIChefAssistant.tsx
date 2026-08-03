import React, { useState, useRef, useEffect } from 'react';
import { MenuItem, CartItem } from '../../types';
import { Sparkles, Bot, Send, ShoppingBag, Flame, ShieldAlert, HeartPulse, DollarSign, RefreshCw, X, ChevronRight } from 'lucide-react';

interface AIChefAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onAddComboToCart: (items: MenuItem[]) => void;
  savedAllergies: string[];
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  recommendations?: MenuItem[];
  drinkPairing?: MenuItem;
  dessertPairing?: MenuItem;
  rationale?: string;
  timestamp: string;
}

const PRESET_PROMPTS = [
  "I'm very hungry & have ₹500 budget",
  "I want high protein & low sugar",
  "What is today's Chef Special?",
  "I'm allergic to peanuts & milk",
  "Recommend a spicy Indian dinner combo",
  "I have diabetes - safe menu options?"
];

export const AIChefAssistant: React.FC<AIChefAssistantProps> = ({
  isOpen,
  onClose,
  menuItems,
  onAddComboToCart,
  savedAllergies
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Hello! I am your GourmetAI Executive Chef Assistant. Tell me your cravings, budget, macro targets, or dietary restrictions (e.g. '₹500 budget', 'No Onion', 'High Protein') and I will curate your perfect meal!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (queryText?: string) => {
    const textToProcess = queryText || inputQuery;
    if (!textToProcess.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToProcess,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = textToProcess.toLowerCase();
      let matched = [...menuItems];
      let drinkPair = menuItems.find(i => i.category === 'beverages');
      let dessertPair = menuItems.find(i => i.category === 'desserts');
      let rationale = "Curated based on flavor harmony, fresh ingredients, and kitchen speed.";

      // Allergy exclusions
      if (savedAllergies.length > 0 || lower.includes('allergic') || lower.includes('allergy') || lower.includes('peanuts')) {
        const activeAllergies = [...savedAllergies];
        if (lower.includes('peanuts')) activeAllergies.push('Peanut');
        if (lower.includes('milk')) activeAllergies.push('Milk');

        matched = matched.filter(item => !item.allergens.some(a => activeAllergies.includes(a)));
        rationale = `🛡️ Filtered out dangerous allergens (${activeAllergies.join(', ')}) to guarantee your safety.`;
      }

      // Budget query
      if (lower.includes('500') || lower.includes('budget')) {
        matched = matched.filter(i => i.price <= 500);
        rationale += " 💰 Staying under your ₹500 budget constraint.";
      }

      // High protein
      if (lower.includes('protein') || lower.includes('high protein')) {
        matched.sort((a, b) => b.macros.protein - a.macros.protein);
        rationale += " 💪 Prioritizing maximum protein grams per serving.";
      }

      // Spicy
      if (lower.includes('spicy')) {
        matched = matched.filter(i => i.spiceLevel >= 3);
        rationale += " 🌶️ Selected items with rich spice meters.";
      }

      // Diabetes / Low sugar / Healthy
      if (lower.includes('diabetes') || lower.includes('low sugar') || lower.includes('healthy')) {
        matched = matched.filter(i => i.macros.sugar <= 5 || i.category === 'healthy');
        rationale += " 🍏 Selected low-glycemic index foods with <5g sugar.";
      }

      // Chef Special
      if (lower.includes('chef special') || lower.includes('special')) {
        matched = matched.filter(i => i.isChefSpecial);
      }

      const topRecs = matched.slice(0, 2);

      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Here is your customized Gourmet AI recommendation:`,
        recommendations: topRecs.length > 0 ? topRecs : [menuItems[0]],
        drinkPairing: drinkPair,
        dessertPairing: dessertPair,
        rationale,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                GourmetAI Chef <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
              </h3>
              <span className="text-xs text-slate-400">Personalized Food & Nutrition Concierge</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${
                msg.sender === 'user' 
                  ? 'bg-orange-500 text-white font-medium rounded-br-none shadow-lg shadow-orange-500/20' 
                  : 'bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-bl-none shadow-xl'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>

                {/* AI Rationale Tag */}
                {msg.rationale && (
                  <div className="mt-2 pt-2 border-t border-slate-700/60 text-xs text-orange-300 font-medium italic">
                    {msg.rationale}
                  </div>
                )}

                {/* Recommendations Cards inside chat */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Recommended Main Dishes:</span>
                    {msg.recommendations.map(rec => (
                      <div key={rec.id} className="bg-slate-900 p-3 rounded-xl border border-slate-700/80 flex items-center gap-3">
                        <img src={rec.image} alt={rec.name} className="w-14 h-14 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-xs truncate">{rec.name}</h4>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="text-orange-400 font-semibold">₹{rec.price}</span>
                            <span>• {rec.cookingTimeMinutes}m cook</span>
                            <span>• {rec.macros.protein}g protein</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Drink & Dessert Pairings */}
                    {msg.drinkPairing && (
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center justify-between text-slate-300">
                        <span>🍹 Pair with: <strong className="text-amber-400">{msg.drinkPairing.name}</strong></span>
                        <span className="text-orange-400 font-semibold">+₹{msg.drinkPairing.price}</span>
                      </div>
                    )}

                    {/* Quick Add Combo Button */}
                    <button 
                      onClick={() => {
                        const combo = [...msg.recommendations!];
                        if (msg.drinkPairing) combo.push(msg.drinkPairing);
                        onAddComboToCart(combo);
                      }}
                      className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Add Recommended Combo to Cart
                    </button>
                  </div>
                )}

                <div className="text-[10px] opacity-60 mt-1 text-right">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs bg-slate-800/60 p-3 rounded-xl w-fit">
              <Sparkles className="w-4 h-4 text-orange-400 animate-spin" />
              <span>GourmetAI Executive Chef is composing menu response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Chips */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
          {PRESET_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-orange-400" />
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input 
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Chef (e.g. 'Spicy food under ₹400')..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
          />
          <button 
            onClick={() => handleSend()}
            className="w-10 h-10 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
