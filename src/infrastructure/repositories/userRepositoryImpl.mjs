import pool from "../../infrastructure/database/db.mjs";
import UserRepository from "../../domain/repositories/userRepository.mjs";

class UserRepositoryImpl extends UserRepository {
  async createUser(user) {
    try {
      const [result] = await pool.query(
        "INSERT INTO usuario (username, contraseña, correo, estado, id_empleado) VALUES (?, ?, ?, ?)",
        [user.username, user.password, user.email, user.isActive, user.idempleado]
      );
      if (result.affectedRows === 0) {
        throw new Error("No se puedo crear el usuario");
      }
      const userId = result.insertId;

      const [roleResult] = await pool.query(
        "INSERT INTO roles_asignados (id_user, id_rol) VALUES (?, ?)",
        [userId, 2]
      );
  
      if (roleResult.affectedRows === 0) {
        throw new Error("No se pudo asignar el rol predeterminado al usuario");
      }

      return {
        message: "Empleado y cuenta de usuario creados exitosamente",
      };
    } catch (error) {
      throw new Error(`Error al crear la cuenta de usuario: ${error.message}`);
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
      const [employeeResult] = await pool.execute(updateEmployeeQuery, [password, id,]);

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
      // Actualizar la contraseña en la tabla usuario
      const updateUserQuery = `UPDATE usuario SET correo = ? WHERE idusuario = ?`;
      const [userResult] = await pool.execute(updateUserQuery, [email, id]);

      if (userResult.affectedRows === 0) {
        throw new Error("Usuario no encontrado");
      }

      // Actualizar la contraseña en la tabla empleado
      const updateEmployeeQuery = `UPDATE empleado SET correo = ? WHERE idempleado = ?`;
      const [employeeResult] = await pool.execute(updateEmployeeQuery, [email, id,]);

      if (employeeResult.affectedRows === 0) {
        throw new Error("Empleado no encontrado");
      }

      return {
        message: "Correo actualizado correctamente para el usuario y empleado",
      };
    } catch (error) {
      throw new Error(`Error al actualizar la contraseña: ${error.message}`);
    }
  }


  async getLastUserId() {
    try {
      const [rows] = await pool.query(
        "SELECT MAX(idusuario) as lastId FROM usuario"
      );
      return rows[0]?.lastId || null;
    } catch (error) {
      throw new Error(
        `Error obteniendo el último ID de usuario: ${error.message}`
      );
    }
  }

  async createRequest(userId, fecha_solicitud, estado, requestid, documento_solicitud, archivo_adicional) {
    try {
      // const [existingRequest] = await pool.query(
      //   `SELECT idsolicitudes_prestaciones 
      //   FROM solicitudes_prestaciones
      //   WHERE Id_usuario = ? AND Id_solicitud = ?`,
      //   [userId, requestid]
      // );

      // if (existingRequest.length > 0) {
      //   throw new Error(`Ya cuentas con una solicitud activa de este tipo.`);
      // }

      const [insertResult] = await pool.query(
        `INSERT INTO solicitudes_prestaciones 
                (Id_usuario, fecha_solicitud, estado, Id_solicitud, documento_solicitado, archivo_adicional) 
            VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, fecha_solicitud, estado, requestid, documento_solicitud, archivo_adicional]
      );

      // const solicitudId = insertResult.insertId;

      // if (insertResult.affectedRows === 0) {
      //   throw new Error("No se pudo crear la solicitud.");
      // }
      // const [result] = await pool.query(
      //   // 'SELECT e.nombre AS nombre_empleado, s.fecha_solicitud, s.estado, t.tipo_solicitud AS nombre_tipo_solicitud, s.documento_solicitud, s.archivo_adicional FROM solicitudes_prestaciones s INNER JOIN empleado e ON e.usuario = s.id_usuario  INNER JOIN tipo_de_solicitud t ON t.id_tipo_de_solicitud = s.Id_solicitud WHERE s.idsolicitudes_prestaciones = ?',
      //   `SELECT 
      //           e.nombre AS nombre_empleado, 
      //           s.fecha_solicitud, 
      //           s.estado, 
      //           t.tipo_solicitud AS nombre_tipo_solicitud, 
      //           s.documento_solicitado, 
      //           s.archivo_adicional 
      //       FROM 
      //           solicitudes_prestaciones s 
      //       INNER JOIN 
      //           empleado e ON e.usuario = s.Id_usuario
      //       INNER JOIN 
      //           tipo_de_solicitud t ON t.id_tipo_de_solicitud = s.Id_solicitud 
      //       WHERE 
      //           s.id_solicitud = ?`,
      //   [solicitudId]
      // );

      if (insertResult.length === 0) {
        throw new Error("No se pudo crear la solicitud, porque no llegaron los datos");
      }

      return{message: "Solicitud generada exitosamente"};
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const query = `SELECT u.idusuario, u.contraseña, r.rol, u.estado
         FROM roles_asignados ra
         INNER JOIN usuario u ON ra.id_user = u.idusuario
         INNER JOIN rol r ON ra.id_rol = r.idrol
         WHERE u.correo = ? LIMIT 1`;

      const [results] = await pool.query(query, [email]);

      if (results.length === 0) {
        throw new Error("correo incorrecto");
      }

      return results[0];
    } catch (error) {
      throw new Error(`Usuario no encontrado: ${error.message}`);
    }
  }

  async listRequestsByUser(id) {
    try {
      const query = `
        SELECT
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
          tipo_de_solicitud t ON t.id_tipo_de_solicitud = s.Id_solicitud
        WHERE 
          s.Id_usuario = ?`; // Usamos un marcador para parámetros
  
      // Ejecutar la consulta con el parámetro `id`
      const [rows] = await pool.execute(query, [id]);
      return rows;
    } catch (error) {
      throw new Error(`Error al listar las solicitudes: ${error.message}`);
    }
  }

  async updateRequestUser(idRequest, nuevoEstado, nuevoArchivo) {
    try {
      const query = `
        UPDATE solicitudes_prestaciones
        SET estado = ?, archivo_adicional = ?
        WHERE idsolicitudes_prestaciones = ?`;
  
      // Ejecutar la consulta con los parámetros proporcionados
      const [result] = await pool.execute(query, [nuevoEstado, nuevoArchivo, idRequest]);
  
      if (result.affectedRows === 0) {
        throw new Error("No se encontró una solicitud con el ID proporcionado.");
      }
  
      return {
        message: "Solicitud actualizada correctamente.",
      };
    } catch (error) {
      throw new Error(`Error al actualizar la solicitud: ${error.message}`);
    }
  }
  
  async getNextFolio(){
    try {
      const query = `UPDATE numero_de_folio_solicitud SET numero_de_folio = LAST_INSERT_ID(numero_de_folio + 1)`;
      const [result] = await pool.execute(query);

      if (result.affectedRows === 0) {
        throw new Error("No se pudo recuperar el folio de la solicitud que se esta intentando crear");
      }

      return{folio: result.insertId};
    } catch (error) {
      throw new Error(`Error al recuperar el folio de la solcitud: ${error.message}`);
    }
  }
}


export default UserRepositoryImpl;

