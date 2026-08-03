import React, { useState } from 'react';
import { CartItem, AllergyType } from '../../types';
import confetti from 'canvas-confetti';
import { ShoppingCart, Trash2, Plus, Minus, Tag, Users, CreditCard, Wallet, Banknote, ShieldAlert, Sparkles, X, ChevronRight } from 'lucide-react';

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
    
    // Trigger confetti celebration animation!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    onPlaceOrder(tableNumber, cartItems, generalNotes, paymentMethod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-left">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Your Gourmet Basket</h3>
              <span className="text-xs text-slate-400">Table {tableNumber} • Live Kitchen Dispatch</span>
            </div>
          </div>

          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
          {cartItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <ShoppingCart className="w-12 h-12 stroke-[1.5] mb-3 text-slate-600" />
              <p className="text-sm font-semibold text-slate-300">Your basket is empty</p>
              <p className="text-xs text-slate-500 mt-1">Explore our 3D menu & add culinary favorites.</p>
            </div>
          ) : (
            cartItems.map((item) => {
              const hasAllergyAlert = item.menuItem.allergens.some(a => activeAllergies.includes(a));

              return (
                <div key={item.menuItem.id} className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800/80 shadow-md space-y-3">
                  <div className="flex items-start gap-3">
                    <img src={item.menuItem.image} alt={item.menuItem.name} className="w-16 h-16 rounded-xl object-cover" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-white text-xs truncate">{item.menuItem.name}</h4>
                        <button onClick={() => onRemoveItem(item.menuItem.id)} className="text-slate-500 hover:text-rose-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-orange-400 mt-0.5">
                        ₹{item.menuItem.price * item.quantity}
                      </div>

                      {hasAllergyAlert && (
                        <div className="mt-1 text-[10px] font-bold text-red-400 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Allergy Alert: {item.menuItem.allergens.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Notes Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <input 
                      type="text"
                      value={item.specialInstructions || ''}
                      onChange={(e) => onUpdateInstructions(item.menuItem.id, e.target.value)}
                      placeholder="Note: 'No Onion', 'Less Spicy'..."
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500 mr-3"
                    />

                    <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-0.5">
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItem.id, -1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.menuItem.id, 1)}
                        className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white"
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
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-400" /> Apply Discount Coupon
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code (e.g. GOURMET20)"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white uppercase placeholder-slate-600 focus:outline-none focus:border-orange-500"
                  />
                  <button 
                    onClick={applyCoupon}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-orange-400 font-bold text-xs border border-slate-700"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ {discountPercent}% Discount Applied! Saved ₹{discountAmount}
                  </div>
                )}
              </div>

              {/* Split Bill Calculator */}
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-indigo-400" /> Split Bill Across Guests</span>
                  <span className="text-indigo-400">₹{perGuestShare} / person</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Number of Guests:</span>
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => setSplitGuests(num)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold ${
                        splitGuests === num ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 mb-2">Select Payment Method</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border ${
                      paymentMethod === 'upi' ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Wallet className="w-4 h-4" /> Instant UPI
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border ${
                      paymentMethod === 'card' ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Credit Card
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border ${
                      paymentMethod === 'cash' ? 'bg-orange-500/20 border-orange-500 text-orange-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <Banknote className="w-4 h-4" /> Pay Cash
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Summary & Action Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal}</span></div>
              {discountAmount > 0 && <div className="flex justify-between text-emerald-400"><span>Coupon Discount:</span><span>-₹{discountAmount}</span></div>}
              <div className="flex justify-between text-slate-400"><span>Taxes & Service (5% GST):</span><span>₹{taxes}</span></div>
              <div className="flex justify-between text-base font-black text-white pt-1 border-t border-slate-800">
                <span>Grand Total:</span>
                <span className="text-orange-400">₹{grandTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30"
            >
              <Sparkles className="w-4 h-4" /> Dispatch Order to Kitchen • ₹{grandTotal}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
