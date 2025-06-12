import shap
import pandas as pd
import pickle
import numpy as np
from fastapi import APIRouter
import mysql.connector
import joblib

router = APIRouter()


# ✅ โหลด model และ metadata
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

# ✅ ดึงข้อมูลผู้ป่วยล่าสุดจาก MySQL
def get_patient_data_from_db(patient_id):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="child_malnutrition"
    )
    cursor = conn.cursor(dictionary=True)
    query = """
        SELECT * FROM prediction
        WHERE patient_id = %s
        ORDER BY created_at DESC
        LIMIT 1
    """
    cursor.execute(query, (patient_id,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()

    if result:
        for key in ["created_at", "prediction_id", "patient_id", "weight", "height", "status", "Food_allergy", "drug_allergy", "congenital_disease"]:
            result.pop(key, None)
        return result
    else:
        return None

# ✅ Endpoint อธิบาย SHAP แบบ local
@router.get("/shap/local/{patient_id}")
def explain_local(patient_id: int):
    try:
        print(f"📌 กำลังโหลดข้อมูลของผู้ป่วย ID: {patient_id}")
        patient_data = get_patient_data_from_db(patient_id)
        if patient_data is None:
            return {"error": "ไม่พบข้อมูลผู้ป่วย"}

        # ✅ เติมค่า 0 + แปลงค่าด้วย LabelEncoder ถ้ามีใน mapping
        for col in feature_columns:
            if col not in patient_data or patient_data[col] is None:
                patient_data[col] = 0
            elif col in label_mapping:
                encoder = label_mapping[col]
                try:
                    patient_data[col] = encoder.transform([patient_data[col]])[0]
                except:
                    print(f"⚠️ แปลงค่า {col} = {patient_data[col]} ไม่ได้ → ตั้งค่าเป็น 0")
                    patient_data[col] = 0

        # ✅ เตรียม DataFrame สำหรับ SHAP
        df_input = pd.DataFrame([patient_data])[feature_columns]
        print("✅ DataFrame ที่ส่งเข้า SHAP:", df_input.shape)
        print("📄 Preview df_input:\n", df_input.head())

        # ✅ เรียกใช้งาน TreeExplainer
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(df_input)

        # ✅ ตรวจว่า model เป็น multiclass หรือ binary
        if isinstance(shap_values, list):
            y_pred = model.predict(df_input)
            print(f"🔍 Predict raw result: {y_pred}")
            pred_class = int(y_pred[0]) if isinstance(y_pred, (list, np.ndarray)) else int(y_pred)

            print(f"🎯 Predict class: {pred_class}")

            if pred_class >= len(shap_values):
                print(f"⚠️ Predict class {pred_class} เกิน index → ใช้ class 0")
                pred_class = 0

            shap_patient = shap_values[pred_class][0]
        else:
            shap_patient = shap_values[0]

        # ✅ Flatten เพื่อความมั่นใจว่าเป็น array 1 มิติ
        shap_patient = np.array(shap_patient).flatten()
        print("📌 shap_patient shape:", shap_patient.shape)
        print("📌 shap_patient preview:", shap_patient[:5])

        # 🔝 Top 5 features
        top_indexes = np.argsort(shap_patient)[::-1]  # เรียงจากค่ามาก → น้อย ตามทิศทางจริง

        result = []
        for i in top_indexes:
            feat = feature_columns[i]
            result.append({
                "feature": feat,
                "value": float(df_input.iloc[0][feat]),
                "shap": float(shap_patient[i]),
            })


        return {"top_features": result}

    except Exception as e:
        import traceback
        traceback.print_exc()
        print("❌ SHAP Local Error:", str(e))
        return {"error": str(e)}
