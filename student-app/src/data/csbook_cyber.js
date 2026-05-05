export const CYBERSECURITY = {
    id: 1,
    title: 'Cybersecurity & Ethical Hacking',
    emoji: '🛡️',
    level: 'Beginner → Advanced',
    pages: [
      { subtitle: '1. The Cybersecurity Landscape', content: `Cybersecurity is the practice of protecting systems, networks, and data from digital attacks. The global cost of cybercrime is projected to reach $10.5 trillion annually by 2025.

**Why Cybersecurity Matters**
Every business, government, and individual is a potential target. A single data breach can cost millions of dollars, destroy reputations, and compromise the personal information of millions of people.

**The CIA Triad — Foundation of Security**
- Confidentiality: Ensuring only authorized users can access data. Achieved through encryption and access controls.
- Integrity: Ensuring data hasn't been altered or tampered with. Achieved through hashing and digital signatures.
- Availability: Ensuring systems and data are accessible when needed. Achieved through redundancy and DDoS protection.

**Types of Threat Actors**
- Script Kiddies: Unskilled attackers using pre-made tools.
- Hacktivists: Politically motivated (e.g., Anonymous).
- Cybercriminals: Financially motivated (ransomware gangs, identity thieves).
- Nation-State Actors: Government-funded hackers (APT groups). Espionage, sabotage.
- Insider Threats: Disgruntled employees or contractors with legitimate access.

**Attack Categories**
- Social Engineering: Manipulating humans (phishing, pretexting, baiting).
- Malware: Viruses, worms, trojans, ransomware, spyware.
- Network Attacks: DDoS, Man-in-the-Middle, packet sniffing.
- Web Application Attacks: SQL Injection, XSS, CSRF.
- Zero-Day Exploits: Attacks targeting unknown vulnerabilities.` },
      { subtitle: '2. Networking Fundamentals', content: `You cannot secure what you do not understand. Networking knowledge is the bedrock of cybersecurity.

**The OSI Model (7 Layers)**
1. Physical: Cables, switches, electrical signals.
2. Data Link: MAC addresses, Ethernet frames. (Switches)
3. Network: IP addresses, routing. (Routers)
4. Transport: TCP (reliable) / UDP (fast). Port numbers.
5. Session: Manages connections between applications.
6. Presentation: Data formatting, encryption/decryption.
7. Application: HTTP, FTP, SMTP, DNS. What users interact with.

**Key Protocols**
- TCP/IP: The foundation of the internet. TCP ensures reliable delivery. IP handles addressing and routing.
- DNS: Translates domain names (google.com) to IP addresses (142.250.80.46).
- HTTP/HTTPS: Web communication. HTTPS adds TLS encryption.
- DHCP: Automatically assigns IP addresses to devices on a network.
- ARP: Maps IP addresses to MAC addresses on a local network.

**IP Addressing**
- IPv4: 32-bit addresses (e.g., 192.168.1.1). About 4.3 billion possible addresses.
- IPv6: 128-bit addresses. Virtually unlimited addresses.
- Subnetting: Dividing a network into smaller segments. CIDR notation (e.g., 192.168.1.0/24).
- Private IP Ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.

**Ports**
- Well-known ports: 22 (SSH), 80 (HTTP), 443 (HTTPS), 53 (DNS), 25 (SMTP).
- Port scanning reveals which services are running on a target machine.` },
      { subtitle: '3. Cryptography Deep Dive', content: `Cryptography is the mathematical science of securing information. It is the backbone of all digital security.

**Symmetric Encryption**
Same key encrypts and decrypts. Fast but requires secure key exchange.
- AES-256: The gold standard. Used by governments and militaries worldwide. Operates on 128-bit blocks with a 256-bit key.
- DES/3DES: Obsolete. 56-bit key is too short for modern computing.

**Asymmetric Encryption (Public Key)**
Two mathematically linked keys: Public (shared) and Private (secret).
- RSA: Based on the difficulty of factoring large prime numbers. Key sizes: 2048 or 4096 bits.
- ECC (Elliptic Curve): Same security as RSA with much smaller keys. Used in TLS, Bitcoin, SSH.
- Diffie-Hellman: Key exchange protocol. Allows two parties to agree on a shared secret over an insecure channel.

**Hashing**
One-way function producing a fixed-size digest. Cannot be reversed.
- MD5: 128-bit hash. Broken — collisions can be found easily. Never use for security.
- SHA-256: 256-bit hash. Used in Bitcoin, TLS, and digital signatures.
- bcrypt/scrypt/Argon2: Password hashing algorithms designed to be computationally expensive to prevent brute-force attacks.

**Digital Signatures**
Prove authenticity and integrity:
1. Sender hashes the message.
2. Sender encrypts the hash with their Private Key (this is the signature).
3. Receiver decrypts the signature with the Sender's Public Key and compares hashes.

**TLS/SSL (HTTPS)**
The protocol that secures web communication:
1. Client sends "Hello" with supported cipher suites.
2. Server responds with its certificate (containing its Public Key).
3. Client verifies certificate with a Certificate Authority (CA).
4. They perform a key exchange (Diffie-Hellman) to establish a shared symmetric key.
5. All further communication is encrypted with AES using this shared key.` },
      { subtitle: '4. Web Application Security (OWASP)', content: `The OWASP Top 10 is the definitive list of the most critical web application security risks.

**1. Injection (SQL Injection)**
Untrusted data is sent to an interpreter as part of a command.
- Vulnerable: SELECT * FROM users WHERE name = '$userInput'
- If userInput = ' OR 1=1 --', it returns all users.
- Prevention: Parameterized queries, ORMs, input validation.

**2. Broken Authentication**
Weak passwords, missing MFA, session tokens in URLs.
- Prevention: Enforce strong passwords, implement MFA, use secure session management.

**3. Cross-Site Scripting (XSS)**
Attacker injects malicious JavaScript into a web page viewed by other users.
- Stored XSS: Script is saved in the database (e.g., in a comment).
- Reflected XSS: Script is in the URL and reflected back.
- Prevention: Output encoding, Content Security Policy (CSP), sanitizing input.

**4. Insecure Direct Object References (IDOR)**
User can access other users' data by changing an ID in the URL.
- Vulnerable: /api/orders/123 → change to /api/orders/124 to see someone else's order.
- Prevention: Authorization checks on every request.

**5. Security Misconfiguration**
Default passwords, open S3 buckets, verbose error messages, unnecessary services enabled.
- Prevention: Hardened configurations, automated security scanning.

**6. Cross-Site Request Forgery (CSRF)**
Tricks a logged-in user into submitting an unintended request.
- Prevention: CSRF tokens, SameSite cookies.

**Other Critical Risks**
- Broken Access Control, Cryptographic Failures, Vulnerable Components, Server-Side Request Forgery (SSRF).` },
      { subtitle: '5. Ethical Hacking Methodology', content: `Ethical Hacking (Penetration Testing) is the authorized practice of breaking into systems to find vulnerabilities before malicious hackers do.

**The 5 Phases of Ethical Hacking**

**Phase 1: Reconnaissance**
Gathering information about the target without directly interacting with it.
- Passive: OSINT (Open Source Intelligence). Google dorking, WHOIS lookups, social media analysis, Shodan searches.
- Active: Directly probing the target (port scanning, banner grabbing).

**Phase 2: Scanning & Enumeration**
Actively probing the target to discover:
- Open ports and services (Nmap).
- Operating system versions (OS fingerprinting).
- Network topology and connected devices.
- User accounts, shares, and vulnerabilities.

**Phase 3: Gaining Access (Exploitation)**
Using discovered vulnerabilities to break in:
- Exploiting software bugs (buffer overflows, SQL injection).
- Cracking passwords (brute force, dictionary attacks).
- Social engineering (phishing, pretexting).
- Leveraging known exploits from vulnerability databases (CVE).

**Phase 4: Maintaining Access**
Ensuring continued access after initial compromise:
- Installing backdoors, rootkits, or reverse shells.
- Creating hidden admin accounts.
- Modifying system configurations.

**Phase 5: Reporting**
The most critical phase for ethical hackers:
- Document every vulnerability found, how it was exploited, and the potential business impact.
- Provide clear remediation recommendations prioritized by severity.
- Present findings to both technical teams and executive leadership.

**Certifications**
- CEH (Certified Ethical Hacker)
- OSCP (Offensive Security Certified Professional) — the gold standard
- CompTIA Security+, PenTest+` },
      { subtitle: '6. Essential Security Tools', content: `Every cybersecurity professional needs a toolkit. Here are the industry-standard tools.

**Kali Linux**
A Debian-based Linux distribution pre-loaded with 600+ security tools. The go-to operating system for penetration testers.

**Nmap (Network Mapper)**
nmap -sV -O -A 192.168.1.0/24
- -sV: Service version detection.
- -O: OS detection.
- -A: Aggressive scan (OS, version, scripts, traceroute).
- Discovers open ports, running services, and potential vulnerabilities.

**Metasploit Framework**
The most powerful exploitation framework. Contains thousands of exploits.
msfconsole
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.1.100
exploit

**Burp Suite**
The premier web application security testing tool.
- Proxy: Intercepts and modifies HTTP/HTTPS requests.
- Scanner: Automatically finds web vulnerabilities.
- Repeater: Manually modify and resend requests.
- Intruder: Automated fuzzing and brute-force attacks.

**Wireshark**
Network protocol analyzer. Captures and inspects network packets in real-time.
- Filter by protocol, IP address, or port.
- Analyze traffic patterns and detect anomalies.

**Other Essential Tools**
- John the Ripper / Hashcat: Password cracking.
- Gobuster / DirBuster: Directory and file brute-forcing.
- SQLmap: Automated SQL injection exploitation.
- Aircrack-ng: WiFi security auditing.
- Nikto: Web server vulnerability scanner.` },
      { subtitle: '7. Defensive Security (Blue Team)', content: `While Red Teams attack, Blue Teams defend. Defensive security is equally critical and often more in-demand.

**Firewalls**
- Network Firewalls: Filter traffic based on IP, port, and protocol rules. (iptables, pfSense)
- Web Application Firewalls (WAF): Filter HTTP traffic and block common web attacks. (Cloudflare, AWS WAF)
- Next-Generation Firewalls (NGFW): Deep packet inspection, application awareness, IPS integration.

**Intrusion Detection & Prevention (IDS/IPS)**
- IDS: Monitors network traffic and alerts on suspicious activity (Snort, Suricata).
- IPS: Actively blocks malicious traffic in real-time.
- Signature-based: Matches known attack patterns.
- Anomaly-based: Detects deviations from normal behavior.

**SIEM (Security Information and Event Management)**
Aggregates logs from all systems (servers, firewalls, endpoints) into a central platform.
- Correlates events across systems to detect complex attacks.
- Tools: Splunk, Elastic SIEM, Microsoft Sentinel.
- SOC Analysts monitor SIEM dashboards 24/7.

**Endpoint Detection & Response (EDR)**
Monitors individual devices (laptops, servers) for malicious activity.
- Detects and responds to threats that bypass traditional antivirus.
- Tools: CrowdStrike Falcon, SentinelOne, Microsoft Defender for Endpoint.

**Incident Response**
When a breach occurs:
1. Identification: Detect and confirm the incident.
2. Containment: Isolate affected systems.
3. Eradication: Remove the threat.
4. Recovery: Restore systems from clean backups.
5. Lessons Learned: Document what happened and improve defenses.` },
      { subtitle: '8. Network Security & Hardening', content: `Securing the network is the first line of defense against cyber attacks.

**Network Segmentation**
Divide the network into isolated zones:
- DMZ: Public-facing servers (web, email) isolated from the internal network.
- VLANs: Logically separate departments (HR, Finance, Engineering).
- Zero Trust: Never trust, always verify. Every request is authenticated regardless of source.

**VPN (Virtual Private Network)**
Creates an encrypted tunnel over the public internet.
- Site-to-Site VPN: Connects two office networks securely.
- Remote Access VPN: Allows employees to securely connect from home.
- Protocols: OpenVPN, WireGuard, IPSec.

**DNS Security**
- DNS Poisoning: Attacker corrupts DNS cache to redirect users to malicious sites.
- DNSSEC: Cryptographically signs DNS records to prevent tampering.
- DNS over HTTPS (DoH): Encrypts DNS queries to prevent eavesdropping.

**Wireless Security**
- WEP: Completely broken. Never use.
- WPA2: Current standard. Uses AES encryption.
- WPA3: Latest standard with stronger key exchange (SAE).
- Enterprise: Uses RADIUS server for authentication.

**System Hardening**
- Disable unnecessary services and ports.
- Apply security patches promptly.
- Use least-privilege access (users only get permissions they need).
- Enable logging and monitoring on all systems.
- Remove default credentials.
- Implement host-based firewalls.` },
      { subtitle: '9. Malware Analysis & Forensics', content: `Understanding how malware works is essential for both offense and defense.

**Types of Malware**
- Virus: Attaches to legitimate programs. Requires user action to spread.
- Worm: Self-replicating. Spreads across networks without user interaction.
- Trojan: Disguises itself as legitimate software. Creates backdoors.
- Ransomware: Encrypts files and demands payment. Examples: WannaCry, NotPetya, LockBit.
- Rootkit: Hides deep in the OS kernel. Extremely difficult to detect.
- Spyware/Keylogger: Monitors user activity and steals credentials.

**Static Analysis**
Examining malware without executing it:
- File hashing to identify known malware (VirusTotal).
- String analysis: Extract readable text (URLs, commands, file paths).
- PE header analysis: Examine imports, exports, and sections.
- Disassembly: Reverse-engineer the binary (IDA Pro, Ghidra).

**Dynamic Analysis**
Executing malware in a controlled environment (sandbox):
- Monitor file system changes, registry modifications, network connections.
- Tools: Any.Run, Cuckoo Sandbox, Process Monitor.

**Digital Forensics**
Investigating cyber incidents after they occur:
- Disk Forensics: Recovering deleted files, analyzing file systems (Autopsy, FTK).
- Memory Forensics: Analyzing RAM dumps for malware artifacts (Volatility).
- Network Forensics: Analyzing packet captures for evidence of data exfiltration.
- Chain of Custody: Maintaining evidence integrity for legal proceedings.

**Threat Intelligence**
- MITRE ATT&CK: Framework mapping adversary tactics and techniques.
- IOCs (Indicators of Compromise): IP addresses, file hashes, and domain names associated with attacks.` },
      { subtitle: '10. Cybersecurity Career Guide', content: `Cybersecurity has zero unemployment. There are 3.5 million unfilled cybersecurity jobs worldwide.

**Career Paths**

**SOC Analyst ($60K-$100K)**
Entry-level. Monitor SIEM dashboards, triage alerts, escalate incidents.

**Penetration Tester ($80K-$160K)**
Legally break into systems and write detailed reports.

**Security Engineer ($100K-$180K)**
Design and implement security infrastructure (firewalls, SIEM, IAM).

**Incident Responder ($90K-$150K)**
Investigate breaches, contain threats, perform forensics.

**Security Architect ($130K-$220K)**
Design enterprise-wide security strategy and architecture.

**CISO (Chief Information Security Officer) ($200K-$500K+)**
Executive-level. Oversees entire security program.

**Bug Bounty Hunter ($0-$1M+)**
Find vulnerabilities in companies' systems and get paid. Platforms: HackerOne, Bugcrowd.

**Certifications Roadmap**
1. CompTIA Security+ (Entry-level, widely recognized)
2. CEH (Certified Ethical Hacker)
3. OSCP (Offensive Security — the most respected practical cert)
4. CISSP (For management/architecture roles)
5. GIAC certifications (specialized: forensics, incident handling)

**Learning Path**
1. Learn Linux command line thoroughly.
2. Study networking (CompTIA Network+).
3. Set up a home lab (VirtualBox + Kali Linux + vulnerable VMs like DVWA, Metasploitable).
4. Practice on TryHackMe and HackTheBox.
5. Get CompTIA Security+.
6. Specialize: Red Team (OSCP) or Blue Team (SOC Analyst).

**Top Resources**
- TryHackMe.com, HackTheBox.com, OverTheWire.org
- Professor Messer (YouTube), NetworkChuck, John Hammond
- Books: "The Web Application Hacker's Handbook", "Hacking: The Art of Exploitation"` }
    ]
  };
