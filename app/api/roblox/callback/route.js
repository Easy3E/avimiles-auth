import {CLIENT_ID,REDIRECT_URI,readState,html} from "../common";
export const runtime="nodejs";
export async function GET(req){
 try{
  const u=new URL(req.url),code=u.searchParams.get("code"),rawState=u.searchParams.get("state"),err=u.searchParams.get("error");
  if(err)return html("Connection cancelled","Roblox did not authorize AviMiles.",false);
  const state=readState(rawState);
  if(!state||!code)return html("Invalid connection","The authorization request is invalid or expired. Run /linkroblox again.",false);
  const secret=process.env.ROBLOX_CLIENT_SECRET;
  const apiSecret=process.env.AVIMILES_SERVICE_TOKEN;
  const apiBase=(process.env.AVIMILES_API_URL||"").replace(/\/$/,"");
  if(!secret||!apiSecret||!apiBase)return html("Server configuration error","AviMiles OAuth has not been fully configured yet.",false);
  const form=new URLSearchParams({client_id:CLIENT_ID,client_secret:secret,grant_type:"authorization_code",code,redirect_uri:REDIRECT_URI,code_verifier:state.verifier});
  const tokenRes=await fetch("https://apis.roblox.com/oauth/v1/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:form,cache:"no-store"});
  if(!tokenRes.ok){console.error("token",tokenRes.status,await tokenRes.text());return html("Roblox connection failed","Roblox could not complete the authorization. Run /linkroblox again.",false)}
  const tokens=await tokenRes.json();
  const userRes=await fetch("https://apis.roblox.com/oauth/v1/userinfo",{headers:{authorization:`Bearer ${tokens.access_token}`},cache:"no-store"});
  if(!userRes.ok)return html("Profile lookup failed","AviMiles could not read your Roblox profile.",false);
  const rb=await userRes.json();
  const save=await fetch(`${apiBase}/internal/accounts/${state.discord}/roblox`,{method:"POST",headers:{"content-type":"application/json","X-Bot-Token":apiSecret},body:JSON.stringify({roblox_user_id:String(rb.sub),roblox_username:rb.preferred_username||null,roblox_display_name:rb.name||rb.nickname||null}),cache:"no-store"});
  if(!save.ok){const t=await save.text();console.error("save",save.status,t);return html("AviMiles linking failed",save.status===409?"That Roblox account is already linked to another Discord account.":"AviMiles could not save the account link.",false)}
  return html("Roblox Connected!",`<b>@${rb.preferred_username||"Roblox user"}</b> is now linked to your AviMiles account.`);
 }catch(e){console.error(e);return html("Something went wrong","The connection could not be completed. Run /linkroblox again.",false)}
}