class uploadFileRegulations{
    constructor(pythonExecutorService) {
        this.pythonExecutorService = pythonExecutorService;
    }

    async execute(scriptPath, filePath){
        if (!scriptPath || !filePath) {
            throw new Error('La ruta del script y del archivo son requeridas');
        }
        
        try{
            const labeledText  = await this.pythonExecutorService.executeScript(scriptPath, filePath);

            return labeledText;
        } catch (error){
            throw new Error(`Error al procesar el archivo: ${error.message}`);
        }
    }
}

export default uploadFileRegulations;