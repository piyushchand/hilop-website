"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import ArrowButton from "@/components/uiFramework/ArrowButton";
import { Swiper, SwiperSlide } from 'swiper/react';
import { toast, Toaster } from "react-hot-toast";

// Custom Calendar Component
const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface CalendarProps {
  selected: Date | null;
  onChange: (date: Date) => void;
  className?: string;
}

const CustomCalendar: React.FC<CalendarProps> = ({ selected, onChange, className }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(selected ? selected.getMonth() : today.getMonth());
  const [currentYear, setCurrentYear] = useState(selected ? selected.getFullYear() : today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Build calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const isSameDay = (d: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === d &&
      selected.getMonth() === currentMonth &&
      selected.getFullYear() === currentYear
    );
  };

  const isToday = (d: number) => {
    return (
      today.getDate() === d &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isPast = (d: number) => {
    if (!d) return true;
    const date = new Date(currentYear, currentMonth, d);
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  return (
    <div className={`rounded-2xl bg-[#f6f6f6] p-2 sm:p-4 w-full min-w-0 mx-auto shadow-sm mb-6 ${className || ''}`}>
      <div className="flex items-center justify-between mb-2 w-full min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-base sm:text-lg">{months[currentMonth]}</span>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(parseInt(e.target.value))}
            className="font-semibold text-gray-800 text-base sm:text-lg bg-transparent border-none focus:outline-none cursor-pointer"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100"
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            aria-label="Previous Month"
          >
            <span className="text-lg">&lt;</span>
          </button>
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100"
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            aria-label="Next Month"
          >
            <span className="text-lg">&gt;</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-xs sm:text-sm text-gray-400 mb-1 w-full min-w-0">
        {daysShort.map((d) => (
          <div key={d} className="text-center font-medium w-full">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 w-full min-w-0">
        {calendarDays.map((d, i) => (
          <button
            key={i}
            disabled={!d || isPast(d)}
            className={`w-full min-w-0 aspect-square rounded-full flex items-center justify-center transition-all
              text-xs sm:text-base px-0 sm:px-1
              ${d && isSameDay(d) ? 'bg-[#e8f7e2] text-green-600 font-bold border-2 border-green-400' :
                d && !isPast(d) ? 'bg-white text-gray-800 border border-gray-200 hover:bg-green-50' :
                'bg-transparent text-gray-300'}
              ${isToday(d || 0) && !isSameDay(d || 0) ? 'border border-green-400' : ''}
              ${!d || isPast(d) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
            onClick={() => d && !isPast(d) && onChange(new Date(currentYear, currentMonth, d))}
            type="button"
          >
            {d ? d : ''}
          </button>
        ))}
      </div>
    </div>
  );
};

const stats = [
  { text: "Personalized health guidance" },
  { text: "Discuss your goals confidentially" },
  { text: "Get tailored product recommendations" },
  { text: "Support for fat loss, stamina, and sexual wellness" },
  { text: "100% natural and side-effect-free solutions" },
];

export default function BookCall() {
  // Removed services state as it's no longer used
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    preferredDate: '',
    preferredTime: '',
    additionalNotes: ''
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  // Removed bookingSlot and setBookingSlot as they are no longer used
  const [submittingBooking, setSubmittingBooking] = useState(false);
  // Track locally booked slots per date (key: YYYY-MM-DD, value: array of slots)
  const [bookedSlots, setBookedSlots] = useState<{ [date: string]: string[] }>({});

  // Filter availableTimeSlots to hide already booked slots for the selected date
  const year = selectedDate?.getFullYear();
  const month = selectedDate ? String(selectedDate.getMonth() + 1).padStart(2, '0') : '';
  const day = selectedDate ? String(selectedDate.getDate()).padStart(2, '0') : '';
  const dateKey = selectedDate ? `${year}-${month}-${day}` : '';
  const bookedForDate = bookedSlots[dateKey] || [];
  const filteredTimeSlots = availableTimeSlots.filter(slot => !bookedForDate.includes(slot));

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setFormData(prev => ({
              ...prev,
              fullName: data.data.name || data.data.full_name || '',
              mobileNumber: data.data.mobile_number || data.data.phone || ''
            }));
          }
        } else {
          // User is not authenticated, which is fine for booking appointments
          console.log('User not authenticated, proceeding with empty form');
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // Don't set error for unauthenticated users - this is expected
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Fetch available time slots when selectedDate changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate) {
        setAvailableTimeSlots([]);
        return;
      }
      try {
        setLoadingSlots(true);
        setAvailableTimeSlots([]);
        setSelectedTime('');
        // Format date as DD-MM-YYYY (as required by the API)
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();
        const dateStr = `${day}-${month}-${year}`;
        // Fetch available slots from the API
        const response = await fetch(`/api/call-bookings/available-slots?date=${dateStr}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          // Normalize slots
          const normalizeSlots = (arr: unknown[]): string[] =>
            arr.map((slot) => typeof slot === 'string' ? slot : (typeof slot === 'object' && slot && 'time' in slot ? (slot as { time?: string }).time || '' : '')).filter(Boolean);
          let slots: string[] = [];
          if (data.success && Array.isArray(data.data)) {
            slots = normalizeSlots(data.data);
          } else if (Array.isArray(data)) {
            slots = normalizeSlots(data);
          } else if (data.success && data.data && Array.isArray(data.data)) {
            slots = normalizeSlots(data.data);
          } else {
            slots = [];
          }
          setAvailableTimeSlots(slots);
        } else {
          setAvailableTimeSlots([]);
        }
      } catch {
        setAvailableTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchTimeSlots();
  }, [selectedDate]);

const handleTimeSlotClick = (timeSlot: string) => {
  if (!selectedDate) {
    toast.error('Please select a date first.');
    return;
  }
  setSelectedTime(timeSlot);
  toast.success('Time slot selected successfully.');
};


  const handleSubmit = async () => {
    try {
      if (!selectedDate || !selectedTime) {
        toast.error('Please select a date and time slot.');
        return;
      }
      setSubmittingBooking(true);
      // Format date as DD-MM-YYYY for API
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      const bookingDate = `${day}-${month}-${year}`;
      const bookingData = {
        booking_date: bookingDate,
        time_slot: selectedTime, // This should be the slot ID from available slots
      };
      // Call the booking API
      
      const response = await fetch('/api/call-bookings/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success('Appointment booked successfully! Our team will call you soon.');
        // Add the booked slot for the selected date
        const dateKey = `${year}-${month}-${day}`;
        setBookedSlots(prev => ({
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), selectedTime]
        }));
        // Reset form
        setFormData({
          fullName: formData.fullName, // Keep name and mobile
          mobileNumber: formData.mobileNumber,
          preferredDate: '',
          preferredTime: '',
          additionalNotes: ''
        });
        setSelectedDate(null);
        setSelectedTime('');
      } else {
        toast.error(data.message || 'Failed to book appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      toast.error('Failed to submit appointment. Please try again.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <section className="w-full py-20 bg-cover bg-center bg-greenleaf lg:mb-40 mb-20">
        <div className="container">
          <h1 className="text-5xl 2xl:text-6xl font-semibold mb-3">
            Book <span className="text-primary">Appointment</span>
          </h1>
          <h3 className="sm:text-2xl text-lg mb-3">
            Take the First Step Towards a Healthier, More Confident You
          </h3>
          <p className="max-w-lg text-gray-700">
            We specialize in 100% natural, herbal-based wellness products
            designed to support your body from the inside out. Book a
            confidential one-on-one consultation to discover which product or
            plan is right for you.
          </p>
        </div>
      </section>

      <section className="container lg:mb-40 mb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-medium md:mb-4 mb-3">
              Why Book an Appointment?
            </h2>
            <div className="flex-col flex gap-2 mb-8">
              {stats.map((item, index) => (
                <div key={`stat-${index}`} className="flex items-start gap-2">
                  <Image
                    src="/images/icon/list.svg"
                    alt="About hero image"
                    width={24}
                    height={24}
                  />
                  <p className="text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
            <h2 className="text-2xl font-medium md:mb-4 mb-3">
            📞 What Happens After You Book?
            </h2>
            <p className="text-gray-700">
              Once you submit the appointment form, our expert admin will call
              you directly to understand your needs and guide you properly. Your
              conversation will be 100% private and confidential.
            </p>
          </div>
         
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-gray-600">Loading your profile...</span>
              </div>
            ) : (
              <div className="w-full min-w-0 max-w-full sm:max-w-[388px] ms-auto bg-white rounded-3xl md:p-6 p-4">
                <CustomCalendar selected={selectedDate} onChange={setSelectedDate} className="w-full min-w-0 max-w-full" />
                
                {/* Form fields for non-authenticated users */}

                
             
                <div className="w-full mb-6">
                  <label className="block text-gray-700 mb-2 font-medium">Select Time</label>
                  {loadingSlots && (
                    <div className="text-gray-500 text-sm mb-2">Loading available slots...</div>
                  )}
                  {selectedDate && !loadingSlots && availableTimeSlots.length === 0 && (
                    <div className="text-gray-500 text-sm mb-2">No slots available for this date.</div>
                  )}
                  <Swiper
                    spaceBetween={12}
                    slidesPerView={3}
                    slidesPerGroup={1} 
                    centeredSlides={false}
                    loop={false}
                    breakpoints={{
                      640: { slidesPerView: 3 },
                      768: { slidesPerView: 3 },
                    }}
                    className="pb-2"
                  >
                    {!loadingSlots && filteredTimeSlots.length > 0 ? (
                      filteredTimeSlots.map((slot, idx) => (
                        <SwiperSlide key={`slot-${slot.replace(/\s/g, '')}-${idx}`} className="!w-auto">
                          <button
                            type="button"
                            disabled={submittingBooking}
                            className={`rounded-xl text-xs sm:text-sm font-medium border transition-all min-w-[40px] whitespace-nowrap px-4 py-2 sm:px-6 sm:py-3
                              ${selectedTime === slot
                                ? 'bg-[#e8f7e2] text-green-600 border-green-400 shadow font-semibold'
                                : 'bg-[#f6f6f6] text-gray-700 border-gray-200 hover:bg-green-50'}
                              ${submittingBooking ? 'opacity-50 cursor-not-allowed' : ''}
                              `}
                            onClick={() => handleTimeSlotClick(slot)}
                          >
                            {submittingBooking ? 'Booking...' : slot}
                          </button>
                        </SwiperSlide>
                      ))
                    ) : (
                      <SwiperSlide className="!w-auto">
                        <div className="text-gray-400 text-sm px-4 py-2">
                          {loadingSlots ? 'Loading...' : 'No slots available'}
                        </div>
                      </SwiperSlide>
                    )}
                  </Swiper>
                </div>
                <div className="w-full flex justify-end">
                <ArrowButton
                  label={submittingBooking ? "Booking..." : "Book Now"}
                  theme="dark"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={submittingBooking}
                />
              </div>
              </div>
            )}
          
        </div>
      </section>
    </>
  );
}
