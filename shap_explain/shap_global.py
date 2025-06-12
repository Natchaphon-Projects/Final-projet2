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
def explain_global(status: str):
    try:
        print(f"🔍 สถานะที่ร้องขอ: {status}")
        print("🧾 สถานะทั้งหมดในข้อมูล:", df["Status_personal"].unique())

        # ✅ กรองข้อมูลเฉพาะ status ที่ต้องการ
        subset = df[df["Status_personal"] == status]

        if subset.empty:
            return {"error": f"ไม่พบข้อมูลสำหรับสถานะ '{status}'"}

        # ✅ กรองเฉพาะคอลัมน์ที่อยู่ใน feature_columns
        X = subset[feature_columns].fillna(0)

        # ✅ อธิบายด้วย SHAP TreeExplainer
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(X)

        # ✅ สำหรับ classification → เลือกคลาสที่ตรงกับ status
        status_index = list(label_mapping.values()).index(status)
        shap_class = shap_values[status_index]

        # ✅ คำนวณค่าเฉลี่ย absolute SHAP value ของแต่ละฟีเจอร์
        mean_shap = np.abs(shap_class).mean(axis=0)

        # ✅ เลือก top 5 features ที่สำคัญที่สุด
        top_indices = np.argsort(mean_shap)[::-1][:5]

        result = []
        for idx in top_indices:
            feat = feature_columns[idx]
            result.append({
                "feature": feat,
                "mean_value": float(X.iloc[:, idx].mean()),
                "mean_shap": float(mean_shap[idx])
            })

        return {"top_features": result}

    except Exception as e:
        print("❌ ERROR ใน explain_global:", str(e))
        return {"error": str(e)}
