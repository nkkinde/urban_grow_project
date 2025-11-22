import sys
import asyncio
import io
# UTF-8 인코딩 강제 설정
sys.stdout.reconfigure(encoding='utf-8')

from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import edge_tts

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TTSRequest(BaseModel):
    text: str
    speaker_id: int = 0  # 0=여성, 1=남성
    speed: float = 1.0  # 0.5=느림, 1.0=기본, 1.5=빠름


# 한국어 음성 목록
KOREAN_VOICES = [
    "ko-KR-SunHiNeural",      # 여성
    "ko-KR-InJoonNeural",     # 남성
]


async def tts_edge_korean(text: str, speed: float = 1.0, voice_idx: int = 0) -> bytes:
    """Edge TTS로 한국어 음성 생성"""
    voice = KOREAN_VOICES[voice_idx % len(KOREAN_VOICES)]
    
    # 속도 조절: -100% ~ +100% (기본값 +0%)
    # speed=0.5 → rate="-50%", speed=1.0 → rate="+0%", speed=1.5 → rate="+50%"
    rate = int((speed - 1.0) * 100)
    rate = max(-100, min(100, rate))  # -100 ~ 100 범위로 제한
    rate_str = f"{rate:+d}%"  # "+0%", "-50%", "+50%" 형식
    
    print(f"[EdgeTTS] Text: {text[:50]}")
    print(f"[EdgeTTS] Voice: {voice}, Speed: {rate_str}")
    
    communicate = edge_tts.Communicate(text, voice=voice, rate=rate_str)
    
    # MP3 스트림으로 받기
    audio_data = io.BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data.write(chunk["data"])
    
    audio_data.seek(0)
    return audio_data.read()


@app.post("/tts")
async def tts_endpoint(req: TTSRequest):
    """TTS 엔드포인트"""
    try:
        # 이모지 제거 (Edge TTS에서 문제 발생할 수 있음)
        text = req.text
        text = ''.join(c for c in text if ord(c) < 0x1F300 or ord(c) > 0x1F9FF)  # 이모지 범위 제거
        
        # Edge TTS로 음성 생성
        voice_idx = int(req.speaker_id) % len(KOREAN_VOICES)
        audio_data = await tts_edge_korean(text, req.speed, voice_idx)
        
        # MP3로 반환
        return Response(content=audio_data, media_type="audio/mpeg")
    
    except Exception as e:
        print(f"[EdgeTTS] Error: {e}")
        return {"error": str(e)}, 500


@app.get("/health")
async def health_check():
    """헬스 체크"""
    return {"status": "ok", "tts": "edge-tts"}
