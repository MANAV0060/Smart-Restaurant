import React, { useState } from 'react';
import { CartItem, AllergyType } from '../../types';
import confetti from 'canvas-confetti';
import { ShoppingCart, Trash2, Plus, Minus, Tag, Users, CreditCard, Wallet, Banknote, ShieldAlert, X } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (dishId: string, delta: number) => void;
  onUpdateInstructions: (dishId: string, notes: string) => void;
  onRemoveItem: (dishId: string) => void;
  onPlaceOrder: (tableNumber: number, cart: CartItem[], notes: string, paymentMethod: string) => void;
  tableNumber: number;
  activeAllergies: AllergyType[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onUpdateInstructions,
  onRemoveItem,
  onPlaceOrder,
  tableNumber,
  activeAllergies
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [splitGuests, setSplitGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cash'>('upi');
  const [generalNotes, setGeneralNotes] = useState('');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxes = Math.round((subtotal - discountAmount) * 0.05); // 5% GST
  const grandTotal = subtotal - discountAmount + taxes;
  const perGuestShare = Math.ceil(grandTotal / Math.max(1, splitGuests));

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'GOURMET20' || couponCode.toUpperCase() === 'CHEF50') {
      const disc = couponCode.toUpperCase() === 'CHEF50' ? 50 : 20;
      setDiscountPercent(disc);
      setCouponApplied(true);
    } else {
      alert('Invalid Coupon. Try code "GOURMET20" or "CHEF50"');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    onPlaceOrder(tableNumber, cartItems, generalNotes, paymentMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-2xs flex justify-end font-sans select-none">
      <div className="w-full max-w-md bg-[#14171d] text-[#FFF6DE] border-l border-white/[0.1] h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.08] bg-[#101318] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#F48F68]/15 text-[#F48F68] flex items-center justify-center border border-[#F48F68]/30 shadow-xs">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-[#FFF6DE] text-base">Dining Basket</h3>
              <span className="text-[11px] text-[#FFE394]">Table {tableNumber} • Kitchen Dispatch</span>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-md bg-[#1a1e27] text-slate-400 hover:text-white flex items-center justify-center border border-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0e1014]">
          {cartItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <ShoppingCart className="w-10 h-10 stroke-[1.5] mb-2.5 text-slate-500" />
              <p className="text-sm font-semibold text-[#FFF6DE]">Your basket is empty</p>
              <p className="text-xs text-slate-400 mt-1">Explore our culinary dishes and add items to order.</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const hasAllergyAlert = item.menuItem.allergens.some(a => activeAllergies.includes(a));

              return (
                <div key={item.menuItem.id} className="bg-[#14171d] p-3.5 rounded-lg border border-white/[0.08] space-y-2.5 shadow-xs">
                  <div className="flex items-start gap-3">
                    <img src={item.menuItem.image} alt={item.menuItem.name} className="w-14 h-14 rounded-md object-cover flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-semibold text-[#FFF6DE] text-xs truncate">{item.menuItem.name}</h4>
                        <button onClick={() => onRemoveItem(item.menuItem.id)} className="text-slate-400 hover:text-[#F48F68] transition-colors p-0.5">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-[#FFE394] mt-0.5">
                        ₹{item.menuItem.price * item.quantity}
                      </div>

                      {hasAllergyAlert && (
                        <div className="mt-1 text-[10px] font-semibold text-[#F48F68] flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Warning: Contains {item.menuItem.allergens.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Notes Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] gap-2">
                    <input 
                      type="text"
                      value={item.specialInstructions || ''}
                      onChange={(e) => onUpdateInstructions(item.menuItem.id, e.target.value)}
                      placeholder="Special note e.g. Less spicy..."
                      className="flex-1 bg-[#0e1014] border border-white/[0.08] rounded px-2 py-1 text-[11px] text-[#FFF6DE] placeholder-slate-500 focus:outline-none focus:border-[#8BDFDD]"
                    />

                    <div className="flex items-center gap-1.5 bg-[#0e1014] border border-white/[0.08] rounded px-1 py-0.5">
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-[#FFF6DE]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#FFF6DE] w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-[#FFF6DE]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {cartItems.length > 0 && (
            <>
              {/* Coupon Applicator */}
              <div className="p-3 bg-[#14171d] rounded-lg border border-white/[0.08] space-y-2">
                <div className="text-xs font-semibold text-[#FFF6DE] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#F48F68]" /> Apply Promo Code
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="e.g. GOURMET20"
                    className="flex-1 bg-[#0e1014] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-xs text-[#FFF6DE] uppercase placeholder-slate-500 focus:outline-none focus:border-[#8BDFDD]"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="px-3 py-1.5 rounded-md bg-[#1a1e27] hover:bg-[#222733] text-[#FFE394] font-semibold text-xs border border-white/[0.08] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <div className="text-[11px] text-[#8BDFDD] font-medium">
                    ✓ {discountPercent}% discount applied (Saved ₹{discountAmount})
                  </div>
                )}
              </div>

              {/* Split Bill Calculator */}
              <div className="p-3 bg-[#14171d] rounded-lg border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#FFF6DE]">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-[#8BDFDD]" /> Split Across Guests</span>
                  <span className="text-[#FFE394]">₹{perGuestShare} / guest</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">Guests:</span>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => setSplitGuests(num)}
                      className={`w-6 h-6 rounded text-xs font-semibold ${
                        splitGuests === num ? 'bg-[#F48F68] text-slate-950 font-bold' : 'bg-[#0e1014] text-slate-400 hover:bg-[#1a1e27] border border-white/[0.06]'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-3 bg-[#14171d] rounded-lg border border-white/[0.08] space-y-2">
                <div className="text-xs font-semibold text-[#FFF6DE] mb-1.5">Payment Option</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2 rounded-md text-xs font-medium flex flex-col items-center gap-1 border transition-colors ${
                      paymentMethod === 'upi' ? 'bg-[#F48F68]/20 border-[#F48F68] text-[#F48F68] font-bold' : 'bg-[#0e1014] border-white/[0.06] text-slate-400 hover:bg-[#1a1e27]'
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5" /> Instant UPI
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-md text-xs font-medium flex flex-col items-center gap-1 border transition-colors ${
                      paymentMethod === 'card' ? 'bg-[#8BDFDD]/20 border-[#8BDFDD] text-[#8BDFDD] font-bold' : 'bg-[#0e1014] border-white/[0.06] text-slate-400 hover:bg-[#1a1e27]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" /> Card / POS
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2 rounded-md text-xs font-medium flex flex-col items-center gap-1 border transition-colors ${
                      paymentMethod === 'cash' ? 'bg-[#FFE394]/20 border-[#FFE394] text-[#FFE394] font-bold' : 'bg-[#0e1014] border-white/[0.06] text-slate-400 hover:bg-[#1a1e27]'
                    }`}
                  >
                    <Banknote className="w-3.5 h-3.5" /> Pay Cash
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Summary & Action Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-[#101318] border-t border-white/[0.08] space-y-3">
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-[#8BDFDD]"><span>Coupon Savings:</span><span>-₹{discountAmount}</span></div>}
              <div className="flex justify-between text-slate-400"><span>Taxes & Service (5% GST):</span><span>₹{taxes}</span></div>
              <div className="flex justify-between text-sm font-bold text-[#FFF6DE] pt-1.5 border-t border-white/[0.08]">
                <span>Total:</span>
                <span className="text-[#FFE394]">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3 rounded-lg bg-[#F48F68] hover:bg-[#f27c50] active:bg-[#e0683a] text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>Place Order to Kitchen • ₹{grandTotal}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
