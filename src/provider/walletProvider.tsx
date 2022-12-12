import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, useAnchorWallet, useConnection, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolletWalletAdapter, SolletExtensionWalletAdapter } from "@solana/wallet-adapter-sollet";
import { SlopeWalletAdapter } from "@solana/wallet-adapter-slope";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { ReactNode, useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { AnchorProvider } from "@project-serum/anchor";
import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import "../App.css";
import backgroundIMG from "../media/photo_2022-09-12_21-05-23.jpg";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { Connection } from "@solana/web3.js";

type Props = {
  children: ReactNode;
};

export function useAnchorProvider() {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = useMemo(
    () =>
      wallet == null
        ? null
        : new AnchorProvider(connection, wallet, {
            commitment: "confirmed",
          }),
    [connection, wallet]
  );

  return provider;
}

export default function WalletProviderComponent({ children }: Props) {
  const network = WalletAdapterNetwork.Mainnet;
  const rpc = clusterApiUrl(network);
  // const solanaConnection = new Connection('https://clean-fragrant-scion.solana-mainnet.discover.quiknode.pro/7c6be677f6c5a289bc3b743f956405cf2a63a485/');

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SlopeWalletAdapter(), new SolflareWalletAdapter(), new SolletWalletAdapter({ network }), new SolletExtensionWalletAdapter({ network })], [network]);

  return (
    <ConnectionProvider endpoint={"https://wispy-ultra-violet.solana-mainnet.discover.quiknode.pro/31ea4da3c719411cd04b9d517a7690b738c2ba32/"} config={{ commitment: "finalized" }}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletDialogProvider>
          <WalletModalProvider>
            <div className="backgroundStyle">
              <LazyLoadImage alt={""} effect="blur" src={backgroundIMG} className="backgroundStyle_img" />
            </div>
            {children}
          </WalletModalProvider>
        </WalletDialogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
