"""Turn raw generated images into game-ready, compressed PNGs under assets/.

Usage:
    python scripts/process_assets.py SOURCE_IMAGE TARGET [SOURCE_IMAGE TARGET ...]

TARGET is the path under assets/ from docs/ASSETS.md, e.g. backgrounds/bg_title.png
or characters/char_kid1_idle.png.

- backgrounds/: centre-cropped to 3:2 and resized to 1536x1024.
- characters/ and props/: the white background connected to the image border is
  made transparent (with soft edges and shadows kept as partial alpha), and the
  image is resized to 1024x1024 without re-framing, so characters keep the same
  scale as each other.

Every file is then quantised with pngquant and optimised with oxipng.

Needs: pip install pillow numpy scipy pngquant-cli pyoxipng
"""

import subprocess
import sys
from pathlib import Path

import numpy as np
import oxipng
from PIL import Image
from scipy import ndimage

ASSETS = Path(__file__).resolve().parent.parent / 'assets'
BG_SIZE = (1536, 1024)
SPRITE_SIZE = 1024

# Distance from pure white (0-255, max over channels). Below WHITE_LO a border-connected
# pixel is fully transparent; between WHITE_LO and WHITE_HI it fades in.
WHITE_LO = 6
WHITE_HI = 48

# Drawings whose own edges are nearly white need a tighter cut, or they fade out
# along with the background.
WHITE_HI_OVERRIDES = {
    'props/note_paper.png': 24,
}


def background(im: Image.Image) -> Image.Image:
    im = im.convert('RGB')
    w, h = im.size
    target = BG_SIZE[0] / BG_SIZE[1]
    if w / h > target:
        cw, ch = round(h * target), h
    else:
        cw, ch = w, round(w / target)
    left, top = (w - cw) // 2, (h - ch) // 2
    return im.crop((left, top, left + cw, top + ch)).resize(BG_SIZE, Image.LANCZOS)


def remove_white(im: Image.Image, white_hi: int) -> Image.Image:
    rgb = np.asarray(im.convert('RGB')).astype(np.float32)
    dist = (255 - rgb).max(axis=2)

    # Only near-white areas that touch the border count as background, so white
    # details inside the drawing (eye highlights, paper) stay opaque.
    candidate = dist < white_hi
    labels, _ = ndimage.label(candidate)
    border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    bg = np.isin(labels, border[border > 0])

    alpha = np.ones(dist.shape, np.float32)
    alpha[bg] = np.clip((dist[bg] - WHITE_LO) / (white_hi - WHITE_LO), 0, 1)

    # Un-blend from white so semi-transparent edges don't keep a white halo.
    a = np.maximum(alpha, 1e-3)[..., None]
    colour = np.clip((rgb - (1 - a) * 255) / a, 0, 255)

    rgba = np.dstack([colour, alpha * 255]).round().astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')


def sprite(im: Image.Image, white_hi: int) -> Image.Image:
    im = remove_white(im, white_hi)
    side = max(im.size)
    square = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    square.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    return square.resize((SPRITE_SIZE, SPRITE_SIZE), Image.LANCZOS)


def compress(path: Path) -> None:
    subprocess.run(
        ['pngquant', '--quality=70-95', '--speed=1', '--strip', '--force', '--ext', '.png', str(path)],
        check=True,
    )
    oxipng.optimize(path, level=4)


def process(source: Path, target: str) -> Path:
    out = ASSETS / target
    if out.parent.name not in ('backgrounds', 'characters', 'props'):
        sys.exit(f'{target}: must be under backgrounds/, characters/ or props/')
    im = Image.open(source)
    if out.parent.name == 'backgrounds':
        im = background(im)
    else:
        im = sprite(im, WHITE_HI_OVERRIDES.get(target, WHITE_HI))
    out.parent.mkdir(parents=True, exist_ok=True)
    im.save(out)
    compress(out)
    return out


def main(args: list[str]) -> None:
    if not args or len(args) % 2:
        sys.exit(__doc__)
    for source, target in zip(args[::2], args[1::2]):
        out = process(Path(source), target)
        print(f'{target}: {Path(source).stat().st_size // 1024} KB -> {out.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main(sys.argv[1:])
