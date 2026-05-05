// ─── CS BOOK SUBJECTS DATA ───────────────────────────────────────────────────
// Each subject has 10+ pages of comprehensive, professional-grade content.

export const SUBJECTS = [
  {
    id: 0,
    title: 'Artificial Intelligence & ML',
    emoji: '🤖',
    level: 'Beginner → Advanced',
    pages: [
      { subtitle: '1. What is AI?', content: `Artificial Intelligence (AI) is the simulation of human intelligence processes by computer systems. These processes include learning, reasoning, problem-solving, perception, and language understanding.

**A Brief History**
- 1950: Alan Turing publishes "Computing Machinery and Intelligence" and proposes the Turing Test.
- 1956: The term "Artificial Intelligence" is coined at the Dartmouth Conference by John McCarthy.
- 1966: ELIZA, the first chatbot, is created at MIT.
- 1997: IBM Deep Blue defeats chess world champion Garry Kasparov.
- 2011: IBM Watson wins Jeopardy! against human champions.
- 2012: Deep Learning revolution begins with AlexNet winning ImageNet.
- 2016: Google DeepMind's AlphaGo defeats world Go champion Lee Sedol.
- 2022: ChatGPT launches and brings AI to the mainstream.

**Types of AI**
- Narrow AI (ANI): Designed for a specific task. Siri, Alexa, Netflix recommendations, self-driving cars. All current AI is Narrow AI.
- General AI (AGI): Human-level intelligence across all cognitive domains. Does not exist yet.
- Super AI (ASI): Intelligence that vastly surpasses human capabilities. Theoretical.

**Why AI Matters Now**
Three factors converged to make modern AI possible:
1. Data: The internet generates 2.5 quintillion bytes of data daily.
2. Compute: GPUs (especially NVIDIA) made parallel processing affordable.
3. Algorithms: Deep learning architectures (CNNs, Transformers) proved incredibly effective.` },
      { subtitle: '2. Machine Learning Fundamentals', content: `Machine Learning (ML) is a subset of AI where systems learn patterns from data without being explicitly programmed.

**The ML Paradigm Shift**
- Traditional Programming: Input + Rules → Output
- Machine Learning: Input + Output → Rules (the machine discovers the rules)

**Supervised Learning**
The model learns from labeled data — input-output pairs.
- Classification: Predict a category (spam/not spam, cat/dog).
- Regression: Predict a continuous value (house prices, stock prices).
- Key Algorithms: Linear Regression, Logistic Regression, Decision Trees, Random Forests, Support Vector Machines (SVM), k-Nearest Neighbors (kNN).

**Unsupervised Learning**
The model finds hidden patterns in unlabeled data.
- Clustering: Grouping similar data points (customer segmentation, gene grouping).
- Dimensionality Reduction: Compressing high-dimensional data while preserving structure.
- Key Algorithms: K-Means, DBSCAN, Hierarchical Clustering, PCA, t-SNE.

**Reinforcement Learning**
An agent learns by interacting with an environment, receiving rewards or penalties.
- The agent takes actions, observes the new state, and receives a reward signal.
- Goal: Maximize cumulative reward over time.
- Examples: Game-playing AI (AlphaGo, OpenAI Five), robotics, autonomous vehicles.
- Key Concepts: Agent, Environment, State, Action, Reward, Policy, Q-Learning, Policy Gradient.

**Semi-Supervised & Self-Supervised Learning**
- Semi-Supervised: Uses a small amount of labeled data and a large amount of unlabeled data.
- Self-Supervised: The model creates its own labels from the data structure (e.g., predicting the next word in a sentence). This is how GPT and BERT are trained.` },
      { subtitle: '3. The Math Behind ML', content: `Understanding ML requires foundational math in three areas: Linear Algebra, Calculus, and Statistics.

**Linear Algebra**
- Vectors: Represent data points. A single data sample with n features is a vector in n-dimensional space.
- Matrices: Collections of vectors. An entire dataset is a matrix where rows are samples and columns are features.
- Matrix Multiplication: The core operation in neural networks. Each layer multiplies the input vector by a weight matrix.
- Eigenvalues & Eigenvectors: Used in PCA for dimensionality reduction.

**Calculus (Optimization)**
- Derivatives: Measure how a function's output changes as its input changes. In ML, we compute the derivative of the loss function with respect to each weight.
- Gradient Descent: The algorithm that trains neural networks. It iteratively adjusts weights in the direction that reduces the loss.
  - Learning Rate: How big each step is. Too large = overshoot. Too small = slow convergence.
  - Stochastic Gradient Descent (SGD): Uses random mini-batches of data instead of the full dataset for faster training.
- Chain Rule: The mathematical foundation of Backpropagation.

**Probability & Statistics**
- Bayes' Theorem: P(A|B) = P(B|A) * P(A) / P(B). Foundation for Naive Bayes classifiers and Bayesian methods.
- Probability Distributions: Normal (Gaussian), Bernoulli, Poisson. Data often follows these distributions.
- Maximum Likelihood Estimation (MLE): Finding the parameters that make the observed data most probable.
- Bias-Variance Tradeoff: High bias = underfitting (too simple). High variance = overfitting (too complex). The goal is to find the sweet spot.

**Evaluation Metrics**
- Accuracy, Precision, Recall, F1-Score (Classification).
- MAE, MSE, RMSE, R² (Regression).
- Confusion Matrix: Shows true positives, false positives, true negatives, false negatives.` },
      { subtitle: '4. Neural Networks', content: `Neural Networks are computing systems inspired by the biological neural networks in the human brain.

**Architecture**
- Input Layer: Receives raw data (pixels, text tokens, numerical features).
- Hidden Layers: Perform mathematical transformations. "Deep" learning means many hidden layers.
- Output Layer: Produces the prediction.
- Each connection has a Weight (how important this input is) and each neuron has a Bias (a threshold for activation).

**How a Single Neuron Works**
1. Receives inputs (x₁, x₂, ... xₙ).
2. Multiplies each by its weight (w₁x₁ + w₂x₂ + ... + wₙxₙ).
3. Adds the bias (z = Σwᵢxᵢ + b).
4. Passes through an Activation Function to produce output.

**Activation Functions**
- Sigmoid: σ(x) = 1/(1+e⁻ˣ). Outputs between 0 and 1. Used for binary classification.
- ReLU: f(x) = max(0, x). Most popular for hidden layers. Solves the vanishing gradient problem.
- Tanh: Outputs between -1 and 1.
- Softmax: Converts outputs to probabilities that sum to 1. Used for multi-class classification.

**Training Process**
1. Forward Pass: Data flows through the network to produce a prediction.
2. Loss Calculation: Compare prediction to the true label (e.g., Cross-Entropy Loss for classification, MSE for regression).
3. Backpropagation: Calculate gradients of the loss with respect to every weight using the chain rule.
4. Weight Update: Adjust weights using an optimizer (SGD, Adam, RMSprop).
5. Repeat for many epochs until loss converges.

**Key Concepts**
- Epoch: One complete pass through the entire training dataset.
- Batch Size: Number of samples processed before updating weights.
- Overfitting Prevention: Dropout, L1/L2 Regularization, Early Stopping, Data Augmentation.` },
      { subtitle: '5. CNNs — Computer Vision', content: `Convolutional Neural Networks (CNNs) are specialized neural networks designed for processing grid-like data such as images.

**Why CNNs?**
A 224×224 color image has 224 × 224 × 3 = 150,528 input values. A fully connected network would need billions of parameters. CNNs use a clever trick called weight sharing to dramatically reduce parameters.

**Core Layers**

**Convolutional Layer**
- A small filter (e.g., 3×3) slides across the image, performing element-wise multiplication and summation.
- Each filter learns to detect a specific feature (edges, corners, textures).
- Early layers detect low-level features (edges). Deeper layers detect high-level features (eyes, wheels).

**Pooling Layer**
- Reduces spatial dimensions (downsampling).
- Max Pooling: Takes the maximum value in each region.
- Reduces computation and provides translation invariance.

**Fully Connected Layer**
- After feature extraction, the feature maps are flattened into a 1D vector and passed through dense layers for final classification.

**Famous CNN Architectures**
- LeNet-5 (1998): First practical CNN for handwritten digit recognition.
- AlexNet (2012): Won ImageNet with 8 layers. Sparked the deep learning revolution.
- VGGNet (2014): Showed that deeper networks (16-19 layers) perform better.
- ResNet (2015): Introduced skip connections. Enabled training of 152+ layer networks.
- EfficientNet (2019): Optimized scaling of depth, width, and resolution.

**Applications**
- Image classification, object detection (YOLO, Faster R-CNN).
- Facial recognition, medical imaging (tumor detection).
- Self-driving cars (lane detection, pedestrian recognition).
- Image segmentation, style transfer, image generation.` },
      { subtitle: '6. RNNs & Sequence Models', content: `Recurrent Neural Networks (RNNs) are designed for sequential data where order matters — text, speech, time series, music.

**The Problem with Standard Networks**
A regular neural network treats each input independently. But in a sentence like "I grew up in France. I speak ___", understanding the answer requires remembering "France" from earlier. RNNs solve this with memory.

**How RNNs Work**
- At each time step, the RNN takes an input AND the hidden state from the previous time step.
- The hidden state acts as "memory" that carries information forward through the sequence.
- Same weights are shared across all time steps (weight sharing).

**The Vanishing Gradient Problem**
When sequences are long, gradients become extremely small during backpropagation through time. The network "forgets" information from early in the sequence.

**LSTM (Long Short-Term Memory)**
Introduced by Hochreiter & Schmidhuber (1997), LSTMs solve the vanishing gradient problem with a gated architecture:
- Forget Gate: Decides what information to discard from the cell state.
- Input Gate: Decides what new information to store.
- Output Gate: Decides what to output based on the cell state.

**GRU (Gated Recurrent Unit)**
A simplified version of LSTM with only two gates (Reset and Update). Faster to train, often comparable performance.

**Applications**
- Machine translation (English → French).
- Speech recognition (audio → text).
- Text generation, sentiment analysis.
- Music composition, stock price prediction.
- Time series forecasting (weather, energy demand).

**Note:** While RNNs were revolutionary, they have been largely superseded by Transformers for most NLP tasks due to parallelization and superior long-range dependency handling.` },
      { subtitle: '7. Transformers & Attention', content: `The Transformer architecture, introduced in the 2017 paper "Attention Is All You Need" by Google, is the most important architecture in modern AI.

**The Core Innovation: Self-Attention**
Instead of processing sequences one element at a time (like RNNs), Transformers process all elements simultaneously and learn which elements to "pay attention" to.

**How Self-Attention Works**
For each word in a sentence, three vectors are computed:
- Query (Q): "What am I looking for?"
- Key (K): "What do I contain?"
- Value (V): "What information do I provide?"

Attention Score = softmax(Q·Kᵀ / √dₖ) · V

This allows every word to attend to every other word in the sentence, regardless of distance.

**Multi-Head Attention**
Instead of computing attention once, the model computes it multiple times in parallel (multiple "heads"), each focusing on different types of relationships (syntactic, semantic, positional).

**The Transformer Block**
1. Multi-Head Self-Attention
2. Add & Normalize (Residual Connection + Layer Normalization)
3. Feed-Forward Network (two linear layers with ReLU)
4. Add & Normalize

**Positional Encoding**
Since Transformers process all tokens simultaneously, they have no inherent sense of order. Positional encodings (sine/cosine functions) are added to input embeddings to inject position information.

**Why Transformers Won**
- Parallelizable: Unlike RNNs, all positions are processed simultaneously on GPUs.
- Long-range dependencies: Attention can connect any two positions directly.
- Scalable: Performance improves consistently with more data and parameters.

**Key Models**
- BERT (2018): Bidirectional encoder. Pre-trained by masking words and predicting them.
- GPT series (2018-2024): Autoregressive decoder. Pre-trained by predicting the next word.
- T5, PaLM, LLaMA, Gemini, Claude: Various architectures building on the Transformer.` },
      { subtitle: '8. LLMs & Generative AI', content: `Large Language Models (LLMs) are Transformer-based models trained on massive text corpora to understand and generate human language.

**How LLMs are Trained**

**Pre-training (Self-Supervised)**
- The model reads billions of web pages, books, and code.
- For GPT-style models: Given all previous words, predict the next word.
- For BERT-style models: Mask random words and predict them.
- This requires enormous compute: GPT-4 reportedly cost $100+ million to train.

**Fine-tuning**
- After pre-training, the model is fine-tuned on specific tasks or instruction-following datasets.
- RLHF (Reinforcement Learning from Human Feedback): Humans rate model outputs, and a reward model is trained to align the LLM with human preferences.

**Emergent Capabilities**
At sufficient scale (billions of parameters), LLMs develop abilities they were never explicitly trained for:
- Chain-of-thought reasoning.
- In-context learning (learning from examples in the prompt).
- Code generation, translation, summarization.

**Prompt Engineering**
The art of crafting inputs to get the best outputs from LLMs:
- Zero-shot: Just ask the question directly.
- Few-shot: Provide a few examples before your question.
- Chain-of-Thought: Ask the model to "think step by step".
- System prompts: Set the model's persona and behavior.

**Generative AI Beyond Text**
- Image Generation: Stable Diffusion, DALL-E, Midjourney (using Diffusion Models).
- Video Generation: OpenAI Sora, Runway Gen-3.
- Audio Generation: ElevenLabs (voice cloning), Suno (music).
- Code Generation: GitHub Copilot, Cursor, Devin.

**Limitations & Risks**
- Hallucinations: LLMs can confidently generate false information.
- Bias: Models reflect biases present in training data.
- No true understanding: LLMs are sophisticated pattern matchers, not conscious entities.` },
      { subtitle: '9. Python for AI — Code Examples', content: `Python is the dominant language for AI/ML. Here are essential code patterns.

**NumPy — Numerical Computing**
import numpy as np
X = np.array([[1, 2], [3, 4], [5, 6]])
y = np.array([0, 1, 1])
print(X.shape)  # (3, 2)
print(np.mean(X, axis=0))  # Feature means

**Pandas — Data Manipulation**
import pandas as pd
df = pd.read_csv('data.csv')
df.head()  # First 5 rows
df.describe()  # Summary statistics
df.dropna()  # Remove missing values
df.groupby('category').mean()

**Scikit-Learn — ML Models**
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)
predictions = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, predictions):.2f}")

**PyTorch — Neural Networks**
import torch
import torch.nn as nn

class SimpleNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer1 = nn.Linear(784, 128)
        self.relu = nn.ReLU()
        self.layer2 = nn.Linear(128, 10)
    
    def forward(self, x):
        x = self.relu(self.layer1(x))
        return self.layer2(x)

model = SimpleNN()
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

**Training Loop**
for epoch in range(100):
    optimizer.zero_grad()
    outputs = model(X_train_tensor)
    loss = criterion(outputs, y_train_tensor)
    loss.backward()
    optimizer.step()
    print(f"Epoch {epoch}, Loss: {loss.item():.4f}")` },
      { subtitle: '10. AI Career Roadmap', content: `The AI industry offers some of the highest-paying and most impactful careers in technology.

**Career Paths**

**Machine Learning Engineer ($120K-$250K)**
- Builds, deploys, and maintains ML models in production.
- Skills: Python, PyTorch/TensorFlow, MLOps (MLflow, Kubeflow), Docker, cloud platforms.

**AI Research Scientist ($150K-$400K+)**
- Publishes papers, invents new architectures and algorithms.
- Skills: PhD typically required. Deep math, PyTorch, paper reading/writing.

**Data Scientist ($100K-$200K)**
- Extracts insights from data, builds predictive models.
- Skills: Python, SQL, statistics, visualization, communication.

**AI/ML Product Manager ($130K-$250K)**
- Bridges technical AI teams and business strategy.
- Skills: Technical literacy, product thinking, stakeholder management.

**Prompt Engineer ($80K-$150K)**
- Designs and optimizes prompts for LLM-based applications.
- Skills: Understanding of LLM capabilities, systematic testing, domain expertise.

**Learning Path (6-12 months)**
1. Learn Python deeply (3-4 weeks).
2. Master math fundamentals: Linear algebra, calculus, statistics (4-6 weeks).
3. Complete Andrew Ng's ML Specialization on Coursera.
4. Learn a deep learning framework (PyTorch recommended).
5. Build 3-5 portfolio projects on GitHub.
6. Participate in Kaggle competitions.
7. Read research papers (start with "Attention Is All You Need").
8. Contribute to open-source AI projects.

**Top Resources**
- Courses: fast.ai, Stanford CS229, MIT 6.S191.
- Books: "Deep Learning" by Goodfellow, "Hands-On ML" by Géron.
- Communities: r/MachineLearning, Hugging Face, Papers With Code.
- Tools: Google Colab (free GPUs), Weights & Biases (experiment tracking).` }
    ]
  },
];
