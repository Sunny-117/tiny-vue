
import { parse } from "./parser";
import { transform } from "./transform";




export function compile(template) {
    const ast = parse(template)
    transform(ast)
}

export { parse };

