import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Types "./types";

module {
    public func initEmptyTicket () : Types.Ticket {
        let timeNow : Int = Time.now();
        let regular : [Nat] = [0];
        let super : [Nat] = [0];
        let round : Types.Round = {
            round = 0;
            prize_pot = 0;
            finish_at = 0;
        };
        let prizePot : Nat = 0;
        let entityId : Nat = 0;

        let emptyTicket : Types.Ticket = {
            date_time = timeNow;
            regular = regular;
            super = super;
            round = round;
            entity_id = entityId;
        };
        emptyTicket;
    };

    public func initEmptyUserTicket () : Types.UserTicket {
        let userId : Text = "Dlotto";
        let ticketId : Nat = 0;
        let emptyTicket : Types.Ticket = initEmptyTicket();

        let emptyUserTicket = {
            user_id = userId;
            ticket_id = ticketId;
            ticket = emptyTicket;
        };
        emptyUserTicket;
    };
}