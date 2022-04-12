import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import EmptyTicket "./EmptyTicket";
import Float "mo:base/Float";
import Utils "./utils";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";
import Random "mo:base/Random";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Trie "mo:base/Trie";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import Nat64 "mo:base/Nat64";

import Ledger  "canister:ledger";

import Account "./Account";
import Types "./types";

shared(init_msg) actor class Dlotto() = this {
    // db storage
    private stable var winHistoryStorage : Trie.Trie<Nat, Types.Ticket> = Trie.empty(); // round -> ticket
    private stable var userTicketStorage : Trie.Trie<Text, [Types.UserTicket]> = Trie.empty(); // user_round -> [user ticket]
    private stable var ticketStorage : Trie.Trie<Nat, Types.UserTicket> = Trie.empty(); // entityId -> user ticket
    private stable var ticketPrizeStorage : Trie.Trie<Nat, Float> = Trie.empty(); // entityId -> user ticket prize
    private stable var round : Nat = 1;
    private stable var prizePot : Nat = 100;
    private stable var startClFrom : Nat = 1; // starting position for ticket for current round
    private stable var lastTicketCl : Nat = 1; // last ticket position for current round
    private stable var startTime : Int = 0;
    private stable var profiles : Trie.Trie<Principal, Profile> = Trie.empty();

    private var ticketScore : Trie.Trie<Nat, Nat> = Trie.empty(); // entityId -> user ticket score
    private var currentWinTicket : Types.Ticket = EmptyTicket.initEmptyTicket();
    private var callerTest : Text = ""; 

    type Bio = Types.Bio;
    type Profile = Types.Profile;
    type ProfileUpdate = Types.ProfileUpdate;
    type UserTicketArray = Types.UserTicketArray;

    //constants
    let minNumber : Nat = 1;
    let maxNumber : Nat = 24;
    let superBallMaxNumber : Nat = 10;
    let buffTickets = Buffer.Buffer<Types.Ticket>(1);
    let buffUserTickets = Buffer.Buffer<Types.UserTicket>(1);
    let buffJackpotWinner = Buffer.Buffer<Nat>(1);

    system func heartbeat() : async () {
       await generateTicketDaily(12, 0);
    };

    // generates winning ticket for currend draw
    private func generateWinningTicket () : async Types.Ticket {
        let ticket : Types.Ticket = await generateTicket();

        updateTicketsHistory(round, ticket);
        currentWinTicket := ticket;
        setTicketScore();
        startClFrom := lastTicketCl;
        round += 1;
        prizePot += 3;// todo increase by 50% of profit of previous round

        return ticket;
    };

    public func getCurrentWinTicket () : async Types.Ticket {
        return currentWinTicket;
    };

    // Get winning tickets history by round
    public func getWinHistory (round : Nat) : async Result.Result<Types.Ticket, Types.Error> {
        let entry = Trie.find(
            winHistoryStorage,
            Utils.natKey(round),
            Nat.equal
        );

        switch (entry) {
            case null {
                #err(#NotFound);
            };
            case (? entryValue) {
                #ok(entryValue);
            };
        }
    };

    // get key for storing user ticket realtion data in format user_round
    private func getUserRoundKey (user : Principal, round : Nat) : async Text {
        let separator = "_";
        let key = Text.concat(
            Text.concat(
                Principal.toText(user),
                separator),
            Nat.toText(round)
        );

        return key;
    };

    //get user ticket for a specified round
    public shared(msg) func getUserTicket (round : Nat) : async Result.Result<[Types.UserTicket], Types.Error> {
        var ticket : ?[Types.UserTicket] = await getUserTicketByRound(msg.caller, round);

        switch (ticket) {
            case null {
                #err(#NotFound);
            };
            case (? entryValue) {
                #ok(entryValue);
            };
        }
    };

    private func getUserTicketByRound (user : Principal, round : Nat) : async ?[Types.UserTicket] {
        let userRoundKey = getUserRoundKey(user, round);
        var ticket : ?[Types.UserTicket] = Trie.find(
            userTicketStorage,
            Utils.textKey(await userRoundKey),
            Text.equal
        );

        return ticket;
    };

    public func getAllWinHistory () : async [(Nat, Types.Ticket)] {
        let historyArr = Iter.toArray(Trie.iter(winHistoryStorage));
    };

    // handle the process of assigning tickets to user when user buys tickets.
    // tickets should be assigned for the next round.
    public shared(msg) func assignTicketToUser (ticketsToAssign : [Types.Ticket]) : async [Types.UserTicket] {
        var ticketNumber : Nat = 1;
        var userTickets = buffUserTickets.clone();
        let emptyUserTicket : Types.UserTicket = EmptyTicket.initEmptyUserTicket();
        var chargeAmount: Nat64 = 0;

        var existingTickets : [Types.UserTicket] = switch (await getUserTicketByRound(msg.caller, round)) {
            case null [emptyUserTicket];
            case (?UserTicketArray) UserTicketArray;
        };

        for (existingTicket in existingTickets.vals()) {
            if (existingTicket.ticket_id != 0) {
                // populate array with existing user tickets
                userTickets.add(existingTicket);
                ticketNumber := existingTicket.ticket_id + 1;
            };
        };

        for (ticketToAssign in ticketsToAssign.vals()) {
            var validTicket = validateTicketBeforeAssign(ticketToAssign);
            var userTicket : Types.UserTicket = {
                user_id = Principal.toText(msg.caller);
                ticket_id = ticketNumber;
                ticket = validTicket; 
            };

            // populate array with user tickets
            userTickets.add(userTicket);
            
            let (newTicketStorage, oldTicketStorage) = Trie.put(
                ticketStorage,
                Utils.natKey(lastTicketCl),
                Nat.equal,
                userTicket
            );
            ticketStorage := newTicketStorage;
            
            ticketNumber += 1;
            lastTicketCl += 1;
            chargeAmount += 10_000_000;
        };

        let userRoundKey = getUserRoundKey(msg.caller, round);
        let userTicketsArr = userTickets.toArray();

        let (newUserTicketStorage, oldUserTicketStorage) = Trie.put(
            userTicketStorage,
            Utils.textKey(await userRoundKey),
            Text.equal,
            userTicketsArr
        );

        userTicketStorage := newUserTicketStorage;
        //chargeICP(10_000_000, msg.caller);

        return userTicketsArr;
    };

    private func validateTicketBeforeAssign (ticketToAssign : Types.Ticket) : Types.Ticket {
        let roundData : Types.Round = {
            round = round;
            prize_pot = prizePot;
            finish_at = getTimestamp() + 43200; // TODO CHANGE. DONE FOR TEST PURPOSE. +12h
        };

        let timeNow : Int = getTimestamp();
        let ticket : Types.Ticket = {
            date_time = timeNow;
            regular = ticketToAssign.regular;
            super = ticketToAssign.super;
            round = roundData;
            entity_id = lastTicketCl;
        };

        return ticket;
    };

    // get all tickets for current round and assign a score
    private func setTicketScore ()  {
        for (i in Iter.range(startClFrom, lastTicketCl)) {
            var ticket : ?Types.UserTicket = Trie.find(
                ticketStorage,
                Utils.natKey(i),
                Nat.equal
            );

            var regularOccurance : Nat = 0;
            var superOccurance : Nat = 0;
            var userTicket = convertToUserTicket(ticket);

            // get all REAL tickets for a round
            if (userTicket.ticket_id != 0) {
                //check for super ball
                for (s in userTicket.ticket.super.vals()) {
                    if (Utils.existsInArray(s, Array.thaw(currentWinTicket.super)) == true) {
                        superOccurance += 10;
                    };
                };

                // check for regular ball
                for (r in userTicket.ticket.regular.vals()) {
                    if (Utils.existsInArray(r, Array.thaw(currentWinTicket.regular)) == true) {
                        regularOccurance += 1;
                    };
                };

                var score = superOccurance + regularOccurance;
                
                let (newTicketScore, oldTicketScore) = Trie.put(
                    ticketScore,
                    Utils.natKey(i),
                    Nat.equal,
                    score
                );
                ticketScore := newTicketScore;
            };
        };

        let ticketScoreArr = Iter.toArray(Trie.iter(ticketScore));

        var jackpotWinners = buffJackpotWinner.clone();
        for ((key, ticketScore) in ticketScoreArr.vals()) {
            switch (ticketScore) {
                case (0) {
                    setTicketPrize(key, 0);
                };
                case (10 or 11) {
                    setTicketPrize(key, 0.05);
                };
                case (12) {
                    setTicketPrize(key, 0.1);
                };
                case (3) {
                    setTicketPrize(key, 0.5);
                };
                case (13) {
                    setTicketPrize(key, 1);
                };
                case (4) {
                    setTicketPrize(key, 5);
                };
                case (14) {
                    jackpotWinners.add(key);
                };
                case (_) {
                    setTicketPrize(key, 0);
                };
            }
        };

        let winnersCount = jackpotWinners.size();
        if (winnersCount >= 1) {
            let jackpot = 
                Float.fromInt(
                    Nat.div(100, winnersCount)
                );

            for (jackpotWinner in jackpotWinners.vals()) {
                setTicketPrize(jackpotWinner, jackpot);
            };
        };
    };

    // save ticket prize in memory
    private func setTicketPrize (ticketKey : Nat, score : Float) {
        let (newTicketPrizeStorage, oldTicketPrizeStorage) = Trie.put(
            ticketPrizeStorage,
            Utils.natKey(ticketKey),
            Nat.equal,
            score
        );

        ticketPrizeStorage := newTicketPrizeStorage;
    };
    
    public func getTicketPrize (entityId : Nat) : async ?Float {
        let ticketPrize = Trie.find(
            ticketPrizeStorage,
            Utils.natKey(entityId),
            Nat.equal
        );
    };

    // TODO - check if prize is already claimed
    // claim prize - amount, principal id

    private func convertToUserTicket (ticket : ?Types.UserTicket) : Types.UserTicket {
        let emptyUserTicket = EmptyTicket.initEmptyUserTicket();

        switch (ticket) {
            case null {
                emptyUserTicket;
            };
            case (?value) {
                value;
            };
        };
    };

    public func getCurrentRound () : async Types.Round {
        let currentRound : Types.Round = {
            round = round;
            prize_pot = prizePot;
            finish_at = getTimestamp();
        };

        return currentRound;
    };

    private func updateTicketsHistory (round : Nat, ticket : Types.Ticket) {
        let (newHistory, oldHistory) = Trie.put(
            winHistoryStorage,
            Utils.natKey(round),
            Nat.equal,
            ticket
        );

        winHistoryStorage := newHistory;
    };

    // generates ticket contnaining 4 regular numbers and 1 bonus numers
    private func generateTicket () : async Types.Ticket {
        let regularBalls : [Nat] = await generateNumbersArray(4, minNumber, maxNumber);
        let bonusBall : [Nat] = await generateNumbersArray(1, minNumber, superBallMaxNumber);

        let timeNow : Int = getTimestamp();
        let roundData : Types.Round = {
            round = round;
            prize_pot = prizePot;
            finish_at = getTimestamp() + 43200; // TODO CHANGE. DONE FOR TEST PURPOSE. +12h
        };

        let ticket : Types.Ticket = {
            date_time = timeNow;
            regular = regularBalls;
            super = bonusBall;
            round = roundData;
            entity_id = lastTicketCl;
        };

        return ticket;
    };

    // return one random number in range [1..24]
    private func generateNumber (min : Nat, max : Nat) : async Nat {
        var number : Nat = switch (await generateOneNumber()) {
            case null 25;
            case (?int) int;
        };

        if (Nat.greater(number, max) or Nat.less(number, min)) {
            number := await generateNumber(min, max);
        };

        return number;
    };

    // generate one random number [0..2^6-1]
    private func generateOneNumber () : async ?Nat {
        let entropy = await Random.blob();
        let p : Nat8 = 6;
        let number = Random.Finite(entropy).range(p);

        return number;
    };
    
    // generates immutable array of amount numbers
    private func generateNumbersArray (amount : Nat, min : Nat, max : Nat) : async [Nat] {
        let randomNumbers : [var Nat] = Array.init(amount, 0);

        for (i in Iter.range(0, amount - 1)) {
            var number : Nat = (await generateNumber(min, max));

            while (Utils.existsInArray(number, randomNumbers) == true) {
                number := (await generateNumber(min, max));
            };

            randomNumbers[i] := number;
        };

        return Array.freeze(randomNumbers);
    };

    private func generateTicketDaily(hours : Int, minutes : Int) : async () {
        let hoursInSec : Int = hours * 60 * 60;
        let minutesInSec : Int = minutes * 60;
        let schedule : Int = hoursInSec + minutesInSec;
        let runTime : Int = startTime + schedule;

        if(getTimestamp() > runTime) {
            startTime := getTimestamp(); // restart a timer in case if execution time been already passed
        };

        if((getTimestamp() % runTime) < 5) {
            Debug.print("Generated");
            startTime := startTime + 60; //add a day to the next timer execution
            let ticket = await generateWinningTicket();
        };
    };

    private func getTimestamp () : Int {
        return Time.now() / 1000000000;
    };

    public shared(msg) func create () : async Result.Result<(), Types.Error> {
        let callerId = msg.caller;

        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };
        let defaultBio: Bio = {
            username = Principal.toText( callerId );
        };

        let userProfile: Profile = {
            bio = defaultBio;
            id = callerId;
        };

        let (newProfiles, existing) = Trie.put(
            profiles,           
            Utils.key(callerId),      
            Principal.equal,    
            userProfile
        );

        switch(existing) {
            case null {
                profiles := newProfiles;
                #ok(());
            };
            case (? v) {
                #err(#AlreadyExists);
            };
        };
    };

    public shared query (msg) func read () : async Result.Result<Profile, Types.Error> {
        let callerId = msg.caller;

        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let result = Trie.find(
            profiles,           
            Utils.key(callerId),      
            Principal.equal     
        );
        return Result.fromOption(result, #NotFound);
    };

    public shared(msg) func update (profile : ProfileUpdate) : async Result.Result<(), Types.Error> {
        let callerId = msg.caller;

        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let userProfile: Profile = {
            bio = profile.bio;
            id = callerId;
        };

        let result = Trie.find(
            profiles,           
            Utils.key(callerId),     
            Principal.equal   
        );

        switch (result){
            case null {
                #err(#NotFound)
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,           
                    Utils.key(callerId),      
                    Principal.equal,    
                    ?userProfile
                ).0;
                #ok(());
            };
        };
    };

    public shared(msg) func delete () : async Result.Result<(), Types.Error> {
        let callerId = msg.caller;

        if(Principal.toText(callerId) == "2vxsx-fae") {
            return #err(#NotAuthorized);
        };

        let result = Trie.find(
            profiles,           
            Utils.key(callerId),      
            Principal.equal     
        );

        switch (result){
            case null {
                #err(#NotFound);
            };
            case (? v) {
                profiles := Trie.replace(
                    profiles,
                    Utils.key(callerId),
                    Principal.equal,
                    null
                ).0;

                #ok(());
            };
        };
    };

    func canisterAccountId() : Account.AccountIdentifier {
        Account.accountIdentifier(Principal.fromActor(this), Account.defaultSubaccount())
    };

    private func userAccountId (principal : Principal) : Account.AccountIdentifier {
        Account.accountIdentifier(principal, Account.defaultSubaccount())
    };

    public func userAccountIdPublic (principal : Principal) : async Account.AccountIdentifier {
        Account.accountIdentifier(principal, Account.defaultSubaccount())
    };

    public shared(msg) func userBalance () : async Ledger.Tokens {
        await Ledger.account_balance({ account = userAccountId(msg.caller) })
    };

    public shared(msg) func userId () : async Account.AccountIdentifier {
        userAccountId(msg.caller);
    };

    public func canisterAccount() : async Account.AccountIdentifier {
        canisterAccountId()
    };

    public func canisterBalance () : async Ledger.Tokens {
        await Ledger.account_balance({ account = canisterAccountId() })
    };

    public shared(msg) func getDepositAddress(): async Account.AccountIdentifier {
        Account.accountIdentifier(Principal.fromActor(this), Account.principalSubaccount(msg.caller));
    };

    public func chargeICP(toAccount : Principal): async () {
        let res = await Ledger.transfer({
            memo: Nat64 = 0;
            from_subaccount = null;
            to = userAccountId(toAccount);
            amount = { e8s = 100_000_000 };
            fee = { e8s = 10_000 };
            created_at_time = ?{ timestamp_nanos = Nat64.fromNat(Int.abs(Time.now()))};
        });
        switch (res) {
            case (#Ok(blockIndex)) {
            Debug.print("Paid reward to Principal: " # debug_show toAccount # "and accountId" # debug_show userAccountId(toAccount));
            };
            case (#Err(#InsufficientFunds { balance })) {
            throw Error.reject("Top me up! The balance is only " # debug_show balance # " e8s");
            };
            case (#Err(other)) {
            throw Error.reject("Unexpected error: " # debug_show other);
            };
        };
    }
};
