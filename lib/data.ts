import Fuse from "https://esm.sh/fuse.js@7.0.0";


import amex from "./../amex/amex_full_tickers.json" with {
    type: "json",
};
import nyse from "./../nyse/nyse_full_tickers.json" with {
    type: "json",
};
import nasdaq from "./../nasdaq/nasdaq_full_tickers.json" with {
    type: "json",
};

const allSymbols = [...nasdaq, ...nyse, ...amex].map(({ symbol, name }) => ({ symbol, name }));

const fuse = new Fuse(allSymbols, {
    keys: ["symbol", "name"],
    threshold: 0.2,
});

export const search = (q: string)=>{
    const filtered = fuse.search(q, { limit: 25 }).map((x) => x.item);
    return filtered;
}

