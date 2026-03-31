import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import api from '@/utils/api';
import { X, Trash2, Clock, Users, PlusCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

interface WorkshopSlotModalProps {
  workshop: any;
  onClose: () => void;
}

export const WorkshopSlotModal: React.FC<WorkshopSlotModalProps> = ({ workshop, onClose }) => {
  const { showToast } = useToast();
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTime = (time24: string) => {
    // converts "14:30" to "2:30 PM"
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${minutes} ${ampm}`;
  };

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/workshops/${workshop._id}/slots`);
      if (res.data.success) {
        setSlots(res.data.data);
      }
    } catch (err: any) {
      showToast('Failed to fetch slots', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [workshop._id]);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !startTime || !endTime || !capacity) {
      showToast('Please fill all fields', 'error');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        date,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        capacity: Number(capacity)
      };
      
      const res = await api.post(`/api/workshops/${workshop._id}/slots`, payload);
      
      if (res.data.success) {
        showToast('Slot added successfully', 'success');
        setSlots([...slots, res.data.data].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        // Reset form
        setDate('');
        setStartTime('');
        setEndTime('');
        setCapacity('');
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to add slot', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSlot = async (slotId: string, bookedCount: number) => {
    if (bookedCount > 0) {
      showToast('Cannot delete a slot with active bookings', 'error');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        const res = await api.delete(`/api/workshops/${workshop._id}/slots/${slotId}`);
        if (res.data.success) {
          showToast('Slot deleted', 'success');
          setSlots(slots.filter(s => s._id !== slotId));
        }
      } catch (err: any) {
        showToast(err.response?.data?.message || 'Failed to delete slot', 'error');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="text-2xl font-black text-gray-800">Manage Time Slots</h2>
            <p className="text-gray-500 font-bold text-sm">Workshop: <span className="text-primary-600">{workshop.title}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          
          {/* Add Slot Form */}
          <div className="w-full lg:w-1/3">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                <PlusCircle size={20} className="text-primary-500" /> Add New Slot
              </h3>
              
              <form onSubmit={handleAddSlot} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">Date</label>
                  <input 
                    type="date" 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none font-bold text-gray-700"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <div className="w-1/2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">Start Time</label>
                    <input 
                      type="time" 
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none font-bold text-gray-700 text-sm"
                      required
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">End Time</label>
                    <input 
                      type="time" 
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none font-bold text-gray-700 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="bg-white/50 p-3 rounded-2xl border border-dashed border-gray-200">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block">Quick Add Times</label>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      type="button"
                      onClick={() => { setStartTime('10:00'); setEndTime('11:00'); }}
                      className="text-[10px] font-black bg-white hover:bg-primary-50 text-gray-600 hover:text-primary-600 border border-gray-200 hover:border-primary-200 px-3 py-1.5 rounded-lg transition-all"
                    >
                      10:00 - 11:00 AM
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setStartTime('15:00'); setEndTime('16:00'); }}
                      className="text-[10px] font-black bg-white hover:bg-primary-50 text-gray-600 hover:text-primary-600 border border-gray-200 hover:border-primary-200 px-3 py-1.5 rounded-lg transition-all"
                    >
                      03:00 - 04:00 PM
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1 block">Max Capacity</label>
                  <input 
                    type="number" 
                    min="1"
                    value={capacity}
                    onChange={e => setCapacity(e.target.value)}
                    placeholder="e.g., 20"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 outline-none font-bold text-gray-700"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full pt-4 h-12 rounded-xl mt-2 flex justify-center items-center" 
                  isLoading={isSubmitting}
                >
                  Create Slot
                </Button>
              </form>
            </div>
          </div>

          {/* Slots List */}
          <div className="w-full lg:w-2/3">
            <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-secondary-500" /> Existing Time Slots
            </h3>
            
            {loading ? (
              <div className="flex justify-center py-10"><div className="animate-spin w-8 h-8 flex border-2 border-primary-500 border-t-transparent rounded-full" /></div>
            ) : slots.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="text-5xl text-gray-300 mb-2">🗓️</div>
                <p className="text-gray-500 font-bold">No time slots created yet.</p>
                <p className="text-sm text-gray-400 font-semibold mt-1">Users will book the workshop without a specific slot.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {slots.map(slot => {
                  const isFull = slot.bookedCount >= slot.capacity;
                  const dateObj = new Date(slot.date);
                  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
                  
                  return (
                    <div key={slot._id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-1 mb-2 sm:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800 text-lg">{formattedDate}</span>
                          {isFull && <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">Full</span>}
                        </div>
                        <div className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                          <Clock size={14} /> {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Booked</div>
                          <div className="font-black text-gray-700 flex items-center gap-1.5 justify-end w-full">
                            <Users size={16} className={isFull ? 'text-red-500' : 'text-green-500'} />
                            <span className={isFull ? 'text-red-600' : ''}>{slot.bookedCount}</span> / {slot.capacity}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleDeleteSlot(slot._id, slot.bookedCount)}
                          disabled={slot.bookedCount > 0}
                          title={slot.bookedCount > 0 ? "Cannot delete slot with bookings" : "Delete slot"}
                          className={`p-2.5 rounded-xl transition-all ${slot.bookedCount > 0 ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
};
