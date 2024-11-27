import Fuse from "https://esm.sh/fuse.js@7.0.0";
import yf from 'npm:yahoo-finance2@2.11.3';

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
const allowedYfTypes = ["EQUITY", "ETF", "INDEX"];

const fuse = new Fuse(allSymbols, {
    keys: ["symbol", "name"],
    threshold: 0.2,
});

export const search = async (q: string) => {

    try {
        const resp = await yf.search(q);
        const yahooSymbols = resp.quotes.map(j => j as unknown as any).filter(j => j.isYahooFinance)
            .filter(j => allowedYfTypes.includes(j.quoteType))
            .map(j => {
                return {
                    symbol: j.symbol,
                    name: j.longname
                }
            })
        if (yahooSymbols && yahooSymbols.length > 0) {
            return yahooSymbols
        }
    } catch (error) {

    }
    const filtered = fuse.search(q, { limit: 25 }).map((x) => x.item);
    if (filtered.length > 0) return filtered;

    return [];
}