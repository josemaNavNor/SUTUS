import { jest } from '@jest/globals';
import createRequest from '../../src/application/usecases/userUsecases/createRequest.mjs';

// Mock del repositorio de usuario
const mockUserRepository = {
  getNextFolio: jest.fn().mockResolvedValue({ folio: 123 })
};

describe('createRequest', () => {
  let createRequestInstance;

  beforeEach(() => {
    createRequestInstance = new createRequest(mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the next folio', async () => {
    const folio = await createRequestInstance.getNewFolio();
    console.log('Folio obtenido:', folio);
    expect(folio).toBe(123);
    expect(mockUserRepository.getNextFolio).toHaveBeenCalled();
  });
});




