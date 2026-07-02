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
            if (file.endsWith('.tsx')) {
                // Ignore layout.tsx and page.tsx in root
                if (!file.includes('(main)\\page.tsx') && !file.includes('(main)/page.tsx') && !file.includes('layout.tsx') && !file.includes('Providers.tsx')) {
                    results.push(file);
                }
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'next-app/src/app'));
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.startsWith('"use client"')) {
        fs.writeFileSync(file, '"use client";\n' + content, 'utf8');
        console.log('Prepended to', file);
    }
});
