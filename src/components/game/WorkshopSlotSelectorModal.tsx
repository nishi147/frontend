import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { X, Clock, Calendar as CalendarIcon, Users, CheckCircle } from 'lucide-react';

interface WorkshopSlotSelectorModalProps {
  workshop: any;
  slots: any[];
  onClose: () => void;
  onProceed: (slotId: string | null) => void;
  isProcessing: boolean;
}

export const WorkshopSlotSelectorModal: React.FC<WorkshopSlotSelectorModalProps> = ({ 
  workshop, 
  slots, 
  onClose, 
  onProceed,
  isProcessing
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const handleProceed = () => {
    onProceed(selectedSlotId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-gradient-to-r from-accent-500 to-[#F2643D] p-6 text-white relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
          <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-3 text-white">
            Select Batch Time
          </div>
          <h2 className="text-2xl md:text-3xl font-black leading-tight mb-2">
            {workshop.title}
          </h2>
          <p className="font-bold text-white/80 flex items-center gap-2">
             <CalendarIcon size={16} /> {new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1 bg-gray-50/50">
          <h3 className="text-lg font-black text-gray-800 mb-4">Choose an available time slot:</h3>

          {slots.length === 0 ? (
            <div className="text-center p-6 bg-white rounded-2xl border border-gray-100 mb-6">
              <p className="text-gray-500 font-bold">This workshop does not have specific time slots defined.</p>
              <p className="text-sm text-gray-400 mt-2">You can proceed directly to booking.</p>
            </div>
          ) : (
            <div className="space-y-4 mb-6">
              {slots.map(slot => {
                const isFull = slot.bookedCount >= slot.capacity;
                const isSelected = selectedSlotId === slot._id;
                const seatsLeft = slot.capacity - slot.bookedCount;

                return (
                  <label 
                    key={slot._id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      isFull 
                        ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed' 
                        : isSelected 
                          ? 'border-accent-500 bg-accent-50/50 shadow-md shadow-accent-100' 
                          : 'border-gray-100 bg-white hover:border-accent-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-2 sm:mb-0">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isFull ? 'border-gray-300 bg-gray-100' : isSelected ? 'border-accent-500 bg-accent-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 font-black text-gray-800 text-lg">
                          <Clock size={16} className={isSelected ? 'text-accent-500' : 'text-gray-400'} /> 
                          {slot.startTime} - {slot.endTime}
                        </div>
                        {isFull ? (
                          <span className="text-xs font-black text-red-500 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md inline-block mt-1">Batch Full</span>
                        ) : (
                          <span className={`text-xs font-bold ${seatsLeft <= 5 ? 'text-orange-500' : 'text-green-500'}`}>
                            {seatsLeft} seat{seatsLeft !== 1 ? 's' : ''} left
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Radio input visually hidden but accessible */}
                    <input 
                      type="radio" 
                      name="workshop_slot" 
                      className="hidden" 
                      disabled={isFull}
                      checked={isSelected}
                      onChange={() => setSelectedSlotId(slot._id)}
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
           <div className="text-center sm:text-left">
             <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Total Price</div>
             <div className="text-3xl font-black text-slate-800">₹{workshop.price}</div>
           </div>
           
           <Button 
             size="lg" 
             onClick={handleProceed}
             disabled={isProcessing || (slots.length > 0 && !selectedSlotId)}
             isLoading={isProcessing}
             className="w-full sm:w-auto px-10 py-6 rounded-2xl font-black text-lg bg-accent-500 hover:bg-accent-600 shadow-xl shadow-accent-500/30"
           >
              Proceed to Pay <CheckCircle size={20} className="ml-2" />
           </Button>
        </div>

      </div>
    </div>
  );
};
