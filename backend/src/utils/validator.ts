import { ValidationChain, validationResult } from "express-validator";

export function validate(validations: ValidationChain[]) {
    return async (req, res, next) => {
        for (let validation of validations) {
            const result = await validation.run(req);
         
            if (!result.isEmpty()) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
        return next();
        }

        res.status(400).json({ errors: errors.array() });
    };
};