export interface QuickServiceCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  childServices: string[];
}

export const QUICK_SERVICE_CATEGORIES: QuickServiceCategory[] = [
  {
    id: 'HOME_SERVICE',
    slug: 'home-service',
    name: 'Home Service',
    icon: '/home-service-icon.png',
    childServices: [
      'Home Cleaning',
      'Pest Control',
      'Gardening',
      'Plumbing',
      'Carpenter',
      'Painter',
    ],
  },
  {
    id: 'PC_MOBILE_REPAIR',
    slug: 'pc-mobile-repair',
    name: 'PC / Mobile Repair',
    icon: '/pc-mobile-repair-icon.png',
    childServices: [
      'Mobile',
      'Laptop/Computer',
      'Printer',
      'Scanner',
    ],
  },
  {
    id: 'PLUMBING_CARPENTRY',
    slug: 'plumbing-carpentry',
    name: 'Plumbing / Carpentry',
    icon: '/plumbing-carpentry-icon.png',
    childServices: [
      'Plumbing',
      'Carpentry',
    ],
  },
  {
    id: 'VEHICLE_MECHANIC',
    slug: 'vehicle-mechanic',
    name: 'Vehicle Mechanic',
    icon: '/vehicle-mechanic-icon.png',
    childServices: [
      'Car',
      'Bike',
      'Truck',
    ],
  },
  {
    id: 'VEHICLE_WASH',
    slug: 'vehicle-wash',
    name: 'Vehicle Wash',
    icon: '/vehicle-wash-icon.png',
    childServices: [
      'Car',
      'Bike',
      'Truck',
    ],
  },
  {
    id: 'ELECTRICAL_MECHANIC',
    slug: 'electrical-mechanic',
    name: 'Electrical Mechanic',
    icon: '/electrical-mechanic-icon.png',
    childServices: [
      'Home',
      'Lift',
    ],
  },
  {
    id: 'APPLIANCE_REPAIR',
    slug: 'appliance-repair',
    name: 'Appliance Repair',
    icon: '/appliance-repair-icon.png',
    childServices: [],
  },
  {
    id: 'BEAUTY_WELLNESS',
    slug: 'beauty-wellness',
    name: 'Beauty / Wellness',
    icon: '/beauty-wellness-icon.png',
    childServices: [],
  },
  {
    id: 'HIRE_A_PERSON',
    slug: 'hire-a-person',
    name: 'Hire a Person',
    icon: '/hire-a-person-icon.png',
    childServices: [],
  },
  {
    id: 'LAUNDRY_WORKER',
    slug: 'laundry-worker',
    name: 'Laundry Worker',
    icon: '/laundry-worker-icon.png',
    childServices: [
      'Home',
      'Hospital',
      'Hotel',
      'Commercial',
    ],
  },
  {
    id: 'SECURITY_BOUNCER',
    slug: 'security-bouncer',
    name: 'Security / Bouncer',
    icon: '/security-bouncer-icon.png',
    childServices: [],
  },
  {
    id: 'OTHER_SERVICES',
    slug: 'other-services',
    name: 'Other Services',
    icon: '/other-services-icon.png',
    childServices: [
      'Event Organizer',
      'Suppliers',
    ],
  },
];

export function getQuickServiceBySlug(
  slug: string,
): QuickServiceCategory | undefined {
  return QUICK_SERVICE_CATEGORIES.find(
    (category) => category.slug === slug,
  );
}

export function getQuickServiceName(
  categoryId: string,
): string {
  return (
    QUICK_SERVICE_CATEGORIES.find(
      (category) => category.id === categoryId,
    )?.name ?? categoryId
  );
}

/**
 * Helper to determine what catalog category and child service ID a booking requires.
 */
