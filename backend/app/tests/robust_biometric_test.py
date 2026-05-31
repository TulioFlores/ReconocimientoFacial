import os
import time
import numpy as np
import cv2
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import fetch_lfw_people
from sklearn.metrics import roc_curve, auc, confusion_matrix, accuracy_score

from app.services.face_service import extract_facial_encoding, compare_facial_encodings

def run_robust_biometric_experiment(pairs_per_class=500):
    print("\n" + "="*60)
    print("FASE 1 AVANZADA: VALIDACIÓN ESTADÍSTICA RIGUROSA")
    print(f"Objetivo: Evaluar {pairs_per_class * 2} pares ({pairs_per_class} Genuinos / {pairs_per_class} Impostores)")
    print("="*60)
    
    print("\n1. Descargando / Cargando Dataset LFW (min 2 fotos por persona)...")
    t0 = time.time()
    lfw = fetch_lfw_people(min_faces_per_person=2, resize=1.0, color=True)
    X, y = lfw.images, lfw.target
    print(f"Dataset listo en {time.time() - t0:.2f} segundos.")
    
    people_map = {}
    for idx, person_id in enumerate(y):
        if person_id not in people_map: people_map[person_id] = []
        people_map[person_id].append(idx)
    
    candidates = [p for p in people_map if len(people_map[p]) >= 2]
    
    y_true = []
    y_scores = [] # Guardaremos las distancias
    
    extraction_times = []
    comparison_times = []

    print("\n2. Procesando Pares Genuinos (Misma Persona)...")
    genuine_count = 0
    # Usamos un while para asegurar que procesamos la cantidad exacta si hay fallos (ej. rostros no detectados)
    # limitamos a 3 veces la cantidad de pares por si no hay suficientes
    attempts = 0
    while genuine_count < pairs_per_class and attempts < pairs_per_class * 3:
        attempts += 1
        person_id = np.random.choice(candidates)
        idx1, idx2 = np.random.choice(people_map[person_id], 2, replace=False)
        
        try:
            img1 = (X[idx1] * 255).astype('uint8') if X[idx1].max() <= 1.0 else X[idx1].astype('uint8')
            img2 = (X[idx2] * 255).astype('uint8') if X[idx2].max() <= 1.0 else X[idx2].astype('uint8')
            img1_bgr, img2_bgr = cv2.cvtColor(img1, cv2.COLOR_RGB2BGR), cv2.cvtColor(img2, cv2.COLOR_RGB2BGR)
            
            t_ext0 = time.time()
            enc1 = extract_facial_encoding(img1_bgr)
            enc2 = extract_facial_encoding(img2_bgr)
            t_ext1 = time.time()
            extraction_times.append((t_ext1 - t_ext0) / 2) # Tiempo por 1 imagen
            
            t_comp0 = time.time()
            dist = compare_facial_encodings(enc1, enc2)
            t_comp1 = time.time()
            comparison_times.append(t_comp1 - t_comp0)
            
            # Guardamos la distancia. Como roc_curve asume que valores más altos = positivo (mismo sujeto),
            # y en distancia menor = positivo, usaremos -dist o 1-dist para las métricas
            y_scores.append(dist)
            y_true.append(1) # 1 = Genuino
            genuine_count += 1
            
            if genuine_count % 50 == 0:
                print(f"   [{genuine_count}/{pairs_per_class}] pares genuinos procesados...")
        except Exception as e:
            continue

    print("\n3. Procesando Pares Impostores (Diferentes Personas)...")
    impostor_count = 0
    attempts = 0
    while impostor_count < pairs_per_class and attempts < pairs_per_class * 3:
        attempts += 1
        p1, p2 = np.random.choice(list(people_map.keys()), 2, replace=False)
        idx1, idx2 = np.random.choice(people_map[p1]), np.random.choice(people_map[p2])
        
        try:
            img1 = (X[idx1] * 255).astype('uint8') if X[idx1].max() <= 1.0 else X[idx1].astype('uint8')
            img2 = (X[idx2] * 255).astype('uint8') if X[idx2].max() <= 1.0 else X[idx2].astype('uint8')
            img1_bgr, img2_bgr = cv2.cvtColor(img1, cv2.COLOR_RGB2BGR), cv2.cvtColor(img2, cv2.COLOR_RGB2BGR)
            
            t_ext0 = time.time()
            enc1 = extract_facial_encoding(img1_bgr)
            enc2 = extract_facial_encoding(img2_bgr)
            t_ext1 = time.time()
            extraction_times.append((t_ext1 - t_ext0) / 2)
            
            t_comp0 = time.time()
            dist = compare_facial_encodings(enc1, enc2)
            t_comp1 = time.time()
            comparison_times.append(t_comp1 - t_comp0)
            
            y_scores.append(dist)
            y_true.append(0) # 0 = Impostor
            impostor_count += 1
            
            if impostor_count % 50 == 0:
                print(f"   [{impostor_count}/{pairs_per_class}] pares impostores procesados...")
        except Exception as e:
            continue

    print("\n" + "="*60)
    print("RESULTADOS DE RENDIMIENTO Y LATENCIA")
    print("="*60)
    avg_ext_time = np.mean(extraction_times) * 1000 # a ms
    avg_comp_time = np.mean(comparison_times) * 1000 # a ms
    print(f"Total Pares Analizados: {genuine_count + impostor_count}")
    print(f"Tiempo Promedio de Extracción por Rostro: {avg_ext_time:.2f} ms")
    print(f"Tiempo Promedio de Comparación por Par: {avg_comp_time:.2f} ms")
    print(f"Tiempo Total de Inferencia del Motor IA: {avg_ext_time + avg_comp_time:.2f} ms")
    
    # 4. Análisis de Threshold y Curva ROC
    # Para roc_curve, un valor score MÁS ALTO debe predecir la clase positiva (1).
    # Como la distancia es MENOR para la clase positiva, invertimos la distancia:
    y_scores_inverted = 1.0 - np.array(y_scores)
    
    fpr, tpr, thresholds_inverted = roc_curve(y_true, y_scores_inverted)
    roc_auc = auc(fpr, tpr)
    
    # Restauramos los thresholds a distancias reales
    thresholds = 1.0 - thresholds_inverted
    
    # Buscar el threshold óptimo (El que minimiza la distancia al punto 0,1 ideal)
    optimal_idx = np.argmin(np.sqrt(fpr**2 + (1-tpr)**2))
    optimal_threshold = thresholds[optimal_idx]
    
    print("\n" + "="*60)
    print("ANÁLISIS ESTADÍSTICO - OPTIMIZACIÓN DE THRESHOLD")
    print("="*60)
    print(f"AUC (Área bajo la curva ROC): {roc_auc:.4f}")
    print(f"Umbral (Threshold) Óptimo Encontrado: {optimal_threshold:.4f}")
    
    # Evaluar métricas con el threshold óptimo
    y_pred = [1 if dist <= optimal_threshold else 0 for dist in y_scores]
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    
    acc = (tp + tn) / len(y_true)
    far = fp / (fp + tn) if (fp + tn) > 0 else 0
    frr = fn / (fn + tp) if (fn + tp) > 0 else 0
    
    print(f"\nMétricas con Threshold Óptimo ({optimal_threshold:.4f}):")
    print(f"Accuracy (Precisión Global): {acc*100:.2f}%")
    print(f"FAR (Falsos Positivos): {far*100:.2f}%")
    print(f"FRR (Falsos Negativos): {frr*100:.2f}%")
    
    # Generar y guardar gráfica ROC
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.4f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.scatter([fpr[optimal_idx]], [tpr[optimal_idx]], color='red', marker='o', label=f'Optimal Thresh = {optimal_threshold:.2f}')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate (FAR)')
    plt.ylabel('True Positive Rate (1-FRR)')
    plt.title('Curva ROC (Receiver Operating Characteristic)')
    plt.legend(loc="lower right")
    plt.grid(True)
    
    # Generar y guardar Matriz de Confusión
    plt.subplot(1, 2, 2)
    sns.heatmap([[tn, fp], [fn, tp]], annot=True, fmt='d', cmap='Blues', 
                xticklabels=['Impostor', 'Genuino'], 
                yticklabels=['Impostor', 'Genuino'])
    plt.xlabel('Predicción del Modelo')
    plt.ylabel('Identidad Real')
    plt.title(f'Matriz Confusión (Thresh: {optimal_threshold:.2f})\nPrecisión: {acc*100:.2f}%')
    
    plt.tight_layout()
    plt.savefig("/app/metricas_robustas_roc.png")
    print("\n[Éxito] Gráficas ROC y Matriz de Confusión guardadas en: /app/metricas_robustas_roc.png")
    print("="*60 + "\n")

if __name__ == "__main__":
    # Puedes cambiar pairs_per_class a 50, 100, 500, etc.
    # 1000 significa 1000 VP y 1000 VN = 2000 pruebas.
    run_robust_biometric_experiment(pairs_per_class=1000)
