# Ads to sell TON in a P2P Market

This contract will manage the list of ads to sell TON in a P2P market.
It can perform 4 operations that must be signed by the manager of the contract.

1000 Sent by seller to create an ad for certain amount of coins (kept in
     the contract) in the range 3 to 200 TON for a period of 10 days.
     For processing it should receive 0.3 additional.
2000 Sent by seller or manager to release coins from an ad to a buyer, if sent
     by seller it should have 0.3 and send 0.5 to manager,
     removes the ad and returning remaining of coins to the seller.
3000 Sent by seller or manager to cancel an ad and return coins to the seller.
     If sent by seller it should have 0.3 that are sent to manager.
4000 Sent by manager to cancel expired ads and send other accumulated fees to manager. 
     There is warranty that the total of coins remaining in contrat is the sum 
     of the coins of each non-expired ad plus 0.1*(number of ads) --to process them.


The state consist of:
1. Address of the manager
2. Public key of the manager to verify signatures of hash of messages
3. Sequence number to avoid replay atacks
4. Dictionary of ads where each entry is address => coins
5. Dictionary of validity of messages where each entry is
   address => valid_until

The balance of this contract will be above the sum of the
coins + (0.1 * (number of ads)) in the dictionary (in order to pay fees for
processing, sending and for the operation of the market).

In case of error all operations will throw errors, starting with:
5000. Invalid signature
5001. Invalid operation
5002. Message doesn't have reference
5003. Seller not in list of ads (in case of giving coins or canceling ad)
5004. Seqno of message doesn't match seqno of contract
5005. Values are not consistent
5006. Referenced cell shouldn't have more references

## Create ad

512-bits of signature of the hash of the rest of the message by manager 
32-bit seqno
32-bit unsinged op equal to 1000

The seller will be the sender of the message, the amount of coins to
sell will be coins of the message - 0.3TON.

Operation will be interrupted throwing errors in these cases:

1100. There are already 255 ads
1101. The seller already has an ad
1102. Less than 3.3 coins

If the operation is not interrupted, it will add to dictionary in the state
the relation
seller => [coins-0.3, now+10 days]
It will leave in the contract 0.1 for further processing and it will
send the other 0.2 (minus fees) to the manager.


## Give coins from ad to buyer

512-bits of signature of the hash of the rest of the message by manager
32-bit seqno
32-bit unsinged op equal to 2000
Valid MsgAddress of seller
Valid MsgAddress of buyer
coins to give

The sender must be the manager
Operation will be interrupted throwing errors in these cases:

2100. Coins to give above ad

If the operation is not interrupted, it will remove the ad from the dictionary,
it will send the coins to the buyer address, it will send 0.5 to the manager
and it will send the rest of coins in ad plus 0.01 to the seller.


## Cancel an ad and return coins to the seller.

512-bits of signature of the hash of the rest of the message by manager
32-bit seqno
32-bit unsinged op equal to 3000
Valid MsgAddress of seller

If the seller is in the list of ads it will return the amount of coins plus
0.5 initially given by seller because the operation was not completed.

## Cancel expired ads and send additional fees to manager

512-bits empty
32-bit seqno
32 bits unsigend op equal to 4000

The sender must be the manager

Updates state by cancelling ads whose valid_until time is above current time.
The cancelation of each message is as desribed in the section about cancelling.

If the contract has more than the sum of the coins in dictionary plus
0.1 * (number of ads) sends the surplus to manager.


