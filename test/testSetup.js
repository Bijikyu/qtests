(async () => {
  try{ await import('qtests/setup'); }catch{} //(attempt package setup without failing)
  const { setup } = await import('../index.js'); // (import setup function from main module)
  await setup(); // (activate stub resolution for jest)
})();
