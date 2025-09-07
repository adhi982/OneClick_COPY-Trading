"use client"

import { useState, useEffect } from 'react';
import { useWallet } from '@/components/wallet/WalletProvider';

export function useWalletConnection() {
  const { connected, account, disconnect } = useWallet();
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (connected && account) {
      setAddress(account.address);
    } else {
      setAddress(null);
    }
  }, [connected, account]);

  return {
    connected,
    address,
    disconnect
  };
}
