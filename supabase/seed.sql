-- ============================================================
-- SignalCraft Biz Seed Data (zlcnanvidrjgpuugbcou)
-- 실행 대상: Supabase SQL Editor (service_role)
-- 생성일: 2026-03-16
-- ============================================================

-- 고정 user_id (데모용)
-- user_id = '00000000-0000-0000-0000-000000000001'

-- 기존 Device IDs (이미 DB에 존재)
-- dev_a1 = '4708625e-6dd4-43ad-9715-66a174d7e60e' 워크인 냉동고 A-1 (GOOD)
-- dev_b1 = '7e522f4e-2c81-4fd8-ad2c-f08a3df65e38' 업소용 냉장고 B-1 (GOOD)
-- dev_c1 = '87db3bcc-9dcf-4fbb-b39f-0919f5e9a970' 쇼케이스 냉장고 C-1 (GOOD)
-- dev_d1 = 'ddcc65bd-9d53-4a1b-958a-2bc5d5fd3eba' 저온 저장고 D-1 (GOOD)
-- dev_e1 = '877f3ce4-157c-4208-a6a9-760ff70b6883' 급속 냉동고 E-1 (GOOD)
-- dev_f1 = '14eaee5d-fadf-4248-8217-3e8b14425ae4' 냉동 쇼케이스 F-1 (DANGER)
-- dev_g1 = '905b3b19-0faa-4448-8d64-4692a856d94a' 산업용 냉동기 G-1 (WARNING)

-- ============================================================
-- 0. notifications 테이블 생성 (없을 경우)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Allow all for notifications debug'
  ) THEN
    CREATE POLICY "Allow all for notifications debug" ON public.notifications FOR ALL TO public USING (true);
  END IF;
END $$;

-- ============================================================
-- 2a. daily_reports 보강 (7기기 × 30일 = 210행)
-- ============================================================
DELETE FROM public.daily_reports;

INSERT INTO public.daily_reports (report_date, device_id, total_runtime, cycle_count, health_score, roi_data, diagnostics, ai_summary, haccp_status)
SELECT
  d.report_date,
  d.device_id,
  d.total_runtime,
  d.cycle_count,
  d.health_score,
  d.roi_data,
  d.diagnostics,
  d.ai_summary,
  d.haccp_status
FROM (
  SELECT
    (CURRENT_DATE - gs.day_offset) AS report_date,
    dev.id AS device_id,
    -- total_runtime: 14~20시간 (초 단위)
    50400 + (random() * 21600)::int AS total_runtime,
    -- cycle_count: 8~20
    8 + (random() * 12)::int AS cycle_count,
    -- health_score: 상태별 범위
    CASE dev.status
      WHEN 'DANGER'  THEN 55 + (random() * 15)::int
      WHEN 'WARNING' THEN 65 + (random() * 20)::int
      ELSE                 80 + (random() * 18)::int
    END AS health_score,
    -- roi_data
    jsonb_build_object(
      'watt', round((35 + random() * 30)::numeric, 1),
      'door_opens', (5 + (random() * 20)::int)
    ) AS roi_data,
    -- diagnostics
    jsonb_build_object(
      'comp', CASE dev.status
                WHEN 'DANGER'  THEN 50 + (random() * 20)::int
                WHEN 'WARNING' THEN 65 + (random() * 20)::int
                ELSE                 85 + (random() * 15)::int
              END,
      'fan',  CASE dev.status
                WHEN 'DANGER'  THEN 45 + (random() * 25)::int
                WHEN 'WARNING' THEN 60 + (random() * 25)::int
                ELSE                 80 + (random() * 20)::int
              END,
      'valve', CASE dev.status
                WHEN 'DANGER'  THEN 40 + (random() * 30)::int
                WHEN 'WARNING' THEN 65 + (random() * 20)::int
                ELSE                 82 + (random() * 18)::int
              END
    ) AS diagnostics,
    -- ai_summary (5종 순환)
    CASE (gs.day_offset + dev.ord) % 5
      WHEN 0 THEN '전반적으로 안정적인 가동 상태를 유지하고 있어요.'
      WHEN 1 THEN '압축기 진동이 소폭 증가했지만 정상 범위 내예요.'
      WHEN 2 THEN '에너지 효율이 양호하며 HACCP 기준을 충족해요.'
      WHEN 3 THEN '팬 모터 회전수가 안정적이에요. 다음 점검까지 문제 없을 것 같아요.'
      WHEN 4 THEN '냉매 순환 패턴이 정상이에요. 온도 편차도 허용 범위 내예요.'
    END AS ai_summary,
    -- haccp_status
    CASE
      WHEN dev.status = 'DANGER' AND random() < 0.3 THEN 'FAIL'
      ELSE 'PASS'
    END AS haccp_status
  FROM
    generate_series(0, 29) AS gs(day_offset),
    (
      SELECT id, status,
        ROW_NUMBER() OVER (ORDER BY name) AS ord
      FROM public.devices
    ) AS dev
) d;

