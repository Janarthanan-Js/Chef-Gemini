import { useState } from "react"
import { ClaudeRecipe } from "./clauderecipe.jsx"
import { IngredientsList } from "./ingredientslist.jsx"

import { getRecipeFromMistral } from "./ai.js"
export function Main(){
    const [ingredients,setIngredients]=useState([])

    const IngredientsLists=ingredients.map((ingredient)=>{
        return(
                <li key={ingredient}>{ingredient}</li>

        )
    })
    const [recipeShown,recipes]=useState("")
    async function getRecipe(){
        try {
            const RecipeMarkdown = await getRecipeFromMistral(ingredients)
            recipes(RecipeMarkdown)
        } catch (e) {
            recipes(`Error: ${e.message}`)
        }
    }
    function onsubmit(formData){
        const newIngredient=formData.get("ingredient")//input name used here as ingredient
        
        setIngredients(prevIngredients=>[...prevIngredients,newIngredient])
    }

    return(
        <main>
            <form className="add-ingredient-form" action={onsubmit}>
                <input aria-label="Add ingedient" type="text" placeholder="e.g.Oregano" name="ingredient"></input>
                <button>Add ingredient</button>
            </form>
            {ingredients.length >0 && 
            <IngredientsList 
            ingredients={ingredients} 
            ingredientslist={IngredientsLists}
            getrecipe={getRecipe}
            />}
            
            {recipeShown && <ClaudeRecipe recipe={recipeShown}/>}
            
        </main>
    )
}


