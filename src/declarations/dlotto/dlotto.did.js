export const idlFactory = ({ IDL }) => {
  const Numbers = IDL.Vec(IDL.Nat);
  const Date = IDL.Int;
  const Round = IDL.Record({
    'finish_at' : Date,
    'round' : IDL.Nat,
    'prize_pot' : IDL.Nat,
  });
  const Ticket = IDL.Record({
    'date_time' : IDL.Int,
    'regular' : Numbers,
    'super' : Numbers,
    'entity_id' : IDL.Nat,
    'round' : Round,
  });
  const TicketId = IDL.Nat;
  const UserId = IDL.Text;
  const UserTicket = IDL.Record({
    'ticket' : Ticket,
    'ticket_id' : TicketId,
    'user_id' : UserId,
  });
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const Error = IDL.Variant({
    'Ok' : IDL.Null,
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Vec(UserTicket), 'err' : Error });
  const Result_2 = IDL.Variant({ 'ok' : Ticket, 'err' : Error });
  const Bio = IDL.Record({ 'username' : IDL.Text });
  const Profile = IDL.Record({ 'id' : IDL.Principal, 'bio' : Bio });
  const Result_1 = IDL.Variant({ 'ok' : Profile, 'err' : Error });
  const ProfileUpdate = IDL.Record({ 'bio' : Bio });
  const Dlotto = IDL.Service({
    'assignTicketToUser' : IDL.Func(
        [IDL.Vec(Ticket), IDL.Principal],
        [IDL.Vec(UserTicket)],
        [],
      ),
    'canisterAccount' : IDL.Func([], [AccountIdentifier], []),
    'canisterBalance' : IDL.Func([], [Tokens], []),
    'chargeICP' : IDL.Func([IDL.Nat64, IDL.Principal], [], []),
    'claimICP' : IDL.Func([IDL.Nat64, IDL.Principal], [], []),
    'claimTicketPrize' : IDL.Func([IDL.Nat, IDL.Principal], [Error], []),
    'create' : IDL.Func([], [Result], []),
    'delete' : IDL.Func([], [Result], []),
    'generateWinningTicket' : IDL.Func([], [Ticket], []),
    'getAllWinHistory' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, Ticket))],
        [],
      ),
    'getCurrentRound' : IDL.Func([], [Round], []),
    'getCurrentWinTicket' : IDL.Func([], [Ticket], []),
    'getDepositAddress' : IDL.Func([IDL.Principal], [AccountIdentifier], []),
    'getUserTicket' : IDL.Func([IDL.Nat], [Result_3], []),
    'getWinHistory' : IDL.Func([IDL.Nat], [Result_2], []),
    'read' : IDL.Func([], [Result_1], ['query']),
    'update' : IDL.Func([ProfileUpdate], [Result], []),
    'userAccountIdPublic' : IDL.Func([IDL.Principal], [AccountIdentifier], []),
    'userId' : IDL.Func([], [AccountIdentifier], []),
  });
  return Dlotto;
};
export const init = ({ IDL }) => { return []; };
