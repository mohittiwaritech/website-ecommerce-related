const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const nextAppDir = __dirname;

// 1. Copy public/assets to next-app/public/assets
const srcAssets = path.join(rootDir, 'public', 'assets');
const destAssets = path.join(nextAppDir, 'public', 'assets');

function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    if (fs.existsSync(src)) {
        const entries = fs.readdirSync(src, { withFileTypes: true });
        for (let entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            if (entry.isDirectory()) {
                copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
}
console.log('Copying assets...');
copyDir(srcAssets, destAssets);

// 2. Fix Products page
const productsSrc = path.join(rootDir, 'src', 'pages', 'Products.jsx');
const productsDest = path.join(nextAppDir, 'src', 'app', '(main)', 'products', 'page.tsx');
if (fs.existsSync(productsSrc)) {
    let content = fs.readFileSync(productsSrc, 'utf8');
    content = '"use client";\nimport { Suspense } from "react";\nimport { useSearchParams } from "next/navigation";\nimport Link from "next/link";\n' + content;
    
    // Replace imports
    content = content.replace(/import\s+\{[^}]*\}\s+from\s+['"]react-router-dom['"];?/g, '');
    content = content.replace(/import SEO from '[^']+';?/g, '');
    
    // Replace hooks
    content = content.replace(/const location = useLocation\(\);/g, 'const searchParams = useSearchParams();');
    content = content.replace(/const params = new URLSearchParams\(location\.search\);/g, '');
    content = content.replace(/const categoryFromUrl = params\.get\('category'\);/g, "const categoryFromUrl = searchParams.get('category');");
    content = content.replace(/const typeFromUrl = params\.get\('type'\);/g, "const typeFromUrl = searchParams.get('type');");
    content = content.replace(/\[location\.search\]/g, '[searchParams]');
    
    // Replace internal paths if needed (e.g., ../services/dbService to @/services/dbService)
    content = content.replace(/\.\.\//g, '@/');
    
    // SEO
    content = content.replace(/<SEO[^>]*\/>/g, '');
    
    // Wrap in Suspense
    content = content.replace(/export default Products;/g, '');
    content += `\nexport default function ProductsPage() { return <Suspense fallback={<div>Loading...</div>}><Products /></Suspense>; }\n`;
    
    fs.writeFileSync(productsDest, content, 'utf8');
    console.log('Fixed Products page');
}

// 3. Fix OrderComplete page
const ocSrc = path.join(rootDir, 'src', 'pages', 'OrderComplete.jsx');
const ocDest = path.join(nextAppDir, 'src', 'app', '(main)', 'order-complete', 'page.tsx');
if (fs.existsSync(ocSrc)) {
    let content = fs.readFileSync(ocSrc, 'utf8');
    content = '"use client";\nimport Link from "next/link";\n' + content;
    
    content = content.replace(/import\s+\{[^}]*\}\s+from\s+['"]react-router-dom['"];?/g, '');
    content = content.replace(/const location = useLocation\(\);/g, '');
    content = content.replace(/const orderData = location\.state\?\.orderData;/g, 'const orderData = null;');
    content = content.replace(/\.\.\//g, '@/');
    
    content = content.replace(/export default OrderComplete;/g, '');
    content += `\nexport default OrderComplete;\n`;
    
    fs.writeFileSync(ocDest, content, 'utf8');
    console.log('Fixed OrderComplete page');
}

console.log('All done!');
