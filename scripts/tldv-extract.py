#!/usr/bin/env python3
"""
tldv-extract.py — Extrai transcrição de uma reunião do tldv via API REST
Uso: python3 tldv-extract.py <meeting_url_or_id> [output_dir]

Requer:
- Token JWT válido em ~/.tldv-token (válido até ~12/03/2026)
- Para renovar: acessar tldv.io via Chrome relay e copiar cookie tldvtoken
"""

import sys
import subprocess
import json
import re
from datetime import datetime
from pathlib import Path
from collections import defaultdict

WORKSPACE = Path("/home/lincoln/.openclaw/workspace")
TOKEN_FILE = Path.home() / ".tldv-token"
OUTPUT_DIR = WORKSPACE / "tldv-transcripts"


def get_meeting_id(url_or_id: str) -> str:
    match = re.search(r'meetings/([a-f0-9]{24})', url_or_id)
    if match:
        return match.group(1)
    if re.match(r'^[a-f0-9]{24}$', url_or_id):
        return url_or_id
    raise ValueError(f"ID de reunião inválido: {url_or_id}")


def api_get(token: str, path: str):
    url = f"https://api.tldv.io{path}"
    result = subprocess.run(
        ["curl", "-s", "-H", f"Authorization: Bearer {token}", url],
        capture_output=True, text=True, timeout=30
    )
    if result.returncode != 0:
        raise RuntimeError(f"curl falhou: {result.stderr}")
    try:
        return json.loads(result.stdout)
    except json.JSONDecodeError:
        raise RuntimeError(f"Resposta inválida: {result.stdout[:200]}")


def segments_to_text(transcript_response) -> str:
    """Converte o formato da API tldv para texto legível por speaker."""
    # Resposta completa tem chave 'data' com lista de segmentos
    if isinstance(transcript_response, dict):
        segments = transcript_response.get("data", [])
    elif isinstance(transcript_response, list):
        segments = transcript_response
    else:
        return str(transcript_response)

    lines = []
    current_speaker = None
    current_words = []

    def flush():
        if current_words and current_speaker:
            text = " ".join(w.get("word", "") for w in current_words).strip()
            if text:
                lines.append(f"{current_speaker}: {text}")

    for segment in segments:
        if not isinstance(segment, list):
            continue
        for word_obj in segment:
            if not isinstance(word_obj, dict):
                continue
            speaker = word_obj.get("speaker", "")
            word = word_obj.get("word", "")
            if not word:
                continue
            if speaker != current_speaker:
                flush()
                current_speaker = speaker
                current_words = [word_obj]
            else:
                current_words.append(word_obj)
    flush()

    return "\n\n".join(lines)


def extract_transcript(meeting_id: str, output_dir: Path = OUTPUT_DIR) -> str:
    if not TOKEN_FILE.exists():
        raise RuntimeError(f"Token não encontrado em {TOKEN_FILE}")
    token = TOKEN_FILE.read_text().strip()

    print(f"Buscando metadados da reunião {meeting_id}...")
    meeting = api_get(token, f"/meetings/{meeting_id}")

    if "statusCode" in meeting:
        raise RuntimeError(f"Erro da API: {meeting.get('message', meeting)}")

    title = meeting.get("name", "sem-titulo")
    event_date = meeting.get("eventStartDate", "")
    status = meeting.get("status", "")
    duration = meeting.get("duration", 0)

    print(f"Reunião: {title} | Status: {status} | Duração: {int(duration/60)}min")

    print("Buscando transcrição...")
    transcript_data = api_get(token, f"/meetings/{meeting_id}/transcript")

    if isinstance(transcript_data, dict) and "statusCode" in transcript_data:
        code = transcript_data["statusCode"]
        msg = transcript_data.get("message", "")
        if code == 403 or "archived" in msg.lower() or "permission" in msg.lower():
            print(f"⚠️  Reunião arquivada ou sem permissão (plano free — 2 dias)")
            return None
        raise RuntimeError(f"Erro da API: {msg}")

    transcript_text = segments_to_text(transcript_data)

    if not transcript_text or len(transcript_text) < 100:
        raise RuntimeError(f"Transcrição vazia ou muito curta")

    # Data da reunião para nome do arquivo
    if event_date:
        try:
            dt = datetime.fromisoformat(event_date.replace("Z", "+00:00"))
            date_str = dt.strftime("%Y-%m-%d")
        except Exception:
            date_str = datetime.now().strftime("%Y-%m-%d")
    else:
        date_str = datetime.now().strftime("%Y-%m-%d")

    safe_title = re.sub(r'[^\w\s-]', '', title, flags=re.UNICODE).strip().lower()
    safe_title = re.sub(r'\s+', '-', safe_title)[:50]
    filename = f"{date_str}-{safe_title}-{meeting_id[:8]}.md"

    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / filename

    header = f"# {title}\n"
    header += f"**ID:** {meeting_id}\n"
    header += f"**Data:** {event_date}\n"
    header += f"**Duração:** {int(duration/60)} min\n"
    header += f"**Extraído em:** {datetime.now().strftime('%d/%m/%Y %H:%M')}\n\n---\n\n"

    output_path.write_text(header + transcript_text + "\n", encoding="utf-8")
    print(f"✅ Salvo: {output_path} ({len(transcript_text)} chars)")
    return str(output_path)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python3 tldv-extract.py <meeting_url_ou_id> [output_dir]")
        sys.exit(1)

    meeting_input = sys.argv[1]
    out_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else OUTPUT_DIR

    try:
        meeting_id = get_meeting_id(meeting_input)
        result = extract_transcript(meeting_id, out_dir)
        if result:
            print(f"OK: {result}")
            sys.exit(0)
        else:
            sys.exit(2)  # arquivada
    except Exception as e:
        print(f"ERRO: {e}", file=sys.stderr)
        sys.exit(1)
