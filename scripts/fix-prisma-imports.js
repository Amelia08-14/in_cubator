const fs = require('fs');
const path = require('path');

// Find all .ts and .tsx files under src/
function walkDir(dir) {
  let files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(walkDir(full));
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      files.push(full);
    }
  }
  return files;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = walkDir(srcDir);

// Skip these files - they have their own singleton or ARE the singleton
const skipFiles = [
  path.normalize('src/lib/prisma.ts'),
  path.normalize('src/auth.ts'),
];

let fixedCount = 0;

for (const file of files) {
  const relPath = path.relative(path.join(__dirname, '..'), file);
  if (skipFiles.some(s => path.normalize(relPath) === s)) continue;

  let content = fs.readFileSync(file, 'utf8');

  // Check if this file has `new PrismaClient()`
  if (!content.includes('new PrismaClient()')) continue;

  // Calculate relative path from this file to src/lib/prisma
  const fileDir = path.dirname(file);
  let relImport = path.relative(fileDir, path.join(srcDir, 'lib', 'prisma'));
  relImport = relImport.replace(/\\/g, '/');
  if (!relImport.startsWith('.')) relImport = './' + relImport;

  // Replace the import and instantiation
  // Pattern 1: import { PrismaClient } from "@prisma/client"; ... const prisma = new PrismaClient();
  // Replace with: import { prisma } from "@/lib/prisma";

  // Remove the `const prisma = new PrismaClient();` line
  content = content.replace(/const prisma = new PrismaClient\(\);\n?/g, '');

  // Replace `import { PrismaClient } from "@prisma/client";` with `import { prisma } from "@/lib/prisma";`
  // But be careful - some files might import other things from @prisma/client
  if (content.includes('import { PrismaClient }')) {
    content = content.replace(
      'import { PrismaClient } from "@prisma/client";',
      'import { prisma } from "@/lib/prisma";'
    );
  } else if (content.includes('import { PrismaClient, ')) {
    // File imports PrismaClient AND other things
    content = content.replace(
      /import \{ PrismaClient, (.*?) \} from "@prisma\/client";/,
      'import { $1 } from "@prisma/client";\nimport { prisma } from "@/lib/prisma";'
    );
  } else if (content.includes('import {PrismaClient}')) {
    content = content.replace(
      'import {PrismaClient} from "@prisma/client";',
      'import { prisma } from "@/lib/prisma";'
    );
  }

  // Also handle cases where PrismaClient was imported but there are other imports from @prisma/client
  // E.g., import { PrismaClient, SomeEnum } from "@prisma/client";
  // This regex handles comma before or after PrismaClient
  content = content.replace(/,\s*PrismaClient\s*/g, '');
  content = content.replace(/PrismaClient\s*,\s*/g, '');

  // If we removed PrismaClient but didn't add the prisma import yet
  if (!content.includes('import { prisma }') && !content.includes("from \"@/lib/prisma\"")) {
    // Add import at the top (after the first import line)
    const firstImportEnd = content.indexOf(';\n') + 2;
    content = content.slice(0, firstImportEnd) + 'import { prisma } from "@/lib/prisma";\n' + content.slice(firstImportEnd);
  }

  fs.writeFileSync(file, content, 'utf8');
  fixedCount++;
  console.log(`Fixed: ${relPath}`);
}

console.log(`\nDone! Fixed ${fixedCount} files.`);
