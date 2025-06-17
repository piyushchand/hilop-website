import React, { useState, useEffect } from "react";
import Modal from "../animationComponents/animated-model";
import Button from "../uiFramework/Button";
import Image from "next/image";
import AnimatedInput from "../animationComponents/AnimatedInput";
import { User } from "@/types/auth";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

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
}

export default function AccountDetailsModal({
  isOpen,
  onClose,
  user,
}: AccountDetailsModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mobile_number: '',
    birthdate: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState<FormData | null>(null);
  const { updateUser, refreshUserData } = useAuth();

  // Helper function to format user data for form
  const formatUserDataForForm = (userData: User): FormData => {
    const mobileNumber = userData.mobile_number.startsWith('91') 
      ? userData.mobile_number.slice(2) 
      : userData.mobile_number;
    
    // Convert birthdate from DD-MM-YYYY to YYYY-MM-DD for input
    const formatBirthdateForInput = (birthdate: string) => {
      if (!birthdate) return '';
      if (birthdate.includes('-')) {
        const parts = birthdate.split('-');
        if (parts.length === 3) {
          const [day, month, year] = parts;
          return `${year}-${month}-${day}`;
        }
      }
      return birthdate;
    };

    return {
      name: userData.name || '',
      email: userData.email || '',
      mobile_number: mobileNumber,
      birthdate: formatBirthdateForInput(userData.birthdate || ''),
    };
  };

  // Initialize form data when modal opens with user data
  useEffect(() => {
    if (isOpen && user) {
      const newFormData = formatUserDataForForm(user);
      setFormData(newFormData);
      setInitialData(newFormData);
      setIsDirty(false);
    }
  }, [isOpen, user]);

  // Force re-initialization when user data changes while modal is open
  useEffect(() => {
    if (isOpen && user && (!initialData || initialData.name !== user.name)) {
      const newFormData = formatUserDataForForm(user);
      setFormData(newFormData);
      setInitialData(newFormData);
      setIsDirty(false);
    }
  }, [user, isOpen, initialData]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsDirty(false);
      setIsLoading(false);
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
      }, 100);
    }
  }, [isOpen, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // Process mobile number input
    if (name === 'mobile_number') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Check if form is dirty by comparing with initial data
    const newFormData = { ...formData, [name]: processedValue };
    const isFormDirty = initialData && (
      newFormData.name !== initialData.name ||
      newFormData.email !== initialData.email ||
      newFormData.mobile_number !== initialData.mobile_number ||
      newFormData.birthdate !== initialData.birthdate
    );
    
    setIsDirty(!!isFormDirty);
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Name validation
    if (!formData.name.trim()) {
      errors.push('Name is required');
    } else if (formData.name.length < 2) {
      errors.push('Name must be at least 2 characters long');
    } else if (formData.name.length > 50) {
      errors.push('Name must be less than 50 characters');
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
      }
    }

    // Mobile number validation
    const mobileNumber = formData.mobile_number.trim();
    if (!mobileNumber) {
      errors.push('Mobile number is required');
    } else if (mobileNumber.length !== 10) {
      errors.push('Please enter a valid 10-digit mobile number');
    } else {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(mobileNumber)) {
        errors.push('Please enter a valid Indian mobile number starting with 6-9');
      }
    }

    // Birthdate validation
    if (!formData.birthdate) {
      errors.push('Date of birth is required');
    } else {
      const birthDate = new Date(formData.birthdate);
      const today = new Date();
      
      // Check if date is valid
      if (isNaN(birthDate.getTime())) {
        errors.push('Please enter a valid date of birth');
      } else {
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) {
          errors.push('You must be at least 18 years old');
        }
        if (age > 120) {
          errors.push('Please enter a valid date of birth');
        }
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'));
    }
  };

  const handleSave = async () => {
    if (!isDirty) {
      onClose();
      return;
    }

    try {
      setIsLoading(true);
      validateForm();

      // Convert birthdate back to DD-MM-YYYY format for API
      const formatBirthdateForAPI = (birthdate: string) => {
        if (!birthdate) return '';
        const date = new Date(birthdate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile_number: `91${formData.mobile_number.trim()}`,
        birthdate: formatBirthdateForAPI(formData.birthdate),
      };

      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update profile');
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      setIsDirty(false);
      
      // Refresh user data from backend to ensure we have the latest data
      console.log('🔄 Refreshing user data after profile update...');
      const refreshSuccess = await refreshUserData();
      
      if (refreshSuccess) {
        console.log('✅ User data refreshed successfully after profile update');
      } else {
        console.log('⚠️ Failed to refresh user data, but profile was updated');
        // Fallback: update local state with the data we sent
        const updatedUser = {
          ...user,
          name: updateData.name,
          email: updateData.email,
          mobile_number: updateData.mobile_number,
          birthdate: updateData.birthdate,
        };
        updateUser(updatedUser);
      }
      
      onClose();
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
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
    }
  };

  return (
    <Modal
      className="max-w-6xl w-full h-full max-h-[85vh] rounded-lg overflow-hidden shadow-lg grid grid-cols-12"
      isOpen={isOpen}
      onClose={handleCancel}
    >
      <div className="sm:col-span-5 hidden sm:block relative min-h-fit">
        <Image
          src="/images/modal-1.jpg"
          fill
          alt="model image 1"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="sm:col-span-7 col-span-12 max-h-[85vh] flex flex-col">
        <h2 className="text-lg md:text-2xl font-semibold p-6 border-b border-gray-200">
          Edit Account Details
        </h2>
        <div className="flex flex-col gap-6 overflow-y-auto p-6">
          <AnimatedInput
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <AnimatedInput 
            label="Email" 
            name="email" 
            type="email" 
            value={formData.email}
            onChange={handleInputChange}
            required 
          />
          
          <AnimatedInput
            label="Mobile number"
            name="mobile_number"
            type="tel"
            value={formData.mobile_number}
            onChange={handleInputChange}
            required
          />
          
          <AnimatedInput
            label="Date of Birth"
            name="birthdate"
            type="date"
            value={formData.birthdate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="flex justify-center gap-4 p-6 border-t border-gray-200 mt-auto">
          <Button
            label="Reset"
            variant="btn-secondary"
            size="xl"
            onClick={handleReset}
            disabled={isLoading || !isDirty}
          />
          <Button
            label="Cancel"
            variant="btn-secondary"
            size="xl"
            onClick={handleCancel}
            disabled={isLoading}
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
