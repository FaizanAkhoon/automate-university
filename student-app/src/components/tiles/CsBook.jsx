import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Lock, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react';

const SUBJECTS = [
  {
    id: 0,
    title: 'Artificial Intelligence & ML',
    emoji: '🤖',
    level: 'Beginner to Advanced',
    pages: [
      {
        subtitle: '1. Introduction to AI',
        content: `Artificial Intelligence (AI) is the simulation of human intelligence by machines. It is the defining technology of the 21st century.

**The History of AI**
The term "Artificial Intelligence" was coined in 1956 at a conference at Dartmouth College. Early AI (symbolic AI or "Good Old-Fashioned AI") relied on hard-coded rules and logic. It worked well for playing chess but failed at complex human tasks like recognizing faces or understanding speech.

**The Winter and The Boom**
AI went through several "AI Winters" where funding dried up because the technology couldn't live up to the hype. Everything changed in the 2010s due to three factors:
1. Massive datasets (The Internet)
2. Huge computational power (GPUs)
3. Better algorithms (Deep Learning)

**Narrow AI vs. General AI**
- Narrow AI (ANI): AI designed to perform a specific task (e.g., Siri, self-driving cars, Netflix recommendations). All current AI is Narrow AI.
- General AI (AGI): AI that possesses human-level cognitive abilities across all domains. This is the holy grail of AI research, but it doesn't exist yet.
- Super AI (ASI): AI that vastly exceeds human intelligence.

**Why does this matter?**
AI is a general-purpose technology, much like electricity or the internet. It will touch every industry, from healthcare (diagnosing diseases) to finance (algorithmic trading) to art (generative AI).`
      },
      {
        subtitle: '2. Machine Learning Deep Dive',
        content: `Machine Learning (ML) is the subfield of AI that gives computers the ability to learn without being explicitly programmed.

**The Machine Learning Paradigm**
In traditional programming, you provide Data + Rules = Answers.
In Machine Learning, you provide Data + Answers = Rules. The machine figures out the rules itself, which can then be used on new data.

**Types of Machine Learning**

**1. Supervised Learning**
You give the model labeled data. For example, 10,000 pictures of cats labeled "cat" and 10,000 pictures of dogs labeled "dog". The model learns the difference and can categorize new photos.
- Algorithms: Linear Regression, Logistic Regression, Random Forests, Support Vector Machines (SVM).

**2. Unsupervised Learning**
You give the model unlabeled data. The model tries to find patterns and hidden structures on its own. For example, grouping customers into different marketing segments based on their purchasing behavior.
- Algorithms: K-Means Clustering, Principal Component Analysis (PCA).

**3. Reinforcement Learning**
An agent learns to make decisions by taking actions in an environment to maximize a reward. This is how AI learns to play video games or how robotic dogs learn to walk.
- Examples: AlphaGo (which beat the human world champion at the game of Go), self-driving car navigation.`
      },
      {
        subtitle: '3. Deep Learning & LLMs',
        content: `Deep Learning is a specialized subset of Machine Learning inspired by the structure of the human brain.

**Artificial Neural Networks (ANNs)**
Deep learning models are built using Neural Networks. These networks consist of:
- Input Layer: Receives the data (e.g., pixels of an image).
- Hidden Layers: "Deep" learning refers to having many hidden layers. These layers mathematically transform the data, extracting high-level features.
- Output Layer: Provides the prediction (e.g., "This is a cat").

**How do they learn?**
Through a process called Backpropagation. When a network makes a prediction, it compares it to the correct answer. The difference is the "loss". The network then mathematically adjusts its internal weights using Gradient Descent to minimize this loss.

**Large Language Models (LLMs)**
LLMs like ChatGPT are built on a specific neural network architecture called the Transformer, introduced by Google in 2017.
- They are trained on massive text datasets (essentially the whole internet).
- Their core function is incredibly simple: Given a sequence of words, predict the most statistically likely next word.
- Through this simple mechanism, scaled up to billions of parameters, they develop an emergent understanding of grammar, logic, coding, and reasoning.

**The Future is Generative**
Generative AI doesn't just analyze data; it creates entirely new data. We now have models that can generate photorealistic images (Midjourney), produce high-quality audio, and even generate entire video sequences (OpenAI Sora).`
      },
      {
        subtitle: '4. AI Career & Industry Guide',
        content: `The AI industry is experiencing unprecedented growth, creating entirely new career categories.

**Core AI Roles:**
- **Machine Learning Engineer**: Focuses on deploying ML models into production environments. Requires strong software engineering and ML framework (PyTorch/TensorFlow) skills.
- **AI Researcher**: Typically requires a PhD. Focuses on pushing the boundaries of what AI can do, inventing new architectures.
- **Data Scientist**: Bridges the gap between business and AI, focusing on extracting insights and building predictive models.
- **Prompt Engineer**: A newer role focused on interacting with and fine-tuning LLMs to get the desired output reliably.

**Essential Tools & Languages:**
- **Python**: The undisputed king of AI programming.
- **C++**: Used for performance-critical AI systems (like game AI or self-driving cars).
- **Libraries**: NumPy, Pandas, Scikit-Learn, Hugging Face Transformers.

**Industry Impact:**
AI is not a standalone industry; it is an enabling technology. 
- In **Finance**, AI powers algorithmic trading and fraud detection.
- In **Healthcare**, AI models analyze medical imagery to detect tumors more accurately than human doctors.
- In **Software Development**, AI assistants like GitHub Copilot are dramatically increasing developer productivity.

**Getting Started:**
To break into AI, start with Andrew Ng's legendary "Machine Learning Specialization" on Coursera, learn Python deeply, and begin participating in Kaggle competitions to build a portfolio of real-world projects.`
      }
    ]
  },
  {
    id: 1,
    title: 'Cybersecurity & Ethical Hacking',
    emoji: '🛡️',
    level: 'Intermediate',
    pages: [
      {
        subtitle: '1. The Cyber Landscape',
        content: `Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks.

**The Threat Landscape**
As the world digitizes, warfare and crime have moved to the digital realm. The cost of cybercrime is projected to hit $10.5 trillion annually by 2025.

**Who are the attackers?**
- Script Kiddies: Amateurs using pre-made tools.
- Hacktivists: Hacking for political or social causes (e.g., Anonymous).
- Cybercriminals: Financially motivated hackers (Ransomware gangs).
- Nation-State Actors: Government-funded hackers engaging in espionage or sabotage.

**The CIA Triad**
Every security strategy revolves around the CIA triad:
- Confidentiality: Only authorized people can view the data.
- Integrity: The data hasn't been altered or tampered with.
- Availability: The systems and data are accessible when needed.

**Common Attack Vectors**
- Social Engineering: Manipulating humans into making security mistakes (e.g., Phishing emails). Humans are always the weakest link in any security system.
- Malware: Malicious software, including Viruses, Worms, Trojans, and Spyware.
- DDoS (Distributed Denial of Service): Flooding a server with fake traffic from thousands of compromised computers (a botnet) to take it offline.`
      },
      {
        subtitle: '2. Cryptography',
        content: `Cryptography is the mathematical foundation of cybersecurity. It is the art of writing and solving codes to protect information.

**Symmetric Encryption**
Uses the same key to both encrypt (lock) and decrypt (unlock) the data.
- Fast and efficient for large amounts of data.
- Problem: How do you safely share the key with the other person? If a hacker intercepts the key, the encryption is useless.
- Standard: AES-256 (Advanced Encryption Standard).

**Asymmetric Encryption (Public Key Cryptography)**
Solves the key-sharing problem. Everyone has TWO keys: a Public Key (shared with the world) and a Private Key (kept secret).
- If Alice wants to send a secure message to Bob, she encrypts it using Bob's Public Key.
- Now, the ONLY key in the universe that can decrypt it is Bob's Private Key.
- Standard: RSA, ECC (Elliptic Curve Cryptography).
- This powers HTTPS, SSH, and cryptocurrency.

**Hashing**
Hashing is a one-way mathematical function. You put data in, and you get a fixed-size string of characters out (a hash).
- You cannot reverse a hash back into the original data.
- If you change even one letter in the input, the entire hash changes completely.
- Used for: Securely storing passwords. Websites don't save your password; they save the *hash* of your password. When you log in, they hash what you typed and see if it matches.`
      },
      {
        subtitle: '3. Ethical Hacking',
        content: `Ethical Hacking (or Penetration Testing) involves legally breaking into systems to find vulnerabilities before malicious hackers do.

**The Phases of Ethical Hacking**

**1. Reconnaissance (Footprinting)**
Gathering as much information as possible about the target without actively attacking. This includes finding IP addresses, employee emails, and domain records (using tools like WHOIS or OSINT frameworks).

**2. Scanning**
Actively scanning the target network to see what ports are open, what services are running, and what operating systems are being used. (Tool: Nmap).

**3. Gaining Access (Exploitation)**
Using the vulnerabilities found during scanning to break into the system. This could involve cracking passwords, exploiting a software bug (Buffer Overflow), or sending a phishing email. (Tool: Metasploit).

**4. Maintaining Access**
Once inside, the hacker wants to ensure they don't lose access if the system restarts. They install backdoors or rootkits.

**5. Covering Tracks**
Deleting log files and hiding evidence of the intrusion.

**Defensive Security (Blue Teaming)**
While ethical hackers (Red Team) attack, the Blue Team defends. They set up Firewalls, Intrusion Detection Systems (IDS), and Security Information and Event Management (SIEM) systems to detect and block attacks in real-time.`
      }
    ]
  },
  {
    id: 2,
    title: 'Blockchain & Web3',
    emoji: '🔗',
    level: 'Intermediate',
    pages: [
      {
        subtitle: '1. Blockchain Fundamentals',
        content: `Blockchain is a decentralized, immutable, and transparent ledger system. It was invented in 2008 by the pseudonymous Satoshi Nakamoto to power Bitcoin.

**The Problem with Centralization**
In traditional finance, banks act as centralized ledgers. We trust them to keep track of who has what money. If a bank's database goes down or is hacked, or if the bank goes bankrupt, the system fails. Furthermore, centralized entities can censor transactions.

**The Blockchain Solution**
Instead of one central server, a blockchain database is copied and distributed across thousands of computers worldwide (nodes).

**How a Block is Created:**
1. Transaction Request: Alice wants to send money to Bob.
2. Broadcasting: The request is broadcast to the peer-to-peer network of nodes.
3. Validation: Nodes use cryptography to verify Alice actually has the money and signed the transaction.
4. Block Creation: Validated transactions are bundled into a "block".
5. The Chain: The new block is cryptographically chained to the previous block using a hash.

**Immutability**
Because each block contains the hash of the previous block, you cannot alter an old transaction without changing the hash of that block, which would invalidate every subsequent block in the chain. This makes blockchains virtually impossible to tamper with.`
      },
      {
        subtitle: '2. Consensus Mechanisms',
        content: `Since there is no central authority in a blockchain, how do thousands of independent computers agree on which transactions are valid? They use Consensus Mechanisms.

**Proof of Work (PoW)**
Used by Bitcoin.
- To add a new block to the chain, special nodes called "miners" must solve an incredibly difficult mathematical puzzle.
- This requires massive amounts of electricity and specialized hardware (ASICs).
- The first miner to solve the puzzle gets to add the block and receives a reward (newly minted Bitcoin).
- Why? The high cost of electricity makes it economically irrational to try and cheat the system. To attack Bitcoin, you would need to control 51% of the total computing power, which would cost billions of dollars.

**Proof of Stake (PoS)**
Used by Ethereum 2.0 and Solana.
- Instead of using electricity, participants "stake" (lock up) their own cryptocurrency as collateral.
- The protocol randomly selects a staker (validator) to propose the next block.
- If they validate honest transactions, they earn a reward. If they try to cheat, their staked cryptocurrency is destroyed (slashed).
- PoS is 99.9% more energy-efficient than PoW and allows for faster transaction speeds.`
      },
      {
        subtitle: '3. Web3 & Smart Contracts',
        content: `Web3 represents the next evolution of the internet, built on decentralized networks.

**The Evolution of the Web**
- Web 1.0 (Read): Static HTML pages. Users were purely consumers of information.
- Web 2.0 (Read-Write): Interactive web applications and social media (Facebook, YouTube). Users create content, but tech giants own the platforms and the data.
- Web 3.0 (Read-Write-Own): Decentralized networks. Users own their data, their assets, and govern the platforms themselves.

**Smart Contracts**
Introduced by Ethereum, smart contracts are self-executing programs that run on the blockchain. 
- They contain the rules of an agreement written directly into code.
- If condition X is met, execute outcome Y automatically.
- No lawyers, no middlemen, no escrow agents required.

**Decentralized Finance (DeFi)**
DeFi uses smart contracts to recreate traditional financial instruments (lending, borrowing, trading) without banks. You can take out a million-dollar loan from a decentralized protocol at 3 AM on a Sunday in 10 seconds, provided you have the collateral.

**Non-Fungible Tokens (NFTs)**
Tokens that represent ownership of a unique digital item. Unlike Bitcoin (where every coin is identical and fungible), every NFT is distinct. They are used for digital art, gaming assets, and eventually, digital identity and real estate deeds.`
      }
    ]
  },
  {
    id: 3,
    title: 'Cloud Computing & DevOps',
    emoji: '☁️',
    level: 'Advanced',
    pages: [
      {
        subtitle: '1. The Cloud Revolution',
        content: `Cloud computing is the on-demand delivery of IT resources over the internet with pay-as-you-go pricing.

**The Old Way (On-Premises)**
Historically, if you wanted to launch a website, you had to buy physical servers, install them in a server room, manage the cooling, power, and networking, and guess how much capacity you needed. If your app went viral, the servers would crash. If it failed, you were stuck with expensive hardware.

**The Cloud Way**
Companies like Amazon (AWS), Microsoft (Azure), and Google (GCP) built massive data centers across the world. They rent out slices of their computing power to you. You can spin up 1,000 servers in Tokyo in 30 seconds, and shut them down an hour later, paying only for the exact minutes you used them.

**Service Models**
- IaaS (Infrastructure as a Service): Renting raw virtual machines, storage, and networks. You manage the OS and everything above it. (e.g., AWS EC2).
- PaaS (Platform as a Service): The cloud provider manages the underlying infrastructure and OS. You just upload your code. (e.g., Heroku, AWS Elastic Beanstalk).
- SaaS (Software as a Service): Fully functional software applications accessed via a web browser. (e.g., Google Workspace, Salesforce).`
      },
      {
        subtitle: '2. Modern Cloud Architecture',
        content: `Cloud architecture has evolved significantly from running traditional monolithic applications on virtual machines.

**Microservices**
Instead of building one massive, complex application (a Monolith), modern apps are broken down into Microservices. 
- A Netflix page is powered by hundreds of microservices: one for user login, one for the recommendation engine, one for billing.
- If the billing service crashes, the recommendation engine still works. Teams can develop and deploy services independently.

**Containers & Docker**
A common problem in software development: "It works on my machine, but it crashes on the server." This happens due to differences in OS versions, dependencies, and environment variables.
- Docker solves this by packaging the application code, runtime, system tools, and libraries into a single, standardized unit called a Container.
- Containers run the exact same way on a developer's laptop as they do on a massive cloud server.

**Kubernetes (K8s)**
If a company is running 5,000 containers, how do they manage them? Kubernetes is an open-source container orchestration system originally developed by Google.
- It automatically restarts containers that crash.
- It scales the number of containers up when traffic spikes, and scales them down to save money when traffic drops.
- It manages network traffic and load balancing between thousands of microservices.`
      },
      {
        subtitle: '3. DevOps Culture',
        content: `DevOps is not a specific tool; it is a philosophy that integrates software development (Dev) and IT operations (Ops).

**The Wall of Confusion**
Historically, Developers wanted to push new features as fast as possible. Operations wanted stability and feared change. Developers would write code and throw it "over the wall" to Operations to deploy, leading to bugs, downtime, and blame. DevOps tears down this wall by making teams collaborate throughout the entire lifecycle.

**Continuous Integration (CI)**
Developers merge their code changes into a central repository multiple times a day.
- Every commit automatically triggers an automated build and testing sequence.
- This catches bugs immediately while the code is fresh in the developer's mind, rather than weeks later during a massive release phase.

**Continuous Deployment (CD)**
If the code passes all the automated CI tests, the CD pipeline automatically deploys the code into the production environment.
- Companies practicing elite DevOps (like Amazon or Netflix) deploy new code to production thousands of times a day automatically, without any human intervention.

**Infrastructure as Code (IaC)**
Instead of manually clicking through a cloud provider's website to set up servers and databases, DevOps engineers write configuration files (using tools like Terraform) that define the infrastructure. The infrastructure can then be version-controlled, tested, and deployed just like software code.`
      }
    ]
  },
  {
    id: 4,
    title: 'Quantum Computing',
    emoji: '⚛️',
    level: 'Advanced',
    pages: [
      {
        subtitle: '1. Physics meets Computation',
        content: `Quantum computing harnesses the bizarre phenomena of quantum mechanics to solve problems that are fundamentally impossible for classical computers.

**The Limits of Classical Computing**
Classical computers (from your smartphone to the world's largest supercomputers) process information using bits. A bit is a binary switch that must be in one of two states: 0 or 1.
While classical computers have gotten exponentially faster (Moore's Law), there are certain mathematical problems that scale so poorly that a classical computer would need billions of years to solve them, no matter how fast it gets.

**Enter the Qubit**
Quantum computers use Quantum Bits, or Qubits. Qubits are typically made from subatomic particles like electrons or photons.
Thanks to a quantum property called **Superposition**, a qubit doesn't have to be strictly a 0 or a 1. It can exist in a complex combination of both states simultaneously.
- 2 classical bits can represent one of 4 states at a time (00, 01, 10, or 11).
- 2 qubits can represent all 4 states simultaneously.
- 300 qubits can represent more simultaneous states than there are atoms in the observable universe.

**Quantum Entanglement**
Another core property is Entanglement. When two qubits are entangled, their states become intrinsically linked. If you measure the state of one qubit, you instantly know the state of the other, even if they are separated by light-years. This allows quantum computers to process complex, multi-variable correlations instantaneously.`
      },
      {
        subtitle: '2. The Power and the Threat',
        content: `Why are companies like IBM, Google, and governments worldwide investing billions into quantum computing?

**1. Molecular Simulation & Medicine**
Classical computers cannot accurately simulate the quantum mechanics of complex molecules; the math is too heavy. Quantum computers, operating on quantum principles themselves, are perfectly suited for this. 
- They will be able to simulate chemical reactions at the atomic level, leading to the rapid discovery of new life-saving drugs, highly efficient batteries, and room-temperature superconductors.

**2. Optimization Problems**
Logistics companies routing thousands of delivery trucks, financial institutions balancing complex portfolios, or AI models trying to find the optimal path through billions of parameters. Quantum computers can evaluate millions of possibilities simultaneously to find the absolute best outcome.

**The Security Threat: Shor's Algorithm**
Modern internet security (RSA encryption) relies on a mathematical trapdoor: it is easy to multiply two large prime numbers together, but it is practically impossible for a classical computer to take the massive resulting number and figure out the original primes.
- In 1994, Peter Shor invented a quantum algorithm that can factor these massive numbers exponentially faster.
- A sufficiently powerful quantum computer running Shor's algorithm could crack the encryption protecting the world's banking systems, military secrets, and cryptocurrencies in minutes.
- To prepare for "Q-Day", cryptographers are already developing Post-Quantum Cryptography algorithms that even quantum computers cannot break.`
      },
      {
        subtitle: '3. Building a Quantum Computer',
        content: `If quantum computers are so powerful, why don't we have them on our desks yet? Because building them is one of the hardest engineering challenges in human history.

**The Problem of Decoherence**
Quantum states (superposition and entanglement) are incredibly fragile. Any interaction with the outside world—a stray photon, a tiny fluctuation in temperature, or a weak magnetic field—will cause the qubit to collapse into a classical 0 or 1. This is called decoherence.

**Extreme Environments**
To prevent decoherence, superconducting quantum computers (like those built by IBM and Google) must be kept in dilution refrigerators.
- The chips operate at roughly 15 millikelvins. That is -273°C.
- This is significantly colder than the vacuum of deep space.

**Quantum Error Correction**
Because qubits are so noisy and prone to errors, we need Error Correction. However, in the quantum realm, observing a qubit destroys its state, so we can't just copy the data to check it like a classical computer.
- Instead, physicists entangle multiple physical qubits together to create one stable "Logical Qubit".
- Current estimates suggest we might need 1,000 error-prone physical qubits to create just 1 stable logical qubit.

**The Road Ahead**
We are currently in the NISQ (Noisy Intermediate-Scale Quantum) era. Our quantum computers have 100-1000 noisy qubits. To achieve true fault-tolerant quantum computing that can solve world-changing problems, we will likely need systems with millions of qubits. We are still decades away from maturity, but the race has begun.`
      }
    ]
  },
  {
    id: 5,
    title: 'Data Science & Big Data',
    emoji: '📊',
    level: 'Intermediate to Advanced',
    pages: [
      {
        subtitle: '1. The Era of Big Data',
        content: `Data is often called the "new oil," but unlike oil, it is infinitely renewable. Every click, swipe, purchase, and GPS ping generates data. We create 2.5 quintillion bytes of data every single day.

**The 3 V's of Big Data**
Traditional databases (like SQL) break down when faced with Big Data. Big Data is defined by:
1. Volume: The sheer amount of data. We are talking about Petabytes and Exabytes of information.
2. Velocity: The speed at which data is generated and must be processed. Think of millions of credit card transactions per second worldwide.
3. Variety: Data is no longer just neat tables of numbers. It is unstructured text (tweets), images, video feeds, and sensor data (IoT).

**Hadoop & Spark**
To handle Big Data, we use distributed computing.
- Hadoop popularized the MapReduce paradigm: instead of trying to process a massive dataset on one supercomputer, it splits the data into chunks, distributes it across thousands of cheap commodity computers to process in parallel, and then aggregates the results.
- Apache Spark is the modern successor. It processes data in-memory (RAM) instead of reading from hard drives, making it up to 100x faster than Hadoop for certain tasks. Spark is the industry standard for real-time big data processing.`
      },
      {
        subtitle: '2. The Data Science Pipeline',
        content: `Data Science is the interdisciplinary field that uses scientific methods, algorithms, and systems to extract knowledge and insights from structured and unstructured data.

**The Lifecycle of a Data Science Project:**

**1. Data Collection & Ingestion**
Gathering data from APIs, web scraping, or database queries.

**2. Data Cleaning (Data Wrangling)**
This is notoriously where data scientists spend 80% of their time. Raw data is messy. You must handle missing values, remove duplicates, normalize formats, and identify outliers. A machine learning model trained on garbage data will output garbage predictions.

**3. Exploratory Data Analysis (EDA)**
Using statistics and visualization tools to understand the data. Finding correlations, distributions, and hidden patterns before ever building a predictive model.

**4. Feature Engineering**
Transforming raw data into features that better represent the underlying problem to the predictive models. For example, converting a timestamp into "Day of the Week" to help a model predict weekend sales spikes.

**5. Model Building & Evaluation**
Applying Machine Learning algorithms to the data. Splitting the data into a Training Set (to teach the model) and a Test Set (to evaluate how well the model generalizes to new, unseen data).

**6. Deployment**
Taking the trained model and integrating it into a production application so it can make real-time predictions.`
      },
      {
        subtitle: '3. Data Roles and Visualization',
        content: `The data ecosystem has evolved to specialize into distinct, vital roles.

**1. The Data Engineer**
The builders of the pipeline. They design and construct the infrastructure (ETL pipelines) that extracts data from various sources, transforms it into a clean format, and loads it into a Data Warehouse (like Snowflake or Amazon Redshift) or a Data Lake. They make sure data is accessible, reliable, and secure.

**2. The Data Scientist**
The modelers. They take the clean data provided by engineers, apply advanced statistical analysis, and build machine learning models to predict the future or automate decisions.

**3. The Data Analyst**
The storytellers. They analyze historical data to answer business questions. They use SQL to query databases and create reports.

**Data Visualization**
A complex neural network is useless if you cannot explain its findings to the CEO. Data visualization is the art of translating complex mathematical insights into intuitive visual formats.
- Tools: Tableau, PowerBI, Looker.
- Programming Libraries: Matplotlib and Seaborn (Python), D3.js (JavaScript).
- The goal is to create dashboards that clearly highlight trends, anomalies, and key performance indicators (KPIs) at a glance.

**Summary**
Data Science empowers organizations to move from reactive decision-making based on gut feeling, to proactive, optimized decision-making based on mathematical certainty.`
      },
      {
        subtitle: '4. Data Science Career Path',
        content: `The demand for data professionals continues to outstrip supply, making it one of the most lucrative and stable career choices.

**The Holy Trinity of Data Skills:**
1. **Math & Statistics**: You must understand probability distributions, statistical significance, and linear algebra.
2. **Computer Science**: Proficiency in programming (Python/R), databases (SQL), and cloud computing.
3. **Domain Knowledge**: You must understand the business you are working in. Predicting customer churn for a telecom company requires different knowledge than predicting equipment failure in a factory.

**Key Tools to Master:**
- **SQL**: The absolute foundation. If you can't query data, you can't analyze it.
- **Python Ecosystem**: Pandas (data manipulation), Scikit-Learn (machine learning), Matplotlib (visualization).
- **Big Data Tools**: Apache Spark, Databricks.
- **Cloud Platforms**: AWS (SageMaker), GCP (BigQuery), Azure.

**Certifications to Consider:**
- Google Data Analytics Professional Certificate
- AWS Certified Data Analytics
- Microsoft Certified: Data Scientist Associate

**The Interview Process:**
Data science interviews typically involve:
1. SQL coding tests (window functions, complex joins).
2. Take-home data challenges (given a messy dataset, clean it, build a model, and present findings).
3. Statistical theory questions.
4. Business case studies.

**Final Advice:**
Build a portfolio. Employers care less about your degree and more about what you can build. Find a public dataset on Kaggle or Google Dataset Search, ask an interesting question, analyze the data, and publish your findings on GitHub or Medium.`
      }
    ]
  }
];

