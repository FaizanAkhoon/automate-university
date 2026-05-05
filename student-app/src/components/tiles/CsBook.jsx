import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Lock, ChevronRight } from 'lucide-react';

const SUBJECTS = [
  {
    id: 0,
    title: 'Introduction to Programming',
    emoji: '💻',
    level: 'Beginner',
    content: `Welcome to the world of programming! Programming is the process of giving instructions to a computer to perform specific tasks.

**What is a Program?**
A program is a set of instructions written in a language a computer can understand. Think of it like a recipe — step by step instructions that produce a result.

**Your First Language: Python**
Python is one of the most beginner-friendly languages. Here's your first program:

  print("Hello, World!")

This single line tells the computer to display the text "Hello, World!" on the screen.

**Variables**
Variables are like labeled boxes where you store information:

  name = "Alice"
  age = 20
  print(name, "is", age, "years old")

**Data Types**
- String: Text like "Hello"
- Integer: Whole numbers like 42
- Float: Decimal numbers like 3.14
- Boolean: True or False

**Basic Operations**
You can perform math just like a calculator:

  x = 10
  y = 3
  print(x + y)   # 13
  print(x - y)   # 7
  print(x * y)   # 30
  print(x / y)   # 3.33...

**Conditions (if/else)**
Programs can make decisions:

  temperature = 30
  if temperature > 25:
      print("It is hot outside!")
  else:
      print("It is cool outside.")

**Loops**
Loops let you repeat actions:

  for i in range(5):
      print("Step", i)

This prints "Step 0" through "Step 4".

**Summary**
You now know the absolute basics of programming: variables, data types, conditions, and loops. These are the building blocks of every program ever written. Scroll to the end to unlock the next subject!`
  },
  {
    id: 1,
    title: 'Data Structures',
    emoji: '🗂️',
    level: 'Beginner',
    content: `Data structures are ways of organizing and storing data so that it can be accessed and modified efficiently.

**Arrays / Lists**
A list stores multiple items in one variable:

  fruits = ["apple", "banana", "cherry"]
  print(fruits[0])  # apple

**Dictionaries (Key-Value Pairs)**
Dictionaries store data as key-value pairs:

  student = {"name": "Ali", "grade": "A", "age": 20}
  print(student["name"])  # Ali

**Stacks**
A stack is like a pile of plates — Last In, First Out (LIFO):

  stack = []
  stack.append("page1")
  stack.append("page2")
  stack.pop()  # returns "page2"

**Queues**
A queue is First In, First Out (FIFO) — like a waiting line:

  from collections import deque
  queue = deque(["A", "B", "C"])
  queue.popleft()  # returns "A"

**Linked Lists**
A linked list is a chain of nodes, each pointing to the next. Useful when you need to insert/delete elements frequently.

**Trees**
A tree is a hierarchical structure with a root node and child nodes. Used in file systems, databases, and AI.

**Hash Tables**
Hash tables store key-value pairs with very fast lookup times. Python dictionaries are built on hash tables.

**Why Data Structures Matter**
Choosing the right data structure can make your program 1000x faster. A bad choice can make it painfully slow.

**Big O Notation (Intro)**
We measure speed using Big O:
- O(1) — Instant (hash table lookup)
- O(n) — Grows with data (list search)
- O(log n) — Very fast (binary search)
- O(n²) — Slow (nested loops)

**Summary**
Data structures are the backbone of efficient software. Master them and you will be able to solve complex problems elegantly. Scroll to unlock the next chapter!`
  },
  {
    id: 2,
    title: 'Algorithms',
    emoji: '⚙️',
    level: 'Intermediate',
    content: `An algorithm is a step-by-step procedure for solving a problem. Every software application relies on algorithms.

**Sorting Algorithms**

Bubble Sort — Simple but slow O(n²):
  Compare adjacent items, swap if out of order. Repeat.

Merge Sort — Fast and elegant O(n log n):
  Divide the list in half, sort each half, merge them back.

Quick Sort — Most commonly used O(n log n) average:
  Pick a pivot, put smaller items left, larger items right. Recurse.

**Searching Algorithms**

Linear Search O(n):
  Check each element one by one until found.

Binary Search O(log n):
  Only works on sorted data. Check the middle, go left or right.

  def binary_search(arr, target):
      left, right = 0, len(arr) - 1
      while left <= right:
          mid = (left + right) // 2
          if arr[mid] == target:
              return mid
          elif arr[mid] < target:
              left = mid + 1
          else:
              right = mid - 1
      return -1

**Recursion**
A function that calls itself:

  def factorial(n):
      if n == 1:
          return 1
      return n * factorial(n - 1)

**Dynamic Programming**
Break problems into smaller overlapping sub-problems and store results. Used in GPS navigation, AI, and compression.

**Greedy Algorithms**
Make the locally optimal choice at each step. Used in scheduling, compression (Huffman coding), and networks.

**Graph Algorithms**
- BFS (Breadth-First Search) — Level by level exploration
- DFS (Depth-First Search) — Go deep before going wide
- Dijkstra's — Find shortest path in a weighted graph

**Summary**
Algorithms are what make software intelligent and efficient. With the right algorithm, an impossible problem becomes trivial. Scroll down to unlock Databases!`
  },
  {
    id: 3,
    title: 'Databases',
    emoji: '🗄️',
    level: 'Intermediate',
    content: `A database is an organized collection of structured information, stored electronically in a computer system.

**Types of Databases**

Relational (SQL):
  Data is stored in tables with rows and columns. Tables are related to each other.
  Examples: MySQL, PostgreSQL, SQLite

Non-Relational (NoSQL):
  Data is stored as documents, key-value pairs, or graphs.
  Examples: MongoDB, Redis, Firebase

**SQL Basics**

Create a Table:
  CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT,
    grade TEXT,
    gpa REAL
  );

Insert Data:
  INSERT INTO students VALUES (1, 'Ali', 'CS-3', 3.8);

Query Data:
  SELECT * FROM students WHERE gpa > 3.5;

Update Data:
  UPDATE students SET gpa = 3.9 WHERE id = 1;

Delete Data:
  DELETE FROM students WHERE id = 1;

**Joins**
Joins combine data from multiple tables:

  SELECT students.name, courses.title
  FROM students
  JOIN enrollments ON students.id = enrollments.student_id
  JOIN courses ON enrollments.course_id = courses.id;

**ACID Properties**
Good databases guarantee:
- Atomicity — All or nothing transactions
- Consistency — Data is always valid
- Isolation — Transactions don't interfere
- Durability — Committed data is never lost

**Indexing**
Indexes make queries dramatically faster, like an index in a book. Without an index, a database scans every row.

**Summary**
Databases are the memory of every application. Whether you build a website, mobile app, or AI system, you will need a database. Scroll down to unlock the next chapter!`
  },
  {
    id: 4,
    title: 'Networking & The Internet',
    emoji: '🌐',
    level: 'Intermediate',
    content: `The internet is a global network of computers that communicate using agreed-upon rules called protocols.

**How the Internet Works**
When you visit a website:
1. Your browser looks up the domain name (DNS lookup)
2. Your browser connects to the server's IP address
3. Your browser sends an HTTP request
4. The server sends back an HTTP response
5. Your browser renders the HTML/CSS/JS

**IP Addresses**
Every device on the internet has an IP address. Think of it as your home address on the internet.
  IPv4: 192.168.1.1
  IPv6: 2001:0db8:85a3::8a2e:0370:7334

**TCP/IP**
TCP (Transmission Control Protocol) ensures data arrives completely and in order. IP handles routing.

**HTTP & HTTPS**
HTTP is the language browsers and servers speak. HTTPS is encrypted HTTP (secure).

Common HTTP Methods:
  GET — Retrieve data
  POST — Send new data
  PUT — Update existing data
  DELETE — Remove data

Common Status Codes:
  200 OK — Success
  404 Not Found — Resource missing
  500 Server Error — Something broke on the server
  401 Unauthorized — Need to login first

**DNS**
The Domain Name System translates human-readable names (google.com) into IP addresses (142.250.80.46).

**APIs (Application Programming Interfaces)**
APIs let applications talk to each other. A weather app uses a weather API to get data.

  fetch('https://api.weather.com/today?city=Lahore')
    .then(response => response.json())
    .then(data => console.log(data.temperature))

**WebSockets**
For real-time communication (chat apps, live dashboards), WebSockets keep a persistent connection open.

**Summary**
Understanding networking is essential for building web apps, mobile apps, and cloud services. You now understand the foundation of the entire internet. Scroll to unlock Operating Systems!`
  },
  {
    id: 5,
    title: 'Operating Systems',
    emoji: '🖥️',
    level: 'Advanced',
    content: `An Operating System (OS) is the software that manages all hardware and software resources on a computer.

**What Does an OS Do?**
- Manages CPU time between programs
- Manages RAM allocation
- Handles file storage and retrieval
- Manages input/output devices
- Provides security and user accounts

**Process Management**
A process is a running program. The OS manages thousands simultaneously using scheduling algorithms.

Process States:
  New → Ready → Running → Waiting → Terminated

CPU Scheduling:
  Round Robin — Each process gets a time slice
  Priority Scheduling — Higher priority runs first
  FCFS — First Come First Served

**Memory Management**
The OS divides RAM into pages. When RAM is full, it uses the hard drive as virtual memory (much slower).

  Physical Memory → Pages → Frames
  Virtual Memory → Paging → Swapping

**File Systems**
The OS organizes files in a hierarchical structure:
  C:/Users/Student/Documents/notes.txt

Common File Systems:
  FAT32, NTFS (Windows)
  ext4 (Linux)
  APFS (macOS)

**Concurrency & Threads**
A thread is a lightweight process. Multiple threads share memory within a process.

Problems:
  Race Condition — Two threads modify same data simultaneously
  Deadlock — Two processes wait for each other forever

Solutions:
  Mutex — Only one thread at a time
  Semaphore — Limit concurrent access

**The Kernel**
The kernel is the core of the OS. It runs with full hardware access. User programs talk to the kernel through system calls.

**Shell & Command Line**
  ls          # list files (Linux/Mac)
  dir         # list files (Windows)
  cd /home    # change directory
  mkdir notes # create folder
  rm file.txt # delete file

**Summary**
Operating Systems are the invisible engine powering every device. Understanding them helps you write faster, more efficient software. Congratulations — you have completed the CS Book from Beginner to Advanced! 🎓`
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
  const selected = SUBJECTS[selectedId];

  useEffect(() => {
    setHasScrolledToBottom(false);
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [selectedId]);

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
              <h2 style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>CS Knowledge Book</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: 0 }}>Beginner to Master · Scroll to unlock next chapter</p>
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
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* LEFT — coin list */}
          <div style={{
            width: 220, flexShrink: 0,
            borderRight: '1px solid rgba(255,255,255,0.07)',
            padding: '1.25rem 1rem',
            overflowY: 'auto',
            background: 'rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column', gap: 10
          }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Subjects</p>
            {SUBJECTS.map(sub => {
              const done = isCompleted(sub.id);
              const unlocked = isUnlocked(sub.id);
              const active = selectedId === sub.id;
              return (
                <motion.button
                  key={sub.id}
                  onClick={() => unlocked && setSelectedId(sub.id)}
                  whileHover={unlocked ? { scale: 1.03 } : {}}
                  whileTap={unlocked ? { scale: 0.97 } : {}}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '0.65rem 0.8rem', borderRadius: 14,
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
                      width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1rem',
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
                      fontSize: '0.78rem', fontWeight: 600, lineHeight: 1.2,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>{sub.title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>
                      {done ? '✓ Completed' : unlocked ? sub.level : '🔒 Locked'}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* RIGHT — content page */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Page header */}
            <div style={{
              padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 12
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.3rem',
                background: isCompleted(selected.id)
                  ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                  : 'linear-gradient(135deg, rgba(108,99,255,0.3), rgba(168,85,247,0.3))',
                border: isCompleted(selected.id) ? '2px solid #fbbf24' : '1px solid rgba(168,85,247,0.4)',
                boxShadow: isCompleted(selected.id) ? '0 0 20px rgba(245,158,11,0.5)' : '0 0 12px rgba(108,99,255,0.3)',
              }}>
                {selected.emoji}
              </div>
              <div>
                <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', margin: 0 }}>{selected.title}</h3>
                <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
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
                  {!isCompleted(selected.id) && (
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <ChevronRight size={11} /> Scroll to bottom to unlock next
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
                flex: 1, overflowY: 'auto', padding: '1.5rem',
                color: 'rgba(255,255,255,0.82)', fontSize: '0.9rem', lineHeight: 1.85,
                whiteSpace: 'pre-wrap', fontFamily: 'Inter, sans-serif',
              }}
            >
              {selected.content.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={i} style={{ color: '#a88dff', fontWeight: 700, marginTop: '1.2rem', marginBottom: '0.3rem', fontSize: '0.95rem' }}>{line.replace(/\*\*/g, '')}</p>;
                }
                if (line.trim().startsWith('  ')) {
                  return (
                    <pre key={i} style={{
                      background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.2)',
                      borderRadius: 8, padding: '0.4rem 0.8rem', fontSize: '0.82rem',
                      color: '#00f5d4', fontFamily: 'monospace', margin: '0.2rem 0',
                      overflowX: 'auto', whiteSpace: 'pre-wrap'
                    }}>{line}</pre>
                  );
                }
                return <p key={i} style={{ margin: '0.25rem 0' }}>{line || <br />}</p>;
              })}

              {/* Bottom scroll cue */}
              {!isCompleted(selected.id) && (
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{
                    textAlign: 'center', paddingTop: '2rem', paddingBottom: '1rem',
                    color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem'
                  }}
                >
                  ↓ Scroll to the end to complete this chapter ↓
                </motion.div>
              )}
              {isCompleted(selected.id) && (
                <div style={{
                  textAlign: 'center', padding: '2rem 1rem',
                  color: '#fbbf24', fontSize: '0.9rem', fontWeight: 600
                }}>
                  🌟 Chapter Complete! Coin turned Golden!
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
