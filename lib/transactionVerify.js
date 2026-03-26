// Transaction verification — ensures every transaction shows full details
// before being submitted. No hidden contract calls allowed.

// Approved Nextoken contracts — only these can be interacted with
const APPROVED_CONTRACTS = {
  factory: process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
  yieldDistributor: process.env.NEXT_PUBLIC_YIELD_DISTRIBUTOR,
};

// Build a clear signing object for any transaction
export function buildClearTransaction({ type, amount, token, destination, destinationLabel, contract, functionName, fee, network, args }) {
  const warnings = [];

  // Validate required fields
  if (!amount && amount !== 0) warnings.push("Amount is not specified");
  if (!destination) warnings.push("Destination address is missing");
  if (!contract) warnings.push("Contract address is not specified");
  if (!functionName) warnings.push("Contract function is not specified");

  // Check if contract is approved
  const approvedAddresses = Object.values(APPROVED_CONTRACTS).filter(Boolean).map(a => a.toLowerCase());
  if (contract && !approvedAddresses.includes(contract.toLowerCase())) {
    warnings.push("WARNING: This contract is NOT in the approved Nextoken contract list");
  }

  // Check destination
  if (destination && destination.length !== 42) {
    warnings.push("Destination address format appears invalid");
  }

  // Determine risk level
  let riskLevel = "low";
  if (warnings.length > 0) riskLevel = "medium";
  if (warnings.some(w => w.includes("NOT in the approved"))) riskLevel = "high";
  if (parseFloat(amount) > 10000) riskLevel = riskLevel === "low" ? "medium" : "high";

  return {
    type: type || "Unknown Transaction",
    amount: amount != null ? String(amount) : null,
    token: token || null,
    destination: destination || null,
    destinationLabel: destinationLabel || null,
    contract: contract || null,
    functionName: functionName || null,
    fee: fee || "Estimated on-chain",
    network: network || "Polygon (MATIC)",
    args: args || [],
    warnings,
    riskLevel,
    timestamp: new Date().toISOString(),
  };
}

// Validate a transaction before execution (server-side)
export function validateTransaction(tx) {
  const errors = [];

  if (!tx.amount && tx.amount !== 0) errors.push("Amount is required");
  if (!tx.destination) errors.push("Destination is required");
  if (!tx.contract) errors.push("Contract address is required");
  if (!tx.functionName) errors.push("Function name is required");

  // Block if destination is zero address
  if (tx.destination === "0x0000000000000000000000000000000000000000") {
    errors.push("Cannot send to zero address");
  }

  return { valid: errors.length === 0, errors };
}
