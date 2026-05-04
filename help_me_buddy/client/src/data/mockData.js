export const categories = [
  { id: 1, name: "Electrician", icon: "⚡", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80" },
  { id: 2, name: "Plumber", icon: "🔧", image: "https://images.unsplash.com/photo-1607472586893-edb57cbaca13?w=500&q=80" },
  { id: 3, name: "Tutor", icon: "📚", image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&q=80" },
  { id: 4, name: "Cleaner", icon: "🧹", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80" },
  { id: 5, name: "Mechanic", icon: "🚗", image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80" },
  { id: 6, name: "Freelancer", icon: "💻", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80" },
  { id: 7, name: "Painter", icon: "🎨", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80" },
  { id: 8, name: "Carpenter", icon: "🪚", image: "https://images.unsplash.com/photo-1540104539504-6b2c286afc94?w=500&q=80" },
  { id: 9, name: "AC Repair", icon: "❄️", image: "https://images.unsplash.com/photo-1621252178351-a9fbb1c7a950?w=500&q=80" },
  { id: 10, name: "Gardener", icon: "🌱", image: "https://images.unsplash.com/photo-1416879590632-47525db32573?w=500&q=80" },
  { id: 11, name: "Pest Control", icon: "🐛", image: "https://images.unsplash.com/photo-1586521995568-39abaa0c2311?w=500&q=80" },
  { id: 12, name: "Beautician", icon: "💅", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80" },
  { id: 13, name: "Driver", icon: "🚕", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80" },
  { id: 14, name: "Chef", icon: "🍳", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80" },
];

export const providers = [
  {
    id: 1,
    name: "Ramesh Electrician",
    category: "Electrician",
    rating: 4.8,
    reviews: 124,
    price: 200,
    about: "Expert in home electrical wiring, appliance fixing, and emergency repairs with 10 years of experience.",
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 350,
    location: "Bahadurpura, Hyderabad, Telangana, India"
  },
  {
    id: 2,
    name: "Suresh Plumber",
    category: "Plumber",
    rating: 4.5,
    reviews: 89,
    price: 150,
    about: "Quick and reliable plumbing services. Specializing in leakages, pipe fitting, and bathroom remodeling.",
    profileImage: "https://images.unsplash.com/photo-1537511446984-935f663eb1f4?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 120,
    location: "Westside, 5km away"
  },
  {
    id: 3,
    name: "Anita Tutor",
    category: "Tutor",
    rating: 4.9,
    reviews: 210,
    price: 300,
    about: "Passionate math and science tutor for high school students. Guaranteed grade improvements.",
    profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80",
    portfolio: [],
    availability: false,
    jobsCompleted: 850,
    location: "Online / Northside, 8km away"
  },
  {
    id: 4,
    name: "Rahul Cleaner",
    category: "Cleaner",
    rating: 4.7,
    reviews: 156,
    price: 120,
    about: "Eco-friendly home and office deep cleaning services. I bring my own supplies and leave your place spotless.",
    profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 420,
    location: "City Center, 3km away"
  },
  {
    id: 5,
    name: "Amit Mechanic",
    category: "Mechanic",
    rating: 4.6,
    reviews: 92,
    price: 250,
    about: "Your trusted neighborhood mobile mechanic. I come to you for oil changes, brake pads, and diagnostics.",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 210,
    location: "Southside, 7km away"
  },
  {
    id: 6,
    name: "Vikram Painter",
    category: "Painter",
    rating: 4.8,
    reviews: 64,
    price: 400,
    about: "Professional interior and exterior painting services. Attention to detail and flawless clean cuts.",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 115,
    location: "Eastside, 4km away"
  },
  {
    id: 7,
    name: "Sunil AC Repair",
    category: "AC Repair",
    rating: 4.4,
    reviews: 130,
    price: 350,
    about: "Beat the heat! AC installation, gas refilling, and deep servicing for all major brands.",
    profileImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1621252178351-a9fbb1c7a950?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 290,
    location: "Downtown, 1km away"
  },
  {
    id: 8,
    name: "Priya Beautician",
    category: "Beautician",
    rating: 4.9,
    reviews: 320,
    price: 500,
    about: "Salon-at-home services. Specializing in bridal makeup, facials, and hair treatments.",
    profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80"
    ],
    availability: false,
    jobsCompleted: 940,
    location: "Westside, 6km away"
  },
  {
    id: 9,
    name: "Ali Carpenter",
    category: "Carpenter",
    rating: 4.7,
    reviews: 45,
    price: 300,
    about: "Custom furniture, door repairs, and modular kitchen installations.",
    profileImage: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1540104539504-6b2c286afc94?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 60,
    location: "Northside, 9km away"
  },
  {
    id: 10,
    name: "Manoj Gardener",
    category: "Gardener",
    rating: 4.6,
    reviews: 78,
    price: 200,
    about: "Lawn moving, planting, and terrace garden maintenance. I bring all my own organic fertilizers.",
    profileImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1416879590632-47525db32573?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 154,
    location: "Botanical Area, 3km away"
  },
  {
    id: 11,
    name: "Ravi Pest Control",
    category: "Pest Control",
    rating: 4.8,
    reviews: 215,
    price: 600,
    about: "Complete home sanitization and termite/cockroach control. Safe for kids and pets.",
    profileImage: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1586521995568-39abaa0c2311?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 650,
    location: "Industrial Park, 12km away"
  },
  {
    id: 12,
    name: "Pooja Chef",
    category: "Chef",
    rating: 4.9,
    reviews: 410,
    price: 800,
    about: "Personal chef for home parties and meal prep. Specializing in healthy continental and Indian cuisines.",
    profileImage: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=500&q=80"
    ],
    availability: false,
    jobsCompleted: 1205,
    location: "Uptown, 4km away"
  },
  {
    id: 13,
    name: "Anil Driver",
    category: "Driver",
    rating: 4.5,
    reviews: 132,
    price: 450,
    about: "Professional chauffeur for outstation trips and daily commutes. 15 years accident-free driving.",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 430,
    location: "Airport Road, 8km away"
  },
  {
    id: 14,
    name: "Karan Electrician",
    category: "Electrician",
    rating: 4.2,
    reviews: 54,
    price: 180,
    about: "Fast and affordable basic level repairs like changing fuses, lightings, and inverter setups.",
    profileImage: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 95,
    location: "Metro Block, 2km away"
  },
  {
    id: 15,
    name: "Neha Beautician",
    category: "Beautician",
    rating: 4.8,
    reviews: 180,
    price: 400,
    about: "Certified cosmetologist offering waxing, threading, and pedicure with premium products.",
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 340,
    location: "River District, 6km away"
  },
  {
    id: 16,
    name: "Brijesh Plumber",
    category: "Plumber",
    rating: 4.3,
    reviews: 110,
    price: 180,
    about: "Specialized in unblocking drainage and installing heavy geysers.",
    profileImage: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1607472586893-edb57cbaca13?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 150,
    location: "Downtown, 2km away"
  },
  {
    id: 17,
    name: "Tina Freelancer",
    category: "Freelancer",
    rating: 4.9,
    reviews: 80,
    price: 1000,
    about: "Full stack web developer and Graphic Designer ready to build your business presence.",
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
    portfolio: [
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&q=80"
    ],
    availability: true,
    jobsCompleted: 45,
    location: "Remote / Online"
  }
];

export const users = [
  {
    id: 101,
    name: "John Doe",
    email: "john@example.com",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    phone: "+1 234 567 890",
    address: "123 Main Street, City Center"
  }
];

export const bookings = [
  {
    id: 1001,
    userId: 101,
    providerId: 1,
    status: "Upcoming", // Upcoming, Completed, Cancelled
    date: "2026-04-10",
    time: "10:00 AM",
    description: "Ceiling fan installation in the living room."
  }
];