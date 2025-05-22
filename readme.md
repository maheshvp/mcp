# Gluestack Components MCP Server

This project provides a Model Context Protocol (MCP) server for integrating Gluestack components with Claude Desktop.

## Prerequisites

- Node.js (v14 or higher)
- Claude Desktop application

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### 2. Install Claude Desktop

Download and install Claude Desktop from the official Anthropic website if you haven't already.

### 3. Configure Claude Desktop MCP Server

You need to add this MCP server to your Claude Desktop configuration file.

#### For macOS and Linux:

**Using Cursor Editor:**

```bash
cursor ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Using VS Code:**

```bash
code ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Using any text editor:**

```bash
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### For Windows:

**Using VS Code:**

```powershell
code $env:AppData\Claude\claude_desktop_config.json
```

**Using Notepad:**

```powershell
notepad $env:AppData\Claude\claude_desktop_config.json
```

### 4. Update Configuration File

Add the following configuration to your `claude_desktop_config.json` file:

#### For macOS and Linux:

```json
{
  "mcpServers": {
    "use-gluestack-components": {
      "command": "node",
      "args": ["/complete/path/to/your/project/index.js"]
    }
  }
}
```

#### For Windows:

```json
{
  "mcpServers": {
    "use-gluestack-components": {
      "command": "node",
      "args": ["C:\\complete\\path\\to\\your\\project\\index.js"]
    }
  }
}
```

### 5. Start the MCP Server

Navigate to your project directory and run:

```bash
node index.js
```

### 6. Restart Claude Desktop

Close and reopen Claude Desktop application. You should now see the MCP server listed in the available tools menu.

## Verification

After following the setup steps:

1. Open Claude Desktop
2. Look for the MCP server in the tools menu, just below the input where you enter your prompt.
3. You should see "use-gluestack-components" listed as an available MCP server