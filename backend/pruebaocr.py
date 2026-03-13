from paddleocr import PaddleOCR
import re

print("Cargando modelo...")
# Agregamos enable_mkldnn=False para apagar el acelerador de Intel que causa el error
ocr = PaddleOCR(use_angle_cls=True, lang='es', enable_mkldnn=False)

# Usamos la imagen
resultado = ocr.ocr('WhatsApp Image 2026-03-12 at 8.45.07 AM.jpeg')

texto_completo = " ".join([line[1][0] for res in resultado for line in res])
print("\nTexto detectado:", texto_completo)

match_curp = re.search(r'[A-Z]{4}\d{6}[A-Z]{6}[A-Z0-9]{2}', texto_completo)
if match_curp:
    print(f"\n✅ CURP Detectada: {match_curp.group(0)}")
else:
    print("\n❌ No se detectó la CURP")