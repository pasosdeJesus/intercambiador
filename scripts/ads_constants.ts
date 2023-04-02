import dotenv from "dotenv"
dotenv.config({ path: "../.env"})

export const tonNetwork =
  typeof process.env.TON_NETWORK != "undefined" && 
  process.env.TON_NETWORK == 'mainnet' ?
  'mainnet' :
  'testnet'; 

export const managerSecret24 = process.env.MANAGER_SECRET24 || "x y z";

export const managerAddress = process.env.MANAGER_ADDRESS || 
  "EQBw2alYCpBVSZsuxBV92akZdfKqU4u8upAU6nyx-Lv6rh81";

export const managerPublicKey = 
  typeof process.env.MANAGER_PUBLIC_KEY != "undefined" ?
  +process.env.MANAGER_PUBLIC_KEY : 
  80707734765953252277396461989487177013786725744056774214746834774813238654892;

export const fundAddress = process.env.MANAGER_ADDRESS || 
  "EQBW-VzrrQgUZCKonQm3gHqDFUK42yM33k3g6zMpvvq7tcCj";

export const fundPercentage =
  typeof process.env.FUND_PERCENTAGE != "undefined" ?
  +process.env.FUND_PERCENTAGE : 10;

export const adsContractAddress = process.env.ADSCONTRACT_ADDRESS || 
  "EQDpN8C7zvujgd2jS3ppZAriy7HVURqWgPaqCo_ohfFmgifh";

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

export const backendHost = "https://intercambiador.pasosdeJesus:4443"
