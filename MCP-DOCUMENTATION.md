
# Smart Video Editor MCP Documentation

## Overview
Smart Video Editor MCP is a hosted Model Context Protocol server.

## MCP Endpoint
https://smart-3lst.onrender.com/mcp

## Transport
Streamable HTTP

## Authentication
No authentication is currently required.
No API key or user account is required.

## Available Tools

### smart_status

Description: Checks whether the Smart Video Editor MCP server is online and responding.

Input: No input parameters.

Output: A text message confirming the MCP server connection.

Classification: Read-only.

Side Effects: None.

## Permissions and Data Access
The current connector does not access user accounts, personal files, or private video content. It does not upload, modify, or delete user data.

## Current Limitations
The connector currently provides only the smart_status connection test tool. Video editing, trimming, rendering, and exporting tools are not yet available through MCP.

## Errors and Availability
The server uses the MCP Streamable HTTP transport. Requests may fail if the hosting service is unavailable.

The Render Free hosting plan may sleep after inactivity, causing a cold-start delay.

## Rate Limits
No custom application-level rate limit is currently configured.
