import { promises as fsPromises } from 'fs';
import { resolve } from 'path';
import * as path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function nodeReadAndWrite() {
    const filePath = resolve(__dirname, 'resources', 'data.json');

    const data = JSON.parse(await fsPromises.readFile(filePath, 'utf8'));
    const dataStringified = JSON.stringify(data);

    await fsPromises.writeFile(filePath, dataStringified, 'utf8');
}

nodeReadAndWrite();
