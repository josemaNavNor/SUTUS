class Employee{
    constructor(id, usuario, nombre, primer_apellido, segundo_apellido, curp, entidad, domicilio, domicilio_empresa, correo, contraseña, fecha_ingreso_empresa, fecha_ingreso_sindicato, estado, dependientes, fecha_nacimiento, puesto, nivel_tabular, dedicacion){
        this.id = id;
        this.usuario = usuario;
        this.nombre = nombre;
        this.primer_apellido = primer_apellido;
        this.segundo_apellido = segundo_apellido;
        this.curp = curp;
        this.entidad = entidad;
        this.domicilio = domicilio;
        this.domicilio_empresa = domicilio_empresa;
        this.correo = correo;
        this.contraseña = contraseña;
        this.fecha_ingreso_empresa = fecha_ingreso_empresa;
        this.fecha_ingreso_sindicato = fecha_ingreso_sindicato;
        this.estado = estado;
        this.dependientes = dependientes;
        this.fecha_nacimiento = fecha_nacimiento;
        this.puesto = puesto;
        this.nivel_tabular = nivel_tabular;
        this.dedicacion = dedicacion;
    }
}
export default Employee;