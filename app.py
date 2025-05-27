from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from joblib import load
import numpy as np
import pandas as pd
import os

app = FastAPI()

# เปิดใช้งาน CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# static directory (เผื่อใช้)
if not os.path.exists("static"):
    os.makedirs("static")
app.mount("/static", StaticFiles(directory="static"), name="static")

# โหลดโมเดลและข้อมูลที่ใช้
try:
    model = load('src/model/best_model.pkl')
    columns = load('src/model/columns.pkl')
    mapping = load('src/model/mapping.pkl')
    print("✅ Model and metadata loaded successfully")
except Exception as e:
    print(f"❌ Load error: {e}")
    model = None
    columns = []
    mapping = {}

# รูปแบบข้อมูลจาก React
class PredictionInput(BaseModel):
    Guardian: int
    Vitamin_A_Intake_First_8_Weeks: int
    Sanitary_Disposal: int
    Mom_wash_hand_before_or_after_cleaning_children: int
    Mom_wash_hand_before_or_after_feeding_the_child: int
    Child_before_or_after_eating_food: int
    Child_wash_hand_before_or_after_eating_food: int
    Last_Month_Weight_Check: int
    Weighed_Twice_Check_in_Last_3_Months: int
    Given_Anything_to_Drink_in_First_6_Months: int
    Still_Breastfeeding: int
    Is_Respondent_Biological_Mother: int
    Breastfeeding_Count_DayandNight: int
    Received_Vitamin_or_Mineral_Supplements: int
    Received_Plain_Water: int
    Infant_Formula_Intake_Count_Yesterday: int
    Received_Animal_Milk: int
    Received_Animal_Milk_Count: int
    Received_Juice_or_Juice_Drinks: int
    Received_Yogurt: int
    Received_Yogurt_Count: int
    Received_Thin_Porridge: int
    Received_Tea: int
    Received_Other_Liquids: int
    Received_Grain_Based_Foods: int
    Received_Orange_Yellow_Foods: int
    Received_White_Root_Foods: int
    Received_Dark_Green_Leafy_Veggies: int
    Received_Ripe_Mangoes_Papayas: int
    Received_Other_Fruits_Vegetables: int
    Received_Meat: int
    Received_Eggs: int
    Received_Fish_Shellfish_Seafood: int
    Received_Legumes_Nuts_Foods: int
    Received_Dairy_Products: int
    Received_Oil_Fats_Butter: int
    Received_Sugary_Foods: int
    Received_Chilies_Spices_Herbs: int
    Received_Grubs_Snails_Insects: int
    Received_Other_Solid_Semi_Solid_Food: int
    Received_Salt: int
    Number_of_Times_Eaten_Solid_Food: int


@app.post("/prediction")
async def get_prediction(input_data: PredictionInput):
    try:
        if model is None:
            return {"error": "Model not loaded"}

        # เตรียมข้อมูลเข้าโมเดล
        data = []
        original_input = {}

        for col in columns:
            value = getattr(input_data, col, 0)
            original_input[col] = value
            if col in mapping and value in mapping[col]:
                data.append(mapping[col][value])
            else:
                data.append(float(value))

        df = pd.DataFrame([data], columns=columns)

        # แสดงข้อมูลเข้าโมเดล (debug)
        print("🔎 DataFrame sent to model:")
        print(df)

        # ทำนาย
        prediction = model.predict(df)[0]
        print("🔮 Raw prediction result (index):", prediction)

        class_names = ['Normal', 'Obesity', 'Overweight', 'SAM', 'Stunting', 'Underweight']
        predicted_class = class_names[prediction]

        return {
            "prediction": predicted_class,
            "input_features": original_input
        }

    except Exception as e:
        print("❌ Error:", str(e))
        return {"error": str(e)}


# สำหรับ local run
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=5000, reload=True)
