// a node js application that serves static files from the public directory and has a health check endpoint
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
// here i want to define the data in a json format for categories and products
const CATEGORIES = [
  { id: "all", label: "All Equipment" },
  { id: "lifting", label: "Lifting Machinery" },
  { id: "concrete", label: "Concrete Equipment" },
  { id: "mining", label: "Mining Machinery" },
  { id: "transport", label: "Heavy Transport" },
  { id: "drilling", label: "Drilling" },
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
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfa?w=600&h=400&fit=crop&auto=format",
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
    image:
      "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=600&h=400&fit=crop&auto=format",
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
    image:
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop&auto=format",
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
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfc?w=600&h=400&fit=crop&auto=format",
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
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop&auto=format",
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
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop&auto=format",
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
    image:
      "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=600&h=400&fit=crop&auto=format",
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
    image:
      "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=600&h=400&fit=crop&auto=format",
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
    image:
      "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=600&h=400&fit=crop&auto=format",
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
    image:
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=600&h=400&fit=crop&auto=format",
    inStock: true,
    brand: "Any Brand",
  },
];
// Serve static files from the dist directory in the main build
console.log('Serving static files from:', path.join(__dirname, '..', 'dist'));

app.use(express.static(path.join(__dirname,'..', 'dist')));
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
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});