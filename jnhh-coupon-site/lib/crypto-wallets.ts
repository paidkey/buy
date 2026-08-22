export interface CryptoWallet {
  id: string;
  /** Shown as the dropdown option text and used as the paymentMethod value */
  label: string;
  coinName: string;
  /** Network label shown to the buyer so they send on the right chain */
  network?: string;
  address: string;
}

// Pulled directly from Exodus "Receive" screens. BTC is listed first per
// request. Note: ETH / USDT (ERC20) / BNB (BSC) share one address because
// they're all Ethereum-compatible chains — same for SOL / USDT (Solana).
export const CRYPTO_WALLETS: CryptoWallet[] = [
  {
    id: "btc",
    label: "Bitcoin (BTC)",
    coinName: "Bitcoin",
    address: "bc1qfymn6jjfwl99arpjdnhvh6l4q33054ptpgmku4",
  },
  {
    id: "eth",
    label: "Ethereum (ETH)",
    coinName: "Ethereum",
    network: "ETH (ERC20)",
    address: "0xFc49837c45714836463d61ef17639415d9E652FD",
  },
  {
    id: "ltc",
    label: "Litecoin (LTC)",
    coinName: "Litecoin",
    address: "LR4QLFbndteVK2WvA9EvtbPfdek1BkL5x9",
  },
  {
    id: "sol",
    label: "Solana (SOL)",
    coinName: "Solana",
    address: "Dd3fphyCihw51A3yuCGnbXx2VpPkwwwG7pcdpMDnUZ8v",
  },
  {
    id: "usdt-trc20",
    label: "Tether (USDT — TRC20)",
    coinName: "Tether USD",
    network: "TRC20 (Tron)",
    address: "TWBc5Ki4PqaYnx5E6T2pPya67RND2cPuBX",
  },
  {
    id: "usdt-erc20",
    label: "Tether (USDT — ERC20)",
    coinName: "Tether USD",
    network: "ERC20 (Ethereum)",
    address: "0xFc49837c45714836463d61ef17639415d9E652FD",
  },
  {
    id: "usdt-sol",
    label: "Tether (USDT — Solana)",
    coinName: "Tether USD",
    network: "Solana",
    address: "Dd3fphyCihw51A3yuCGnbXx2VpPkwwwG7pcdpMDnUZ8v",
  },
  {
    id: "doge",
    label: "Dogecoin (DOGE)",
    coinName: "Dogecoin",
    address: "DJhuwBPWcP1esc66afBsieP1Yc5tR5jwit",
  },
  {
    id: "xrp",
    label: "XRP",
    coinName: "XRP",
    network: "no destination tag needed",
    address: "rBz9eF28tj6PKBFBQbtRkPwammgXJgNMS1",
  },
  {
    id: "bnb",
    label: "BNB (BSC)",
    coinName: "BNB",
    network: "BEP20 (BSC)",
    address: "0xFc49837c45714836463d61ef17639415d9E652FD",
  },
];
