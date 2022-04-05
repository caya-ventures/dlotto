import type { Principal } from '@dfinity/principal';
export type AccountIdentifier = Array<number>;
export interface Bio { 'username' : string }
export type Error = { 'NotFound' : null } |
  { 'NotAuthorized' : null } |
  { 'AlreadyExists' : null };
export interface Profile { 'id' : Principal, 'bio' : Bio }
export interface ProfileUpdate { 'bio' : Bio }
export type Result = { 'ok' : null } |
  { 'err' : Error };
export type Result_1 = { 'ok' : Profile } |
  { 'err' : Error };
export interface Tokens { 'e8s' : bigint }
export interface _SERVICE {
  'canisterAccount' : () => Promise<AccountIdentifier>,
  'canisterBalance' : () => Promise<Tokens>,
  'create' : () => Promise<Result>,
  'delete' : () => Promise<Result>,
  'read' : () => Promise<Result_1>,
  'tranferTokens' : () => Promise<undefined>,
  'update' : (arg_0: ProfileUpdate) => Promise<Result>,
  'userBalance' : () => Promise<Tokens>,
  'userId' : () => Promise<AccountIdentifier>,
}
