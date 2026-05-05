export const DATASCIENCE = {
  id: 5, title: 'Data Science & Big Data', emoji: '📊', level: 'Beginner → Advanced',
  pages: [
    { subtitle: '1. Introduction to Data Science', content: `Data Science is the interdisciplinary field that uses scientific methods, algorithms, and systems to extract knowledge and actionable insights from structured and unstructured data.

**Why Data Science?**
Every click, swipe, purchase, and GPS ping generates data. We create 2.5 quintillion bytes of data daily. Organizations that can extract insights from this data gain massive competitive advantages.

**Data Science vs Related Fields**
- Data Science: Build predictive models, discover insights. "What will happen?"
- Data Analytics: Analyze historical data, create reports. "What happened?"
- Data Engineering: Build pipelines and infrastructure. "How do we move and store data?"
- Machine Learning Engineering: Deploy ML models to production. "How do we serve predictions?"

**The Data Science Lifecycle**
1. Business Understanding: Define the problem and success metrics.
2. Data Collection: Gather data from databases, APIs, web scraping.
3. Data Cleaning: Handle missing values, outliers, formatting issues.
4. Exploratory Data Analysis: Visualize and understand patterns.
5. Feature Engineering: Create informative variables from raw data.
6. Model Building: Apply ML algorithms.
7. Evaluation: Assess model performance.
8. Deployment: Put the model into production.
9. Monitoring: Track model performance over time.

**The 3 V's of Big Data**
- Volume: Petabytes and exabytes of data.
- Velocity: Real-time streaming data.
- Variety: Structured (SQL), unstructured (text, images), semi-structured (JSON, XML).` },
    { subtitle: '2. Statistics Foundations', content: `Statistics is the mathematical foundation of data science. Without it, you're just guessing.

**Descriptive Statistics**
- Mean: Average value. Sensitive to outliers.
- Median: Middle value when sorted. Robust to outliers.
- Mode: Most frequent value.
- Standard Deviation: Measures spread of data around the mean.
- Variance: Standard deviation squared.
- Percentiles: 25th (Q1), 50th (Q2/Median), 75th (Q3).
- IQR: Q3 - Q1. Used to detect outliers (< Q1-1.5*IQR or > Q3+1.5*IQR).

**Probability Distributions**
- Normal (Gaussian): Bell curve. Many natural phenomena follow this. Defined by mean (μ) and standard deviation (σ).
- Bernoulli: Binary outcomes (coin flip). P(success) = p.
- Binomial: Number of successes in n Bernoulli trials.
- Poisson: Count of events in a fixed interval (website visits per hour).
- Uniform: Equal probability for all values.

**Inferential Statistics**
Drawing conclusions about a population from a sample.
- Central Limit Theorem: Sample means are approximately normal, regardless of population distribution (n ≥ 30).
- Confidence Intervals: "We are 95% confident the true mean is between X and Y."
- Hypothesis Testing: H₀ (null hypothesis) vs H₁ (alternative hypothesis).
  - p-value: Probability of observing data this extreme if H₀ is true.
  - p < 0.05 → reject H₀ (statistically significant).
  - Type I Error (False Positive): Rejecting H₀ when it's true.
  - Type II Error (False Negative): Failing to reject H₀ when it's false.

**Correlation**
- Pearson: Linear correlation (-1 to 1).
- Spearman: Rank-based correlation.
- IMPORTANT: Correlation ≠ Causation.` },
    { subtitle: '3. SQL — The Data Language', content: `SQL (Structured Query Language) is the most important skill for any data professional. Period.

**Basic Queries**
SELECT name, age, salary
FROM employees
WHERE department = 'Engineering'
ORDER BY salary DESC
LIMIT 10;

**Aggregations**
SELECT department,
       COUNT(*) as employee_count,
       AVG(salary) as avg_salary,
       MAX(salary) as max_salary
FROM employees
GROUP BY department
HAVING COUNT(*) > 5;

**JOINs**
-- INNER JOIN: Only matching rows
SELECT e.name, d.department_name
FROM employees e
INNER JOIN departments d ON e.dept_id = d.id;

-- LEFT JOIN: All from left, matching from right
SELECT e.name, o.order_total
FROM employees e
LEFT JOIN orders o ON e.id = o.employee_id;

**Subqueries**
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);

**Window Functions (Advanced)**
SELECT name, department, salary,
       RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank,
       AVG(salary) OVER (PARTITION BY department) as dept_avg,
       LAG(salary) OVER (ORDER BY hire_date) as prev_salary
FROM employees;

**Common Table Expressions (CTEs)**
WITH high_earners AS (
    SELECT * FROM employees WHERE salary > 100000
)
SELECT department, COUNT(*) as count
FROM high_earners
GROUP BY department;

**Performance Tips**
- Use indexes on frequently queried columns.
- Avoid SELECT * in production queries.
- Use EXPLAIN to analyze query execution plans.
- Prefer JOINs over subqueries for performance.` },
    { subtitle: '4. Python for Data Science', content: `Python is the primary language for data science. Master these libraries.

**Pandas — Data Manipulation**
import pandas as pd

# Load data
df = pd.read_csv('sales.csv')

# Explore
df.head()           # First 5 rows
df.info()           # Column types, null counts
df.describe()       # Summary statistics
df.shape            # (rows, columns)

# Clean
df.dropna()                    # Remove missing values
df.fillna(df.mean())           # Fill missing with mean
df.drop_duplicates()           # Remove duplicates
df['date'] = pd.to_datetime(df['date'])  # Convert types

# Transform
df['revenue'] = df['price'] * df['quantity']
df.groupby('category')['revenue'].sum()
df.pivot_table(values='revenue', index='month', columns='category', aggfunc='sum')

**NumPy — Numerical Computing**
import numpy as np

arr = np.array([1, 2, 3, 4, 5])
np.mean(arr)       # 3.0
np.std(arr)        # 1.414
np.dot(a, b)       # Dot product
np.linalg.inv(M)   # Matrix inverse

# Broadcasting
matrix = np.random.randn(100, 5)  # 100 samples, 5 features
normalized = (matrix - matrix.mean(axis=0)) / matrix.std(axis=0)

**Matplotlib & Seaborn — Visualization**
import matplotlib.pyplot as plt
import seaborn as sns

# Distribution plot
sns.histplot(df['salary'], kde=True)
plt.title('Salary Distribution')
plt.show()

# Correlation heatmap
sns.heatmap(df.corr(), annot=True, cmap='coolwarm')

# Scatter plot
sns.scatterplot(data=df, x='experience', y='salary', hue='department')

**Scikit-Learn — Machine Learning**
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

model = RandomForestClassifier()
model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)` },
    { subtitle: '5. Exploratory Data Analysis', content: `EDA is the process of investigating a dataset to discover patterns, spot anomalies, and form hypotheses before formal modeling.

**Step 1: Understand the Data**
- How many rows and columns? df.shape
- What are the data types? df.dtypes
- How many missing values? df.isnull().sum()
- What are the unique values for each categorical column? df.nunique()

**Step 2: Univariate Analysis**
Examine each variable individually.
- Numerical: Histograms, box plots, descriptive statistics.
- Categorical: Bar charts, value counts, frequency tables.
- Look for: Skewness, outliers, unusual distributions.

**Step 3: Bivariate Analysis**
Examine relationships between two variables.
- Numerical vs Numerical: Scatter plots, correlation coefficients.
- Numerical vs Categorical: Box plots, violin plots, group comparisons.
- Categorical vs Categorical: Contingency tables, chi-squared tests.

**Step 4: Multivariate Analysis**
- Pair plots: Scatter plots for all variable pairs.
- Correlation matrix: Heatmap showing all pairwise correlations.
- PCA: Reduce dimensions to visualize high-dimensional data.

**Common Patterns to Look For**
- Linear relationships (use linear regression).
- Clusters (use clustering algorithms).
- Seasonal patterns in time series.
- Class imbalance in classification problems.
- Feature interactions (combined features might be more predictive than individual ones).

**Handling Missing Data**
- MCAR (Missing Completely At Random): Safe to drop or impute.
- MAR (Missing At Random): Use model-based imputation.
- MNAR (Missing Not At Random): Requires domain knowledge.
- Strategies: Drop rows/columns, mean/median/mode imputation, KNN imputation, iterative imputation.

**Handling Outliers**
- IQR method: Values beyond Q1-1.5*IQR or Q3+1.5*IQR.
- Z-score: Values beyond ±3 standard deviations.
- Options: Remove, cap/floor (winsorize), or keep (if they're legitimate).` },
    { subtitle: '6. Feature Engineering', content: `Feature engineering is the art of creating informative variables from raw data. It often has more impact on model performance than algorithm choice.

**Numerical Features**
- Scaling: StandardScaler (z-score), MinMaxScaler (0 to 1). Essential for distance-based algorithms.
- Log Transform: Reduces right-skewness. log1p() handles zeros.
- Binning: Convert continuous to categorical (age groups, salary bands).
- Polynomial Features: Create x², x³, x₁*x₂ for non-linear relationships.

**Categorical Features**
- One-Hot Encoding: Create binary columns for each category. Use when no ordinal relationship.
- Label Encoding: Assign integers. Use for ordinal categories (low/medium/high).
- Target Encoding: Replace category with mean of target variable. Powerful but risk of data leakage.
- Frequency Encoding: Replace category with its frequency count.

**Date/Time Features**
- Extract: Year, month, day, day of week, hour, minute.
- Is_weekend: Boolean feature often highly predictive.
- Days_since: Days since a reference date or event.
- Cyclical encoding: sin/cos transformation for cyclical features (hour, month).

**Text Features**
- Bag of Words: Count word occurrences.
- TF-IDF: Weight words by importance (common in documents, rare overall).
- Word Embeddings: Dense vector representations (Word2Vec, GloVe).
- N-grams: Sequences of n words.

**Feature Selection**
- Correlation Analysis: Remove highly correlated features (redundant).
- Mutual Information: Measures dependency between feature and target.
- Recursive Feature Elimination (RFE): Iteratively remove least important features.
- L1 Regularization (Lasso): Automatically zeros out unimportant features.

**Golden Rule**
NEVER use information from the test set during feature engineering. This causes data leakage and inflated performance metrics.` },
    { subtitle: '7. ML Pipeline & Model Selection', content: `Building a robust ML pipeline from data to predictions.

**The ML Pipeline**
1. Data Ingestion → 2. Preprocessing → 3. Feature Engineering → 4. Model Training → 5. Evaluation → 6. Hyperparameter Tuning → 7. Deployment

**Model Selection Guide**

**For Classification**
- Start with: Logistic Regression (baseline), Random Forest.
- If data is large: XGBoost / LightGBM (gradient boosting — wins most Kaggle competitions).
- If data is small: SVM with kernel trick.
- If interpretability matters: Decision Tree, Logistic Regression.
- If accuracy matters most: Ensemble methods, Neural Networks.

**For Regression**
- Start with: Linear Regression (baseline), Random Forest Regressor.
- If non-linear: XGBoost, Polynomial Regression.
- If many features: Ridge / Lasso Regression (regularization).

**Cross-Validation**
Never evaluate on training data. Use k-fold cross-validation:
- Split data into k folds (typically 5 or 10).
- Train on k-1 folds, evaluate on the held-out fold.
- Repeat k times, average the scores.
- Gives reliable estimate of generalization performance.

**Hyperparameter Tuning**
- Grid Search: Try all parameter combinations. Exhaustive but slow.
- Random Search: Sample random combinations. Often more efficient.
- Bayesian Optimization: Use past results to inform next parameter set. Most efficient.

**Ensemble Methods**
- Bagging: Train multiple models on random subsets of data. Average predictions (Random Forest).
- Boosting: Train models sequentially, each correcting the previous model's errors (XGBoost, LightGBM).
- Stacking: Use predictions from multiple models as features for a meta-model.

**Scikit-Learn Pipeline**
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', GradientBoostingClassifier())
])
pipeline.fit(X_train, y_train)
score = pipeline.score(X_test, y_test)` },
    { subtitle: '8. Big Data Technologies', content: `When data exceeds what a single machine can handle, distributed computing becomes essential.

**Hadoop Ecosystem**
- HDFS (Hadoop Distributed File System): Distributed storage across commodity hardware. Data is split into 128MB blocks and replicated 3x.
- MapReduce: Programming model for parallel processing. Map phase transforms data, Reduce phase aggregates results. Largely replaced by Spark.
- YARN: Resource management layer.
- Hive: SQL-like queries on Hadoop data. Makes Hadoop accessible to SQL users.

**Apache Spark**
The industry standard for big data processing.
- 100x faster than MapReduce (in-memory processing).
- Supports: Batch processing, stream processing, ML, graph processing.
- APIs in Python (PySpark), Scala, Java, R.

from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("analysis").getOrCreate()
df = spark.read.csv("huge_dataset.csv", header=True, inferSchema=True)
result = df.groupBy("category").agg({"revenue": "sum", "quantity": "avg"})
result.show()

**Apache Kafka**
Distributed event streaming platform.
- Producers publish messages to topics.
- Consumers subscribe and process messages.
- Use cases: Real-time analytics, log aggregation, event-driven architectures.
- Handles millions of events per second.

**Data Warehouses**
Optimized for analytical queries (OLAP):
- Snowflake: Cloud-native, auto-scaling. Separates compute from storage.
- BigQuery (GCP): Serverless, pay-per-query.
- Redshift (AWS): Columnar storage, massively parallel processing.

**Data Lakes**
Store raw data in any format (structured, semi-structured, unstructured):
- S3 (AWS), Cloud Storage (GCP).
- Delta Lake: Adds ACID transactions and schema enforcement to data lakes.

**Modern Data Stack**
Extraction (Fivetran) → Storage (Snowflake) → Transformation (dbt) → Visualization (Looker/Tableau).` },
    { subtitle: '9. Data Visualization & Storytelling', content: `The ability to communicate data insights visually is as important as the analysis itself.

**Principles of Good Visualization**
- Choose the right chart type for your data and message.
- Minimize chart junk (unnecessary gridlines, 3D effects, decorations).
- Use color purposefully (highlight, categorize, show magnitude).
- Label everything clearly (title, axes, legends, units).
- Tell a story: What's the insight? Why does it matter? What should we do?

**Chart Selection Guide**
- Comparison: Bar chart, grouped bar chart.
- Trend over time: Line chart, area chart.
- Distribution: Histogram, box plot, violin plot.
- Relationship: Scatter plot, bubble chart.
- Composition: Pie chart (use sparingly), stacked bar chart.
- Geospatial: Choropleth map, bubble map.

**Professional Tools**
- Tableau: Drag-and-drop, enterprise standard. Beautiful dashboards.
- Power BI: Microsoft ecosystem. Strong with Excel users.
- Looker: SQL-based, embedded analytics.
- Metabase: Open-source, easy to set up.

**Python Visualization**
import plotly.express as px

# Interactive scatter plot
fig = px.scatter(df, x='gdp_per_capita', y='life_expectancy',
                 size='population', color='continent',
                 hover_name='country', animation_frame='year',
                 title='Wealth vs Health of Nations')
fig.show()

**Dashboard Design**
- Start with the most important KPI prominently displayed.
- Use consistent colors and fonts throughout.
- Provide drill-down capability (overview → details).
- Include filters for user interactivity.
- Update data automatically (real-time or scheduled).

**Data Storytelling Framework**
1. Context: What's the situation? Who's the audience?
2. Conflict: What's the problem or opportunity?
3. Resolution: What does the data tell us? What action should we take?
- Use annotations to highlight key points in charts.
- Lead with the conclusion, then support with evidence.` },
    { subtitle: '10. Data Science Career Guide', content: `Data science remains one of the most in-demand and well-compensated career paths in tech.

**Career Paths**

**Data Analyst ($60K-$100K)**
Entry-level. SQL, Excel, Tableau. Create reports and dashboards.

**Data Scientist ($100K-$180K)**
Build predictive models, statistical analysis, communicate insights.

**ML Engineer ($120K-$220K)**
Deploy and scale ML models in production systems.

**Data Engineer ($100K-$180K)**
Build ETL pipelines, manage data infrastructure.

**Analytics Engineer ($90K-$150K)**
Bridge between data engineering and analytics. SQL, dbt, data modeling.

**Head of Data / Chief Data Officer ($180K-$400K+)**
Lead data strategy across the organization.

**The Must-Have Skills**
1. SQL: You will use this every single day. Master window functions, CTEs, and optimization.
2. Python: Pandas, NumPy, Scikit-Learn, Matplotlib/Seaborn.
3. Statistics: Hypothesis testing, distributions, Bayesian thinking.
4. Communication: Present findings to non-technical stakeholders.
5. Domain Knowledge: Understand the business you're in.

**Portfolio Projects (Build These)**
1. End-to-end EDA: Pick a dataset, clean it, analyze it, visualize findings.
2. Predictive Model: Build a classification or regression model with cross-validation.
3. Dashboard: Create an interactive Tableau or Streamlit dashboard.
4. SQL Analysis: Write complex queries solving business questions.

**Interview Preparation**
- SQL: LeetCode SQL problems, Mode Analytics SQL tutorial.
- Statistics: A/B testing scenarios, probability puzzles.
- Take-home challenges: Clean messy data, build model, present findings.
- Case studies: "How would you measure the success of feature X?"

**Top Resources**
- Courses: Google Data Analytics (Coursera), fast.ai, StatQuest (YouTube)
- Practice: Kaggle competitions, StrataScratch (SQL), LeetCode
- Books: "Storytelling with Data" (Knaflic), "Python for Data Analysis" (McKinney)
- Communities: r/datascience, Kaggle forums, Data Twitter` }
  ]
};
