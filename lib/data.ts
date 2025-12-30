
export type Project = {
    id: string;
    name: string; // Mapped from projectName
    logo: string; // The shorthand symbol (e.g. NX, SN)
    launchDate: string; // ISO format for consistency
    network: string;
    token?: string; // Mapped from token.symbol
    category: string; // Mapped from first category for UI compatibility
    notes: string; // Mapped from shortNote
    // Additional metadata for future-proofing / internal logic
    launchType?: "Mainnet" | "Testnet" | "App Launch";
    verificationStatus?: "Verified" | "Unverified";
    status?: "Active" | "Rugged" | "Hacked" | "Scam" | "Inactive";
    narrativeTags?: string[];
    // Socials
    githubUrl?: string;
    mediumUrl?: string;
    farcasterUrl?: string;
    baseUrl?: string;
};

export const PROJECTS: Project[] = [
    {
        id: "test-2025-today",
        name: "Test Protocol",
        logo: "TEST",
        launchDate: "2025-12-29T12:00:00Z", // Todays date for testing
        network: "Ethereum",
        category: "Infrastructure",
        launchType: "Testnet",
        verificationStatus: "Verified",
        notes: "A test verify entry to confirm visibility on the daily grid.",
        githubUrl: "https://github.com/example",
        mediumUrl: "https://medium.com/@example",
        farcasterUrl: "@example",
        baseUrl: "base.org/name/example"
    },
    {
        id: "sn-2026-05", // Existing data starts here...
        name: "ShardNet",
        logo: "SN",
        launchDate: "2026-01-05T02:00:00Z",
        network: "Cosmos",
        token: "SHRD",
        category: "Infrastructure",
        launchType: "Mainnet",
        verificationStatus: "Verified",
        notes: "A sovereign sharding protocol for the Cosmos Interchain ecosystem.",
    },
    {
        id: "mt-2026-09",
        name: "Mintory",
        logo: "MT",
        launchDate: "2026-01-09T02:00:00Z",
        network: "Base",
        category: "Infrastructure",
        launchType: "App Launch",
        verificationStatus: "Verified",
        notes: "Decentralized minting engine and liquidity wrapper for multi-chain NFTs.",
    },
    {
        id: "np-2026-14",
        name: "Nexus Protocol",
        logo: "NX",
        launchDate: "2026-01-14T02:00:00Z",
        network: "Ethereum",
        token: "NX",
        category: "DeFi",
        launchType: "Mainnet",
        verificationStatus: "Verified",
        notes: "Institutional liquidity layer featuring zk-governed vault strategies.",
    },
    {
        id: "sl-2026-14",
        name: "Solaris AI",
        logo: "SAI",
        launchDate: "2026-01-14T04:00:00Z",
        network: "Solana",
        token: "SAI",
        category: "AI",
        launchType: "App Launch",
        verificationStatus: "Verified",
        notes: "Hardware-accelerated AI inference engine deployed as a Solana program.",
    },
    {
        id: "vz-2026-14",
        name: "VaultZero",
        logo: "VZ",
        launchDate: "2026-01-14T06:00:00Z",
        network: "Polygon",
        category: "Infrastructure",
        launchType: "Testnet",
        verificationStatus: "Unverified",
        notes: "Zero-knowledge privacy pool for private transfers on Polygon PoS.",
    },
    {
        id: "eg-2026-15",
        name: "Etheria G",
        logo: "ETG",
        launchDate: "2026-01-15T02:00:00Z",
        network: "Ethereum",
        token: "ETG",
        category: "GameFi",
        launchType: "App Launch",
        verificationStatus: "Verified",
        notes: "On-chain strategy game utilizing persistent state on Ethereum L1.",
    },
    {
        id: "ov-2026-22",
        name: "Obsidian Vault",
        logo: "OV",
        launchDate: "2026-01-22T02:00:00Z",
        network: "Avalanche",
        category: "Infrastructure",
        launchType: "Testnet",
        verificationStatus: "Verified",
        notes: "Encrypted asset storage solution for institutional Avalanche subnets.",
    },
    {
        id: "rx-2026-28",
        name: "RelayX",
        logo: "RX",
        launchDate: "2026-01-28T02:00:00Z",
        network: "Arbitrum",
        token: "RLY",
        category: "Infrastructure",
        launchType: "Mainnet",
        verificationStatus: "Verified",
        notes: "Low-latency cross-chain messaging bridge for Arbitrum Rollups.",
    },
    {
        id: "vs-2027-01",
        name: "Vector Store",
        logo: "VS",
        launchDate: "2027-01-12T10:00:00Z",
        network: "Solana",
        token: "VEC",
        category: "AI",
        launchType: "Mainnet",
        verificationStatus: "Verified",
        notes: "On-chain vector database for decentralized AI memory and state management.",
    },
];
