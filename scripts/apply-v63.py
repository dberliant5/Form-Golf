from pathlib import Path
p=Path('index.html')
s=p.read_text(encoding='utf-8')
if 'assets/driver-v63.css' not in s:
    s=s.replace('<link rel="stylesheet" href="assets/form-responsive.css">','<link rel="stylesheet" href="assets/form-responsive.css">\n<link rel="stylesheet" href="assets/driver-v63.css">')
if 'assets/driver-v63.js' not in s:
    s=s.replace('<script src="assets/app-3.js"></script>','<script src="assets/app-3.js"></script>\n<script src="assets/driver-v63.js"></script>')
p.write_text(s,encoding='utf-8')
