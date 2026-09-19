import crypto from "crypto";
import {CLIENT_ID,REDIRECT_URI,signState,challenge} from "../common";
export const runtime="nodejs";
export async function GET(req){
 const u=new URL(req.url);const discord=u.searchParams.get("discord");
 if(!discord||!/^\d{10,25}$/.test(discord))return Response.json({error:"Invalid Discord user."},{status:400});
 const verifier=crypto.randomBytes(48).toString("base64url");
 const state=signState({discord,verifier,exp:Date.now()+10*60*1000,nonce:crypto.randomBytes(16).toString("hex")});
 const q=new URLSearchParams({client_id:CLIENT_ID,redirect_uri:REDIRECT_URI,scope:"openid profile",response_type:"code",state,code_challenge:challenge(verifier),code_challenge_method:"S256"});
 return Response.redirect("https://apis.roblox.com/oauth/v1/authorize?"+q.toString(),302);
}