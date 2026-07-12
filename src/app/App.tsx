import {
  useState,
  useReducer,
  createContext,
  useContext,
  useEffect,
} from "react";
import ChengduImage from "@/assets/Chengdu.jpg";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Package,
  Menu,
  ArrowRight,
  Check,
  ChevronRight,
  Globe,
  ShieldCheck,
  Truck,
  Search,
  Handshake,
  Star,
  Clock,
  Play,
  MapPin,
  Users,
  Award,
  TrendingUp,
  Phone,
  Mail,
  Hammer,
  Mountain,
  Layers,
  Zap,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type Page = "home" | "catalog";

interface Category {
  id: string;
  label: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  priceNote: string;
  unit: string;
  image: string;
  inStock: boolean;
  brand?: string;
}

interface TeamMediaItem {
  id: string;
  title: string;
  category: string;
  duration?: string;
  thumbnail: string;
  description: string;
  mediaType: "video" | "image";
  mediaUrl: string;
}

interface OrderItem {
  product: Product;
  qty: number;
}
interface OrderState {
  items: OrderItem[];
}

type OrderAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; productId: string }
  | { type: "INCREMENT"; productId: string }
  | { type: "DECREMENT"; productId: string }
  | { type: "CLEAR" };

// ── Catalog data ─────────────────────────────────────────────────────────────
// The frontend is served from the backend build and loads catalog data from /api/products.
// If the API is unavailable, it falls back to the local catalog data below.

const CATEGORIES: Category[] = [
  { id: "all", label: "All Equipment" },
  { id: "lifting", label: "Lifting Machinery" },
  { id: "concrete", label: "Concrete Equipment" },
  { id: "mining", label: "Mining Machinery" },
  { id: "transport", label: "Heavy Transport" },
  { id: "drilling", label: "Drilling" },
];

const PRODUCTS: Product[] = [
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

// ── Order state ───────────────────────────────────────────────────────────────

function orderReducer(
  state: OrderState,
  action: OrderAction,
): OrderState {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find(
        (i) => i.product.id === action.product.id,
      );
      if (exists)
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, qty: i.qty + 1 }
              : i,
          ),
        };
      return {
        items: [
          ...state.items,
          { product: action.product, qty: 1 },
        ],
      };
    }
    case "REMOVE":
      return {
        items: state.items.filter(
          (i) => i.product.id !== action.productId,
        ),
      };
    case "INCREMENT":
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, qty: i.qty + 1 }
            : i,
        ),
      };
    case "DECREMENT":
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, qty: Math.max(1, i.qty - 1) }
            : i,
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
} | null>(null);
function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx)
    throw new Error(
      "useOrder must be used within OrderContext",
    );
  return ctx;
}

// ── AppHeader ─────────────────────────────────────────────────────────────────

