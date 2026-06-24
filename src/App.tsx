/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, Lock, Unlock, Server, Key, Cpu, Wrench, Smartphone, MessageSquare, 
  Settings, User, CheckCircle, Clock, AlertTriangle, XCircle, RefreshCw, 
  CreditCard, ChevronRight, Download, LogOut, Database, Bell, Send, Copy, 
  MapPin, Check, ExternalLink, ShieldAlert, DollarSign, History, Filter, AlertCircle, Sparkles,
  Facebook, Instagram, Cloud, Signal, Apple, Fingerprint, Zap, Layers, PlusSquare, Package,
  Sun, Moon
} from "lucide-react";

const TiktokIcon = ({ size = 16 }: { size?: number }) => (
  <svg 
    stroke="currentColor" 
    fill="currentColor" 
    strokeWidth="0" 
    viewBox="0 0 448 512" 
    style={{ width: size, height: size }}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"></path>
  </svg>
);

// @ts-ignore
import luthfiLogo from "./assets/images/luthfi_cell_logo_1782255733088.jpg";

const LuthfiCellLogoIcon = ({ className = "w-12 h-12" }: { className?: string; animateGear?: boolean }) => {
  return (
    <img 
      src={luthfiLogo} 
      className={`${className} object-cover rounded-xl border border-amber-500/40 bg-gradient-to-br from-[#051129] to-[#020714] shadow-[0_0_12px_rgba(245,158,11,0.25)]`} 
      referrerPolicy="no-referrer" 
      alt="Luthfi Cell Unlocker Logo"
    />
  );
};

const renderServiceIcon = (iconStr: string) => {
  const s = iconStr.toLowerCase();
  if (s.includes("server")) return <Server size={18} className="text-brand-accent" />;
  if (s.includes("unlock-keyhole") || s.includes("unlock") || s.includes("lock-open")) return <Unlock size={18} className="text-brand-accent" />;
  if (s.includes("lock")) return <Lock size={18} className="text-brand-accent" />;
  if (s.includes("cloud")) return <Cloud size={18} className="text-brand-accent" />;
  if (s.includes("signal")) return <Signal size={18} className="text-brand-accent" />;
  if (s.includes("shield")) return <ShieldAlert size={18} className="text-brand-accent" />;
  if (s.includes("apple")) return <Apple size={18} className="text-brand-accent" />;
  if (s.includes("fingerprint")) return <Fingerprint size={18} className="text-brand-accent" />;
  if (s.includes("triangle-exclamation") || s.includes("exclamation")) return <AlertTriangle size={18} className="text-brand-accent" />;
  if (s.includes("bolt-lightning") || s.includes("bolt") || s.includes("lightning")) return <Zap size={18} className="text-brand-accent" />;
  if (s.includes("rotate")) return <RefreshCw size={18} className="text-brand-accent" />;
  if (s.includes("key")) return <Key size={18} className="text-brand-accent" />;
  if (s.includes("cubes-stacked") || s.includes("cubes") || s.includes("layer")) return <Layers size={18} className="text-brand-accent" />;
  if (s.includes("microchip") || s.includes("cpu")) return <Cpu size={18} className="text-brand-accent" />;
  if (s.includes("plus") || s.includes("square-plus")) return <PlusSquare size={18} className="text-brand-accent" />;
  if (s.includes("wrench")) return <Wrench size={18} className="text-brand-accent" />;
  if (s.includes("box") || s.includes("package")) return <Package size={18} className="text-brand-accent" />;
  
  if (iconStr.includes("fa-")) {
    return <i className={`${iconStr} text-base text-brand-accent`}></i>;
  }
  return <Server size={18} className="text-brand-accent" />;
};

// Definitions of types
interface Service {
  id: string;
  category: "remote" | "activation" | "rental";
  name: string;
  desc: string;
  estTime: string;
  type: string;
  price: number;
  icon: string;
}

interface Order {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  price: number;
  estTime: string;
  type: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deviceType: string;
  imeiOrSerial: string;
  notes?: string;
  paymentMethod: string;
  paymentStatus: "Belum Bayar" | "Lunas";
  status: "Pending" | "Diproses" | "Selesai" | "Dibatalkan";
  timestamp: string;
  updatedAt: string;
}

interface Customer {
  phone: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
}

interface NotificationLog {
  id: string;
  timestamp: string;
  recipient: string;
  message: string;
  status: string;
  details: string;
}

interface SettingsConfig {
  whatsappToken: string;
  whatsappGatewayUrl: string;
  whatsappNotificationEnabled: boolean;
  notificationLogs: NotificationLog[];
}

interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  activeOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  categoriesCount: {
    remote: number;
    activation: number;
    rental: number;
  };
  earningsByDay: {
    date: string;
    revenue: number;
  }[];
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface RepairProgressTimelineProps {
  status: "Pending" | "Diproses" | "Selesai" | "Dibatalkan";
  paymentStatus: "Belum Bayar" | "Lunas";
}

