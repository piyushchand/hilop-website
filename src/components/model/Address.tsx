"use client"; // If using Next.js App Router

import React, { useState, useEffect, useRef } from "react";
import Modal from "../animationComponents/animated-model";
import { Pen, Star, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../uiFramework/Button";
import AnimatedInput from "../animationComponents/AnimatedInput";
import AnimatedTextarea from "../animationComponents/AnimatedTextarea";
import AnimatedSelect from "../animationComponents/AnimatedSelect";
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

// Define validation errors type
type ValidationErrors = {
  name?: string;
  address?: string;
  phone_number?: string;
  landmark?: string;
  city?: string;
  state?: string;
  zipcode?: string;
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

const initialValidationErrors: ValidationErrors = {};

const API_BASE_URL = "/api/v1";

export default function AddresssModal({ isOpen, onClose }: AddressModalProps) {
  const {} = useAuth(); // Auth context is imported but not currently used
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [states, setStates] = useState<Array<{ value: string; label: string }>>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<"list" | "addForm" | "editForm">(
    "list"
  );
  const [formData, setFormData] = useState(initialAddressFormState);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    initialValidationErrors
  );

  // Refs for error elements
  const errorRefs = useRef<{ [key: string]: HTMLParagraphElement | null }>({});
  const modalScrollRef = useRef<HTMLDivElement>(null);

  // Fetch addresses when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
      fetchStates(); // Now synchronous
      setViewMode("list");
      setFormData(initialAddressFormState);
      setValidationErrors(initialValidationErrors);
    }
  }, [isOpen]);

  // Scroll to first error when validation errors change
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0 && viewMode !== "list") {
      scrollToFirstError();
    }
  }, [validationErrors, viewMode]);

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
      setError(
        err instanceof Error ? err.message : "Failed to fetch addresses"
      );
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  // Static Indian states data
  const indianStates = [
    { value: "andhra-pradesh", label: "Andhra Pradesh" },
    { value: "arunachal-pradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachal-pradesh", label: "Himachal Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "madhya-pradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamil-nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttar-pradesh", label: "Uttar Pradesh" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "west-bengal", label: "West Bengal" },
    { value: "andaman-nicobar", label: "Andaman and Nicobar Islands" },
    { value: "chandigarh", label: "Chandigarh" },
    { value: "dadra-nagar-haveli", label: "Dadra and Nagar Haveli" },
    { value: "daman-diu", label: "Daman and Diu" },
    { value: "delhi", label: "Delhi" },
    { value: "lakshadweep", label: "Lakshadweep" },
    { value: "puducherry", label: "Puducherry" },
  ];

  // Initialize states with static data
  const fetchStates = () => {
    setStates(indianStates);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user selects an option
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddNewClick = () => {
    // Check if there are existing addresses to determine if this should be default
    const hasExistingAddresses = addresses.length > 0;
    setFormData({
      ...initialAddressFormState,
      is_default: !hasExistingAddresses, // Set as default only if it's the first address
    });
    setValidationErrors(initialValidationErrors);
    setViewMode("addForm");
  };

  // Helper function to map state name to value
  const mapStateNameToValue = (stateName: string): string => {
    const state = indianStates.find(
      (s) => s.label.toLowerCase() === stateName.toLowerCase()
    );
    return state ? state.value : stateName;
  };

  // Helper function to map state value to name
  const mapStateValueToName = (stateValue: string): string => {
    const state = indianStates.find((s) => s.value === stateValue);
    return state ? state.label : stateValue;
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
      state: address.state ? mapStateNameToValue(address.state) : "",
      country: "India",
      zipcode: address.zipcode || "",
      is_default: address.is_default || false,
    });
    setValidationErrors(initialValidationErrors);
    setViewMode("editForm");
  };

  // Function to scroll to the first error message
  const scrollToFirstError = () => {
    // Wait for the next tick to ensure errors are rendered
    setTimeout(() => {
      // Find the first error element using refs
      const firstErrorKey = Object.keys(validationErrors).find(
        (key) => validationErrors[key as keyof ValidationErrors]
      );

      if (firstErrorKey && errorRefs.current[firstErrorKey]) {
        // Use the modal's scroll container if available
        if (modalScrollRef.current) {
          const errorElement = errorRefs.current[firstErrorKey];
          if (errorElement) {
            const containerRect =
              modalScrollRef.current.getBoundingClientRect();
            const elementRect = errorElement.getBoundingClientRect();
            const scrollTop = modalScrollRef.current.scrollTop;
            const elementTop = elementRect.top - containerRect.top + scrollTop;

            modalScrollRef.current.scrollTo({
              top: elementTop - containerRect.height / 2,
              behavior: "smooth",
            });
          }
        } else {
          // Fallback to scrollIntoView
          errorRefs.current[firstErrorKey]?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      } else {
        // Fallback: try to find error elements by class name within the modal
        const modalContent = document.querySelector(
          ".flex-1.flex.flex-col.gap-6.overflow-y-auto"
        );
        if (modalContent) {
          const errorElements = modalContent.querySelectorAll(
            ".text-red-500.text-xs"
          );
          if (errorElements.length > 0) {
            errorElements[0].scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        } else {
          // Final fallback: global search
          const errorElements = document.querySelectorAll(
            ".text-red-500.text-xs"
          );
          if (errorElements.length > 0) {
            errorElements[0].scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        }
      }
    }, 300); // Increased timeout to ensure DOM is updated
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    // Validate address
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    // Validate phone number
    if (!formData.phone_number.trim()) {
      errors.phone_number = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phone_number.trim())) {
      errors.phone_number = "Please enter a valid 10-digit phone number";
    }

    // Validate landmark
    if (!formData.landmark.trim()) {
      errors.landmark = "Landmark is required";
    }

    // Validate city
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }

    // Validate state
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }

    // Validate zipcode
    if (!formData.zipcode.trim()) {
      errors.zipcode = "Zipcode is required";
    } else if (!/^[0-9]{6}$/.test(formData.zipcode.trim())) {
      errors.zipcode = "Please enter a valid 6-digit zipcode";
    }

    setValidationErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // Function to set an address as default
  const setAddressAsDefault = async (addressId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Find the address to update
      const addressToUpdate = addresses.find((addr) => addr._id === addressId);
      if (!addressToUpdate) {
        throw new Error("Address not found");
      }

      const response = await fetch(`${API_BASE_URL}/addresses/${addressId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: addressToUpdate.name,
          address: addressToUpdate.address,
          phone_number: addressToUpdate.phone_number,
          landmark: addressToUpdate.landmark || "",
          city: addressToUpdate.city || "",
          state: addressToUpdate.state || "",
          country: addressToUpdate.country || "India",
          zipcode: addressToUpdate.zipcode || "",
          is_default: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to set address as default");
      }

      toast.success("Default address updated successfully");

      // Refresh the address list
      await fetchAddresses();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to set address as default"
      );
      toast.error(
        err instanceof Error ? err.message : "Failed to set address as default"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) {
      // Validation failed, scroll to first error is already handled in validateForm
      return; // Don't proceed if validation fails
    }

    setIsLoading(true);
    setError(null);

    try {
      const isEditing = viewMode === "editForm" && formData._id;
      const url = isEditing
        ? `${API_BASE_URL}/addresses/${formData._id}`
        : `${API_BASE_URL}/addresses`;

      const method = isEditing ? "PUT" : "POST";

      // If setting as default, we need to ensure only one address is default
      const requestBody = {
        name: formData.name,
        address: formData.address,
        phone_number: formData.phone_number,
        landmark: formData.landmark,
        city: formData.city,
        state: mapStateValueToName(formData.state),
        country: "India",
        zipcode: formData.zipcode,
        is_default: formData.is_default,
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save address");
      }

      toast.success(
        isEditing
          ? "Address updated successfully"
          : "Address saved successfully"
      );

      // Refresh the address list
      await fetchAddresses();

      // Reset form and go back to list view
      setFormData(initialAddressFormState);
      setValidationErrors(initialValidationErrors);
      setViewMode("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
      toast.error(
        err instanceof Error ? err.message : "Failed to save address"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialAddressFormState);
    setValidationErrors(initialValidationErrors);
    setViewMode("list");
  };

  function showDeleteConfirmation(onConfirm: () => void) {
    toast.custom(
      (t) => (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-[320px]">
          <h3 className="text-sm font-semibold mb-2">Are you sure?</h3>
          <p className="text-gray-700 text-sm mb-4">
            Do you really want to remove this address?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3.5 py-2 flex bg-gray-100 text-black hover:bg-gray-200 transition-all border rounded-full duration-200 items-center cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onConfirm(); // Trigger delete logic
              }}
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
      }
    );
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
      <div
        ref={modalScrollRef}
        className="flex-1 flex flex-col gap-6 overflow-y-auto p-6"
      >
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
                        className={`bg-gray-100 p-5 rounded-lg ${
                          address.is_default
                            ? "border-2 border-green-600 bg-green-50"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-lg flex items-center gap-2">
                            {address.name}
                            {address.is_default && (
                              <span className="flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 border border-green-600 font-semibold">
                                Default
                              </span>
                            )}
                          </p>
                        </div>
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
                        <div className="flex gap-2 items-center flex-wrap">
                          <button
                            onClick={() => handleEditClick(address)}
                            className="px-3.5 py-2 flex gap-1.5 bg-green-100/50 text-green-700 hover:bg-green-700 hover:text-white transition-all duration-200 border border-green-700 rounded-full items-center cursor-pointer text-sm"
                            disabled={isLoading}
                          >
                            <Pen size={14} />
                            <span className="font-medium">Edit</span>
                          </button>
                          {!address.is_default && (
                            <button
                              onClick={() => setAddressAsDefault(address._id)}
                              className="px-3.5 py-2 flex gap-1.5 border  bg-dark/5 border-dark text-dark hover:text-white  hover:bg-dark transition-all duration-200  rounded-full items-center cursor-pointer text-sm"
                              disabled={isLoading}
                            >
                              <Star size={14} />
                              <span className="font-medium">Set Default</span>
                            </button>
                          )}
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
                    <div>
                      <AnimatedInput
                        label="Full Name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.name && (
                        <p
                          ref={(el) => {
                            errorRefs.current.name = el;
                          }}
                          className="text-red-500 text-xs mt-1 ml-1"
                        >
                          {validationErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <AnimatedTextarea
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        required
                      />
                      {validationErrors.address && (
                        <p
                          ref={(el) => {
                            errorRefs.current.address = el;
                          }}
                          className="text-red-500 text-xs mt-1 ml-1"
                        >
                          {validationErrors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <AnimatedInput
                        label="Landmark"
                        name="landmark"
                        type="text"
                        value={formData.landmark || ""}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.landmark && (
                        <p
                          ref={(el) => {
                            errorRefs.current.landmark = el;
                          }}
                          className="text-red-500 text-xs mt-1 ml-1"
                        >
                          {validationErrors.landmark}
                        </p>
                      )}
                    </div>

                    <div>
                      <AnimatedInput
                        label="City"
                        name="city"
                        type="text"
                        value={formData.city || ""}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.city && (
                        <p
                          ref={(el) => {
                            errorRefs.current.city = el;
                          }}
                          className="text-red-500 text-xs mt-1 ml-1"
                        >
                          {validationErrors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <AnimatedSelect
                        label="State"
                        name="state"
                        value={formData.state || ""}
                        onChange={handleSelectChange}
                        options={states}
                        placeholder="state"
                        required
                      />
                      {validationErrors.state && (
                        <p
                          ref={(el) => {
                            errorRefs.current.state = el;
                          }}
                          className="text-red-500 text-xs mt-1 ml-1"
                        >
                          {validationErrors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <AnimatedInput
                        label="Zipcode"
                        name="zipcode"
                        type="text"
                        value={formData.zipcode || ""}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.zipcode && (
                        <p
                          ref={(el) => {
                            errorRefs.current.zipcode = el;
                          }}
                          className="text-red-500 text-xs mt-1 ml-1"
                        >
                          {validationErrors.zipcode}
                        </p>
                      )}
                    </div>

                    <div>
                      <AnimatedInput
                        label="Mobile number"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                      />
                      {validationErrors.phone_number && (
                        <p
                          ref={(el) => {
                            errorRefs.current.phone_number = el;
                          }}
                          className="text-red-500 text-xs mt-1 ml-1"
                        >
                          {validationErrors.phone_number}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                        <input
                          type="checkbox"
                          id="is_default"
                          name="is_default"
                          checked={formData.is_default}
                          onChange={handleCheckboxChange}
                          className="w-4 h-4 accent-green-600 cursor-pointer focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="is_default"
                          className="text-sm text-gray-700 flex items-center gap-2"
                        >
                          Set as default address
                        </label>
                      </div>
                      {formData.is_default && (
                        <span className="text-xs mt-1 text-green-600 font-medium">
                          This will replace any existing default address
                        </span>
                      )}
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
                  ? "Update"
                  : "Save"
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
