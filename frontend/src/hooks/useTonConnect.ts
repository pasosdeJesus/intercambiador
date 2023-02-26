import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { CHAIN } from "@tonconnect/protocol";
import { Sender, SenderArguments } from 'ton-core';

export function useTonConnect(): { 
  sender: Sender;
  connected: boolean;
  wallet: string | null;
  network: CHAIN | null;
  depura: any;
  reporta: any;
} {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet(); 

  return {
    sender: {
      send: async (args: SenderArguments) => {
        tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString('base64'),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
      },
    },
    connected: !!wallet?.account.address,
    wallet: wallet?.account.address ?? null,
    network: wallet?.account.chain ?? null,
    depura: async () => {
      //const walletsList = await tonConnectUI.connector.getWallets();
      //debugger
    },
    reporta: () => {
//      tonConnectUI.connector.onStatusChange(
//        walletInfo => {
          // Llamada (varias veces) cuando se conecta o
          // desconecta
//          console.log('Connection status:', walletInfo);
//        }
//      )
    },
  };
}
