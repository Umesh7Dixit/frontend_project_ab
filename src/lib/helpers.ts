export const TextEllipsis = (text: string, length: number) => {
    if (text.length > length) {
        return text.substring(0, length - 3) + "...";
    }
    return text;
}