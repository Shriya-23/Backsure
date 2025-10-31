📁 BACKSURE : Intelligent Backup Success Prediction System

"When data is everything, predicting its safety becomes the smartest move."

🔹INTRODUCTION

-During my 6th semester, I developed a deep curiosity about how data systems handle and protect massive information. While studying Machine Learning, especially algorithms like Logistic Regression, I often wondered, can data help us predict what might happen before it actually does?

-That curiosity led to BackSure: A machine learning–driven solution that predicts backup job success or failure using past backup logs.

-In a world where data loss can cost millions, predictive insights can save companies from failed backup operations and potential downtime.

🔹 WHY I BUILT THIS PROJECT?

-As a learner, I always loved exploring how systems think and make decisions.

-While performing machine learning lab experiments during my 6th semester, I realized that backup reliability is a real pain point in industries storage errors, network issues.

-So, BackSure became my way to connect:

  -My machine learning learnings (from lab experiments), and

  -My interest in system reliability & data management

  -Into one practical, smart project.
  

  🔹WHAT PROBLEMS DOES BACKSURE SOLVE??

▪️Backup Uncertainty: Predicts whether a backup will succeed or fail.

▪️ Data-Driven Decision Making: Uses backup history to learn and adapt continuously.Learns from past backup logs to improve future reliability.

▪️ Performance Monitoring: Tracks metrics like size, duration, and network latency to reveal performance bottlenecks.

▪️ Resource Optimization: Helps plan storage, time, and bandwidth more efficiently.

▪️ Informed Monitoring: Turns raw backup data into clear, actionable insights.

▪️ Scalable Insight: Works for small setups to enterprise-scale systems using any backup log CSV.

🔹 FEATURES

-Predictive Analysis – Uses ML to predict backup success or failure.

-Smart Visualization – Displays graphs & insights based on data trends.

-Logistic Regression Model – Learns from past backup patterns.

-Real-time Uploads – Upload a .csv backup log and get instant prediction.

🔹 TECH STACK

-Frontend = React + TypeScript + TailwindCSS + Framer Motion.

-Machine Learning= Python (Logistic Regression, Pandas, NumPy, Scikit-learn).

-Backend =Node.js + Express.js (handles ML prediction API).

-Data Format =CSV backup logs

🔹 WORKING

 -User Uploads CSV File
→ Contains past backup data (features like size, duration, latency, etc.)

-Backend Sends Data to ML Model
→ Express.js forwards it to the trained Python model.

-Logistic Regression Predicts Success/Failure
→ Based on learned patterns (from historical backups).

-Frontend Displays Graph & Result Explanation
→ Green for successful backups, Red for likely failures.

🔹 HOW TO RUN IT LOCALLY

▪️ Clone Repository

-git clone https://github.com/Shriya-23/Backsure.git

-cd Backsure

▪️ Run Backend

-cd backend

-npm install

-node server.js

▪️ Run Frontend

-cd frontend

-npm install

-npm run dev

▪️ Run ML Model

-cd ml-model

-python analyze_backup.py ./data/backup_data.csv

📊 EXAMPLE CSV COLUMNS (Used for Prediction)

Here’s how BackSure reads and learns from your backup log data:

-job_id: Unique identifier for each backup job.

-size_gb: Total size of the backup file (in gigabytes).

-duration_min: Time taken to complete the backup (in minutes).

-error_count: Number of errors encountered during the process.

-retry_count: How many times the backup was retried.

-network_latency_ms: Network delay experienced during the backup (in milliseconds).

success: Target column — 1 means backup succeeded, 0 means it failed.

✨ CONCLUSION

BackSure combines the power of Machine Learning and System Reliability Engineering to make backups smarter, safer, and more predictable

As a learner, I built BackSure to explore how data-driven approaches can solve real operational challenges. This project taught me the importance of model interpretation, and system resilience.

💡 I’m always open to improving it further

Got suggestions or feedback? Reach out at shriya.sharma1923@gmail.com

 — I’d love to learn from you!

 💼 ABOUT ME
 
 Hi! I’m Shriya Sharma,A Computer Science student passionate about building practical, data-driven, and impactful tech solutions.

 I love transforming ideas into simple, meaningful tools that bridge the gap between technology and real-world problems.




