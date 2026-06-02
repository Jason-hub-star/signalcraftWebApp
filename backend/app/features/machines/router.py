from fastapi import APIRouter, HTTPException
from app.core.config import settings
from supabase import create_client, Client

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

@router.get("/")
async def list_machines():
    # In a real app, we'd verify the JWT token
    user_id = "00000000-0000-0000-0000-000000000001"
    
    try:
        response = supabase.table("devices").select("*").eq("user_id", user_id).execute()
        machines = []
        
        status_map = {
            "GOOD": "running",
            "WARNING": "warning",
            "DANGER": "error",
        }

        for d in response.data:
            # Fetch latest health_score from daily_reports
            report_res = supabase.table("daily_reports")\
                .select("health_score")\
                .eq("device_id", str(d["id"]))\
                .order("report_date", desc=True)\
                .limit(1)\
                .execute()
            real_health = report_res.data[0]["health_score"] if report_res.data else (
                100 if d["status"] == "GOOD" else (70 if d["status"] == "WARNING" else 40)
            )

            location = "A구역"
            if d["location_info"] and isinstance(d["location_info"], dict):
                location = d["location_info"].get("address", "A구역")

            machines.append({
                "id": str(d["id"]),
                "name": d["name"],
                "location": location,
                "status": status_map.get(d["status"], "running"),
                "health": real_health,
                "prediction": d["config"].get("prediction", "AI 예측 진행 중") if d["config"] else "AI 예측 진행 중",
                "imageUrl": "",
                "type": d["model_type"].lower() if d["model_type"] else "freezer"
            })
            
        return {"machines": machines}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
async def register_machine(data: dict):
    return {"message": "Machine registered"}
