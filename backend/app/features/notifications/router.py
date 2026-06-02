from fastapi import APIRouter, HTTPException
from app.core.config import settings
from supabase import create_client, Client

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

@router.get("/")
async def list_notifications():
    # In a real app, we'd verify the JWT token
    user_id = "00000000-0000-0000-0000-000000000001"
    
    try:
        response = supabase.table("notifications").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        
        notifications = []
        if response.data:
            for n in response.data:
                notifications.append({
                    "id": str(n["id"]),
                    "type": n["type"],
                    "title": n["title"],
                    "message": n["message"],
                    "isRead": n["is_read"],
                    "createdAt": n["created_at"]
                })
            
        return {"notifications": notifications}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{notification_id}/read")
async def mark_as_read(notification_id: str):
    try:
        response = supabase.table("notifications").update({"is_read": True}).eq("id", notification_id).execute()
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/mark-all-read")
async def mark_all_as_read():
    user_id = "00000000-0000-0000-0000-000000000001"
    try:
        response = supabase.table("notifications").update({"is_read": True}).eq("user_id", user_id).execute()
        return {"ok": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/settings")
async def get_notification_settings():
    user_id = "00000000-0000-0000-0000-000000000001"
    try:
        print(f"Fetching settings for user: {user_id}")
        query = supabase.table("notification_settings").select("*").eq("user_id", user_id)
        response = query.execute()
        
        if not response.data:
            print("No settings found, creating defaults...")
            default_settings = {
                "user_id": user_id,
                "push_enabled": True,
                "kakao_enabled": False,
                "anomaly_alerts": True,
                "report_alerts": True
            }
            insert_response = supabase.table("notification_settings").insert(default_settings).execute()
            if insert_response.data:
                return insert_response.data[0]
            else:
                raise Exception("Failed to insert default settings")
                
        return response.data[0]
    except Exception as e:
        print(f"Error in get_notification_settings: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Supabase error: {str(e)}")

@router.post("/settings")
async def update_notification_settings(settings_data: dict):
    user_id = "00000000-0000-0000-0000-000000000001"
    try:
        print(f"Updating settings for user {user_id}: {settings_data}")
        # Filter allowed fields
        allowed_fields = ["push_token", "push_enabled", "kakao_enabled", "anomaly_alerts", "report_alerts"]
        update_data = {k: v for k, v in settings_data.items() if k in allowed_fields}
        update_data["updated_at"] = "now()"
        
        response = supabase.table("notification_settings").upsert({
            "user_id": user_id,
            **update_data
        }, on_conflict="user_id").execute()
        
        if response.data:
            return response.data[0]
        else:
            raise Exception("No data returned from upsert")
    except Exception as e:
        print(f"Error in update_notification_settings: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Supabase update error: {str(e)}")
