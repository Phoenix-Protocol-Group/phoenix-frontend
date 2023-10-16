export function serializeBigInt(arr: any) {
  const parsed = arr.map((pair: any) => {
    return JSON.parse(JSON.stringify(pair, (key, value) =>
      typeof value === 'bigint'
          ? value.toString()
          : value // 
    ));
  });

  return parsed
}