export function getServiceRequirement(booking: { serviceCategory?: string; serviceTitle?: string }) {
  const cat = (booking.serviceCategory || '').toLowerCase().trim();
  const title = (booking.serviceTitle || '').toLowerCase().trim();

  // 1. Painter special case: in user app, Painter is categorized under 'Home Services' or 'Other Services',
  // and in Supplier catalog it is under OTHER_SERVICES -> PAINTER.
  if (title.includes('painter') || title.includes('painting')) {
    return { possibleCategories: ['OTHER_SERVICES', 'HOME_SERVICE'], childId: 'PAINTER' };
  }

  // 2. Event Organisers / Suppliers under Other Services
  if (title.includes('event organ') || title.includes('event_organ')) {
    return { possibleCategories: ['OTHER_SERVICES'], childId: 'EVENT_ORGANISERS' };
  }
  if (title.includes('supplier')) {
    return { possibleCategories: ['OTHER_SERVICES'], childId: 'SUPPLIERS' };
  }

  // 3. Home Services
  if (cat.includes('home service') || cat === 'home_service') {
    if (title.includes('cleaning')) return { possibleCategories: ['HOME_SERVICE'], childId: 'HOME_CLEANING' };
    if (title.includes('pest')) return { possibleCategories: ['HOME_SERVICE'], childId: 'PEST_CONTROL' };
    if (title.includes('garden')) return { possibleCategories: ['HOME_SERVICE'], childId: 'GARDENING' };
    if (title.includes('plumb')) return { possibleCategories: ['HOME_SERVICE', 'PLUMBING_CARPENTRY'], childId: 'PLUMBING' };
    if (title.includes('carpent')) return { possibleCategories: ['HOME_SERVICE', 'PLUMBING_CARPENTRY'], childId: 'CARPENTER' };
    return { possibleCategories: ['HOME_SERVICE'], childId: null };
  }

  // 4. Plumbing / Carpentry
  if (cat.includes('plumbing') || cat.includes('carpent')) {
    if (title.includes('plumb')) return { possibleCategories: ['HOME_SERVICE', 'PLUMBING_CARPENTRY'], childId: 'PLUMBING' };
    if (title.includes('carpent')) return { possibleCategories: ['HOME_SERVICE', 'PLUMBING_CARPENTRY'], childId: 'CARPENTER' };
    return { possibleCategories: ['HOME_SERVICE', 'PLUMBING_CARPENTRY'], childId: null };
  }

  // 5. PC & Mobile Repair
  if (cat.includes('pc') || cat.includes('mobile repair') || cat.includes('pc_mobile')) {
    if (title.includes('mobile')) return { possibleCategories: ['PC_MOBILE_REPAIR'], childId: 'MOBILE' };
    if (title.includes('laptop') || title.includes('computer')) return { possibleCategories: ['PC_MOBILE_REPAIR'], childId: 'LAPTOP_COMPUTER' };
    if (title.includes('printer') || title.includes('scanner')) return { possibleCategories: ['PC_MOBILE_REPAIR'], childId: 'PRINTER_SCANNER' };
    return { possibleCategories: ['PC_MOBILE_REPAIR'], childId: null };
  }

  // 6. Vehicle Mechanic
  if (cat.includes('vehicle mechanic') || cat.includes('mechanic')) {
    if (title.includes('bike') || title.includes('motorcycle')) return { possibleCategories: ['VEHICLE_MECHANIC'], childId: 'BIKE_MECHANIC' };
    if (title.includes('car') || title.includes('auto')) return { possibleCategories: ['VEHICLE_MECHANIC'], childId: 'CAR_MECHANIC' };
    if (title.includes('truck') || title.includes('heavy')) return { possibleCategories: ['VEHICLE_MECHANIC'], childId: 'TRUCK_MECHANIC' };
    return { possibleCategories: ['VEHICLE_MECHANIC'], childId: null };
  }

  // 7. Vehicle Wash
  if (cat.includes('vehicle wash') || cat.includes('wash')) {
    if (title.includes('bike') || title.includes('motorcycle')) return { possibleCategories: ['VEHICLE_WASH'], childId: 'BIKE_WASH' };
    if (title.includes('car') || title.includes('auto')) return { possibleCategories: ['VEHICLE_WASH'], childId: 'CAR_WASH' };
    if (title.includes('truck') || title.includes('heavy')) return { possibleCategories: ['VEHICLE_WASH'], childId: 'TRUCK_WASH' };
    return { possibleCategories: ['VEHICLE_WASH'], childId: null };
  }

  // 8. Electrical Repair / Mechanic
  if (cat.includes('electric') || cat.includes('electrical')) {
    if (title.includes('commercial') || title.includes('lift') || title.includes('elevator')) {
      return { possibleCategories: ['ELECTRICAL_REPAIR', 'ELECTRICAL_MECHANIC'], childId: 'COMMERCIAL_ELECTRICIAN' };
    }
    if (title.includes('event')) {
      return { possibleCategories: ['ELECTRICAL_REPAIR', 'ELECTRICAL_MECHANIC'], childId: 'EVENTS_ELECTRICIAN' };
    }
    if (title.includes('home')) {
      return { possibleCategories: ['ELECTRICAL_REPAIR', 'ELECTRICAL_MECHANIC'], childId: 'HOME_ELECTRICIAN' };
    }
    return { possibleCategories: ['ELECTRICAL_REPAIR', 'ELECTRICAL_MECHANIC'], childId: null };
  }

  // 9. Appliance Repair
  if (cat.includes('appliance')) {
    return { possibleCategories: ['APPLIANCE_REPAIR'], childId: null };
  }

  // 10. Beautician / Wellness
  if (cat.includes('beaut') || cat.includes('wellness')) {
    if (title.includes('male') && !title.includes('female')) return { possibleCategories: ['BEAUTICIAN_WELLNESS', 'BEAUTY_WELLNESS'], childId: 'MALE' };
    if (title.includes('female')) return { possibleCategories: ['BEAUTICIAN_WELLNESS', 'BEAUTY_WELLNESS'], childId: 'FEMALE' };
    if (title.includes('kid')) return { possibleCategories: ['BEAUTICIAN_WELLNESS', 'BEAUTY_WELLNESS'], childId: 'KIDS' };
    if (title.includes('other')) return { possibleCategories: ['BEAUTICIAN_WELLNESS', 'BEAUTY_WELLNESS'], childId: 'OTHERS_WELLNESS' };
    return { possibleCategories: ['BEAUTICIAN_WELLNESS', 'BEAUTY_WELLNESS'], childId: null };
  }

  // 11. Laundry
  if (cat.includes('laundry')) {
    if (title.includes('commercial')) return { possibleCategories: ['LAUNDRY', 'LAUNDRY_WORKER'], childId: 'COMMERCIALS_LAUNDRY' };
    if (title.includes('hotel')) return { possibleCategories: ['LAUNDRY', 'LAUNDRY_WORKER'], childId: 'HOTEL_LAUNDRY' };
    if (title.includes('hospital')) return { possibleCategories: ['LAUNDRY', 'LAUNDRY_WORKER'], childId: 'HOSPITAL_LAUNDRY' };
    if (title.includes('home') || title.includes('iron') || title.includes('laundry')) return { possibleCategories: ['LAUNDRY', 'LAUNDRY_WORKER'], childId: 'HOME_LAUNDRY' };
    return { possibleCategories: ['LAUNDRY', 'LAUNDRY_WORKER'], childId: null };
  }

  // 12. Hire a Person
  if (cat.includes('hire')) {
    return { possibleCategories: ['HIRE_A_PERSON'], childId: null };
  }

  // 13. Security / Bouncer
  if (cat.includes('security') || cat.includes('bouncer')) {
    return { possibleCategories: ['SECURITY_BOUNCER'], childId: null };
  }

  const normalizedCategory = cat.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  return { possibleCategories: [normalizedCategory], childId: null };
}

