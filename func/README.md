# Contract to manage ads to sell/buy TON in a P2P Market

The contract `func/ads_contract.fc` will manage the list of ads to sell or 
buy TON in the P2P market of Intercambiador COP - TON

To test you need `ton` tools and `toncli` 0.0.43. Their installation in 
OpenBSD/adJ is described at
<https://medium.com/@vladimirtmara/developing-and-testing-a-simple-smart-contract-with-toncli-de96ad0a6f5c>

Once you have the tools simply run:
```
make
```

# Requirements

The general requirements for the P2P market are at:
<https://docs.google.com/document/d/1JtmHp5SPsHglGwQJYlQSabMryCY6QzM-07OdDsJWrYw/edit?usp=sharing>

What follows are the specific requeriments for this contract.

This contract can perform operations that must be signed by the manager[^fn1].

[^fn1] How we handled to produce signatures to test in FunC is explained in 
  a comment we made at:
  <https://github.com/ton-society/ton-footsteps/issues/129>


We propose the following operations:

1000 Sent by seller to create an ad at least for 5TON (kept in the contract,
     upper limit set by backend for example 200).
     It should have additional fee of min(4%, 0.8) TON

1100 Sent by the seller to confirm a buyer sent him/her payment and
     the bought coins described in message must be released to the buyer 
     and the rest (if there are coins from ad) must be returned to the seller.
     It should have 0.2 as processing costs. 

1200 Sent by the seller authorized by manager to cancel an ad that
     doesn't have payments or conflicts in process.  It should have 
     0.2 as processing costs.

1300 Sent by manager in case of expiring an ad or in case of conflict,
     to delete an ad and return its coins or part of them to the seller 
     and maybe pay with the rest to a buyer.

2000 Sent by creator of buying ad for certain amount of coins (kept in
     the contract) starting at 5 TON for a period of 10 days (upper
     limited by the backend for example at 200 TON).
     The message should carry additional min(0.8, 4%).

2100 Sent by a seller who pays a buying ad to sell the coins sent in 
     message that should be at most the coins of the ad.  It has the 
     amount to sell + 0.03 (to process).

2200 Sent by a seller who paid TON to a buying ad informing that the buyer
     already sent full fiat money.  For processing the message should have
     0.03.
     Releases the coins to the buyer who made the ad - 0.2.

2300 Sent by the creator of buying ad authorized by manager to cancel the ad 
     that doesn't have payments or conflicts in process.  It should have 
     0.2 as processing costs.

2400 Sent by manager to cancel an expiring or in case of conflict.


3000 Sent by manager to send extra fees accumulated to manager
     and fund i.e. above sum(coins)+0.1*amount_entries_in_dictionaries
     (0.1 to process in case of cancellations).

4000 Sent by manager to end operation and delete contract. 
     Cancels all the ads returning the coins to the sellers. Send
     remaining to manager and Fund.   Useful during testing to recover 
     the coins or for example if the contract changes and must be redeployed.


The state consist of:
1. Sequence number to avoid replay atacks
2. Percentage of utilites for Christian Fund "Hands for Sierra Leone" (>= 10%)
3. Dictionary of selling ads where each entry is 
   seller_address => (coins, valid_until)
4. Dictionary of buying ads where each entry is 
   buyer_address => (max_coins_to_buy, valid_until)
5. Dictionary of payments for buying ads each entry is 
   buyer_address => (address_who_paid, coins_paid-0.02, valid_until)


In case of error all operations will throw errors, starting with:
500. Invalid signature
501. Invalid operation
502. Unexpected structure of message
503. Seqno of message doesn't match seqno of contract
504. Values are not sufficient

All the messages have a reference to a cell with:
  1. 512-bits of signature of the following cell referenced
  2. Reference to a cell with parameters for operation to perfom


## Seller creates ad (1000)

Cell with parameters is:

32-bit seqno
32-bit unsinged op equal to 1000
Amount of coins for ad is the integer amount of coins in message.

Backend should make sure that the ad is for an integer amount a >= 5
and that it adds at least 0.2.

The seller will be the sender of the message, the amount of coins to
sell will be integer part of coins in message.  The rest should be above
0.2.

Operation will be interrupted throwing errors in these cases:

1001. Couldn't create ad (maybe there are already 255 ads)
1002. The seller already has an ad
504.  Received less than 5.3 coins

If the operation is not interrupted, it will add to the dictionary of selling
ads in the state the relation 

seller => [~round(coins), now+10 days]

The processing cost are divided in around 0.015 for network fees,
0.1 kept in contract in case of further processing of the add not paid 
by seller, and the rest divided for manager and Fund in proportions 
according to the percentage for fund.


## Seller authorizes releasing coins from ad to buyer (1100)

Cell with parameters is:

32-bit seqno
32-bit unsinged op equal to 1100
coins to give

The message should have 0.2TON.

Operation will be interrupted throwing errors in these cases:

505  Seller doesn't have an ad
504  Less than 0.2TON sent by seller
508  Coins to release above coins in ad
1102 Couldn't delete ad

If the operation is not interrupted, it will remove the ad from the dictionary,
it will send the coins to the buyer address, it will send the remaining
coins of the Ad to the seller.
It will send the coins of the message to manager and fund.


## Seller cancels an ad that doesn't have pending orders or conflicts (1200)

Cell with parameters is:

32-bit seqno
32-bit unsinged op equal to 12000

It should have 0.2 as processing cost.

The backend should not authorize this message cancelling an ad for which a buyer
indicated that it sent fiat money or if it is in conflict.

Possible erorrs are:
504  Seller didn't send 0.2TON
505  Seller doesn't have an ad
506  Couldn't delete ad
507  Administrative operation request by user who is not the manager

If the seller is in the dictionary of selling ads it will remove it from there
and return the amount of coins in dictionary to the seller.


## Manager cancels an ad either a expiring one or in case of conflict (1300)

Cell with parameters is:

32-bit seqno
32-bit unsinged op equal to 1300
Valid MsgAddress of seller with add
--- Nothing else if expiring an ad, in case of conflict the following also:
Coins to give to seller
Address of Buyer to give rest of coins

The possible erros it can throw are:

505 The address of seller doesn't have an ad
506 It couldn't delete the ad
508 Coins for seller above coins in ad

If no additional parameters are sent, the expired ad must be removed 
and all the coins of it should be returned to the seller.

In a conflict the manager can be convincend that the buyer didn't 
pay full amount in fiat, and in that case he can say how much to return 
to seller and how much to give to buyer (in case the buyer proves that
he/she paid something): 
  * It will remove the ad from dictionary and send the specified coins to
    the seller.
  * The rest of coins, if there are, will be sent to the buyer.


## Manager sends accumulated extra fees to fund and manager (3000)

Sent by manager to send extra fees accumulated to manager
and fund i.e. above sum(coins of sellers) + 0.1*amount_entries_in_dictionaries
(0.1 to process in case of conflicts).

Possible errors
507  Sender should be manager
3001 Utility below zero.


## Manager ends operation (4000)

Returns all the coins in selling ads to sellers.
Returns all the coins in payments to buy ads to buyers.

Returns the rest of the coins to the manager and destroys contract.

Possible errors:
507  Sender should be manager