-- ============================================================
-- 2b. incidents 생성 (12행)
-- ============================================================
DELETE FROM public.incidents;

INSERT INTO public.incidents (device_id, type, severity, details, user_feedback, created_at) VALUES
-- DANGER 기기 (F-1) - 5건
('14eaee5d-fadf-4248-8217-3e8b14425ae4', 'ANOMALY',  0.85, '{"rms": 2.8, "threshold": 1.2, "freq": "60Hz", "desc": "압축기 과진동 감지"}'::jsonb,  'NONE',      NOW() - INTERVAL '2 hours'),
('14eaee5d-fadf-4248-8217-3e8b14425ae4', 'OVERLOAD', 0.72, '{"current_amp": 15.3, "rated_amp": 12.0, "desc": "전류 과부하 경고"}'::jsonb,              'CONFIRMED', NOW() - INTERVAL '1 day'),
('14eaee5d-fadf-4248-8217-3e8b14425ae4', 'ANOMALY',  0.91, '{"rms": 3.1, "threshold": 1.2, "freq": "120Hz", "desc": "베어링 마모 의심 진동"}'::jsonb, 'NONE',      NOW() - INTERVAL '3 days'),
('14eaee5d-fadf-4248-8217-3e8b14425ae4', 'OFFLINE',  0.60, '{"last_seen": "2026-03-10T14:30:00Z", "desc": "통신 두절 15분 초과"}'::jsonb,              'IGNORED',   NOW() - INTERVAL '6 days'),
('14eaee5d-fadf-4248-8217-3e8b14425ae4', 'ANOMALY',  0.78, '{"rms": 2.5, "threshold": 1.2, "freq": "60Hz", "desc": "압축기 시동 전류 이상"}'::jsonb,   'NONE',      NOW() - INTERVAL '12 days'),

-- WARNING 기기 (G-1) - 4건
('905b3b19-0faa-4448-8d64-4692a856d94a', 'ANOMALY',  0.65, '{"rms": 1.8, "threshold": 1.5, "freq": "60Hz", "desc": "팬 모터 미세 진동 증가"}'::jsonb,   'NONE',      NOW() - INTERVAL '5 hours'),
('905b3b19-0faa-4448-8d64-4692a856d94a', 'OVERLOAD', 0.55, '{"current_amp": 13.1, "rated_amp": 12.0, "desc": "순간 전류 초과"}'::jsonb,                  'CONFIRMED', NOW() - INTERVAL '4 days'),
('905b3b19-0faa-4448-8d64-4692a856d94a', 'ANOMALY',  0.58, '{"rms": 1.6, "threshold": 1.5, "freq": "180Hz", "desc": "밸브 작동음 이상"}'::jsonb,         'NONE',      NOW() - INTERVAL '10 days'),
('905b3b19-0faa-4448-8d64-4692a856d94a', 'OFFLINE',  0.45, '{"last_seen": "2026-03-02T08:00:00Z", "desc": "전원 순간 차단 감지"}'::jsonb,                 'IGNORED',   NOW() - INTERVAL '14 days'),

