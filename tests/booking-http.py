"""Integration test: starts a loopback PHP server; never sends real email."""
import http.cookiejar
import json
import os
from pathlib import Path
import socket
import subprocess
import tempfile
import time
from datetime import date, timedelta
from urllib.request import build_opener, HTTPCookieProcessor, Request
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parents[1]
with tempfile.TemporaryDirectory(prefix="imejr-booking-http-") as private:
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        port = sock.getsockname()[1]
    origin = f"http://127.0.0.1:{port}"
    password_hash = subprocess.check_output(["php", "-r", "echo password_hash('Integration-only-passphrase', PASSWORD_DEFAULT);"], text=True)
    config = Path(private) / "booking.php"
    config.write_text("<?php return ['environment'=>'development','secret'=>str_repeat('x',64),'admins'=>['tester'=>'" + password_hash + "'],'origins'=>['" + origin + "'],'storage_dir'=>__DIR__,'blocked_dates'=>[]];")
    config.chmod(0o600)
    env = dict(os.environ, IMEJR_BOOKING_CONFIG=str(config))
    server = subprocess.Popen(["php", "-S", f"127.0.0.1:{port}", "-t", "out", "scripts/booking-preview.php"], cwd=ROOT, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    admin = build_opener(HTTPCookieProcessor(http.cookiejar.CookieJar()))
    client = build_opener(HTTPCookieProcessor(http.cookiejar.CookieJar()))

    def call(opener, path, body=None, expected=200, custom_origin=origin):
        request = Request(origin + path, data=json.dumps(body).encode() if body is not None else None, headers={"Content-Type": "application/json", "Origin": custom_origin})
        try:
            response = opener.open(request, timeout=10)
        except HTTPError as error:
            response = error
        payload = json.loads(response.read())
        assert response.code == expected, (path, response.code, expected, payload)
        assert "no-store" in response.headers["Cache-Control"]
        return payload, response.headers

    try:
        for attempt in range(40):
            try:
                state, headers = call(admin, "/api/booking-admin.php")
                break
            except URLError:
                time.sleep(0.1)
        else:
            raise RuntimeError("PHP server did not start")
        assert not state["authenticated"] and "requests" not in state
        assert "HttpOnly" in headers.get("Set-Cookie", "") and "SameSite=Strict" in headers.get("Set-Cookie", "")
        call(admin, "/api/booking-admin.php", {"action": "add", "csrf": state["csrf"]}, 401)
        call(admin, "/api/booking-admin.php", {"action": "login", "csrf": "wrong"}, 403)
        call(client, "/api/booking.php", expected=403, custom_origin="https://attacker.example")
        call(admin, "/api/booking-admin.php", {"action": "login", "csrf": state["csrf"], "user": "tester", "password": "wrong"}, 401)
        logged, _ = call(admin, "/api/booking-admin.php", {"action": "login", "csrf": state["csrf"], "user": "tester", "password": "Integration-only-passphrase"})
        assert logged["csrf"] != state["csrf"]
        csrf = logged["csrf"]
        central, _ = call(admin, "/api/admin.php")
        assert central["authenticated"] and central["selection"]["revision"] == 0
        draft, _ = call(client, "/api/selection.php")
        assert draft == {"published": False}
        anonymous, _ = call(client, "/api/admin.php")
        call(client, "/api/admin.php", {"action": "selection-settings", "csrf": anonymous["csrf"], "revision": 0}, 401)
        def change_selection(action, **payload):
            current, _ = call(admin, "/api/admin.php")
            return call(admin, "/api/admin.php", dict(payload, action=action, csrf=csrf, revision=current["selection"]["revision"]))
        change_selection("selection-settings", title="Materiais do Processo Seletivo", edition="2026.2", introduction="Orientações para os cases.")
        bad, _ = call(admin, "/api/admin.php", {"action": "selection-save-resource", "csrf": csrf, "revision": 1, "id": "", "title": "Case A", "description": "", "kind": "case", "url": "javascript:alert(1)", "visible": True}, 422)
        change_selection("selection-save-resource", id="", title="Case A", description="Primeiro case", kind="case", url="https://example.org/case-a", visible=True)
        change_selection("selection-save-resource", id="", title="Modelo interno", description="Rascunho", kind="modelo", url="https://example.org/modelo", visible=False)
        draft, _ = call(client, "/api/selection.php")
        assert draft == {"published": False}
        change_selection("selection-publish", published=True)
        published, _ = call(client, "/api/selection.php")
        assert published["published"] and len(published["resources"]) == 1 and published["resources"][0]["title"] == "Case A"
        assert "https://example.org/modelo" not in json.dumps(published)
        current, _ = call(admin, "/api/admin.php")
        hidden_id = current["selection"]["resources"][1]["id"]
        change_selection("selection-toggle-resource", id=hidden_id)
        change_selection("selection-move-resource", id=hidden_id, direction="up")
        reordered, _ = call(client, "/api/selection.php")
        assert reordered["resources"][0]["id"] == hidden_id
        change_selection("selection-remove-resource", id=hidden_id)
        remaining, _ = call(client, "/api/selection.php")
        assert len(remaining["resources"]) == 1
        change_selection("selection-publish", published=False)
        hidden, _ = call(client, "/api/selection.php")
        assert hidden == {"published": False}
        call(admin, "/api/admin.php", {"action": "selection-settings", "csrf": csrf, "revision": 0}, 409)
        day = date.today() + timedelta(days=1)
        holidays = {"01-01", "04-21", "05-01", "09-07", "10-12", "11-02", "11-15", "11-20", "12-25"}
        while day.weekday() >= 5 or day.strftime("%m-%d") in holidays:
            day += timedelta(days=1)
        assert state["first_day"] in state["business_dates"] and state["first_day"] > state["today"]
        invalid, _ = call(admin, "/api/booking-admin.php", {"action": "add", "csrf": csrf, "from": state["today"], "until": state["today"], "start": "09:00", "end": "11:00", "area": "geral"}, 422)
        assert "data inicial" in invalid["message"]
        added, _ = call(admin, "/api/booking-admin.php", {"action": "add", "csrf": csrf, "from": str(day), "until": str(day), "start": "09:00", "end": "11:00", "area": "geral"})
        assert added["created_count"] == 4
        duplicate_range, _ = call(admin, "/api/booking-admin.php", {"action": "add", "csrf": csrf, "from": str(day), "until": str(day), "start": "09:00", "end": "11:00", "area": "geral"})
        assert duplicate_range["created_count"] == 0 and "Nenhum horário novo" in duplicate_range["message"]
        available, _ = call(client, "/api/booking.php?area=computacao")
        assert len(available["slots"]) == 4
        body = {"csrf": available["csrf"], "name": "Client Test", "email": "test@example.org", "organization": "Integration test", "description": "Projeto de teste para validar o fluxo completo de agendamento.", "area": "computacao", "links": "https://example.org/reference", "consent": True, "slots": [s["id"] for s in available["slots"][:2]], "key": "c" * 32}
        call(client, "/api/booking.php", dict(body, links="javascript:alert(1)"), 422)
        created, _ = call(client, "/api/booking.php", body, 201)
        repeated, _ = call(client, "/api/booking.php", body)
        assert created["reference"] == repeated["reference"]
        call(client, "/api/booking.php", body, 429)
        state, _ = call(admin, "/api/booking-admin.php")
        assert state["authenticated"] and "requests" not in state
        saved = (Path(private) / "booking-data.json").read_text()
        assert "test@example.org" not in saved and "Client Test" not in saved
        assert "requests" not in json.loads(saved)
        assert list(json.loads(saved)["deliveries"].values())[0]["status"] == "sent"
        assert len(list(Path(private).glob("email-*.html"))) == 1
        call(admin, "/api/booking-admin.php", {"action": "toggle", "csrf": csrf, "id": available["slots"][0]["id"]})
        after, _ = call(client, "/api/booking.php?area=computacao")
        assert len(after["slots"]) == 3
        call(admin, "/api/booking-admin.php", {"action": "toggle", "csrf": csrf, "id": available["slots"][0]["id"]})
        reopened, _ = call(client, "/api/booking.php?area=computacao")
        assert len(reopened["slots"]) == 4 and all("updated_by" not in slot for slot in reopened["slots"])
        call(admin, "/api/booking-admin.php", {"action": "close-day", "csrf": csrf, "date": str(day)})
        closed, _ = call(client, "/api/booking.php?area=computacao")
        assert len(closed["slots"]) == 0
        call(admin, "/api/booking-admin.php", {"action": "logout", "csrf": csrf})
        state, _ = call(admin, "/api/booking-admin.php")
        assert not state["authenticated"] and "requests" not in state
        print("OK HTTP: login compartilhado, CSRF, processo seletivo, publicação e ocultação, calendário, e-mail sem histórico e logout.")
    finally:
        server.terminate()
        server.wait(timeout=5)
