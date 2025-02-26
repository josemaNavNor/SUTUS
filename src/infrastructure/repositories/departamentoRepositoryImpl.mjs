import pool from "../database/db.mjs";
import departmentRepository from "../../domain/repositories/departmentRepository.mjs"

class departmentRepositoryImpl extends departmentRepository{
    async create(department){
        const[result] = await pool.query(
            'INSERT INTO departamento(nombre_departamento) VALUES (?)',
            [department.nombre_departamento]
        );
        return {message: "departamento creado exitosamente"};
    }

    async getDeparments(){
        try {
            const [results] = await pool.query(
                `SELECT * FROM departamento`
            );
            return results;
        } catch (error) {
            throw new Error(`Error al listar los empleados: ${error.message}`);
        }
    }

    async getDeparment(id){
        try {
            const query = `SELECT * FROM departamento WHERE id_departamento = ? LIMIT 1`;
            const [rows] = await pool.execute(query, [id]);

          if (rows.length === 0) {
            throw new Error("Departamento no encontrado");
          }

          return rows;
        } catch (error) {
          throw new Error(`Error al buscar el departamento ${id}: ${error.message}`);
        }
    }
}

export default departmentRepositoryImpl;