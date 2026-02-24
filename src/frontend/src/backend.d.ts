import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Player {
    id: bigint;
    form: bigint;
    name: string;
    team: string;
    price: bigint;
    position: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface Contest {
    id: bigint;
    participants: Array<Principal>;
    name: string;
    entryFee: bigint;
    prizePool: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface FantasyTeam {
    id: bigint;
    playerIds: Array<bigint>;
    owner: Principal;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    balance: bigint;
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPlayer(player: Player): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    awardPrize(user: Principal, amount: bigint): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createContest(name: string, entryFee: bigint, prizePool: bigint): Promise<bigint>;
    createTeam(playerIds: Array<bigint>): Promise<bigint>;
    depositFunds(amount: bigint): Promise<void>;
    getAllContests(): Promise<Array<Contest>>;
    getAllPlayers(): Promise<Array<Player>>;
    getBalance(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContest(contestId: bigint): Promise<Contest | null>;
    getMyTeams(): Promise<Array<FantasyTeam>>;
    getPlayer(playerId: bigint): Promise<Player | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTeam(teamId: bigint): Promise<FantasyTeam | null>;
    getUser(): Promise<UserProfile>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    joinContest(contestId: bigint): Promise<void>;
    registerUser(name: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updatePlayer(playerId: bigint, player: Player): Promise<void>;
}
