//validateUpdateDataEmployee
import { body, validationResult } from 'express-validator';

const validateUpdateDataEmployee = [
    body("curp")
        .optional()
        .isLength({ min: 18, max: 18 })
        .withMessage("La CURP debe tener exactamente 18 caracteres"),

    body("correo")
        .optional()
        .isEmail()
        .withMessage("El correo no es válido")
        .custom((value) => {
            const validDomains = [
                "gmail.com",
                "hotmail.com",
                "outlook.com",
                "uniserra.edu.mx",
                "gmail.com.mx",
            ];
            const emailDomain = value.split("@")[1];
            if (!validDomains.includes(emailDomain)) {
                throw new Error(
                    `El correo debe ser de los siguientes dominios: ${validDomains.join(
                        ", "
                    )}`
                );
            }
            return true;
        }),

    body("fecha_ingreso_empresa")
        .optional()
        .isISO8601()
        .withMessage("La fecha de ingreso de la empresa debe ser una fecha válida en formato ISO 8601")
        .custom((value) => {
            console.log("Validating fecha_ingreso_empresa:", value);
            let year = new Date(value).getFullYear();
            if (year <= 2002) {
                throw new Error(
                    "La fecha de ingreso de la empresa debe ser posterior al 2002"
                );
            }

            // Validación adicional para verificar que la fecha no sea posterior al año actual
            let currentYear = new Date().getFullYear();
            if (new Date(value).getFullYear() > currentYear) {
                throw new Error(
                    "Formato de fecha no válido, no se puede agregar una fecha posterior al año actual"
                );
            }

            return true;
        }),

    body("fecha_ingreso_sindicato")
        .optional()
        .isISO8601()
        .withMessage("La fecha de ingreso al sindicato debe ser una fecha válida en formato ISO 8601")
        .custom((value) => {
            console.log("Validating fecha_ingreso_sindicato:", value);
            let year = new Date(value).getFullYear();
            if (year <= 2002) {
                throw new Error(
                    "La fecha de ingreso al sindicato debe ser posterior al 2002"
                );
            }

            // Validación adicional para verificar que la fecha no sea posterior al año actual
            let currentYear = new Date().getFullYear();
            if (new Date(value).getFullYear() > currentYear) {
                throw new Error(
                    "Formato de fecha no válido, no se puede agregar una fecha posterior al año actual"
                );
            }

            return true;
        }),

    body("fecha_nacimiento")
        .optional()
        .isISO8601()
        .withMessage("La fecha de nacimiento debe ser una fecha válida en formato ISO 8601")
        .custom((value) => {
            console.log("Validating fecha_nacimiento:", value);
            let today = new Date();
            let birthDate = new Date(value);
            let age = today.getFullYear() - birthDate.getFullYear();
            let monthDifference = today.getMonth() - birthDate.getMonth();
            if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }
            if (age < 18) {
                throw new Error("La persona debe ser mayor de edad (18 años o más)");
            }
            return true;
        }),

    body("estado")
        .optional()
        .trim()
        .toLowerCase()
        .isIn(["activo", "inactivo"])
        .withMessage('El estado debe ser "Activo" o "Inactivo".')
        .customSanitizer((value) => (value === "activo" ? 1 : 0)),

    body("dependientes")
        .optional()
        .trim()
        .isInt({ min: 0 })
        .withMessage("El campo dependientes debe ser un número entero.")
        .toInt(),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

export default validateUpdateDataEmployee;
