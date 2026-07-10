// a node js application that serves static files from the public directory and has a health check endpoint
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigin = process.env.CORS_ORIGIN || origin || '*';

  res.header('Access-Control-Allow-Origin', allowedOrigin);
  res.header('Vary', 'Origin');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// here i want to define the data in a json format for categories and products
const CATEGORIES = [
  { id: "all", label: "All Equipment" },
  { id: "lifting", label: "Lifting Machinery" },
  { id: "concrete", label: "Concrete Equipment" },
  { id: "mining", label: "Mining Machinery" },
  { id: "transport", label: "Heavy Transport" },
  { id: "drilling", label: "Drilling" },
  { id: "ev", label: "Electric Vehicles" },
  { id: "steel", label: "Steel Structure" },
];

const PRODUCTS = [
  {
    id: "p1",
    name: "Truck Crane",
    sku: "LFT-TC-001",
    category: "lifting",
    description:
      "Road-mobile hydraulic truck crane with telescopic boom. Available in 25T–500T capacity. XCMG, Liebherr, Tadano and other leading brands sourced to spec.",
    priceNote: "Price on request",
    unit: "unit",
    image: "/media/team/lifting.JPG",
    inStock: true,
    brand: "Any Brand",
  },
  {
    id: "p2",
    name: "Crawler Crane",
    sku: "LFT-CC-002",
    category: "lifting",
    description:
      "Heavy-lift crawler crane on tracked undercarriage for soft terrain and large jobsites. Capacities from 50T to 3,200T. Manitowoc, Liebherr, SANY available.",
    priceNote: "Price on request",
    unit: "unit",
    image: "/media/team/crowler.JPG",
    inStock: true,
    brand: "Any Brand",
  },
  {
    id: "p3",
    name: "Truck Mounted Crane",
    sku: "LFT-TMC-003",
    category: "lifting",
    description:
      "Knuckle-boom or straight-boom crane permanently mounted to truck chassis. Ideal for self-loading transport operations. 3T–25T lift capacity.",
    priceNote: "Price on request",
    unit: "unit",
    image: "/media/team/truckmouted.webp",
    inStock: true,
    brand: "Any Brand",
  },
  {
    id: "p4",
    name: "Concrete Mixing Plant",
    sku: "CON-CMP-004",
    category: "concrete",
    description:
      "Stationary or mobile concrete batching plant. Output capacity 25–240 m³/hr. Twin-shaft or drum mixer options. CAMC, SANY, Schwing brands available.",
    priceNote: "Price on request",
    unit: "plant",
    image: "/media/team/ConcreteMixingPlant.JPG",
    inStock: true,
    brand: "Any Brand",
  },
  {
    id: "p5",
    name: "Concrete Pump & Machinery",
    sku: "CON-CPM-005",
    category: "concrete",
    description:
      "Truck-mounted boom pumps and stationary line pumps for high-rise and infrastructure projects. Max pressure 200 bar, output up to 200 m³/hr.",
    priceNote: "Price on request",
    unit: "unit",
    image: "/media/team/concritpumping.avif",
    inStock: true,
    brand: "Any Brand",
  },
  {
    id: "p6",
    name: "Drilling Machine / Rig",
    sku: "DRL-RIG-006",
    category: "drilling",
    description:
      "Hydraulic rotary drilling rigs for piling, foundation, and geotechnical work. SANY SR, XCMG XR series. Max depth 90 m, max diameter 3,000 mm.",
    priceNote: "Price on request",
    unit: "unit",
    image: "/media/team/driling.webp",
    inStock: true,
    brand: "Any Brand",
  },
  {
    id: "p7",
    name: "Dump Truck",
    sku: "TRN-DT-007",
    category: "transport",
    description:
      "Heavy-duty rigid frame and articulated dump trucks for mining and construction. 25T–100T payload. Caterpillar, Komatsu, XCMG, HOWO available.",
    priceNote: "Price on request",
    unit: "unit",
    image: "/media/team/dumptruck.jpg",
    inStock: true,
    brand: "Any Brand",
  },
  {
    id: "p8",
    name: "Jaw Crusher",
    sku: "MIN-JC-008",
    category: "mining",
    description:
      "Primary jaw crusher for hard rock and ore crushing. Feed size up to 1,200 mm, output 50–1,500 TPH. Fixed or portable plant configurations.",
    priceNote: "Price on request",
    unit: "unit",
    image: "/media/team/crusher.JPG",
    inStock: true,
    brand: "Any Brand",
  },
  {
    id: "p9",
    name: "Vibrating Feeder",
    sku: "MIN-VF-009",
    category: "mining",
    description:
      "Electromechanical vibrating feeder for uniform material feed into crushers and screens. Capacity 80–1,000 TPH. Available in various trough widths.",
    priceNote: "Price on request",
    unit: "unit",
    image: "/media/team/vibrationfeeder.jpg",
    inStock: true,
    brand: "Any Brand",
  },
  {
    id: "p10",
    name: "Mobile Crushing Plant",
    sku: "MIN-MCP-010",
    category: "mining",
    description:
      "Track-mounted or wheel-mounted crushing and screening plant. Jaw + cone + screen combination. Rapid deployment, 200–600 TPH output.",
    priceNote: "Price on request",
    unit: "plant",
    image: "/media/team/mobilecrusher.webp",
    inStock: true,
    brand: "Any Brand",
  },
    {
    id: "p11",
      name: "Chinese Electric Vehicle (Export)",
      sku: "CN-EV-011",
      category: "ev",
      description:
        "Electric vehicle produced in China for export markets. Suitable for fleet sales and international distributors; available in multiple configurations with left- or right-hand drive options, compliant with export regulations and adaptable to local standards.",
      priceNote: "Price on request",
      unit: "vehicle",
      image: "/media/team/BYD1.JPG",
      inStock: true,
      brand: "Various Chinese Manufacturers",
  },
      {
    id: "p12",
      name: "Chinese Electric Vehicle (Compact/City)",
      sku: "CN-EV-012",
      category: "ev",
      description:
        "Compact electric vehicle designed for urban and export markets. Emphasizes efficiency, low operating cost, and ease of maintenance. Offered by multiple Chinese suppliers targeting international distributors and resellers.",
      priceNote: "Price on request",
      unit: "vehicle",
      image: "/media/team/IMG_1529.JPG",
      inStock: true,
      brand: "Various Chinese Manufacturers",
  },
  {
    id: "p13",
      name: "Steel Structure Components",
      sku: "STL-SC-013",
      category: "steel",
      description:
        "Prefabricated steel structure components for industrial and commercial construction. Includes beams, columns, trusses, and panels. Customizable to project specifications.",
      priceNote: "Price on request",
      unit: "set",
      image: "/media/team/IMG_1525.JPG",
      inStock: true,
      brand: "Various Manufacturers",
  }
];

