import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().max(255).toLowerCase(),
  password: z.string().min(8).max(128),
});

export const registerSchema = z.object({
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255).toLowerCase(),
  password: z.string().min(8).max(128),
  country: z.string().max(100).optional(),
  accountType: z.enum(['investor', 'issuer']).optional(),
});

export const orderSchema = z.object({
  assetId: z.string().min(1).max(100),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['limit', 'market']).optional(),
  price: z.number().positive().max(1000000000).optional(),
  units: z.number().int().positive().max(1000000),
});

export const investmentSchema = z.object({
  assetId: z.string().min(1).max(100),
  units: z.number().int().positive().max(1000000),
  amount: z.number().positive().max(1000000000).optional(),
  txHash: z.string().min(10).max(200),
  fromChain: z.number().optional(),
  fromToken: z.string().max(20).optional(),
  walletAddress: z.string().max(100).optional(),
});

export function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(i => i.path.join('.') + ': ' + i.message).join(', ');
    return { valid: false, error: errors };
  }
  return { valid: true, data: result.data };
}
