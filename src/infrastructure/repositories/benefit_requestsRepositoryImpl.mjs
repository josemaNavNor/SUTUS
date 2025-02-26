import pool from "../database/db.mjs";
import benefitRequestsRepositorio from "../../domain/repositories/benefit_requestsRepository.mjs";

class benefitrequestsRepositoryImpl extends benefitRequestsRepositorio {
  async createbenefitRequest(benefitrequest) {
    const [result] = await pool.query(
      "INSERT INTO tipo_de_solicitud(tipo_solicitud) VALUES (?)",
      [benefitrequest.tipo_solicitud]
    );
    return { message: "Tipo de solicitud creada con exito" };
  }

  async listAllroles(){
    try {
        const [results] = await pool.query(
            `SELECT * FROM FROM tipo_de_solicitud`
        );
        return results;
    } catch (error) {
        throw new Error(`Error al listar los tipos de solicitudes: ${error.message}`);
    }
  }

  async getbenefitRequest(id) {
    try {
      const query = `SELECT * FROM tipo_de_solicitud WHERE id_tipo_de_solicitud = ? LIMIT 1`;
      const [rows] = await pool.execute(query, [id]);

      if (rows.length === 0) {
        throw new Error("Tipo de solicitd no encontrado");
      }

      return rows;
    } catch (error) {
      throw new Error(`Error al buscar el tipo de solicitud: ${error.message}`);
    }
  }
}
export default benefitrequestsRepositoryImpl;