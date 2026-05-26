import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, writeBatch, doc } from 'firebase/firestore';
import { productsData } from '../src/data/productsData.js';

// Parse .env.local
const parseEnv = () => {
  const envPath = path.resolve('.env.local');
  if (!fs.existsSync(envPath)) {
    console.error("Error: .env.local file not found in root directory.");
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const config = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    
    const parts = trimmed.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      config[key] = value;
    }
  });
  
  return config;
};

const runSeeding = async () => {
  console.log("Parsing environment credentials...");
  const env = parseEnv();
  
  const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID
  };

  console.log("Initializing Firebase App for Project:", firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const batch = writeBatch(db);
  const timestamp = new Date().toISOString();

  // 1. Categories List
  const categories = [
    { id: '1', name: 'Receipt Printer', image: '/assets/Thermal.jpg' },
    { id: '2', name: 'Label Printer', image: '/assets/barcode.webp' },
    { id: '3', name: 'Barcode Scanner', image: '/assets/scanner.jpg' },
    { id: '4', name: 'Mobile Printer', image: '/assets/Receipt Printer.jpg' },
    { id: '5', name: 'Receipt Paper Roll', image: '/assets/receipt-paper.jpg' },
    { id: '6', name: 'POS System', image: '/assets/POS SYSTEM.avif' },
    { id: '7', name: 'Cash Box ', image: '/assets/cashbox.jpg' },
    { id: '8', name: 'Billing Software', image: '/assets/soft111.jpg' }
  ];

  // 2. Drivers List
  const drivers = [
    { 
      id: '1', name: "H58 Receipt Printer", image: "/assets/51JGHxjz28L._SL1200_.jpg", 
      desc: "Windows Driver, Linux Driver and SDK Kit", 
      links: [
        { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2023/03/Atpos-H58-Driver-IE-Tool-for-CSP.zip" },
        { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2021/04/Linux-SDK-ToolsManuals.zip" }
      ] 
    },
    { 
      id: '2', name: "MD80 Label | HL450 Receipt Printer", image: "/assets/HL450.jpg", 
      desc: "Windows Driver, Linux Driver and SDK Kit", 
      links: [
        { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2025/03/Atpos-MD80-Drivers.zip" },
        { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2021/04/Linux-SDK-ToolsManuals.zip" }
      ] 
    },
    { 
      id: '3', name: "M80 Receipt Printer", image: "/assets/m80.jpg", 
      desc: "Windows Driver, Linux Driver and SDK Kit", 
      links: [
        { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2024/11/ATPOS-PrintDriver-AT345-Series.zip" },
        { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2024/11/Atpos-AT345-series-ReceiptPrinterFiles.zip" }
      ] 
    },
    { 
      id: '4', name: "HL300 / HL58 Receipt Printer", image: "/assets/Atpos-HL300s.jpg", 
      desc: "Windows Driver, Linux Driver and SDK Kit", 
      links: [
        { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2021/01/AtPOS-80-Series.zip" },
        { label: "Tools & SDK Kit", url: "https://www.atpos.in/wp-content/uploads/2021/04/Linux-SDK-ToolsManuals.zip" }
      ] 
    },
    { 
      id: '6', name: "HQ450L Label Printer", image: "/assets/450.webp", 
      desc: "Windows Driver, Windows Diabel Software", 
      links: [
        { label: "Windows Driver", url: "https://www.atpos.in/wp-content/uploads/2024/12/Atpos-Label-Printer-E58-HQ450L-Driver-Setup.zip" },
        { label: "Software", url: "https://apps.microsoft.com/detail/9pmtsg6f98jc?hl=en-US&gl=US" }
      ] 
    },
    { 
      id: '7', name: "AT-301/302/402 Receipt Printer", image: "/assets/302.jpg", 
      desc: "Windows Driver, MAC OS, Linux Driver and Tool Kit", 
      links: [
        { label: "Windows Driver", url: "https://firebasestorage.googleapis.com/v0/b/volcora-products.appspot.com/o/V-WRP-A1%20%7C%20V-WLRP-A1%20Series%20Printer%2FDrivers%2FWindows%20Driver.zip?alt=media&token=f7726e70-9537-4d68-ae9e-039625acb2b8" },
        { label: "SDK, Tools & MAC OS", url: "https://www.atpos.in/wp-content/uploads/2024/11/Atpos-AT345-series-ReceiptPrinterFiles.zip" }
      ] 
    },
    { 
      id: '10', name: "E58 Label Printer", image: "/assets/e58bt.webp", 
      desc: "Windows Driver & EM Label Software", 
      links: [
        { label: "Windows Driver & Software", url: "https://www.atpos.in/wp-content/uploads/2024/12/Atpos-Label-Printer-E58-HQ450L-Driver-Setup.zip" },
        { label: "Android App", url: "https://drive.google.com/file/d/1iFn-nXUETwI_poZsiAQQ75w98ywE3fFZ/view?usp=sharing" }
      ] 
    },
    { 
      id: '11', name: "AT-602 Label Printer", image: "/assets/500sm-min.png", 
      desc: "Windows Driver & EM Label Software", 
      links: [
        { label: "Windows Driver & Software", url: "https://www.atpos.in/wp-content/uploads/2024/02/Atpos-AT-602-Windows-Driver-for-Label-and-Receipt-Printing-2023.zip" }
      ] 
    }
  ];

  console.log("Preparing categories to seed...");
  categories.forEach((cat) => {
    const docRef = doc(db, 'categories', String(cat.id));
    batch.set(docRef, {
      name: cat.name,
      image: cat.image,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  });

  console.log("Preparing drivers to seed...");
  drivers.forEach((drv) => {
    const docRef = doc(db, 'drivers', String(drv.id));
    batch.set(docRef, {
      name: drv.name,
      image: drv.image,
      desc: drv.desc,
      links: drv.links,
      createdAt: timestamp,
      updatedAt: timestamp
    });
  });

  console.log("Preparing products to seed...");
  productsData.forEach((prod) => {
    const docRef = doc(db, 'products', String(prod.id));
    batch.set(docRef, {
      sku: prod.sku || `SKU-${prod.id}`,
      brand: prod.brand || 'ATPOS',
      category: prod.category || 'Uncategorized',
      title: prod.title || '',
      rating: Number(prod.rating) || 5,
      price: Number(prod.price) || 0,
      oldPrice: Number(prod.oldPrice) || 0,
      mainImage: prod.mainImage || '',
      thumbnails: prod.thumbnails || [],
      shortDesc: prod.shortDesc || [],
      longDescription: prod.longDescription || '',
      videoUrl: prod.videoUrl || '',
      specs: prod.specs || {},
      warranty: prod.warranty || '1 Year Warranty',
      inStock: prod.inStock !== false,
      featured: ['4', '8', '9', '11'].includes(String(prod.id)),
      createdAt: timestamp,
      updatedAt: timestamp
    });
  });

  console.log("Committing batch writes to Firestore database...");
  await batch.commit();
  console.log("Firestore Seeding completed successfully!");
};

runSeeding().catch(err => {
  console.error("Seeding failed with error:", err);
  process.exit(1);
});
