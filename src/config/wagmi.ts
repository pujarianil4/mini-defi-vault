import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {  sepolia, mainnet } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Mini-defi',
  projectId: 'YOUR_PROJECT_ID',
  chains: [sepolia, mainnet],
});
