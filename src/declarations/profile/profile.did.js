export const idlFactory = ({ IDL }) => {
  const AccountIdentifier = IDL.Vec(IDL.Nat8);
  const Tokens = IDL.Record({ 'e8s' : IDL.Nat64 });
  const Error = IDL.Variant({
    'NotFound' : IDL.Null,
    'NotAuthorized' : IDL.Null,
    'AlreadyExists' : IDL.Null,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : Error });
  const Bio = IDL.Record({ 'username' : IDL.Text });
  const Profile = IDL.Record({ 'id' : IDL.Principal, 'bio' : Bio });
  const Result_1 = IDL.Variant({ 'ok' : Profile, 'err' : Error });
  const ProfileUpdate = IDL.Record({ 'bio' : Bio });
  return IDL.Service({
    'canisterAccount' : IDL.Func([], [AccountIdentifier], ['query']),
    'canisterBalance' : IDL.Func([], [Tokens], []),
    'create' : IDL.Func([], [Result], []),
    'delete' : IDL.Func([], [Result], []),
    'read' : IDL.Func([], [Result_1], ['query']),
    'tranferTokens' : IDL.Func([], [], []),
    'update' : IDL.Func([ProfileUpdate], [Result], []),
    'userBalance' : IDL.Func([], [Tokens], []),
    'userId' : IDL.Func([], [AccountIdentifier], []),
  });
};
export const init = ({ IDL }) => { return []; };