export default function CsBook({ onClose }) {
  const [unlockedUpTo, setUnlockedUpTo] = useState(() => {
    const saved = localStorage.getItem('csbook_unlocked');
    return saved ? parseInt(saved) : 0;
  });
  const [completedIds, setCompletedIds] = useState(() => {
    const saved = localStorage.getItem('csbook_completed');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [selectedId, setSelectedId] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageUnlocked, setPageUnlocked] = useState(0);
  
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileContent, setShowMobileContent] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const selectedSubject = SUBJECTS[selectedId];
  const activePageData = selectedSubject.pages[currentPage];
  const totalPages = selectedSubject.pages.length;

  // Reset pagination when subject changes
  useEffect(() => {
    setCurrentPage(0);
    setPageUnlocked(isCompleted(selectedId) ? SUBJECTS[selectedId].pages.length - 1 : 0);
    setHasScrolledToBottom(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [selectedId]);

  // Reset scroll state when page changes
  useEffect(() => {
    if (isCompleted(selectedId) || currentPage < pageUnlocked) {
      setHasScrolledToBottom(true);
    } else {
      setHasScrolledToBottom(false);
    }
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [currentPage, selectedId, pageUnlocked]);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    
    if (atBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      
      if (currentPage === pageUnlocked) {
        setPageUnlocked(prev => Math.min(prev + 1, totalPages - 1));
      }

      // If we hit the bottom of the final page, complete the subject
      if (currentPage === totalPages - 1) {
        const newCompleted = completedIds.includes(selectedId)
          ? completedIds
          : [...completedIds, selectedId];
        const newUnlocked = Math.max(unlockedUpTo, selectedId + 1);
        
        setCompletedIds(newCompleted);
        setUnlockedUpTo(newUnlocked);
        localStorage.setItem('csbook_completed', JSON.stringify(newCompleted));
        localStorage.setItem('csbook_unlocked', String(newUnlocked));
      }
    }
  };

  const isCompleted = (id) => completedIds.includes(id);
  const isUnlocked = (id) => id <= unlockedUpTo;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotateY: -20 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.85, rotateY: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '95vw', maxWidth: 1000, height: '85vh',
          display: 'flex', flexDirection: 'column',
          background: 'linear-gradient(135deg, #1a1025 0%, #120d1e 100%)',
          borderRadius: 24, overflow: 'hidden',
          border: '1px solid rgba(168,85,247,0.3)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(108,99,255,0.2)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '1rem 1.5rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(108,99,255,0.08)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg,#6c63ff,#a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(108,99,255,0.5)'
            }}>
              <BookOpen size={18} color="white" />
            </div>
            <div>
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Advanced CS Library</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: 0 }}>Complete all pages to unlock next subject</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '0.4rem', cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Book body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>

          {/* LEFT — coin list */}
          {(!isMobile || !showMobileContent) && (
            <div style={{
              width: isMobile ? '100%' : 260, flexShrink: 0,
              borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
              padding: '1.25rem 1rem',
              overflowY: 'auto',
              background: 'rgba(0,0,0,0.2)',
              display: 'flex', flexDirection: 'column', gap: 10,
              flex: isMobile ? 1 : 'none'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Subjects</p>
              {SUBJECTS.map(sub => {
                const done = isCompleted(sub.id);
                const unlocked = isUnlocked(sub.id);
                const active = selectedId === sub.id && !isMobile;
                return (
                  <motion.button
                    key={sub.id}
                    onClick={() => {
                      if (unlocked) {
                        setSelectedId(sub.id);
                        if (isMobile) setShowMobileContent(true);
                      }
                    }}
                    whileHover={unlocked ? { scale: 1.02 } : {}}
                    whileTap={unlocked ? { scale: 0.98 } : {}}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '0.75rem 0.8rem', borderRadius: 14,
                      border: active
                        ? '1px solid rgba(168,85,247,0.6)'
                        : done
                        ? '1px solid rgba(245,158,11,0.4)'
                        : '1px solid rgba(255,255,255,0.08)',
                      background: active
                        ? 'rgba(108,99,255,0.2)'
                        : done
                        ? 'rgba(245,158,11,0.08)'
                        : 'rgba(255,255,255,0.03)',
                      cursor: unlocked ? 'pointer' : 'not-allowed',
                      opacity: unlocked ? 1 : 0.45,
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      width: '100%'
                    }}
                  >
                    {/* Coin */}
                    <motion.div
                      animate={done ? { rotate: [0, 360] } : {}}
                      transition={{ duration: 0.6 }}
                      style={{
                        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem',
                        background: done
                          ? 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)'
                          : unlocked
                          ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.15) 100%)'
                          : 'rgba(255,255,255,0.05)',
                        border: done
                          ? '2px solid #fbbf24'
                          : unlocked
                          ? '1px solid rgba(255,255,255,0.4)'
                          : '1px solid rgba(255,255,255,0.1)',
                        boxShadow: done
                          ? '0 0 16px rgba(245,158,11,0.6), inset 0 1px 2px rgba(255,255,255,0.5)'
                          : unlocked
                          ? '0 0 8px rgba(255,255,255,0.1), inset 0 1px 2px rgba(255,255,255,0.3)'
                          : 'none',
                      }}
                    >
                      {unlocked ? sub.emoji : <Lock size={14} color="rgba(255,255,255,0.3)" />}
                    </motion.div>

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <p style={{
                        color: done ? '#fbbf24' : unlocked ? 'white' : 'rgba(255,255,255,0.3)',
                        fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>{sub.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', marginTop: 2 }}>
                        {done ? '✓ Completed' : unlocked ? sub.level : '🔒 Locked'}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* RIGHT — content page */}
          {(!isMobile || showMobileContent) && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
              {/* Page header */}
              <div style={{
                padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)', flexShrink: 0,
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                {isMobile && (
                  <button
                    onClick={() => setShowMobileContent(false)}
                    style={{
                      background: 'rgba(255,255,255,0.1)', border: 'none',
                      borderRadius: 8, padding: '0.5rem', color: 'white',
                      marginRight: '0.5rem', cursor: 'pointer',
                      display: 'flex', alignItems: 'center'
                    }}
                  >
                    <ChevronLeft size={18} />
                  </button>
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: '1.2rem' }}>{selectedSubject.emoji}</span>
                    <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {selectedSubject.title}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: 'rgba(108,99,255,0.2)', color: '#a88dff',
                      border: '1px solid rgba(108,99,255,0.3)'
                    }}>Page {currentPage + 1} of {totalPages}</span>
                    
                    {isCompleted(selectedId) && (
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(245,158,11,0.2)', color: '#fbbf24',
                        border: '1px solid rgba(245,158,11,0.3)'
                      }}>✓ Subject Completed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable content */}
              <div
                ref={contentRef}
                onScroll={handleScroll}
                style={{
                  flex: 1, overflowY: 'auto', padding: isMobile ? '1.25rem' : '2rem',
                  color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? '0.95rem' : '1.05rem', lineHeight: 1.8,
                  fontFamily: 'Inter, sans-serif', paddingBottom: '6rem'
                }}
              >
                <h2 style={{ color: '#00f5d4', fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  {activePageData.subtitle}
                </h2>

                {activePageData.content.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={i} style={{ color: '#a88dff', fontWeight: 800, marginTop: '1.8rem', marginBottom: '0.5rem', fontSize: '1.15rem' }}>{line.replace(/\*\*/g, '')}</h4>;
                  }
                  if (line.trim().startsWith('- ')) {
                    return <li key={i} style={{ margin: '0.4rem 0', marginLeft: '1rem', listStyleType: 'disc' }}>{line.substring(2)}</li>;
                  }
                  if (line.trim().startsWith('1. ') || line.trim().startsWith('2. ') || line.trim().startsWith('3. ') || line.trim().startsWith('4. ') || line.trim().startsWith('5. ') || line.trim().startsWith('6. ')) {
                    return <li key={i} style={{ margin: '0.4rem 0', marginLeft: '1rem', listStyleType: 'decimal' }}>{line.substring(3)}</li>;
                  }
                  return <p key={i} style={{ margin: '0.75rem 0' }}>{line || <br />}</p>;
                })}

                {/* Bottom scroll cue if page not completed */}
                {!hasScrolledToBottom && (
                  <motion.div
                    animate={{ y: [0, 6, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      textAlign: 'center', paddingTop: '3rem',
                      color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', fontWeight: 600
                    }}
                  >
                    ↓ Scroll to bottom to unlock next step ↓
                  </motion.div>
                )}
                
                {hasScrolledToBottom && currentPage === totalPages - 1 && isCompleted(selectedId) && (
                  <div style={{
                    textAlign: 'center', padding: '3rem 1rem 1rem',
                    color: '#fbbf24', fontSize: '1.1rem', fontWeight: 700
                  }}>
                    🌟 Subject Complete! Your coin is now Golden!
                  </div>
                )}
              </div>

              {/* Pagination Footer */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '1rem 1.5rem',
                background: 'rgba(15,10,30,0.95)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '0.5rem 1rem', borderRadius: 8,
                    background: currentPage === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.1)',
                    color: currentPage === 0 ? 'rgba(255,255,255,0.2)' : 'white',
                    border: 'none', cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 600, transition: '0.2s'
                  }}
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)' }}>
                  {currentPage + 1} / {totalPages}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1 || !hasScrolledToBottom}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '0.5rem 1rem', borderRadius: 8,
                    background: (currentPage === totalPages - 1 || !hasScrolledToBottom) 
                      ? 'rgba(255,255,255,0.02)' 
                      : 'linear-gradient(135deg, #6c63ff, #a855f7)',
                    color: (currentPage === totalPages - 1 || !hasScrolledToBottom) 
                      ? 'rgba(255,255,255,0.2)' 
                      : 'white',
                    border: 'none', 
                    cursor: (currentPage === totalPages - 1 || !hasScrolledToBottom) ? 'not-allowed' : 'pointer',
                    fontWeight: 600, transition: '0.2s',
                    boxShadow: (!hasScrolledToBottom || currentPage === totalPages - 1) ? 'none' : '0 0 15px rgba(108,99,255,0.4)'
                  }}
                >
                  {currentPage === totalPages - 1 ? 'Finished' : 'Next Page'} <ArrowRight size={16} />
                </button>
              </div>

            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
