import { serve } from "bun";
import { requestMethods } from "./signed-url/method";

const port = parseInt(Bun.env.PORT ?? "3000");

requestMethods;
serve({
    port,
    fetch: requestMethods,
});

console.log(`Listening on port :${port}`);