const TEAM_MEDIA = [
  {
    id: "team-1",
    title: "Factory inspection visit",
    category: "Team",
    duration: "4:32",
    thumbnail: "/media/team/thumbnail1.JPG",
    description: "Our technical team inspects machinery and documentation before every shipment.",
    mediaType: "video",
    mediaUrl: "/media/team/visit.mp4",
  },
  {
    id: "team-3",
    title: "On-site commissioning in East Africa",
    category: "Project Team",
    duration: "3:18",
    thumbnail: "/media/team/team1.JPG",
    description: "Engineers and project supervisors coordinate installation and commissioning on site.",
    mediaType: "image",
    mediaUrl: "/media/team/team1.JPG",
  },
  {
    id: "team-4",
    title: "On-site commissioning in East Africa",
    category: "Project Team",
    duration: "3:18",
    thumbnail: "/media/team/team2.JPG",
    description: "Engineers and project supervisors coordinate installation and commissioning on site.",
    mediaType: "image",
    mediaUrl: "/media/team/team2.JPG",
  },
  {
    id: "team-5",
    title: "On-site commissioning in East Africa",
    category: "Project Team",
    duration: "3:18",
    thumbnail: "/media/team/team3.JPG",
    description: "Engineers and project supervisors coordinate installation and commissioning on site.",
    mediaType: "image",
    mediaUrl: "/media/team/team3.JPG",
  },
    {
    id: "team-6",
    title: "On-site commissioning in East Africa",
    category: "Project Team",
    duration: "3:18",
    thumbnail: "/media/team/team4.jpg",
    description: "Engineers and project supervisors coordinate installation and commissioning on site.",
    mediaType: "image",
    mediaUrl: "/media/team/team4.jpg",
  }
];

// Serve static files from the dist directory in the main build

app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use('/media', express.static(path.join(__dirname, 'public', 'media')));
// serve build in dist folder at / path
//its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));

});
// I want to use mongodb to store cateogry and product
// API endpoint to get categories and products from MongoDB

// API endpoint to get categories
app.get('/api/categories', (req, res) => {
  // Fetch categories from MongoDB and send as JSON response
  res.json(CATEGORIES);
});

// API endpoint to get products
app.get('/api/products', (req, res) => {
  res.json(PRODUCTS);
});

// API endpoint to get team media items
app.get('/api/team-media', (req, res) => {
  res.json(TEAM_MEDIA);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});