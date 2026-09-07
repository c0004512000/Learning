from __future__ import annotations

import shutil
import time
import urllib.request
from playwright.sync_api import sync_playwright

BASE = "https://c0004512000.github.io/Learning/Skill/Learning/Test/v3/"


def wait_for_pages() -> None:
    last = None
    for _ in range(30):
        try:
            with urllib.request.urlopen(BASE + "index.html", timeout=10) as r:
                body = r.read().decode("utf-8", errors="replace")
                if r.status == 200 and "Linux Namespace" in body:
                    return
                last = f"status={r.status}"
        except Exception as e:
            last = repr(e)
        time.sleep(5)
    raise RuntimeError(f"GitHub Pages did not become ready: {last}")


def run_flow(page) -> None:
    errors: list[str] = []
    failed_responses: list[str] = []

    page.on("pageerror", lambda exc: errors.append(f"pageerror: {exc}"))
    page.on(
        "response",
        lambda response: failed_responses.append(
            f"{response.status} {response.url}"
        )
        if response.status >= 400
        else None,
    )

    response = page.goto(BASE + "index.html", wait_until="networkidle")
    assert response and response.status == 200
    assert page.locator("h1").inner_text() == "Linux Namespace"
    assert page.locator("a.milestone").count() == 4

    page.locator('a[href="milestones/01-linux-isolation-foundation.html"]').click()
    page.wait_for_load_state("networkidle")
    assert page.url.endswith("/milestones/01-linux-isolation-foundation.html")
    assert page.locator("a.card-link").count() == 3

    page.locator('a[href="../lessons/0001-why-linux-namespaces-exist.html"]').click()
    page.wait_for_load_state("networkidle")
    assert page.url.endswith("/lessons/0001-why-linux-namespaces-exist.html")

    page.locator('a[href="../reference/process-and-kernel.html#from-lesson-1"]').click()
    page.wait_for_load_state("networkidle")
    assert page.url.endswith("/reference/process-and-kernel.html#from-lesson-1")

    page.locator('a[href="../lessons/0001-why-linux-namespaces-exist.html#after-process-reference"]').click()
    page.wait_for_load_state("networkidle")
    assert page.url.endswith("/lessons/0001-why-linux-namespaces-exist.html#after-process-reference")

    toggle = page.locator(".theme-toggle")
    assert toggle.count() == 1
    before = page.locator("html").get_attribute("data-theme")
    toggle.click()
    after = page.locator("html").get_attribute("data-theme")
    assert after in {"light", "dark"} and after != before

    page.goto(BASE + "index.html", wait_until="networkidle")
    page.locator('a[href="reference/index.html"]').click()
    page.wait_for_load_state("networkidle")
    assert page.url.endswith("/reference/index.html")
    assert page.locator(".reference-card").count() == 2

    overflow = page.evaluate(
        "document.documentElement.scrollWidth > document.documentElement.clientWidth"
    )
    assert overflow is False
    assert not errors, errors
    assert not failed_responses, failed_responses


def run_js_disabled(page) -> None:
    failed_responses: list[str] = []
    page.on(
        "response",
        lambda response: failed_responses.append(
            f"{response.status} {response.url}"
        )
        if response.status >= 400
        else None,
    )

    page.goto(BASE + "index.html", wait_until="load")
    page.locator('a[href="milestones/01-linux-isolation-foundation.html"]').click()
    page.wait_for_load_state("load")
    page.locator('a[href="../lessons/0001-why-linux-namespaces-exist.html"]').click()
    page.wait_for_load_state("load")
    page.locator('a[href="../reference/procfs-lifecycle.html#from-lesson-1"]').click()
    page.wait_for_load_state("load")
    assert page.url.endswith("/reference/procfs-lifecycle.html#from-lesson-1")
    page.locator('a[href="../lessons/0001-why-linux-namespaces-exist.html#after-procfs-reference"]').click()
    page.wait_for_load_state("load")
    assert page.url.endswith("/lessons/0001-why-linux-namespaces-exist.html#after-procfs-reference")
    assert not failed_responses, failed_responses


wait_for_pages()
with sync_playwright() as p:
    executable = (
        shutil.which("google-chrome")
        or shutil.which("chromium")
        or shutil.which("chromium-browser")
    )
    if not executable:
        raise RuntimeError("No Chrome/Chromium executable found on runner")
    browser = p.chromium.launch(
        headless=True, executable_path=executable, args=["--no-sandbox"]
    )
    for name, viewport in (
        ("desktop", {"width": 1280, "height": 900}),
        ("mobile", {"width": 390, "height": 844}),
    ):
        context = browser.new_context(viewport=viewport, color_scheme="dark")
        run_flow(context.new_page())
        print(f"{name}: PASS")
        context.close()
    context = browser.new_context(
        viewport={"width": 390, "height": 844},
        java_script_enabled=False,
        color_scheme="dark",
    )
    run_js_disabled(context.new_page())
    print("js-disabled fallback: PASS")
    context.close()
    browser.close()
