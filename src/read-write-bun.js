import { resolve } from 'path';
import * as path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = resolve(__dirname, 'resources', 'data.json');

async function bunReadAndWrite() {
    const data = await (Bun.file(filePath)).json();
    const dataStringified = JSON.stringify(data);
    await Bun.write(filePath, dataStringified, 'utf8');
}

bunReadAndWrite();