-- GOOD 기기들 - 3건 (간헐적 경미 이벤트)
('4708625e-6dd4-43ad-9715-66a174d7e60e', 'ANOMALY',  0.35, '{"rms": 1.3, "threshold": 1.2, "freq": "60Hz", "desc": "일시적 진동 증가 (자동 복구)"}'::jsonb, 'IGNORED', NOW() - INTERVAL '8 days'),
('7e522f4e-2c81-4fd8-ad2c-f08a3df65e38', 'OFFLINE',  0.30, '{"last_seen": "2026-03-05T02:00:00Z", "desc": "새벽 정전으로 인한 일시 오프라인"}'::jsonb,        'CONFIRMED', NOW() - INTERVAL '11 days'),
('87db3bcc-9dcf-4fbb-b39f-0919f5e9a970', 'ANOMALY',  0.28, '{"rms": 1.25, "threshold": 1.2, "freq": "120Hz", "desc": "제상 모드 전환 시 미세 진동"}'::jsonb, 'IGNORED', NOW() - INTERVAL '20 days');

-- ============================================================
-- 2c. machine_event_logs 보강 (~300행, 최근 3일)
-- ============================================================
DELETE FROM public.machine_event_logs
WHERE occurred_at >= CURRENT_DATE - INTERVAL '3 days';

INSERT INTO public.machine_event_logs (id, device_id, event_type, status, details, occurred_at)
SELECT
  gen_random_uuid(),
  dev.id,
  CASE (gs.idx % 4)
    WHEN 0 THEN 'ON'
    WHEN 1 THEN 'OFF'
    WHEN 2 THEN 'DEF'
    WHEN 3 THEN 'DOOR'
  END,
  CASE
    WHEN dev.status = 'DANGER'  THEN (ARRAY['주의', '주의', '정상'])[1 + (random() * 2)::int]
    WHEN dev.status = 'WARNING' THEN (ARRAY['정상', '주의', '정상'])[1 + (random() * 2)::int]
    ELSE                             (ARRAY['정상', '정상', '절전'])[1 + (random() * 2)::int]
  END,
  CASE (gs.idx % 4)
    WHEN 0 THEN '압축기 가동 시작'
    WHEN 1 THEN '압축기 정지 (설정 온도 도달)'
    WHEN 2 THEN '제상 모드 진입'
    WHEN 3 THEN '도어 개폐 감지'
  END,
  -- 3일간 15분 간격 → 하루 96개 이벤트, but we space them out more
  (CURRENT_DATE - INTERVAL '3 days') + (gs.idx * INTERVAL '15 minutes') + (dev.ord * INTERVAL '2 minutes')
FROM
  generate_series(0, 287) AS gs(idx),  -- 288 slots over 3 days (every 15min)
  (
    SELECT id, status, ROW_NUMBER() OVER (ORDER BY name) AS ord
    FROM public.devices
  ) AS dev
WHERE
  -- 각 기기별로 랜덤하게 약 40~45개씩 선택 (총 ~300행)
  (gs.idx + dev.ord) % 7 < 3;

-- ============================================================
-- 2d. notifications 추가 (6행)
-- ============================================================
DELETE FROM public.notifications;

INSERT INTO public.notifications (user_id, type, title, message, is_read, created_at) VALUES
('00000000-0000-0000-0000-000000000001', 'alert', '이상 징후 감지', '냉동 쇼케이스 F-1에서 압축기 과진동이 감지되었어요. 확인이 필요해요.', false, NOW() - INTERVAL '2 hours'),
('00000000-0000-0000-0000-000000000001', 'alert', '진동 수치 상승', '산업용 냉동기 G-1의 팬 모터 진동이 소폭 증가했어요.', false, NOW() - INTERVAL '5 hours'),
('00000000-0000-0000-0000-000000000001', 'report',  '일일 리포트 도착', '어제의 AI 분석 리포트가 준비되었어요. 7대 기기 모두 확인해 보세요.', false, NOW() - INTERVAL '1 day'),
('00000000-0000-0000-0000-000000000001', 'maintenance', '정기 점검 알림', '워크인 냉동고 A-1의 정기 점검 주기가 도래했어요. 필터 청소를 권장해요.', true, NOW() - INTERVAL '3 days'),
('00000000-0000-0000-0000-000000000001', 'report',  '주간 요약 리포트', '이번 주 전체 기기 평균 건강점수는 87점이에요. 지난주 대비 2점 상승했어요.', true, NOW() - INTERVAL '5 days'),
('00000000-0000-0000-0000-000000000001', 'alert', '오프라인 복구', '냉동 쇼케이스 F-1이 15분간 오프라인 후 다시 연결되었어요.', true, NOW() - INTERVAL '6 days');

