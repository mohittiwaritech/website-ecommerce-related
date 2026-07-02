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

    // 1. Fix [char]10
    content = content.replace(/"use client";\[char\]10/g, '"use client";\n');

    // 2. Add "use client" to components
    if (file.includes('\\components\\') || file.includes('/components/')) {
        if (!content.includes('"use client"')) {
            content = '"use client";\n' + content;
        }
    }

    // 3. Fix data imports
    content = content.split('../../../../data/').join('@/data/');
    content = content.split('../../../data/').join('@/data/');
    content = content.split('../../data/').join('@/data/');
    content = content.split('../data/').join('@/data/');
    content = content.split('./data/').join('@/data/');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changes++;
        console.log('Fixed', file);
    }
});
console.log('Modified', changes, 'files.');
