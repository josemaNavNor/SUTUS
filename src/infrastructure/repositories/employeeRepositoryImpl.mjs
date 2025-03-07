import pool from "../../infrastructure/database/db.mjs";
import EmployeeRepository from "../../domain/repositories/employeeRepository.mjs";

class employeeRepositoryImpl extends EmployeeRepository{
    async create(employee){
        console.log('Datos para crear empleado:', employee);
        try {
            const[result] = await pool.query(
                'INSERT INTO empleado(nombre, primer_apellido, segundo_apellido, curp, entidad, domicilio, domicilio_empresa, correo, contraseña, fecha_ingreso_empresa, fecha_ingreso_sindicato, estado, dependientes, fecha_nacimiento, puesto, nivelTabular, dedicacion) VALUES (?, ?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [employee.nombre, employee.primer_apellido, employee.segundo_apellido, employee.curp, employee.entidad, employee.domicilio, employee.domicilio_empresa, employee.correo, employee.contraseña, employee.fecha_ingreso_empresa, employee.fecha_ingreso_sindicato, employee.estado, employee.dependientes, employee.fecha_nacimiento, employee.puesto, employee.nivelTabular, employee.dedicacion]
            );
        return{
            id: result.insertId
        }
        } catch (error) {
            throw new Error(`Error al crear el empleado: ${error.message}`);
        }
    }

    async addEmployeeCommittee(userId, departamentoId, puesto){
        try{
            const query = 'INSERT INTO personal_comite (id_personalComite, id_departamento, puesto_sindicato) VALUES (?, ?, ?)';
            const [rows] = await pool.execute(query, [userId, departamentoId, puesto]);
            // const [result] = await pool.query(
            //     'INSERT INTO personal_comite (id_personalComite, id_departamento, puesto_sindicato) VALUES (?, ?, ?)',
            //     [userId, departamentoId, puesto]
            // );
            if (rows.affectedRows === 0) {
                throw new Error(`No se pudo agregar el usuario al commite ${userId}.`);
            }
            return {
                message: "Empleado agregado al comite exitosamente" 
            };
        }catch(error){
            throw new Error(`Error al agregar al empleado al comite: ${error.message}`);
        }
    }

    async getAllEmployees(){
        try{
            const query = `SELECT * FROM empleado`;
            const [rows] = await pool.execute(query);
            // const [results] = await pool.query(
            //     `SELECT * FROM empleado`
            // );
            return rows;
        }
        catch(error){
            throw new Error(`Error al listar todos los empleados: ${error.message}`);
        }
    }

    async getEmployeeById(id) {
        if (!id) {
            return Promise.reject(new Error("El ID del empleado es requerido"));
        }
    
        try {
            const query = `SELECT * FROM empleado WHERE idempleado = ?`;
            const [rows] = await pool.execute(query, [id]);
    
            if (!rows.length) {
                return Promise.reject(new Error(`Empleado con ID ${id} no encontrado`));
            }
    
            return rows[0]; // Retorna el primer empleado encontrado en lugar de un array
        } catch (error) {
            return Promise.reject(new Error(`Error al buscar el empleado ${id}: ${error.message}`));
        }
    }
    

    async update(id, updateData) {
        try {
            // Construir dinámicamente las columnas y valores a actualizar
            const keys = Object.keys(updateData);
            if (keys.length === 0) {
                throw new Error("No hay datos para actualizar");
            }
    
            // Se crea la parte del SET dinámicamente
            const setClause = keys.map((key) => `${key} = ?`).join(', ');
            const values = keys.map((key) => updateData[key]);
    
            // Agregar el ID al final de los valores
            values.push(id);
    
            const query = `UPDATE empleado SET ${setClause} WHERE idempleado = ?`;
            const [result] = await pool.execute(query, values);
    
            if (result.affectedRows === 0) {
                throw new Error("Empleado no encontrado o no se realizó ninguna actualización");
            }
    
            // Actualizar la tabla usuario si se proporciona correo o contraseña
            if (updateData.correo) {
                await pool.execute(`UPDATE usuario SET correo = ? WHERE idusuario = ?`, [updateData.correo, id]);
            }
    
            if (updateData.contraseña) {
                await pool.execute(`UPDATE usuario SET contraseña = ? WHERE idusuario = ?`, [updateData.contraseña, id]);
            }
    
            // Actualizar el estado en la tabla usuario si se proporciona
            if (updateData.estado) {
                await pool.execute(`UPDATE usuario SET estado = ? WHERE idusuario = ?`, [updateData.estado, id]);
            }
    
            return { message: "Empleado actualizado correctamente" };
        } catch (error) {
            throw new Error(`Error al actualizar el empleado: ${error.message}`);
        }
    }    

    async updatePass(id, password) {
        try {
            // Actualizar la contraseña en la tabla usuario
            const updateUserQuery = `UPDATE usuario SET contraseña = ? WHERE idusuario = ?`;
            const [userResult] = await pool.execute(updateUserQuery, [password, id]);
    
            if (userResult.affectedRows === 0) {
                throw new Error("Usuario no encontrado");
            }
    
            // Actualizar la contraseña en la tabla empleado
            const updateEmployeeQuery = `UPDATE empleado SET contraseña = ? WHERE idempleado = ?`;
            const [employeeResult] = await pool.execute(updateEmployeeQuery, [password, id]);
    
            if (employeeResult.affectedRows === 0) {
                throw new Error("Empleado no encontrado");
            }
    
            return {
                message: "Contraseña actualizada correctamente para el usuario y empleado",
            };
        } catch (error) {
            throw new Error(`Error al actualizar la contraseña: ${error.message}`);
        }
    }
    
    async updateEmail(id, email) {
        try {
            // Actualizar el correo en la tabla usuario
            const updateUserQuery = `UPDATE usuario SET correo = ? WHERE idusuario = ?`;
            const [userResult] = await pool.execute(updateUserQuery, [email, id]);
    
            if (userResult.affectedRows === 0) {
                throw new Error("Usuario no encontrado");
            }
    
            // Actualizar el correo en la tabla empleado
            const updateEmployeeQuery = `UPDATE empleado SET correo = ? WHERE idempleado = ?`;
            const [employeeResult] = await pool.execute(updateEmployeeQuery, [email, id]);
    
            if (employeeResult.affectedRows === 0) {
                throw new Error("Empleado no encontrado");
            }
    
            return {
                message: "Correo actualizado correctamente para el usuario y empleado",
            };
        } catch (error) {
            throw new Error(`Error al actualizar el correo: ${error.message}`);
        }
    }    
      

    async delete(id) {
        try {
            // Eliminar al empleado
            const deleteEmployeeQuery = `DELETE FROM empleado WHERE idempleado = ?`;
            const [employeeResult] = await pool.execute(deleteEmployeeQuery, [id]);
    
            if (employeeResult.affectedRows === 0) {
                throw new Error("Empleado no encontrado");
            }
            
            // // Eliminar el usuario asociado
            // const deleteUserQuery = `DELETE FROM usuario WHERE idusuario = ?`;
            // const [userResult] = await pool.execute(deleteUserQuery, [id]);
    
            // if (userResult.affectedRows === 0) {
            //     throw new Error("Usuario asociado no encontrado");
            // }
    
            return { message: "Empleado y usuario eliminados correctamente" };
        } catch (error) {
            throw new Error(`Error al eliminar el empleado y usuario: ${error.message}`);
        }
    }
}

export default employeeRepositoryImpl;