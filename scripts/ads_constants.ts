import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

export const tonNetwork =
  typeof process != "undefined" && 
  typeof process.env.TON_NETWORK != "undefined" && 
  process.env.TON_NETWORK == 'mainnet' ?
  'mainnet' :
  'testnet'; 

export const managerSecret24 =
  typeof process != "undefined" && 
  typeof process.env.MANAGER_SECRET24 != "undefined" ?
    process.env.MANAGER_SECRET24 :
    "x y z";

export const managerAddress = 
  typeof process != "undefined" && 
  typeof process.env.MANAGER_ADDRESS != "undefined" ?
  process.env.MANAGER_ADDRESS :
  "EQDXnq8N5G6dLWMUfakrllwIDGp0Z5AWzDhyubyOjQC8NM7I";

export const managerPublicKey = 
  typeof process != "undefined" && 
  typeof process.env.MANAGER_PUBLIC_KEY != "undefined" ?
  +process.env.MANAGER_PUBLIC_KEY : 
  80707734765953252277396461989487177013786725744056774214746834774813238654892;

export const fundAddress = 
  typeof process != "undefined" && 
  typeof process.env.FUND_ADDRESS != "undefined" ?
  process.env.HANDSFORSIERRALEONE_ADDRESS :
  "EQBW-VzrrQgUZCKonQm3gHqDFUK42yM33k3g6zMpvvq7tcCj";

export const fundPercentage =
  typeof process != "undefined" && 
  typeof process.env.FUND_PERCENTAGE != "undefined" ?
  +process.env.FUND_PERCENTAGE : 10;

export const adsContractAddress = 
  (typeof process != "undefined" && 
  typeof process.env.ADSCONTRACT_ADDRESS != "undefined") ?
  process.env.ADSCONTRACT_ADDRESS :
  "EQDpN8C7zvujgd2jS3ppZAriy7HVURqWgPaqCo_ohfFmgifh";

export const intercambiadorDomain = 
  typeof process != "undefined" && 
  typeof process.env.INTERCAMBIADOR_DOMAIN != "undefined" ?
  process.env.INTERCAMBIADOR_DOMAIN : 
  "intercambiadordev.pasosdeJesus.org";

export const portAuthBackendTls = 
  typeof process != "undefined" && 
  typeof process.env.PORT_AUTHBACKEND_TLS != "undefined" ?
  process.env.PORT_AUTHBACKEND_TLS :
  "4443";

export const authBackend = 
  `https://${intercambiadorDomain}:${portAuthBackendTls}`

export const portDbBackendTls = 
  typeof process != "undefined" && 
  typeof process.env.PORT_DBBACKEND_TLS != "undefined" ?
  process.env.PORT_DBBACKEND_TLS : 
  "3443";

export const dbBackend = 
  `https://${intercambiadorDomain}:${portDbBackendTls}`


export const adMinCoins = 5200000000;
export const adMaxTime  = 864000;

// Operations with selling ads
export const opSellerCreatesAd                 = 1000;
export const opSellerReleasesCoins             = 1100;
export const opSellerCancelsAd                 = 1200;
export const opManagerCancelsSellingAd         = 1300;

// Operations with buying ads
export const opBuyerCreatesAd                  = 2000;
export const opSellerPaysBuyingAd              = 2100;
export const opSellerReleaseCoinsOfBuyingAd    = 2200;
export const opBuyerCancelsAd                  = 2300;
export const opManagerCancelsBuyingAd          = 2300;

// Administrative operations
export const opManagerDistributesUtility       = 3000;
export const opManagerEndsOperation            = 4000;

export const backendHost = "https://intercambiadordev.pasosdeJesus:4443"
