const ts = require("typescript");
const tsutils = require("tsutils");

module.exports = {
  create(context) {
    const importedFromBar = [];

    return {
      ImportDeclaration(node) {
        console.log("1");
        if (node.source.value.startsWith("./bar")) {
          importedFromBar.push(...node.specifiers.map((s) => s.local.name));
        }
      },

      Identifier(node) {
        if (node.name === "foo" && importedFromBar.includes("foo")) {
          console.log("2");
          const checker = context.parserServices.program.getTypeChecker();

          const symbol = checker.getSymbolAtLocation(
            context.parserServices.esTreeNodeToTSNodeMap.get(node)
          );

          const declarationSymbol = symbol.declarations?.[0]?.symbol;

          if (!declarationSymbol) {
            return;
          }

          const isDeclarationNum = tsutils.isTypeFlagSet(
            checker.getDeclaredTypeOfSymbol(declarationSymbol),
            ts.TypeFlags.Number
          );

          const isNumSymbol = tsutils.isSymbolFlagSet(
            symbol,
            ts.SymbolFlags.Number
          );

          console.log({ isDeclarationNum, isNumSymbol });

          if (isDeclarationNum || isNumSymbol) {
            context.report({
              node,
              message: "Found test variable",
            });
          }
        }
      },
    };
  },
};
