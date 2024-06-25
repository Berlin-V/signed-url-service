import { getSignedUrl } from "./service";
import { log } from "./utils/logger";

export async function requestMethods(request: any) {
    {
        const { method } = request;
        const url = new URL(request.url);
        if (method === "GET" && url.pathname === "/get/signedUrl") {
            const inData: any = url.searchParams;
            const fileId: string = inData.get("fileId");
            const response = await getSignedUrl({ fileId });
            log(
                `Request response for the give file id: ${fileId} is ${JSON.stringify(
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
