import { NextFunction, Response, Request } from 'express';
import { Ingredient, Recipe } from '../models';
import { ErrorResponse } from '../utils';
import { Types } from 'mongoose';

export class IngredientController{
    // Fetch All Ingredients as an Array
    static async fetchAllIngredient(req: Request, res: Response, next: NextFunction) {
        const ingredients = await Ingredient.find({});
        res.status(200).json({success: true, data: ingredients, message: 'Fetched ingredients.'});
    }
    // Fetch a single Ingredient with _id
    static async fetchIngredient(req: Request, res: Response, next: NextFunction) {
        const ingredientId = req.params.ingredientId;
        const ingredient = await Ingredient.findOne({_id: ingredientId});
        if (!ingredient) {
            next(new ErrorResponse(`${'Ingredient with _id '}${ingredientId}${' not found.'}`, 404));
        }
        res.status(200).json({success: true, data: ingredient, message: 'Fetched ingredient'});
    }
    // Add a new Ingredient
    static async addIngredient(req: Request, res: Response, next: NextFunction) {
        const newIngredient = await Ingredient.create(req.body);
        res.status(201).json({success: true, data: newIngredient, message: 'Added ingredient.'});
    }
    // Update an Ingredient with _id
    static async updateIngredient(req: Request, res: Response, next: NextFunction) {
        const ingredientId = req.params.ingredientId;
        if(req.body.restockHistory && req.body.restockHistory.length > 0) {
            let updateArgs = {
                name: null,
                image: null,
                $push: {
                    restockHistory: req.body.restockHistory
                }
            };
            req.body.name ? updateArgs.name = req.body.name : delete updateArgs.name;
            req.body.image ? updateArgs.image = req.body.image : delete updateArgs.image;
            const ingredientRestock = await Ingredient.findOneAndUpdate({_id: ingredientId}, updateArgs, {new: true, runValidators: true});
            res.status(200).json({success: true, data: ingredientRestock, message: 'Updated and restocked ingredient.'});
        } else {
            const ingredient = await Ingredient.findOneAndUpdate({_id: ingredientId}, req.body, {new: true, runValidators: true});
            res.status(200).json({success: true, data: ingredient, message: 'Updated ingredient.'});
        }
    }
    // Remove an Ingredient with _id
    static async removeIngredient(req: Request, res: Response, next: NextFunction) {
        const ingredientId = req.params.ingredientId;
        const promise_array = [
            Recipe.updateMany({}, {$pull: {Ingredients: {_id: ingredientId}}}),
            Ingredient.findOneAndDelete({_id: ingredientId})
        ];
        const ingredient_removed = await Promise.all(promise_array);
        res.status(200).json({success: true, data: ingredient_removed[1], message: 'Ingredient removed'});
    }
}