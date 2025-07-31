"use client";
import React, { useState, useEffect } from "react";
import "swiper/css";
import "swiper/css/navigation";
import ArrowButton from "@/components/uiFramework/ArrowButton";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast, Toaster } from "react-hot-toast";
import { Phone, Mail } from "lucide-react";
import AnimatedInput from "@/components/animationComponents/AnimatedInput";
import AnimatedTextarea from "@/components/animationComponents/AnimatedTextarea";
import Button from "@/components/uiFramework/Button";

// Custom Calendar Component
const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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

const CustomCalendar: React.FC<CalendarProps> = ({
  selected,
  onChange,
  className,
}) => {
  // Use null for initial state to avoid SSR/CSR mismatch
  const [today, setToday] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  // Set today, currentMonth, and currentYear on client only
  useEffect(() => {
    const now = new Date();
    setToday(now);
    setCurrentMonth(selected ? selected.getMonth() : now.getMonth());
    setCurrentYear(selected ? selected.getFullYear() : now.getFullYear());
  }, [selected]);

  if (today === null || currentMonth === null || currentYear === null) {
    // Optionally show a loading spinner or just return null
    return null;
  }

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
    if (!today) return false;
    return (
      today.getDate() === d &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    );
  };

  const isPast = (d: number) => {
    if (!d || !today) return true;
    const date = new Date(currentYear, currentMonth, d);
    return (
      date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  };

  return (
    <div
      className={`rounded-2xl bg-[#f6f6f6] p-2 sm:p-4 w-full min-w-0 mx-auto shadow-sm mb-6 ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between mb-2 w-full min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-800 text-base sm:text-lg">
            {months[currentMonth]}
          </span>
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
          <div key={d} className="text-center font-medium w-full">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 w-full min-w-0">
        {calendarDays.map((d, i) => (
          <button
            key={i}
            disabled={!d || isPast(d)}
            className={`w-full min-w-0 aspect-square rounded-full flex items-center justify-center transition-all
              text-xs sm:text-base px-0 sm:px-1
              ${
                d && isSameDay(d)
                  ? "bg-[#e8f7e2] text-green-600 font-bold border-2 border-green-400"
                  : d && !isPast(d)
                  ? "bg-white text-gray-800 border border-gray-200 hover:bg-green-50"
                  : "bg-transparent text-gray-300"
              }
              ${
                isToday(d || 0) && !isSameDay(d || 0)
                  ? "border border-green-400"
                  : ""
              }
              ${
                !d || isPast(d)
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }
            `}
            onClick={() =>
              d &&
              !isPast(d) &&
              onChange(new Date(currentYear, currentMonth, d))
            }
            type="button"
          >
            {d ? d : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function BookCall() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    preferredDate: "",
    preferredTime: "",
    additionalNotes: "",
  });
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    query: "",
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<
    Array<{ time: string; id: string }>
  >([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<{ [date: string]: string[] }>(
    {}
  );

  // Filter availableTimeSlots to hide already booked slots for the selected date
  const year = selectedDate?.getFullYear();
  const month = selectedDate
    ? String(selectedDate.getMonth() + 1).padStart(2, "0")
    : "";
  const day = selectedDate
    ? String(selectedDate.getDate()).padStart(2, "0")
    : "";
  const dateKey = selectedDate ? `${year}-${month}-${day}` : "";
  const bookedForDate = bookedSlots[dateKey] || [];
  const filteredTimeSlots = availableTimeSlots.filter(
    (slot) => !bookedForDate.includes(slot.id)
  );

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/auth/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setFormData((prev) => ({
              ...prev,
              fullName: data.data.name || data.data.full_name || "",
              mobileNumber: data.data.mobile_number || data.data.phone || "",
            }));
          }
        } else {
          console.log("User not authenticated, proceeding with empty form");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
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
        setSelectedTime("");
        setSelectedSlotId("");

        const day = String(selectedDate.getDate()).padStart(2, "0");
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const year = selectedDate.getFullYear();
        const dateStr = `${day}-${month}-${year}`;

        const response = await fetch(
          `/api/call-bookings/available-slots?date=${dateStr}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Raw API response:", data);

          // Process slots to extract time and _id
          const processSlots = (
            slots: unknown[]
          ): Array<{ time: string; id: string }> => {
            console.log("Processing slots:", slots);
            return slots
              .map((slot) => {
                console.log("Processing individual slot:", slot);
                if (typeof slot === "string") {
                  const result = {
                    time: slot,
                    id: slot.replace(/\s/g, "").toLowerCase(),
                  };
                  console.log("String slot result:", result);
                  return result;
                } else if (slot && typeof slot === "object" && slot !== null) {
                  const slotObj = slot as { time?: string; _id?: string };
                  console.log("Slot object:", slotObj);
                  if (slotObj._id && slotObj.time) {
                    const result = { time: slotObj.time, id: slotObj._id };
                    console.log("Object slot with _id result:", result);
                    return result;
                  } else if (slotObj.time) {
                    const result = {
                      time: slotObj.time,
                      id: slotObj.time.replace(/\s/g, "").toLowerCase(),
                    };
                    console.log("Object slot without _id result:", result);
                    return result;
                  }
                }
                console.log("Invalid slot, returning empty");
                return { time: "", id: "" };
              })
              .filter((slot) => slot.time && slot.id);
          };

          let processedSlots: Array<{ time: string; id: string }> = [];
          if (data.success && Array.isArray(data.data)) {
            processedSlots = processSlots(data.data);
          } else if (Array.isArray(data)) {
            processedSlots = processSlots(data);
          }

          console.log("Processed slots:", processedSlots);
          setAvailableTimeSlots(processedSlots);
        } else {
          setAvailableTimeSlots([]);
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
        setAvailableTimeSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchTimeSlots();
  }, [selectedDate]);

  const handleTimeSlotClick = (slot: { time: string; id: string }) => {
    if (!selectedDate) {
      toast.error("Please select a date first.");
      return;
    }
    console.log("Selected slot:", slot);
    console.log("Setting selectedTime to:", slot.time);
    console.log("Setting selectedSlotId to:", slot.id);
    setSelectedTime(slot.time);
    setSelectedSlotId(slot.id);
    toast.success("Time slot selected successfully.");
  };

  const handleSubmit = async () => {
    try {
      console.log("Submit handler - selectedDate:", selectedDate);
      console.log("Submit handler - selectedTime:", selectedTime);
      console.log("Submit handler - selectedSlotId:", selectedSlotId);

      if (!selectedDate || !selectedTime || !selectedSlotId) {
        toast.error("Please select a date and time slot.");
        return;
      }
      setSubmittingBooking(true);

      const day = String(selectedDate.getDate()).padStart(2, "0");
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const year = selectedDate.getFullYear();
      const bookingDate = `${day}-${month}-${year}`;

      const bookingData = {
        booking_date: bookingDate,
        time_slot: selectedSlotId, // Use the actual slot ID
      };

      console.log("Sending booking data:", bookingData);
      console.log("Selected slot ID:", selectedSlotId);

      const response = await fetch("/api/call-bookings", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bookingData),
      });

      console.log("Booking response:", response);
      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(
          "Appointment booked successfully! Our team will call you soon."
        );
        const dateKey = `${year}-${month}-${day}`;
        setBookedSlots((prev) => ({
          ...prev,
          [dateKey]: [...(prev[dateKey] || []), selectedSlotId],
        }));
        setFormData({
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          preferredDate: "",
          preferredTime: "",
          additionalNotes: "",
        });
        setSelectedDate(null);
        setSelectedTime("");
        setSelectedSlotId("");
      } else {
        toast.error(
          data.message || "Failed to book appointment. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      toast.error("Failed to submit appointment. Please try again.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Query submitted! We will contact you soon.");
    setContactFormData({ name: "", email: "", query: "" });
  };

  const handleContactFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <section className="w-full py-20 bg-cover bg-center bg-greenleaf lg:mb-40 mb-20">
        <div className="container">
          <h1 className="text-3xl 2xl:text-4xl font-semibold mb-3">
            Take the First Step Towards a Healthier, More Confident You
          </h1>
          <p className="max-w-lg text-gray-700">
            We specialize in 100% natural, herbal-based wellness products
            designed to support your body from the inside out. Book a
            confidential one-on-one consultation to discover which product or
            plan is right for you.
          </p>
        </div>
      </section>

      <section className="container lg:mb-40 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">
          {/* Contact Us Form */}
          <div className="lg:col-span-2">
            <div className="  bg-white rounded-3xl mb-6 md:p-6 p-4 flex  flex-col gap-3   ">
              <h2 className="text-2xl font-medium md:mb-4 mb-3">
                Contact Information
              </h2>
              <div className="flex items-center gap-3 ">
                <Phone size={20} />
                <span className="text-gray-700 font-normal">
                  +91 9998852888
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} />
                <span className="text-gray-700 font-normal">info@hilp.com</span>
              </div>
            </div>
            <div className="bg-white md:p-6 p-4 rounded-3xl ">
              <form
                className="flex flex-col w-full gap-4 mb-8"
                onSubmit={handleContactFormSubmit}
              >
                <h2 className="text-2xl font-medium md:mb-4 mb-3">
                  Contact Us
                </h2>
                <AnimatedInput
                  label="Your Name"
                  name="name"
                  type="text"
                  value={contactFormData.name}
                  onChange={handleContactFormChange}
                  required
                />
                <AnimatedInput
                  label="Your Email"
                  name="email"
                  type="email"
                  value={contactFormData.email}
                  onChange={handleContactFormChange}
                  required
                />
                <AnimatedTextarea
                  label="Your Query"
                  name="query"
                  value={contactFormData.query}
                  onChange={handleContactFormChange}
                  required
                  rows={3}
                />

                <div className="w-full ">
                  <Button
                    label={submittingBooking ? "submiting..." : "Submit"}
                    size="xl"
                    type="submit"
                  />
                </div>
              </form>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600">
                Loading your profile...
              </span>
            </div>
          ) : (
            <div className="w-full   min-w-0 max-w-full  bg-white rounded-3xl md:p-6 p-4">
              <h2 className="text-2xl font-medium md:mb-4 mb-3">
                Book an <span className="text-primary">Appointment</span>
              </h2>
              <CustomCalendar
                selected={selectedDate}
                onChange={setSelectedDate}
                className="w-full min-w-0 max-w-full"
              />
              <div className="w-full mb-6">
                <label className="block text-gray-700 mb-2 font-medium">
                  Select Time
                </label>
                {loadingSlots && (
                  <div className="text-gray-500 text-sm mb-2">
                    Loading available slots...
                  </div>
                )}
                {selectedDate &&
                  !loadingSlots &&
                  availableTimeSlots.length === 0 && (
                    <div className="text-gray-500 text-sm mb-2">
                      No slots available for this date.
                    </div>
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
                      <SwiperSlide
                        key={`slot-${slot.id}-${idx}`}
                        className="!w-auto"
                      >
                        <button
                          type="button"
                          disabled={submittingBooking}
                          className={`rounded-xl text-xs sm:text-sm font-medium border transition-all min-w-[40px] whitespace-nowrap px-4 py-2 sm:px-6 sm:py-3
                              ${
                                selectedTime === slot.time
                                  ? "bg-[#e8f7e2] text-green-600 border-green-400 shadow font-semibold"
                                  : "bg-[#f6f6f6] text-gray-700 border-gray-200 hover:bg-green-50"
                              }
                              ${
                                submittingBooking
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }
                              `}
                          onClick={() => handleTimeSlotClick(slot)}
                        >
                          {submittingBooking ? "Booking..." : slot.time}
                        </button>
                      </SwiperSlide>
                    ))
                  ) : (
                    <SwiperSlide className="!w-auto">
                      <div className="text-gray-400 text-sm px-4 py-2">
                        {loadingSlots ? "Loading..." : "No slots available"}
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
