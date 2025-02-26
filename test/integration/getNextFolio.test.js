import UserRepositoryImpl from "../../src/infrastructure/repositories/userRepositoryImpl.mjs";
import pool from "../../src/infrastructure/database/db.mjs";

describe('getNextFolio (Integración con BD)', () => {
    let userRepository;

    beforeAll(() => {
        userRepository = new UserRepositoryImpl();
    });
  
    beforeEach(async () => {
      // Reinicia el valor antes de cada prueba
      await pool.execute('TRUNCATE TABLE numero_de_folio_solicitud');
      await pool.execute('INSERT INTO numero_de_folio_solicitud (numero_de_folio) VALUES (0)');
    });
  
    afterAll(async () => {
      // Puedes dejar los datos en la base o imprimir el estado para revisarlo manualmente
      const [rows] = await pool.execute('SELECT * FROM numero_de_folio_solicitud');
      console.log('Valores en la tabla:', rows);
      await pool.end();  // Cierra la conexión a la base de datos
    });
  
    it('debería retornar el folio siguiente correctamente', async () => {
      const result = await userRepository.getNextFolio();
      expect(result).toEqual({ folio: 1 });
    });
  
    it('debería retornar el siguiente folio consecutivo', async () => {
      await userRepository.getNextFolio();
      const secondFolio = await userRepository.getNextFolio();
      expect(secondFolio).toEqual({ folio: 2 });
    });
  
    it('debería lanzar un error si no se actualiza ningún folio', async () => {
      // Simula una situación donde no se actualiza el folio
      await pool.execute('DELETE FROM numero_de_folio_solicitud');
      await expect(userRepository.getNextFolio()).rejects.toThrow('No se pudo recuperar el folio de la solicitud que se esta intentando crear');
    });
});

