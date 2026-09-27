'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Wrench,
  Clock,
  ArrowRight,
  ClipboardCheck,
  Activity,
  Layers,
  BarChart3,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Users,
  Briefcase,
  TrendingUp,
  Sparkles,
  Hammer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useActiveSuppliers, useAdminQuickServiceBookings } from '@/hooks/use-admin-quick-services';
import { useState, useEffect, useMemo } from 'react';

export default function QuickServicesDashboardPage() {
  const router = useRouter();
  const suppliers = useActiveSuppliers();
  
  // Fetch up to 500 recent bookings to generate accurate stats across all services
  const { data: recentBookings, loading } = useAdminQuickServiceBookings({ page: 1, limit: 500 });
  
  // Aggregate data by service category
  const serviceStats = useMemo(() => {
    if (!recentBookings) return [];
    const stats: Record<string, { count: number; revenue: number; pending: number }> = {};
    
    recentBookings.forEach((b: any) => {
      const category = b.serviceCategory || b.serviceTitle || 'Unknown Service';
      if (!stats[category]) {
        stats[category] = { count: 0, revenue: 0, pending: 0 };
      }
      stats[category].count += 1;
      stats[category].revenue += Number(b.totalAmount || 0);
      if (b.status === 'PENDING') stats[category].pending += 1;
    });

    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [recentBookings]);

  // Overall KPIs
  const totalRequests = recentBookings?.length || 0;
  const pendingCount = recentBookings?.filter(b => b.status === 'PENDING').length || 0;
  const inProgressCount = recentBookings?.filter(b => b.status === 'IN_PROGRESS').length || 0;
  const totalRevenue = recentBookings?.reduce((sum, b) => sum + Number(b.totalAmount || 0), 0) || 0;

  // The predefined quick service types from the app to ensure we show a rich dashboard
  // The predefined quick service types from the app to ensure we show a rich dashboard
  const masterCategories = [
    {
      name: 'Home Services',
      icon: '🏠',
      color: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      subServices: ['Home Cleaning', 'Pest Control', 'Gardening', 'Plumbing', 'Carpenter']
    },
    {
      name: 'PC & Mobile Repair',
      icon: '💻',
      color: 'from-blue-500/20 to-blue-500/5',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      subServices: ['Mobile', 'Laptop/Computer', 'Printer / Scanner']
    },
    {
      name: 'Vehicle Mechanic',
      icon: '🔧',
      color: 'from-red-500/20 to-red-500/5',
      border: 'border-red-500/20',
      text: 'text-red-400',
      subServices: ['Car', 'Bike', 'Truck']
    },
    {
      name: 'Vehicle Wash',
      icon: '🚿',
      color: 'from-cyan-500/20 to-cyan-500/5',
      border: 'border-cyan-500/20',
      text: 'text-cyan-400',
      subServices: ['Car', 'Bike', 'Truck']
    },
    {
      name: 'Electrical Repair',
      icon: '⚡',
      color: 'from-yellow-500/20 to-yellow-500/5',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      subServices: ['Home', 'Commercial', 'Events']
    },
    {
      name: 'Appliance Repair',
      icon: '⚙️',
      color: 'from-orange-500/20 to-orange-500/5',
      border: 'border-orange-500/20',
      text: 'text-orange-400',
      subServices: ['Refrigerator', 'Air Conditioner', 'Washing Machine', 'Television', 'Fan', 'Mixer', 'Gas Stove', 'Water Purifier', 'Others']
    },
    {
      name: 'Beautician /Wellness',
      icon: '💆‍♀️',
      color: 'from-pink-500/20 to-pink-500/5',
      border: 'border-pink-500/20',
      text: 'text-pink-400',
      subServices: ['Male', 'Female', 'Kids', 'Others']
    },
    {
      name: 'Laundry',
      icon: '🧺',
      color: 'from-indigo-500/20 to-indigo-500/5',
      border: 'border-indigo-500/20',
      text: 'text-indigo-400',
      subServices: ['Home', 'Hospital', 'Hotel', 'Commercials']
    },
    {
      name: 'Hire a Person',
      icon: '👤',
      color: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      subServices: ['Male', 'Female', 'Others']
    },
    {
      name: 'Security/Bouncer',
      icon: '🛡️',
      color: 'from-slate-500/20 to-slate-500/5',
      border: 'border-slate-500/20',
      text: 'text-slate-400',
      subServices: ['Event Security', 'Bouncer / Door Security', 'Others']
    },
    {
      name: 'Other Services',
      icon: '➕',
      color: 'from-zinc-500/20 to-zinc-500/5',
      border: 'border-zinc-500/20',
      text: 'text-zinc-400',
      subServices: ['Painter', 'Event Organisers', 'Suppliers']
    },
  ];

  // Merge actual stats with master categories
  const matrixData = masterCategories.map(cat => {
    let catTotal = 0;
    let catPending = 0;
    
    const subs = cat.subServices.map(sub => {
      const relatedBookings = recentBookings?.filter(b => 
        (b.serviceCategory === cat.name && b.serviceTitle === sub) ||
        b.serviceTitle === sub
      ) || [];
      
      const subCount = relatedBookings.length;
      const subPending = relatedBookings.filter(b => b.status === 'PENDING').length;
      
      catTotal += subCount;
      catPending += subPending;
      
      return { name: sub, count: subCount, pending: subPending };
    }).sort((a, b) => b.count - a.count);

    return {
      ...cat,
      totalCount: catTotal,
      totalPending: catPending,
      subs
    };
  }).sort((a, b) => b.totalCount - a.totalCount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[#2A2A2A] bg-[#141414]">
            <Image
              src="/quick-services-icon.png"
              alt="Quick Services"
              width={64}
              height={64}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">
                Quick Services Portfolio Radar
              </h1>
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
            </div>
            <p className="mt-1 text-sm text-[#6B7280]">
              Deep analytics into category performance, service popularity, and live booking counts.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={() => window.location.reload()}
            className="border border-[#2A2A2A] bg-[#1F1F1F] text-white transition-all hover:bg-[#2A2A2A]"
          >
            <Activity className="mr-2 h-4 w-4 text-[#FFD700]" />
            Sync Radar
          </Button>
          <Button
            type="button"
            onClick={() => router.push('/quick-services/booking-management')}
            className="bg-[#FFD700] font-semibold text-black transition-all hover:bg-[#E6C200]"
          >
            <Wrench className="mr-2 h-4 w-4" />
            Manage Requests
          </Button>
        </div>
      </div>

      {/* Top Level KPIs */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-[#2A2A2A] bg-[#141414] p-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32 bg-[#1F1F1F]" />
                <Skeleton className="h-9 w-9 rounded-full bg-[#1F1F1F]" />
              </div>
              <Skeleton className="mt-3 h-10 w-16 bg-[#1F1F1F]" />
              <Skeleton className="mt-2 h-3 w-40 bg-[#1F1F1F]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Requests */}
          <div className="group rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 hover:border-emerald-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Total Service Requests
              </span>
              <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-400 group-hover:scale-110 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white">
              {totalRequests}
            </div>
            <p className="mt-1 text-xs text-[#9CA3AF] flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" /> Across all categories
            </p>
          </div>

          {/* Urgent Pending */}
          <div className="group rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 hover:border-amber-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Urgent Pending
              </span>
              <div className="rounded-full bg-amber-500/10 p-2 text-amber-400 group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white">
              {pendingCount}
            </div>
            <p className="mt-1 text-xs text-amber-400 font-medium">Awaiting supplier dispatch</p>
          </div>

          {/* Active In-Field */}
          <div className="group rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 hover:border-blue-500/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Active In-Field
              </span>
              <div className="rounded-full bg-blue-500/10 p-2 text-blue-400 group-hover:scale-110 transition-transform">
                <Wrench className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-white">
              {inProgressCount}
            </div>
            <p className="mt-1 text-xs text-blue-400 font-medium">Professionals currently working</p>
          </div>

          {/* Registered Suppliers */}
          <div className="group rounded-lg border border-[#2A2A2A] bg-[#141414] p-5 hover:border-[#FFD700]/40 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">
                Registered Suppliers
              </span>
              <div className="rounded-full bg-[#FFD700]/10 p-2 text-[#FFD700] group-hover:scale-110 transition-transform">
                <Briefcase className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-extrabold text-[#FFD700]">
              {suppliers.length}
            </div>
            <p className="mt-1 text-xs text-[#FFD700]/70 font-medium">Verified partner companies</p>
          </div>
        </div>
      )}

      {/* The Full Services Taxonomy Matrix */}
      <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] overflow-hidden">
        <div className="border-b border-[#2A2A2A] bg-[#1A1A1A] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#FFD700]/10 p-2 rounded-lg">
              <Layers className="h-5 w-5 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Full Services Taxonomy Matrix</h2>
              <p className="text-xs text-[#6B7280]">Breakdown of all {matrixData.reduce((acc, cat) => acc + cat.subs.length, 0)} child services across {matrixData.length} parent categories</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="relative p-5 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] flex flex-col">
                  <div className="flex justify-between items-start mb-4 border-b border-[#2A2A2A] pb-3">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg bg-[#2A2A2A]" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-24 bg-[#2A2A2A]" />
                        <Skeleton className="h-3 w-16 bg-[#2A2A2A]" />
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Skeleton className="h-8 w-12 bg-[#2A2A2A]" />
                      <Skeleton className="h-2 w-10 bg-[#2A2A2A]" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    {[...Array(4)].map((_, j) => (
                      <Skeleton key={j} className="h-8 w-full rounded bg-[#2A2A2A]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {matrixData.map((cat, idx) => (
                <div key={idx} className={`relative p-5 rounded-xl border bg-gradient-to-br ${cat.color} ${cat.border} flex flex-col`}>
                  {/* Category Header */}
                  <div className="flex justify-between items-start mb-4 border-b border-[#2A2A2A]/40 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl bg-black/20 p-2 rounded-lg">{cat.icon}</span>
                      <div>
                        <h3 className={`font-bold ${cat.text} text-lg`}>{cat.name}</h3>
                        <p className="text-xs text-white/60 font-medium">{cat.subs.length} Child Services</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white">{cat.totalCount}</p>
                      <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Bookings</p>
                    </div>
                  </div>

                  {/* Child Services Grid */}
                  <div className="grid grid-cols-2 gap-2 mt-auto">
                    {cat.subs.map((sub, sIdx) => (
                      <div key={sIdx} className="bg-black/30 rounded border border-white/5 p-2 flex justify-between items-center group">
                        <span className="text-xs font-medium text-white/80 group-hover:text-white truncate max-w-[100px] mr-2" title={sub.name}>
                          {sub.name}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {sub.pending > 0 && <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" title={`${sub.pending} pending`} />}
                          <span className={`text-xs font-bold ${sub.count > 0 ? 'text-white' : 'text-white/30'}`}>
                            {sub.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analytics & Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Popularity Leaderboard */}
        <div className="lg:col-span-2 rounded-xl border border-[#2A2A2A] bg-[#141414] flex flex-col">
          <div className="p-5 border-b border-[#2A2A2A]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Service Popularity Leaderboard
            </h2>
            <p className="text-xs text-[#6B7280]">Top performing categories generating the most volume</p>
          </div>
          
          <div className="p-5 flex-1 flex flex-col justify-center gap-4">
            {loading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <Skeleton className="h-6 w-6 rounded bg-[#1F1F1F]" />
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24 bg-[#1F1F1F]" />
                        <Skeleton className="h-4 w-12 bg-[#1F1F1F]" />
                      </div>
                      <Skeleton className="h-2.5 w-full rounded-full bg-[#1F1F1F]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : serviceStats.length === 0 ? (
              <div className="text-center text-[#6B7280] py-10">No booking data available yet.</div>
            ) : (
              serviceStats.slice(0, 5).map((stat, idx) => {
                const percentage = Math.round((stat.count / totalRequests) * 100) || 0;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-8 text-center text-xl font-bold text-[#4A4A4A]">#{idx + 1}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-white">{stat.name}</span>
                        <span className="text-[#FFD700] font-bold">{percentage}% <span className="text-[#6B7280] font-normal">({stat.count})</span></span>
                      </div>
                      <div className="h-2.5 w-full bg-[#1A1A1A] rounded-full overflow-hidden border border-[#2A2A2A]">
                        <div 
                          className="h-full bg-gradient-to-r from-[#FFD700] to-[#F59E0B] rounded-full transition-all duration-1000" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Needs Attention */}
        <div className="rounded-xl border border-[#2A2A2A] bg-[#141414] flex flex-col">
          <div className="p-5 border-b border-[#2A2A2A]">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" /> Action Required
            </h2>
            <p className="text-xs text-[#6B7280]">Recent unassigned requests</p>
          </div>
          
          <div className="p-0 overflow-y-auto max-h-[300px]">
            {loading ? (
              <div className="divide-y divide-[#2A2A2A]">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 bg-[#1F1F1F]" />
                      <Skeleton className="h-3 w-20 bg-[#1F1F1F]" />
                    </div>
                    <Skeleton className="h-7 w-16 rounded bg-[#1F1F1F]" />
                  </div>
                ))}
              </div>
            ) : (() => {
              const pendingBookings = recentBookings?.filter(b => b.status === 'PENDING') || [];
              if (pendingBookings.length === 0) {
                return (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    </div>
                    <p className="text-white font-medium">All caught up!</p>
                    <p className="text-xs text-[#6B7280] mt-1">No pending services awaiting assignment.</p>
                  </div>
                );
              }
              
              return pendingBookings.slice(0, 5).map((booking: any, i: number) => (
                <div key={i} className="p-4 border-b border-[#2A2A2A] hover:bg-[#1A1A1A] transition-colors flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{booking.serviceTitle || booking.serviceCategory}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{booking.userName}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="h-7 text-[10px] bg-amber-500 hover:bg-amber-600 text-black px-3"
                    onClick={() => router.push(`/quick-services/booking-management/${booking._id || booking.id}`)}
                  >
                    Assign
                  </Button>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}