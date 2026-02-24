import Order "mo:core/Order";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

actor {
  // Authorization State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type (required by frontend)
  public type UserProfile = {
    name : Text;
    balance : Nat; // In cents
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Fantasy Player Types & Storage
  public type Player = {
    id : Nat;
    name : Text;
    team : Text;
    position : Text;
    price : Nat;
    form : Nat; // Rating from 1-100
  };

  module Player {
    public func compare(player1 : Player, player2 : Player) : Order.Order {
      Nat.compare(player1.id, player2.id);
    };
  };

  let players = Map.empty<Nat, Player>();
  var currentPlayerId = 0;

  // Fantasy Team Types & Storage
  public type FantasyTeam = {
    id : Nat;
    owner : Principal;
    playerIds : [Nat];
  };

  module FantasyTeam {
    public func compare(team1 : FantasyTeam, team2 : FantasyTeam) : Order.Order {
      Nat.compare(team1.id, team2.id);
    };
  };

  let teams = Map.empty<Nat, FantasyTeam>();
  var currentTeamId = 0;

  // Contest Types & Storage
  public type Contest = {
    id : Nat;
    name : Text;
    entryFee : Nat; // In cents
    prizePool : Nat;
    participants : [Principal];
  };

  module Contest {
    public func compare(contest1 : Contest, contest2 : Contest) : Order.Order {
      Nat.compare(contest1.id, contest2.id);
    };
  };

  let contests = Map.empty<Nat, Contest>();
  var currentContestId = 0;

  // Stripe Integration Config
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // User Registration (open to all including guests)
  public shared ({ caller }) func registerUser(name : Text) : async () {
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already registered");
    };
    userProfiles.add(caller, { name; balance = 0 });
  };

  // Get current user data (requires user role)
  public query ({ caller }) func getUser() : async UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view user data");
    };
    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) { user };
    };
  };

  // Player CRUD
  public shared ({ caller }) func addPlayer(player : Player) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add players");
    };
    let newPlayer = { player with id = currentPlayerId };
    players.add(currentPlayerId, newPlayer);
    currentPlayerId += 1;
  };

  public shared ({ caller }) func updatePlayer(playerId : Nat, player : Player) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update players");
    };
    if (not players.containsKey(playerId)) {
      Runtime.trap("Player not found");
    };
    players.add(playerId, { player with id = playerId });
  };

  public query func getAllPlayers() : async [Player] {
    players.values().toArray().sort();
  };

  public query func getPlayer(playerId : Nat) : async ?Player {
    players.get(playerId);
  };

  // Team CRUD
  public shared ({ caller }) func createTeam(playerIds : [Nat]) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create teams");
    };
    validateTeam(playerIds);
    let newTeam = {
      id = currentTeamId;
      owner = caller;
      playerIds;
    };
    teams.add(currentTeamId, newTeam);
    currentTeamId += 1;
    currentTeamId - 1;
  };

  public query ({ caller }) func getMyTeams() : async [FantasyTeam] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view teams");
    };
    teams.values().filter(func(team : FantasyTeam) : Bool { team.owner == caller }).toArray().sort();
  };

  public query ({ caller }) func getTeam(teamId : Nat) : async ?FantasyTeam {
    switch (teams.get(teamId)) {
      case (null) { null };
      case (?team) {
        // Users can view their own teams, admins can view all
        if (team.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?team;
        } else {
          Runtime.trap("Unauthorized: Can only view your own teams");
        };
      };
    };
  };

  func validateTeam(playerIds : [Nat]) {
    if (playerIds.size() > 15) {
      Runtime.trap("Teams cannot have more than 15 players");
    };
    // Validate all players exist
    for (playerId in playerIds.vals()) {
      if (not players.containsKey(playerId)) {
        Runtime.trap("Invalid player ID");
      };
    };
  };

  // Contests CRUD
  public shared ({ caller }) func createContest(name : Text, entryFee : Nat, prizePool : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create contests");
    };
    let newContest = {
      id = currentContestId;
      name;
      entryFee;
      prizePool;
      participants = [];
    };
    contests.add(currentContestId, newContest);
    currentContestId += 1;
    currentContestId - 1;
  };

  public query func getAllContests() : async [Contest] {
    contests.values().toArray().sort();
  };

  public query func getContest(contestId : Nat) : async ?Contest {
    contests.get(contestId);
  };

  public shared ({ caller }) func joinContest(contestId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can join contests");
    };

    switch (contests.get(contestId)) {
      case (null) { Runtime.trap("Contest not found") };
      case (?contest) {
        // Check if user has sufficient balance
        switch (userProfiles.get(caller)) {
          case (null) { Runtime.trap("User profile not found") };
          case (?profile) {
            if (profile.balance < contest.entryFee) {
              Runtime.trap("Insufficient balance");
            };

            // Check if already participating
            if (contest.participants.find<Principal>(func(p : Principal) : Bool { p == caller }) != null) {
              Runtime.trap("Already participating in this contest");
            };

            // Deduct entry fee
            let newBalance = profile.balance - contest.entryFee;
            userProfiles.add(caller, { profile with balance = newBalance });

            // Add to participants
            let newParticipants = contest.participants.concat([caller]);
            contests.add(contestId, { contest with participants = newParticipants });
          };
        };
      };
    };
  };

  // Wallet Management
  public shared ({ caller }) func depositFunds(amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit funds");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let newBalance = profile.balance + amount;
        userProfiles.add(caller, { profile with balance = newBalance });
      };
    };
  };

  public query ({ caller }) func getBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };

    switch (userProfiles.get(caller)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) { profile.balance };
    };
  };

  public shared ({ caller }) func awardPrize(user : Principal, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can award prizes");
    };

    switch (userProfiles.get(user)) {
      case (null) { Runtime.trap("User profile not found") };
      case (?profile) {
        let newBalance = profile.balance + amount;
        userProfiles.add(user, { profile with balance = newBalance });
      };
    };
  };

  // SC: Stripe integration
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe config");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) { config };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
