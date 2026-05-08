export const BLOCKCHAIN = {
  id: 2, title: 'Blockchain & Web3', emoji: '🔗', level: 'Beginner → Advanced',
  pages: [
    { subtitle: '1. Blockchain Fundamentals', content: `A blockchain is a distributed, immutable ledger that records transactions across a peer-to-peer network. Invented in 2008 by Satoshi Nakamoto to power Bitcoin.

**The Problem with Centralization**
Banks, governments, and tech companies act as trusted intermediaries. If their database is hacked, corrupted, or censored, the entire system fails. Blockchain removes the need for a central authority.

**How a Block Works**
Each block contains:
- Transaction Data: Who sent what to whom.
- Timestamp: When the block was created.
- Previous Hash: A cryptographic fingerprint of the prior block.
- Nonce: A number used in mining (Proof of Work).
- Current Hash: A fingerprint of this block's data.

**The Chain**
Because each block references the previous block's hash, altering any historical block would change its hash, invalidating every subsequent block. This makes the blockchain tamper-proof.

**Decentralization**
The blockchain is replicated across thousands of computers (nodes) worldwide. No single entity controls it. To alter the chain, an attacker would need to control 51% of the network simultaneously.

**Key Properties**
- Immutability: Data cannot be changed once written.
- Transparency: All transactions are publicly visible.
- Trustless: No need to trust any single party.
- Censorship-resistant: No authority can block transactions.` },
    { subtitle: '2. Cryptographic Primitives', content: `Blockchain security is built entirely on cryptography.

**Hash Functions**
A hash function takes any input and produces a fixed-length output (digest).
- Deterministic: Same input always produces the same hash.
- Avalanche Effect: Changing one bit of input completely changes the output.
- One-Way: Cannot reverse a hash to find the input.
- Collision-Resistant: Extremely unlikely for two inputs to produce the same hash.
- Bitcoin uses SHA-256. Ethereum uses Keccak-256.

**Public-Key Cryptography**
Every user has a key pair:
- Private Key: A random 256-bit number. Must be kept secret.
- Public Key: Derived from the private key using elliptic curve mathematics (secp256k1).
- Address: A hash of the public key. This is what you share to receive funds.

**Digital Signatures (ECDSA)**
When you send a transaction:
1. You hash the transaction data.
2. Sign the hash with your Private Key.
3. Anyone can verify the signature using your Public Key.
4. This proves you authorized the transaction without revealing your private key.

**Merkle Trees**
Transactions in a block are organized into a Merkle Tree (binary hash tree).
- Leaf nodes: Hashes of individual transactions.
- Parent nodes: Hashes of child pairs.
- Merkle Root: A single hash summarizing all transactions.
- Enables efficient verification: you can prove a transaction exists without downloading the entire block.` },
    { subtitle: '3. Consensus Mechanisms', content: `Without a central authority, how do nodes agree on the state of the blockchain? Consensus mechanisms.

**Proof of Work (PoW) — Bitcoin**
Miners compete to solve a cryptographic puzzle:
- Find a nonce such that: SHA-256(block_header + nonce) < target
- This requires trillions of hash computations per second.
- First miner to solve it broadcasts the block and receives the block reward (currently 3.125 BTC).
- Difficulty adjusts every 2,016 blocks (~2 weeks) to maintain ~10 minute block times.
- Security: Attacking requires 51% of total hash power (currently costs billions).
- Downside: Enormous energy consumption (comparable to entire countries).

**Proof of Stake (PoS) — Ethereum**
Validators lock up (stake) cryptocurrency as collateral:
- A validator is randomly selected to propose the next block.
- Other validators attest to the block's validity.
- Honest behavior earns rewards. Dishonest behavior results in slashing (losing staked ETH).
- 99.9% more energy-efficient than PoW.
- Ethereum requires 32 ETH to run a validator node.

**Other Mechanisms**
- Delegated PoS (DPoS): Token holders vote for validators (EOS, Tron).
- Proof of Authority (PoA): Validators are pre-approved identities (private blockchains).
- Proof of History (PoH): Solana's innovation — cryptographic timestamp proving event ordering.
- Byzantine Fault Tolerance (BFT): Guarantees consensus even if up to 1/3 of nodes are malicious.` },
    { subtitle: '4. Bitcoin Deep Dive', content: `Bitcoin (BTC) is the first and most valuable cryptocurrency, created in 2008 by Satoshi Nakamoto.

**Key Design Decisions**
- Fixed Supply: Only 21 million BTC will ever exist. Currently ~19.7 million mined.
- Halving: Block reward halves every 210,000 blocks (~4 years). Creates digital scarcity.
- Block Time: ~10 minutes.
- Block Size: ~1 MB (leading to ~7 transactions per second).

**UTXO Model**
Bitcoin uses the Unspent Transaction Output model:
- There are no "accounts" or "balances" on Bitcoin.
- Your balance is the sum of all unspent outputs sent to your addresses.
- Each transaction consumes existing UTXOs and creates new ones.

**Bitcoin Script**
Bitcoin has a simple stack-based scripting language:
- Not Turing-complete (by design, for security).
- Supports: Pay-to-Public-Key-Hash (P2PKH), Multi-signature, Time-locked transactions.

**Lightning Network (Layer 2)**
Bitcoin's main chain is slow (7 TPS). Lightning Network enables:
- Instant transactions (milliseconds).
- Millions of transactions per second.
- Micro-payments (fractions of a cent).
- Works by opening payment channels between parties off-chain.

**Bitcoin as Digital Gold**
- Store of Value: Fixed supply creates scarcity like gold.
- Inflation Hedge: Cannot be printed by governments.
- Settlement Layer: The most secure blockchain for final settlement.` },
    { subtitle: '5. Ethereum & Smart Contracts', content: `Ethereum, created by Vitalik Buterin in 2015, extends blockchain beyond currency to programmable applications.

**Smart Contracts**
Self-executing programs stored on the blockchain:
- Code is immutable once deployed.
- Executes automatically when conditions are met.
- No intermediaries, no downtime, no censorship.

**Solidity — The Language of Ethereum**
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public storedValue;
    
    function set(uint256 _value) public {
        storedValue = _value;
    }
    
    function get() public view returns (uint256) {
        return storedValue;
    }
}

**The Ethereum Virtual Machine (EVM)**
- A Turing-complete virtual machine that executes smart contract bytecode.
- Every node runs the EVM, ensuring identical execution.
- Gas: Every operation costs "gas" (paid in ETH). Prevents infinite loops and spam.

**ERC Standards**
- ERC-20: Fungible token standard (USDT, LINK, UNI).
- ERC-721: Non-Fungible Token standard (NFTs, unique assets).
- ERC-1155: Multi-token standard (gaming items).

**Development Tools**
- Remix IDE: Browser-based Solidity editor.
- Hardhat/Foundry: Local development and testing frameworks.
- Ethers.js/Web3.js: JavaScript libraries for interacting with Ethereum.
- OpenZeppelin: Audited, reusable smart contract libraries.` },
    { subtitle: '6. DeFi (Decentralized Finance)', content: `DeFi recreates traditional financial services using smart contracts — no banks, no intermediaries.

**Core DeFi Protocols**

**Decentralized Exchanges (DEXs)**
- Uniswap, SushiSwap: Trade tokens without a centralized order book.
- Use Automated Market Makers (AMMs): Liquidity pools replace order books.
- Liquidity Providers deposit token pairs and earn trading fees.

**Lending & Borrowing**
- Aave, Compound: Deposit crypto to earn interest. Borrow against your deposits.
- Over-collateralized: Must deposit more collateral than you borrow.
- Flash Loans: Borrow any amount with zero collateral — but must repay within the same transaction.

**Stablecoins**
Cryptocurrencies pegged to $1:
- Fiat-backed: USDC, USDT (reserves held in banks).
- Crypto-backed: DAI (over-collateralized with ETH).
- Algorithmic: Adjust supply algorithmically (risky — Terra/LUNA collapsed).

**Yield Farming**
Depositing tokens across multiple DeFi protocols to maximize returns. Protocols incentivize liquidity with governance token rewards.

**Risks**
- Smart Contract Bugs: Code vulnerabilities can lead to millions stolen. The DAO hack (2016) lost $60M.
- Impermanent Loss: Liquidity providers can lose value if token prices diverge.
- Rug Pulls: Malicious developers drain liquidity pools.
- Regulatory Risk: Governments may regulate or ban DeFi protocols.` },
    { subtitle: '7. NFTs & DAOs', content: `NFTs and DAOs represent new paradigms of digital ownership and governance.

**Non-Fungible Tokens (NFTs)**
- Fungible: Every Bitcoin is identical and interchangeable.
- Non-Fungible: Each NFT is unique with distinct properties.
- Stored on-chain: The token proves ownership. The asset (image, video) is typically stored on IPFS.
- Use Cases: Digital art, gaming items, music royalties, event tickets, real estate deeds, digital identity.
- Royalties: Creators can earn royalties on every secondary sale.

**DAOs (Decentralized Autonomous Organizations)**
Organizations governed by smart contracts and token-holder voting:
- No CEO, no board of directors.
- Proposals are submitted on-chain.
- Token holders vote proportionally to their holdings.
- Approved proposals execute automatically.
- Examples: MakerDAO (governs DAI stablecoin), Uniswap DAO, Aave DAO.

**The Metaverse & Gaming**
- Play-to-Earn: Players earn crypto/NFTs by playing games (Axie Infinity).
- Virtual Land: Digital real estate in virtual worlds (Decentraland, The Sandbox).
- Interoperable Assets: Own a sword in one game, use it in another.

**Digital Identity**
- Self-Sovereign Identity: Own your digital identity without relying on Google/Facebook.
- Soulbound Tokens (SBTs): Non-transferable tokens representing credentials, reputation.` },
    { subtitle: '8. Layer 2 & Scaling', content: `The "Blockchain Trilemma": You can only optimize two of three properties — Decentralization, Security, Scalability.

**The Scaling Problem**
- Ethereum processes ~15-30 transactions per second.
- Visa processes ~65,000 transactions per second.
- During peak demand, Ethereum gas fees can exceed $100 per transaction.

**Layer 2 Solutions**
Build on top of the main chain (Layer 1) to increase throughput while inheriting its security.

**Rollups**
Bundle hundreds of transactions off-chain and submit a compressed proof to Layer 1.
- Optimistic Rollups: Assume transactions are valid. Fraud proofs challenge invalid ones. (Arbitrum, Optimism)
- ZK-Rollups: Use zero-knowledge proofs to mathematically prove validity. Faster finality but harder to build. (zkSync, StarkNet)

**State Channels**
Open a channel between parties, conduct unlimited transactions off-chain, settle the final state on-chain. (Lightning Network for Bitcoin)

**Sidechains**
Independent blockchains with their own consensus, connected to the main chain via a bridge. (Polygon PoS)

**Data Availability**
- EIP-4844 (Proto-Danksharding): Introduced "blobs" — temporary data storage that dramatically reduces L2 costs.
- Full Danksharding: Future upgrade enabling massive data throughput.

**Cross-Chain Bridges**
Transfer assets between different blockchains. However, bridges have been the source of the largest hacks in crypto history (Ronin Bridge: $625M, Wormhole: $320M).` },
    { subtitle: '9. Web3 Development', content: `Building decentralized applications (dApps) requires a different tech stack than traditional web development.

**The Web3 Stack**
- Frontend: React/Next.js (same as Web2).
- Wallet Connection: MetaMask, WalletConnect, RainbowKit.
- Blockchain Interaction: Ethers.js or Viem.
- Smart Contracts: Solidity (Ethereum), Rust (Solana), Move (Aptos/Sui).
- Storage: IPFS (decentralized file storage), Arweave (permanent storage).
- Indexing: The Graph (query blockchain data with GraphQL).

**Connecting to Ethereum with Ethers.js**
import { ethers } from 'ethers';

// Connect to MetaMask
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const address = await signer.getAddress();

// Read from a contract
const contract = new ethers.Contract(contractAddress, abi, provider);
const balance = await contract.balanceOf(address);

// Write to a contract
const tx = await contract.connect(signer).transfer(recipient, amount);
await tx.wait();

**Testing Smart Contracts**
const { expect } = require("chai");

describe("Token", function() {
  it("Should deploy with correct supply", async function() {
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy(1000);
    expect(await token.totalSupply()).to.equal(1000);
  });
});

**Security Best Practices**
- Always audit contracts before mainnet deployment.
- Use OpenZeppelin's battle-tested libraries.
- Implement reentrancy guards, access controls, and pausability.
- Test extensively with Hardhat/Foundry.` },
    { subtitle: '10. Blockchain Career Guide', content: `Web3 is one of the highest-paying sectors in tech, with average salaries 20-40% higher than Web2 equivalents.

**Career Paths**

**Smart Contract Developer ($100K-$300K)**
Write and audit Solidity/Rust contracts.

**DeFi Protocol Engineer ($120K-$350K)**
Build and maintain decentralized financial protocols.

**Blockchain Security Auditor ($120K-$400K)**
Find vulnerabilities in smart contracts before deployment. Firms: Trail of Bits, OpenZeppelin, Consensys Diligence.

**Full-Stack Web3 Developer ($90K-$200K)**
Build complete dApps (frontend + smart contracts).

**Learning Path**
1. Master JavaScript and React.
2. Learn Solidity through CryptoZombies.com (free, gamified).
3. Complete Alchemy University's Web3 bootcamp (free).
4. Build projects: ERC-20 token, NFT marketplace, DEX.
5. Study security: Damn Vulnerable DeFi, Ethernaut.
6. Deploy on testnets (Sepolia, Goerli).
7. Contribute to open-source protocols.

**Resources**
- ethereum.org/developers (official docs)
- Solidity by Example (solidity-by-example.org)
- Patrick Collins' courses on YouTube
- Speedrun Ethereum (speedrunethereum.com)` }
  ]
};
