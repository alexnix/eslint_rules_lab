const {ESLintUtils} = require('@typescript-eslint/experimental-utils');
const ts = require("typescript");
const tsutils = require("tsutils");

module.exports = {
    create(context) {
        return {
            Identifier(node) {
                const checker = context.parserServices.program.getTypeChecker();

                const symbol = checker.getSymbolAtLocation(
                    context.parserServices.esTreeNodeToTSNodeMap.get(node)
                );

                if(tsutils.isSymbolFlagSet(symbol, ts.SymbolFlags.EnumMember)) return;

                const isEnum = tsutils.isSymbolFlagSet(symbol, ts.SymbolFlags.Enum);

                const followedByDotToken = context.getSourceCode().text[node.range[1]] === ".";

                const declarationSymbol = symbol.declarations[0].symbol;
                const declarationIsEnum = tsutils.isTypeFlagSet(
                    checker.getDeclaredTypeOfSymbol(declarationSymbol), ts.TypeFlags.EnumLike
                );

                if (
                    (isEnum || declarationIsEnum) &&
                    !followedByDotToken &&
                    !["TSEnumDeclaration", "ImportSpecifier"].includes(node.parent.type)
                ) {
                    context.report({
                        node,
                        message:"found enum"
                    })
                } 
                
            }
        }
    }
}