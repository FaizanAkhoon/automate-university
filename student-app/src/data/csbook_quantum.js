export const QUANTUM = {
  id: 4, title: 'Quantum Computing', emoji: '⚛️', level: 'Intermediate → Advanced',
  pages: [
    { subtitle: '1. Quantum Mechanics for CS', content: `Quantum computing harnesses quantum mechanical phenomena to perform computations impossible for classical computers.

**Classical Bits vs Qubits**
- Classical Bit: Must be 0 OR 1. Like a light switch — on or off.
- Qubit: Can be 0, 1, or a superposition of both simultaneously. Like a spinning coin — both heads and tails until it lands.

**Superposition**
A qubit in superposition exists in a probability distribution of states:
|ψ⟩ = α|0⟩ + β|1⟩
Where |α|² + |β|² = 1, and |α|² is the probability of measuring 0.

**Entanglement**
When two qubits are entangled, measuring one instantly determines the other's state, regardless of distance. Einstein called it "spooky action at a distance."
- If qubit A is measured as 0, entangled qubit B is guaranteed to be 1 (or vice versa).
- Not communication — no information is transmitted faster than light.
- Enables quantum teleportation and superdense coding.

**Measurement**
Observing a qubit collapses its superposition into a definite state (0 or 1). This is probabilistic — you cannot predict the exact outcome, only probabilities.

**No-Cloning Theorem**
It is impossible to create an identical copy of an unknown quantum state. This has profound implications for quantum cryptography (QKD).

**Why Quantum is Powerful**
- n classical bits represent ONE of 2ⁿ states.
- n qubits represent ALL 2ⁿ states simultaneously.
- 300 qubits can represent more states than atoms in the observable universe.` },
    { subtitle: '2. Quantum Gates & Circuits', content: `Quantum algorithms are built using quantum gates — operations that manipulate qubits.

**Single-Qubit Gates**

**Pauli-X Gate (NOT Gate)**
Flips |0⟩ to |1⟩ and vice versa.
X = [[0, 1], [1, 0]]

**Hadamard Gate (H)**
Creates superposition from a definite state.
H|0⟩ = (|0⟩ + |1⟩)/√2
H|1⟩ = (|0⟩ - |1⟩)/√2
The most important gate — the gateway to quantum computing.

**Phase Gates (S, T)**
Add phase shifts to the |1⟩ component without changing probabilities.

**Multi-Qubit Gates**

**CNOT (Controlled-NOT)**
Two-qubit gate. Flips the target qubit IF the control qubit is |1⟩.
- Creates entanglement when preceded by a Hadamard.
- H on qubit 0 + CNOT(0,1) = Bell State (maximally entangled pair).

**Toffoli Gate (CCNOT)**
Three-qubit gate. Flips target only if BOTH controls are |1⟩.
- Enables reversible classical computation.

**Quantum Circuits**
Qubits start in |0⟩ state.
Gates are applied left to right.
Measurement collapses the final state.

Example: Bell State Circuit
q0: ─[H]─●─[M]
q1: ─────X─[M]

This creates maximal entanglement between q0 and q1.

**Reversibility**
All quantum operations (except measurement) are reversible. Every gate has an inverse. This is fundamentally different from classical computing where information can be destroyed.` },
    { subtitle: '3. Quantum Algorithms', content: `Quantum algorithms solve specific problems exponentially faster than any known classical algorithm.

**Deutsch-Jozsa Algorithm**
The first quantum algorithm to demonstrate exponential speedup.
- Problem: Determine if a function f(x) is constant (same output for all inputs) or balanced (different outputs for half the inputs).
- Classical: Requires 2ⁿ⁻¹ + 1 evaluations in worst case.
- Quantum: Requires exactly 1 evaluation. Exponential speedup.

**Grover's Search Algorithm**
Searching an unsorted database.
- Classical: O(N) — check every element.
- Quantum: O(√N) — quadratic speedup.
- For a database of 1 million items: Classical needs ~1 million checks. Grover needs ~1,000.
- Applications: Database search, optimization, SAT solving.

**Shor's Factoring Algorithm**
Factoring large numbers into primes.
- Classical (best known): Sub-exponential time.
- Quantum (Shor): Polynomial time — exponential speedup.
- Impact: RSA-2048 encryption relies on factoring being hard. A sufficiently powerful quantum computer running Shor's algorithm would crack it in hours.
- This threatens all current public-key cryptography.

**Quantum Phase Estimation (QPE)**
Estimates eigenvalues of unitary operators.
- Building block for Shor's algorithm.
- Essential for quantum chemistry simulations.

**Variational Quantum Eigensolver (VQE)**
A hybrid classical-quantum algorithm for finding ground state energies of molecules.
- Uses a parameterized quantum circuit (ansatz).
- Classical optimizer tunes the parameters.
- Near-term application for drug discovery and materials science.` },
    { subtitle: '4. Quantum Hardware', content: `Building a quantum computer is one of the hardest engineering challenges in history.

**Superconducting Qubits**
Used by IBM, Google, Rigetti.
- Tiny circuits made of superconducting materials (niobium, aluminum).
- Operate at 15 millikelvin (-273.13°C) — colder than outer space.
- Cooled by dilution refrigerators costing $1-5 million.
- Gate times: ~20 nanoseconds (fast).
- Coherence time: ~100 microseconds (short).
- Current scale: 100-1000+ qubits.

**Trapped Ion Qubits**
Used by IonQ, Quantinuum.
- Individual atoms (ytterbium, barium) suspended in electromagnetic fields.
- Manipulated with precision lasers.
- Coherence time: seconds to minutes (much longer).
- Gate times: ~10 microseconds (slower).
- Higher fidelity gates but harder to scale.

**Photonic Qubits**
Used by Xanadu, PsiQuantum.
- Use photons (particles of light) as qubits.
- Can operate at room temperature.
- Natural for quantum communication/networking.
- Hard to create deterministic interactions between photons.

**Topological Qubits**
Microsoft's approach.
- Use exotic quasiparticles (Majorana fermions).
- Theoretically error-resistant by design.
- Still in early research stage.

**Quantum Volume**
A holistic benchmark considering qubit count, connectivity, gate fidelity, and coherence.
- IBM Quantum Volume: 127 (2023).
- Higher is better, but not directly comparable across architectures.` },
    { subtitle: '5. Quantum Error Correction', content: `Current qubits are noisy and error-prone. Quantum Error Correction (QEC) is essential for practical quantum computing.

**The Noise Problem**
Qubits are incredibly sensitive to:
- Thermal noise (even at near absolute zero).
- Electromagnetic interference.
- Cosmic rays (yes, really).
- Crosstalk between neighboring qubits.
Error rates: ~0.1-1% per gate operation (classical computers: ~10⁻¹⁸ per operation).

**Why QEC is Hard**
- No-Cloning Theorem: Cannot copy quantum states for redundancy.
- Measurement Destroys: Checking a qubit's state collapses it.
- Continuous Errors: Unlike classical bit-flips, quantum errors can be continuous rotations.

**Surface Code**
The leading QEC approach:
- Arrange physical qubits in a 2D grid.
- Data qubits store information; syndrome qubits detect errors.
- Repeatedly measure syndromes to detect and correct errors without disturbing data.
- Distance d code: Can correct floor((d-1)/2) errors.
- Overhead: ~1,000 physical qubits per 1 logical qubit.

**Logical Qubits**
- Physical qubits: The actual, noisy hardware qubits.
- Logical qubits: Error-corrected virtual qubits made from many physical qubits.
- To run Shor's algorithm on RSA-2048: Need ~4,000 logical qubits → ~4 million physical qubits.
- Current state: ~1,000 physical qubits. We're still far from fault-tolerant quantum computing.

**NISQ Era**
We are in the Noisy Intermediate-Scale Quantum era:
- 100-1000 noisy qubits.
- Cannot run full error correction.
- Focus on variational/hybrid algorithms that tolerate some noise.
- "Quantum advantage" demonstrated but not yet practically useful.` },
    { subtitle: '6. Post-Quantum Cryptography', content: `Quantum computers threaten current encryption. The world is racing to develop quantum-resistant cryptography.

**What's at Risk?**
- RSA, ECC, Diffie-Hellman: All broken by Shor's algorithm.
- These protect: HTTPS, SSH, VPNs, email encryption, digital signatures, cryptocurrencies.
- "Harvest Now, Decrypt Later": Adversaries are already collecting encrypted data to decrypt once quantum computers are ready.

**NIST Post-Quantum Standards (2024)**
After a 6-year competition, NIST selected:

**CRYSTALS-Kyber (ML-KEM)**
- Key encapsulation (key exchange).
- Based on Module Learning With Errors (MLWE) problem.
- Fast, small key sizes. Primary replacement for Diffie-Hellman/ECDH.

**CRYSTALS-Dilithium (ML-DSA)**
- Digital signatures.
- Based on Module Learning With Errors.
- Primary replacement for RSA/ECDSA signatures.

**FALCON**
- Alternative digital signature scheme.
- Based on lattice problems (NTRU lattices).
- Smaller signatures but more complex implementation.

**SPHINCS+ (SLH-DSA)**
- Hash-based signatures.
- Conservative choice — security relies only on hash functions.
- Larger signatures but highest confidence in security.

**Quantum Key Distribution (QKD)**
Uses quantum mechanics itself for secure key exchange:
- Any eavesdropping attempt disturbs the quantum state and is detectable.
- BB84 protocol: Proven information-theoretically secure.
- Limitation: Requires dedicated fiber optic or satellite links.

**Migration Timeline**
- 2024-2030: Standards finalized, early adoption.
- 2030-2035: Widespread migration of critical systems.
- "Crypto-agility": Design systems to swap algorithms easily.` },
    { subtitle: '7. Quantum Applications', content: `Where quantum computing will have the most transformative impact.

**Drug Discovery & Chemistry**
- Accurately simulate molecular interactions at the quantum level.
- Classical computers cannot simulate molecules with more than ~50 atoms.
- Quantum computers can model protein folding, drug-receptor binding, and chemical reactions.
- Could cut drug development time from 10 years to months.

**Materials Science**
- Design new materials: room-temperature superconductors, ultra-efficient solar cells, better batteries.
- Simulate material properties from first principles.

**Financial Optimization**
- Portfolio optimization: Find the best asset allocation across thousands of variables.
- Risk analysis: Monte Carlo simulations run exponentially faster.
- Derivative pricing: More accurate and faster pricing models.

**Supply Chain & Logistics**
- Vehicle routing optimization (thousands of delivery trucks).
- Supply chain network optimization.
- These are NP-hard problems where quantum speedups could be transformative.

**Machine Learning**
- Quantum Kernel Methods: Use quantum computers to compute kernel functions for SVMs.
- Quantum Neural Networks: Parameterized quantum circuits as neural network layers.
- Quantum Sampling: Generate complex probability distributions.
- Still early — unclear if quantum ML will provide practical speedups.

**Cryptanalysis**
- Breaking current encryption (Shor's algorithm).
- Cracking hash functions (Grover's algorithm — quadratic speedup).
- Motivating the entire post-quantum cryptography effort.

**Climate Modeling**
- More accurate climate simulations.
- Optimize carbon capture processes.
- Design more efficient catalysts for green chemistry.` },
    { subtitle: '8. Qiskit Programming', content: `Qiskit is IBM's open-source framework for quantum computing in Python.

**Installation**
pip install qiskit qiskit-aer

**Creating a Quantum Circuit**
from qiskit import QuantumCircuit

# Create circuit with 2 qubits and 2 classical bits
qc = QuantumCircuit(2, 2)

# Apply Hadamard to qubit 0 (superposition)
qc.h(0)

# Apply CNOT (entangle qubit 0 and 1)
qc.cx(0, 1)

# Measure both qubits
qc.measure([0, 1], [0, 1])

# Visualize the circuit
print(qc.draw())

**Running on Simulator**
from qiskit_aer import AerSimulator

simulator = AerSimulator()
result = simulator.run(qc, shots=1000).result()
counts = result.get_counts()
print(counts)  # {'00': 500, '11': 500} (approximately)

**Running on Real Hardware**
from qiskit_ibm_runtime import QiskitRuntimeService

service = QiskitRuntimeService(channel="ibm_quantum")
backend = service.least_busy()
job = backend.run(qc, shots=1000)
result = job.result()

**Grover's Algorithm Implementation**
from qiskit.circuit.library import GroverOperator
from qiskit.algorithms import AmplificationProblem, Grover

# Define oracle (marks the solution state)
oracle = QuantumCircuit(2)
oracle.cz(0, 1)  # Mark state |11⟩

problem = AmplificationProblem(oracle)
grover = Grover(iterations=1)
result = grover.amplify(problem)

**Other Frameworks**
- Cirq (Google): Python framework for NISQ circuits.
- PennyLane (Xanadu): Focus on quantum machine learning.
- Q# (Microsoft): Standalone quantum language.
- Amazon Braket: Access multiple quantum hardware providers.` },
    { subtitle: '9. Quantum vs Classical Comparison', content: `Understanding when quantum computers excel and when classical computers remain superior.

**Where Quantum Wins**
- Factoring large numbers: Exponential speedup (Shor's).
- Unstructured search: Quadratic speedup (Grover's).
- Quantum simulation: Exponential speedup for simulating quantum systems.
- Certain optimization problems: Potential exponential speedup.

**Where Classical Wins**
- Sequential tasks: Quantum computers don't speed up inherently sequential processes.
- Small datasets: Overhead of quantum error correction makes classical faster for small inputs.
- Boolean logic: Classical logic gates are simpler, faster, and more reliable.
- Everyday computing: Web browsing, word processing, gaming — quantum adds nothing.

**Hybrid Approach**
Most near-term quantum algorithms are hybrid:
1. Classical computer prepares the problem.
2. Quantum computer performs the exponentially hard part.
3. Classical computer processes the results.
- VQE, QAOA: Classical optimizer + quantum circuit.
- This is the practical approach for the NISQ era.

**Timeline Predictions**
- 2024-2026: 1,000-10,000 physical qubits. Limited quantum advantage for specific problems.
- 2027-2030: Early error correction. Useful for chemistry and optimization.
- 2030-2035: Fault-tolerant systems. Cryptographic implications become real.
- 2035+: Broad practical quantum computing. New industries emerge.

**Quantum Supremacy / Advantage**
- 2019: Google Sycamore performed a specific task in 200 seconds that would take classical supercomputers 10,000 years.
- Debated: IBM claimed classical simulation in 2.5 days.
- True practical quantum advantage (solving useful problems faster) is still being pursued.` },
    { subtitle: '10. Quantum Computing Careers', content: `Quantum computing is a small but rapidly growing field with extraordinary salaries.

**Career Paths**

**Quantum Software Engineer ($100K-$200K)**
Write quantum algorithms and applications using Qiskit, Cirq, or PennyLane.

**Quantum Research Scientist ($120K-$250K+)**
PhD typically required. Publish papers on new algorithms, error correction, or hardware.

**Quantum Hardware Engineer ($110K-$220K)**
Design and build quantum processors. Physics/EE background essential.

**Quantum Applications Scientist ($100K-$200K)**
Apply quantum computing to specific domains (chemistry, finance, optimization).

**Companies Hiring**
- IBM Quantum, Google Quantum AI, Microsoft Azure Quantum
- Amazon (Braket), IonQ, Rigetti, Quantinuum
- Startups: Xanadu, PsiQuantum, Atom Computing
- Finance: Goldman Sachs, JPMorgan (quantum research teams)
- Pharma: Roche, Merck (quantum chemistry)

**Learning Path**
1. Strong foundation in linear algebra and complex numbers.
2. Learn quantum mechanics basics (no physics degree needed).
3. Complete IBM Quantum Learning courses (free).
4. Work through Qiskit Textbook (online, free).
5. Take MIT 8.370x Quantum Information Science (edX).
6. Build projects: Implement quantum algorithms, contribute to Qiskit.

**Key Resources**
- Qiskit Textbook (qiskit.org/learn)
- "Quantum Computing: An Applied Approach" by Jack Hidary
- IBM Quantum Experience (free access to real quantum computers)
- Quantum Country (quantum.country) — interactive essay format
- YouTube: Looking Glass Universe, minutephysics quantum series` }
  ]
};