-- ============================================================
-- 2e. forecasts 생성 (7행 — 테이블이 비어있으므로 INSERT)
-- ============================================================
DELETE FROM public.forecasts;

INSERT INTO public.forecasts (device_id, prediction_data, golden_time, updated_at) VALUES
-- DANGER: 짧은 golden_time (3일)
('14eaee5d-fadf-4248-8217-3e8b14425ae4',
 '{"mean": [0.82, 0.88, 0.93], "uncertainty": [0.05, 0.08, 0.12], "labels": ["Day1", "Day2", "Day3"]}'::jsonb,
 NOW() + INTERVAL '3 days', NOW()),
-- WARNING: 중간 golden_time (12일)
('905b3b19-0faa-4448-8d64-4692a856d94a',
 '{"mean": [0.55, 0.58, 0.62], "uncertainty": [0.04, 0.06, 0.09], "labels": ["Day1", "Day2", "Day3"]}'::jsonb,
 NOW() + INTERVAL '12 days', NOW()),
-- GOOD: 넉넉한 golden_time (45일+)
('4708625e-6dd4-43ad-9715-66a174d7e60e',
 '{"mean": [0.15, 0.16, 0.17], "uncertainty": [0.02, 0.03, 0.03], "labels": ["Day1", "Day2", "Day3"]}'::jsonb,
 NOW() + INTERVAL '60 days', NOW()),
('7e522f4e-2c81-4fd8-ad2c-f08a3df65e38',
 '{"mean": [0.20, 0.21, 0.22], "uncertainty": [0.03, 0.03, 0.04], "labels": ["Day1", "Day2", "Day3"]}'::jsonb,
 NOW() + INTERVAL '55 days', NOW()),
('87db3bcc-9dcf-4fbb-b39f-0919f5e9a970',
 '{"mean": [0.18, 0.19, 0.20], "uncertainty": [0.02, 0.03, 0.03], "labels": ["Day1", "Day2", "Day3"]}'::jsonb,
 NOW() + INTERVAL '50 days', NOW()),
('ddcc65bd-9d53-4a1b-958a-2bc5d5fd3eba',
 '{"mean": [0.22, 0.23, 0.24], "uncertainty": [0.03, 0.04, 0.04], "labels": ["Day1", "Day2", "Day3"]}'::jsonb,
 NOW() + INTERVAL '48 days', NOW()),
('877f3ce4-157c-4208-a6a9-760ff70b6883',
 '{"mean": [0.25, 0.26, 0.28], "uncertainty": [0.03, 0.04, 0.05], "labels": ["Day1", "Day2", "Day3"]}'::jsonb,
 NOW() + INTERVAL '42 days', NOW());

-- ============================================================
-- 2f. maintenance_logs 보강 (기존 유지 + 추가 4행)
-- ============================================================
INSERT INTO public.maintenance_logs (device_id, action_type, description, performed_at) VALUES
('14eaee5d-fadf-4248-8217-3e8b14425ae4', 'CHECK',         '압축기 이상 진동 확인 점검 — 베어링 상태 양호, 마운트 볼트 조임', NOW() - INTERVAL '2 days'),
('905b3b19-0faa-4448-8d64-4692a856d94a', 'CLEANING',       '콘덴서 코일 먼지 제거 및 팬 블레이드 청소',                       NOW() - INTERVAL '5 days'),
('4708625e-6dd4-43ad-9715-66a174d7e60e', 'PART_REPLACE',   '도어 가스켓 교체 (노후화로 냉기 누출 방지)',                       NOW() - INTERVAL '10 days'),
('87db3bcc-9dcf-4fbb-b39f-0919f5e9a970', 'CLEANING',       '증발기 성에 제거 및 배수구 청소',                                 NOW() - INTERVAL '15 days');

-- ============================================================
-- Done! 시드 데이터 요약:
--   daily_reports:      7 × 30 = 210행
--   incidents:          12행
--   machine_event_logs: ~300행 (최근 3일)
--   notifications:      6행
--   forecasts:          7행 (날짜 갱신)
--   maintenance_logs:   기존 + 4행
-- ============================================================
