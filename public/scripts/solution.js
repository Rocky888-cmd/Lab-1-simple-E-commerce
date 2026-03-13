function checkVariable(input) {
    switch (typeof input) {
        case "string":
            return "string";
        
        case "number":
            return "number";

        case "boolean":
            return "boolean";

        case "bigint":
            return "bigint";

        case "undefined":
            return "undefined";

        case "object":
            return "object";

        default:
            return "unknown type";
    }
}

function generateIDs(count) {

    const ids = [0,1,2,3,4,5,6,7];
    const result = [];

    for (let i = 0; i <= count; i++) {

        if (i === 5) {
            continue;
        }

        const id = `ID-${ids[i]}`;
        result.push(id);
    }

    return result;
}

console.log(generateIDs(7));