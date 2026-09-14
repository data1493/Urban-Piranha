#!/usr/bin/env python3
"""Render the Drop 02 lockup: Urban [gothic UP] Piranha.

Exact letters. Blackletter sides, taller UP with a fin/spike between U and P.
Matches the drop2.png still-life layout, readable.
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/Users/batmini/Development/Urban-Piranha")
OUT = ROOT / "public/brand/up/drop02"
FONT_DIR = Path("/tmp/up-fonts")
COOK = FONT_DIR / "UnifrakturCook-Bold.ttf"
MAG = FONT_DIR / "UnifrakturMaguntia.ttf"


def load(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


def spear(draw: ImageDraw.ImageDraw, cx: int, top: int, bottom: int, color) -> None:
    """Vertical piranha-fin spike used as the UP ligature."""
    h = bottom - top
    w = max(10, h // 7)
    # diamond head
    head_h = int(h * 0.28)
    draw.polygon(
        [
            (cx, top),
            (cx + w, top + head_h),
            (cx + w // 3, top + head_h),
            (cx + w // 3, bottom),
            (cx - w // 3, bottom),
            (cx - w // 3, top + head_h),
            (cx - w, top + head_h),
        ],
        fill=color,
    )


def render(color: tuple[int, int, int, int], name: str, scale: int = 4) -> Path:
    # Working canvas, then trim.
    W, H = 2800 * scale // 4, 520 * scale // 4
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    side = load(COOK if COOK.exists() else MAG, int(118 * scale / 4))
    up_font = load(COOK if COOK.exists() else MAG, int(210 * scale / 4))
    dash_font = load(COOK if COOK.exists() else MAG, int(90 * scale / 4))

    urban = "Urban"
    piranha = "Piranha"
    u, p = "U", "P"
    dash = "—"

    def tw(font, text):
        b = d.textbbox((0, 0), text, font=font)
        return b[2] - b[0], b[3] - b[1]

    dash_w, _ = tw(dash_font, dash)
    urban_w, urban_h = tw(side, urban)
    u_w, u_h = tw(up_font, u)
    p_w, p_h = tw(up_font, p)
    pir_w, pir_h = tw(side, piranha)
    gap = int(28 * scale / 4)
    spear_gap = int(36 * scale / 4)
    total = dash_w + gap + urban_w + gap + u_w + spear_gap + p_w + gap + pir_w + gap + dash_w
    x = (W - total) // 2
    baseline = H // 2 + int(70 * scale / 4)

    # vertical center for side words vs UP
    side_y = baseline - urban_h
    up_y = baseline - u_h + int(8 * scale / 4)

    d.text((x, side_y + int(urban_h * 0.15)), dash, font=dash_font, fill=color)
    x += dash_w + gap
    d.text((x, side_y), urban, font=side, fill=color)
    x += urban_w + gap
    u_x = x
    d.text((x, up_y), u, font=up_font, fill=color)
    x += u_w
    spear_cx = x + spear_gap // 2
    spear(d, spear_cx, up_y + int(8 * scale / 4), baseline - int(6 * scale / 4), color)
    x += spear_gap
    d.text((x, up_y), p, font=up_font, fill=color)
    x += p_w + gap
    d.text((x, side_y), piranha, font=side, fill=color)
    x += pir_w + gap
    d.text((x, side_y + int(urban_h * 0.15)), dash, font=dash_font, fill=color)

    bbox = img.getbbox()
    if bbox:
        pad = int(24 * scale / 4)
        l, t, r, b = bbox
        img = img.crop(
            (max(0, l - pad), max(0, t - pad), min(W, r + pad), min(H, b + pad))
        )
    dest = OUT / name
    img.save(dest)
    return dest


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    black = render((0, 0, 0, 255), "wordmark-black.png")
    white = render((255, 255, 255, 255), "wordmark-white.png")
    print(black, Image.open(black).size)
    print(white, Image.open(white).size)


if __name__ == "__main__":
    main()
