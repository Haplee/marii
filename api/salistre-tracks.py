"""Catálogo completo de Salistre, en vivo desde Deezer.

Se ejecuta como función serverless en Vercel (no en local). Deezer expone su
catálogo público sin necesidad de cuenta, clave ni coste, así que cada vez que
Salistre publica una canción nueva este endpoint la recoge sola en la
siguiente visita (con caché de 6h en el CDN de Vercel para no golpear la API
en cada carga).
"""
import json
import os
import re
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler

DEEZER_API = "https://api.deezer.com"
ARTIST_NAME = "Salistre"
DEFAULT_ARTIST_ID = 49239292  # id de Salistre en Deezer, comprobado a mano
REQUEST_TIMEOUT = 8


def _get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "marii-app/1.0"})
    with urllib.request.urlopen(req, timeout=REQUEST_TIMEOUT) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _normalize(text: str) -> str:
    text = unicodedata.normalize("NFKD", text or "").encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def _resolve_artist_id() -> int:
    env_id = os.environ.get("DEEZER_ARTIST_ID")
    if env_id:
        return int(env_id)
    try:
        data = _get_json(f"{DEEZER_API}/artist/{DEFAULT_ARTIST_ID}")
        if _normalize(data.get("name", "")) == _normalize(ARTIST_NAME):
            return DEFAULT_ARTIST_ID
    except (urllib.error.URLError, ValueError, KeyError):
        pass

    data = _get_json(f"{DEEZER_API}/search/artist?q={urllib.parse.quote(ARTIST_NAME)}")
    results = data.get("data", [])
    if not results:
        raise RuntimeError(f"No se encontró el artista '{ARTIST_NAME}' en Deezer")
    exact = next((a for a in results if _normalize(a.get("name", "")) == _normalize(ARTIST_NAME)), None)
    return (exact or results[0])["id"]


def _fetch_all_albums(artist_id: int) -> list:
    albums = []
    url = f"{DEEZER_API}/artist/{artist_id}/albums?limit=100"
    while url:
        data = _get_json(url)
        albums.extend(data.get("data", []))
        url = data.get("next")
    return albums


def _fetch_tracks() -> list:
    artist_id = _resolve_artist_id()
    albums = _fetch_all_albums(artist_id)

    by_title: dict[str, dict] = {}
    for album in albums:
        album_detail = _get_json(f"{DEEZER_API}/album/{album['id']}")
        release_date = album_detail.get("release_date") or album.get("release_date") or ""
        cover = album_detail.get("cover_medium") or album.get("cover_medium") or ""

        for track in album_detail.get("tracks", {}).get("data", []):
            title = track.get("title_short") or track.get("title") or ""
            key = _normalize(title)
            if not key:
                continue

            candidate = {
                "id": track["id"],
                "title": title,
                "artist": ARTIST_NAME,
                "album": album_detail.get("title") or album.get("title"),
                "releaseDate": release_date,
                "cover": cover,
                "previewUrl": track.get("preview") or None,
                "externalUrl": track.get("link"),
            }

            existing = by_title.get(key)
            if existing is None:
                by_title[key] = candidate
                continue

            # Un mismo tema suele repetirse entre single y álbum: nos quedamos
            # con la versión más antigua, o con la que tenga preview si la otra no.
            candidate_is_older = (candidate["releaseDate"] or "9999") < (existing["releaseDate"] or "9999")
            candidate_has_preview = bool(candidate["previewUrl"]) and not existing["previewUrl"]
            if candidate_is_older or candidate_has_preview:
                by_title[key] = candidate

    tracks = list(by_title.values())
    tracks.sort(key=lambda t: t.get("releaseDate") or "", reverse=True)
    return tracks


class handler(BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802 - nombre exigido por el runtime de Vercel
        try:
            tracks = _fetch_tracks()
            payload = {
                "source": "deezer",
                "artist": ARTIST_NAME,
                "updatedAt": datetime.now(timezone.utc).isoformat(),
                "tracks": tracks,
            }
            body = json.dumps(payload).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Cache-Control", "public, s-maxage=21600, stale-while-revalidate=86400")
            self.end_headers()
            self.wfile.write(body)
        except Exception as exc:  # noqa: BLE001 - nunca queremos un 500 sin cuerpo
            print(f"[salistre-tracks] error: {exc}")
            body = json.dumps({"error": "No se pudo cargar el catálogo de Salistre"}).encode("utf-8")
            self.send_response(502)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(body)
