import shap
import pandas as pd
import pickle
import numpy as np
from fastapi import APIRouter
import joblib

router = APIRouter()

# ✅ โหลด model, columns, mapping, และ CSV
try:
    joblib.load("src/model/best_model.joblib")
    with open("src/model/columns.pkl", "rb") as f:
        feature_columns = pickle.load(f)
    with open("src/model/mapping.pkl", "rb") as f:
        label_mapping = pickle.load(f)
    df = pd.read_csv("src/data/Real_Child_malnutrition.csv")
    print("✅ Loaded model and dataset successfully")
except Exception as e:
    print("❌ ERROR while loading model or data:", e)
    raise e

# ✅ Endpoint อธิบาย global shap
@router.get("/shap/global/{status}")
def explain_global(status: str):  # เช่น status = 'Normal'
    try:
        # ✅ กรองเฉพาะแถวที่มีสถานะตรงกับที่ระบุ เช่น 'Normal'
        subset_df = df[df["status"] == status]

        # ✅ เตรียม X สำหรับ SHAP
        X = subset_df[feature_columns].copy()

        # ✅ ทำ label encoding ตาม mapping ที่ใช้กับ model
        for col in feature_columns:
            if col in label_mapping:
                encoder = label_mapping[col]
                try:
                    X[col] = encoder.transform(X[col])
                except:
                    X[col] = 0  # fallback

        # ✅ ใช้ SHAP อธิบายแบบ Global
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X)

        # ✅ หากเป็น multiclass → เอาเฉพาะ class ที่สนใจ
        if isinstance(shap_values, list):
            label_index = list(model.classes_).index(status)
            shap_vals = shap_values[label_index]
        else:
            shap_vals = shap_values

        # ✅ คำนวณค่าความสำคัญเฉลี่ยแต่ละ feature
        mean_shap = np.abs(shap_vals).mean(axis=0)
        top_indices = np.argsort(mean_shap)[::-1][:5]

        result = []
        for i in top_indices:
            feat = feature_columns[i]
            result.append({
                "feature": feat,
                "mean_value": float(X[feat].mean()),
                "shap_value": float(mean_shap[i])
            })

        return {"global_features": result}

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}
