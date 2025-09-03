#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to find all TypeScript/TSX files
function findTsxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findTsxFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to extract icon names from JSX
function extractIconNames(content) {
  const iconRegex = /<([A-Z][a-zA-Z]+)\s+className=/g;
  const icons = new Set();
  let match;
  
  // Common UI component names to exclude (shadcn/ui components)
  const uiComponents = [
    'div', 'span', 'button', 'input', 'form', 'label', 'select', 'textarea', 
    'svg', 'path', 'circle', 'rect', 'line', 'polygon', 'ul', 'li', 'ol',
    'Card', 'CardContent', 'CardHeader', 'CardTitle', 'CardDescription', 'CardFooter',
    'Dialog', 'DialogContent', 'DialogHeader', 'DialogTitle', 'DialogDescription',
    'Tabs', 'TabsList', 'TabsTrigger', 'TabsContent',
    'Button', 'Input', 'Label', 'Select', 'Textarea', 'Badge',
    'Avatar', 'AvatarFallback', 'AvatarImage',
    'DropdownMenu', 'DropdownMenuContent', 'DropdownMenuItem', 'DropdownMenuTrigger',
    'Sheet', 'SheetContent', 'SheetHeader', 'SheetTitle',
    'Accordion', 'AccordionContent', 'AccordionItem', 'AccordionTrigger',
    'Alert', 'AlertDescription', 'AlertTitle',
    'Popover', 'PopoverContent', 'PopoverTrigger',
    'Tooltip', 'TooltipContent', 'TooltipTrigger',
    'Command', 'CommandInput', 'CommandList', 'CommandItem',
    'Skeleton', 'Separator', 'ScrollArea', 'ResizablePanel'
  ];
  
  // Common variable names that are not actual icon imports
  const variableNames = ['Icon', 'Component', 'Element', 'Wrapper'];
  
  while ((match = iconRegex.exec(content)) !== null) {
    const iconName = match[1];
    // Skip common HTML elements, UI components, and variable names
    if (!uiComponents.includes(iconName) && !variableNames.includes(iconName)) {
      icons.add(iconName);
    }
  }
  
  return Array.from(icons);
}

// Function to check if icons are imported
function checkIconImports(filePath, iconNames) {
  const content = fs.readFileSync(filePath, 'utf8');
  const missingIcons = [];
  
  iconNames.forEach(iconName => {
    // Check for import from lucide-react
    const importRegex = new RegExp(`import\\s*{[^}]*\\b${iconName}\\b[^}]*}\\s*from\\s*["']lucide-react["']`);
    if (!importRegex.test(content)) {
      missingIcons.push(iconName);
    }
  });
  
  return missingIcons;
}

// Main function
function main() {
  console.log('🔍 Checking for missing icon imports...\n');
  
  const tsxFiles = findTsxFiles('.');
  let hasIssues = false;
  
  tsxFiles.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8');
    const iconNames = extractIconNames(content);
    
    if (iconNames.length > 0) {
      const missingIcons = checkIconImports(filePath, iconNames);
      
      if (missingIcons.length > 0) {
        console.log(`❌ ${filePath}`);
        console.log(`   Missing imports: ${missingIcons.join(', ')}\n`);
        hasIssues = true;
      }
    }
  });
  
  if (!hasIssues) {
    console.log('✅ All icon imports are properly configured!');
  } else {
    console.log('💡 To fix missing imports, add them to the lucide-react import statement:');
    console.log('   import { IconName1, IconName2 } from "lucide-react";');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { findTsxFiles, extractIconNames, checkIconImports };
