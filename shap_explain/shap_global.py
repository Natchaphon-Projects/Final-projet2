import shap
import pandas as pd
import pickle
import numpy as np
from fastapi import APIRouter
import joblib

router = APIRouter()

# ✅ โหลด model, columns, mapping, และ CSV
try:
    model = joblib.load("src/model/best_model.joblib")
    with open("src/model/columns.pkl", "rb") as f:
        feature_columns = pickle.load(f)
    with open("src/model/mapping.pkl", "rb") as f:
        label_mapping = pickle.load(f)
    df = pd.read_csv("src/data/Real_Child_malnutrition.csv")
    print("✅ Loaded model and dataset successfully")
except Exception as e:
    print("❌ ERROR while loading model or data:", e)
    raise e

# ✅ Endpoint อธิบาย global shap โดยใช้ค่าจากเด็กที่เป็น Normal
@router.get("/shap/global/{status}")
def explain_global(status: str):  # เช่น 'Normal'
    try:
        subset_df = df[df["status"] == status].copy()
        X = subset_df[feature_columns].copy()

        # ✅ Apply LabelEncoder ตาม mapping
        for col in feature_columns:
            if col in label_mapping:
                encoder = label_mapping[col]
                try:
                    X[col] = encoder.transform(X[col])
                except:
                    X[col] = 0  # fallback เผื่อ transform ไม่ได้

        # ✅ สร้าง SHAP explainer และคำนวณค่า shap
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X)

        if isinstance(shap_values, list):  # multiclass
            label_index = list(model.classes_).index(status)
            shap_vals = shap_values[label_index]
        else:
            shap_vals = shap_values

        # ✅ ค่ามาตรฐาน: ดึงค่าของ feature จากเด็กที่ shap สูงสุดในฝั่งบวก
        result = {}
        for i, feature in enumerate(feature_columns):
            shap_column = shap_vals[:, i]
            max_index = np.argmax(shap_column)  # หาค่า SHAP ที่มากที่สุด
            max_shap = shap_column[max_index]

            if max_shap > 0:  # เฉพาะฟีเจอร์ที่สนับสนุน class นี้
                result[feature] = float(X.iloc[max_index][feature])

        return result  # ✅ ส่งไปให้ frontend เป็น globalAverages

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": str(e)}
