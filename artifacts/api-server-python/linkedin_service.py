import os
import json
import time
import httpx
from typing import Dict, Any, Optional

TOKEN_FILE = os.path.join(os.path.dirname(__file__), "linkedin_token.json")

def _get_credentials():
    return {
        "client_id": os.environ.get("LINKEDIN_CLIENT_ID"),
        "client_secret": os.environ.get("LINKEDIN_CLIENT_SECRET"),
        "redirect_uri": os.environ.get("LINKEDIN_REDIRECT_URI"),
    }

def get_authorization_url(state: str) -> str:
    creds = _get_credentials()
    if not creds["client_id"] or not creds["redirect_uri"]:
        raise ValueError("LinkedIn credentials not fully configured in environment variables.")
        
    scopes = ["openid", "profile", "email", "w_member_social"]
    url = (
        f"https://www.linkedin.com/oauth/v2/authorization?"
        f"response_type=code&"
        f"client_id={creds['client_id']}&"
        f"redirect_uri={creds['redirect_uri']}&"
        f"state={state}&"
        f"scope={'%20'.join(scopes)}"
    )
    return url

async def exchange_code_for_token(code: str):
    creds = _get_credentials()
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "client_id": creds["client_id"],
                "client_secret": creds["client_secret"],
                "redirect_uri": creds["redirect_uri"]
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if resp.status_code != 200:
            raise Exception(f"Failed to exchange token: {resp.text}")
            
        data = resp.json()
        token_data = {
            "access_token": data.get("access_token"),
            "expires_in": data.get("expires_in"),
            "expires_at": int(time.time()) + int(data.get("expires_in", 0))
        }
        
        with open(TOKEN_FILE, "w", encoding="utf-8") as f:
            json.dump(token_data, f)
            
        return token_data

def load_token() -> Optional[str]:
    if not os.path.exists(TOKEN_FILE):
        return None
    try:
        with open(TOKEN_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            
        if data.get("expires_at", 0) > time.time():
            return data.get("access_token")
        return None
    except Exception:
        return None

def disconnect():
    if os.path.exists(TOKEN_FILE):
        os.remove(TOKEN_FILE)

async def get_user_profile() -> Dict[str, Any]:
    token = load_token()
    if not token:
        raise Exception("Not authenticated with LinkedIn")
        
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.linkedin.com/v2/userinfo",
            headers={"Authorization": f"Bearer {token}"}
        )
        if resp.status_code != 200:
            raise Exception(f"Failed to fetch profile: {resp.text}")
            
        data = resp.json()
        return {
            "name": data.get("name"),
            "email": data.get("email"),
            "picture": data.get("picture"),
            "sub": data.get("sub") # This is their Person ID
        }

async def upload_image(local_path: str) -> Optional[str]:
    token = load_token()
    if not token:
        raise Exception("Not authenticated with LinkedIn")
        
    profile = await get_user_profile()
    person_urn = f"urn:li:person:{profile['sub']}"
    
    register_url = "https://api.linkedin.com/v2/assets?action=registerUpload"
    headers = {
        "Authorization": f"Bearer {token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }
    
    payload = {
        "registerUploadRequest": {
            "recipes": ["urn:li:digitalmediaRecipe:feedshare-image"],
            "owner": person_urn,
            "serviceRelationships": [{"relationshipType": "OWNER", "identifier": "urn:li:userGeneratedContent"}]
        }
    }
    
    async with httpx.AsyncClient() as client:
        # Register the upload
        reg_resp = await client.post(register_url, headers=headers, json=payload)
        if reg_resp.status_code != 200:
            print(f"Failed to register image upload: {reg_resp.text}")
            return None
            
        reg_data = reg_resp.json()
        upload_url = reg_data['value']['uploadMechanism']['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']['uploadUrl']
        asset_urn = reg_data['value']['asset']
        
        # Upload the actual binary data
        with open(local_path, "rb") as f:
            file_data = f.read()
            
        upload_resp = await client.put(
            upload_url,
            headers={"Authorization": f"Bearer {token}"},
            content=file_data
        )
        
        if upload_resp.status_code != 201:
            print(f"Failed to upload image binary: {upload_resp.text}")
            return None
            
        return asset_urn

async def create_post(text_content: str, local_image_path: Optional[str] = None):
    token = load_token()
    if not token:
        raise Exception("Not authenticated with LinkedIn")
        
    profile = await get_user_profile()
    person_urn = f"urn:li:person:{profile['sub']}"
    
    asset_urn = None
    if local_image_path and os.path.exists(local_image_path):
        asset_urn = await upload_image(local_image_path)
    
    url = "https://api.linkedin.com/v2/ugcPosts"
    headers = {
        "Authorization": f"Bearer {token}",
        "X-Restli-Protocol-Version": "2.0.0",
        "Content-Type": "application/json"
    }
    
    payload = {
        "author": person_urn,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
            "com.linkedin.ugc.ShareContent": {
                "shareCommentary": {"text": text_content},
                "shareMediaCategory": "NONE"
            }
        },
        "visibility": {"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"}
    }
    
    if asset_urn:
        payload["specificContent"]["com.linkedin.ugc.ShareContent"]["shareMediaCategory"] = "IMAGE"
        payload["specificContent"]["com.linkedin.ugc.ShareContent"]["media"] = [{"status": "READY", "media": asset_urn}]
        
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, headers=headers, json=payload)
        
        if resp.status_code not in [200, 201]:
            raise Exception(f"Failed to create post. Status: {resp.status_code}, Body: {resp.text}")
            
        return {"status": "success", "headers": dict(resp.headers)}
