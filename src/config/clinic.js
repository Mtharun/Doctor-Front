// Single source of truth for clinic details used across the public site
// (Home, Contact, Footer, Emergency banners, etc). Edit this file to
// rebrand the clinic without hunting through every page.
export const CLINIC = {
  name: "DentalCare",
  tagline: "Your Smile, Our Priority",
  phone: "+1 (555) 123-4567",
  emergencyPhone: "+1 (555) 911-DENT",
  email: "care@dentalcare.com",
  address: "123 Medical Plaza, Health City, HC 10001",
  hours: [
    { day: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { day: "Saturday", time: "9:00 AM – 2:00 PM" },
    { day: "Sunday", time: "Closed (emergencies only)" },
  ],
  social: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
  },
  mapEmbedQuery: "123 Medical Plaza, Health City",
};
