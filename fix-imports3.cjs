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

    const folders = ['components', 'context', 'services', 'utils'];
    
    folders.forEach(folder => {
        content = content.split(`../../../../${folder}/`).join(`@/${folder}/`);
        content = content.split(`../../../${folder}/`).join(`@/${folder}/`);
        content = content.split(`../../${folder}/`).join(`@/${folder}/`);
        content = content.split(`../${folder}/`).join(`@/${folder}/`);
        content = content.split(`./${folder}/`).join(`@/${folder}/`);
    });

    // Handle firebase
    content = content.split(`../../../../firebase`).join(`@/firebase`);
    content = content.split(`../../../firebase`).join(`@/firebase`);
    content = content.split(`../../firebase`).join(`@/firebase`);
    content = content.split(`../firebase`).join(`@/firebase`);
    content = content.split(`./firebase`).join(`@/firebase`);

    // Remove SEO
    content = content.split(`import SEO from '@/components/SEO';`).join('');
    content = content.split(`import SEO from '../components/SEO';`).join('');
    content = content.split(/<SEO[\s\S]*?\/>/).join('');

    // Fix react-router-dom usage that migrate-links missed (useParams, useNavigate)
    // Actually next/navigation handles useParams and useRouter
    content = content.split(`import { useParams, Link, useNavigate } from 'react-router-dom';`).join(`import { useParams, useRouter } from 'next/navigation';\nimport Link from 'next/link';`);
    content = content.split(`import { useNavigate } from 'react-router-dom';`).join(`import { useRouter } from 'next/navigation';`);
    content = content.split(`const navigate = useNavigate();`).join(`const router = useRouter();`);
    content = content.split(`navigate(`).join(`router.push(`);

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        changes++;
        console.log('Fixed', file);
    }
});
console.log('Modified', changes, 'files.');
