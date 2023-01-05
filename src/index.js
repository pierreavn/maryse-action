const core = require('@actions/core');
const { loadRecipes, indexRecipe, writeCookbook } = require('./utils');

const ENV = {
    recipesDir: './recipes',
    recipesDirPrefix: 'recipes/',
    cookbookFile: './cookbook.yml',
};

/**
 * Maryse Action
 */
const main = async () => {
    const cookbook = { recipes: {} };

    const recipesData = await loadRecipes(ENV.recipesDir);

    console.log('Indexing recipes...');
    for (const recipePath in recipesData) {
        try {
            const shortRecipePath = recipePath.slice(ENV.recipesDirPrefix.length);
            cookbook.recipes[shortRecipePath] = indexRecipe(recipesData[recipePath]);
            console.log(` - ${shortRecipePath}`);
        } catch (error) {
            console.warn(`${recipePath}: not a valid Maryse recipe format (${error})`);
        }
    }

    console.log(`* Indexed ${Object.keys(cookbook.recipes).length} recipes!`);
    
    await writeCookbook(ENV.cookbookFile, cookbook);
}
  
main().catch(err => core.setFailed(err.message))
