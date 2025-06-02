"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import ArrowButton from "@/components/uiFramework/ArrowButton";
import LogoutModal from "@/components/model/logout";
import MobileApproch from "@/components/Mobileapproch";
import AccountDetailsModal from "@/components/model/AccoutDetails";
import MyPlansModal from "@/components/model/MyPlans";
import AddresssModal from "@/components/model/Address";

const cardData = [
  {
    id: 1,
    title: "Account Details",
    subtitle: "Edit Now",
    action: "modal",
    modalType: "accountDetails",
  },
  {
    id: 2,
    title: "My Plans",
    subtitle: "View Your Plans",
    action: "modal",
    modalType: "myPlans",
  },
  {
    id: 3,
    title: "Orders",
    subtitle: "View History",
    action: "redirect",
    link: "/cart",
  },
  {
    id: 4,
    title: "Buy Again",
    subtitle: "Stay Consistent",
    action: "redirect",
    link: "/myplans",
  },
  {
    id: 5,
    title: "Address",
    subtitle: "View saved",
    action: "modal",
    modalType: "Address",
  },
  {
    id: 6,
    title: "Book a Call",
    subtitle: "Book a Call",
    action: "redirect",
    link: "/book-call",
  },
  {
    id: 7,
    title: "My Prescription",
    subtitle: "Check Your Prescribed Plan",
    action: "redirect",
    link: "/myplans",
  },
  {
    id: 8,
    title: "Hilop Coins",
    subtitle: "View Balance",
    action: "redirect",
    link: "/myplans",
  },
];
export default function ProfileContent() {
  const router = useRouter();

  // State for controlling modal visibility
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isAccountDetailsModalOpen, setAccountDetailsModalOpen] = useState(false);
  const [isMyPlansModalOpen, setMyPlansModalOpen] = useState(false); // State for MyPlansModal
  const [isAddresssModalOpen, setAddresssModalOpen] = useState(false); // State for MyPlansModal

  // Function to handle card clicks (redirects or opens modals)
  const handleClick = (card: typeof cardData[number]) => {
    if (card.action === "redirect" && card.link) {
      router.push(card.link);
    } else if (card.action === "modal") {
      switch (card.modalType) {
        case "accountDetails":
          setAccountDetailsModalOpen(true);
          break;
        case "myPlans": // <--- ADDED THIS CASE
          setMyPlansModalOpen(true);
          break;
          case "Address": // <--- ADDED THIS CASE
          setAddresssModalOpen(true);
          break;
        default:
          // Handle any other modal types or do nothing
          console.warn(`Unhandled modal type: ${card.modalType}`);
          break;
      }
    }
  };

  return (
    <>
      <section className="w-full py-10 bg-cover bg-center bg-greenleaf lg:mb-20 mb-10">
        <div className="container h-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="top-content-badge">Profile Page</h1>
            <h2 className="text-5xl 2xl:text-6xl mb-4 font-semibold">John Doe</h2>
            <p className="text-gray-600">
              +91 5837284928 <span className="px-2">|</span> Test@hilop.com
            </p>
          </div>
          <ArrowButton
            onClick={() => setLogoutModalOpen(true)}
            label="Logout"
            theme="light"
            size="lg"
          />
        </div>
      </section>
      <section className="container mb-20 lg:mb-32 lg:mt-14 mt-8">
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 sm:gap-6 gap-[1px] items-center">
          {cardData.map((card) => (
            <motion.div
              key={card.id}
              whileHover="hovered"
              initial="rest"
              animate="rest"
              variants={{
                rest: {},
                hovered: {},
              }}
              onClick={() => handleClick(card)}
              className="bg-white p-6 sm:rounded-3xl flex items-center justify-between sm:border sm:border-white border-b-gray-200 duration-600 transition-all hover:border-green-400 group cursor-pointer"
            >
              <div>
                <h3 className="text-lg font-medium mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm">{card.subtitle}</p>
              </div>

              <motion.div
                variants={{
                  rest: { x: 0 },
                  hovered: { x: 8 },
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="transition-colors duration-200 text-gray-400 group-hover:text-green-600"
              >
                <ChevronRight />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>
      <MobileApproch />
      <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setLogoutModalOpen(false)} />
      <AccountDetailsModal
        isOpen={isAccountDetailsModalOpen}
        onClose={() => setAccountDetailsModalOpen(false)}
      />
      <MyPlansModal isOpen={isMyPlansModalOpen} onClose={() => setMyPlansModalOpen(false)} />
      <AddresssModal isOpen={isAddresssModalOpen} onClose={() => setAddresssModalOpen(false)} />
   
    </>
  );
}
