import type { APIRoute } from "astro";
import { Client } from "@notionhq/client";

export const prerender = true;

const NOTION_API_KEY = import.meta.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;
const NOTION_USER_ID = import.meta.env.NOTION_USER_ID;

const notion = new Client({
    auth: NOTION_API_KEY,
});

const sendForm = async (fields: any) => {

    return notion.pages.create({
        parent: {
            type: "database_id",
            database_id: NOTION_DATABASE_ID,
        },
        properties: {
            Name: {
                type: "title",
                title: [{ type: "text", text: { content: fields.name.value } }],
            },
            Email: {
                type: "email",
                email: fields.email.value,
            },
            Phone: {
                type: "phone_number",
                phone_number: fields.phone.value,
            },
            "Contact Preference": {
                type: "select",
                select: {
                    name: fields.contact.value,
                },
            },
            Message: {
                type: "rich_text",
                rich_text: [{ text: { content: fields.message.value } }],
            },
            Person: {
                type: "people",
                people: [
                    {
                        object: "user",
                        id: NOTION_USER_ID
                    }
                ]
            }
        },
    })
};




export const POST: APIRoute = async ({ request }) => {

    try {
        const data = await request.json();
        const notionResponse = await sendForm(data)
        return new Response(JSON.stringify({notionId: notionResponse.id})
        )

    } catch (error) {
        console.error(error)
        return new Response(JSON.stringify({error: 'error'}))
    }

}