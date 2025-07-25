"use client"; // If using Next.js App Router

import React, { useState, useEffect } from "react";
import Modal from "../animationComponents/animated-model";
import { Pen, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../uiFramework/Button";
import AnimatedInput from "../animationComponents/AnimatedInput";
import AnimatedTextarea from "../animationComponents/AnimatedTextarea";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Address {
  _id: string;
  name: string;
  address: string;
  phone_number: string;
  landmark?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  is_default?: boolean;
}

type AddressModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

// Define the type for the form state to allow _id to be string or undefined
type AddressFormState = {
  _id?: string;
  name: string;
  address: string;
  phone_number: string;
  landmark: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  is_default: boolean;
};

const initialAddressFormState: AddressFormState = {
  _id: undefined,
  name: "",
  address: "",
  phone_number: "",
  landmark: "",
  city: "",
  state: "",
  country: "India",
  zipcode: "",
  is_default: false,
};

const API_BASE_URL = "/api/v1";

export default function AddresssModal({ isOpen, onClose }: AddressModalProps) {
  const { } = useAuth(); // Auth context is imported but not currently used
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<"list" | "addForm" | "editForm">(
    "list"
  );
  const [formData, setFormData] = useState(initialAddressFormState);

  // Fetch addresses when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
      setViewMode("list");
      setFormData(initialAddressFormState);
    }
  }, [isOpen]);

  // Fetch addresses from API
  const fetchAddresses = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/addresses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch addresses");
      }

      if (data.success && data.data) {
        setAddresses(data.data);
      } else {
        setAddresses([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch addresses");
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddNewClick = () => {
    setFormData(initialAddressFormState);
    setViewMode("addForm");
  };

  const handleEditClick = (address: Address) => {
    // Map API response fields to form fields
    setFormData({
      _id: address._id,
      name: address.name,
      address: address.address,
      phone_number: address.phone_number,
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      country: "India",
      zipcode: address.zipcode || "",
      is_default: address.is_default || false,
    });
    setViewMode("editForm");
  };

  const validateForm = () => {
    const { name, address, phone_number, city, landmark } = formData;
    if (
      !name.trim() ||
      !address.trim() ||
      !phone_number.trim() ||
      !city?.trim() ||
      !landmark?.trim()
    ) {
      toast.error(
        "Please fill in all required fields: Name, Address, Phone, City, and Landmark."
      );
      return false;
    }
    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const isEditing = viewMode === "editForm" && formData._id;
      const url = isEditing 
        ? `${API_BASE_URL}/addresses/${formData._id}` 
        : `${API_BASE_URL}/addresses`;
      
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone_number: formData.phone_number,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          country: "India",
          zipcode: formData.zipcode,
          is_default: formData.is_default,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save address");
      }

      toast.success(isEditing ? "Address updated successfully" : "Address saved successfully");
      
      // Refresh the address list
      await fetchAddresses();
      
      // Reset form and go back to list view
      setFormData(initialAddressFormState);
      setViewMode("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
      toast.error(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialAddressFormState);
    setViewMode("list");
  };
function showDeleteConfirmation(onConfirm: () => void) {
  toast.custom((t) => (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-[320px]">
      <h3 className="text-sm font-semibold mb-2">Are you sure?</h3>
      <p className="text-gray-700 text-sm mb-4">
        Do you really want to remove this address?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          // className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          className="px-3.5 py-2 flex bg-gray-100 text-black hover:bg-gray-200 transition-all border rounded-full duration-200 items-center cursor-pointer text-sm"

        >
          Cancel
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onConfirm(); // Trigger delete logic
          }}
          // className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          className="px-3.5 py-2 flex bg-red-100/50 text-red-700 hover:bg-red-700 hover:text-white transition-all duration-200 border border-red-700 rounded-full items-center cursor-pointer text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  ),
    {
      position: "top-center",
      duration: 2000,
      id: "delete-confirm", 
    });
}

  const handleDeleteAddress = async (addressId: string) => {
  // move logic to a confirm wrapper
  showDeleteConfirmation(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete address");
      }

      toast.success("Address removed successfully");

      setAddresses((prevAddresses) =>
        prevAddresses.filter((addr) => addr._id !== addressId)
      );

      if (viewMode === "editForm" && formData._id === addressId) {
        handleCancel();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete address";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  });
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
      className="max-w-sm w-full max-h-[80vh] rounded-lg overflow-hidden shadow-lg flex flex-col"
      isOpen={isOpen}
      onClose={() => {
        handleCancel();
        toast.dismiss();
        onClose();
      }}
    >
      <h2 className="text-lg md:text-2xl font-semibold p-6 border-b border-gray-200 text-center">
        {getModalTitle()}
      </h2>
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto p-6">
          {isLoading && viewMode === "list" ? (
            <div className="py-10 text-center">
              <p className="text-gray-500">Loading addresses...</p>
            </div>
          ) : error && viewMode === "list" ? (
            <div className="py-10 text-center">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={fetchAddresses}
                className="mt-4 text-primary hover:underline"
              >
                Try again
              </button>
            </div>
          ) : (
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
                          key={address._id}
                          className={`bg-gray-100 p-5 rounded-lg ${address.is_default ? 'border-2 border-green-600' : ''}`}
                        >
                          <p className="font-medium text-lg mb-1 flex items-center gap-2">
                            {address.name}
                            {address.is_default && (
                              <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 border border-green-600 font-semibold">Default</span>
                            )}
                          </p>
                          <p className="text-gray-700 text-sm">
                            {address.address}
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
                            Phone: {address.phone_number}
                          </p>
                          <div className="flex gap-4 items-center">
                            <button
                              onClick={() => handleEditClick(address)}
                              className="px-3.5 py-2 flex gap-1.5 bg-green-100/50 text-green-700 hover:bg-green-700 hover:text-white transition-all duration-200 border border-green-700 rounded-full items-center cursor-pointer text-sm"
                              disabled={isLoading}
                            >
                              <Pen size={14} />
                              <span className="font-medium">Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(address._id)}
                              className="px-3.5 py-2 flex gap-1.5 bg-red-100/50 text-red-700 hover:bg-red-700 hover:text-white transition-all duration-200 border border-red-700 rounded-full items-center cursor-pointer text-sm"
                              disabled={isLoading}
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
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      <AnimatedTextarea
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        required
                      />
                      <AnimatedInput
                        label="Landmark"
                        name="landmark"
                        type="text"
                        value={formData.landmark || ""}
                        onChange={handleInputChange}
                        required
                      />
                      <AnimatedInput
                        label="City"
                        name="city"
                        type="text"
                        value={formData.city || ""}
                        onChange={handleInputChange}
                        required
                      />
                      <AnimatedInput
                        label="State"
                        name="state"
                        type="text"
                        value={formData.state || ""}
                        onChange={handleInputChange}
                      />
                      {/* <AnimatedInput
                        label="Country"
                        name="country"
                        type="text"
                        value={formData.country = "India"}
                        onChange={handleInputChange}
                        readOnly
                      /> */}
                      <AnimatedInput
                        label="Zipcode"
                        name="zipcode"
                        type="text"
                        value={formData.zipcode || ""}
                        onChange={handleInputChange}
                      />
                      <AnimatedInput
                        label="Mobile number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="is_default"
                          name="is_default"
                          checked={formData.is_default}
                          onChange={handleCheckboxChange}
                          className="w-4 h-4 accent-green-600 focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="is_default" className="text-sm text-gray-700">
                          Set as default address
                        </label>
                      </div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 mt-auto">
          {viewMode === "list" ? (
            <Button
              label="+ Add New Address"
              variant="btn-dark"
              size="xl"
              onClick={handleAddNewClick}
              disabled={isLoading}
            />
          ) : (
            <>
              <Button
                label="Cancel"
                variant="btn-light"
                size="xl"
                onClick={handleCancel}
                disabled={isLoading}
              />
              <Button
                label={
                  isLoading
                    ? "Saving..."
                    : viewMode === "editForm"
                    ? "Update Address"
                    : "Save Address"
                }
                variant="btn-dark"
                size="xl"
                onClick={handleSaveAddress}
                disabled={isLoading}
              />
            </>
          )}
        </div>
      </Modal>
  );
}
