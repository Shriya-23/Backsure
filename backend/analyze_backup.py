import os
import sys
import pandas as pd
import numpy as np
import json
from datetime import datetime
from sklearn.linear_model import LogisticRegression

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def process_csv(file_path):
    if not file_path.lower().endswith(".csv"):
        return {"error": "Please upload a CSV file only."}
    if not os.path.exists(file_path):
        return {"error": f"File not found: {file_path}"}

    df = pd.read_csv(file_path)

    numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = df.select_dtypes(include=['object', 'category']).columns.tolist()

    results = {}
    for col in numeric_cols:
        results[col] = {
            "count": int(df[col].count()),
            "mean": float(df[col].mean()),
            "min": float(df[col].min()),
            "max": float(df[col].max()),
            "sum": float(df[col].sum())
        }

    for col in categorical_cols:
        results[col] = {
            "count": int(df[col].count()),
            "unique": int(df[col].nunique()),
            "top": df[col].mode().iloc[0] if not df[col].mode().empty else None,
            "freq": int(df[col].value_counts().iloc[0]) if not df[col].value_counts().empty else 0
        }

    results["generated_at"] = datetime.now().isoformat()

    # ML prediction if 'success' column exists
    if 'success' in df.columns:
        X = df.drop(columns=['success']).select_dtypes(include=[np.number])
        y = df['success']
        if not X.empty:
            try:
                model = LogisticRegression()
                model.fit(X, y)
                results["predictions"] = model.predict(X).tolist()
            except Exception as e:
                results["predictions_error"] = str(e)
        else:
            results["predictions_error"] = "No numeric features to train model."
    else:
        results["predictions_error"] = "'success' column not found. Cannot predict."

    output_file = os.path.join(OUTPUT_DIR, f"{os.path.splitext(os.path.basename(file_path))[0]}_results.json")

    def convert(obj):
        if isinstance(obj, (np.integer, np.int64)): return int(obj)
        elif isinstance(obj, (np.floating, np.float64)): return float(obj)
        elif isinstance(obj, np.ndarray): return obj.tolist()
        else: return obj

    with open(output_file, "w") as f:
        json.dump(results, f, indent=4, default=convert)

    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python analyze_backup.py <csv_file_path>"}))
    else:
        input_file = sys.argv[1]
        output = process_csv(input_file)
        print(json.dumps(output, indent=2))






