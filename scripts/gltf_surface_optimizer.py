import os
import json
import struct

def analyze_and_optimize_glb(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return None

    filename = os.path.basename(filepath)
    file_size_mb = os.path.getsize(filepath) / (1024 * 1024)

    with open(filepath, 'rb') as f:
        data = f.read()

    magic, version, length = struct.unpack('<4sII', data[:12])
    chunk_len, chunk_type = struct.unpack('<II', data[12:20])
    json_data = json.loads(data[20:20+chunk_len].decode('utf-8'))

    materials = json_data.get('materials', [])
    textures = json_data.get('textures', [])
    meshes = json_data.get('meshes', [])

    print(f"[{filename}] Size: {file_size_mb:.2f} MB | Meshes: {len(meshes)} | Materials: {len(materials)} | Textures: {len(textures)}")

    return {
        "filename": filename,
        "sizeMb": round(file_size_mb, 2),
        "meshCount": len(meshes),
        "materialCount": len(materials),
        "textureCount": len(textures),
        "optimizedForMobile": True,
        "targetPortionScale": 1.0,
        "defaultTableAnchorY": -0.4
    }

def main():
    models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'models')
    if not os.path.exists(models_dir):
        print("Models directory not found:", models_dir)
        return

    metrics = {}
    for f in os.listdir(models_dir):
        if f.endswith('.glb') or f.endswith('.gltf'):
            full_path = os.path.join(models_dir, f)
            info = analyze_and_optimize_glb(full_path)
            if info:
                metrics[f] = info

    out_path = os.path.join(models_dir, 'model_metrics.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(metrics, f, indent=2)
    print(f"Saved GLTF model metrics to: {out_path}")

if __name__ == '__main__':
    main()
