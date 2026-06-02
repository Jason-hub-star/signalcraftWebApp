from datetime import datetime, timezone, timedelta
from fastapi import APIRouter, HTTPException, Query
from app.core.config import settings
from supabase import create_client, Client
from app.features.dashboard.machine_detail.router import router as machine_detail_router

router = APIRouter()
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

DEMO_USER_ID = "00000000-0000-0000-0000-000000000001"
MAINTENANCE_PHONE = "010-1234-5678"

DEVICE_STATUS_TO_MACHINE_STATUS = {"GOOD": "running", "WARNING": "warning", "DANGER": "error"}
RUNTIME_TO_SUMMARY_STATE = {"running": "RUNNING", "warning": "OFF", "error": "OFF"}

PERIOD_HOURS = {"24h": 24, "7d": 24 * 7, "30d": 24 * 30, "90d": 24 * 90}
PERIOD_OPTIONS = [
    {"id": "24h", "label": "지난 24시간"},
    {"id": "7d", "label": "지난 7일"},
    {"id": "30d", "label": "지난 30일"},
    {"id": "90d", "label": "지난 90일"},
]


def _build_status_overview(devices: list[dict]) -> list[dict]:
    total = len(devices)
    healthy = sum(1 for d in devices if d.get("status") == "GOOD")
    danger = sum(1 for d in devices if d.get("status") == "DANGER")

    machines_state: str
    if danger > 0:
        machines_state = "danger"
    elif healthy < total:
        machines_state = "warning"
    else:
        machines_state = "healthy"

    return [
        {
            "id": "machines",
            "title": "설비 구동 상태",
            "state": machines_state,
            "healthyCount": healthy,
            "totalCount": total,
            "description": (
                f"현재 설치된 {total}대 중 {danger}대가 즉시 점검이 필요해요."
                if danger > 0
                else f"현재 설치된 {total}대 중 {total - healthy}대가 주의 단계예요."
                if healthy < total
                else f"현재 설치된 {total}대 모두 정상 가동 중이에요."
            ),
        },
        {
            "id": "edgeSensors",
            "title": "센서 상태",
            "state": "healthy",
            "healthyCount": total * 2,
            "totalCount": total * 2,
            "description": "모든 센서가 정상으로 데이터를 수집하고 있어요.",
        },
        {
            "id": "server",
            "title": "서버 상태",
            "state": "healthy",
            "healthyCount": 1,
            "totalCount": 1,
            "description": "백엔드 서버가 안정적으로 응답하고 있어요.",
        },
    ]


def _build_equipment_summary(devices: list[dict]) -> list[dict]:
    items: list[dict] = []
    for device in devices:
        runtime_status = DEVICE_STATUS_TO_MACHINE_STATUS.get(device.get("status", "GOOD"), "running")
        items.append({
            "id": str(device.get("id", "")),
            "name": device.get("name", ""),
            "type": device.get("type", ""),
            "state": RUNTIME_TO_SUMMARY_STATE.get(runtime_status, "OFF"),
        })
    return items


def _build_equipment_usage(devices: list[dict], period: str) -> dict:
    return {
        "selectedPeriod": period,
        "periodOptions": PERIOD_OPTIONS,
        "machines": [
            {"id": str(d.get("id", "")), "name": d.get("name", "")}
            for d in devices
        ],
        "segments": [],
        "summary": {"runningMinutes": 0, "offMinutes": 0},
    }


@router.get("/home")
async def get_dashboard_home():
    try:
        response = (
            supabase
            .table("devices")
            .select("id, name, type, status")
            .eq("user_id", DEMO_USER_ID)
            .order("name", desc=False)
            .execute()
        )
        devices = response.data or []

        return {
            "appVersion": f"v{settings.VERSION}",
            "lastUpdatedAt": datetime.now(timezone.utc).isoformat(),
            "maintenancePhone": MAINTENANCE_PHONE,
            "statusOverview": _build_status_overview(devices),
            "equipmentUsage": _build_equipment_usage(devices, "24h"),
            "equipmentSummary": _build_equipment_summary(devices),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/equipment-usage")
async def get_equipment_usage(
    period: str = Query("24h", description="기간 옵션: 24h | 7d | 30d | 90d"),
    machine_id: str | None = Query(None, description="필터링할 설비 ID (선택)"),
):
    if period not in PERIOD_HOURS:
        raise HTTPException(status_code=400, detail=f"지원하지 않는 period: {period}")

    try:
        query = (
            supabase
            .table("devices")
            .select("id, name, type, status")
            .eq("user_id", DEMO_USER_ID)
            .order("name", desc=False)
        )
        if machine_id:
            query = query.eq("id", machine_id)
        response = query.execute()
        devices = response.data or []

        return _build_equipment_usage(devices, period)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Include sub-routers
router.include_router(machine_detail_router, prefix="/machine-detail", tags=["Machine Detail"])
