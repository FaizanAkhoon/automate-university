import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Lock, ChevronRight, ChevronLeft } from 'lucide-react';

const SUBJECTS = [
  {
    id: 0,
    title: 'Artificial Intelligence & ML',
    emoji: '🤖',
    level: 'Beginner to Advanced',
    content: `Artificial Intelligence (AI) and Machine Learning (ML) represent the most significant technological shift since the invention of the internet.

**What is AI?**
Artificial Intelligence is the simulation of human intelligence by software-coded heuristics. It is the ability of a computer program or a machine to think and learn.

**Machine Learning (ML)**
Machine learning is a subset of AI where instead of explicitly programming the rules, we give the machine data and the answers, and let it figure out the rules.

  # Example of traditional programming
  if (user_age > 18) { show_adult_content() }

  # Example of ML concept
  model.train(data_of_millions_of_users)
  prediction = model.predict(new_user)

**Deep Learning & Neural Networks**
Deep learning uses artificial neural networks inspired by the human brain. They consist of input layers, multiple hidden layers, and output layers. This is the technology behind facial recognition, self-driving cars, and ChatGPT.

**Large Language Models (LLMs)**
LLMs like GPT-4 are built on the Transformer architecture. They work by predicting the most statistically likely next word in a sequence based on billions of parameters trained on vast swaths of the internet.

**The Future of AI**
- Autonomous Agents: AI that can browse the web, use apps, and complete complex multi-step workflows.
- AGI (Artificial General Intelligence): Theoretical AI that equals or exceeds human intelligence across all cognitive tasks.
- AI in Healthcare: Predicting diseases long before symptoms appear and discovering new drugs in days instead of decades.

**Key Skills to Learn:**
- Python (The lingua franca of AI)
- Linear Algebra, Calculus, and Statistics
- Frameworks: PyTorch, TensorFlow, Scikit-learn
- Prompt Engineering & Fine-tuning models

**Summary**
AI is not just a tool; it is a new paradigm of computing. Those who learn to harness it will build the future.`
  },
  {
    id: 1,
    title: 'Cybersecurity & Ethical Hacking',
    emoji: '🛡️',
    level: 'Intermediate',
    content: `As our world becomes entirely digital, Cybersecurity is the shield that protects our infrastructure, privacy, and wealth.

**The Threat Landscape**
Cybersecurity is an eternal arms race between attackers (Black Hat hackers) and defenders (White Hat / Ethical hackers).

**Common Attack Vectors:**
- Phishing: Deceiving users into revealing credentials.
- Ransomware: Encrypting a company's data and demanding payment for the decryption key.
- SQL Injection: Tricking a database into executing malicious SQL code.
- Zero-Day Exploits: Exploiting software vulnerabilities before the creator even knows they exist.

**Cryptography basics**
Cryptography is the math of keeping secrets.
- Symmetric Encryption: Using the same key to lock and unlock (e.g., AES).
- Asymmetric Encryption: Using a Public Key to lock, and a Private Key to unlock (e.g., RSA). This powers the entire internet (HTTPS).
- Hashing: A one-way mathematical function that turns data into a fixed-length string (e.g., SHA-256). Used for securely storing passwords.

**Ethical Hacking (Penetration Testing)**
Ethical hackers are hired by companies to break into their systems legally to find weaknesses before bad actors do.

**The Cyber Kill Chain:**
1. Reconnaissance (Gathering info)
2. Weaponization (Creating the malware)
3. Delivery (Sending it via email/USB)
4. Exploitation (Triggering the code)
5. Installation (Creating a backdoor)
6. Command & Control (Taking over the system)
7. Actions on Objectives (Stealing data/money)

**Key Skills to Learn:**
- Linux command line (Kali Linux is the industry standard)
- Networking protocols (TCP/IP, DNS, HTTP)
- Python and Bash scripting
- Understanding system architecture

**Summary**
Cybersecurity professionals are the digital guardians of the modern era. With increasing cyber warfare, this field offers zero unemployment and infinite challenges.`
  },
  {
    id: 2,
    title: 'Blockchain & Web3',
    emoji: '🔗',
    level: 'Intermediate',
    content: `Blockchain technology and Web3 represent a fundamental reimagining of how trust and ownership work on the internet.

**What is a Blockchain?**
At its core, a blockchain is a distributed, immutable public ledger. Instead of one central database owned by a company (like a bank), the database is shared across thousands of computers globally.

**How it Works:**
1. Someone requests a transaction.
2. The request is broadcasted to a peer-to-peer network of computers (nodes).
3. The nodes validate the transaction using cryptographic algorithms.
4. Once verified, the transaction is combined with others to create a new "block" of data.
5. The new block is permanently linked (chained) to the previous block.

**Smart Contracts**
Smart contracts are self-executing code living on a blockchain. If X happens, then execute Y. They run exactly as programmed without any possibility of downtime, censorship, or third-party interference.

  // Simple Solidity Smart Contract
  contract VendingMachine {
      mapping(address => uint) public balances;
      
      function deposit() public payable {
          balances[msg.sender] += msg.value;
      }
  }

**Web2 vs Web3**
- Web1 (Read): Static websites, no interaction.
- Web2 (Read/Write): Social media, user-generated content, but owned by mega-corporations (Google, Meta).
- Web3 (Read/Write/Own): Decentralized networks where users own their data and assets via cryptographic tokens.

**Decentralized Finance (DeFi)**
Traditional finance requires middlemen (banks, brokers) who take a cut. DeFi replaces middlemen with smart contracts, allowing borderless lending, borrowing, and trading.

**Key Skills to Learn:**
- Solidity (for Ethereum smart contracts) or Rust (for Solana)
- Cryptography principles (Public/Private keys, Hash functions)
- Ethers.js or Web3.js to connect frontends to blockchains

**Summary**
While volatile, the underlying technology of Web3 provides a censorship-resistant framework for digital ownership, identity, and programmable money.`
  },
  {
    id: 3,
    title: 'Cloud Computing & DevOps',
    emoji: '☁️',
    level: 'Advanced',
    content: `Cloud Computing and DevOps have revolutionized how software is built, deployed, and scaled across the globe.

**What is the Cloud?**
"There is no cloud, it's just someone else's computer."
Cloud computing is the delivery of computing services (servers, storage, databases, networking) over the internet. Instead of buying physical servers, you rent them by the second from providers like AWS, Google Cloud, or Azure.

**Cloud Service Models:**
- IaaS (Infrastructure as a Service): Renting raw virtual machines.
- PaaS (Platform as a Service): The provider manages the OS, you just deploy code (e.g., Heroku, Vercel).
- SaaS (Software as a Service): Fully built apps accessed via browser (e.g., Gmail, Slack).

**Serverless Computing**
Serverless doesn't mean there are no servers; it means you don't manage them. Your code only runs when triggered, and you pay exactly for the milliseconds it executes. It scales from 0 to 100,000 requests instantly.

**DevOps Culture**
DevOps is the union of Development and Operations. Historically, developers wrote code and handed it to operations to deploy, causing massive friction. DevOps automates this entire lifecycle.

**CI/CD (Continuous Integration / Continuous Deployment)**
- CI: Automatically testing code every time a developer commits to GitHub.
- CD: Automatically deploying the code to production if tests pass.
Result: Companies deploy new features 50 times a day without breaking anything.

**Containers & Docker**
Before containers, code that worked on a developer's laptop might break on the server due to different environments. Docker wraps the code and all its dependencies into a standardized container that runs exactly the same anywhere.

**Kubernetes**
When you have hundreds of containers running microservices, you need an orchestrator. Kubernetes (invented by Google) automatically scales containers up when traffic spikes, and restarts them if they crash.

**Key Skills to Learn:**
- Linux Administration
- Docker and Kubernetes
- CI/CD tools (GitHub Actions, Jenkins)
- Infrastructure as Code (Terraform)

**Summary**
Cloud & DevOps engineers are the architects of the internet's infrastructure, ensuring apps never go down regardless of how many millions of users log in.`
  },
  {
    id: 4,
    title: 'Quantum Computing',
    emoji: '⚛️',
    level: 'Advanced',
    content: `Quantum computing is not just a faster computer; it is a completely new paradigm of computation based on quantum mechanics.

**Classical vs Quantum**
Classical computers use bits (0 or 1).
Quantum computers use qubits (quantum bits).

Because of a quantum property called 'superposition', a qubit can be 0, 1, or both 0 and 1 simultaneously. This means a quantum computer can perform millions of calculations at the exact same time, whereas a classical computer does them one by one.

**Entanglement**
Another quantum property is entanglement. If two qubits are entangled, changing the state of one instantly changes the state of the other, regardless of the physical distance between them. This allows quantum computers to process complex correlations instantaneously.

**What will Quantum Computers do?**
1. Drug Discovery: Accurately simulating molecular interactions to discover cures in days.
2. Material Science: Designing lighter, stronger materials or room-temperature superconductors.
3. Cryptography: Shor's algorithm running on a powerful quantum computer could break current internet encryption (RSA) in minutes. (This is why we are currently developing 'Post-Quantum Cryptography').

**The Challenges**
Qubits are extremely fragile. They must be kept at temperatures colder than deep space (near Absolute Zero, -273°C). Any interference from heat or electromagnetic fields causes "decoherence," destroying the calculation.

**Quantum Programming**
Programming a quantum computer involves writing quantum circuits using logic gates that manipulate probabilities.

  // Qiskit (Python framework by IBM)
  from qiskit import QuantumCircuit
  qc = QuantumCircuit(2)
  qc.h(0)     # Apply Hadamard gate (puts qubit in superposition)
  qc.cx(0, 1) # Entangle qubit 0 with qubit 1

**Summary**
Quantum computing is currently in its infancy (the "vacuum tube" era of quantum). However, when it matures, it will solve problems in minutes that would take classical supercomputers millions of years.`
  },
  {
    id: 5,
    title: 'Data Science & Big Data',
    emoji: '📊',
    level: 'Intermediate to Advanced',
    content: `Data is the new oil. Data Science is the refinery that turns raw data into actionable insights and predictive models.

**The V's of Big Data**
- Volume: Massive amounts of data (Terabytes/Petabytes).
- Velocity: Data streaming in at unprecedented speed.
- Variety: Structured (SQL), unstructured (text, video), and semi-structured data.

**The Data Science Lifecycle:**
1. Data Collection: Scraping, APIs, databases.
2. Data Cleaning: 80% of a data scientist's job. Handling missing values, outliers, and formatting.
3. Exploratory Data Analysis (EDA): Finding patterns and correlations using statistics.
4. Model Building: Applying machine learning algorithms to predict future outcomes.
5. Deployment: Serving the model via an API for applications to use.

**Data Engineering**
Before Data Scientists can analyze data, Data Engineers must build pipelines. They extract data from sources, transform it, and load it into massive Data Warehouses or Data Lakes (ETL pipelines). Technologies include Apache Spark, Kafka, and Hadoop.

**Analytics vs Data Science**
- Data Analytics looks at the past: "Why did sales drop last month?"
- Data Science looks at the future: "Based on weather patterns, economic indicators, and historical trends, what will sales be next month?"

**Data Visualization**
Numbers alone are hard to understand. Visualizing data via dashboards (Tableau, PowerBI) or programming libraries (Matplotlib, D3.js) is crucial to communicating findings to stakeholders.

**Key Skills to Learn:**
- SQL (Advanced querying is mandatory)
- Python (Pandas, NumPy) or R
- Statistics and Probability Theory
- Data Storytelling (The ability to explain complex math to business leaders)

**Summary**
Every click, swipe, and purchase generates data. Data Science is the superpower that allows companies to understand their users, optimize their operations, and predict the future.

🌟 **Congratulations!** You have completed the comprehensive guide to Future-Proof Technologies. You are now equipped with the knowledge to shape the future of tech!`
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

  const selected = SUBJECTS[selectedId];

  useEffect(() => {
    setHasScrolledToBottom(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [selectedId, showMobileContent]);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
    if (atBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      const newCompleted = completedIds.includes(selectedId)
        ? completedIds
        : [...completedIds, selectedId];
      const newUnlocked = Math.max(unlockedUpTo, selectedId + 1);
      setCompletedIds(newCompleted);
      setUnlockedUpTo(newUnlocked);
      localStorage.setItem('csbook_completed', JSON.stringify(newCompleted));
      localStorage.setItem('csbook_unlocked', String(newUnlocked));
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
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>Future Tech Book</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: 0 }}>Scroll chapter to unlock next</p>
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

          {/* LEFT — coin list (Hide on mobile if showing content) */}
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

          {/* RIGHT — content page (Hide on mobile if NOT showing content) */}
          {(!isMobile || showMobileContent) && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem',
                  background: isCompleted(selected.id)
                    ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                    : 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(168,85,247,0.3))',
                  border: isCompleted(selected.id) ? '2px solid #fbbf24' : '1px solid rgba(168,85,247,0.4)',
                  boxShadow: isCompleted(selected.id) ? '0 0 20px rgba(245,158,11,0.5)' : '0 0 12px rgba(108,99,255,0.3)',
                }}>
                  {selected.emoji}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selected.title}</h3>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                      background: 'rgba(108,99,255,0.2)', color: '#a88dff',
                      border: '1px solid rgba(108,99,255,0.3)'
                    }}>{selected.level}</span>
                    {isCompleted(selected.id) && (
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                        background: 'rgba(245,158,11,0.2)', color: '#fbbf24',
                        border: '1px solid rgba(245,158,11,0.3)'
                      }}>✓ Completed</span>
                    )}
                    {!isCompleted(selected.id) && !isMobile && (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ChevronRight size={11} /> Scroll to bottom to unlock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Scrollable content */}
              <div
                ref={contentRef}
                onScroll={handleScroll}
                style={{
                  flex: 1, overflowY: 'auto', padding: isMobile ? '1rem' : '1.5rem 2rem',
                  color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? '0.95rem' : '1rem', lineHeight: 1.8,
                  whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif',
                }}
              >
                {selected.content.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return <h4 key={i} style={{ color: '#a88dff', fontWeight: 800, marginTop: '1.5rem', marginBottom: '0.4rem', fontSize: '1.1rem' }}>{line.replace(/\*\*/g, '')}</h4>;
                  }
                  if (line.trim().startsWith('  ')) {
                    return (
                      <pre key={i} style={{
                        background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
                        borderRadius: 10, padding: '0.6rem 1rem', fontSize: '0.85rem',
                        color: '#00f5d4', fontFamily: 'monospace', margin: '0.5rem 0',
                        overflowX: 'auto', whiteSpace: 'pre-wrap'
                      }}>{line}</pre>
                    );
                  }
                  return <p key={i} style={{ margin: '0.35rem 0' }}>{line || <br />}</p>;
                })}

                {/* Bottom scroll cue */}
                {!isCompleted(selected.id) && (
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      textAlign: 'center', paddingTop: '3rem', paddingBottom: '2rem',
                      color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', fontWeight: 600
                    }}
                  >
                    ↓ Keep scrolling to complete chapter ↓
                  </motion.div>
                )}
                {isCompleted(selected.id) && (
                  <div style={{
                    textAlign: 'center', padding: '3rem 1rem',
                    color: '#fbbf24', fontSize: '1.1rem', fontWeight: 700
                  }}>
                    🌟 Chapter Complete! Your coin has turned Golden!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
