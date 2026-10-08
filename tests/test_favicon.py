"""Checks the requested favicon background rules without image dependencies."""
import struct
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class FaviconRules(unittest.TestCase):
    def test_light_mode_uses_opaque_icon(self):
        source = (ROOT / "src/routes/__root.tsx").read_text()
        self.assertRegex(source, r'href: "/favicon-hm-centered.png", media: "\(prefers-color-scheme: light\)"')
        png = (ROOT / "public/favicon-hm-centered.png").read_bytes()
        self.assertEqual(png[25], 2)  # RGB, no transparency channel
        self.assertEqual(struct.unpack(">II", png[16:24]), (96, 96))

    def test_dark_mode_uses_transparent_icon(self):
        source = (ROOT / "src/routes/__root.tsx").read_text()
        self.assertRegex(source, r'href: "/favicon-hm-transparent.png", media: "\(prefers-color-scheme: dark\)"')
        png = (ROOT / "public/favicon-hm-transparent.png").read_bytes()
        self.assertEqual(png[25], 6)  # RGBA, transparency channel
        self.assertEqual(struct.unpack(">II", png[16:24]), (96, 96))


if __name__ == "__main__":
    unittest.main()