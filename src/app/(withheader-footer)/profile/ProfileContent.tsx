"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { User } from "@/types/auth";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

import ArrowButton from "@/components/uiFramework/ArrowButton";
import LogoutModal from "@/components/model/logout";
import MobileApproch from "@/components/Mobileapproch";
import AccountDetailsModal from "@/components/model/AccoutDetails";
import MyPlansModal from "@/components/model/MyPlans";
import AddresssModal from "@/components/model/Address";

// Helper function to format mobile number for display
const formatMobileNumber = (mobileNumber: string) => {
  if (mobileNumber.startsWith("91") && mobileNumber.length === 12) {
    return `+${mobileNumber.slice(0, 2)} ${mobileNumber.slice(
      2,
      7
    )} ${mobileNumber.slice(7)}`;
  }
  return mobileNumber;
};

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
    link: "/my-order",
  },
  {
    id: 4,
    title: "Buy Again",
    subtitle: "Stay Consistent",
    action: "redirect",
    link: "/cart",
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
    link: "/contact-us",
  },
  {
    id: 7,
    title: "My Prescription",
    subtitle: "Check Your Prescribed Plan",
    action: "redirect",
    link: "/prescription",
  },
  {
    id: 8,
    title: "Hilop Coins",
    subtitle: "View Balance",
    action: "redirect",
    link: "/hilop-coins",
  },
];

interface ProfileContentProps {
  user?: User; // Make it optional since we'll use AuthContext
}

export default function ProfileContent({
  user: propUser,
}: ProfileContentProps) {
  const router = useRouter();
  const { user, isInitialized, refreshUserData } = useAuth();

  // Use user from AuthContext, fallback to prop if needed
  const currentUser = user || propUser;

  // State for controlling modal visibility
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isAccountDetailsModalOpen, setAccountDetailsModalOpen] =
    useState(false);
  const [isMyPlansModalOpen, setMyPlansModalOpen] = useState(false);
  const [isAddresssModalOpen, setAddresssModalOpen] = useState(false);

  // Refresh user data when modal closes to ensure we have latest data
  const handleAccountDetailsClose = async () => {
    setAccountDetailsModalOpen(false);
    // Refresh user data to ensure we have the latest information
    try {
      await refreshUserData();
    } catch (error) {
      console.log("Failed to refresh user data after modal close:", error);
    }
  };

  // Function to handle card clicks (redirects or opens modals)
  const handleClick = (card: (typeof cardData)[number]) => {
    if (card.action === "redirect" && card.link) {
      router.push(card.link);
    } else if (card.action === "modal") {
      switch (card.modalType) {
        case "accountDetails":
          if (currentUser && currentUser.name && currentUser.email) {
            setAccountDetailsModalOpen(true);
          } else {
            console.error("User data not available for account details modal");
            toast.error("User data not available. Please refresh the page.");
          }
          break;
        case "myPlans":
          setMyPlansModalOpen(true);
          break;
        case "Address":
          setAddresssModalOpen(true);
          break;
        default:
          console.warn(`Unhandled modal type: ${card.modalType}`);
          break;
      }
    }
  };

  // Show loading state while auth is initializing
  if (!isInitialized) {
    return (
      <div className="w-full py-20 bg-cover bg-center bg-greenleaf">
        <div className="container h-full flex flex-col justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Loading Profile...</h2>
            <p className="text-gray-600">
              Please wait while we load your profile data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if no user data is available
  if (!currentUser) {
    return (
      <div className="w-full py-20 bg-cover bg-center bg-greenleaf">
        <div className="container h-full flex flex-col justify-center items-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Profile Not Available
            </h2>
            <p className="text-gray-600 mb-6">
              Unable to load your profile data.
            </p>
            <ArrowButton
              onClick={() => router.push("/auth/login")}
              label="Go to Login"
              theme="dark"
              size="lg"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="w-full py-10 bg-cover bg-center bg-greenleaf lg:mb-20 mb-10">
        <div className="container h-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="top-content-badge">Profile Page</h1>
            <h2 className="text-5xl 2xl:text-6xl mb-4 font-semibold">
              {currentUser?.name}
            </h2>
            <p className="text-gray-600">
              {formatMobileNumber(currentUser?.mobile_number || "")}{" "}
              <span className="px-2">|</span> {currentUser?.email}
            </p>
          </div>
          <ArrowButton
            onClick={() => setLogoutModalOpen(true)}
            label="Logout"
            theme="light"
            size="lg"
            className="cursor-pointer"
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
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
      />
      <AccountDetailsModal
        key={`account-details-${isAccountDetailsModalOpen}-${currentUser?.id}`}
        isOpen={isAccountDetailsModalOpen}
        onClose={handleAccountDetailsClose}
        user={currentUser}
      />
      <MyPlansModal
        isOpen={isMyPlansModalOpen}
        onClose={() => setMyPlansModalOpen(false)}
      />
      <AddresssModal
        isOpen={isAddresssModalOpen}
        onClose={() => setAddresssModalOpen(false)}
      />
    </>
  );
}
