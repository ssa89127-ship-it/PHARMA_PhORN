export interface Pharmacy {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  coverImage: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  latitude: number;
  longitude: number;
  lat: number;
  lng: number;
  distance?: number;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  isVerified: boolean;
  is24hours: boolean;
  offersDelivery: boolean;
  freeDelivery: boolean;
  deliveryFee: number;
  deliveryTime: string;
  minimumOrder: number;
  workingHours: WorkingHours;
  availableMedicines: Medicine[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  slug: string;
  genericName: string;
  description: string;
  image: string;
  manufacturer: string;
  category: string;
  dosage: string;
  form: MedicineForm;
  strength: string;
  prescriptionRequired: boolean;
  unitPrice: number;
  basePrice: number;
  discountedPrice?: number;
  discount?: number;
  stockQuantity: number;
  isAvailable: boolean;
  requiresPrescription: boolean;
  sideEffects: string[];
  alternatives: string[];
  createdAt: string;
  updatedAt: string;
}

export type MedicineForm = "tablet" | "capsule" | "syrup" | "cream" | "injection" | "drops" | "inhaler" | "spray" | "patch" | "ointment";

export interface MedicinePrice {
  pharmacyId: string;
  pharmacyName: string;
  pharmacyLogo: string;
  pharmacyRating: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  deliveryFee: number;
  deliveryTime: string;
  isAvailable: boolean;
  stockQuantity: number;
  distance?: number;
}

export interface Doctor {
  id: string;
  name: string;
  slug: string;
  photo: string;
  specialty: string;
  experience: number;
  education: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  consultationFee: number;
  isAvailableToday: boolean;
  availableForVideo: boolean;
  availableForChat: boolean;
  availableForInPerson: boolean;
  bio: string;
  qualifications: string[];
  awards: string[];
  availableSlots: TimeSlot[];
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  type: "video" | "chat" | "in-person";
}

export interface Order {
  id: string;
  userId: string;
  pharmacyId: string;
  pharmacyName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  deliveryAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  estimatedDelivery: string;
  deliveredAt?: string;
  tracking: TrackingUpdate[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  medicineId: string;
  medicineName: string;
  medicineImage: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  prescriptionRequired: boolean;
  prescriptionUrl?: string;
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "picked-up" | "in-transit" | "delivered" | "cancelled" | "returned";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface TrackingUpdate {
  status: string;
  location?: string;
  timestamp: string;
  description: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorPhoto: string;
  doctorSpecialty: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "video" | "chat" | "in-person";
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  fee: number;
  paymentStatus: PaymentStatus;
  meetLink?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentStatus = "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  medicineCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  role: UserRole;
  dateOfBirth?: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "patient" | "doctor" | "pharmacy" | "admin";

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  role: string;
  rating: number;
  content: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrder: number;
  maxUses: number;
  currentUses: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "appointment" | "promotion" | "reminder" | "system";
  isRead: boolean;
  createdAt: string;
}

export interface CartItem {
  medicineId: string;
  medicineName: string;
  medicineImage: string;
  dosage: string;
  pharmacyId: string;
  pharmacyName: string;
  unitPrice: number;
  quantity: number;
  prescriptionRequired: boolean;
  prescriptionUrl?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalDoctors: number;
  totalMedicines: number;
  totalPharmacies: number;
  totalAppointments: number;
  pendingOrders: number;
  monthlyRevenue: number[];
  monthlyOrders: number[];
  popularMedicines: { name: string; count: number }[];
  revenueByPharmacy: { name: string; revenue: number }[];
}

export interface LoyaltyPoints {
  total: number;
  earned: number;
  redeemed: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
  pointsUntilNextTier: number;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  coverageType: string;
  expiryDate: string;
}

export interface MedicalRecord {
  id: string;
  userId: string;
  title: string;
  description: string;
  fileUrl?: string;
  type: "prescription" | "lab-report" | "diagnosis" | "imaging" | "other";
  date: string;
  doctorName?: string;
  hospitalName?: string;
}
