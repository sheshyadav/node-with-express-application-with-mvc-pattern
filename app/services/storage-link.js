import { symlink } from 'fs';
import { resolve } from 'path';

const targetFolder = resolve('storage/public/'); 
const shortcutFolder = resolve('public/storage');
symlink(targetFolder, shortcutFolder, 'junction', (err) => {
    if(err){
        console.error('Storage linked failed.');
    } else {
        console.log(`Storage linked successfully.`);
    }
});