function AppHeader({
  page,
  onNavigate,
  activeCategory,
  onCategoryChange,
  onOpenDrawer,
  orderCount,
}: {
  page: Page;
  onNavigate: (p: Page) => void;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  onOpenDrawer: () => void;
  orderCount: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Wordmark */}
          <button
            onClick={() => {
              onNavigate("home");
              setMobileOpen(false);
            }}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-6 h-6 bg-accent flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-accent-foreground" />
            </div>
            <span className="font-display text-base text-foreground tracking-tight">
              Chera{" "}
              <span className="text-muted-foreground font-normal">
                International
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {(["home", "catalog"] as Page[]).map((p) => (
              <button
                key={p}
                onClick={() => onNavigate(p)}
                className={`px-3 py-1.5 text-sm transition-colors capitalize ${page === p ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {p === "catalog" ? "Equipment Catalog" : "Home"}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {page === "catalog" && (
              <button
                onClick={onOpenDrawer}
                className="relative flex items-center gap-2 px-3 py-1.5 bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/85 transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  Enquiry List
                </span>
                {orderCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-foreground text-background text-[9px] font-semibold flex items-center justify-center">
                    {orderCount > 9 ? "9+" : orderCount}
                  </span>
                )}
              </button>
            )}
            {page === "home" && (
              <button
                onClick={() => onNavigate("catalog")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/85 transition-colors"
              >
                Browse Equipment{" "}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              className="md:hidden p-1.5 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border py-2 flex flex-col">
            {[
              { id: "home" as Page, label: "Home" },
              {
                id: "catalog" as Page,
                label: "Equipment Catalog",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={`flex items-center justify-between text-left px-3 py-2.5 text-sm transition-colors ${page === item.id ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {item.label}
                {page === item.id && (
                  <Check className="w-3.5 h-3.5 text-accent" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function HeroSection({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <section className="relative min-h-[92vh] flex items-end pb-16 sm:pb-24 overflow-hidden bg-background">
      <div className="absolute inset-0">
        <img
          src="/media/team/hero.JPG"
          alt="Heavy construction crane at a major project site"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/65 to-background/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-transparent to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-accent" />
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
              Heavy Machinery · Global Supply
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.05] tracking-tight">
            The machinery
            <br />
            that builds
            <br />
            <span className="italic text-accent">
              the world.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
            Chera International Trading sources and supplies
            lifting machinery, concrete equipment, mining
            machinery, drilling rigs, and dump trucks — any
            brand, any specification, delivered globally.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate("catalog")}
              className="flex items-center gap-2 bg-accent text-accent-foreground px-5 py-3 text-sm font-medium hover:bg-accent/85 transition-colors"
            >
              Browse Equipment{" "}
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#signature-programs"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-border px-5 py-3 transition-colors"
            >
              Our Programs
            </a>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
            {[
              { value: "8+", label: "Years in trade" },
              {
                value: "Any Brand",
                label: "We source globally",
              },
              { value: "5+", label: "Countries served" },
              { value: "34+", label: "Projects supplied" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl text-foreground">
                  {s.value}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Who We Are ────────────────────────────────────────────────────────────────

function WhoWeAreSection() {
  return (
    <section
      id="who-we-are"
      className="bg-background border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
                01 — Who We Are
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
              We source or supply
              <br />
              <span className="italic">
                any brand, any machine.
              </span>
            </h2>
            <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
              Chera International Trading is a specialized heavy
              machinery and construction equipment trading
              company operating between China, Africa, and the
              Middle East. We maintain direct factory
              relationships with leading Chinese and
              international manufacturers — XCMG, SANY,
              Liebherr, Komatsu, Caterpillar, Tadano, and many
              more.
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Whether you need a single truck crane for a
              construction site or a complete mining plant with
              crushing, feeding, and transport equipment, we
              handle sourcing, quality inspection,
              documentation, freight, and delivery in one
              integrated service.
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              We are active in Ethiopia, across East Africa, and
              the broader Middle East — with procurement offices
              in China to source directly from manufacturers at
              competitive factory pricing.
            </p>
            <div className="mt-8 flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors cursor-pointer">
              <span>Contact a specialist</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative overflow-hidden bg-secondary">
              <img
                src={ChengduImage}
                alt="Large crawler crane on construction site"
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border px-4 py-2.5">
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  Procurement Office
                </div>
                <div className="text-sm text-foreground mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-accent" />{" "}
                  Chengdu, China  · Ethiopia · East Africa
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-border">
              {[
                {
                  icon: Users,
                  value: "Any Brand",
                  label: "Multi-brand Sourcing",
                },
                {
                  icon: Globe,
                  value: "5+",
                  label: "Countries Active",
                },
                {
                  icon: Award,
                  value: "7+",
                  label: "Years Experience",
                },
                {
                  icon: TrendingUp,
                  value: "Full Service",
                  label: "Turnkey Supply",
                },
              ].map(({ icon: Icon, value, label }) => (
                <div key={label} className="bg-card p-5">
                  <Icon className="w-4 h-4 text-accent mb-3" />
                  <div className="font-display text-xl text-foreground">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Signature Programs ────────────────────────────────────────────────────────

const SIGNATURE_PROGRAMS = [
  {
    icon: Zap,
    tag: "Signature Program",
    title: "Complete Lifting Solutions",
    subtitle:
      "Truck Crane · Crawler Crane · Truck Mounted Crane",
    description:
      "Our flagship supply program covers the full spectrum of lifting equipment. From compact truck-mounted cranes for urban worksites to 3,000T crawler cranes for mega-projects — we source, inspect, and deliver to your site. All leading brands available.",
    highlight: "25T – 3,200T capacity range",
    isVideo: false,
    image: "/media/team/liftings.JPG",
  },
  {
    icon: Mountain,
    tag: "Signature Program",
    title: "Mining Machinery Package",
    subtitle: "Jaw Crusher · Vibrating Feeder · Mobile Plant",
    description:
      "End-to-end crushing and screening supply for quarrying, hard rock, and ore processing operations. We configure complete crushing lines — primary jaw crusher, vibrating feeder, secondary cone crusher, and screening deck — to your output specification.",
    highlight: "50 – 1,500 TPH output capacity",
    isVideo: true,
    image:
      "https://v.made-in-china.com/ucv/sbr/ead95b271262337ac96db3224e413b/15c916062110291086450081260262_h264_def.mp4",
  },
  {
    icon: Layers,
    tag: "Signature Program",
    title: "Infrastructure Ready",
    subtitle: "Concrete Mixing Plant · Drilling Rig · Pump",
    description:
      "For large infrastructure, road, and building contractors: turnkey concrete batching plant supply, piling and foundation drilling rigs, and high-pressure pump solutions. Installed, commissioned, and with operator training.",
    highlight: "25 – 240 m³/hr batching capacity",
    isVideo: true,
    image:
      "https://v.made-in-china.com/ucv/sbr/fd0c8c93d3aa0e229780252a5a3e03/c4ed81b0c010250758217639011604_h264_def.mp4",
  },
  {
    icon: Truck,
    tag: "Signature Program",
    title: "Fleet Supply Program",
    subtitle: "Dump Trucks · Heavy Transport",
    description:
      "Bulk fleet procurement of dump trucks for mining, earthworks, and material haulage. 25T–100T payload range. HOWO, Komatsu, CAT, and XCMG available new or certified refurbished. Competitive pricing for orders of 5 units or more.",
    highlight: "Fleet orders from 5 units",
    isVideo: false,
    image:
      "https://www.inboundlogistics.com/wp-content/uploads/dump-trucks.jpg?w=800&h=500&fit=crop&auto=format",
  },
];

function SignatureProgramsSection({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const [active, setActive] = useState(0);
  const prog = SIGNATURE_PROGRAMS[active];
  const { icon: ActiveIcon } = prog;

  return (
    <section
      id="signature-programs"
      className="bg-card border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
            02 — Signature Programs
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
            Our flagship
            <br />
            <span className="italic">supply programs.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Four specialized programs covering every major
            equipment category we trade.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap gap-px bg-border mb-8">
          {SIGNATURE_PROGRAMS.map((p, i) => {
            const { icon: Icon } = p;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors flex-1 min-w-[140px] ${
                  active === i
                    ? "bg-accent text-accent-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium text-xs leading-tight">
                  {p.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active program detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
          {/* Image */}
          <div className="relative overflow-hidden bg-secondary">
            {prog.isVideo ? (
              <video key={active} autoPlay muted width="100%">
                <source src={prog.image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                key={prog.image}
                src={prog.image}
                alt={prog.title}
                className="w-full h-72 lg:h-full object-cover"
                style={{ minHeight: "320px" }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="text-xs text-accent border border-accent/30 px-2 py-1 bg-background/70 backdrop-blur-sm">
                {prog.highlight}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-background p-8 sm:p-10 flex flex-col justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <ActiveIcon className="w-3.5 h-3.5 text-accent" />
                </div>
                <span className="text-[10px] text-accent uppercase tracking-widest">
                  {prog.tag}
                </span>
              </div>
              <h3 className="font-display text-3xl text-foreground leading-tight">
                {prog.title}
              </h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2 mb-5">
                {prog.subtitle}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {prog.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate("catalog")}
                className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-5 py-3 text-sm font-medium hover:bg-accent/85 transition-colors"
              >
                View Equipment{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 border border-border text-muted-foreground px-5 py-3 text-sm hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Request a Quote
              </a>
            </div>
          </div>
        </div>

        {/* Program navigation dots */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {SIGNATURE_PROGRAMS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-1.5 h-1.5 transition-all ${active === i ? "bg-accent w-5" : "bg-border hover:bg-muted-foreground"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Core Services ─────────────────────────────────────────────────────────────

function CoreServicesSection() {
  const services = [
    {
      icon: Search,
      title: "Global Sourcing",
      description:
        "Direct factory access across China, Europe, and South Korea. We source any brand — XCMG, SANY, Liebherr, Komatsu, Caterpillar, Tadano, and more — at competitive manufacturer pricing.",
    },
    {
      icon: ShieldCheck,
      title: "Quality Inspection",
      description:
        "Pre-shipment inspection and factory audit by our China-based QA team before any equipment is loaded. Full documentation and test reports provided for each unit.",
    },
    {
      icon: Truck,
      title: "Freight & Logistics",
      description:
        "Sea freight (RO-RO, flat rack, breakbulk), air freight for urgent parts, and overland transport for in-region delivery. Port-to-site logistics fully coordinated.",
    },
    {
      icon: Hammer,
      title: "Installation & Commissioning",
      description:
        "Manufacturer-certified technicians available for on-site erection, commissioning, and operator training — particularly for concrete plants and drilling equipment.",
    },
    {
      icon: Handshake,
      title: "Trade Finance Support",
      description:
        "We facilitate LC-based transactions, T/T with inspection, and deferred payment structures through our partner financial institutions for qualifying buyers.",
    },
    {
      icon: Globe,
      title: "After-Sales & Spare Parts",
      description:
        "Ongoing spare parts supply from China for all equipment we've delivered. Rapid sourcing of OEM and compatible parts with express air shipment options.",
    },
  ];

  return (
    <section className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
                03 — Services
              </span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
              What we handle
              <br />
              <span className="italic">from end to end.</span>
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Every step of the supply chain — sourcing, QA,
            freight, installation, and after-sales.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {services.map(
            ({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group bg-background p-6 hover:bg-card transition-colors duration-200 cursor-default"
              >
                <div className="w-8 h-8 bg-accent/10 border border-accent/20 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-display text-lg text-foreground leading-snug mb-2">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

// ── Team Media Section ───────────────────────────────────────────────────────

const TEAM_MEDIA_FALLBACK: TeamMediaItem[] = [
  {
    id: "team-1",
    title: "Factory inspection visit",
    category: "Team",
    duration: "4:32",
    thumbnail: "/media/team/factory-inspection.svg",
    description: "Our technical team inspects machinery and documentation before every shipment.",
    mediaType: "video",
    mediaUrl: "/media/team/factory-inspection.mp4",
  },
  {
    id: "team-2",
    title: "On-site commissioning in East Africa",
    category: "Project Team",
    duration: "3:18",
    thumbnail: "/media/team/commissioning.svg",
    description: "Engineers and project supervisors coordinate installation and commissioning on site.",
    mediaType: "image",
    mediaUrl: "/media/team/commissioning.svg",
  },
];

function VideosSection() {
  const [playing, setPlaying] = useState<string | null>(null);
  const [mediaItems, setMediaItems] = useState<TeamMediaItem[]>(TEAM_MEDIA_FALLBACK);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const activeMedia = mediaItems.find((item) => item.id === playing) ?? null;

  useEffect(() => {
    let isMounted = true;
    const apiBase = import.meta.env.DEV ? "http://localhost:3000" : "";

    async function loadTeamMedia() {
      try {
        setLoadingMedia(true);
        const response = await fetch(`${apiBase}/api/team-media`);
        if (!response.ok) throw new Error("Unable to load team media");
        const data = await response.json();
        if (isMounted && Array.isArray(data)) {
          setMediaItems(data);
        }
      } catch (error) {
        console.error("Team media load failed, using fallback data", error);
      } finally {
        if (isMounted) {
          setLoadingMedia(false);
        }
      }
    }

    loadTeamMedia();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
            04 — Team Media
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
            Meet the team
            <br />
            <span className="italic">behind the projects.</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Field visits, commissioning work, and project teams captured in media that can be switched between video and image formats.
          </p>
        </div>

        {loadingMedia && (
          <p className="text-sm text-muted-foreground mb-4">Loading team media…</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {mediaItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPlaying(item.id)}
              className="group relative text-left bg-background overflow-hidden focus:outline-none"
            >
              <div className="relative overflow-hidden h-44 bg-secondary">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-background/40 group-hover:bg-background/20 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-accent/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-200">
                    {item.mediaType === "video" ? (
                      <Play className="w-5 h-5 text-accent-foreground fill-accent-foreground ml-0.5" />
                    ) : (
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent-foreground">
                        Photo
                      </span>
                    )}
                  </div>
                </div>
                {item.duration && (
                  <div className="absolute bottom-2.5 right-2.5 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 text-[10px] text-foreground">
                    {item.duration}
                  </div>
                )}
                <div className="absolute top-2.5 left-2.5 bg-background/80 backdrop-blur-sm border border-border px-1.5 py-0.5 text-[9px] text-muted-foreground uppercase tracking-wider">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-foreground leading-snug group-hover:text-accent transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>

        {playing && activeMedia && (
          <div
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPlaying(null)}
          >
            <div
              className="relative w-full max-w-3xl bg-card border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between px-5 py-4 border-b border-border">
                <div>
                  <div className="text-[10px] text-accent uppercase tracking-wider">
                    {activeMedia.category}
                    {activeMedia.duration ? ` · ${activeMedia.duration}` : ""}
                  </div>
                  <h3 className="font-display text-lg text-foreground mt-0.5">
                    {activeMedia.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPlaying(null)}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="relative bg-secondary aspect-video">
                {activeMedia.mediaType === "video" ? (
                  <video
                    controls
                    autoPlay
                    playsInline
                    poster={activeMedia.thumbnail}
                    src={activeMedia.mediaUrl}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={activeMedia.mediaUrl}
                    alt={activeMedia.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-muted-foreground">
                  {activeMedia.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Why Work With Us ──────────────────────────────────────────────────────────

function WhyWorkWithUsSection({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  const reasons = [
    {
      num: "01",
      icon: Clock,
      title: "Factory-direct speed and pricing",
      description:
        "Our China procurement office works directly with manufacturers — no middlemen. This means better lead times, factory pricing, and direct access to production schedules.",
    },
    {
      num: "02",
      icon: ShieldCheck,
      title: "Hands-on QA before every shipment",
      description:
        "Our engineers physically inspect every unit at the factory before loading. Load tests, hydraulic checks, electrical systems, and documentation verified on-site.",
    },
    {
      num: "03",
      icon: Globe,
      title: "Proven in East Africa and the Middle East",
      description:
        "We have successfully delivered projects across Ethiopia, Kenya, Tanzania, Djibouti, UAE, and Saudi Arabia — with customs clearance, local logistics, and on-site commissioning.",
    },
    {
      num: "04",
      icon: Star,
      title: "Any brand, any specification",
      description:
        "We do not limit you to a single brand. Tell us your project spec and budget — we source the right machine from the right manufacturer, new or certified refurbished.",
    },
  ];

  return (
    <section className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
              05 — Why Choose Us
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-tight max-w-2xl">
            The difference is in
            <br />
            <span className="italic">
              what we refuse to compromise on.
            </span>
          </h2>
        </div>

        <div className="space-y-px bg-border">
          {reasons.map(
            ({ num, icon: Icon, title, description }) => (
              <div
                key={num}
                className="group bg-background hover:bg-card transition-colors duration-200 px-6 py-7"
              >
                <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_2fr] gap-4 sm:gap-8 items-start">
                  <div className="font-display text-3xl text-accent/30 group-hover:text-accent/50 transition-colors">
                    {num}
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-7 h-7 bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-accent" />
                    </div>
                    <h3 className="font-display text-lg text-foreground leading-snug">
                      {title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Testimonial */}
        <div className="mt-16 border border-border p-8 sm:p-12 bg-card">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <div className="font-display text-2xl sm:text-3xl text-foreground leading-relaxed italic">
                &ldquo;Chera trading sourced and delivered a complete
                jaw crushing plant to our quarry in one month. The equipment was,
                fully commissioned and tested. Their team
                handled everything from the factory to our
                gate.&rdquo;
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-8 h-px bg-accent" />
                <div>
                  <div className="text-sm text-foreground">
                    Tesfaye Dinsa
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Operations Director · Nile Stone Quarrying,
                    Ethiopia
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-accent text-accent"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact Section ───────────────────────────────────────────────────────────

function ContactSection() {
  return (
    <section
      id="contact"
      className="bg-card border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
            06 — Contact
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground leading-tight">
              Talk to a
              <br />
              <span className="italic">trade specialist.</span>
            </h2>
            <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-md">
              Tell us your equipment requirement — type, brand
              preference, capacity, and project timeline — and
              we will respond with availability, pricing, and
              lead time within 24 hours.
            </p>

            {/* Contact numbers */}
            <div className="mt-10 space-y-4">
              {[
                {
                  label: "China Office (Sales)",
                  number: "+86 147 2600 6289 ",
                  flag: "🇨🇳",
                },
                {
                  label: "China Office (Procurement)",
                  number: "+86 147 0808 3872",
                  flag: "🇨🇳",
                },
                {
                  label: "China Office (Sales)",
                  number: "+86 132 5059 6893",
                  flag: "🇨🇳",
                },
                {
                  label: "Ethiopia Office",
                  number: "+251 923 434 403",
                  flag: "🇪🇹",
                },
              ].map(({ label, number, flag }) => (
                <a
                  key={number}
                  href={`tel:${number.replace(/\s/g, "")}`}
                  className="group flex items-center gap-4 p-4 bg-background border border-border hover:border-accent/40 transition-colors"
                >
                  <span className="text-2xl">{flag}</span>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {label}
                    </div>
                    <div className="text-base font-medium text-foreground group-hover:text-accent transition-colors mt-0.5 flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      {number}
                    </div>
                  </div>
                </a>
              ))}

              <a
                href="mailto:tradingchera@gmail.com"
                className="group flex items-center gap-4 p-4 bg-background border border-border hover:border-accent/40 transition-colors"
              >
                <span className="text-2xl">✉️</span>
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Email
                  </div>
                  <div className="text-base font-medium text-foreground group-hover:text-accent transition-colors mt-0.5 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    tradingchera@gmail.com
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Quick enquiry form */}
          <div className="bg-background border border-border p-6 sm:p-8">
            <h3 className="font-display text-xl text-foreground mb-5">
              Send an Enquiry
            </h3>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  "Enquiry sent! We will contact you shortly.",
                );
              }}
            >
              {[
                {
                  label: "Your Name",
                  type: "text",
                  ph: "Dinsa Argew",
                  key: "name",
                },
                {
                  label: "Company",
                  type: "text",
                  ph: "Construction Co. Ltd",
                  key: "company",
                },
                {
                  label: "Email Address",
                  type: "email",
                  ph: "a.tadesse@company.com",
                  key: "email",
                },
                {
                  label: "Phone / WhatsApp",
                  type: "tel",
                  ph: "+251 9XX XXX XXX",
                  key: "phone",
                },
              ].map(({ label, type, ph, key }) => (
                <div key={key}>
                  <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    placeholder={ph}
                    required={key !== "phone"}
                    className="w-full bg-card border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  Equipment Required
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the equipment you need — type, capacity, brand preference, quantity, and project timeline…"
                  className="w-full bg-card border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground text-sm font-medium py-3 hover:bg-accent/85 transition-colors"
              >
                Send Enquiry <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA Strip ─────────────────────────────────────────────────────────────────

function CTASection({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <section className="bg-accent border-t border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl text-accent-foreground leading-tight">
              Ready to source your
              <br />
              next machine?
            </h2>
            <p className="mt-3 text-sm text-accent-foreground/70 max-w-md">
              Browse our full equipment catalog or call us
              directly. We respond within 24 hours.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onNavigate("catalog")}
              className="flex items-center gap-2 bg-accent-foreground text-accent px-5 py-3 text-sm font-medium hover:bg-accent-foreground/90 transition-colors"
            >
              Browse Equipment{" "}
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#contact"
              className="flex items-center gap-2 border border-accent-foreground/30 text-accent-foreground px-5 py-3 text-sm hover:border-accent-foreground/60 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 bg-accent flex items-center justify-center">
                <Globe className="w-3 h-3 text-accent-foreground" />
              </div>
              <span className="font-display text-sm text-foreground">
                Chera International Trading
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Lifting machinery, concrete equipment, mining
              machinery, drilling rigs, and dump trucks —
              sourced globally, delivered to your site.
            </p>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
              Equipment
            </div>
            {[
              "Lifting Machinery",
              "Concrete Equipment",
              "Mining Machinery",
              "Drilling Rigs",
              "Dump Trucks",
            ].map((item) => (
              <div
                key={item}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5 cursor-pointer"
              >
                {item}
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3">
              Contact
            </div>
            {[
              {
                icon: Phone,
                text: "+86 147 0808 3872",
                sub: "China Office",
              },
              {
                icon: Phone,
                text: "+86 132 5059 6893",
                sub: "China Sales",
              },
              {
                icon: Phone,
                text: "+251 923 434 403",
                sub: "Ethiopia",
              },
            ].map(({ icon: Icon, text, sub }) => (
              <div
                key={text}
                className="flex items-start gap-2 py-1"
              >
                <Icon className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs text-foreground">
                    {text}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © 2025 Chera International Trading · All rights
            reserved
          </p>
          <p className="text-xs text-muted-foreground/50">
            We source or supply any brand
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── HomePage ──────────────────────────────────────────────────────────────────

function HomePage({
  onNavigate,
}: {
  onNavigate: (p: Page) => void;
}) {
  return (
    <>
      <HeroSection onNavigate={onNavigate} />
      <WhoWeAreSection />
      <SignatureProgramsSection onNavigate={onNavigate} />
      <CoreServicesSection />
      <WhyWorkWithUsSection onNavigate={onNavigate} />
      <VideosSection />
      <CTASection onNavigate={onNavigate} />
      <ContactSection />
      <SiteFooter />
    </>
  );
}

// ── Catalog ───────────────────────────────────────────────────────────────────

function ProductCard({ product, onImageClick }: { product: Product; onImageClick?: (product: Product) => void }) {
  const { state, dispatch } = useOrder();
  const inOrder = state.items.some(
    (i) => i.product.id === product.id,
  );

  return (
    <article className="group flex flex-col bg-card border border-border overflow-hidden hover:border-border/60 transition-colors duration-200">
      <div className="relative overflow-hidden bg-secondary h-44 cursor-pointer" onClick={() => onImageClick?.(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <span className="absolute top-2.5 left-2.5 text-[9px] font-medium uppercase tracking-widest text-muted-foreground bg-background/80 backdrop-blur-sm px-1.5 py-0.5 border border-border">
          {product.sku}
        </span>
        {product.brand && (
          <span className="absolute top-2.5 right-2.5 text-[9px] font-medium uppercase tracking-widest text-accent bg-background/80 backdrop-blur-sm px-1.5 py-0.5 border border-accent/20">
            {product.brand}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex-1">
          <h3 className="font-display text-base leading-snug text-foreground">
            {product.name}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>
        <div className="flex items-end justify-between gap-2 mt-auto pt-2 border-t border-border">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Pricing
            </div>
            <div className="text-sm font-medium text-accent">
              {product.priceNote}
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: "ADD", product })}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 transition-colors ${
              inOrder
                ? "bg-secondary text-foreground border border-accent/40"
                : "bg-accent text-accent-foreground hover:bg-accent/85"
            }`}
          >
            {inOrder ? (
              <>
                <Check className="w-3 h-3" /> Added
              </>
            ) : (
              <>
                <Plus className="w-3 h-3" /> Enquire
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductGrid({ products, onSelectProduct }: { products: Product[]; onSelectProduct: (product: Product) => void }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <Package className="w-9 h-9 text-muted-foreground mb-4 opacity-50" />
        <p className="text-sm text-muted-foreground">
          No products in this category.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
      {products.map((p) => (
        <div key={p.id} className="bg-background">
          <ProductCard product={p} onImageClick={onSelectProduct} />
        </div>
      ))}
    </div>
  );
}

// ── Order Drawer ──────────────────────────────────────────────────────────────

function OrderDrawer({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const { state, dispatch } = useOrder();

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => !v && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed right-0 top-0 z-50 h-full w-full max-w-[420px] bg-card border-l border-border flex flex-col"
          style={{ animation: "slideInRight 0.22s ease" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div>
              <Dialog.Title className="text-sm font-medium text-foreground uppercase tracking-wider">
                Enquiry List
              </Dialog.Title>
              <Dialog.Description className="text-xs text-muted-foreground mt-0.5">
                {state.items.length} item
                {state.items.length !== 1 ? "s" : ""} selected
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
            {state.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <ShoppingCart className="w-9 h-9 text-muted-foreground mb-3 opacity-40" />
                <p className="text-sm text-muted-foreground">
                  No items yet.
                </p>
                <p className="text-xs text-muted-foreground/50 mt-1">
                  Browse equipment and click
                  &ldquo;Enquire&rdquo;.
                </p>
              </div>
            ) : (
              state.items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 bg-secondary border border-border"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover bg-muted flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-foreground leading-snug truncate">
                      {item.product.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                      {item.product.sku}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            dispatch({
                              type: "DECREMENT",
                              productId: item.product.id,
                            })
                          }
                          className="w-5 h-5 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-sm w-5 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "INCREMENT",
                              productId: item.product.id,
                            })
                          }
                          className="w-5 h-5 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <span className="text-xs text-accent">
                        {item.product.priceNote}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "REMOVE",
                        productId: item.product.id,
                      })
                    }
                    className="p-1 text-muted-foreground hover:text-foreground self-start transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {state.items.length > 0 && (
            <div className="px-5 py-5 border-t border-border space-y-3">
              <div className="text-xs text-muted-foreground">
                {state.items.length} machine
                {state.items.length > 1 ? "s" : ""} · Pricing
                provided after enquiry review
              </div>
              <button
                onClick={onSubmit}
                className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground text-sm font-medium py-3 hover:bg-accent/85 transition-colors"
              >
                Submit Enquiry{" "}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => dispatch({ type: "CLEAR" })}
                className="w-full text-xs text-muted-foreground hover:text-foreground text-center py-1 transition-colors"
              >
                Clear list
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── Product Detail Modal ──────────────────────────────────────────────────────

function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { dispatch } = useOrder();

  if (!product) return null;

  return (
    <Dialog.Root
      open={product !== null}
      onOpenChange={(v) => !v && onClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <div className="sticky top-0 flex items-center justify-end p-4 border-b border-border bg-card/95 backdrop-blur-sm">
              <Dialog.Close asChild>
                <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Image */}
                <div className="flex flex-col gap-4">
                  <div className="relative overflow-hidden bg-secondary aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-1">
                        {product.sku}
                      </span>
                      {product.brand && (
                        <span className="text-[10px] font-medium uppercase tracking-widest text-accent bg-secondary px-2 py-1">
                          {product.brand}
                        </span>
                      )}
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl text-foreground leading-tight">
                      {product.name}
                    </h1>
                  </div>

                  <div className="space-y-3 py-4 border-y border-border">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                        Description
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                        Category
                      </div>
                      <p className="text-sm text-foreground capitalize">
                        {product.category}
                      </p>
                    </div>
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                        Unit
                      </div>
                      <p className="text-sm text-foreground capitalize">
                        {product.unit}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                      Status
                    </div>
                    <p className="text-sm">
                      {product.inStock ? (
                        <span className="text-green-500">In Stock</span>
                      ) : (
                        <span className="text-amber-600">Out of Stock</span>
                      )}
                    </p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
                      Pricing
                    </div>
                    <div className="text-lg font-medium text-accent mb-4">
                      {product.priceNote}
                    </div>
                    <button
                      onClick={() => {
                        dispatch({ type: "ADD", product });
                        onClose();
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground text-sm font-medium py-3 hover:bg-accent/85 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Enquiry
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── Enquiry Form Modal ────────────────────────────────────────────────────────

function OrderFormModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state, dispatch } = useOrder();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    delivery: "",
    notes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function handleClose() {
    if (submitted) {
      dispatch({ type: "CLEAR" });
      setSubmitted(false);
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        delivery: "",
        notes: "",
      });
    }
    onClose();
  }

  const field =
    "w-full bg-secondary border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-accent/40 transition-colors";

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => !v && handleClose()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[90vh] overflow-y-auto bg-card border border-border shadow-2xl">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <div className="w-11 h-11 bg-accent flex items-center justify-center mb-5">
                <Check className="w-5 h-5 text-accent-foreground" />
              </div>
              <h2 className="font-display text-2xl text-foreground">
                Enquiry Submitted
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
                {
                  "Our team will review your requirement and respond with pricing, availability, and lead time within 24 hours."
                }
              </p>
              <button
                onClick={handleClose}
                className="mt-8 flex items-center gap-2 px-5 py-2.5 bg-accent text-accent-foreground text-sm hover:bg-accent/85 transition-colors"
              >
                Back to Catalog{" "}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border">
                <div>
                  <Dialog.Title className="font-display text-xl text-foreground">
                    Equipment Enquiry
                  </Dialog.Title>
                  <Dialog.Description className="text-xs text-muted-foreground mt-1">
                    {state.items.length} item
                    {state.items.length !== 1 ? "s" : ""} ·
                    Price on request
                  </Dialog.Description>
                </div>
                <Dialog.Close asChild>
                  <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors mt-0.5">
                    <X className="w-4 h-4" />
                  </button>
                </Dialog.Close>
              </div>
              <form
                onSubmit={handleSubmit}
                className="px-6 py-5 space-y-4"
              >
                <div className="bg-secondary border border-border p-3 space-y-1.5">
                  {state.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-muted-foreground truncate max-w-[220px]">
                        {item.qty}× {item.product.name}
                      </span>
                      <span className="text-accent text-[10px]">
                        {item.product.priceNote}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: "Full Name *",
                      ph: "Abebe Tadesse",
                      key: "name",
                      type: "text",
                      req: true,
                    },
                    {
                      label: "Company *",
                      ph: "Construction Co.",
                      key: "company",
                      type: "text",
                      req: true,
                    },
                    {
                      label: "Email *",
                      ph: "a.tadesse@co.com",
                      key: "email",
                      type: "email",
                      req: true,
                    },
                    {
                      label: "Phone / WhatsApp",
                      ph: "+251 9XX XXX XXX",
                      key: "phone",
                      type: "tel",
                      req: false,
                    },
                  ].map(({ label, ph, key, type, req }) => (
                    <div key={key}>
                      <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                        {label}
                      </label>
                      <input
                        required={req}
                        type={type}
                        placeholder={ph}
                        value={form[key as keyof typeof form]}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            [key]: e.target.value,
                          }))
                        }
                        className={field}
                      />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                      Delivery Location *
                    </label>
                    <input
                      required
                      placeholder="City, Country"
                      value={form.delivery}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          delivery: e.target.value,
                        }))
                      }
                      className={field}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                      Notes / Specifications
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brand preference, capacity, timeline, quantity…"
                      value={form.notes}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          notes: e.target.value,
                        }))
                      }
                      className={`${field} resize-none`}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground text-sm font-medium py-3 hover:bg-accent/85 transition-colors"
                >
                  Submit Enquiry{" "}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [orderState, dispatch] = useReducer(orderReducer, {
    items: [],
  });
  const [activeCategory, setActiveCategory] = useState("all");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const apiBase = import.meta.env.DEV ? "http://localhost:3000" : "";

    async function loadCatalog() {
      try {
        setIsLoadingCatalog(true);
        setCatalogError(null);

        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch(`${apiBase}/api/categories`),
          fetch(`${apiBase}/api/products`),
        ]);

        if (!categoriesResponse.ok || !productsResponse.ok) {
          throw new Error("Unable to load catalog from API");
        }

        const [categoriesData, productsData] = await Promise.all([
          categoriesResponse.json(),
          productsResponse.json(),
        ]);

        if (!isMounted) return;

        setCategories(Array.isArray(categoriesData) ? categoriesData : CATEGORIES);
        setProducts(Array.isArray(productsData) ? productsData : PRODUCTS);
      } catch (error) {
        console.error("Catalog fetch failed, using fallback data", error);
        if (!isMounted) return;

        setCategories(CATEGORIES);
        setProducts(PRODUCTS);
        setCatalogError("Using fallback catalog data while the API is unavailable.");
      } finally {
        if (isMounted) {
          setIsLoadingCatalog(false);
        }
      }
    }

    loadCatalog();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);
  const orderCount = orderState.items.reduce(
    (n, i) => n + i.qty,
    0,
  );

  function navigate(p: Page) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <OrderContext.Provider
      value={{ state: orderState, dispatch }}
    >
      <div className="min-h-screen bg-background">
        <AppHeader
          page={page}
          onNavigate={navigate}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onOpenDrawer={() => setDrawerOpen(true)}
          orderCount={orderCount}
        />

        {page === "home" && <HomePage onNavigate={navigate} />}

        {page === "catalog" && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            {/* Page heading */}
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight">
                  Equipment Catalog
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  We source or supply any brand · Price on request
                </p>
              </div>
              <span className="text-sm text-muted-foreground tabular-nums shrink-0">
                {filtered.length} item{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            {isLoadingCatalog && (
              <p className="text-sm text-muted-foreground mb-4">
                Loading equipment catalog…
              </p>
            )}
            {catalogError && (
              <p className="text-sm text-amber-600 mb-4">
                {catalogError}
              </p>
            )}

            {/* Category filter bar */}
            <div className="flex flex-wrap gap-px bg-border mb-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 text-sm transition-colors ${
                    activeCategory === cat.id
                      ? "bg-accent text-accent-foreground"
                      : "bg-background text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <ProductGrid products={filtered} onSelectProduct={setSelectedProduct} />
          </main>
        )}

        <OrderDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSubmit={() => {
            setDrawerOpen(false);
            setFormOpen(true);
          }}
        />
        <OrderFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
        />
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .font-display { font-family: "DM Serif Display", Georgia, serif; }
        ::-webkit-scrollbar { width: 3px; height: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--border); }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
        html { scroll-behavior: smooth; }
      `}</style>
    </OrderContext.Provider>
  );
}