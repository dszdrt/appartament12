import urllib.request
import re

url = "https://apartments12.ru"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        print(f"HTML length: {len(html)}")
        matches = re.findall(r'(?:href|src)="(/_next/static/[^"]+)"', html)
        print("Found static assets:")
        for m in matches[:10]:
            print("  ", m)
except Exception as e:
    print(f"Error: {e}")
