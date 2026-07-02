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
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx')) {
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

    // Replace relative paths with alias @/
    // Match '../', '../../', '../../../' etc.
    content = content.replace(/['"](\.\.\/)+components\/(.*?)['"]/g, "'@/components/$2'");
    content = content.replace(/['"](\.\.\/)+context\/(.*?)['"]/g, "'@/context/$2'");
    content = content.replace(/['"](\.\.\/)+services\/(.*?)['"]/g, "'@/services/$2'");
    content = content.replace(/['"](\.\.\/)+utils\/(.*?)['"]/g, "'@/utils/$2'");
    content = content.replace(/['"](\.\.\/)+firebase['"]/g, "'@/firebase'");

    // Specifically for SEO which is now handled by Next.js metadata, we should remove the SEO import and component if possible, or just ignore the SEO error if we remove the SEO component entirely.
    // Actually, I can just remove the SEO component import and `<SEO ... />` lines since Next.js uses `export const metadata = {}` now.
    content = content.replace(/import\s+SEO\s+from\s+['"][^'"]*SEO['"];?\n?/g, "");
    content = content.replace(/<SEO\s+[^>]*\/>/g, "");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changes++;
        console.log('Fixed imports in', file);
    }
});

console.log('Modified', changes, 'files.');
