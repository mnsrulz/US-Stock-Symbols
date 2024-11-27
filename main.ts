import {
    Application,
    isHttpError,
    Router,
} from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v12.6.1/helpers.ts";
import { search } from './lib/data.ts';


const router = new Router();

router.get("/symbols", async (context) => {
    //api/symbols/search?q=t
    const { q } = getQuery(context);
    const items = await search(q);
    context.response.body = {
        items
    };
})

const app = new Application();

app.use(async (context, next) => {
    try {
        context.response.headers.set("Access-Control-Allow-Origin", "*");
        await next();
    } catch (err) {
        if (isHttpError(err)) {
            context.response.status = err.status;
        } else {
            context.response.status = 500;
        }
        context.response.body = { error: err.message };
        context.response.type = "json";
    }
});

app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({ port: 8000 });