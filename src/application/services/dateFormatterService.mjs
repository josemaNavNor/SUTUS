class DateFormatterService{
    formatdate(requests) {
        return requests.map((request) => {
            const date = new Date(request.fecha_solicitud);
            request.fecha_solicitud = `${date.toLocaleDateString('es-MX', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })} ${date.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            })}`;

            return request;
        });
    }
}

export default DateFormatterService;