import { body, validationResult } from "express-validator";

const validateEmployeeData = [
  // Validación de campos de texto
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("primer_apellido")
    .notEmpty()
    .withMessage("El primer apellido es obligatorio"),
  body("segundo_apellido")
    .notEmpty()
    .withMessage("El segundo apellido es obligatorio"),

  body("curp").notEmpty().withMessage("La curp es obligatoria"),

  // Validación de la CURP (18 caracteres)
  body("curp")
    .isLength({ min: 18, max: 18 })
    .withMessage("La CURP debe tener exactamente 18 caracteres"),

  body("correo").notEmpty().withMessage("El correo es obligatorio"),

  // Validación de correo (solo Gmail y Hotmail)
  body("correo")
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
  
  //Validación de la fecha de ingreso a la empresa
  body("fecha_ingreso_empresa")
    .notEmpty()
    .withMessage("La fecha de ingreso de la empresa es obligatoria"),
  body("fecha_ingreso_sindicato")
    .notEmpty()
    .withMessage("La fecha de ingreso al sindicato es obligatoria"),
  body("fecha_nacimiento")
    .notEmpty()
    .withMessage("La fecha de nacimiento es obligatoria"),

  body("fecha_ingreso_empresa")
    .isDate()
    .withMessage("La fecha de ingreso de la empresa debe ser una fecha válida")
    .custom((value) => {
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

  //Validación de la fecha de ingreso
  body("fecha_ingreso_sindicato")
    .isDate()
    .withMessage("La fecha de ingreso al sindicato debe ser una fecha válida")
    .custom((value) => {
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
    .isDate()
    .withMessage("La fecha de nacimiento debe ser una fecha válida")
    .custom((value) => {
      let today = new Date();
      let birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear(); // Cambié const por let
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

  // Validación de las fechas (deben ser tipo DATE)
  body("fecha_ingreso_empresa")
    .isDate()
    .withMessage("La fecha de ingreso de la empresa debe ser una fecha válida"),
  body("fecha_ingreso_sindicato")
    .isDate()
    .withMessage("La fecha de ingreso al sindicato debe ser una fecha válida"),
  body("fecha_nacimiento")
    .isDate()
    .withMessage("La fecha de nacimiento debe ser una fecha válida"),

  body("estado").notEmpty().withMessage("El estado es obligatorio"),

  body("estado")
    .trim()
    .toLowerCase()
    .isIn(["activo", "inactivo"])
    .withMessage('El estado debe ser "Activo" o "Inactivo".')
    .customSanitizer((value) => (value === "activo" ? 1 : 0)),

  body("dependientes")
    .notEmpty()
    .withMessage("Los dependientes son obligatorios")
    .trim()
    .isInt({ min: 0 })
    .withMessage("El campo dependientes debe ser un número entero.")
    .toInt(),

  // Validaciones para los demás campos
  body("entidad").notEmpty().withMessage("La entidad es obligatoria"),
  body("domicilio").notEmpty().withMessage("El domicilio es obligatorio"),
  body("domicilio_empresa")
    .notEmpty()
    .withMessage("El domicilio de la empresa es obligatorio"),
  body("puesto").notEmpty().withMessage("El puesto es obligatorio"),
  body("nivel_tabular")
    .notEmpty()
    .withMessage("El nivel tabular es obligatorio"),
  body("dedicacion").notEmpty().withMessage("La dedicación es obligatoria"),

  // Comprobamos si hay errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateEmployeeData;
