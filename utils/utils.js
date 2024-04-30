

function extractNumber(inputString) {
    const numberMatch = inputString.match(/\d+/); // Find the first occurrence of a number in the string
    if (numberMatch) {
        return numberMatch[0];
    } else {
        return null;
    }
}

export default {
    extractNumber
}