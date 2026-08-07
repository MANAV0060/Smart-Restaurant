import React, { useState, useRef, useEffect } from 'react';
import { MenuItem } from '../../types';
import { Bot, Send, Sparkles, X, Plus, Clock } from 'lucide-react';

interface AIChefAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onAddComboToCart: (items: MenuItem[]) => void;
  savedAllergies?: string[];
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendedDishes?: MenuItem[];
  timestamp: string;
}

export const AIChefAssistant: React.FC<AIChefAssistantProps> = ({
  isOpen,
  onClose,
  menuItems,
  onAddComboToCart,
  savedAllergies = [],
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: `Good evening! I am your AI Sommelier & Dining Concierge. How may I guide your dining experience tonight?`,
      timestamp: 'Just now'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let matched: MenuItem[] = [];
      let reply = "";
      const q = query.toLowerCase();

      if (q.includes('dessert') || q.includes('sweet') || q.includes('chocolate')) {
        matched = menuItems.filter(m => m.category === 'desserts');
        reply = "I recommend our handcrafted Belgian Chocolate Lava & Tiramisu.";
      } else if (q.includes('veg') || q.includes('healthy') || q.includes('salad')) {
        matched = menuItems.filter(m => m.vegType === 'veg' || m.vegType === 'vegan');
        reply = "Here are our signature vegetarian and healthy culinary creations.";
      } else if (q.includes('quick') || q.includes('fast') || q.includes('time')) {
        matched = menuItems.filter(m => m.cookingTimeMinutes <= 12);
        reply = "These gourmet selections can be prepared by our kitchen in under 12 minutes.";
      } else {
        matched = menuItems.slice(0, 2);
        reply = `I have selected our Chef's signature specialties tailored to your palate.`;
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        recommendedDishes: matched,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMsg]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xs flex items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-lg bg-[#14171f] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] bg-[#101318] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#8BDFDD]/15 text-[#8BDFDD] flex items-center justify-center border border-[#8BDFDD]/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#FFF6DE] text-base">AI Sommelier & Concierge</h3>
              <span className="text-[11px] text-[#FFE394]">Personalized culinary pairings</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-md bg-[#1a1e27] text-slate-400 hover:text-white flex items-center justify-center border border-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0e1014]">
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] p-3 rounded-lg text-xs leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-[#F48F68] text-slate-950 font-bold shadow-sm' 
                    : 'bg-[#14171d] text-[#FFF6DE] border border-white/[0.08]'
                }`}
              >
                {m.text}
              </div>

              {m.recommendedDishes && m.recommendedDishes.length > 0 && (
                <div className="mt-2 space-y-2 w-full max-w-[90%]">
                  {m.recommendedDishes.map((dish) => (
                    <div key={dish.id} className="bg-[#14171d] p-2.5 rounded-lg border border-white/[0.08] flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <img src={dish.image} alt={dish.name} className="w-9 h-9 rounded object-cover" />
                        <div>
                          <div className="font-semibold text-[#FFF6DE] text-xs">{dish.name}</div>
                          <div className="text-[11px] font-bold text-[#FFE394]">₹{dish.price}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddComboToCart([dish])}
                        className="px-2.5 py-1 rounded bg-[#F48F68] hover:bg-[#f27c50] text-slate-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" /> Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="bg-[#14171d] text-slate-400 text-xs p-2.5 rounded-lg border border-white/[0.08] w-fit flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8BDFDD]"></span>
              <span>Sommelier is curating recommendations...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#101318] border-t border-white/[0.08] flex gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask for pairings e.g. 'Light pasta under ₹400'..."
            className="flex-1 bg-[#0e1014] border border-white/[0.08] rounded-md px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#F48F68]"
          />
          <button
            onClick={() => handleSendMessage()}
            className="px-3.5 py-1.5 rounded-md bg-[#F48F68] hover:bg-[#f27c50] text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
