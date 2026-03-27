import { requireAdmin } from "../../../lib/adminAuth";
import { getDeployerAddress, getDeployerBalance } from "../../../lib/blockchain";

async function handler(req, res) {
  try {
    const address = await getDeployerAddress();
    const balance = await getDeployerBalance();
    return res.json({
      network: "Polygon Mainnet",
      chainId: 137,
      deployer: address,
      maticBalance: balance,
      rpcConnected: true,
      explorerUrl: "https://polygonscan.com/address/" + address,
    });
  } catch (e) {
    return res.json({ error: e.message, rpcConnected: false });
  }
}
export default requireAdmin(handler);