const RepairProgressTimeline = ({ status, paymentStatus }: RepairProgressTimelineProps) => {
  const steps = [
    {
      id: 1,
      title: "Pesanan Diterima",
      desc: "Pesanan masuk antrean sistem",
      icon: Clock,
    },
    {
      id: 2,
      title: "Verifikasi Bayar",
      desc: paymentStatus === "Lunas" ? "Pembayaran Terverifikasi" : "Menunggu Pembayaran",
      icon: CreditCard,
    },
    {
      id: 3,
      title: "Proses Remote",
      desc: status === "Diproses" ? "Sedang Dikerjakan" : status === "Selesai" ? "Selesai Dikerjakan" : "Menunggu Giliran",
      icon: Cpu,
    },
    {
      id: 4,
      title: "Sukses Selesai",
      desc: "Device siap digunakan",
      icon: Sparkles,
    },
  ];

  const getActiveStep = () => {
    if (status === "Dibatalkan") return -1;
    if (status === "Selesai") return 4;
    if (status === "Diproses") return 3;
    if (paymentStatus === "Lunas") return 2;
    return 1;
  };

  const currentStep = getActiveStep();

  if (status === "Dibatalkan") {
    return (
      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-400 my-2">
        <XCircle size={18} className="shrink-0 animate-pulse" />
        <div className="text-left text-xs">
          <p className="font-cyber font-bold uppercase tracking-wider">STATUS: PESANAN DIBATALKAN</p>
          <p className="text-[11px] text-slate-400">Silakan hubungi operator LU_TEAM untuk konsultasi atau bantuan lebih lanjut.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-navyCard/60 border border-white/5 rounded-2xl p-5 sm:p-6 my-4">
      <div className="text-center mb-6">
        <span className="text-[9px] font-cyber font-bold tracking-widest text-brand-accent uppercase bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20">
          PROGRES PENGERJAAN REAL-TIME
        </span>
      </div>
      
      <div className="relative">
        {/* Connection lines background */}
        <div className="absolute top-5 left-10 right-10 h-[2px] bg-white/10 hidden md:block" />
        
        {/* Connection lines active progress */}
        <div 
          className="absolute top-5 left-10 h-[2px] bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-700 hidden md:block"
          style={{ 
            width: `${((Math.max(0, currentStep - 1)) / (steps.length - 1)) * 95 - 4}%` 
          }} 
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <div key={step.id} className="flex md:flex-col items-center md:items-center text-left md:text-center space-x-4 md:space-x-0 md:space-y-3 transition-all duration-300">
                {/* Circle Indicator */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 shrink-0 ${
                    isCompleted 
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]" 
                      : isActive 
                        ? "bg-brand-accent border-brand-accent text-brand-navy font-bold shadow-[0_0_15px_rgba(245,158,11,0.35)] scale-110 animate-pulse" 
                        : "bg-brand-navy border-white/10 text-slate-500"
                  }`}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : <StepIcon size={16} />}
                </div>

                {/* Labels */}
                <div className="flex-1 text-left md:text-center">
                  <h4 
                    className={`text-xs font-cyber font-bold tracking-wider uppercase transition-colors ${
                      isActive ? "text-brand-accent" : isCompleted ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-normal mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"home" | "remote" | "activation" | "rental" | "track" | "guide">("home");
  
  // Theme (Light/Dark Mode) State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return true; // Default is Dark Mode
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove("light-mode");
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light-mode");
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);
  
  // IMEI Checker State
  const [imeiQuery, setImeiQuery] = useState("");
  const [isCheckingImei, setIsCheckingImei] = useState(false);
  const [imeiResult, setImeiResult] = useState<{
    brand: string;
    model: string;
    imeiOrSerial: string;
    deviceInfo: {
      color: string;
      storage: string;
      purchaseCountry: string;
      estimatedPurchaseDate: string;
    };
    icloudOrFindMyStatus: string;
    carrierLockStatus: string;
    kemenperinStatus: string;
    warrantyStatus: string;
    recommendedServices: string[];
    diagnosticNotes: string;
  } | null>(null);
  const [imeiError, setImeiError] = useState<string | null>(null);

  // Diagnostic State for Guide Tab
  const [diagBrand, setDiagBrand] = useState("");
  const [diagProblem, setDiagProblem] = useState("");
  
  // Service listings state
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "remote" | "activation" | "rental">("all");
  
  // Loading & notification states
  const [loadingServices, setLoadingServices] = useState(true);
  const [appNotification, setAppNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Ordering State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [orderEmail, setOrderEmail] = useState("");
  const [orderDevice, setOrderDevice] = useState("");
  const [orderImei, setOrderImei] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderPaymentMethod, setOrderPaymentMethod] = useState("Chat ke WhatsApp");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Order Tracker State
  const [trackingPhone, setTrackingPhone] = useState("");
  const [trackingOrderId, setTrackingOrderId] = useState("");
  const [trackedOrders, setTrackedOrders] = useState<Order[]>([]);
  const [singleTrackedOrder, setSingleTrackedOrder] = useState<Order | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  // AI Assistant Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "model", text: "Halo! Saya adalah Luthfi Cell AI Assistant 🔓. Ada yang bisa saya bantu terkait remote bypass HP, aktivasi tool premium, atau persewaan tool harian?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAILoading, setIsAILoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Admin Dashboard State
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminCustomers, setAdminCustomers] = useState<Customer[]>([]);
  const [adminSettings, setAdminSettings] = useState<SettingsConfig | null>(null);
  
  // Settings edit form states
  const [settingsToken, setSettingsToken] = useState("");
  const [settingsUrl, setSettingsUrl] = useState("");
  const [settingsEnabled, setSettingsEnabled] = useState(true);
  const [newAdminPass, setNewAdminPass] = useState("");
  
  const [adminActiveTab, setAdminActiveTab] = useState<"stats" | "orders" | "customers" | "settings">("stats");
  const [adminFilterStatus, setAdminFilterStatus] = useState<string>("all");
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  // Simulated copy feedback state
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Trigger app notification helper
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setAppNotification({ message, type });
    setTimeout(() => {
      setAppNotification(null);
    }, 4500);
  };

  // Renders the background interactive server traffic network canvas
  useEffect(() => {
    const canvas = document.getElementById("bg-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initializeNetwork();
    };
    window.addEventListener("resize", handleResize);

    interface ServerNode {
      id: number;
      x: number;
      y: number;
      name: string;
      ip: string;
      status: "ONLINE" | "BUSY" | "ACTIVE";
      ping: number;
      neighbors: number[];
      pulse: number;
      ledBlink: number;
    }

    interface ServerPacket {
      currentX: number;
      currentY: number;
      fromNode: number;
      toNode: number;
      progress: number;
      speed: number;
      size: number;
      color: string;
    }

    let nodes: ServerNode[] = [];
    let packets: ServerPacket[] = [];
    const maxPackets = 35;

    const names = [
      "SRV-CORE-01", "BPS-GATEWAY", "DB-REPLICA-A", "API-ROUTER-9", 
      "REMOTE-HUB", "LIC-VERIFY-1", "USA-PROXY-X", "SG-EDGE-ROUTER", 
      "BYPASS-SERVER", "SECURE-VAULT", "ACT-SERVER-3", "SW-CONTROLLER"
    ];

    const getPacketColor = () => {
      const r = Math.random();
      if (darkMode) {
        if (r < 0.4) return "rgba(245, 158, 11, 0.9)"; // Orange accent
        if (r < 0.7) return "rgba(16, 185, 129, 0.9)"; // Emerald success
        return "rgba(14, 165, 233, 0.9)"; // Sky blue
      } else {
        if (r < 0.4) return "rgba(217, 119, 6, 0.85)"; // Soft amber
        if (r < 0.7) return "rgba(5, 150, 105, 0.85)"; // Soft green
        return "rgba(2, 132, 199, 0.85)"; // Soft blue
      }
    };

    const initializeNetwork = () => {
      nodes = [];
      packets = [];
      
      const nodeCount = Math.min(20, Math.floor(width / 80));
      const cols = 4;
      const rows = Math.ceil(nodeCount / cols);
      
      // Place nodes in a neat high-tech distributed rack grid
      for (let i = 0; i < nodeCount; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        
        // Add random offsets to make the structure organic but aligned
        const x = (width / (cols + 1)) * (col + 1) + (Math.random() - 0.5) * 60;
        const y = (height / (rows + 1)) * (row + 1) + (Math.random() - 0.5) * 80;
        
        nodes.push({
          id: i,
          x,
          y,
          name: names[i % names.length] + `-${col}${row}`,
          ip: `10.240.${col}.${10 + row * 15}`,
          status: Math.random() > 0.4 ? "ONLINE" : Math.random() > 0.5 ? "ACTIVE" : "BUSY",
          ping: Math.floor(Math.random() * 30) + 5,
          neighbors: [],
          pulse: Math.random() * Math.PI,
          ledBlink: Math.random(),
        });
      }

      // Connect nodes with straight horizontal or vertical bus lines (server routing architecture)
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        const distances = nodes
          .map((n2, idx) => ({ idx, dist: Math.hypot(n1.x - n2.x, n1.y - n2.y) }))
          .filter(item => item.idx !== i)
          .sort((a, b) => a.dist - b.dist);
        
        // Connect each node to its 2 or 3 nearest neighbors to form paths
        const maxConnections = Math.random() > 0.5 ? 3 : 2;
        for (let c = 0; c < Math.min(maxConnections, distances.length); c++) {
          const neighborIdx = distances[c].idx;
          if (!n1.neighbors.includes(neighborIdx)) {
            n1.neighbors.push(neighborIdx);
          }
          if (!nodes[neighborIdx].neighbors.includes(i)) {
            nodes[neighborIdx].neighbors.push(i);
          }
        }
      }

      // Generate initial packet flow
      for (let i = 0; i < maxPackets; i++) {
        const fromNodeIdx = Math.floor(Math.random() * nodes.length);
        const fromNode = nodes[fromNodeIdx];
        if (fromNode && fromNode.neighbors.length > 0) {
          const toNodeIdx = fromNode.neighbors[Math.floor(Math.random() * fromNode.neighbors.length)];
          packets.push({
            currentX: fromNode.x,
            currentY: fromNode.y,
            fromNode: fromNodeIdx,
            toNode: toNodeIdx,
            progress: Math.random(),
            speed: 0.005 + Math.random() * 0.012,
            size: Math.random() * 1.5 + 1.2,
            color: getPacketColor(),
          });
        }
      }
    };

    initializeNetwork();

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = darkMode;
      
      // Render grid system
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.012)" : "rgba(15, 23, 42, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connection lines/data buses with orthogonal pathways for realistic server traffic
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(15, 23, 42, 0.06)";
      
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (const neighborIdx of n1.neighbors) {
          if (neighborIdx > i) {
            const n2 = nodes[neighborIdx];
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            // Orthogonal (Server motherboard/bus look)
            const midX = (n1.x + n2.x) / 2;
            ctx.lineTo(midX, n1.y);
            ctx.lineTo(midX, n2.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // Render packet flows along the data buses
      for (let i = 0; i < packets.length; i++) {
        const p = packets[i];
        const fromNode = nodes[p.fromNode];
        const toNode = nodes[p.toNode];

        if (!fromNode || !toNode) continue;

        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.fromNode = p.toNode;
          const neighbors = nodes[p.toNode].neighbors;
          p.toNode = neighbors.length > 0 ? neighbors[Math.floor(Math.random() * neighbors.length)] : p.fromNode;
          p.color = getPacketColor();
        }

        // Travel path follows the orthogonal route
        const midX = (fromNode.x + toNode.x) / 2;
        let x = fromNode.x;
        let y = fromNode.y;

        if (p.progress < 0.5) {
          const localProg = p.progress / 0.5;
          x = fromNode.x + (midX - fromNode.x) * localProg;
          y = fromNode.y;
        } else {
          const localProg = (p.progress - 0.5) / 0.5;
          x = midX;
          y = fromNode.y + (toNode.y - fromNode.y) * localProg;
          if (localProg > 0.5) {
            const finalProg = (localProg - 0.5) / 0.5;
            x = midX + (toNode.x - midX) * finalProg;
            y = toNode.y;
          }
        }
        
        p.currentX = x;
        p.currentY = y;

        // Draw packet node glowing head
        ctx.beginPath();
        ctx.arc(x, y, p.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Draw outer pulse glow
        ctx.beginPath();
        ctx.arc(x, y, p.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace("0.9", "0.15").replace("0.85", "0.12");
        ctx.fill();
      }

      // Draw Server hosts (Nodes) with status details
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.pulse += 0.015;
        n.ledBlink += 0.03;
        if (n.ledBlink > 1) {
          n.ledBlink = 0;
          n.ping = Math.floor(Math.random() * 25) + 5; // dynamic latency
        }

        const baseRadius = 5;
        const glowRadius = baseRadius + Math.sin(n.pulse) * 2;

        // Outer Server glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, glowRadius + 6, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(245, 158, 11, 0.02)" : "rgba(217, 119, 6, 0.03)";
        ctx.fill();

        // Main node ring
        ctx.beginPath();
        ctx.arc(n.x, n.y, baseRadius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? "rgba(245, 158, 11, 0.25)" : "rgba(217, 119, 6, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Solid inner core
        ctx.beginPath();
        ctx.arc(n.x, n.y, baseRadius - 1.5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#0f172a" : "#ffffff";
        ctx.fill();

        // LED Indicators
        const ledColor = n.status === "ACTIVE" 
          ? (n.ledBlink > 0.5 ? "rgba(16, 185, 129, 0.9)" : "rgba(5, 150, 105, 0.6)") // Flashing Green
          : n.status === "BUSY" 
            ? "rgba(245, 158, 11, 0.9)" // Stable Orange
            : "rgba(14, 165, 233, 0.8)"; // Blue standby

        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = ledColor;
        ctx.fill();

        // Draw microscopic server statistics text to represent premium live traffic logs
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillStyle = isDark ? "rgba(148, 163, 184, 0.35)" : "rgba(71, 85, 105, 0.5)";
        
        // Host name & IP labels
        ctx.fillText(n.name, n.x + 12, n.y - 2);
        ctx.font = "7px 'JetBrains Mono', monospace";
        ctx.fillStyle = isDark ? "rgba(148, 163, 184, 0.22)" : "rgba(71, 85, 105, 0.35)";
        ctx.fillText(`${n.ip} • ${n.ping}ms`, n.x + 12, n.y + 7);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  // Fetch Service Database on Load
  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoadingServices(false);
      })
      .catch((err) => {
        console.error("Error fetching services:", err);
        setLoadingServices(false);
      });
  }, []);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isAILoading]);

  // Handle Order Placement Submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    if (!orderPhone.trim() || !orderEmail.trim()) {
      showToast("Harap isi semua kolom wajib (No WhatsApp, Email)!", "error");
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          customerPhone: orderPhone,
          customerEmail: orderEmail,
          paymentMethod: orderPaymentMethod
        }),
      });

      const resData = await response.json();
      if (response.ok) {
        setCreatedOrder(resData.order);
        showToast("Pesanan berhasil dibuat! Selesaikan pembayaran Anda.");
        
        // Reset form
        setOrderName("");
        setOrderPhone("");
        setOrderEmail("");
        setOrderDevice("");
        setOrderImei("");
        setOrderNotes("");
      } else {
        showToast(resData.error || "Gagal membuat pesanan", "error");
      }
    } catch (err) {
      showToast("Terjadi kesalahan koneksi internet.", "error");
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Simulate Payment Process (Instant Callback checking)
  const handleSimulatePayment = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/pay-simulation`, {
        method: "POST"
      });
      const data = await response.json();
      if (response.ok) {
        showToast("Pembayaran BERHASIL terverifikasi otomatis! Status: DIPROSES.");
        
        // Update local views
        if (createdOrder && createdOrder.id === orderId) {
          setCreatedOrder({ ...createdOrder, paymentStatus: "Lunas", status: "Diproses" });
        }
        if (singleTrackedOrder && singleTrackedOrder.id === orderId) {
          setSingleTrackedOrder({ ...singleTrackedOrder, paymentStatus: "Lunas", status: "Diproses" });
        }
        // Refresh tracked lists if open
        setTrackedOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: "Lunas", status: "Diproses" } : o));
      } else {
        showToast(data.error || "Simulasi gagal", "error");
      }
    } catch (e) {
      showToast("Gagal memproses simulasi pembayaran", "error");
    }
  };
  
  // Handle IMEI or Serial check via Express API
  const handleCheckImei = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = imeiQuery.trim();
    if (!query) {
      setImeiError("Masukkan nomor IMEI atau Serial Number perangkat Anda.");
      return;
    }

    setIsCheckingImei(true);
    setImeiError(null);
    setImeiResult(null);

    try {
      const response = await fetch("/api/check-imei", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      if (response.ok) {
        setImeiResult(data);
      } else {
        setImeiError(data.error || "Gagal melakukan pemeriksaan IMEI.");
      }
    } catch (err) {
      setImeiError("Terjadi kesalahan koneksi saat melakukan pemeriksaan.");
    } finally {
      setIsCheckingImei(false);
    }
  };

  // Search/Track orders via Phone Number or Order ID
  const handleTrackOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackingPhone.trim() || trackingOrderId.trim();
    if (!query) {
      showToast("Masukkan ID Pesanan atau No WhatsApp terlebih dahulu!", "error");
      return;
    }

    setIsTracking(true);
    setTrackedOrders([]);
    setSingleTrackedOrder(null);

    try {
      if (query.startsWith("LC-") && query.length >= 6) {
        // Track single Order ID
        const res = await fetch(`/api/orders/${query}`);
        const data = await res.json();
        if (res.ok) {
          setSingleTrackedOrder(data);
        } else {
          showToast("Pesanan dengan ID tersebut tidak ditemukan.", "error");
        }
      } else {
        // Track by phone number
        const cleanPhone = query.replace(/[^0-9]/g, "");
        const res = await fetch(`/api/orders/track/${cleanPhone}`);
        const data = await res.json();
        if (res.ok) {
          setTrackedOrders(data);
          if (data.length === 0) {
            showToast("Tidak ada pesanan terdaftar untuk nomor WhatsApp ini.", "error");
          }
        } else {
          showToast("Gagal mencari data pelacakan.", "error");
        }
      }
    } catch (err) {
      showToast("Koneksi bermasalah saat mencari data.", "error");
    } finally {
      setIsTracking(false);
    }
  };

  // AI chatbot communication
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isAILoading) return;

    const userText = chatInput;
    setChatInput("");
    
    // Add user message to state
    const updatedMessages = [...chatMessages, { role: "user" as const, text: userText }];
    setChatMessages(updatedMessages);
    setIsAILoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });

      const resData = await response.json();
      if (response.ok) {
        setChatMessages(prev => [...prev, { role: "model", text: resData.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: "model", text: `Maaf, terjadi kendala saat menghubungkan dengan AI Server: ${resData.error}. Silakan konfigurasikan GEMINI_API_KEY Anda di menu Pengaturan / Secrets UI.` }]);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: "model", text: "Maaf, gagal mengirim pesan karena masalah koneksi jaringan internet." }]);
    } finally {
      setIsAILoading(false);
    }
  };

  // Copy text helper
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(`${label} disalin ke papan klip!`);
    setTimeout(() => setCopiedText(null), 3000);
  };

  // ADMIN DASHBOARD FUNCTIONS
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword })
      });

      const data = await response.json();
      if (response.ok) {
        setIsAdminLoggedIn(true);
        setAdminPassword("");
        showToast("Login Admin Berhasil! Memuat data panel...");
        fetchAdminData();
      } else {
        showToast(data.error || "Password Admin salah!", "error");
      }
    } catch (err) {
      showToast("Gagal melakukan verifikasi admin.", "error");
    }
  };

  const fetchAdminData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch("/api/admin/stats");
      const statsData = await statsRes.json();
      setAdminStats(statsData);

      // Fetch orders
      const ordersRes = await fetch("/api/admin/orders");
      const ordersData = await ordersRes.json();
      setAdminOrders(ordersData);

      // Fetch customers
      const custRes = await fetch("/api/admin/customers");
      const custData = await custRes.json();
      setAdminCustomers(custData);

      // Fetch settings
      const settingsRes = await fetch("/api/admin/settings");
      const settingsData = await settingsRes.json();
      setAdminSettings(settingsData);
      setSettingsToken(settingsData.whatsappToken);
      setSettingsUrl(settingsData.whatsappGatewayUrl);
      setSettingsEnabled(settingsData.whatsappNotificationEnabled);
    } catch (e) {
      showToast("Gagal mengambil data administratif dari server.", "error");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus })
      });

      if (response.ok) {
        showToast(`Pesanan ${orderId} berhasil diperbarui!`);
        fetchAdminData(); // refresh
      } else {
        showToast("Gagal memperbarui pesanan di server", "error");
      }
    } catch (e) {
      showToast("Kendala jaringan saat menyimpan status.", "error");
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappToken: settingsToken,
          whatsappGatewayUrl: settingsUrl,
          whatsappNotificationEnabled: settingsEnabled,
          newAdminPassword: newAdminPass
        })
      });

      if (response.ok) {
        showToast("Pengaturan WhatsApp & Keamanan berhasil diperbarui!");
        setNewAdminPass("");
        fetchAdminData();
      } else {
        showToast("Gagal menyimpan pengaturan.", "error");
      }
    } catch (e) {
      showToast("Gagal berkomunikasi dengan server settings.", "error");
    }
  };

  // Filter services by category and search keyword
  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === "all" || srv.category === selectedCategory;
    const matchesSearch = srv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          srv.desc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`relative min-h-screen ${darkMode ? "text-slate-200" : "text-slate-800"} selection:bg-amber-500 selection:text-black pb-24`}>
      {/* Background canvas */}
      <canvas id="bg-canvas" className="pointer-events-none fixed inset-0 z-0 opacity-65"></canvas>

      {/* TOAST SYSTEM */}
      {appNotification && (
        <div className="fixed top-5 right-5 z-50 animate-bounce max-w-sm rounded-xl p-4 shadow-2xl backdrop-blur-lg border text-sm flex items-center gap-3 bg-brand-navyCard text-white border-amber-500/30">
          <div className={`p-1.5 rounded-full ${appNotification.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
            {appNotification.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          </div>
          <div>
            <p className="font-semibold">{appNotification.type === "success" ? "Sukses" : "Pemberitahuan"}</p>
            <p className="text-xs text-slate-300">{appNotification.message}</p>
          </div>
        </div>
      )}


      {/* NAVIGATION NAVBAR */}
      <nav className="sticky top-0 z-40 bg-brand-navy/90 border-b border-white/10 shadow-lg backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <a href="#" onClick={() => setActiveTab("home")} className="text-xl font-black tracking-wider text-white flex items-center gap-3">
                <LuthfiCellLogoIcon className="w-12 h-12 drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]" />
                <div className="flex flex-col">
                  <span className="font-cyber font-black tracking-wider text-base text-brand-pureWhite leading-tight">LUTHFI CELL UNLOCKER</span>
                  <span className="text-[10px] text-brand-accent font-bold tracking-widest uppercase">Premium Unlocking & Repair Server</span>
                </div>
              </a>
            </div>

            {/* TAB SELECTORS */}
            <div className="hidden md:flex ml-10 space-x-4 font-cyber text-xs tracking-widest uppercase">
              <button 
                id="nav-home-btn"
                onClick={() => { setActiveTab("home"); setSelectedCategory("all"); }}
                className={`px-3 py-2 transition-colors cursor-pointer ${activeTab === "home" ? "text-brand-accent font-bold border-b-2 border-brand-accent" : "text-slate-300 hover:text-brand-accent"}`}
              >
                Beranda
              </button>
              <button 
                id="nav-remote-btn"
                onClick={() => { setActiveTab("remote"); setSelectedCategory("remote"); }}
                className={`px-3 py-2 transition-colors cursor-pointer ${activeTab === "remote" ? "text-brand-accent font-bold border-b-2 border-brand-accent" : "text-slate-300 hover:text-brand-accent"}`}
              >
                Remote Service
              </button>
              <button 
                id="nav-activation-btn"
                onClick={() => { setActiveTab("activation"); setSelectedCategory("activation"); }}
                className={`px-3 py-2 transition-colors cursor-pointer ${activeTab === "activation" ? "text-brand-accent font-bold border-b-2 border-brand-accent" : "text-slate-300 hover:text-brand-accent"}`}
              >
                Aktivasi Tool
              </button>
              <button 
                id="nav-rental-btn"
                onClick={() => { setActiveTab("rental"); setSelectedCategory("rental"); }}
                className={`px-3 py-2 transition-colors cursor-pointer ${activeTab === "rental" ? "text-brand-accent font-bold border-b-2 border-brand-accent" : "text-slate-300 hover:text-brand-accent"}`}
              >
                Sewa Tool
              </button>


            </div>

            {/* THEME TOGGLE BUTTON */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-brand-navyCard border border-white/10 text-slate-300 hover:text-brand-accent hover:border-brand-accent transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md"
              title={darkMode ? "Ubah ke Mode Terang" : "Ubah ke Mode Gelap"}
              id="theme-toggle-btn"
            >
              {darkMode ? (
                <span className="flex items-center gap-1.5 text-xs font-cyber font-bold tracking-wider uppercase">
                  <Sun size={14} className="text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">TERANG</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-cyber font-bold tracking-wider uppercase">
                  <Moon size={14} className="text-indigo-500 animate-pulse" />
                  <span className="hidden sm:inline">GELAP</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO HERO HERO HERO */}
      {activeTab === "home" && (
        <section id="home-section" className="relative z-10 pt-10 pb-12 sm:pt-16 sm:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-brand-navyCard text-brand-accent border border-amber-500/30 tracking-widest uppercase font-cyber">
                  Service, Repair & Shop • Premium Class
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-cyber font-black text-brand-pureWhite tracking-tight leading-tight uppercase">
                  Solusi Repair Smartphone <br className="hidden sm:inline" />
                  <span className="gold-glow-text">GSM Server Professional</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium tracking-wide">
                  Jasa aktivasi resmi tool premium, penyewaan tool harian, serta layanan remote service tercepat langsung ditangani tim spesialis terpercaya dari Madura, Jawa Timur. Dilengkapi dengan pembayaran otomatis, integrasi status, dan asisten AI pintar.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                  <button 
                    onClick={() => { setActiveTab("remote"); setSelectedCategory("all"); }}
                    className="px-6 py-3.5 rounded-xl text-xs font-cyber font-bold bg-brand-navyCard hover:bg-brand-navy text-brand-pureWhite border border-white/10 hover:border-brand-accent transition-all tracking-widest uppercase cursor-pointer"
                  >
                    Lihat Layanan Remote
                  </button>
                  <button 
                    onClick={() => setChatOpen(true)}
                    className="px-6 py-3.5 rounded-xl text-xs font-cyber font-bold bg-brand-accent text-black hover:bg-amber-400 transition-all flex items-center gap-2 tracking-widest uppercase shadow-lg shadow-amber-500/10 hover:scale-105 cursor-pointer"
                  >
                    <Sparkles size={14} /> Tanya Luthfi AI
                  </button>
                </div>
              </div>
              
              {/* REPLICATED LOGO CARD */}
              <div className="lg:col-span-5 flex flex-col justify-center items-center">
                <div className="bg-brand-navyCard/80 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 shadow-2xl w-full max-w-xs transition-transform duration-500 hover:scale-105">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <LuthfiCellLogoIcon className="w-32 h-32 drop-shadow-[0_4px_16px_rgba(245,158,11,0.35)]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-cyber font-black text-brand-pureWhite tracking-widest uppercase">LUTHFI CELL UNLOCKER</h3>
                    <div className="bg-brand-navy border border-amber-500/40 px-4 py-1.5 rounded">
                      <p className="text-[10px] font-cyber font-bold text-brand-accent tracking-widest uppercase">PREMIUM UNLOCKING & REPAIR SERVER</p>
                    </div>
                    <p className="text-xs text-slate-400 font-bold tracking-widest uppercase pt-1">Madura, Jawa Timur</p>
                    
                    {/* Social Media Links inside logo card */}
                    <div className="flex justify-center gap-4 pt-3 border-t border-white/5 w-full">
                      <a href="https://www.facebook.com/share/1EES6LzgBQ/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-accent transition-colors" title="Facebook">
                        <Facebook size={18} />
                      </a>
                      <a href="https://wa.me/6287840200308" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-emerald-400 transition-colors" title="WhatsApp">
                        <Smartphone size={18} />
                      </a>
                      <a href="https://www.tiktok.com/@luthfi_cell01?_r=1&_t=ZS-97SXErWN0UR" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-accent transition-colors" title="TikTok">
                        <TiktokIcon size={18} />
                      </a>
                      <a href="https://www.instagram.com/luthficelluler?igsh=MWVmbGFzcGY1aDBkdg%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-brand-accent transition-colors" title="Instagram">
                        <Instagram size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>



          </div>
        </section>
      )}

      {/* RENDER ACTIVE TRACK PANEL DIRECTLY FOR CLEAR USER SATISFACTION */}
      {createdOrder && (
        <section id="instant-checkout-status-panel" className="relative z-10 max-w-4xl mx-auto px-4 mb-12">
          <div className="bg-brand-navyCard border-2 border-brand-accent rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <span className="px-3 py-1 rounded-md text-[10px] font-cyber tracking-widest bg-amber-500/10 text-brand-accent border border-brand-accent/20">PEMESANAN BERHASIL</span>
                <h2 className="text-xl sm:text-2xl font-cyber font-black text-white mt-1 uppercase">ID PESANAN: {createdOrder.id}</h2>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCreatedOrder(null)}
                  className="px-4 py-2 text-xs border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer font-semibold uppercase tracking-wider"
                >
                  Tutup Tampilan
                </button>
              </div>
            </div>

            {/* STUNNING INTERACTIVE TIMELINE */}
            <RepairProgressTimeline status={createdOrder.status} paymentStatus={createdOrder.paymentStatus} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* DETAILS COLUMN */}
              <div className="space-y-4">
                <h3 className="text-sm font-cyber font-bold text-brand-pureWhite tracking-wide border-b border-white/5 pb-2">DETAIL TRANSAKSI</h3>
                <div className="grid grid-cols-2 gap-y-3 text-xs">
                  <span className="text-slate-400">Layanan:</span>
                  <span className="font-semibold text-white">{createdOrder.serviceName}</span>
                  
                  <span className="text-slate-400">Nama Pelanggan:</span>
                  <span className="font-semibold text-white">{createdOrder.customerName}</span>
                  
                  <span className="text-slate-400">No WhatsApp:</span>
                  <span className="font-semibold text-white">{createdOrder.customerPhone}</span>
                  
                  <span className="text-slate-400">Device / IMEI:</span>
                  <span className="font-mono text-amber-400">{createdOrder.deviceType} / {createdOrder.imeiOrSerial}</span>
                  
                  <span className="text-slate-400">Total Harga:</span>
                  <span className="font-cyber font-bold text-brand-accent text-sm">Tanya Admin via WA</span>
                  
                  <span className="text-slate-400">Status Pembayaran:</span>
                  <span className={`inline-flex items-center gap-1 font-semibold ${createdOrder.paymentStatus === "Lunas" ? "text-emerald-400" : "text-rose-400"}`}>
                    {createdOrder.paymentStatus === "Lunas" ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {createdOrder.paymentStatus}
                  </span>
                  
                  <span className="text-slate-400">Status Kerja:</span>
                  <span className="font-cyber font-bold text-brand-accent">{createdOrder.status.toUpperCase()}</span>
                </div>

                <div className="bg-brand-navy p-3.5 rounded-lg border border-white/5 mt-4">
                  <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle size={12} className="text-brand-accent" /> ALUR PEMBAYARAN:
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Sistem Luthfi Cell mendukung pembayaran langsung via Chat ke WhatsApp admin. Silakan hubungi admin LU_TEAM melalui link di sebelah kanan untuk mendapatkan detail nomor rekening tujuan transfer atau QRIS personal, serta melakukan konfirmasi bukti transfer agar pengerjaan segera dimulai secara instan.
                  </p>
                </div>
              </div>

              {/* WHATSAPP DIRECT PAYMENT COLUMN */}
              <div className="bg-brand-navy/90 border border-emerald-500/30 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400">
                  <Smartphone size={32} />
                </div>
                
                <h4 className="text-xs font-cyber font-bold tracking-widest text-emerald-400 uppercase">HUBUNGI WHATSAPP UNTUK BAYAR</h4>
                
                <p className="text-[11px] text-slate-300 leading-relaxed max-w-xs">
                  Silakan klik tombol hijau di bawah untuk langsung terhubung ke WhatsApp operator LU_TEAM dengan format order otomatis.
                </p>

                <a 
                  href={`https://wa.me/6287840200308?text=Halo%20Luthfi%20Cell%20(LU_TEAM),%20saya%20sudah%20melakukan%20order%20di%20website.%0A%0ADetail%20Pesanan%3A%0A-%20ID%20Pesanan%3A%20*${createdOrder.id}*%0A-%20Layanan%3A%20*${encodeURIComponent(createdOrder.serviceName)}*%0A-%20Nama%20Pelanggan%3A%20*${encodeURIComponent(createdOrder.customerName)}*%0A-%20No%20WhatsApp%3A%20*${encodeURIComponent(createdOrder.customerPhone)}*%0A-%20Harga%3A%20*Tanya%20Harga%20ke%20Admin*%0A%0AMohon%20petunjuk%20selanjutnya.`}
                  target="_blank" 
                  rel="referrer"
                  className="w-full py-3 px-4 rounded-xl text-xs font-cyber font-bold bg-emerald-500 hover:bg-emerald-400 text-black uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-102 font-bold"
                >
                  <Smartphone size={14} />
                  Kirim Detail Ke WhatsApp
                </a>

                {createdOrder.paymentStatus === "Belum Bayar" ? (
                  <div className="w-full pt-2 border-t border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5">SIMULASI VERIFIKASI DEMO</p>
                    <button
                      onClick={() => handleSimulatePayment(createdOrder.id)}
                      className="w-full py-2 px-3 rounded-lg text-[10px] font-cyber font-bold bg-white/5 hover:bg-white/10 text-slate-300 uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw size={10} className="animate-spin text-brand-accent" />
                      Simulasikan Verifikasi Bayar Lunas
                    </button>
                  </div>
                ) : (
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/20 py-3 rounded-xl text-emerald-400 text-xs font-cyber font-bold flex items-center justify-center gap-2 uppercase tracking-wide">
                    <CheckCircle size={14} /> PEMBAYARAN TELAH SELESAI
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

           {/* MAIN SERVICE DIRECTORY SECTION */}
      {activeTab !== "track" && activeTab !== "guide" && (
        <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="space-y-8">
            
            {/* LEFT: PRODUCTS BROWSER & LISTS */}
            <div className="space-y-6">
              
              {/* FILTERING CONTROLS */}
              <div className="bg-brand-navyCard/60 border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* SEARCH INPUT */}
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Cari remote, tool flashing..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-navy/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-accent"
                  />
                  <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                </div>

                {/* DIRECT CATEGORY SELECTORS */}
                <div className="flex flex-wrap justify-center gap-2 text-xs font-cyber tracking-widest uppercase">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${selectedCategory === "all" ? "bg-brand-accent text-black border-brand-accent font-bold" : "border-white/10 text-slate-300 hover:text-white"}`}
                  >
                    Semua
                  </button>
                  <button
                    onClick={() => setSelectedCategory("remote")}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${selectedCategory === "remote" ? "bg-brand-accent text-black border-brand-accent font-bold" : "border-white/10 text-slate-300 hover:text-white"}`}
                  >
                    Remote Service
                  </button>
                  <button
                    onClick={() => setSelectedCategory("activation")}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${selectedCategory === "activation" ? "bg-brand-accent text-black border-brand-accent font-bold" : "border-white/10 text-slate-300 hover:text-white"}`}
                  >
                    Aktivasi Tool
                  </button>
                  <button
                    onClick={() => setSelectedCategory("rental")}
                    className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${selectedCategory === "rental" ? "bg-brand-accent text-black border-brand-accent font-bold" : "border-white/10 text-slate-300 hover:text-white"}`}
                  >
                    Sewa Tool
                  </button>
                </div>
              </div>

              {/* SERVICE ITEM GRID */}
              {loadingServices ? (
                <div className="text-center py-20 bg-brand-navyCard/30 rounded-2xl border border-white/5 space-y-4">
                  <RefreshCw className="animate-spin text-brand-accent mx-auto" size={28} />
                  <p className="text-xs font-cyber tracking-wider uppercase text-slate-400">Sedang memuat daftar layanan server...</p>
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="text-center py-20 bg-brand-navyCard/30 rounded-2xl border border-white/5 space-y-2">
                  <AlertCircle className="text-amber-500 mx-auto" size={32} />
                  <p className="text-sm font-cyber tracking-wider uppercase text-white">Layanan tidak ditemukan</p>
                  <p className="text-xs text-slate-400">Gunakan kata kunci pencarian yang lain atau konsultasi dengan AI kami.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {(["remote", "activation", "rental"] as const)
                    .filter((cat) => selectedCategory === "all" || selectedCategory === cat)
                    .map((cat) => {
                      const catServices = filteredServices.filter((s) => s.category === cat);
                      if (catServices.length === 0) return null;

                      let catTitle = "";
                      let catSubtitle = "";
                      let catIcon = "📡";

                      if (cat === "remote") {
                        catTitle = "LAYANAN REMOTE JARAK JAUH (REMOTE SERVICE)";
                        catSubtitle = "Layanan perbaikan software, bypass, UBL, dan pengerjaan remote via USB Redirector / TeamViewer.";
                        catIcon = "📡";
                      } else if (cat === "activation") {
                        catTitle = "AKTIVASI LISENSI & KREDIT (ACTIVATION TOOL)";
                        catSubtitle = "Aktivasi masa aktif tool flashing, skema perbaikan, serta pembelian credit server resmi.";
                        catIcon = "🔑";
                      } else if (cat === "rental") {
                        catTitle = "SEWA TOOL FLASHING HARIAN (RENTAL TOOL)";
                        catSubtitle = "Sewa tool flashing harian murah via remote sharing pc dengan login server aman.";
                        catIcon = "💻";
                      }

                      return (
                        <div key={cat} className="space-y-6">
                          {/* Category Header */}
                          <div className="border-b border-white/10 pb-3">
                            <h3 className="text-base font-cyber font-black tracking-widest uppercase text-brand-pureWhite flex items-center gap-2">
                              <span className="text-brand-accent text-lg">{catIcon}</span> {catTitle}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">{catSubtitle}</p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {catServices.map((srv) => (
                              <div 
                                key={srv.id} 
                                className="server-card rounded-xl overflow-hidden flex flex-col justify-between shadow-lg border border-white/10"
                              >
                                <div className="p-5 space-y-3">
                                  <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 rounded-lg bg-brand-navy border border-white/10 flex items-center justify-center text-lg text-brand-accent">
                                      {renderServiceIcon(srv.icon)}
                                    </div>
                                    <span className="px-2.5 py-0.5 rounded text-[9px] font-cyber tracking-wider font-semibold bg-brand-navy border border-white/15 text-slate-400 uppercase">
                                      {srv.category === "remote" ? "Remote Jarak Jauh" : srv.category === "activation" ? "Aktivasi Lisensi" : "Sewa Harian"}
                                    </span>
                                  </div>
                                  
                                  <h3 className="text-sm font-cyber font-black text-brand-pureWhite tracking-wide uppercase">{srv.name}</h3>
                                  <p className="text-xs text-slate-400 font-medium tracking-wide leading-relaxed">{srv.desc}</p>
                                </div>

                                <div className="p-5 pt-0 mt-auto space-y-3">
                                  <div className="flex items-center justify-between bg-brand-navy/95 rounded-lg px-3 py-2 border border-white/5">
                                    <div className="flex flex-col">
                                      <span className="text-[9px] font-cyber text-slate-500 font-bold tracking-wider">{srv.type.toUpperCase()}</span>
                                      <span className="text-xs font-cyber font-bold text-brand-accent">{srv.estTime}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[9px] font-cyber text-slate-500 font-bold tracking-wider block">HARGA</span>
                                      <span className="text-xs font-cyber font-bold text-brand-accent">Tanya Admin via WA</span>
                                    </div>
                                  </div>

                                  <a
                                    href={`https://wa.me/6287840200308?text=Halo%20Luthfi%20Cell%20(LU_TEAM),%20saya%20ingin%20memesan%20layanan%20berikut%3A%0A%0A-%20Nama%20Layanan%3A%20*${encodeURIComponent(srv.name)}*%0A-%20Kategori%3A%20*${encodeURIComponent(srv.category === "remote" ? "Remote Jarak Jauh" : srv.category === "activation" ? "Aktivasi Lisensi" : "Sewa Harian")}*%0A-%20Estimasi%20Waktu%3A%20*${encodeURIComponent(srv.estTime)}*%0A%0AMohon%20informasi%20harga%20terbaru%20dan%20petunjuk%20selanjutnya.%20Terima%20kasih!`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full py-2.5 rounded-lg bg-brand-accent text-brand-navy text-xs font-cyber font-bold hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 uppercase tracking-widest cursor-pointer"
                                  >
                                    <CreditCard size={12} /> Pilih & Pesan Jasa
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

          </div>
        </section>
      )}


      {/* TRACKING ORDERS TAB SECTION */}
      {false && (
        <section className="relative z-10 max-w-4xl mx-auto px-4 mt-6">
          <div className="bg-brand-navyCard border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Header */}
            <div className="border-b border-white/10 pb-4 text-center sm:text-left">
              <h2 className="text-2xl font-cyber font-black tracking-widest uppercase text-brand-pureWhite">PELACAKAN PESANAN REAL-TIME</h2>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Cari transaksi Anda berdasarkan ID Pesanan unik atau No WhatsApp terdaftar.</p>
            </div>

            {/* Inputs Form */}
            <form onSubmit={handleTrackOrders} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-5 space-y-1">
                <label className="text-xs text-slate-300 font-medium uppercase font-cyber tracking-wider">No WhatsApp Pelanggan</label>
                <input
                  type="text"
                  placeholder="Contoh: 087840200308"
                  value={trackingPhone}
                  onChange={(e) => {
                    setTrackingPhone(e.target.value);
                    setTrackingOrderId(""); // Clear other input
                  }}
                  className="w-full text-xs bg-brand-navy border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div className="sm:col-span-2 text-center text-slate-500 font-cyber font-bold text-xs uppercase py-2">
                ATAU
              </div>
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs text-slate-300 font-medium uppercase font-cyber tracking-wider">ID Pesanan Unik</label>
                <input
                  type="text"
                  placeholder="Contoh: LC-54123"
                  value={trackingOrderId}
                  onChange={(e) => {
                    setTrackingOrderId(e.target.value.toUpperCase());
                    setTrackingPhone(""); // Clear other input
                  }}
                  className="w-full text-xs bg-brand-navy border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-accent"
                />
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isTracking}
                  className="w-full py-3.5 rounded-xl text-xs font-cyber font-bold bg-brand-accent text-brand-navy hover:bg-amber-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isTracking ? <RefreshCw className="animate-spin" size={14} /> : <Search size={14} />}
                  LACAK
                </button>
              </div>
            </form>

            {/* TRACKED SINGLE ORDER DETAIL RENDERING */}
            {singleTrackedOrder && (
              <div className="border border-amber-500/30 rounded-xl p-5 bg-brand-navy/90 space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-3">
                  <div>
                    <h3 className="text-sm font-cyber font-bold text-white uppercase flex items-center gap-2">
                      <CheckCircle size={16} className="text-brand-accent" />
                      ID Pesanan: {singleTrackedOrder.id}
                    </h3>
                    <p className="text-[11px] text-slate-400">Dibuat pada: {new Date(singleTrackedOrder.timestamp).toLocaleString("id-ID")}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded text-[10px] font-cyber font-bold uppercase ${
                      singleTrackedOrder.paymentStatus === "Lunas" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                    }`}>
                      Pembayaran: {singleTrackedOrder.paymentStatus}
                    </span>
                    <span className={`px-3 py-1 rounded text-[10px] font-cyber font-bold uppercase ${
                      singleTrackedOrder.status === "Selesai" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" : 
                      singleTrackedOrder.status === "Dibatalkan" ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" : "bg-amber-500/15 text-brand-accent border border-amber-500/30"
                    }`}>
                      Pengerjaan: {singleTrackedOrder.status}
                    </span>
                  </div>
                </div>

                {/* STUNNING INTERACTIVE TIMELINE */}
                <RepairProgressTimeline status={singleTrackedOrder.status} paymentStatus={singleTrackedOrder.paymentStatus} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-xs">
                    <h4 className="text-[11px] font-cyber font-bold text-slate-400 uppercase tracking-wider">Spesifikasi Detail Jasa</h4>
                    <p className="text-slate-300">Layanan: <strong className="text-white">{singleTrackedOrder.serviceName}</strong></p>
                    <p className="text-slate-300">Model HP: <strong className="text-white">{singleTrackedOrder.deviceType}</strong></p>
                    <p className="text-slate-300">IMEI/Serial: <strong className="font-mono text-amber-300">{singleTrackedOrder.imeiOrSerial}</strong></p>
                    <p className="text-slate-300">Harga: <strong className="text-brand-accent font-bold">Tanya Admin via WA</strong></p>
                    {singleTrackedOrder.notes && (
                      <p className="text-slate-400 italic">Catatan: "{singleTrackedOrder.notes}"</p>
                    )}
                  </div>

                  <div className="bg-brand-navy border border-white/5 p-4 rounded-lg flex flex-col justify-center space-y-3">
                    {singleTrackedOrder.paymentStatus === "Belum Bayar" ? (
                      <div className="space-y-3">
                        <p className="text-[11px] text-rose-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle size={12} /> MENUNGGU PEMBAYARAN:
                        </p>
                        <p className="text-[11px] text-slate-300">
                          Sistem mendeteksi tagihan Anda belum diselesaikan. Gunakan simulasi di bawah untuk verifikasi pembayaran real-time instan otomatis.
                        </p>
                        <button
                          onClick={() => handleSimulatePayment(singleTrackedOrder.id)}
                          className="w-full py-2.5 rounded-lg text-xs font-cyber font-bold bg-emerald-500 hover:bg-emerald-400 text-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                        >
                          Simulasikan Verifikasi Bayar
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 text-center py-3">
                        <CheckCircle size={24} className="text-emerald-400 mx-auto" />
                        <h4 className="text-xs font-cyber font-bold text-emerald-400 uppercase tracking-widest">PEMBAYARAN LUNAS</h4>
                        <p className="text-[11px] text-slate-300 max-w-xs mx-auto">
                          Teknisi kami sedang melakukan remote/unlocking dengan estimasi pengerjaan <strong className="text-brand-accent">{singleTrackedOrder.estTime}</strong>. Hubungi WhatsApp untuk update detail login atau petunjuk remote.
                        </p>
                      </div>
                    )}
                    <a 
                      href={`https://wa.me/6287840200308?text=Halo%20LU_TEAM,%20saya%20ingin%20bertanya%20mengenai%20ID%20Pesanan%20${singleTrackedOrder.id}`}
                      target="_blank" 
                      rel="referrer"
                      className="w-full py-2 rounded-lg bg-brand-navy border border-amber-500/30 hover:bg-amber-500/10 text-brand-accent text-xs font-cyber font-bold uppercase text-center flex items-center justify-center gap-1"
                    >
                      Hubungi Operator LU_TEAM
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TRACKED ORDERS LIST RENDER (BY PHONE) */}
            {trackedOrders.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-cyber font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-2 flex items-center gap-2">
                  <History size={16} className="text-brand-accent" />
                  Daftar Riwayat Pesanan ({trackedOrders.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-brand-navy text-slate-400 uppercase font-cyber font-bold text-[10px] tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-3">ID Pesanan</th>
                        <th className="p-3">Layanan</th>
                        <th className="p-3">Device Details</th>
                        <th className="p-3 text-right">Harga</th>
                        <th className="p-3">Pembayaran</th>
                        <th className="p-3">Status Kerja</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {trackedOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3 font-cyber font-bold text-white">{ord.id}</td>
                          <td className="p-3 font-semibold">{ord.serviceName}</td>
                          <td className="p-3 font-mono">{ord.deviceType} / {ord.imeiOrSerial}</td>
                          <td className="p-3 text-right font-cyber font-bold text-brand-accent">Tanya Admin</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${ord.paymentStatus === "Lunas" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                              {ord.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-cyber font-bold ${
                              ord.status === "Selesai" ? "bg-emerald-500/10 text-emerald-400" : 
                              ord.status === "Dibatalkan" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-brand-accent"
                            }`}>
                              {ord.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                setSingleTrackedOrder(ord);
                                setTrackedOrders([]);
                              }}
                              className="px-3 py-1 rounded bg-brand-navy border border-amber-500/30 hover:border-brand-accent text-brand-accent hover:text-white transition-colors text-[10px] font-cyber font-bold cursor-pointer"
                            >
                              Detail Jasa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* INTERACTIVE PANDUAN & DRIVER TAB */}
      {false && (
        <section id="guide-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="space-y-8">
            {/* Title Header */}
            <div className="bg-brand-navyCard/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <span className="px-3 py-1 rounded-md text-[10px] font-cyber tracking-widest bg-amber-500/10 text-brand-accent border border-brand-accent/20">GSM RESOURCES</span>
                  <h2 className="text-2xl sm:text-3xl font-cyber font-black tracking-widest uppercase text-brand-pureWhite">PANDUAN REMOTE & DRIVER DIRECTORY</h2>
                  <p className="text-xs text-slate-400 max-w-2xl">Pusat panduan lengkap koneksi remote usb port redirector, instalasi driver smartphone terlengkap, serta pemecahan masalah (troubleshooting) untuk teknisi handal.</p>
                </div>
                <div className="w-16 h-16 bg-brand-navy border border-amber-500/30 rounded-2xl flex items-center justify-center text-brand-accent shadow-lg shadow-amber-500/10">
                  <Wrench size={32} />
                </div>
              </div>
            </div>

            {/* Step-by-Step Stepper */}
            <div className="bg-brand-navyCard/60 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <h3 className="text-sm font-cyber font-bold tracking-widest text-brand-pureWhite uppercase border-b border-white/5 pb-2 flex items-center gap-2">
                <Layers size={16} className="text-brand-accent" /> ALUR PROSES REMOTE SERVICE (3 LANGKAH MUDAH)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Step 1 */}
                <div className="bg-brand-navy/60 border border-white/5 p-5 rounded-xl flex flex-col justify-between space-y-3 group hover:border-amber-500/20 transition-all duration-300">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-cyber font-bold text-brand-accent tracking-widest uppercase bg-amber-500/15 px-2 py-0.5 rounded">LANGKAH 01</span>
                      <Download size={16} className="text-slate-500 group-hover:text-brand-accent transition-colors" />
                    </div>
                    <h4 className="text-xs font-cyber font-bold text-white uppercase">Download & Pasang Driver</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Unduh driver yang sesuai dengan chipset HP Anda (Qualcomm, MediaTek, atau Samsung) dari daftar di bawah. Install driver ke PC Windows Anda agar port HP terdeteksi dengan sempurna.</p>
                  </div>
                  <a href="#driver-table" className="text-[10px] font-cyber font-bold text-brand-accent hover:underline flex items-center gap-1 uppercase tracking-wider">
                    Lihat Driver <ChevronRight size={10} />
                  </a>
                </div>

                {/* Step 2 */}
                <div className="bg-brand-navy/60 border border-white/5 p-5 rounded-xl flex flex-col justify-between space-y-3 group hover:border-emerald-500/20 transition-all duration-300">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-cyber font-bold text-emerald-400 tracking-widest uppercase bg-emerald-500/15 px-2 py-0.5 rounded">LANGKAH 02</span>
                      <Zap size={16} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h4 className="text-xs font-cyber font-bold text-white uppercase">Install USB Redirector</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Download dan install program **USB Redirector Client v1.9.7** (atau TeamViewer / AnyDesk). Program ini berfungsi sebagai jembatan virtual untuk menghubungkan port USB HP Anda langsung ke komputer teknisi Luthfi Cell.</p>
                  </div>
                  <a href="#redirector-download" className="text-[10px] font-cyber font-bold text-emerald-400 hover:underline flex items-center gap-1 uppercase tracking-wider">
                    Download Jembatan USB <ChevronRight size={10} />
                  </a>
                </div>

                {/* Step 3 */}
                <div className="bg-brand-navy/60 border border-white/5 p-5 rounded-xl flex flex-col justify-between space-y-3 group hover:border-sky-500/20 transition-all duration-300">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-cyber font-bold text-sky-400 tracking-widest uppercase bg-sky-500/15 px-2 py-0.5 rounded">LANGKAH 03</span>
                      <Smartphone size={16} className="text-slate-500 group-hover:text-sky-400 transition-colors" />
                    </div>
                    <h4 className="text-xs font-cyber font-bold text-white uppercase">Hubungkan & Colok HP</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">Buka USB Redirector Client, masukkan alamat IP Server Luthfi Cell (akan diberikan oleh Admin). Matikan HP, lalu colokkan kabel USB sambil menahan tombol **Volume Atas + Bawah** (atau sesuai petunjuk chipset). Informasikan ke Admin via WA!</p>
                  </div>
                  <a href="https://wa.me/6287840200308" target="_blank" rel="noreferrer" className="text-[10px] font-cyber font-bold text-sky-400 hover:underline flex items-center gap-1 uppercase tracking-wider">
                    Chat Admin WA <ChevronRight size={10} />
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* LEFT: DRIVER DOWNLOAD TABLE (8 Cols) */}
              <div id="driver-table" className="lg:col-span-8 bg-brand-navyCard/60 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-sm font-cyber font-bold tracking-widest text-brand-pureWhite uppercase flex items-center gap-2">
                      <Package size={16} className="text-brand-accent" /> DIREKTORI DRIVER & UTILITY SMARTPHONE
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">Unduh kumpulan driver resmi dan utilitas remote desktop teruji 100% aman.</p>
                  </div>
                  <span className="text-[10px] font-cyber font-bold text-brand-accent bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 self-start sm:self-auto uppercase tracking-wider">OFFICIAL RELEASES</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-brand-navy text-slate-400 font-cyber font-bold text-[10px] tracking-widest uppercase border-b border-white/10">
                      <tr>
                        <th className="p-3">Nama Driver / Software</th>
                        <th className="p-3">Chipset / Kompatibilitas</th>
                        <th className="p-3">Ukuran</th>
                        <th className="p-3 text-right">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {/* Driver 1 */}
                      <tr id="redirector-download" className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-white block">USB Redirector Client v1.9.7</span>
                          <span className="text-[10px] text-brand-accent font-semibold">Wajib Untuk Remote Service USB</span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 font-medium">Bypass USB Port Sharing (All Brands)</td>
                        <td className="p-3 text-slate-400 font-mono">2.8 MB</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => window.open("https://www.google.com/search?q=USB+Redirector+Client+1.9.7+download", "_blank")}
                            className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-cyber font-bold uppercase tracking-wider flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Download size={10} /> Link
                          </button>
                        </td>
                      </tr>

                      {/* Driver 2 */}
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-white block">MediaTek (MTK) All-in-One Driver</span>
                          <span className="text-[10px] text-slate-400 block">Sangat penting untuk bypass chipset MTK</span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 font-medium">Vivo, Oppo, Xiaomi, Realme, Infinix</td>
                        <td className="p-3 text-slate-400 font-mono">18.5 MB</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => window.open("https://www.google.com/search?q=MediaTek+All-in-One+USB+Driver+download", "_blank")}
                            className="px-3 py-1.5 rounded bg-brand-navy border border-white/10 hover:border-brand-accent text-slate-300 hover:text-white text-[10px] font-cyber font-bold uppercase tracking-wider flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Download size={10} /> Link
                          </button>
                        </td>
                      </tr>

                      {/* Driver 3 */}
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-white block">Qualcomm HS-USB QDLoader 9008 Driver</span>
                          <span className="text-[10px] text-slate-400 block">Untuk flashing mode EDL 9008</span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 font-medium">Semua HP Android berchipset Snapdragon</td>
                        <td className="p-3 text-slate-400 font-mono">12.1 MB</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => window.open("https://www.google.com/search?q=Qualcomm+QDLoader+9008+Driver+download", "_blank")}
                            className="px-3 py-1.5 rounded bg-brand-navy border border-white/10 hover:border-brand-accent text-slate-300 hover:text-white text-[10px] font-cyber font-bold uppercase tracking-wider flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Download size={10} /> Link
                          </button>
                        </td>
                      </tr>

                      {/* Driver 4 */}
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-white block">Samsung Android USB Driver v1.7.59</span>
                          <span className="text-[10px] text-slate-400 block">Untuk FRP bypass MTP / Odin Flashing</span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 font-medium">Semua tipe HP Samsung (Android)</td>
                        <td className="p-3 text-slate-400 font-mono">35.4 MB</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => window.open("https://www.google.com/search?q=Samsung+Android+USB+Driver+v1.7.59+download", "_blank")}
                            className="px-3 py-1.5 rounded bg-brand-navy border border-white/10 hover:border-brand-accent text-slate-300 hover:text-white text-[10px] font-cyber font-bold uppercase tracking-wider flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Download size={10} /> Link
                          </button>
                        </td>
                      </tr>

                      {/* Driver 5 */}
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-white block">Unisoc SPD Driver v2.0.1</span>
                          <span className="text-[10px] text-slate-400 block">Untuk chipset Unisoc / Spreadtrum</span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 font-medium">Infinix Smart, Realme C Series, Itel</td>
                        <td className="p-3 text-slate-400 font-mono">9.8 MB</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => window.open("https://www.google.com/search?q=Unisoc+SPD+USB+Driver+download", "_blank")}
                            className="px-3 py-1.5 rounded bg-brand-navy border border-white/10 hover:border-brand-accent text-slate-300 hover:text-white text-[10px] font-cyber font-bold uppercase tracking-wider flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <Download size={10} /> Link
                          </button>
                        </td>
                      </tr>

                      {/* Utility 1 */}
                      <tr className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <span className="font-bold text-white block">AnyDesk Remote Desktop</span>
                          <span className="text-[10px] text-slate-400 block">Untuk bantuan remote komputer langsung</span>
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 font-medium">Semua Windows / Mac OS PC</td>
                        <td className="p-3 text-slate-400 font-mono">4.1 MB</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => window.open("https://anydesk.com/en/downloads", "_blank")}
                            className="px-3 py-1.5 rounded bg-brand-navy border border-white/10 hover:border-brand-accent text-slate-300 hover:text-white text-[10px] font-cyber font-bold uppercase tracking-wider flex items-center gap-1 ml-auto cursor-pointer"
                          >
                            <ExternalLink size={10} /> Resmi
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Driver Signature Guide Info */}
                <div className="bg-brand-navy p-4 rounded-xl border border-white/5 space-y-2 mt-4">
                  <h4 className="text-xs font-cyber font-bold text-brand-accent uppercase flex items-center gap-1">
                    <ShieldAlert size={14} /> TIPS PENTING: DISABLE DRIVER SIGNATURE ENFORCEMENT
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Pada Windows 10 & 11, driver ponsel MTK atau Qualcomm yang tidak ditandatangani digital terkadang ditolak oleh sistem, menyebabkan HP gagal terdeteksi atau muncul tanda seru kuning di Device Manager.
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium">
                    <strong>Cara disable:</strong> Tahan tombol <code>Shift</code> pada keyboard Anda sambil mengklik <code>Restart</code> di menu Windows Start &gt; pilih <code>Troubleshoot</code> &gt; <code>Advanced Options</code> &gt; <code>Startup Settings</code> &gt; klik <code>Restart</code> &gt; setelah PC booting ulang, tekan tombol angka <code>7</code> (Disable Driver Signature Enforcement).
                  </p>
                </div>
              </div>

              {/* RIGHT: INTERACTIVE DIAGNOSTIC (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-brand-navyCard/60 border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
                  <div className="border-b border-white/5 pb-3">
                    <h3 className="text-sm font-cyber font-bold tracking-widest text-brand-pureWhite uppercase flex items-center gap-2">
                      <Sparkles size={16} className="text-brand-accent animate-pulse" /> DIAGNOSTIK KASUS HP
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1">Cek rekomendasi solusi, jenis driver, dan alat yang tepat untuk HP bermasalah Anda.</p>
                  </div>

                  {/* Form Selection */}
                  <div className="space-y-4 text-xs">
                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">1. Pilih Merk Smartphone</label>
                      <select 
                        value={diagBrand}
                        onChange={(e) => { setDiagBrand(e.target.value); setDiagProblem(""); }}
                        className="w-full bg-brand-navy border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-accent text-xs font-semibold cursor-pointer"
                      >
                        <option value="">-- Pilih Merk --</option>
                        <option value="Xiaomi">Xiaomi / Poco</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Oppo">Oppo / Realme</option>
                        <option value="Vivo">Vivo</option>
                        <option value="Infinix">Infinix / Tecno / Itel</option>
                        <option value="iPhone">iPhone / iPad</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold uppercase tracking-wider text-[10px]">2. Jenis Kerusakan / Kasus</label>
                      <select 
                        value={diagProblem}
                        onChange={(e) => setDiagProblem(e.target.value)}
                        className="w-full bg-brand-navy border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-accent text-xs font-semibold cursor-pointer"
                        disabled={!diagBrand}
                      >
                        <option value="">-- Pilih Kasus --</option>
                        <option value="frp">Lupa Akun Google (FRP Bypass)</option>
                        {diagBrand === "Xiaomi" && <option value="micloud">Terkunci Mi Cloud (Mi ID Lock)</option>}
                        {diagBrand !== "iPhone" && <option value="mdm">Terkunci MDM / Finance Plus / Paylater</option>}
                        <option value="bootloop">Mati Total / Softbrick / Bootloop (Butuh Flashing)</option>
                        {diagBrand !== "iPhone" && <option value="signal">Sinyal Terblokir / Hilang Jaringan</option>}
                        {diagBrand === "iPhone" && <option value="icloud">Terkunci iCloud (Activation Lock)</option>}
                      </select>
                    </div>
                  </div>

                  {/* Diagnostic Result */}
                  {diagBrand && diagProblem ? (
                    <div className="bg-brand-navy/80 border border-amber-500/30 rounded-xl p-4 space-y-4 animate-fade-in">
                      <div className="space-y-1">
                        <span className="text-[9px] font-cyber font-bold text-brand-accent bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider">HASIL REKOMENDASI DIAGNOSTIK</span>
                        <h4 className="text-xs font-cyber font-bold text-white uppercase pt-1">
                          Solusi: {
                            diagBrand === "Xiaomi" && diagProblem === "frp" ? "FRP XIAOMI BY SERVER / UNLOCKTOOL" :
                            diagBrand === "Xiaomi" && diagProblem === "micloud" ? "REMOVE MI CLOUD PERMANENT CLEAN" :
                            diagBrand === "Vivo" && diagProblem === "frp" ? "VIVO AUTH SERVER (INSTAN)" :
                            diagBrand === "Samsung" && diagProblem === "frp" ? "SAMSUNG FRP INSTAN" :
                            diagBrand === "iPhone" && diagProblem === "icloud" ? "BYPASS ICLOUD PREMIUM / HELLO" :
                            diagBrand === "Infinix" && diagProblem === "frp" ? "FRP INSTAN INFINIX/TECNO/ITEL" :
                            diagProblem === "mdm" ? "BYPASS MDM / FINANCE PLUS" :
                            diagProblem === "bootloop" ? "FLASHING ULANG (UBL INSTAN/REPAIR)" :
                            diagProblem === "signal" ? "UNBLOCK SINYAL 3 BULAN / IMEI CPID" : "REKREASI SERVICES"
                          }
                        </h4>
                      </div>

                      <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed font-sans">
                        <p className="font-semibold text-white flex items-center gap-1 text-[10px] uppercase">
                          <Check size={12} className="text-emerald-400" /> Driver Wajib Pasang:
                        </p>
                        <ul className="list-disc list-inside pl-1 text-slate-400 space-y-1 font-medium font-cyber">
                          {diagBrand === "Xiaomi" || diagBrand === "Oppo" || diagBrand === "Vivo" || diagBrand === "Infinix" ? (
                            <>
                              <li>MediaTek All-in-One USB Driver</li>
                              <li>Qualcomm QDLoader 9008 Driver</li>
                            </>
                          ) : diagBrand === "Samsung" ? (
                            <li>Samsung Mobile USB Driver</li>
                          ) : (
                            <li>Apple Mobile Device USB (iTunes)</li>
                          )}
                          <li>USB Redirector Client v1.9.7 (Untuk Remote)</li>
                        </ul>

                        <p className="font-semibold text-white flex items-center gap-1 text-[10px] uppercase pt-1">
                          <Check size={12} className="text-emerald-400" /> Cara Kerja:
                        </p>
                        <p className="text-slate-400 font-medium pl-1 leading-relaxed">
                          {diagProblem === "signal" 
                            ? "Sinyal diperbaiki murni via server dengan mendaftarkan nomor IMEI HP Anda. Tidak memerlukan PC ataupun kabel USB."
                            : `Pengekerjaan dilakukan via remote. Teknisi kami akan masuk ke PC Anda via AnyDesk/UltraViewer lalu melakukan flashing/bypass melalui port USB Redirector yang telah Anda colokkan.`}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-white/5 flex gap-2">
                        <button 
                          onClick={() => {
                            let recommendedCat: "all" | "remote" | "activation" | "rental" = "remote";
                            if (diagProblem === "bootloop") recommendedCat = "rental";
                            setSelectedCategory(recommendedCat);
                            setActiveTab(recommendedCat);
                            showToast(`Ditampilkan layanan kategori ${recommendedCat === "rental" ? "Sewa Tool" : "Remote Service"}!`);
                          }}
                          className="flex-1 py-2 rounded-lg bg-brand-navy border border-white/10 hover:border-brand-accent text-slate-300 hover:text-white text-[10px] font-cyber font-bold uppercase tracking-wider text-center cursor-pointer"
                        >
                          Lihat Jasa
                        </button>
                        <a
                          href={`https://wa.me/6287840200308?text=Halo%20Luthfi%20Cell,%20saya%20sudah%20menggunakan%20fitur%20AI%20Diagnostik.%20Berikut%20kasus%20HP%20saya%3A%0A%0A-%20Merk%20HP%3A%20*${encodeURIComponent(diagBrand)}*%0A-%20Masalah%3A%20*${encodeURIComponent(diagProblem === "frp" ? "Lupa Akun Google (FRP)" : diagProblem === "micloud" ? "Terkunci Mi Cloud" : diagProblem === "mdm" ? "Kunci MDM / Finance" : diagProblem === "bootloop" ? "Bootloop / Mati" : diagProblem === "signal" ? "Sinyal Terblokir" : "Bypass iCloud")}*%0A%0AMohon%20bantuan%20untuk%20estimasi%20harga%20dan%20remote%20service.`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-2 rounded-lg bg-brand-accent hover:bg-amber-400 text-black text-[10px] font-cyber font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Send size={10} /> Konsul WA
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-brand-navy/40 border border-white/5 py-8 text-center rounded-xl space-y-2">
                      <AlertCircle className="text-slate-500 mx-auto" size={24} />
                      <p className="text-[11px] text-slate-400 font-medium font-cyber">Pilih Merk dan Jenis Kerusakan di atas untuk memunculkan analisa otomatis.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* STATS PANEL - VISUAL INDICATORS */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Stat 1 */}
          <div className="bg-brand-navyCard/80 backdrop-blur-sm border border-white/10 hover:border-brand-accent/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-brand-accent/5 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-brand-navy border border-white/10 flex items-center justify-center text-brand-accent">
                <Smartphone size={20} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-[9px] font-cyber font-bold tracking-widest text-brand-accent bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">SUCCESS</span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-cyber font-black text-brand-pureWhite tracking-wide group-hover:text-brand-accent transition-colors">1.500+</h3>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase mt-1">Perangkat Sukses Diperbaiki</p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Bypass, remote software, & unlock sukses terverifikasi harian.</p>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-brand-navyCard/80 backdrop-blur-sm border border-white/10 hover:border-emerald-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-brand-navy border border-white/10 flex items-center justify-center text-emerald-400">
                <CheckCircle size={20} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-[9px] font-cyber font-bold tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">HIGHEST</span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-cyber font-black text-brand-pureWhite tracking-wide group-hover:text-emerald-400 transition-colors">99%</h3>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase mt-1">Success Rate</p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Tingkat keberhasilan perbaikan tertinggi dengan file & server premium.</p>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-brand-navyCard/80 backdrop-blur-sm border border-white/10 hover:border-sky-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-sky-500/5 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-brand-navy border border-white/10 flex items-center justify-center text-sky-400">
                <Zap size={20} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-[9px] font-cyber font-bold tracking-widest text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">ULTRA</span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-cyber font-black text-brand-pureWhite tracking-wide group-hover:text-sky-400 transition-colors">&lt; 5 Menit</h3>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase mt-1">Respon Cepat</p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Proses aktivasi lisensi & respon chat admin super instan tanpa antre.</p>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-brand-navyCard/80 backdrop-blur-sm border border-white/10 hover:border-rose-500/40 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-rose-500/5 transition-all duration-300 group">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-brand-navy border border-white/10 flex items-center justify-center text-rose-400">
                <MessageSquare size={20} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-[9px] font-cyber font-bold tracking-widest text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">SUPPORT</span>
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-cyber font-black text-brand-pureWhite tracking-wide group-hover:text-rose-400 transition-colors">24/7</h3>
              <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase mt-1">Dukungan Konsultasi</p>
              <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Siap melayani konsultasi via website AI & WhatsApp chat kapanpun dibutuhkan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* METODE PEMBAYARAN RESMI SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8">
        <div className="border-b border-white/10 pb-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-cyber font-black tracking-widest uppercase text-brand-pureWhite flex items-center gap-2">
                <span className="text-brand-accent text-lg">💳</span> METODE PEMBAYARAN YANG DI DUKUNG
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kami mendukung berbagai pilihan metode pembayaran aman di Indonesia untuk mempercepat pengerjaan orderan Anda secara instan.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-navyCard border border-emerald-500/30 rounded text-[10px] font-cyber font-bold text-emerald-400 uppercase tracking-wider self-start md:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              VERIFIKASI INSTAN OTOMATIS
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Card BRI */}
          <div className="bg-brand-navyCard border border-white/5 hover:border-blue-500/40 rounded-2xl p-5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/5 group">
            <div className="h-12 flex items-center justify-center w-full mb-3">
              <svg viewBox="0 0 120 35" className="h-7 w-auto transition-transform duration-300 group-hover:scale-110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="25" height="25" rx="4" fill="#00529C" />
                <path d="M12 21 C 12 21, 23 18, 23 13 C 23 9, 12 9, 12 9" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M15 25 C 15 25, 25 22, 25 17.5" stroke="#F15A24" strokeWidth="3" strokeLinecap="round" />
                <text x="38" y="24" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="sans-serif">BRI</text>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-cyber font-bold text-brand-pureWhite tracking-widest">BRI BANK</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">BANK TRANSFER</p>
            </div>
          </div>

          {/* Card QRIS */}
          <div className="bg-brand-navyCard border border-white/5 hover:border-rose-500/40 rounded-2xl p-5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-rose-500/5 group">
            <div className="h-12 flex items-center justify-center w-full mb-3">
              <svg viewBox="0 0 110 35" className="h-7 w-auto transition-transform duration-300 group-hover:scale-110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="10" y="25" fill="#1C3F94" fontSize="22" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="-1">QR</text>
                <text x="44" y="25" fill="#E11D48" fontSize="22" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="-1">IS</text>
                <rect x="74" y="10" width="25" height="15" rx="2" fill="#1C3F94" />
                <text x="78" y="21" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">GPN</text>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-cyber font-bold text-brand-pureWhite tracking-widest">QRIS CODE</p>
              <p className="text-[9px] text-emerald-400 uppercase tracking-wider font-bold">INSTAN SCAN</p>
            </div>
          </div>

          {/* Card DANA */}
          <div className="bg-brand-navyCard border border-white/5 hover:border-sky-500/40 rounded-2xl p-5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-sky-500/5 group">
            <div className="h-12 flex items-center justify-center w-full mb-3">
              <svg viewBox="0 0 110 35" className="h-7 w-auto transition-transform duration-300 group-hover:scale-110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="25" y="25" fill="#108EE9" fontSize="22" fontWeight="900" fontFamily="sans-serif" letterSpacing="0">DANA</text>
                <path d="M8 12 L15 6 L22 12 L15 18 Z" fill="#108EE9" />
                <circle cx="15" cy="12" r="2" fill="#FFFFFF" />
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-cyber font-bold text-brand-pureWhite tracking-widest">DANA</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">DOMPET DIGITAL</p>
            </div>
          </div>

          {/* Card SeaBank */}
          <div className="bg-brand-navyCard border border-white/5 hover:border-orange-500/40 rounded-2xl p-5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-orange-500/5 group">
            <div className="h-12 flex items-center justify-center w-full mb-3">
              <svg viewBox="0 0 125 35" className="h-7 w-auto transition-transform duration-300 group-hover:scale-110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="6" width="23" height="23" rx="11.5" fill="#F97316" />
                <path d="M14 17.5 C14 13.5, 25 13.5, 25 17.5 C25 21.5, 14 21.5, 14 17.5" stroke="#FFFFFF" strokeWidth="3" fill="none" />
                <text x="38" y="24" fill="#F97316" fontSize="16" fontWeight="bold" fontFamily="sans-serif" letterSpacing="0.2">SeaBank</text>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-cyber font-bold text-brand-pureWhite tracking-widest">SEABANK</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">DIGITAL BANKING</p>
            </div>
          </div>

          {/* Card ShopeePay */}
          <div className="bg-brand-navyCard border border-white/5 hover:border-red-500/40 rounded-2xl p-5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-red-500/5 group">
            <div className="h-12 flex items-center justify-center w-full mb-3">
              <svg viewBox="0 0 140 35" className="h-7 w-auto transition-transform duration-300 group-hover:scale-110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="6" width="23" height="23" rx="5" fill="#EE4D2D" />
                <path d="M11 16 H22 V24 C22 25, 21 26, 20 26 H13 C12 26, 11 25, 11 24 Z" fill="#FFFFFF" />
                <path d="M14 16 C14 13.5, 19 13.5, 19 16" stroke="#FFFFFF" strokeWidth="2" fill="none" />
                <text x="35" y="24" fill="#EE4D2D" fontSize="15" fontWeight="900" fontFamily="sans-serif">Shopee</text>
                <text x="91" y="24" fill="#F97316" fontSize="15" fontWeight="bold" fontFamily="sans-serif">Pay</text>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-cyber font-bold text-brand-pureWhite tracking-widest">SHOPEEPAY</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">E-WALLET</p>
            </div>
          </div>

          {/* Card Binance */}
          <div className="bg-brand-navyCard border border-white/5 hover:border-yellow-500/40 rounded-2xl p-5 flex flex-col items-center justify-between text-center transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-yellow-500/5 group">
            <div className="h-12 flex items-center justify-center w-full mb-3">
              <svg viewBox="0 0 120 35" className="h-7 w-auto transition-transform duration-300 group-hover:scale-110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6 L24 14 L16 22 L8 14 Z" fill="#F0B90B" />
                <circle cx="16" cy="14" r="3" fill="#18181B" />
                <path d="M16 10 L20 14 L16 18 L12 14 Z" fill="#F0B90B" />
                <text x="35" y="24" fill="#F0B90B" fontSize="15" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">BINANCE</text>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-cyber font-bold text-brand-pureWhite tracking-widest">BINANCE PAY</p>
              <p className="text-[9px] text-amber-500 uppercase tracking-wider font-bold">CRYPTO NETWORK</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER FOOTER FOOTER */}
      <footer className="relative z-10 bg-brand-navy pt-12 pb-8 border-t border-white/10 text-xs font-medium mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="font-cyber font-black text-base tracking-wider uppercase">
              <span className="gold-glow-text">LUTHFI CELL UNLOCKER</span>
            </h3>
            <p className="text-slate-400 leading-relaxed font-medium uppercase text-[11px] tracking-wide">
              Solusi kelas premium untuk penanganan aktivasi software berlisensi resmi dan eksekusi remote service smartphone terlengkap.
            </p>
            {/* Direct Social Media Icons */}
            <div className="pt-2">
              <h4 className="text-white font-cyber font-bold text-[10px] uppercase tracking-widest mb-2">Ikuti Sosial Media</h4>
              <div className="flex gap-2">
                <a 
                  href="https://www.facebook.com/share/1EES6LzgBQ/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-brand-accent/10 border border-white/10 hover:border-brand-accent flex items-center justify-center text-slate-300 hover:text-brand-accent transition-colors"
                  title="Facebook"
                >
                  <Facebook size={14} />
                </a>
                <a 
                  href="https://wa.me/6287840200308" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500 flex items-center justify-center text-slate-300 hover:text-emerald-400 transition-colors"
                  title="WhatsApp"
                >
                  <Smartphone size={14} />
                </a>
                <a 
                  href="https://www.tiktok.com/@luthfi_cell01?_r=1&_t=ZS-97SXErWN0UR" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-brand-accent/10 border border-white/10 hover:border-brand-accent flex items-center justify-center text-slate-300 hover:text-brand-accent transition-colors"
                  title="TikTok"
                >
                  <TiktokIcon size={14} />
                </a>
                <a 
                  href="https://www.instagram.com/luthficelluler?igsh=MWVmbGFzcGY1aDBkdg%3D%3D&utm_source=qr" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-brand-accent/10 border border-white/10 hover:border-brand-accent flex items-center justify-center text-slate-300 hover:text-brand-accent transition-colors"
                  title="Instagram"
                >
                  <Instagram size={14} />
                </a>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-brand-pureWhite font-cyber font-bold text-xs uppercase tracking-widest mb-4 border-l-2 border-brand-accent pl-2">Layanan</h4>
            <ul className="space-y-2 text-slate-400 uppercase tracking-wider text-[11px]">
              <li><a href="#" onClick={() => { setActiveTab("remote"); setSelectedCategory("remote"); }} className="hover:text-brand-accent transition-colors">Remote Service</a></li>
              <li><a href="#" onClick={() => { setActiveTab("activation"); setSelectedCategory("activation"); }} className="hover:text-brand-accent transition-colors">Aktivasi Tool</a></li>
              <li><a href="#" onClick={() => { setActiveTab("rental"); setSelectedCategory("rental"); }} className="hover:text-brand-accent transition-colors">Sewa Tool</a></li>

            </ul>
          </div>
          <div>
            <h4 className="text-brand-pureWhite font-cyber font-bold text-xs uppercase tracking-widest mb-4 border-l-2 border-brand-accent pl-2">Support</h4>
            <ul className="space-y-2 text-slate-400 uppercase tracking-wider text-[11px]">
              <li><a href="https://wa.me/6287840200308" target="_blank" rel="noreferrer" className="hover:text-brand-accent transition-colors">Cara Order</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-brand-pureWhite font-cyber font-bold text-xs uppercase tracking-widest mb-4 border-l-2 border-brand-accent pl-2">Kontak Hubungi</h4>
            <ul className="space-y-2 text-slate-400 uppercase tracking-wider text-[11px]">
              <li className="flex items-center gap-2"><MapPin size={12} className="text-brand-accent" /> Madura, Jawa Timur</li>
              <li className="flex items-center gap-2"><Smartphone size={12} className="text-brand-accent" /> +62 878-4020-0308</li>
              <li className="pt-2 border-t border-white/5 mt-2">
                <span className="text-[10px] text-white font-cyber font-bold uppercase tracking-wider block mb-1">Sosial Media Kami</span>
                <div className="flex gap-2.5">
                  <a href="https://www.facebook.com/share/1EES6LzgBQ/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-brand-accent transition-colors text-[10px]">
                    <Facebook size={12} /> FB
                  </a>
                  <a href="https://wa.me/6287840200308" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors text-[10px]">
                    <Smartphone size={12} /> WA
                  </a>
                  <a href="https://www.tiktok.com/@luthfi_cell01?_r=1&_t=ZS-97SXErWN0UR" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-brand-accent transition-colors text-[10px]">
                    <TiktokIcon size={12} /> TikTok
                  </a>
                  <a href="https://www.instagram.com/luthficelluler?igsh=MWVmbGFzcGY1aDBkdg%3D%3D&utm_source=qr" target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-brand-accent transition-colors text-[10px]">
                    <Instagram size={12} /> IG
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-white/5 text-center text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>&copy; 2026 Luthfi Cell Unlocker. All rights reserved.</p>
          <p className="tracking-widest uppercase font-cyber text-[10px]">Made in <span className="text-slate-400 font-semibold">Madura</span></p>
        </div>
      </footer>

      {/* -------------------------------------------------------------
          AI CHAT ASSISTANT PANEL MODAL / FIXED BUBBLE
         ------------------------------------------------------------- */}
      {chatOpen ? (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm h-[500px] rounded-2xl bg-brand-navyCard border-2 border-brand-accent shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-brand-navy border-b border-white/10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-brand-accent/10 text-brand-accent animate-pulse">
                <Sparkles size={16} />
              </div>
              <div>
                <h4 className="text-xs font-cyber font-black text-white tracking-widest uppercase">LUTHFI CELL AI</h4>
                <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online
                </p>
              </div>
            </div>
            <button 
              onClick={() => setChatOpen(false)}
              className="text-slate-400 hover:text-white font-cyber text-xs p-1 cursor-pointer"
            >
              Tutup
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin text-xs">
            {chatMessages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className={`p-3 rounded-xl leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-brand-accent text-brand-navy font-semibold rounded-br-none" 
                    : "bg-brand-navy border border-white/10 text-slate-200 rounded-bl-none"
                }`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isAILoading && (
              <div className="mr-auto items-start flex flex-col max-w-[85%]">
                <div className="p-3 rounded-xl bg-brand-navy border border-white/10 text-slate-300 rounded-bl-none flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin text-brand-accent" />
                  <span>AI sedang mengetik jawaban...</span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef}></div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendChatMessage} className="p-3 bg-brand-navy border-t border-white/10 flex gap-2">
            <input
              type="text"
              placeholder="Tanyakan model HP, lisensi, harga..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isAILoading}
              className="flex-1 text-xs bg-brand-navyCard border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-accent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isAILoading || !chatInput.trim()}
              className="px-3 rounded-xl bg-brand-accent text-brand-navy hover:bg-amber-400 transition-colors flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      ) : (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-brand-accent hover:bg-amber-400 text-brand-navy shadow-2xl flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        >
          <Sparkles size={18} className="animate-pulse" />
          <span className="font-cyber font-bold text-xs tracking-wider uppercase">TANYA AI</span>
        </button>
      )}

      {/* -------------------------------------------------------------
          ADMIN CONTROL MODAL PANEL (PASSWORD PROTECTED & SECURE)
         ------------------------------------------------------------- */}
      {adminOpen && (
        <div className="fixed inset-0 z-50 bg-brand-navy/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-navyCard border-2 border-brand-accent rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            
            {/* Header */}
            <div className="bg-brand-navy p-5 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-brand-accent" />
                <h3 className="font-cyber font-black tracking-widest text-white uppercase">LUTHFI CELL - SYSTEM DASHBOARD ADMIN</h3>
              </div>
              <button 
                onClick={() => setAdminOpen(false)}
                className="text-slate-400 hover:text-white font-cyber text-xs p-1 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer px-3 py-1.5"
              >
                Keluar Panel
              </button>
            </div>

            {/* LOGIN PORTAL */}
            {!isAdminLoggedIn ? (
              <div className="flex-1 p-8 max-w-sm mx-auto flex flex-col justify-center space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-navy border border-brand-accent/30 flex items-center justify-center mx-auto text-brand-accent">
                  <Lock size={28} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-md font-cyber font-bold text-white uppercase">SISTEM ADMIN TERTUTUP</h4>
                  <p className="text-xs text-slate-400">Masukkan kode password administrator untuk melanjutkan pengerjaan.</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-3">
                  <input
                    type="password"
                    required
                    placeholder="Masukkan password admin..."
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full text-xs text-center bg-brand-navy border border-white/10 rounded-xl p-3 focus:outline-none focus:border-brand-accent text-white"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-xs font-cyber font-bold bg-brand-accent text-brand-navy hover:bg-amber-400 uppercase tracking-widest cursor-pointer"
                  >
                    Masuk Dashboard
                  </button>
                </form>
                <p className="text-[10px] text-slate-500 font-cyber">DEFAULT PASSWORD: <strong className="text-brand-accent">adminluthficell</strong></p>
              </div>
            ) : (
              // FULL ADMIN CONTROL INTERFACE
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* ADMIN SIDEBAR SELECTIONS */}
                <div className="w-full md:w-52 bg-brand-navy border-b md:border-b-0 md:border-r border-white/10 p-4 space-y-2 flex flex-row md:flex-col justify-start md:justify-items-stretch overflow-x-auto">
                  <button
                    onClick={() => setAdminActiveTab("stats")}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-cyber font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer ${adminActiveTab === "stats" ? "bg-brand-accent text-brand-navy" : "text-slate-300 hover:bg-white/5"}`}
                  >
                    <Settings size={14} /> Ringkasan Stats
                  </button>
                  <button
                    onClick={() => setAdminActiveTab("orders")}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-cyber font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer ${adminActiveTab === "orders" ? "bg-brand-accent text-brand-navy" : "text-slate-300 hover:bg-white/5"}`}
                  >
                    <History size={14} /> Kelola Pesanan
                  </button>
                  <button
                    onClick={() => setAdminActiveTab("customers")}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-cyber font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer ${adminActiveTab === "customers" ? "bg-brand-accent text-brand-navy" : "text-slate-300 hover:bg-white/5"}`}
                  >
                    <User size={14} /> Database Pembeli
                  </button>
                  <button
                    onClick={() => setAdminActiveTab("settings")}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-cyber font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer ${adminActiveTab === "settings" ? "bg-brand-accent text-brand-navy" : "text-slate-300 hover:bg-white/5"}`}
                  >
                    <Bell size={14} /> WhatsApp & Kunci
                  </button>
                </div>

                {/* ADMIN WORKSPACE CONTAINER */}
                <div className="flex-1 p-5 overflow-y-auto scrollbar-thin space-y-6">
                  
                  {/* TAB 1: ADMIN STATS OVERVIEW */}
                  {adminActiveTab === "stats" && adminStats && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-cyber tracking-wider uppercase">
                        
                        {/* CARD 1 */}
                        <div className="bg-brand-navy/60 border border-white/5 rounded-xl p-4 space-y-1">
                          <span className="text-slate-500 block text-[10px]">TOTAL PENDAPATAN</span>
                          <span className="text-sm font-black text-brand-accent">Rp {adminStats.totalRevenue.toLocaleString("id-ID")}</span>
                        </div>
                        
                        {/* CARD 2 */}
                        <div className="bg-brand-navy/60 border border-white/5 rounded-xl p-4 space-y-1">
                          <span className="text-slate-500 block text-[10px]">TOTAL PESANAN</span>
                          <span className="text-sm font-black text-white">{adminStats.totalOrders} Transaksi</span>
                        </div>

                        {/* CARD 3 */}
                        <div className="bg-brand-navy/60 border border-white/5 rounded-xl p-4 space-y-1">
                          <span className="text-slate-500 block text-[10px]">DALAM ANTREAN (PENDING)</span>
                          <span className="text-sm font-black text-amber-500">{adminStats.pendingOrders} Antrean</span>
                        </div>

                        {/* CARD 4 */}
                        <div className="bg-brand-navy/60 border border-white/5 rounded-xl p-4 space-y-1">
                          <span className="text-slate-500 block text-[10px]">TOTAL PELANGGAN</span>
                          <span className="text-sm font-black text-white">{adminStats.totalCustomers} Orang</span>
                        </div>
                      </div>

                      {/* STATS ANALYTICS GRAPH (CUSTOM PREMIUM SVG CHART TO GUARANTEE COMPILATION IN REACT 19!) */}
                      <div className="bg-brand-navy/40 border border-white/5 rounded-xl p-5 space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <h4 className="text-xs font-cyber font-black tracking-widest text-slate-300 uppercase">GRAFIK PERFORMA PENDAPATAN HARIAN (SIMULASI/AKTIF)</h4>
                          <span className="text-[10px] text-brand-accent font-mono uppercase">Update Otomatis</span>
                        </div>
                        
                        {/* Bar chart layout drawn as pure responsive SVG bar objects */}
                        <div className="h-44 w-full flex items-end gap-3 pt-4">
                          {adminStats.earningsByDay && adminStats.earningsByDay.map((day, idx) => {
                            // Find percentage mapping
                            const maxVal = Math.max(...adminStats.earningsByDay.map(d => d.revenue), 100000);
                            const percent = (day.revenue / maxVal) * 100;
                            return (
                              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                                <span className="text-[9px] font-mono text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">
                                  {day.revenue > 0 ? `Rp ${Math.round(day.revenue/1000)}k` : "Rp 0"}
                                </span>
                                <div 
                                  className="w-full bg-brand-accent hover:bg-amber-400 rounded-t-md transition-all duration-500"
                                  style={{ height: `${Math.max(percent, 4)}%` }}
                                ></div>
                                <span className="text-[10px] font-cyber text-slate-400 mt-2">{day.date}</span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[11px] text-slate-500 italic text-center">Grafik merepresentasikan akumulasi total transaksi berstatus LUNAS dalam 7 hari terakhir.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="bg-brand-navy/60 border border-white/5 rounded-xl p-5 space-y-2 text-xs">
                          <h4 className="text-xs font-cyber font-bold text-white uppercase tracking-wider">KOMPOSISI PRODUK JASA</h4>
                          <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Remote Bypass Server:</span>
                              <span className="font-semibold">{adminStats.categoriesCount.remote} Pesanan</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Aktivasi Lisensi Resmi:</span>
                              <span className="font-semibold">{adminStats.categoriesCount.activation} Pesanan</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Sewa Tool Harian:</span>
                              <span className="font-semibold">{adminStats.categoriesCount.rental} Pesanan</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-brand-navy/60 border border-white/5 rounded-xl p-5 flex flex-col justify-center text-center space-y-2">
                          <ShieldAlert className="text-brand-accent mx-auto" size={24} />
                          <h4 className="text-xs font-cyber font-bold text-white uppercase">MODE OPERATOR UTAMA</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Pastikan Anda selalu memperbarui status orderan pelanggan agar notifikasi WhatsApp otomatis dikirim oleh server untuk memberikan update status langsung ke nomor handphone mereka.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: MANAGE ORDERS FEED */}
                  {adminActiveTab === "orders" && (
                    <div className="space-y-4">
                      
                      {/* Search & Status Filters */}
                      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-brand-navy/50 p-4 border border-white/5 rounded-xl">
                        <input
                          type="text"
                          placeholder="Cari ID, Nama Pelanggan, No WhatsApp..."
                          value={adminSearchQuery}
                          onChange={(e) => setAdminSearchQuery(e.target.value)}
                          className="w-full sm:max-w-xs text-xs bg-brand-navy border border-white/10 rounded-lg p-2.5"
                        />
                        <div className="flex gap-2 text-xs font-cyber">
                          {["all", "Pending", "Diproses", "Selesai", "Dibatalkan"].map(st => (
                            <button
                              key={st}
                              onClick={() => setAdminFilterStatus(st)}
                              className={`px-2.5 py-1.5 rounded border transition-colors cursor-pointer uppercase text-[10px] tracking-wider ${adminFilterStatus === st ? "bg-brand-accent text-brand-navy font-bold border-brand-accent" : "border-white/10 text-slate-300"}`}
                            >
                              {st === "all" ? "Semua" : st}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Feed Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-brand-navy text-slate-400 font-cyber font-bold text-[10px] tracking-widest uppercase border-b border-white/10">
                            <tr>
                              <th className="p-3">ID Order</th>
                              <th className="p-3">Pelanggan</th>
                              <th className="p-3">Jasa / Tipe HP</th>
                              <th className="p-3">Pembayaran</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Aksi Update</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-[11px]">
                            {adminOrders
                              .filter(o => {
                                const cleanQ = adminSearchQuery.toLowerCase();
                                const matchesSearch = o.id.toLowerCase().includes(cleanQ) || 
                                                      o.customerName.toLowerCase().includes(cleanQ) || 
                                                      o.customerPhone.includes(cleanQ) ||
                                                      o.serviceName.toLowerCase().includes(cleanQ);
                                const matchesStatus = adminFilterStatus === "all" || o.status === adminFilterStatus;
                                return matchesSearch && matchesStatus;
                              })
                              .map(o => (
                                <tr key={o.id} className="hover:bg-white/5">
                                  <td className="p-3">
                                    <span className="font-cyber font-bold text-white block">{o.id}</span>
                                    <span className="text-[10px] text-slate-500 block">{new Date(o.timestamp).toLocaleDateString()}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-semibold block">{o.customerName}</span>
                                    <span className="text-slate-400 block">{o.customerPhone}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-bold text-amber-400 block">{o.serviceName}</span>
                                    <span className="text-slate-400 block">{o.deviceType} | {o.imeiOrSerial}</span>
                                  </td>
                                  <td className="p-3">
                                    <select
                                      value={o.paymentStatus}
                                      onChange={(e) => handleUpdateOrderStatus(o.id, "", e.target.value)}
                                      className="bg-brand-navy text-xs border border-white/15 p-1 rounded font-semibold text-white focus:outline-none"
                                    >
                                      <option value="Belum Bayar">Belum Bayar</option>
                                      <option value="Lunas">Lunas</option>
                                    </select>
                                  </td>
                                  <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-cyber font-bold uppercase ${
                                      o.status === "Selesai" ? "bg-emerald-500/15 text-emerald-400" : 
                                      o.status === "Dibatalkan" ? "bg-rose-500/15 text-rose-400" : "bg-amber-500/15 text-brand-accent"
                                    }`}>
                                      {o.status}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right space-x-1">
                                    <button
                                      onClick={() => handleUpdateOrderStatus(o.id, "Diproses", "")}
                                      className="px-2 py-1 text-[10px] font-semibold bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-black rounded transition-colors"
                                    >
                                      Proses
                                    </button>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(o.id, "Selesai", "")}
                                      className="px-2 py-1 text-[10px] font-semibold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black rounded transition-colors"
                                    >
                                      Selesai
                                    </button>
                                    <button
                                      onClick={() => handleUpdateOrderStatus(o.id, "Dibatalkan", "")}
                                      className="px-2 py-1 text-[10px] font-semibold bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black rounded transition-colors"
                                    >
                                      Batal
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CUSTOMER REGISTER */}
                  {adminActiveTab === "customers" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <h4 className="text-xs font-cyber font-bold text-white uppercase tracking-widest">DATABASE PELANGGAN TERDAFTAR (AMAN DI SERVER DISK)</h4>
                        <span className="text-[10px] text-slate-500">{adminCustomers.length} Pelanggan</span>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-300">
                          <thead className="bg-brand-navy text-slate-400 font-cyber font-bold text-[10px] tracking-widest uppercase border-b border-white/10">
                            <tr>
                              <th className="p-3">Nama</th>
                              <th className="p-3">Nomor WhatsApp</th>
                              <th className="p-3">Email</th>
                              <th className="p-3 text-center">Jumlah Order</th>
                              <th className="p-3 text-right">Akumulasi Spend</th>
                              <th className="p-3">Terakhir Transaksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {adminCustomers.map((c, idx) => (
                              <tr key={idx} className="hover:bg-white/5">
                                <td className="p-3 font-semibold text-white">{c.name}</td>
                                <td className="p-3 font-mono">{c.phone}</td>
                                <td className="p-3">{c.email || "-"}</td>
                                <td className="p-3 text-center font-bold">{c.totalOrders}x</td>
                                <td className="p-3 text-right font-cyber font-bold text-brand-accent">Rp {c.totalSpend.toLocaleString("id-ID")}</td>
                                <td className="p-3 text-slate-400">{new Date(c.lastOrderDate).toLocaleDateString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: WHATSAPP WEBHOOK GATEWAY CONFIGURATION */}
                  {adminActiveTab === "settings" && adminSettings && (
                    <div className="space-y-6">
                      
                      {/* Form Gateways */}
                      <form onSubmit={handleSaveSettings} className="bg-brand-navy/60 border border-white/5 p-5 rounded-xl space-y-4 text-xs">
                        <h4 className="text-xs font-cyber font-bold text-brand-accent uppercase tracking-widest border-b border-white/5 pb-2">KONFIGURASI WHATSAPP GATEWAY (E.G. FONNTE / WABLAS / RUANGWA)</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-slate-300">WhatsApp Gateway API URL</label>
                            <input
                              type="text"
                              value={settingsUrl}
                              onChange={(e) => setSettingsUrl(e.target.value)}
                              placeholder="Default Fonnte: https://api.fonnte.com/send"
                              className="w-full bg-brand-navy border border-white/15 rounded-lg p-2.5 text-white"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-slate-300">Token Otorisasi WhatsApp Gateway API</label>
                            <input
                              type="text"
                              value={settingsToken}
                              onChange={(e) => setSettingsToken(e.target.value)}
                              placeholder="Masukkan token Fonnte / API Token Anda..."
                              className="w-full bg-brand-navy border border-white/15 rounded-lg p-2.5 text-white"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="enabled-notifications"
                            checked={settingsEnabled}
                            onChange={(e) => setSettingsEnabled(e.target.checked)}
                            className="w-4 h-4 text-brand-accent bg-brand-navy border-white/15 rounded focus:ring-amber-500"
                          />
                          <label htmlFor="enabled-notifications" className="text-slate-300 cursor-pointer font-semibold">Aktifkan Pengiriman Notifikasi WhatsApp API Otomatis</label>
                        </div>

                        <div className="border-t border-white/5 pt-4 space-y-2">
                          <h4 className="text-[11px] font-cyber font-bold text-slate-300 uppercase">UBAH PASSWORD ADMIN</h4>
                          <div className="max-w-xs space-y-1">
                            <input
                              type="password"
                              value={newAdminPass}
                              onChange={(e) => setNewAdminPass(e.target.value)}
                              placeholder="Ketik password admin baru..."
                              className="w-full bg-brand-navy border border-white/15 rounded-lg p-2.5 text-white"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-2.5 rounded-lg text-xs font-cyber font-bold bg-brand-accent text-brand-navy hover:bg-amber-400 uppercase tracking-widest cursor-pointer"
                        >
                          Simpan Pengaturan
                        </button>
                      </form>

                      {/* LIVE OUTBOUND DISPATCH NOTIFICATION LOGS */}
                      <div className="bg-brand-navy/60 border border-white/5 p-5 rounded-xl space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <h4 className="text-xs font-cyber font-bold text-white uppercase tracking-widest">LOGS DISPATCH OUTBOUND NOTIFIKASI WA</h4>
                          <span className="text-[10px] text-slate-500">{adminSettings.notificationLogs?.length || 0} Terkirim</span>
                        </div>
                        
                        <div className="max-h-52 overflow-y-auto space-y-3 text-xs scrollbar-thin">
                          {adminSettings.notificationLogs && adminSettings.notificationLogs.length > 0 ? (
                            adminSettings.notificationLogs.map((log: any) => (
                              <div key={log.id} className="p-3 rounded bg-brand-navy border border-white/5 space-y-1">
                                <div className="flex justify-between items-center text-[10px]">
                                  <span className="font-cyber font-bold text-brand-accent">{log.id}</span>
                                  <span className="text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                                <p className="text-slate-300">Penerima: <strong className="text-white">{log.recipient}</strong></p>
                                <pre className="whitespace-pre-wrap font-sans text-slate-400 bg-brand-navyCard p-2 rounded text-[11px] leading-relaxed">{log.message}</pre>
                                <div className="flex items-center gap-1 text-[9px] font-mono">
                                  <span className="text-slate-500">Status:</span>
                                  <span className={log.status === "Success" || log.status === "Simulated" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>{log.status}</span>
                                  <span className="text-slate-500">| Details: {log.details}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-slate-500 italic text-center py-4">Belum ada logs notifikasi keluar.</p>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
