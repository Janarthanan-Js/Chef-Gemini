import ReactMarkdown from "react-markdown"

export function ClaudeRecipe(props){
    return(
        <section className="suggested-recipe-container">
            <h2>Chef Gemini Recommends:</h2>
            <ReactMarkdown>{props.recipe}</ReactMarkdown>    
        </section>

    )
}