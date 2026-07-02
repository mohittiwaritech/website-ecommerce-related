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

    const folders = ['components', 'context', 'services', 'utils', 'firebase'];
    
    folders.forEach(folder => {
        // Replace ../../../folder, ../../folder, ../folder, ./folder
        const regex1 = new RegExp(`['"]\\.\\./\\.\\./\\.\\./${folder}(.*?)['"]`, 'g');
        const regex2 = new RegExp(`['"]\\.\\./\\.\\./${folder}(.*?)['"]`, 'g');
        const regex3 = new RegExp(`['"]\\.\\./${folder}(.*?)['"]`, 'g');
        
        content = content.replace(regex1, `'@/${folder}$1'`);
        content = content.replace(regex2, `'@/${folder}$1'`);
        content = content.replace(regex3, `'@/${folder}$1'`);
        
        // Also handle firebase as a file (e.g. ../firebase)
        if (folder === 'firebase') {
             const fRegex1 = new RegExp(`['"]\\.\\./\\.\\./\\.\\./firebase['"]`, 'g');
             const fRegex2 = new RegExp(`['"]\\.\\./\\.\\./firebase['"]`, 'g');
             const fRegex3 = new RegExp(`['"]\\.\\./firebase['"]`, 'g');
             content = content.replace(fRegex1, `'@/firebase'`);
             content = content.replace(fRegex2, `'@/firebase'`);
             content = content.replace(fRegex3, `'@/firebase'`);
        }
    });

    // Remove SEO component imports and usage
    content = content.replace(/import\s+SEO\s+from\s+['"][^'"]*SEO['"];?\n?/g, "");
    content = content.replace(/<SEO\s+[^>]*\/>/g, "");

    // Add missing next/navigation router imports if useRouter is used
    if (content.includes('useRouter(') && !content.includes('useRouter')) {
        content = "import { useRouter } from 'next/navigation';\n" + content;
    }

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changes++;
        console.log('Fixed', file);
    }
});
console.log('Modified', changes, 'files.');
