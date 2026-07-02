const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
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

const files = walk(path.join(__dirname, 'src'));
let changes = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Replace import.meta.env.VITE_ with process.env.NEXT_PUBLIC_
    content = content.replace(/import\.meta\.env\.VITE_/g, 'process.env.NEXT_PUBLIC_');
    
    // Some env variables might just be import.meta.env.RESEND_API_KEY or similar
    content = content.replace(/import\.meta\.env\./g, 'process.env.');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changes++;
        console.log('Fixed env vars in', file);
    }
});
console.log('Modified', changes, 'files.');
