"use client";

import { useState } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Swiper, SwiperSlide } from "swiper/react";

interface Medication {
  name: string;
  instruction: string;
  dosage: string;
}

interface Prescription {
  orderid: string;
  name: string;
  ageGender: string;
  date: string;
  medications: Medication[];
}

const prescriptionid: Prescription[] = [
  {
    orderid: "4353494",
    name: "Erico Santosa",
    ageGender: "36 Male",
    date: "01-01-2024",
    medications: [
      {
        name: "Monoxidil 5%",
        instruction: "Daily for as long as recommended, both during day and night",
        dosage: "1-0-1",
      },
      {
        name: "Another Med",
        instruction: "Once daily after meal",
        dosage: "0-1-0",
      },
    ],
  },
  {
    orderid: "4353495",
    name: "Sarah Johnson",
    ageGender: "42 Female",
    date: "15-01-2024",
    medications: [
      {
        name: "Metformin 500mg",
        instruction: "Take with meals to reduce stomach upset",
        dosage: "1-1-1",
      },
      {
        name: "Lisinopril 10mg",
        instruction: "Take once daily in the morning",
        dosage: "1-0-0",
      },
      {
        name: "Vitamin D3 1000IU",
        instruction: "Take once daily with food",
        dosage: "0-1-0",
      },
    ],
  },
  {
    orderid: "4353496",
    name: "Michael Chen",
    ageGender: "28 Male",
    date: "22-01-2024",
    medications: [
      {
        name: "Amoxicillin 500mg",
        instruction: "Take every 8 hours for 7 days",
        dosage: "1-1-1",
      },
      {
        name: "Ibuprofen 400mg",
        instruction: "Take as needed for pain, maximum 3 times daily",
        dosage: "1-1-1",
      },
    ],
  },
  {
    orderid: "4353497",
    name: "Emily Rodriguez",
    ageGender: "55 Female",
    date: "03-02-2024",
    medications: [
      {
        name: "Atorvastatin 20mg",
        instruction: "Take once daily in the evening",
        dosage: "0-0-1",
      },
      {
        name: "Amlodipine 5mg",
        instruction: "Take once daily, preferably in the morning",
        dosage: "1-0-0",
      },
      {
        name: "Omeprazole 20mg",
        instruction: "Take 30 minutes before breakfast",
        dosage: "1-0-0",
      },
    ],
  },
  {
    orderid: "4353498",
    name: "David Thompson",
    ageGender: "67 Male",
    date: "10-02-2024",
    medications: [
      {
        name: "Warfarin 5mg",
        instruction: "Take at the same time each day, monitor INR regularly",
        dosage: "0-0-1",
      },
      {
        name: "Digoxin 0.25mg",
        instruction: "Take once daily in the morning",
        dosage: "1-0-0",
      },
    ],
  },
  {
    orderid: "4353499",
    name: "Lisa Park",
    ageGender: "34 Female",
    date: "18-02-2024",
    medications: [
      {
        name: "Sertraline 50mg",
        instruction: "Take once daily, preferably in the morning",
        dosage: "1-0-0",
      },
      {
        name: "Lorazepam 0.5mg",
        instruction: "Take as needed for anxiety, maximum twice daily",
        dosage: "1-0-1",
      },
    ],
  },
  {
    orderid: "4353500",
    name: "Robert Williams",
    ageGender: "45 Male",
    date: "25-02-2024",
    medications: [
      {
        name: "Insulin Glargine 20 units",
        instruction: "Inject subcutaneously once daily at bedtime",
        dosage: "0-0-1",
      },
      {
        name: "Metformin XR 1000mg",
        instruction: "Take with dinner to reduce side effects",
        dosage: "0-0-1",
      },
      {
        name: "Aspirin 81mg",
        instruction: "Take once daily with food",
        dosage: "1-0-0",
      },
    ],
  },
  {
    orderid: "4353501",
    name: "Maria Garcia",
    ageGender: "29 Female",
    date: "05-03-2024",
    medications: [
      {
        name: "Birth Control Pills",
        instruction: "Take one pill daily at the same time",
        dosage: "1-0-0",
      },
      {
        name: "Iron Supplement 65mg",
        instruction: "Take twice daily with vitamin C for better absorption",
        dosage: "1-0-1",
      },
    ],
  },
  {
    orderid: "4353502",
    name: "James Anderson",
    ageGender: "52 Male",
    date: "12-03-2024",
    medications: [
      {
        name: "Losartan 50mg",
        instruction: "Take once daily, can be taken with or without food",
        dosage: "0-1-0",
      },
      {
        name: "Hydrochlorothiazide 25mg",
        instruction: "Take once daily in the morning",
        dosage: "1-0-0",
      },
      {
        name: "Calcium Carbonate 500mg",
        instruction: "Take twice daily with meals",
        dosage: "1-0-1",
      },
    ],
  },
  {
    orderid: "4353503",
    name: "Jennifer Lee",
    ageGender: "38 Female",
    date: "20-03-2024",
    medications: [
      {
        name: "Levothyroxine 75mcg",
        instruction: "Take on empty stomach 30-60 minutes before breakfast",
        dosage: "1-0-0",
      },
      {
        name: "Multivitamin",
        instruction: "Take once daily with breakfast",
        dosage: "1-0-0",
      },
    ],
  },
];

