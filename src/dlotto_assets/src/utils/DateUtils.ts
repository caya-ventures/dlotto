export const dateFromBigInt = (timeStamp: bigint | undefined): string => {
    if (!timeStamp) return '';
    return new Date(Number(timeStamp) * 1000).toDateString();
}
