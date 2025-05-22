import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { z } from "zod";

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up paths relative to the current directory
const COMPONENTS_DIR = path.join(__dirname, 'components');
const CACHE_DIR = path.join(__dirname, '.cache');

// Ensure directories exist
[COMPONENTS_DIR, CACHE_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Basic component definitions
const defaultComponents = {
  Input: { title: "Input", description: "Input component for forms" },
  Button: { title: "Button", description: "Button component for actions" },
  FormControl: { title: "FormControl", description: "Form control wrapper" },
  VStack: { title: "VStack", description: "Vertical stack layout" },
  Center: { title: "Center", description: "Center content" },
  Box: { title: "Box", description: "Container component" },
  Text: { title: "Text", description: "Text component" },
  Heading: { title: "Heading", description: "Heading component" }
};

// Cache file for custom components
const CACHE_FILE = path.join(CACHE_DIR, 'components.json');

// Load or initialize components
let components = defaultComponents;
try {
  if (fs.existsSync(CACHE_FILE)) {
    const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    components = { ...defaultComponents, ...cached };
  }
} catch (error) {
  // If there's an error reading cache, use defaults
  components = defaultComponents;
}

// Save components to cache
function saveComponents() {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(components, null, 2));
}

// Initialize component documentation
Object.entries(components).forEach(([name, info]) => {
  const filePath = path.join(COMPONENTS_DIR, `${name.toLowerCase()}.md`);
  if (!fs.existsSync(filePath)) {
    const content = `---
title: ${info.title}
description: ${info.description}
---

# ${name} Component

## Usage

\`\`\`jsx
import { ${name} } from '@gluestack-ui/themed';

export default function Example() {
  return (
    <${name}>
      {/* Add your content here */}
    </${name}>
  );
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | The content to be rendered inside the component |
| className | string | - | Additional CSS classes to apply |
`;
    fs.writeFileSync(filePath, content, 'utf8');
  }
});

const latestPrompt = `You are a React and React Native expert. Generate COMPLETE and RUNNABLE code using only my design system components and tools sequentially: get_all_components_metadata, select_components, get_selected_components_docs. Requirements: no external component libraries, no HTML tags (<div>, <button>, <input>, etc), no StyleSheet, use TailwindCSS classes via className prop. Images must be from unsplash.com only. Import all components individually. Prefer VStack/HStack over Box component. Ensure screens are scrollable, responsive, and mobile-friendly.`;

// Initialize MCP server
const server = new McpServer({
  name: "use-gluestack-components",
  version: "1.0.0",
  systemPrompt: latestPrompt,
});

// Get available components
function getAvailableComponents() {
  try {
    return Object.keys(components);
  } catch (error) {
    return [];
  }
}

// Get component metadata
function getComponentMetadata(componentName) {
  return components[componentName] || { title: componentName, description: "Component not found" };
}

// Get all components metadata
function getAllComponentsMetadata() {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(components, null, 2)
      }
    ]
  };
}

// Get component documentation
function getComponentDocs(componentName) {
  try {
    const docPath = path.join(COMPONENTS_DIR, `${componentName.toLowerCase()}.md`);
    if (!fs.existsSync(docPath)) {
      return `Documentation not found for component: ${componentName}`;
    }
    return fs.readFileSync(docPath, 'utf8');
  } catch (error) {
    return `Error retrieving documentation for ${componentName}: ${error.message}`;
  }
}

// Get selected components documentation
function getSelectedComponentsDocs(componentNames) {
  const docsObject = {};
  for (const componentName of componentNames) {
    docsObject[componentName] = getComponentDocs(componentName);
  }
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(docsObject, null, 2)
      }
    ]
  };
}

// Register MCP tools
server.tool(
  "get_all_components_metadata",
  "Read and gives the metadata of all the components",
  {},
  () => getAllComponentsMetadata()
);

server.tool(
  "select_components",
  "Selects the components you need",
  {
    selectedComponents: z
      .array(z.string())
      .describe("The names of the components"),
  },
  (input) => ({
    content: [
      {
        type: "text",
        text: JSON.stringify({
          message: `Selected components: ${input.selectedComponents.join(", ")}`,
          components: input.selectedComponents
        })
      }
    ]
  })
);

server.tool(
  "get_selected_components_docs",
  "Read and gives the complete documentation of selected components",
  {
    component_names: z
      .array(z.string())
      .describe("The names of the components"),
  },
  (input) => getSelectedComponentsDocs(input.component_names)
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(() => process.exit(1));