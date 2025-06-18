"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  PrescriptionService, 
  PrescriptionListItem, 
  PrescriptionDetail 
} from "@/services/prescriptionService";

export default function MyPrescription() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [prescriptionList, setPrescriptionList] = useState<PrescriptionListItem[]>([]);
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch prescription list
  useEffect(() => {
    const fetchPrescriptionList = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await PrescriptionService.getPrescriptionList();

        if (response.success && response.data) {
          setPrescriptionList(response.data);
          // Auto-select the first prescription if available
          if (response.data.length > 0) {
            await fetchPrescriptionDetail(response.data[0]._id);
          }
        } else {
          setPrescriptionList([]);
        }
      } catch (error) {
        console.error('Error fetching prescription list:', error);
        setError('Failed to load prescriptions');
        setPrescriptionList([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPrescriptionList();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Fetch prescription detail
  const fetchPrescriptionDetail = async (prescriptionId: string) => {
    try {
      setError(null);

      const response = await PrescriptionService.getPrescriptionDetail(prescriptionId);

      if (response.success && response.data) {
        setSelectedPrescription(response.data);
      } else {
        setSelectedPrescription(null);
      }
    } catch (error) {
      console.error('Error fetching prescription detail:', error);
      setError('Failed to load prescription details');
      setSelectedPrescription(null);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Format timing for display - show as 1-0-1 format
  const formatTiming = (timing: { morning: string | null; afternoon: string | null; night: string | null }) => {
    const morning = timing.morning ? '1' : '0';
    const afternoon = timing.afternoon ? '1' : '0';
    const night = timing.night ? '1' : '0';
    return `${morning}-${afternoon}-${night}`;
  };

  // Get instruction text based on current language
  const getInstructionText = (instruction: { en: string; hi: string }) => {
    return language === 'hi' ? instruction.hi : instruction.en;
  };

  if (loading) {
    return (
      <div className="w-full py-20 bg-cover bg-center bg-greenleaf">
        <div className="container h-full flex flex-col justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Loading Prescriptions...</h2>
            <p className="text-gray-600">Please wait while we load your prescription data.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 bg-cover bg-center bg-greenleaf">
        <div className="container h-full flex flex-col justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Error Loading Prescriptions</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-10 lg:py-20 bg-cover bg-center bg-greenleaf lg:mb-20 mb-10">
        <div className="container">
          <h1 className="text-2xl md:text-5xl 2xl:text-6xl font-semibold mb-8">
            My Prescription
          </h1>
          {selectedPrescription && (
            <div className="flex sm:flex-row sm:justify-between flex-col gap-6">
              <div>
                <h2 className="text-lg sm:text-2xl font-medium mb-1">
                  {selectedPrescription.doctor.name}
                </h2>
                <p className="text-gray-700">{selectedPrescription.doctor.degree}</p>
              </div>
              <div className="sm:text-end">
                <h2 className="text-lg sm:text-2xl font-medium mb-1">Reg. No</h2>
                <p className="text-gray-700">{selectedPrescription.doctor.registration_number}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mb-20 lg:mb-40 overflow-hidden">
        <div className="container">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold mb-2">Prescription List</h2>
            <p className="text-gray-600">
              View your recommended monthly prescription based on your assessment.
            </p>
          </div>

          {prescriptionList.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-3xl p-8 shadow-sm">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Prescriptions Yet</h3>
                  <p className="text-gray-600 mb-6">
                    You don&apos;t have any prescriptions yet. Once you complete your assessment and receive a prescription from our doctors, it will appear here.
                  </p>
                  <div className="space-y-3">
                    <Link 
                      href="/book-call"
                      className="block w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
                    >
                      Book Consultation
                    </Link>
                    <Link 
                      href="/"
                      className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors text-center"
                    >
                      Browse Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Swiper
                spaceBetween={16}
                slidesPerView={1.3}
                navigation={false}
                pagination={false}
                loop={false}
                autoHeight
                className="!overflow-visible mb-10 lg:mb-20"
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 2.4 },
                  1024: { slidesPerView: 3.5 },
                  1280: { slidesPerView: 5 },
                }}
              >
                {prescriptionList.map((prescription, index) => (
                  <SwiperSlide key={prescription._id}>
                    <div
                      onClick={() => fetchPrescriptionDetail(prescription._id)}
                      className={`flex flex-col h-full p-5 rounded-xl cursor-pointer transition-all border relative ${
                        selectedPrescription?.prescription_id === prescription._id
                          ? "bg-green-100 border-green-300"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <p className="text-green-500 font-bold text-4xl absolute right-5 top-3">
                        {prescriptionList.length - index}
                      </p>
                      <p className="text-gray-600 font-medium mb-4 pr-8">
                        Order: <span className="text-black">{prescription.order_number}</span>
                      </p>
                      <p className="text-md md:text-xl font-medium">{formatDate(prescription.order_date)}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {selectedPrescription && (
                <div className="max-w-md mx-auto">
                  <div className="p-6 bg-white rounded-3xl flex flex-col gap-8">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-1">
                          {selectedPrescription.patient.name}
                        </h3>
                        <p className="text-gray-600">
                          {selectedPrescription.patient.age} years old
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <h3 className="text-lg font-medium mb-1">
                          {formatDate(selectedPrescription.order_date)}
                        </h3>
                        <p className="text-gray-600">
                          Order: <span className="text-black">{selectedPrescription.order_number}</span>
                        </p>
                      </div>
                    </div>

                    {/* Medications */}
                    {selectedPrescription.medications.map((medication, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-100 p-5 rounded-2xl border border-gray-200"
                      >
                        <h4 className="text-xl font-medium mb-3">{medication.name}</h4>
                        <div className="mb-3">
                          <p className="text-gray-700 mb-2 font-medium">
                            <span className="text-dark">Instruction:</span>
                          </p>
                          <p className="text-gray-700 mb-2">
                              {getInstructionText(medication.dosage_instruction)}
                            </p>
                        </div>
                        <p className="text-gray-700 font-medium">
                          <span className="text-dark">Dosage:</span> <br />
                          {formatTiming(medication.timing)}
                        </p>
                      </div>
                    ))}

                    {selectedPrescription.notes && (
                      <div className="bg-gray-100 p-5 rounded-2xl border border-gray-200">
                        <h4 className="text-xl font-medium mb-3">Notes</h4>
                        <p className="text-gray-700">{selectedPrescription.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-col items-start gap-3">
                      {selectedPrescription.doctor.signature_image && (
                        <Image
                          src={selectedPrescription.doctor.signature_image}
                          alt={`${selectedPrescription.doctor.name} Signature`}
                          width={104}
                          height={71}
                          className="object-contain"
                        />
                      )}
                      <div>
                        <p className="text-black font-medium">{selectedPrescription.doctor.name}</p>
                        <p className="text-gray-600 font-medium">{selectedPrescription.doctor.degree}</p>
                        <p className="text-gray-600 font-medium">
                          Reg. No: <span className="text-black">{selectedPrescription.doctor.registration_number}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