/**
 * Filters the active suppliers to only include those offering the service booked.
 */
export function filterSuppliersForQuickService(
  suppliers: any[],
  booking: { serviceCategory?: string; serviceTitle?: string }
): any[] {
  if (!Array.isArray(suppliers) || suppliers.length === 0) return [];

  const { possibleCategories, childId } = getServiceRequirement(booking);

  return suppliers.filter((supplier) => {
    // Supplier must be registered for QUICK_SERVICES
    if (supplier.registeredService && supplier.registeredService !== 'QUICK_SERVICES') {
      return false;
    }

    let offered = supplier.quickServicesOffered;
    if (typeof offered === 'string') {
      try {
        offered = JSON.parse(offered);
      } catch {
        return false;
      }
    }

    if (!Array.isArray(offered) || offered.length === 0) {
      return false;
    }

    for (const item of offered) {
      const itemCat = String(item.category || '').toUpperCase().trim();
      const catMatch = possibleCategories.some(
        (pc) => pc === itemCat || itemCat.includes(pc) || pc.includes(itemCat)
      );

      if (catMatch) {
        if (!childId) {
          return true;
        }

        const services = Array.isArray(item.services) ? item.services : [];
        const noChildrenCats = ['APPLIANCE_REPAIR', 'HIRE_A_PERSON', 'SECURITY_BOUNCER'];
        if (services.length === 0 && noChildrenCats.includes(itemCat)) {
          return true;
        }

        const childUpper = childId.toUpperCase();
        const hasChild = services.some((s: string) => {
          const sUpper = String(s).toUpperCase().trim();
          return (
            sUpper === childUpper ||
            sUpper.replace(/_/g, '') === childUpper.replace(/_/g, '') ||
            sUpper.includes(childUpper) ||
            childUpper.includes(sUpper)
          );
        });

        if (hasChild) {
          return true;
        }
      }
    }

    return false;
  });
}