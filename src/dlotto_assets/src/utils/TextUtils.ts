export const pluralPipe = (count: number, word: string, ending: string = 's'): string => {
    return `${word}${count === 1 ? '' : ending}`
}

export const shortenedText = (text: string, separator: string = '-', spacing: string = '...'): string => {
    if (!text) return '';
    const textParts = text.split(separator);
    return `${textParts[0]}${separator}${spacing}${separator}${textParts[textParts.length-1]}`;
}
