import { getSignedUrl } from "./service";
import { log } from "./utils/logger";

export async function requestMethods(request: any) {
    {
        const { method } = request;
        const regex =
            "^http://[a-zA-Z0-9.:-]+/[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+.(pdf|zip)$";

        const matchRegex = new RegExp(regex).test(request.url);
        const url = new URL(request.url);

        if (method === "GET" && matchRegex) {
            const fileName: string = url.pathname.replace(/^\//, "");

            const response = await getSignedUrl(fileName);
            log(
                `Request response for the give file name: ${fileName} is ${JSON.stringify(
                    response
                )}`
            );

            return new Response(JSON.stringify(response), {
                headers: { "Content-Type": "application/json" },
                status: 201,
            });
        }

        return new Response("permission denied, Route not Found", {
            status: 404,
        });
    }
}
