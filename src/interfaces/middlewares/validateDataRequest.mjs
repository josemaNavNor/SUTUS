export function validateDataRequest(req, res,next){
    const {userId, fecha_solicitud, estado, requestid, documento_solicitud, archivo_adicional} = req.body;

    // if(isNaN(userId) || !(fecha_solicitud instanceof Date) || isNaN(fecha_solicitud)){
    //     return res.status(400).json({ message: 'los datos no son validos' });
    // }

    if(isNaN(userId) || isNaN(requestid)){
        req.body.userId = parseInt(userId, 10);
        req.body.requestid = parseInt(requestid, 10);
    }
    if(typeof estado !== 'string' || typeof documento_solicitud !== 'string' || typeof archivo_adicional !== 'string'){
        req.estado = String(estado);
        req.documento_solicitud = String(documento_solicitud);
        req.archivo_adicional = String(archivo_adicional);
    }
    if(!(fecha_solicitud instanceof Date) || isNaN(fecha_solicitud)){
        req.fecha_solicitud = new Date(fecha_solicitud);
    }

    next();
    
}