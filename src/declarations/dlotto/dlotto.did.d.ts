import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = Array<number>;
export interface Bio { 'username' : string }
export type Date = bigint;
export type Error = { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'AlreadyExists' : null };
export type Numbers = Array<bigint>;
export interface Profile { 'id' : Principal, 'bio' : Bio }
export interface ProfileUpdate { 'bio' : Bio }
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : Profile } |
  { 'err' : Error };
export type Result_2 = { 'ok' : Ticket } |
  { 'err' : Error };
export type Result_3 = { 'ok' : Array<UserTicket> } |
  { 'err' : Error };
export interface Round {
  'finish_at' : Date,
  'round' : bigint,
  'prize_pot' : bigint,
}
export interface Ticket {
  'date_time' : bigint,
  'regular' : Numbers,
  'super' : Numbers,
  'entity_id' : bigint,
  'round' : Round,
}
export type TicketId = bigint;
export interface Tokens { 'e8s' : bigint }
export type UserId = string;
export interface UserTicket {
  'ticket' : Ticket,
  'ticket_id' : TicketId,
  'user_id' : UserId,
}
export interface _SERVICE {
  'assignTicketToUser' : (arg_0: Array<Ticket>) => Promise<Array<UserTicket>>,
  'canisterAccount' : () => Promise<AccountIdentifier>,
  'canisterBalance' : () => Promise<Tokens>,
  'create' : () => Promise<Result>,
  'delete' : () => Promise<Result>,
  'getAllWinHistory' : () => Promise<Array<[bigint, Ticket]>>,
  'getCurrentRound' : () => Promise<Round>,
  'getCurrentWinTicket' : () => Promise<Ticket>,
  'getTicketPrize' : (arg_0: bigint) => Promise<[] | [number]>,
  'getUserTicket' : (arg_0: bigint) => Promise<Result_3>,
  'getWinHistory' : (arg_0: bigint) => Promise<Result_2>,
  'read' : () => Promise<Result_1>,
  'tranferTokens' : (arg_0: AccountIdentifier, arg_1: bigint) => Promise<
      undefined
    >,
  'update' : (arg_0: ProfileUpdate) => Promise<Result>,
  'userBalance' : () => Promise<Tokens>,
  'userId' : () => Promise<AccountIdentifier>,
}
