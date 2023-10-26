import type { APIRoute } from "astro";

export const prerrender = true;

const sendForm = (fields: any): any => {
    var myHeaders = new Headers();
    myHeaders.append("notion-version", "2022-06-28");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
        "Authorization",
        "Bearer secret_7m26h14EGjUpRwG3oyqOqoMh0kDU5gNuCPZb5tjDWse",
    );
    myHeaders.append(
        "Cookie",
        "__cf_bm=yjRq5D3BEItBYXbI3Oob934OyL5UKbchT_cF0_B0K5Q-1697542457-0-AQFlk3dTZ3e2uznjKBen+hK8NqUizeTZE8bQ/40/ewYb/63pS/p48NvK1WCaIDdp2EIMCGXDIAuny6K4CPF+Z1o=",
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