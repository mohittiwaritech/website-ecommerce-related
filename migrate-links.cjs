const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'next-app/src'));
let changes = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace combined imports first
    content = content.replace(/import\s+\{\s*Link\s*,\s*useNavigate\s*\}\s+from\s+['"]react-router-dom['"];?/g, "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';");
    content = content.replace(/import\s+\{\s*useNavigate\s*,\s*Link\s*\}\s+from\s+['"]react-router-dom['"];?/g, "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';");

    // Replace single imports
    content = content.replace(/import\s+\{\s*Link\s*\}\s+from\s+['"]react-router-dom['"];?/g, "import Link from 'next/link';");
    content = content.replace(/import\s+\{\s*useNavigate\s*\}\s+from\s+['"]react-router-dom['"];?/g, "import { useRouter } from 'next/navigation';");
    
    // Replace hooks
    content = content.replace(/useNavigate\(\)/g, "useRouter()");
    content = content.replace(/const\s+navigate\s*=/g, "const router =");
    content = content.replace(/navigate\(/g, "router.push(");

    // Replace Link 'to' with 'href'
    content = content.replace(/<Link\s+([^>]*?)to=/g, "<Link $1href=");
    content = content.replace(/<Link\s+to=/g, "<Link href=");

    // Use useParams, useLocation from next/navigation
    content = content.replace(/import\s+\{\s*useParams\s*\}\s+from\s+['"]react-router-dom['"];?/g, "import { useParams } from 'next/navigation';");
    content = content.replace(/import\s+\{\s*useLocation\s*\}\s+from\s+['"]react-router-dom['"];?/g, "import { usePathname } from 'next/navigation';");
    content = content.replace(/useLocation\(\)/g, "usePathname()");
    
    // Also change `location.pathname` to `pathname` if they use it
    content = content.replace(/const\s+location\s*=\s*usePathname\(\)/g, "const pathname = usePathname()");
    content = content.replace(/location\.pathname/g, "pathname");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changes++;
        console.log('Updated', file);
    }
});

console.log('Modified', changes, 'files.');
