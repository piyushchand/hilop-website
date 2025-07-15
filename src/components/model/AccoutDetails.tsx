import React, { useState, useEffect } from "react";
import Modal from "../animationComponents/animated-model";
import Button from "../uiFramework/Button";
import Image from "next/image";
import AnimatedInput from "../animationComponents/AnimatedInput";
import { User } from "@/types/auth";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import imageCompression from "browser-image-compression";

type AccountDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
};

interface FormData {
  name: string;
  email: string;
  mobile_number: string;
  birthdate: string;
  profile_image?: string;
  gender: string; // Add gender
}

export default function AccountDetailsModal({
  isOpen,
  onClose,
  user,
}: AccountDetailsModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    mobile_number: "",
    birthdate: "",
    profile_image: "",
    gender: "", // Add gender
  });
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const { updateUser, refreshUserData } = useAuth();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper function to format user data for form
  const formatUserDataForForm = (userData: User): FormData => {
    const mobileNumber = userData.mobile_number.startsWith("91")
      ? userData.mobile_number.slice(2)
      : userData.mobile_number;

    // Convert birthdate from DD-MM-YYYY to YYYY-MM-DD for input
    const formatBirthdateForInput = (birthdate: string) => {
      if (!birthdate) return "";
      if (birthdate.includes("-")) {
        const parts = birthdate.split("-");
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month}-${day}`;
        }
      }
      return birthdate;
    };

    return {
      name: userData.name || "",
      email: userData.email || "",
      mobile_number: mobileNumber,
      birthdate: formatBirthdateForInput(userData.birthdate || ""),
      profile_image: userData.profile_image || "",
      gender: ('gender' in userData && typeof (userData as { gender?: unknown }).gender === 'string') ? (userData as { gender?: string }).gender || "" : "",
    };
  };

  // Initialize form data when modal opens with user data
  useEffect(() => {
    if (isOpen && user) {
      const newFormData = formatUserDataForForm(user);
      setFormData(newFormData);
      setInitialData(newFormData);
      setIsDirty(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
    }
  }, [isOpen, user]);

  // Force re-initialization when user data changes while modal is open
  useEffect(() => {
    if (isOpen && user && (!initialData || initialData.name !== user.name)) {
      const newFormData = formatUserDataForForm(user);
      setFormData(newFormData);
      setInitialData(newFormData);
      setIsDirty(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
    }
  }, [user, isOpen, initialData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDirty(false);
      setIsLoading(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
    }
  }, [isOpen]);

  // Force initialization when modal opens (additional safety)
  useEffect(() => {
    if (isOpen && user) {
      setTimeout(() => {
        const newFormData = formatUserDataForForm(user);
        setFormData(newFormData);
        setInitialData(newFormData);
        setIsDirty(false);
        setProfileImageFile(null);
        setProfileImagePreview(null);
      }, 100);
    }
  }, [isOpen, user]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/heif",
        "image/heic",
      ];

      if (!allowedTypes.includes(file.type.toLowerCase())) {
        toast.error("Please upload a valid image file (JPG, PNG, JPEG, HEIF).");
        return;
      }

      try {
        setIsLoading(true);

        const image: HTMLImageElement = new window.Image();
        image.src = URL.createObjectURL(file);
        image.onload = async () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            toast.error("Failed to process image.");
            setIsLoading(false);
            return;
          }

          const size = Math.min(image.width, image.height);
          canvas.width = size;
          canvas.height = size;

          const x = (image.width - size) / 2;
          const y = (image.height - size) / 2;

          ctx.drawImage(image, x, y, size, size, 0, 0, size, size);

          canvas.toBlob(async (blob) => {
            if (!blob) {
              toast.error("Failed to process image.");
              setIsLoading(false);
              return;
            }

            try {
              const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 128,
                useWebWorker: true,
              };
              const compressedFile = await imageCompression(
                new File([blob], file.name, { type: blob.type }),
                options
              );

              setProfileImageFile(compressedFile);
              setProfileImagePreview(URL.createObjectURL(compressedFile));
              setIsDirty(true);
            } catch (compressionError) {
              console.error("Image compression error:", compressionError);
              toast.error("Failed to compress image. Please try another file.");
            } finally {
              setIsLoading(false);
            }
          }, file.type);
        };
        image.onerror = () => {
          toast.error("Failed to load image. Please try another file.");
          setIsLoading(false);
        };
      } catch (error) {
        console.error("Image processing error:", error);
        toast.error("Failed to process image. Please try another file.");
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Process mobile number input
    if (name === "mobile_number") {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Check if form is dirty by comparing with initial data
    const newFormData = { ...formData, [name]: processedValue };
    const isFormDirty =
      initialData &&
      (newFormData.name !== initialData.name ||
        newFormData.email !== initialData.email ||
        newFormData.mobile_number !== initialData.mobile_number ||
        newFormData.birthdate !== initialData.birthdate ||
        newFormData.gender !== initialData.gender);

    setIsDirty(!!isFormDirty || !!profileImageFile);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    } else if (formData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Mobile number validation
    const mobileNumber = formData.mobile_number.trim();
    if (!mobileNumber) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (mobileNumber.length !== 10) {
      newErrors.mobile_number = "Please enter a valid 10-digit mobile number";
    } else {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(mobileNumber)) {
        newErrors.mobile_number =
          "Please enter a valid Indian mobile number starting with 6-9";
      }
    }

    // Birthdate validation
    if (!formData.birthdate) {
      newErrors.birthdate = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();

      // Check if date is valid
      if (isNaN(birthDate.getTime())) {
        newErrors.birthdate = "Please enter a valid date of birth";
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          newErrors.birthdate = "You must be at least 18 years old";
        }
        if (age > 120) {
          newErrors.birthdate = "Please enter a valid date of birth";
        }
      }
    }

    // Gender validation
    if (!formData.gender) {
      newErrors.gender = "Gender is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!isDirty) {
      onClose();
      return;
    }

    setErrors({});
    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    try {
      setIsLoading(true);

      // Convert birthdate back to DD-MM-YYYY format for API
      const formatBirthdateForAPI = (birthdate: string) => {
        if (!birthdate) return "";
        const date = new Date(birthdate);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile_number: `91${formData.mobile_number.trim()}`,
        birthdate: formatBirthdateForAPI(formData.birthdate),
        gender: formData.gender,
      };

      let response;

      if (profileImageFile) {
        const body = new FormData();
        body.append("name", updateData.name);
        body.append("email", updateData.email);
        body.append("mobile_number", updateData.mobile_number);
        body.append("birthdate", updateData.birthdate);
        body.append("gender", updateData.gender);
        body.append("profile_image", profileImageFile);

        response = await fetch("/api/auth/update-profile", {
          method: "PUT",
          body: body,
        });
      } else {
        response = await fetch("/api/auth/update-profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        });
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      if (!result.success) {
        throw new Error(result.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      setIsDirty(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);

      // Refresh user data from backend to ensure we have the latest data
      console.log("🔄 Refreshing user data after profile update...");
      const refreshSuccess = await refreshUserData();

      if (refreshSuccess) {
        console.log("✅ User data refreshed successfully after profile update");
      } else {
        console.log("⚠️ Failed to refresh user data, but profile was updated");
        // Fallback: update local state with the data we sent
        const updatedUser = {
          ...user,
          name: updateData.name,
          email: updateData.email,
          mobile_number: updateData.mobile_number,
          birthdate: updateData.birthdate,
          // Note: we can't know the new profile_image URL without a refresh
        };
        updateUser(updatedUser);
      }

      onClose();
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to cancel?"
        )
      ) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setIsDirty(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
    }
  };

  const profileImageUrl =
    profileImagePreview || formData.profile_image || "/images/placeholder.svg";

  return (
    <Modal
      className="max-w-6xl w-full h-full max-h-[85vh] rounded-lg overflow-hidden shadow-lg grid grid-cols-1 sm:grid-cols-12" isOpen={isOpen}
      onClose={handleCancel}
    >
      {/* Left column: Image (desktop only) */}
      <div className="sm:col-span-5 hidden sm:block relative min-h-fit h-full">
        <Image
          src="/images/modal-1.jpg"
          fill
          alt="model image"
          className="object-cover w-full h-full"
        />
      </div>
      {/* Right column: Form */}
      <div className="sm:col-span-7 col-span-1 w-full flex flex-col overflow-auto bg-white">
        <h2 className="text-lg md:text-2xl font-semibold p-6 border-b border-gray-200">
          Edit Account Details
        </h2>
        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          <div className="flex items-center gap-4">
            <Image
              src={profileImageUrl}
              width={128}
              height={128}
              alt={
                formData.name
                  ? `${formData.name}'s profile image`
                  : "Profile image"
              }
              className="object-cover w-32 h-32 rounded-2xl bg-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/images/placeholder.svg";
              }}
            />
            <div>
              <Button
                label="Change Image"
                variant="btn-secondary"
                onClick={() =>
                  document.getElementById("profileImageInput")?.click()
                }
              />
              <input
                type="file"
                id="profileImageInput"
                className="hidden"
                accept="image/jpeg,image/png,image/heif,image/heic"
                onChange={handleImageChange}
              />
              <p className="text-sm text-gray-500 mt-2">
                JPG, PNG, JPEG, HEIF. 1MB max.
              </p>
            </div>
          </div>
          <div>
            <AnimatedInput
              label="Full Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>

          <div>
            <AnimatedInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>

          <div>
            <div className="relative hilop-mobile-input-wrapper">
              <span className="absolute left-3 top-4 translate-y-[10%] text-gray-500 text-base select-none pointer-events-none z-10">+91</span>
              <AnimatedInput
                label="Mobile number"
                name="mobile_number"
                type="tel"
                value={formData.mobile_number}
                onChange={handleInputChange}
                required
                placeholder="9876543210"
              />
            </div>
            {errors.mobile_number && (
              <div className="text-red-500 text-sm mt-1">
                {errors.mobile_number}
              </div>
            )}
          </div>

          <div>

          <AnimatedInput
            label="Date of Birth"
            name="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={handleInputChange}
            required
          />
          {errors.birthdate && (
            <div className="text-red-500 text-sm">{errors.birthdate}</div>
          )}
</div>
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="gender-select">
              Gender <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="gender-select"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full h-12 px-3 pr-10 py-2 border border-gray-300 rounded-xl bg-white text-gray-700 focus:outline-none focus:border-green-500 appearance-none transition-colors duration-200"
                required
              >
                <option value="" disabled className="text-gray-400">
                  Select gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {/* Custom arrow icon */}
              <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </div>
            {errors.gender && (
              <div className="text-red-500 text-sm mt-1">{errors.gender}</div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200 mt-auto text-red-500">
          <Button
            label="Reset"
            variant="btn-secondary"
            size="xl"
            onClick={handleReset}
            disabled={isLoading || !isDirty}
          />

          <Button
            label={isLoading ? "Saving..." : "Save Changes"}
            variant="btn-dark"
            size="xl"
            onClick={handleSave}
            disabled={isLoading || !isDirty}
          />
        </div>
      </div>
    </Modal>
  );
}
