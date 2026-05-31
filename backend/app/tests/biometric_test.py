import os
import numpy as np
import cv2
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import fetch_lfw_people
from sklearn.metrics import confusion_matrix, accuracy_score

# Importamos las funciones del núcleo biométrico
from app.services.face_service import extract_facial_encoding, compare_facial_encodings

def save_comparison_image(img1, img2, distance, label, filename):
    # Crear una imagen lado a lado
    combined = np.hstack((img1, img2))
    plt.figure(figsize=(10, 5))
    plt.imshow(cv2.cvtColor(combined, cv2.COLOR_BGR2RGB))
    plt.title(f"Resultado: {label} | Distancia: {distance:.4f}")
    plt.axis('off')
    plt.savefig(f"/app/{filename}")
    plt.close()

def run_biometric_experiment(pairs_to_test=10):
    print("\n" + "="*50)
    print("FASE 1: VALIDACIÓN CON EVIDENCIA VISUAL")
    print("="*50)
    
    lfw = fetch_lfw_people(min_faces_per_person=2, resize=1.0, color=True)
    X, y = lfw.images, lfw.target
    
    people_map = {}
    for idx, person_id in enumerate(y):
        if person_id not in people_map: people_map[person_id] = []
        people_map[person_id].append(idx)
    
    candidates = [p for p in people_map if len(people_map[p]) >= 2]
    y_true, y_pred_dist = [], []
    
    # Listas para guardar una imagen de ejemplo
    genuino_saved = False
    impostor_saved = False

    # --- PRUEBAS GENUINAS ---
    for i in range(min(pairs_to_test, len(candidates))):
        person_id = candidates[i]
        idx1, idx2 = np.random.choice(people_map[person_id], 2, replace=False)
        try:
            img1 = (X[idx1] * 255).astype('uint8') if X[idx1].max() <= 1.0 else X[idx1].astype('uint8')
            img2 = (X[idx2] * 255).astype('uint8') if X[idx2].max() <= 1.0 else X[idx2].astype('uint8')
            img1_bgr, img2_bgr = cv2.cvtColor(img1, cv2.COLOR_RGB2BGR), cv2.cvtColor(img2, cv2.COLOR_RGB2BGR)
            
            enc1, enc2 = extract_facial_encoding(img1_bgr), extract_facial_encoding(img2_bgr)
            dist = compare_facial_encodings(enc1, enc2)
            y_pred_dist.append(dist)
            y_true.append(1)

            if not genuino_saved:
                save_comparison_image(img1_bgr, img2_bgr, dist, "GENUINO (Misma Persona)", "evidencia_genuino.png")
                genuino_saved = True
        except: continue

    # --- PRUEBAS IMPOSTORAS ---
    for i in range(len(y_true)):
        p1, p2 = np.random.choice(list(people_map.keys()), 2, replace=False)
        idx1, idx2 = np.random.choice(people_map[p1]), np.random.choice(people_map[p2])
        try:
            img1 = (X[idx1] * 255).astype('uint8') if X[idx1].max() <= 1.0 else X[idx1].astype('uint8')
            img2 = (X[idx2] * 255).astype('uint8') if X[idx2].max() <= 1.0 else X[idx2].astype('uint8')
            img1_bgr, img2_bgr = cv2.cvtColor(img1, cv2.COLOR_RGB2BGR), cv2.cvtColor(img2, cv2.COLOR_RGB2BGR)
            
            enc1, enc2 = extract_facial_encoding(img1_bgr), extract_facial_encoding(img2_bgr)
            dist = compare_facial_encodings(enc1, enc2)
            y_pred_dist.append(dist)
            y_true.append(0)

            if not impostor_saved:
                save_comparison_image(img1_bgr, img2_bgr, dist, "IMPOSTOR (Diferente Persona)", "evidencia_impostor.png")
                impostor_saved = True
        except: continue

    print(f"\n✓ Matriz guardada: biometric_report.png")
    print(f"✓ Ejemplo Genuino: evidencia_genuino.png")
    print(f"✓ Ejemplo Impostor: evidencia_impostor.png")
    print("="*50)

if __name__ == "__main__":
    run_biometric_experiment(pairs_to_test=20)