export default function MyPrescription() {
  const [activeIndex, setActiveIndex] = useState<number>(prescriptionid.length - 1);

  const activePrescription = activeIndex !== null ? prescriptionid[activeIndex] : null;

  return (
    <>
      {/* Hero Section */}
      <section className="w-full py-10 lg:py-20 bg-cover bg-center bg-greenleaf lg:mb-20 mb-10">
        <div className="container">
          <h1 className="text-2xl md:text-5xl 2xl:text-6xl font-semibold mb-8">
            My Prescription
          </h1>
          <div className="flex sm:flex-row sm:justify-between flex-col gap-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-medium mb-1">
                Dr. Shabdeep Sharma
              </h2>
              <p className="text-gray-700">B.H.M.S.</p>
            </div>
            <div className="sm:text-end ">
              <h2 className="text-lg sm:text-2xl font-medium mb-1">Reg. No</h2>
              <p className="text-gray-700">4107(A)</p>
            </div>
          </div>
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
            {[...prescriptionid].reverse().map((item, reversedIndex) => {
    const originalIndex = prescriptionid.length - 1 - reversedIndex;
    return (
      <SwiperSlide key={item.orderid}>
        <div
          onClick={() => setActiveIndex(originalIndex)}
          className={`flex flex-col h-full p-5 rounded-xl cursor-pointer transition-all border relative ${
            activeIndex === originalIndex
              ? "bg-green-100 border-green-300"
              : "bg-white border-gray-200"
          }`}
        >
          <p className="text-green-500 font-bold text-4xl absolute right-5 top-3">
            {prescriptionid.length - reversedIndex}
          </p>
          <p className="text-gray-600 font-medium mb-4 pr-8">
            Order : <span className="text-black">{item.orderid}</span>
          </p>
          <p className="text-md md:text-xl font-medium">{item.date}</p>
        </div>
      </SwiperSlide>
    );
  })}
          </Swiper>

          {activePrescription && (
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-white rounded-3xl flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-medium mb-1">
                    {activePrescription.name}
                    </h3>
                    <p className="text-gray-600">{activePrescription.ageGender}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <h3 className="text-lg font-medium mb-1">
                    {activePrescription.date}
                    </h3>
                    <p className="text-gray-600">
                    Order : <span className="text-black">ID: {activePrescription.orderid}</span>
                    </p>
                  </div>
                </div>

                {/* Medications */}
                {activePrescription.medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-100 p-5 rounded-2xl border border-gray-200"
                  >
                    <h4 className="text-xl font-medium mb-3">{med.name}</h4>
                    <p className="text-gray-700 mb-2 font-medium">
                      <span className="text-dark">Instruction:</span> <br />
                      {med.instruction}
                    </p>
                    <p className="text-gray-700 font-medium">
                      <span className="text-dark">Dosage:</span> <br />
                      {med.dosage}
                    </p>
                  </div>
                ))}

                <div className="flex flex-col items-start gap-3">
                  <Image
                    src="/images/dr-sign.png"
                    alt="Dr. Shabdeep Sharma Signature"
                    width={104}
                    height={71}
                  />
                  <div>
                    <p className="text-black font-medium">Dr. Shabdeep Sharma</p>
                    <p className="text-gray-600 font-medium">B.H.M.S.</p>
                    <p className="text-gray-600 font-medium">
                      Reg. No: <span className="text-black">4107(A)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
