const ts = require("typescript");
const tsutils = require("tsutils");

function isEnum(symbol, checker) {
  const isEnumSymbol = tsutils.isSymbolFlagSet(symbol, ts.SymbolFlags.Enum);

  const declarationSymbol = symbol.declarations?.[0]?.symbol;

  if (!declarationSymbol) {
    return false;
  }

  const declarationType = checker.getDeclaredTypeOfSymbol(declarationSymbol);
  const isDeclarationEnum = tsutils.isTypeFlagSet(
    declarationType,
    ts.TypeFlags.EnumLike
  );

  return isEnumSymbol || isDeclarationEnum;
}

function isImportedFromFoo(node, importedFromFoo) {
  if (node.parent.type !== "MemberExpression") {
    return importedFromFoo.includes(node.name);
  }

  let currentNode = node.parent.object;
  while (currentNode.type === "MemberExpression") {
    currentNode = currentNode.object;
  }

  return importedFromFoo.includes(currentNode.name);
}

module.exports = {
  create(context) {
    const importedFromFoo = [];

    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- this name comes from AST
      ImportDeclaration(node) {
        if (node.source.value.includes("/foo")) {
          importedFromFoo.push(...node.specifiers.map((s) => s.local.name));
        }
      },

      // eslint-disable-next-line @typescript-eslint/naming-convention -- this name comes from AST
      Identifier(node) {
        // If the Identifier is inside an import we don't check it as
        // even if it is an enum, it is fine.
        if (node.parent.type === "ImportSpecifier") {
          return;
        }

        const checker = context.parserServices.program.getTypeChecker();

        const symbol = checker.getSymbolAtLocation(
          context.parserServices.esTreeNodeToTSNodeMap.get(node)
        );

        // All enums have an associated symbol.
        // So if this Identifier does not, of if it is an EnumMember symbol,
        // we don't continue checking.
        if (
          !symbol ||
          tsutils.isSymbolFlagSet(symbol, ts.SymbolFlags.EnumMember)
        ) {
          return;
        }

        const isFollowedByDotToken =
          context.getSourceCode().text[node.range[1]] === ".";

        // If its followed by dot don't continue checking, as
        // even if this is an enum, it is fine.
        if (isFollowedByDotToken) {
          return;
        }

        if (
          isEnum(symbol, checker) &&
          isImportedFromFoo(node, importedFromFoo)
        ) {
          context.report({
            node,
            message:
              "Accessing the whole enum, rather than just one of its members, may lead to bugs.",
          });
        }
      },
    };
  },
};
