import { Document, model, Schema } from 'mongoose';
const RecipeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Property name missing from Recipe'],
        trim: true,
        maxlength: [200, 'Property name from Recipe cannot exceed 200 characters']
    },
    image: {
        type: String,
        required: [true, 'Property image missing from Recipe']
    },
    Ingredients: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Ingredient'
        },
        usedQuantity: {
            type: Number,
            min: 0
        }
    }],
    Recipes: [{
        _id: {
            type: Schema.Types.ObjectId,
            ref: 'Recipe'
        },
        usedQuantity: {
            type: Number,
            min: 0
        }
    }],
    restockHistory: [{
        quantity: {
            type: Number,
            required: [true, 'Property quantity missing from Recipe.restockHistory'],
            min: 0
        },
        unitCost: {
            type: Number,
            required: [true, 'Property unitCost missing from Recipe.restockHistory'],
            min: 0
        },            
    }]
}, { timestamps: true });
export interface IRecipe extends Document {
    name: string;
    Ingredients: Array<{
        _id: string,
        usedQuantity: number
    }>,
    Recipies: Array<{
        _id: string,
        usedQuantity: number
    }>,
    image: string;
    restockHistory: Array<{
        quantity: number,
        unitCost: number
    }>;
    createdAt: string;
    updatedAt: string;
}
export const Recipe = model<IRecipe>('Recipe', RecipeSchema);
// {
// 	_id:
// 	name: 
// 	image:
// 	Ingredients : [
// 		{
// 			_id:
// 			usedQuantity:
// }
// ],
// Recipes: [
// 	{
// 		_id: 
// 		usedQuantity: 
// }
// ],
// restockHistory: [
// 		{
// 			quantity:
// 			unitCost: 
// }
// ]

// }