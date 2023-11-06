import type { APIRoute } from "astro";

export const prerender = true;

const NOTION_API_KEY = import.meta.env.NOTION_API_KEY;
const NOTION_COOKIE = import.meta.env.NOTION_COOKIE;

const sendForm = (fields: any): any => {
    var myHeaders = new Headers();
    myHeaders.append("notion-version", "2022-06-28");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
        "Authorization",
        `Bearer  ${NOTION_API_KEY}`
    );
    myHeaders.append(
        "Cookie",
        NOTION_COOKIE
    );

    var raw = JSON.stringify({
        parent: {
            type: "database_id",
            database_id: "2a161a0f40b947709bd38855e99069a8",
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
        },
    });

    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
    };

    return fetch("https://api.notion.com/v1/pages", requestOptions)
};




export const POST: APIRoute = async ({ request }) => {

    try {
        const data = await request.json();

        const notion = await sendForm(data)
        const jsonNotion = await notion.json()
        return new Response(JSON.stringify({notion: jsonNotion})
        )

    } catch (error) {

        return new Response(JSON.stringify({error}))
    }



}