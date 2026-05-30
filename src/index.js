import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import 'dotenv/config'
import supabase  from "../lib/supabase";

const SB_API_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL

const server = new McpServer({
    name: "notes",
    version: "1.0.0",
})

const OWNER_EMAIL = "alex@multiplyinc.com"

server.registerTool(
    "list_notes",
    {
        description: "List all of the current user's notes",
        inputSchema: {
            type: "object",
            properties: {},
        }
    },
    async () => {
        const { data, error } = await supabase
        .from('AIM Notes')
        .select('id, projectName')
        .eq('userID', OWNER_EMAIL)
        if (!error) {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(data)
                }]
            }
        } else {
            return {
                content: [{
                    type: "text",
                    text: `Failed to retrieve data, error: ${error}`
                }]
            }
        }
    }
)

server.registerTool(
    "read_note",
    {
        description: "Read the contents of user's notes",
        inputSchema: {
            type: "object",
            properties: {
                id: { type: "string", description: "The note's unique ID" }
            },
            required: ["id"]
        }
    },
    async ({ id }) => {
        const { data, error } = await supabase
        .from('AIM Notes')
        .select()
        .eq('id', id)
        .eq('userID', OWNER_EMAIL)
        if (!error) {
            return {
                content: [{
                    type: "text",
                    text: JSON.stringify(data)
            }]
            }
        } else {
            return {
                content: [{
                    type: "text",
                    text: `Failed, to retrieve text, ${error}`
                }]
            }
        }
    }
)

server.registerTool(
    "edit_note",
    {
        description: "This tool edits the content of a user's note. Read the note first using read_note before editing to understand the current content.",
        inputSchema: {
            type: "object",
            properties: {
                id: { type: "string", description: "The note's unique ID" },
                newData: { type: "string", description: "The updated text you would like the note to display"}
            },
            required: ["id", "newData"]
        }
    },
    async ({ id, newData }) => {
        const { data, error } = await supabase
        .from('AIM Notes')
        .update({'projectData': newData})
        .eq('id', id)
        if(!error) {
            return {
                content: [{
                    type: "text",
                    text: `Updated data: ${data}`
                }]
            }
        } else {
            return {
                content: [{
                    type: "text",
                    text: `Error: ${error}`
                }]
            }
        }
    }
)

server.registerTool (
    "delete_note",
    {
        description: "This tool is used when you want a note removed, completely deleted from supabase altogether",
        inputSchema: {
            type: "object",
            properties: {
                id: {type: "string", description: "the project's unique ID"}
            }, required: ["id"]
        }
    },

    async ({ id }) => {
        const response = await supabase
        .from('AIM Notes')
        .delete()
        .eq('id', id)
        if(!response) {
            return {
                content: [{
                    type:"text",
                    text: "unknown error occured"
                }]
            }
        } else {
            return {
                content: [{
                    type: 'text',
                    text: "Successfully deleted note!"
                }]
            }
        }
    }
)

async function main() {
    const transport = new StreamableHTTPServerTransport()
    await server.connect(transport)
    console.error('Notes MCP running via http')
}

main().catch((error) => {
    console.error("Fatal error in main()", error)
    process.exit(1)
})