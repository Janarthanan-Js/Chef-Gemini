export function IngredientsList(props){
    return (
        <section>
                <h2>Ingredients on hand:</h2>
                <ul className="ingredients-list" aria-live="polite">{props.ingredientslist}</ul>
                {props.ingredients.length>=4 && <div className="get-recipe-container">
                    <div>
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button className="get-recipe" onClick={props.getrecipe}>Get a recipe</button>
                </div>}
            </section>
    )
}