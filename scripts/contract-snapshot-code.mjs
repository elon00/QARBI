/** Read contract runtime code at one explicit block height, never the moving latest tag. */
export async function getRuntimeCodeAtSnapshot(provider, address, blockNumber) {
  if (!Number.isSafeInteger(blockNumber) || blockNumber < 0) {
    throw new Error('BLOCKED: invalid contract verification snapshot block');
  }
  const code = await provider.getCode(address, blockNumber);
  if (typeof code !== 'string' || !/^0x(?:[0-9a-fA-F]{2})*$/.test(code)) {
    throw new Error('BLOCKED: malformed runtime code returned by RPC provider');
  }
  return code;
}
