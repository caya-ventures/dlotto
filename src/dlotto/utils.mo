import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Trie "mo:base/Trie";
import Principal "mo:base/Principal";

module {
    // check if a value exists in an array
    public func existsInArray (needle : Nat, haystack : [var Nat]) : Bool {
        for (existingNumber in haystack.vals()) {
            if (existingNumber == needle) {
                return true;
            }
        };

        return false;
    };

    public func natKey (x : Nat) : Trie.Key<Nat> {
        return {
            key = x;
            hash = Hash.hash(x)
        }
    };

    public func textKey (x : Text) : Trie.Key<Text> {
        return {
            key = x;
            hash = Text.hash(x)
        }
    };

    public func key(x : Principal) : Trie.Key<Principal> {
        return { 
            key = x; 
            hash = Principal.hash(x) 
        }
    };
}