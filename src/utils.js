const fs = require('fs/promises');
const path = require("path");
const yaml = require('js-yaml');

/**
 * Load all recipes files
 * @param {*} dirPath 
 */
module.exports.loadRecipes = async (dirPath) => {
    console.log('Loading recipes...');

    // List files
    let recipesFiles;
    try {
        recipesFiles = await module.exports.listFilesRecursively(dirPath);
    } catch (error) {
        console.log(error);
        throw new Error("failed to list 'recipes' directory");
    }

    // Read files
    const recipesData = await Promise.all(recipesFiles.map(async filePath => {
        return fs.readFile(filePath, 'utf-8');
    }));

    // Parse Yaml
    const recipes = {};
    recipesData.forEach((recipeData, index) => {
        const filePath = `${recipesFiles[index]}`;
        if (!filePath.endsWith('.yml') && !filePath.endsWith('.yaml')) {
            console.warn(`${filePath}: not a .yml or .yaml file`);
            return;
        }

        // Parse
        try {
            recipes[filePath] = yaml.load(recipeData);
        } catch (error) {
            console.warn(`${filePath}: not a valid yaml file content`);
            return;
        }
    });

    console.log(`* Loaded ${Object.keys(recipes).length} recipes!`);
    return recipes;
}

/**
 * Generate index for given recipe data
 * @param {*} recipeData 
 */
module.exports.indexRecipe = (recipeData) => {
    const recipeIndex = {};

    // Name
    if (recipeData.name) {
        recipeIndex.name = recipeData.name;
    } else {
        throw new Error("missing 'name'");
    }

    // Category
    if (recipeData.category) {
        recipeIndex.category = recipeData.category;
    }

    // Type
    if (recipeData.type) {
        recipeIndex.type = recipeData.type;
    }

    // Difficulty
    if (recipeData.difficulty) {
        recipeIndex.difficulty = recipeData.difficulty;
    }

    // Pictures
    if (recipeData.pictures) {
        recipeIndex.pictures = recipeData.pictures;
    }

    // Durations
    if (recipeData.durations) {
        recipeIndex.durations = recipeData.durations;
    }

    // Ingredients
    if (recipeData.ingredients) {
        if (Array.isArray(recipeData.ingredients)) {
            recipeIndex.ingredients = recipeData.ingredients
                .map((ingredient, ingredientIndex) => {
                    if (ingredient.name) {
                        return ingredient.name;
                    } else {
                        throw new Error(`missing 'ingredients[${ingredientIndex}]' name`);
                    }
                });
        } else {
            throw new Error("'ingredients' should be an array");
        }
    }

    return recipeIndex;
}

/**
 * List recursively all directory files
 * @param {*} dirPath 
 * @param {*} arrayOfFiles 
 */
module.exports.listFilesRecursively = async (dirPath, arrayOfFiles = null) => {
    files = await fs.readdir(dirPath);
  
    arrayOfFiles = arrayOfFiles ?? [];
  
    await Promise.all(files.map(async (file) => {
        if ((await fs.stat(dirPath + "/" + file)).isDirectory()) {
            return module.exports.listFilesRecursively(dirPath + "/" + file, arrayOfFiles);
        } else {
            const ignoredFiles = ['.DS_Store'];
            if (!ignoredFiles.includes(file)) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }

            return Promise.resolve();
        }
    }));

    return arrayOfFiles;
}

/**
 * Write cookbook into file
 * @param {*} dirPath 
 * @param {*} cookbook 
 */
module.exports.writeCookbook = async (filePath, cookbook) => {
    const content = yaml.dump(cookbook);
    await fs.writeFile(filePath, content);
}
