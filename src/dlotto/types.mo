import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
  public type UserId = Text;

  public type TicketId = Nat;

  public type Numbers = [Nat];

  public type Date = Int;

  public type UserTicket = {
    user_id: UserId;
    ticket_id: TicketId;
    ticket: Ticket; 
  };

  public type UserTicketArray = [UserTicket];

  public type Round = {
    round: Nat;
    prize_pot: Nat;
    finish_at: Date;
  };

  public type WinningTicketsHistory = {
    tickets: ?[Ticket];
  };

  public type RoundChangelog = {
    start: Nat;
    end: Nat;
  };

  public type Ticket = {
    date_time: Int;
    regular: Numbers;
    super: Numbers;
    round: Round;
    entity_id: Nat;
  };

  public type UserPrize = {
    user_ticket: UserTicket;
    prize_level: Nat;
    prize_amount: Nat;
  };

  public type Error = {
    #NotFound;
    #AlreadyExists;
    #NotAuthorized;
  };

  public type Bio = {
      username: Text;
  };

  public type Profile = {
      bio: Bio;
      id: Principal;
  };
  
  public type ProfileUpdate = {
      bio: Bio;
  };
}