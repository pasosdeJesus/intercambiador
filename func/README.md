# Ads for P2P Market

This contract will manage the list of ads in a P2P market.
It can perform 4 operations that must be signed by the manager of the contract.

1000 Create an ad from a seller for certain amount of coins (kept in
     the contract) in the range 3 to 1000 TON for a period of 10 days.  
     For processing it should receive at least 0.6 additional.
2000 Give coins from an ad to a buyer, pays minimal fee (0.5 TON) to manager
     changes the ad by reducing offered coins
     if there are left less than 3 coins returns remaining coins to seller 
     and removes the ad.
3000 Cancel an ad and return coins to the seller.
4000 Cancel expired ads and send extra fees to manager. There is warranty 
     that the total of coins given by the sellers plus 0.1*(number of ads) 
     to process them remains in contract.


The state consist of:
1. Address of the manager of the ad
2. Public key of the manager to verify signatures of hash of message
3. Dictionary of ads where each entry is address => coins
4. Dictionary of validity of messages where each entry is 
   address => valid_until

The balance of this contract will be above the sum of the 
coins + (0.1 * (number of ads)) in the dictionary (in order to pay fees for 
processing, sending and for the operation of the market).

In case of error all operations will throw errors, starting with:
5000. Invalid signature
5001. Invalid operation
5002. Address of sender does not correspond to address of seller in message
      (in case of createing ad, giving coins or canceling ad).
5003. Seller not in list of ads (in case of giving coins or canceling ad)

## Create ad

512-bits of signature of the hash of the rest of the message by manager
32-bit unsinged op equal to 1000
Valid MsgAddress of seller
coins to sell

The seller will be the sender of the message.


The message should have at least coins+0.6 TON.

Operation will be interrupted throwing errors in these cases:

1100. There are already 255 ads
1101. The seller already has an ad
1102. Coins out of accepted range 3.55 - 1000.55

If the operation is not interrupted, it will add to dictionary in the state
the relation 
seller => [coins, now+10 days]

From https://github.com/ton-blockchain/ton/blob/master/crypto/smartcont/multisig-code.fc
slice cs = query.begin_parse();
  slice root_signature = cs~load_bits(512);
  int root_hash = slice_hash(cs);
  int root_i = cs~load_uint(8);

  cell public_keys = get_public_keys();
  (slice public_key, var found?) = public_keys.udict_get?(8, root_i);
  throw_unless(31, found?);
  throw_unless(32, check_signature(root_hash, root_signature, public_key.preload_uint(256)));

## Give coins from ad to buyer

512-bits of signature of the hash of the rest of the message by manager
32-bit unsinged op equal to 2000
Valid MsgAddress of seller
Valid MsgAddress of buyer
coins to give 

Operation will be interrupted throwing errors in these cases:

2100. Coins to give above ad

If the operation is not interrupted, it will remove the ad from the dictionary,
it will send the coins to the buyer address, it will send 0.5 to the manager
and it will send the rest of coins in ad plus 0.04 to the seller.


## Cancel an ad and return coins to the seller.

512-bits of signature of the hash of the rest of the message by manager
32-bit unsinged op equal to 3000
Valid MsgAddress of seller

If the seller is in the list of ads it will return the amount of coins plus
0.5 initially given by seller because the operation was not completed.

## Cancel expired ads and send additional fees to manager

512-bits empty
32 bits unsigend op equal to 4000

The sender must be the manager.

Updates state by cancelling ads whose valid_until time is above current time.
The cancelation of each message is as desribed in the section about cancelling.

If the contract has more than the sum of the coins in dictionary plus 
0.1 * (number of ads) sends the surplus to manager.


