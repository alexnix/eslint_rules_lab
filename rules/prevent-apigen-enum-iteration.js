const {Project, Node} = require("ts-morph");

const project = new Project({
    tsConfigFilePath: "./tsconfig.json",
});

const shouldCheckNode = (node) => {
    if(!node.getSymbol()) return;
    
    const firstDeclaration = node.getSymbol().getDeclarations()[0];
    const isEnum = 
        project.getTypeChecker().getDeclaredTypeOfSymbol(node.getSymbol()).isEnum() ||
        Node.isEnumDeclaration(firstDeclaration);
    return isEnum && 
        // don't false positive an enum declaration it self
        !Node.isEnumDeclaration(node) && 
        // of the name of the enum, within the enum declaration
        !Node.isEnumDeclaration(node.getParent()) && 
        // don't false positive an enum import
        !Node.isNamedImports(node.getParent()) &&
        !Node.isImportSpecifier(node.getParent());
}

module.exports = {
    create(context) {

        const problems = [];

        return {
            // Program() {
            //     const file = project.getSourceFiles().find(f => f.getFilePath() === context.getPhysicalFilename());
            //     if(file) {
            //         file.forEachDescendant(node => {
            //             if(shouldCheckNode(node) && !shouldCheckNode(node.getParent())) {
            //                 const followedByDotToken = node.getNextSibling()?.getKindName() === "DotToken";
            //                 if(!followedByDotToken) {
            //                     problems.push(node.getPos());
            //                 }
            //             }
            //         })
            //     }
            // },

            // Identifier(node) {
            //     // console.log(node.symbol)
            //     if(problems.includes(node.range[0])) {
            //         context.report({
            //             node, 
            //             message: "Bad usage of enum"
            //         })
            //     }
            // }
        }
    }
}