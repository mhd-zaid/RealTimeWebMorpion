import ValidationError from "../errors/ValidationError.js";

export default function validationErrorMiddleware(err, req, res, next) {
    if (err instanceof ValidationError) {
        return res.status(400).json({ success: false, message: "Erreur de validation", errors: err.errors});
    }else{
        next(err);
    }
}