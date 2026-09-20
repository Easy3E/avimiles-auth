import crypto from "crypto";
export const CLIENT_ID=process.env.ROBLOX_CLIENT_ID||"7835483002718735784";
export const REDIRECT_URI=process.env.ROBLOX_REDIRECT_URI||"https://avimiles-auth.vercel.app/api/callback";
const secret=()=>{if(!process.env.OAUTH_STATE_SECRET)throw Error("Missing OAUTH_STATE_SECRET");return process.env.OAUTH_STATE_SECRET};
export function sign(o){const b=Buffer.from(JSON.stringify(o)).toString("base64url");return b+"."+crypto.createHmac("sha256",secret()).update(b).digest("base64url")}
export function verify(t){try{const [b,s]=t.split(".");const e=crypto.createHmac("sha256",secret()).update(b).digest(),a=Buffer.from(s,"base64url");if(a.length!==e.length||!crypto.timingSafeEqual(a,e))return null;const d=JSON.parse(Buffer.from(b,"base64url"));return d.exp>Date.now()?d:null}catch{return null}}
export const challenge=v=>crypto.createHash("sha256").update(v).digest("base64url");
export const page=(t,m,ok=true)=>`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>${t}</title><body style="margin:0;background:#0b1220;color:#f8fafc;font-family:Arial"><main style="max-width:620px;margin:80px auto;padding:28px;background:#111c30;border-radius:18px"><div style="font-size:42px">${ok?"✅":"❌"}</div><h1>${t}</h1><p>${m}</p><p>You can close this page and return to Discord.</p></main>`;