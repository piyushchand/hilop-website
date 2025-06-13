'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import Image from 'next/image';
import { Calendar, Mail, Phone, Coins } from 'lucide-react';
import Button from '@/components/uiFramework/Button';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { fetchProfile } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Fetch fresh profile data
    fetchProfile().catch(console.error);
  }, [isAuthenticated, router, fetchProfile]);

  if (!user) {
    return null;
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative">
              {user.profile_image ? (
                <Image
                  src={user.profile_image}
                  alt={`${user.name}'s profile`}
                  width={120}
                  height={120}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-[120px] h-[120px] rounded-full bg-gray-200 flex items-center justify-center text-4xl text-gray-600">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
              {user.is_verified && (
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p>{user.mobile_number}</p>
                </div>
              </div>
              {user.birthdate && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Birthdate</p>
                    <p>{user.birthdate}</p>
                  </div>
                </div>
              )}
              {user.hilop_coins !== undefined && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Coins className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-gray-500">Hilop Coins</p>
                    <p className="text-green-800 font-medium">
                      {user.hilop_coins.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              label="Edit Profile"
              variant="btn-primary"
              size="lg"
              link="/profile/edit"
            />
            <Button
              label="View Orders"
              variant="btn-secondary"
              size="lg"
              link="/my-order"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
