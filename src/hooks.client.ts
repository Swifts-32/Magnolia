if (typeof crypto !== "undefined" && !crypto.randomUUID) {
  console.warn("Crypto is not native. Replacing function")
  crypto.randomUUID = () =>
    (
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    ) as `${string}-${string}-${string}-${string}-${string}`
}
else {
  console.info("Crypto exists");
}