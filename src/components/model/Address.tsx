"use client"; // If using Next.js App Router

import React, { useState, useEffect } from "react";
import Modal from "../animationComponents/animated-model"; // Your Modal component
import Image from "next/image";
import { Pen, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../uiFramework/Button";
import AnimatedInput from "../animationComponents/AnimatedInput"; // Assuming this takes value and onChange
import AnimatedTextarea from "../animationComponents/AnimatedTextarea"; // Assuming this takes value and onChange

interface Address {
  id: string;
  name: string;
  addressLine: string;
  phone: string;
  landmark?: string;
  city?: string;
}

type AddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const initialAddressFormState: Omit<Address, "id"> & { id?: string } = {
  id: undefined,
  name: "",
  addressLine: "",
  phone: "",
  landmark: "",
  city: "",
};

export default function AddresssModal({ isOpen, onClose }: AddressModalProps) {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "John Static Deo",
      addressLine:
        "Aeropuerto Internacional de Cozumel Av. 65 y Boulevard Aeropuerto Cozumel S/n (Static)",
      phone: "+1 123 4567",
      city: "Cozumel",
      landmark: "Airport",
    },
    {
      id: "2",
      name: "Jane Static Smith",
      addressLine: "123 Innovation Drive, Tech City (Static)",
      phone: "+1 987 6543",
      city: "Tech City",
      landmark: "Near Tech Park",
    },
    {
      id: "3",
      name: "Alice Static Wonder",
      addressLine: "456 Static Lane, Wonderland",
      phone: "+1 555 0000",
      city: "Wonderland",
      landmark: "Main Street",
    },
  ]);

  const [viewMode, setViewMode] = useState<"list" | "addForm" | "editForm">(
    "list"
  );
  const [formData, setFormData] = useState<
    Omit<Address, "id"> & { id?: string }
  >(initialAddressFormState);

  useEffect(() => {
    if (isOpen) {
      setViewMode("list");
      setFormData(initialAddressFormState);
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewClick = () => {
    setFormData(initialAddressFormState);
    setViewMode("addForm");
  };

  const handleEditClick = (address: Address) => {
    setFormData({
      id: address.id,
      name: address.name,
      addressLine: address.addressLine,
      phone: address.phone,
      landmark: address.landmark || "",
      city: address.city || "",
    });
    setViewMode("editForm");
  };

  const handleSaveAddress = () => {
    const { name, addressLine, phone, city, landmark } = formData;
    if (
      !name.trim() ||
      !addressLine.trim() ||
      !phone.trim() ||
      !city?.trim() ||
      !landmark?.trim()
    ) {
      alert(
        "Please fill in all required fields: Name, Address Line, Phone, City, and Landmark."
      );
      return;
    }

    if (viewMode === "editForm" && formData.id) {
      // Update existing address
      setAddresses((prevAddresses) =>
        prevAddresses.map((addr) =>
          addr.id === formData.id
            ? { ...addr, ...formData, id: formData.id as string }
            : addr
        )
      );
      alert(`Address for ${formData.name} updated.`);
    } else {
      // Add new address
      const newAddressEntry: Address = {
        id: Date.now().toString(), // Simple ID generation
        name: formData.name,
        addressLine: formData.addressLine,
        phone: formData.phone,
        landmark: formData.landmark,
        city: formData.city,
      };
      setAddresses((prevAddresses) => [...prevAddresses, newAddressEntry]);
      alert(`Address for ${formData.name} saved.`);
    }

    setFormData(initialAddressFormState);
    setViewMode("list");
  };

  const handleCancel = () => {
    setFormData(initialAddressFormState);
    setViewMode("list");
  };

  const handleDeleteAddress = (addressId: string) => {
    if (window.confirm("Are you sure you want to remove this address?")) {
      setAddresses((prevAddresses) =>
        prevAddresses.filter((addr) => addr.id !== addressId)
      );
      alert("Address removed.");
      // If the deleted address was being edited, go back to list
      if (viewMode === "editForm" && formData.id === addressId) {
        handleCancel();
      }
    }
  };

  const getModalTitle = () => {
    if (viewMode === "addForm") return "Add New Address";
    if (viewMode === "editForm") return "Edit Address";
    return "Saved Addresses";
  };

  const viewVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <Modal
      className="max-w-6xl w-full h-full max-h-[85vh] rounded-lg overflow-hidden shadow-lg grid grid-cols-12"
      isOpen={isOpen}
      onClose={() => {
        handleCancel();
        onClose();
      }}
    >
      <div className="sm:col-span-5 hidden sm:block relative min-h-fit">
        <Image
          src="/images/modal-3.jpg"
          fill
          alt="model image"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="sm:col-span-7 col-span-12 max-h-[85vh] flex flex-col">
        <h2 className="text-lg md:text-2xl font-semibold p-6 border-b border-gray-200">
          {getModalTitle()}
        </h2>

        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          {" "}
          {/* Adjusted max-h if needed */}
          <AnimatePresence mode="wait">
            {viewMode === "list" ? (
              <motion.div
                key="addressList"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={viewVariants}
                transition={viewVariants.transition}
              >
                {addresses.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="bg-gray-100 p-5 rounded-lg"
                      >
                        <p className="font-medium text-lg mb-1">
                          {address.name}
                        </p>
                        <p className="text-gray-700 text-sm">
                          {address.addressLine}
                        </p>
                        {address.landmark && (
                          <p className="text-gray-600 text-sm">
                            Landmark: {address.landmark}
                          </p>
                        )}
                        {address.city && (
                          <p className="text-gray-600 text-sm">
                            City: {address.city}
                          </p>
                        )}
                        <p className="text-gray-700 mb-4 text-sm mt-1">
                          Phone: {address.phone}
                        </p>
                        <div className="flex gap-4 items-center">
                          <button
                            onClick={() => handleEditClick(address)}
                            className="px-3.5 py-2 flex gap-1.5 bg-green-100/50 text-green-700 hover:bg-green-700 hover:text-white transition-all duration-200 border border-green-700 rounded-full items-center cursor-pointer text-sm"
                          >
                            <Pen size={14} />
                            <span className="font-medium">Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="px-3.5 py-2 flex gap-1.5 bg-red-100/50 text-red-700 hover:bg-red-700 hover:text-white transition-all duration-200 border border-red-700 rounded-full items-center cursor-pointer text-sm"
                          >
                            <Trash2 size={14} />
                            <span className="font-medium">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    key="noAddress"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={viewVariants}
                    transition={viewVariants.transition}
                    className="py-10 text-center"
                  >
                    <p className="text-gray-500">
                      You haven&apos;t saved any addresses yet.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // ------------ ADD/EDIT ADDRESS FORM VIEW ------------
              <motion.div
                key="addEditAddressForm"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={viewVariants}
                transition={viewVariants.transition}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveAddress();
                  }}
                >
                  <div className="space-y-5">
                    <AnimatedInput
                      label="Full Name"
                      name="name" // Key in formData
                      type="text"
                      value={formData.name}
                      required
                    />
                    <AnimatedTextarea
                      label="Address"
                      name="addressLine" // Key in formData
                      value={formData.addressLine}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                    <AnimatedInput
                      label="Landmark"
                      name="landmark" // Key in formData
                      type="text"
                      value={formData.landmark || ""}
                      required
                    />
                    <AnimatedInput
                      label="City"
                      name="city" // Key in formData
                      type="text"
                      value={formData.city || ""}
                      required
                    />
                    <AnimatedInput
                      label="Mobile number"
                      name="phone" // Key in formData
                      type="tel"
                      value={formData.phone}
                      required
                    />
                  </div>
                  {/* Submit button is in the footer, triggered by form onSubmit or click */}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 mt-auto">
          {viewMode === "list" ? (
            <Button
              label="+ Add New Address"
              variant="btn-dark"
              size="xl"
              onClick={handleAddNewClick}
            />
          ) : (
            <>
              <Button
                label="Cancel"
                variant="btn-light"
                size="xl"
                onClick={handleCancel}
              />
              <Button
                label={
                  viewMode === "editForm" ? "Update Address" : "Save Address"
                }
                variant="btn-dark"
                size="xl"
                onClick={handleSaveAddress} // Can also be type="submit" if inside the <form>
              />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
