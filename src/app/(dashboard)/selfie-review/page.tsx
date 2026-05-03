'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Check, X, Camera, User } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface SelfieVerification {
  id: string;
  driverName: string;
  driverId: string;
  selfieUrl: string;
  submittedAt: string;
}

interface PendingSelfiesResponse {
  data: SelfieVerification[];
}

export default function SelfieReviewPage() {
  const [selfies, setSelfies] = useState<SelfieVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingIds, setReviewingIds] = useState<Set<string>>(new Set());

  const fetchPendingSelfies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<PendingSelfiesResponse>(
        '/admin/selfie-verifications/pending'
      );
      setSelfies(response.data.data);
    } catch {
      toast.error('Failed to load pending selfies. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingSelfies();
  }, [fetchPendingSelfies]);

  const handleReview = useCallback(
    async (id: string, approved: boolean) => {
      // Prevent duplicate submissions
      if (reviewingIds.has(id)) return;

      setReviewingIds((prev) => new Set(prev).add(id));

      // Optimistic removal
      const previousSelfies = selfies;
      setSelfies((prev) => prev.filter((s) => s.id !== id));

      try {
        await apiClient.post(`/admin/selfie-verifications/${id}/review`, {
          approved,
        });
        toast.success(
          approved
            ? 'Selfie approved successfully'
            : 'Selfie rejected successfully'
        );
      } catch {
        // Rollback on error
        setSelfies(previousSelfies);
        toast.error(
          `Failed to ${approved ? 'approve' : 'reject'} selfie. Please try again.`
        );
      } finally {
        setReviewingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [selfies, reviewingIds]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FACC15]/10">
            <Camera className="h-5 w-5 text-[#FACC15]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              Driver Selfie Verification
            </h1>
            <p className="text-sm text-[#6B7280] mt-0.5">
              Review and verify driver selfie photos
            </p>
          </div>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#2A2A2A] bg-[#141414] p-4 animate-pulse"
            >
              <div className="aspect-square w-full rounded-lg bg-[#2A2A2A] mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded bg-[#2A2A2A]" />
                <div className="h-3 w-1/2 rounded bg-[#2A2A2A]" />
                <div className="h-3 w-2/3 rounded bg-[#2A2A2A]" />
              </div>
              <div className="mt-4 flex gap-3">
                <div className="h-9 flex-1 rounded-lg bg-[#2A2A2A]" />
                <div className="h-9 flex-1 rounded-lg bg-[#2A2A2A]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && selfies.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-[#2A2A2A] bg-[#141414] py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2A2A2A] mb-4">
            <Camera className="h-8 w-8 text-[#6B7280]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">
            No Pending Selfies
          </h3>
          <p className="text-sm text-[#6B7280]">
            All driver selfie verifications have been reviewed.
          </p>
        </div>
      )}

      {/* Selfie Cards Grid */}
      {!loading && selfies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selfies.map((selfie) => {
            const isReviewing = reviewingIds.has(selfie.id);

            return (
              <div
                key={selfie.id}
                className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden transition-all hover:border-[#3A3A3A]"
              >
                {/* Selfie Image */}
                <div className="relative aspect-square w-full bg-[#0A0A0A]">
                  <Image
                    src={selfie.selfieUrl}
                    alt={`Selfie of ${selfie.driverName}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzJBMkEyQSIvPjwvc3ZnPg=="
                  />
                </div>

                {/* Card Content */}
                <div className="p-4">
                  {/* Driver Info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2A2A2A]">
                      <User className="h-4 w-4 text-[#FACC15]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {selfie.driverName}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        ID: {selfie.driverId}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        Submitted:{' '}
                        {new Date(selfie.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(selfie.id, true)}
                      disabled={isReviewing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(selfie.id, false)}
                      disabled={isReviewing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
