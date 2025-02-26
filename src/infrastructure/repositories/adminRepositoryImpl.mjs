import pool from "../../infrastructure/database/db.mjs";
import adminRepository from "../../domain/repositories/adminRepository.mjs";

class adminRepositoryImpl extends adminRepository{
    async listRequests(){
        try{
            const query = `SELECT
                s.idsolicitudes_prestaciones,
                s.Id_usuario,
                CONCAT(e.nombre, ' ', e.primer_apellido, ' ', e.segundo_apellido) AS nombre_empleado,
                s.fecha_solicitud,
                s.estado,
                t.tipo_solicitud AS nombre_tipo_solicitud,
                s.documento_solicitado,
                s.archivo_adicional

                FROM 
                solicitudes_prestaciones s

                INNER JOIN 
                empleado e ON e.idempleado = s.Id_usuario
                
                INNER JOIN 
                tipo_de_solicitud t ON t.id_tipo_de_solicitud = s.Id_solicitud`;
            const [rows] = await pool.execute(query);
            return rows;
        }
        catch (error) {
            throw new Error(`Error al listar las solicitudes: ${error.message}`);
        }
    }

    async updateRequestStatus(idRequest, newState){
        try{
            const query = `UPDATE solicitudes_prestaciones 
                SET estado = ? 
                WHERE idsolicitudes_prestaciones = ?`;

            const [rows] = await pool.execute(query,[newState, idRequest]);
            if (rows.affectedRows === 0) {
                throw new Error(`No se encontró una solicitud con el ID ${idRequest} para actualizar.`);
            }
            return {
                success: true,
                message: `El estado de la solicitud con ID ${idRequest} se actualizó a '${newState}'.`
            };
        }
        catch(error){
            throw new Error(`Error al actualizar el estado de la solicitud: ${error.message}`);
        }
    }

    async eliminatedRequest(idRequest){
        try {
            const deleteRequestQuery = `DELETE FROM solicitudes_prestaciones WHERE idsolicitudes_prestaciones = ?`;
            const [Result] = await pool.execute(deleteRequestQuery, [idRequest]);

            if (Result.affectedRows === 0) {
                throw new Error("Solicitud no encontrada");
            }

            return { message: "Se elimino correctamente la solicitud" };
        } catch (error) {
            throw new Error(`Error al eliminar la solicitud: ${error.message}`);
        }
    }

    async assignUserRole(userId, roleId){
        try{
          const query = 'INSERT INTO roles_asignados (id_user, id_rol) VALUES (?, ?)';
          const [rows] = await pool.execute(query,[userId,roleId]);
    
          if (rows.affectedRows === 0) {
            throw new Error(`No se pudo asignar el rol al usuario con el ID ${userId}.`);
          }
          return {message: "Se asigno correctamente el rol al usuario"};
        }catch (error){
          throw new Error(`Error al asignar el rol de usuario: ${error.message}`);
        }
    }

}

export default adminRepositoryImpl;