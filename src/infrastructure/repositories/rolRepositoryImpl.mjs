import pool from "../../infrastructure/database/db.mjs";
import rolRepository from "../../domain/repositories/rolRepository.mjs";

class rolRepositoryImpl extends rolRepository{
    async create(rol){
        try {
            const[result] = await pool.query(
                `INSERT INTO rol (rol) VALUES (?)`,
                [rol.rol]
            )
            if (result.length === 0) {
                throw new Error("No se pudo crear el rol");
            }
            return{ message: "Rol creado exitosamente"}
        } catch (error) {
            throw new Error(`Error al crear el rol: ${error.message}`);
        }
    }
    async getRoleById(roleId){
        try{
            const [rows] = await pool.query(
                'SELECT * FROM rol WHERE idrol = ? LIMIT 1',
                [roleId]
            );
            if (rows.length === 0) {
                throw new Error("Rol no encontrado");
            }
            return rows;
        }
        catch(error){
            throw new Error(`Error al obtener el rol con ID ${roleId}: ${error.message}`)
        }
    }

    async listAllroles(){
        try {
            const [results] = await pool.query(
                `SELECT * FROM rol`
            );
            return results;
        } catch (error) {
            throw new Error(`Error al listar todos los roles: ${error.message}`);
        }
    }
}

export default rolRepositoryImpl;