import crypto from "crypto";
export const CLIENT_ID=process.env.ROBLOX_CLIENT_ID||"7835483002718735784";
export const REDIRECT_URI=process.env.ROBLOX_REDIRECT_URI||"https://avimiles-auth.vercel.app/api/roblox/callback";
const secret=()=>process.env.OAUTH_STATE_SECRET||"";
export function b64url(x){return Buffer.from(x).toString("base64url")}
export function signState(obj){
 if(!secret())throw new Error("OAUTH_STATE_SECRET is missing");
 const body=b64url(JSON.stringify(obj));
 const sig=crypto.createHmac("sha256",secret()).update(body).digest("base64url");
 return `${body}.${sig}`;
}
export function readState(value){
 if(!secret()||!value)return null;
 const [body,sig]=value.split(".");
 if(!body||!sig)return null;
 const expected=crypto.createHmac("sha256",secret()).update(body).digest();
 let actual;try{actual=Buffer.from(sig,"base64url")}catch{return null}
 if(actual.length!==expected.length||!crypto.timingSafeEqual(actual,expected))return null;
 try{const x=JSON.parse(Buffer.from(body,"base64url").toString());if(!x.exp||Date.now()>x.exp)return null;return x}catch{return null}
}
export function challenge(verifier){return crypto.createHash("sha256").update(verifier).digest("base64url")}
export function html(title,message,ok=true){
 return new Response(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;background:#0b1220;color:#f8fafc;font-family:Arial,sans-serif"><main style="max-width:620px;margin:80px auto;padding:28px;background:#111c30;border-radius:18px"><div style="font-size:42px">${ok?"✅":"❌"}</div><h1>${title}</h1><p style="line-height:1.6;color:#cbd5e1">${message}</p><p>You can close this page and return to Discord.</p></main></body></html>`,{status:ok?200:400,headers:{"content-type":"text/html; charset=utf-8"}});
}