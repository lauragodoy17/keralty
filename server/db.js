import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const salt = 10;
const port = 3080;
const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bdkeralty',
    port: '33065'
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ Error: "No estás autenticado" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.status(401).json({ Error: "Token no válido" });
            } else {
                req.cedula = decoded.cedula;
                next();
            }
        });
    }
};

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Success", cedula: req.cedula });
});

app.post('/Registro', (req, res) => {
    const sql = "INSERT INTO usuarios (cedula, email, contraseña) VALUES (?)";
    bcrypt.hash(req.body.contraseña.toString(), salt, (err, hash) => {
        if (err) return res.status(500).json({ Error: "Error al realizar el hashing" });
        const values = [
            req.body.cedula,
            req.body.email,
            hash
        ];
        db.query(sql, [values], (err, result) => {
            if (err) return res.status(500).json({ Error: "Error al insertar datos" });
            return res.status(201).json({ Status: "Success" });
        });
    });
});

app.get('/datos', (req, res) => {
    const { tabla } = req.query;

    if (!tabla) {
        return res.status(400).json({ Error: "El nombre de la tabla es requerido" });
    }

    // Verificar que el nombre de la tabla no tiene espacios no deseados
    console.log(`Nombre de la tabla solicitado: ${tabla}`);

    const sql = `SELECT * FROM ${mysql.escapeId(tabla)}`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({ Error: "Error al obtener datos", details: err });
        } else {
            return res.status(200).json({ Status: "Success", rows: rows });
        }
    });
});



app.post('/Inicio', (req, res) => {
    const sql = 'SELECT * FROM usuarios WHERE email=?';
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            console.log(err); 
            return res.status(500).json({ Error: "Error en el servidor" });
        }
        console.log(data); 

        if (data.length > 0) {
            bcrypt.compare(req.body.contraseña.toString(), data[0].contraseña, (err, response) => {
                if (err) {
                    console.log(err); // Agregado para imprimir errores al comparar contraseñas
                    return res.status(500).json({ Error: "Error al comparar contraseñas" });
                }
                if (response) {
                    const cedula = data[0].cedula;
                    const token = jwt.sign({ cedula }, "jwt-secret-key", { expiresIn: '1d' });
                    res.cookie('token', token, { httpOnly: true });
                    return res.status(200).json({ Status: "Success", role: data[0].id_cargo });
                } else {
                    return res.status(401).json({ Error: "Contraseña incorrecta" });
                }
            });
        } else {
            return res.status(404).json({ Error: "El email no existe" });
        }
    });
});


app.post('/Registrar', (req, res) => {
    const sql = "INSERT INTO julio_septiembre (auxiliarSeleccion, documento, nombreCompleto, fechaIngreso, fechaTerminacion, regional, empresa, cargo, posicion, tipoGasto, centroCosto, tipoPlanta, tipoIngreso, analistaSeleccion, estado) VALUES (?)";

    const values = [
        req.body.auxiliarSeleccion,
        req.body.documento,
        req.body.nombreCompleto,
        req.body.fechaIngreso,
        req.body.fechaTerminacion,
        req.body.regional,
        req.body.empresa,
        req.body.cargo,
        req.body.posicion,
        req.body.tipoGasto,
        req.body.centroCosto,
        req.body.tipoPlanta,
        req.body.tipoIngreso,
        req.body.analistaSeleccion,
        req.body.estado
    ];

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error al insertar datos:", err);
            return res.status(500).json({ Error: "Error al insertar datos" });
        }
        return res.status(201).json({ Status: "Success" });
    });
});



app.get('/Registrar', (req, res) => {
    db.query('SELECT * FROM registro', (err, rows) => {
        if (err) {
            console.error('Error en la base de datos:', err);
            return res.status(500).json({ Error: "Error al obtener datos", details: err });
        } else {
            if (rows.length === 0) {
                return res.status(404).json({ Error: "No se encontraron datos" });
            } else {
                return res.status(200).json({ Status: "Success", rows: rows });
            }
        }
    });
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

app.post('/Eliminar', (req, res) => {
    const { id, nombreTabla } = req.body;

    const tablasPermitidas = ['julio_septiembre', 'TIBI', 'JESSI', 'ROS', 'ALE', 'ANDRE', 'ELE', 'noviembre_diciembre_2023', 'enero_marzo_2024', 'abril_junio', 'LAURA_BELEÑO', 'ANA_CESPEDES', 'ANDREA_PENA', 'DAYANA_PINEDA', 'JUAN_NOVA', 'NINI_SILVA'];
    
    if (!tablasPermitidas.includes(nombreTabla)) {
        console.error('Tabla no permitida:', nombreTabla);
        return res.status(400).json({ Error: "Tabla no permitida" });
    }

    const query = `DELETE FROM ?? WHERE id = ?`;
    
    db.query(query, [nombreTabla, id], (err, result) => {
        if (err) {
            console.error('Error al eliminar datos:', err);
            return res.status(500).json({ Error: "Error al eliminar datos" });
        } else {
            return res.status(200).json({ Status: "Success", message: "Registro eliminado" });
        }
    });
});

app.post('/Editar', (req, res) => {
    const { 
        tabla, 
        id, 
        documento, 
        nombreCompleto, 
        fechaIngreso, 
        fechaTerminacion, 
        regional, 
        empresa, 
        cargo, 
        posicion, 
        tipoGasto, 
        centroCosto, 
        tipoPlanta, 
        analistaSeleccion, 
        estado
    } = req.body;

    if (!tabla || !id) {
        return res.status(400).json({ Error: "El nombre de la tabla y el ID son requeridos" });
    }

    const sql = `UPDATE \`${tabla}\` SET 
        documento=?, 
        nombreCompleto=?, 
        fechaIngreso=?, 
        fechaTerminacion=?, 
        regional=?, 
        empresa=?, 
        cargo=?, 
        posicion=?, 
        tipoGasto=?, 
        centroCosto=?, 
        tipoPlanta=?, 
        analistaSeleccion=?, 
        estado=?
        WHERE id=?`;

    const params = [
        documento, 
        nombreCompleto, 
        fechaIngreso, 
        fechaTerminacion, 
        regional, 
        empresa, 
        cargo, 
        posicion, 
        tipoGasto, 
        centroCosto, 
        tipoPlanta, 
        analistaSeleccion, 
        estado,
        id
    ];

    console.log('SQL:', sql);
    console.log('Parametros:', params);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al actualizar datos:', err);
            return res.status(500).json({ Error: "Error al actualizar datos", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "No se encontró el registro con el ID proporcionado" });
        }
        return res.status(200).json({ Status: "Success" });
    });
});




app.post('/EditarPersonal', (req, res) => {
    const { 
        tabla, 
        id, 
        fotocopiaDocumento,
        hojaVida,
        certificadosLaborales,
        fotocopiaTarjetaProfesional,
        diplomaActaBachiller,
        diplomaActaProfesional,
        diplomaActaEspecializacion,
        certificadoEstudios,
        certificadoEPS,
        fechaCertificadoEPS,
        certificadoFondoPensiones,
        fechaCertificadoFondoPensiones,
        certificadoFondoCesantias,
        fechaCertificadoFondoCesantias,
        certificadoCuentaBancaria,
        fechaCertificadoCuentaBancaria,
        tarjetaOtorgadaSecretariaSalud,
        resolucionSecretariaSalud,
        carnetVacunas
    } = req.body;

    if (!tabla || !id) {
        return res.status(400).json({ Error: "El nombre de la tabla y el ID son requeridos" });
    }

    const sql = `UPDATE \`${tabla}\` SET 
        fotocopiaDocumento=?,
        hojaVida=?,
        certificadosLaborales=?,
        fotocopiaTarjetaProfesional=?,
        diplomaActaBachiller=?,
        diplomaActaProfesional=?,
        diplomaActaEspecializacion=?,
        certificadoEstudios=?,
        certificadoEPS=?,
        fechaCertificadoEPS=?,
        certificadoFondoPensiones=?,
        fechaCertificadoFondoPensiones=?,
        certificadoFondoCesantias=?,
        fechaCertificadoFondoCesantias=?,
        certificadoCuentaBancaria=?,
        fechaCertificadoCuentaBancaria=?,
        tarjetaOtorgadaSecretariaSalud=?,
        resolucionSecretariaSalud=?,
        carnetVacunas=?
        WHERE id=?`;

    const params = [
        fotocopiaDocumento,
        hojaVida,
        certificadosLaborales,
        fotocopiaTarjetaProfesional,
        diplomaActaBachiller,
        diplomaActaProfesional,
        diplomaActaEspecializacion,
        certificadoEstudios,
        certificadoEPS,
        fechaCertificadoEPS,
        certificadoFondoPensiones,
        fechaCertificadoFondoPensiones,
        certificadoFondoCesantias,
        fechaCertificadoFondoCesantias,
        certificadoCuentaBancaria,
        fechaCertificadoCuentaBancaria,
        tarjetaOtorgadaSecretariaSalud,
        resolucionSecretariaSalud,
        carnetVacunas,
        id
    ];


    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al actualizar datos:', err);
            return res.status(500).json({ Error: "Error al actualizar datos", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "No se encontró el registro con el ID proporcionado" });
        }
        return res.status(200).json({ Status: "Success" });
    });
});
app.post('/EditarContratador', (req, res) => {
    const {
        tabla,
        id,
        fechaAsignacion,
        contratador,
        analistaSeleccion,
        auxiliarSeleccion,
        tipoDocumento,
        docTrabajador,
        nombreEmpleado,
        fechaIngreso,
        fechaTermina,
        nombreEmpresa,
        prioridad,
        nombreCargo,
        posicion,
        ciudades,
        regional,
        porcentajeSalario,
        salario,
        jornada,
        tipoPlanta,
        motivo,
        fuente,
        observacionSeleccion,
        responsableSeleccion,
        estado,
        telefono,
        correo,
        estadoCivil,
        fechaNacimiento,
        direccion,
        idIdentidad,
        clausulaAdicional,
        retefuente,
        gen,
        pa40EPS,
        pa40ARP,
        pa40AFP,
        pa40CCF,
        pa40AFC,
        fechaEntregaGestionDocumental,
        estadoProceso,
        causalDevolucion,
        fechaRevision,
        estadoRevision,
        revisadoEnviado,
        fechaContratoEnvioFirmar,
        contratoEnvioFirmar,
        fechaContratoRecibidoFirmado,
        contratoRecibidoFirmado,
        fechaClausulaEnvioFirmar,
        clausulaEnvioFirmar,
        fechaRecibidoClausulaFirmada,
        fechaPrimerSeguimiento,
        primerSeguimiento,
        fechaSegundoSegumiento,
        segundoSegumiento,
        envioInformeOnboarding,
        fechaPorletRepositorio,
        porletRepositorio,
        recuperadoPor,
        observacionRecuperacionContrato,
        inconsistenciaCuadro,
        tipoFirma,
        fechaRadicadoEPS,
        radicadoEPS,
        fechaRecibidoEPS,
        recibidoEPS,
        fechaRepositorio,
        repositorio,
        fechaPorlet,
        porlet,
        inconsistencia,
        fechaCambioEPS,
        cambioEPS,
        nuevaFechaIngresoEPS,
        fechaRadicadoARL,
        afiliacionARL,
        fechaRepositorio1,
        repositorio1,
        porlet1,
        inconsistencia1,
        fechaCambioARL,
        cambioARL,
        nuevaFechaIngresoARL,
        fechaRadicadoCCF,
        afiliacionCCF,
        fechaRecibidoCCF,
        recibidoCCF,
        fechaRepositorio2,
        repositorio2,
        fechaPorlet2,
        porlet2,
        inconsistencia2,
        fechaCambioCaja,
        cambioCaja,
        nuevaFechaIngresoCaja,
        afiliacionPensionesCesantias,
        fechaPorletRepositorio2,
        porletRepositorio2,
        erroresPA40Contratacion,
        inconsistenciaCuadro2
    } = req.body;

    if (!tabla || !id) {
        return res.status(400).json({ error: "El nombre de la tabla y el ID son requeridos" });
    }

    // Filtrar los campos dinámicos y preparar la consulta
    const fields = Object.keys(req.body).filter(key => key !== 'tabla' && key !== 'id');
    const updates = fields.map(field => `\`${field}\` = ?`).join(', ');
    
    // Crear la consulta SQL
    const sql = `UPDATE \`${tabla}\` SET ${updates} WHERE id = ?`;

    // Crear los parámetros para la consulta
    const params = fields.map(field => req.body[field]);
    params.push(id); // Añadir el ID al final de los parámetros

    // Ejecutar la consulta
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al actualizar datos:', err);
            return res.status(500).json({ error: "Error al actualizar datos", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No se encontró el registro con el ID proporcionado" });
        }
        return res.status(200).json({ status: "Success" });
    });
});



app.post('/EditarFormacion', (req, res) => {
    const { 
        tabla, 
        id, 
        copiaCertificadoSoporteVitalBasico,
        fechaVencimientoBLS,
        certificadoSoporteVitalAvanzadoVigente,
        fechaVencimientoACLS,
        cursoAtencionIntegralVictimasViolenciaGenero,
        cursoPALS,
        fechaVencimientoCursoPALS, 
        cursoNALS,
        fechaVencimientoCursoNALS,
        tomaMuestrasLaboratorio,
        cursoPrimerosAuxilios,
        cursoCamillero,
        induccionCorporativaKeralty,
        cursoManejoDuelo, 
        cursoVictimasAtaquesAgentesQuimicos,
        cursoDonacionOrganos
    } = req.body;

    if (!tabla || !id) {
        return res.status(400).json({ Error: "El nombre de la tabla y el ID son requeridos" });
    }

    const sql = `UPDATE \`${tabla}\` SET 
        copiaCertificadoSoporteVitalBasico=?,
        fechaVencimientoBLS=?,
        certificadoSoporteVitalAvanzadoVigente=?,
        fechaVencimientoACLS=?,
        cursoAtencionIntegralVictimasViolenciaGenero=?,
        cursoPALS=?,
        fechaVencimientoCursoPALS=?, 
        cursoNALS=?,
        fechaVencimientoCursoNALS=?,
        tomaMuestrasLaboratorio=?,
        cursoPrimerosAuxilios=?,
        cursoCamillero=?,
        induccionCorporativaKeralty=?,
        cursoManejoDuelo=?, 
        cursoVictimasAtaquesAgentesQuimicos=?,
        cursoDonacionOrganos=?
        WHERE id=?`;

    const params = [
        copiaCertificadoSoporteVitalBasico,
        fechaVencimientoBLS,
        certificadoSoporteVitalAvanzadoVigente,
        fechaVencimientoACLS,
        cursoAtencionIntegralVictimasViolenciaGenero,
        cursoPALS,
        fechaVencimientoCursoPALS, 
        cursoNALS,
        fechaVencimientoCursoNALS,
        tomaMuestrasLaboratorio,
        cursoPrimerosAuxilios,
        cursoCamillero,
        induccionCorporativaKeralty,
        cursoManejoDuelo, 
        cursoVictimasAtaquesAgentesQuimicos,
        cursoDonacionOrganos,
        id
    ];


    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al actualizar datos:', err);
            return res.status(500).json({ Error: "Error al actualizar datos", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "No se encontró el registro con el ID proporcionado" });
        }
        return res.status(200).json({ Status: "Success" });
    });
});

app.post('/EditarLaboral', (req, res) => {
    const { 
        tabla, 
        id, 
        aprobaciones,
        conflictoInteres,
        pruebasPsicotecnicas,
        entrevistaSeleccion,
        informeCorrelacionCargo,
        visitaDomiciliaria,
        cartaSeguridadSocial, 
        infolaft,
        fechaConsultaInfolaft,
        inhabilidades,
        fechaConsultaInhabilidades,
        consultaAprendizaje,
        cartaPresentacionInstitutoUniversidad,
        examenMedicoIngreso, 
        reporteCentralesRiesgo,
        rethus,
        informeFinalEstudioSeguridad,
        afiliacionARL,
        afiliacionCaja,
        afiliacionEPS,
        contratoFirmado,
        perfilCargoFirmado,
        prorroga,
        indefinido,
        polizaVida,
        sustitucionPatronal,
        clausulaAdicional
    } = req.body;

    if (!tabla || !id) {
        return res.status(400).json({ Error: "El nombre de la tabla y el ID son requeridos" });
    }

    const sql = `UPDATE \`${tabla}\` SET 
        aprobaciones=?,
        conflictoInteres=?,
        pruebasPsicotecnicas=?,
        entrevistaSeleccion=?,
        informeCorrelacionCargo=?,
        visitaDomiciliaria=?,
        cartaSeguridadSocial=?, 
        infolaft=?,
        fechaConsultaInfolaft=?,
        inhabilidades=?,
        fechaConsultaInhabilidades=?,
        consultaAprendizaje=?,
        cartaPresentacionInstitutoUniversidad=?,
        examenMedicoIngreso=?, 
        reporteCentralesRiesgo=?,
        rethus=?,
        informeFinalEstudioSeguridad=?,
        afiliacionARL=?,
        afiliacionCaja=?,
        afiliacionEPS=?,
        contratoFirmado=?,
        perfilCargoFirmado=?,
        prorroga=?,
        indefinido=?,
        polizaVida=?,
        sustitucionPatronal=?,
        clausulaAdicional=?
        WHERE id=?`;

    const params = [
        aprobaciones,
        conflictoInteres,
        pruebasPsicotecnicas,
        entrevistaSeleccion,
        informeCorrelacionCargo,
        visitaDomiciliaria,
        cartaSeguridadSocial, 
        infolaft,
        fechaConsultaInfolaft,
        inhabilidades,
        fechaConsultaInhabilidades,
        consultaAprendizaje,
        cartaPresentacionInstitutoUniversidad,
        examenMedicoIngreso, 
        reporteCentralesRiesgo,
        rethus,
        informeFinalEstudioSeguridad,
        afiliacionARL,
        afiliacionCaja,
        afiliacionEPS,
        contratoFirmado,
        perfilCargoFirmado,
        prorroga,
        indefinido,
        polizaVida,
        sustitucionPatronal,
        clausulaAdicional,
        id
    ]; 


    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al actualizar datos:', err);
            return res.status(500).json({ Error: "Error al actualizar datos", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "No se encontró el registro con el ID proporcionado" });
        }
        return res.status(200).json({ Status: "Success" });
    });
});

app.post('/EditarNomina', (req, res) => {
    const { 
        tabla, 
        id, 
        cartaPersonalRetirado,
        cartaExamenMedicoEgreso,
        cartaEntregaSoportesPagosSGSS,
        cartaRetiroCesantias,
        cartaAceptacionRenuncia,
        cartaFaseFinal,
        certificadoAporteTresMeses, 
        liquidacion,  
    } = req.body;

    if (!tabla || !id) {
        return res.status(400).json({ Error: "El nombre de la tabla y el ID son requeridos" });
    }

    const sql = `UPDATE \`${tabla}\` SET 
        cartaPersonalRetirado=?,
        cartaExamenMedicoEgreso=?,
        cartaEntregaSoportesPagosSGSS=?,
        cartaRetiroCesantias=?,
        cartaAceptacionRenuncia=?,
        cartaFaseFinal=?,
        certificadoAporteTresMeses=?, 
        liquidacion=?
        WHERE id=?`;

    const params = [
        cartaPersonalRetirado,
        cartaExamenMedicoEgreso,
        cartaEntregaSoportesPagosSGSS,
        cartaRetiroCesantias,
        cartaAceptacionRenuncia,
        cartaFaseFinal,
        certificadoAporteTresMeses, 
        liquidacion,  
        id
    ]; 


    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al actualizar datos:', err);
            return res.status(500).json({ Error: "Error al actualizar datos", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "No se encontró el registro con el ID proporcionado" });
        }
        return res.status(200).json({ Status: "Success" });
    });
});

app.post('/RegistrarGestion', (req, res) => {
    // Seleccionamos la tabla según el auxiliar operativo elegido
    let tableName;
    switch (req.body.auxiliares) {
        case 'ANA MARIA CESPEDES':
            tableName = 'ana_cespedes';
            break;
        case 'LAURA BELEÑO':
            tableName = 'laura_beleño';
            break;
        case 'JUAN ANDRES NOVA':
            tableName = 'juan_nova';
            break;
        case 'NINI JOHANA SILVA':
            tableName = 'nini_silva';
            break;
        case 'ANDREA PEÑA':
            tableName = 'andrea_pena';
            break;
        case 'DAYANA PINEDA':
            tableName = 'dayana_pineda';
            break;
        default:
            return res.status(400).json({ Error: "Auxiliar operativo no válido" });
    }

    // Construimos la consulta SQL con la tabla seleccionada
    const sql = `INSERT INTO ${tableName} (auxiliares, analista, fechaInicioProcesoAnalista, idRequisicion, fechaAsignacionCH, tipoProceso, empresa, nuevoReingreso, ciudad, fechaExpedicionCedula, cedula, nombreCandidato, cargo, correo, celular, tipoPlanta, tiempoContrato, fechaEnvioDocumentos, recepcionDocumentosCandidato, fechaProgramacionExamen, fechaConceptoExamen, fechaEnvioAYC, fechaConceptoEstudioSeguridad, fechaAsignacionAnalista, estado, novedadPendiente, induccion) VALUES (?)`;

    const values = [
        req.body.auxiliares, 
        req.body.analista,
        req.body.fechaInicioProcesoAnalista,
        req.body.idRequisicion,
        req.body.fechaAsignacionCH,
        req.body.tipoProceso,
        req.body.empresa,
        req.body.nuevoReingreso,
        req.body.ciudad,
        req.body.fechaExpedicionCedula,
        req.body.cedula,
        req.body.nombreCandidato,
        req.body.cargo,
        req.body.correo,
        req.body.celular,
        req.body.tipoPlanta,
        req.body.tiempoContrato,
        req.body.fechaEnvioDocumentos,
        req.body.recepcionDocumentosCandidato,
        req.body.fechaProgramacionExamen,
        req.body.fechaConceptoExamen,
        req.body.fechaEnvioAYC,
        req.body.fechaConceptoEstudioSeguridad,
        req.body.fechaAsignacionAnalista,
        req.body.estado,
        req.body.novedadPendiente,
        req.body.induccion
    ];

    // Ejecutamos la consulta
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error al insertar datos:", err);
            return res.status(500).json({ Error: "Error al insertar datos" });
        }
        return res.status(201).json({ Status: "Success" });
    });
});


app.post('/EditarPsicologos', (req, res) => {
    const { 
        tabla, 
        id, 
        fechaInicioProcesoAnalista,
        idRequisicion,
        fechaAsignacionConexionAuxOperativo,
        tipoIngreso,
        empresa,
        servicio,
        posicion,
        nuevoReingreso,
        ciudad,
        teletrabajo,
        fechaExpedicionCedula,
        cedula,
        nombreCandidato,
        cargo,
        correo,
        celular,
        tipoPlanta,
        tiempoContrato,
        fechaEnvioDocumentos,
        solicitudExamenMedico,
        fechaProgramacionExamenMedico,
        fechaConceptoExamenMedico,
        fechaProgramacionEstudioAYC,
        fechaConceptoEstudioSeguridad,
        fechaAsignacionAnalista,
        hojaVidaKeralty,
        cedulaPapel,
        infolaft,
        inhabilidades,
        certificadoBancario,
        certificadoEPS,
        certificadoPension,
        certificadoCesantias,
        certificadosLaborales,
        diplomaBachiller,
        actaBachiller,
        diplomaPregado,
        actaPregado,
        diplomaPosgrado,
        actaPosgrado,
        resolucionSecretariaSalud,
        tarjetaProfesional,
        rethus,
        violenciaSexual,
        gestionDuelo,
        ataquesQuimicos,
        donacionOrganos,
        tomaMuestrasCitologia,
        soporteVitalBasico,
        soporteVitalAvanzado,
        PALS,
        NALS,
        vacunasCovid,
        vacunasHepatitis,
        conceptoMedico,
        conceptoInformeFinal,
        sintesis,
        certificadoInduccion,
        cargaInhabilidades,
        observacionesAuxOperativo,
        fechaIngreso,
        estado
    } = req.body;

    if (!tabla || !id) {
        return res.status(400).json({ Error: "El nombre de la tabla y el ID son requeridos" });
    }

    const sql = `UPDATE \`${tabla}\` SET 
        fechaInicioProcesoAnalista=?,
        idRequisicion=?,
        fechaAsignacionConexionAuxOperativo=?,
        tipoIngreso=?,
        empresa=?,
        servicio=?,
        posicion=?,
        nuevoReingreso=?,
        ciudad=?,
        teletrabajo=?,
        fechaExpedicionCedula=?,
        cedula=?,
        nombreCandidato=?,
        cargo=?,
        correo=?,
        celular=?,
        tipoPlanta=?,
        tiempoContrato=?,
        fechaEnvioDocumentos=?,
        solicitudExamenMedico=?,
        fechaProgramacionExamenMedico=?,
        fechaConceptoExamenMedico=?,
        fechaProgramacionEstudioAYC=?,
        fechaConceptoEstudioSeguridad=?,
        fechaAsignacionAnalista=?,
        hojaVidaKeralty=?,
        cedulaPapel=?,
        infolaft=?,
        inhabilidades=?,
        certificadoBancario=?,
        certificadoEPS=?,
        certificadoPension=?,
        certificadoCesantias=?,
        certificadosLaborales=?,
        diplomaBachiller=?,
        actaBachiller=?,
        diplomaPregado=?,
        actaPregado=?,
        diplomaPosgrado=?,
        actaPosgrado=?,
        resolucionSecretariaSalud=?,
        tarjetaProfesional=?,
        rethus=?,
        violenciaSexual=?,
        gestionDuelo=?,
        ataquesQuimicos=?,
        donacionOrganos=?,
        tomaMuestrasCitologia=?,
        soporteVitalBasico=?,
        soporteVitalAvanzado=?,
        PALS=?,
        NALS=?,
        vacunasCovid=?,
        vacunasHepatitis=?,
        conceptoMedico=?,
        conceptoInformeFinal=?,
        sintesis=?,
        certificadoInduccion=?,
        cargaInhabilidades=?,
        observacionesAuxOperativo=?,
        fechaIngreso=?,
        estado=?
        WHERE id=?`;

    const params = [
        fechaInicioProcesoAnalista,
        idRequisicion,
        fechaAsignacionConexionAuxOperativo,
        tipoIngreso,
        empresa,
        servicio,
        posicion,
        nuevoReingreso,
        ciudad,
        teletrabajo,
        fechaExpedicionCedula,
        cedula,
        nombreCandidato,
        cargo,
        correo,
        celular,
        tipoPlanta,
        tiempoContrato,
        fechaEnvioDocumentos,
        solicitudExamenMedico,
        fechaProgramacionExamenMedico,
        fechaConceptoExamenMedico,
        fechaProgramacionEstudioAYC,
        fechaConceptoEstudioSeguridad,
        fechaAsignacionAnalista,
        hojaVidaKeralty,
        cedulaPapel,
        infolaft,
        inhabilidades,
        certificadoBancario,
        certificadoEPS,
        certificadoPension,
        certificadoCesantias,
        certificadosLaborales,
        diplomaBachiller,
        actaBachiller,
        diplomaPregado,
        actaPregado,
        diplomaPosgrado,
        actaPosgrado,
        resolucionSecretariaSalud,
        tarjetaProfesional,
        rethus,
        violenciaSexual,
        gestionDuelo,
        ataquesQuimicos,
        donacionOrganos,
        tomaMuestrasCitologia,
        soporteVitalBasico,
        soporteVitalAvanzado,
        PALS,
        NALS,
        vacunasCovid,
        vacunasHepatitis,
        conceptoMedico,
        conceptoInformeFinal,
        sintesis,
        certificadoInduccion,
        cargaInhabilidades,
        observacionesAuxOperativo,
        fechaIngreso,
        estado,
        id
    ];

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al actualizar datos:', err);
            return res.status(500).json({ Error: "Error al actualizar datos", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "No se encontró el registro con el ID proporcionado" });
        }
        return res.status(200).json({ Status: "Success" });
    });
});

app.post('/EditarGestion', (req, res) => {
    const { 
        tabla, 
        id, 
        auxiliares, // AUXILIAR OPERATIVO
        analista, // ANALISTA
        fechaInicioProcesoAnalista, // FECHA DE INICIO PROCESO ANALISTA
        idRequisicion, // ID
        fechaAsignacionCH, // FECHA ASIGNACION POR CH
        tipoProceso, // TIPO PROCESO MANUAL O CH
        empresa, // EMPRESA
        nuevoReingreso, // NUEVO O REINGRESO
        ciudad, // CIUDAD
        fechaExpedicionCedula, // FECHA EXPEDICION
        cedula, // CEDULA
        nombreCandidato, // NOMBRES CANDIDATOS
        cargo, // CARGO
        correo, // CORREO
        celular, // CELULAR
        tipoPlanta, // TIPO DE PLANTA
        tiempoContrato, // TIEMPO DE CONTRATO (Si es temporal)
        fechaEnvioDocumentos, // ENVIO DE SOLICITUD DE DOCUMENTOS O PASO POR CH AL CANDIDATO
        recepcionDocumentosCandidato, // RECEPCION DE DOCUMENTOS POR PARTE DEL CANDIDATO
        fechaProgramacionExamen, // PROGAMACION EXAMEN (Dia asistencia)
        fechaConceptoExamen, // FECHA CONCEPTO EXAMEN
        fechaEnvioAYC, // FECHA ENVIO AYC
        fechaConceptoEstudioSeguridad, // FECHA CONCEPTO ESTUDIO DE SEGURIDAD
        fechaAsignacionAnalista, // FECHA ASIGNACION ANALISTA
        estado, // ESTADO
        novedadPendiente, // NOVEDAD PENDIENTE
        induccion // INDUCCION
    } = req.body;

    // Validación inicial
    if (!tabla || !id) {
        return res.status(400).json({ Error: "El nombre de la tabla y el ID son requeridos" });
    }

    // Crear la consulta SQL para actualizar
    const sql = `UPDATE \`${tabla}\` SET 
        auxiliares=?,
        analista=?,
        fechaInicioProcesoAnalista=?,
        idRequisicion=?,
        fechaAsignacionCH=?,
        tipoProceso=?,
        empresa=?,
        nuevoReingreso=?,
        ciudad=?,
        fechaExpedicionCedula=?,
        cedula=?,
        nombreCandidato=?,
        cargo=?,
        correo=?,
        celular=?,
        tipoPlanta=?,
        tiempoContrato=?,
        fechaEnvioDocumentos=?,
        recepcionDocumentosCandidato=?,
        fechaProgramacionExamen=?,
        fechaConceptoExamen=?,
        fechaEnvioAYC=?,
        fechaConceptoEstudioSeguridad=?,
        fechaAsignacionAnalista=?,
        estado=?,
        novedadPendiente=?,
        induccion=?
        WHERE id=?`;

    // Parametros para la consulta SQL
    const params = [
        auxiliares,
        analista,
        fechaInicioProcesoAnalista,
        idRequisicion,
        fechaAsignacionCH,
        tipoProceso,
        empresa,
        nuevoReingreso,
        ciudad,
        fechaExpedicionCedula,
        cedula,
        nombreCandidato,
        cargo,
        correo,
        celular,
        tipoPlanta,
        tiempoContrato,
        fechaEnvioDocumentos,
        recepcionDocumentosCandidato,
        fechaProgramacionExamen,
        fechaConceptoExamen,
        fechaEnvioAYC,
        fechaConceptoEstudioSeguridad,
        fechaAsignacionAnalista,
        estado,
        novedadPendiente,
        induccion,
        id
    ];

    // Ejecutar la consulta SQL
    db.query(sql, params, (err, result) => {
        if (err) {
            console.error('Error al actualizar datos:', err);
            return res.status(500).json({ Error: "Error al actualizar datos", details: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ Error: "No se encontró el registro con el ID proporcionado" });
        }
        return res.status(200).json({ Status: "Success" });
    });
});


app.post('/RegistrarContratador', (req, res) => {
    // Seleccionamos la tabla según el período elegido
    let tableName;
    switch (req.body.periodo) {
        case 'JULIO':
            tableName = 'julio';
            break;
        case 'AGOSTO':
            tableName = 'agosto';
            break;
        case 'SEPTIEMBRE':
            tableName = 'septiembre';
            break;
        case 'OCTUBRE':
            tableName = 'octubre';
            break;
        case 'NOVIEMBRE':
            tableName = 'noviembre';
            break;
        default:
            return res.status(400).json({ Error: "Período no válido" });
    }

    // Verificamos si el período tiene campos adicionales
    const hasExtraFields = ['SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE'].includes(req.body.periodo);

    // Construimos la consulta SQL y los valores según los campos opcionales
    let sql = `INSERT INTO ${tableName} (
        fechaAsignacion, contratador, analistaSeleccion, auxiliarSeleccion, tipoDocumento, docTrabajador, nombreEmpleado,
        fechaIngreso, fechaTermina, nombreEmpresa, prioridad, nombreCargo, posicion, ciudades, regional, porcentajeSalario,
        salario, jornada, tipoPlanta, motivo, fuente, observacionSeleccion, responsableSeleccion, estado, telefono, correo,
        estadoCivil, fechaNacimiento, direccion, idIdentidad, clausulaAdicional, retefuente, gen, pa40EPS, pa40ARP, pa40AFP,
        pa40CCF, pa40AFC, fechaEntregaGestionDocumental, estadoProceso, causalDevolucion, fechaRevision, estadoRevision,
        revisadoEnviado, fechaContratoEnvioFirmar, contratoEnvioFirmar, fechaContratoRecibidoFirmado, contratoRecibidoFirmado,
        fechaClausulaEnvioFirmar, clausulaEnvioFirmar, fechaRecibidoClausulaFirmada, fechaPrimerSeguimiento, primerSeguimiento,
        fechaSegundoSeguimiento, segundoSeguimiento, envioInformeOnboarding, fechaPorletRepositorio, porletRepositorio,
        recuperadoPor, observacionRecuperacionContrato, inconsistenciaCuadro, tipoFirma`;

    // Agregamos campos adicionales si el período lo requiere
    if (hasExtraFields) {
        sql += `,
        fechaRadicadoEPS, radicadoEPS, fechaRecibidoEPS, recibidoEPS, fechaRepositorio, repositorio, fechaPorlet, porlet,
        inconsistencia, fechaCambioEPS, cambioEPS, nuevaFechaIngresoEPS, fechaRadicadoARL, afiliacionARL, fechaRepositorio1,
        repositorio1, porlet1, inconsistencia1, fechaCambioARL, cambioARL, nuevaFechaIngresoARL, fechaRadicadoCCF,
        afiliacionCCF, fechaRecibidoCCF, recibidoCCF, fechaRepositorio2, repositorio2, fechaPorlet2, porlet2, inconsistencia2,
        fechaCambioCaja, cambioCaja, nuevaFechaIngresoCaja, afiliacionPensionesCesantias, fechaPorletRepositorio2,
        porletRepositorio2, erroresPA40Contratacion, inconsistenciaCuadro2`;
    }

    sql += `) VALUES (?)`;

    // Construimos el array de valores
    const values = [
        req.body.fechaAsignacion, req.body.contratador, req.body.analistaSeleccion, req.body.auxiliarSeleccion,
        req.body.tipoDocumento, req.body.docTrabajador, req.body.nombreEmpleado, req.body.fechaIngreso, req.body.fechaTermina,
        req.body.nombreEmpresa, req.body.prioridad, req.body.nombreCargo, req.body.posicion, req.body.ciudades,
        req.body.regional, req.body.porcentajeSalario, req.body.salario, req.body.jornada, req.body.tipoPlanta, req.body.motivo,
        req.body.fuente, req.body.observacionSeleccion, req.body.responsableSeleccion, req.body.estado, req.body.telefono,
        req.body.correo, req.body.estadoCivil, req.body.fechaNacimiento, req.body.direccion, req.body.idIdentidad,
        req.body.clausulaAdicional, req.body.retefuente, req.body.gen, req.body.pa40EPS, req.body.pa40ARP, req.body.pa40AFP,
        req.body.pa40CCF, req.body.pa40AFC, req.body.fechaEntregaGestionDocumental, req.body.estadoProceso,
        req.body.causalDevolucion, req.body.fechaRevision, req.body.estadoRevision, req.body.revisadoEnviado,
        req.body.fechaContratoEnvioFirmar, req.body.contratoEnvioFirmar, req.body.fechaContratoRecibidoFirmado,
        req.body.contratoRecibidoFirmado, req.body.fechaClausulaEnvioFirmar, req.body.clausulaEnvioFirmar,
        req.body.fechaRecibidoClausulaFirmada, req.body.fechaPrimerSeguimiento, req.body.primerSeguimiento,
        req.body.fechaSegundoSeguimiento, req.body.segundoSeguimiento, req.body.envioInformeOnboarding,
        req.body.fechaPorletRepositorio, req.body.porletRepositorio, req.body.recuperadoPor,
        req.body.observacionRecuperacionContrato, req.body.inconsistenciaCuadro, req.body.tipoFirma
    ];

    // Añadimos los valores de los campos adicionales si es necesario
    if (hasExtraFields) {
        values.push(
            req.body.fechaRadicadoEPS, req.body.radicadoEPS, req.body.fechaRecibidoEPS, req.body.recibidoEPS,
            req.body.fechaRepositorio, req.body.repositorio, req.body.fechaPorlet, req.body.porlet, req.body.inconsistencia,
            req.body.fechaCambioEPS, req.body.cambioEPS, req.body.nuevaFechaIngresoEPS, req.body.fechaRadicadoARL,
            req.body.afiliacionARL, req.body.fechaRepositorio1, req.body.repositorio1, req.body.porlet1, req.body.inconsistencia1,
            req.body.fechaCambioARL, req.body.cambioARL, req.body.nuevaFechaIngresoARL, req.body.fechaRadicadoCCF,
            req.body.afiliacionCCF, req.body.fechaRecibidoCCF, req.body.recibidoCCF, req.body.fechaRepositorio2,
            req.body.repositorio2, req.body.fechaPorlet2, req.body.porlet2, req.body.inconsistencia2, req.body.fechaCambioCaja,
            req.body.cambioCaja, req.body.nuevaFechaIngresoCaja, req.body.afiliacionPensionesCesantias, req.body.fechaPorletRepositorio2,
            req.body.porletRepositorio2, req.body.erroresPA40Contratacion, req.body.inconsistenciaCuadro2
        );
    }

    // Ejecutamos la consulta
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error al insertar datos:", err);
            return res.status(500).json({ Error: "Error al insertar datos" });
        }
        return res.status(201).json({ Status: "Success" });
    });
});



app.post('/RegistrarSeleccion', (req, res) => {
    // Seleccionamos la tabla según el auxiliar operativo elegido
    let tableName;
    switch (req.body.psicologos) {
        case 'TIBI':
            tableName = 'tibi';
            break;
        case 'JESSI':
            tableName = 'jessi';
            break;
        case 'ROS':
            tableName = 'ros';
            break;
        case 'ALE DUQUE':
            tableName = 'ale_duque';
            break;
        case 'ANDRE':
            tableName = 'andre';
            break;
        case 'ELE':
            tableName = 'ele';
            break;
        default:
            return res.status(400).json({ Error: "psicologo  no válido" });
    }

    // Construimos la consulta SQL con la tabla seleccionada
    const sql = `INSERT INTO ${tableName} (
        fechaInicioProcesoAnalista, 
        idRequisicion, 
        fechaAsignacionConexionAuxOperativo, 
        tipoIngreso, 
        empresa, 
        servicio, 
        posicion, 
        nuevoReingreso, 
        ciudad, 
        teletrabajo, 
        fechaExpedicionCedula, 
        cedula, 
        nombreCandidato, 
        cargo, 
        correo, 
        celular, 
        tipoPlanta, 
        tiempoContrato, 
        fechaEnvioDocumentos, 
        solicitudExamenMedico, 
        fechaProgramacionExamenMedico, 
        fechaConceptoExamenMedico, 
        fechaProgramacionEstudioAYC, 
        fechaConceptoEstudioSeguridad, 
        fechaAsignacionAnalista, 
        hojaVidaKeralty, 
        cedulaPapel, 
        infolaft, 
        inhabilidades, 
        certificadoBancario, 
        certificadoEPS, 
        certificadoPension, 
        certificadoCesantias, 
        certificadosLaborales, 
        diplomaBachiller, 
        actaBachiller, 
        diplomaPregado, 
        actaPregado, 
        diplomaPosgrado, 
        actaPosgrado, 
        resolucionSecretariaSalud, 
        tarjetaProfesional, 
        rethus, 
        violenciaSexual, 
        gestionDuelo, 
        ataquesQuimicos, 
        donacionOrganos, 
        tomaMuestrasCitologia, 
        soporteVitalBasico, 
        soporteVitalAvanzado, 
        PALS, 
        NALS, 
        vacunasCovid, 
        vacunasHepatitis, 
        conceptoMedico, 
        conceptoInformeFinal, 
        sintesis, 
        certificadoInduccion, 
        cargaInhabilidades, 
        observacionesAuxOperativo, 
        fechaIngreso, 
        estado
    ) VALUES (?)`;

    const values = [
 // Este campo debe ser proporcionado también en el cuerpo de la solicitud.
        req.body.fechaInicioProcesoAnalista,
        req.body.idRequisicion,
        req.body.fechaAsignacionConexionAuxOperativo,
        req.body.tipoIngreso,
        req.body.empresa,
        req.body.servicio,
        req.body.posicion,
        req.body.nuevoReingreso,
        req.body.ciudad,
        req.body.teletrabajo,
        req.body.fechaExpedicionCedula,
        req.body.cedula,
        req.body.nombreCandidato,
        req.body.cargo,
        req.body.correo,
        req.body.celular,
        req.body.tipoPlanta,
        req.body.tiempoContrato,
        req.body.fechaEnvioDocumentos,
        req.body.solicitudExamenMedico,
        req.body.fechaProgramacionExamenMedico,
        req.body.fechaConceptoExamenMedico,
        req.body.fechaProgramacionEstudioAYC,
        req.body.fechaConceptoEstudioSeguridad,
        req.body.fechaAsignacionAnalista,
        req.body.hojaVidaKeralty,
        req.body.cedulaPapel,
        req.body.infolaft,
        req.body.inhabilidades,
        req.body.certificadoBancario,
        req.body.certificadoEPS,
        req.body.certificadoPension,
        req.body.certificadoCesantias,
        req.body.certificadosLaborales,
        req.body.diplomaBachiller,
        req.body.actaBachiller,
        req.body.diplomaPregado,
        req.body.actaPregado,
        req.body.diplomaPosgrado,
        req.body.actaPosgrado,
        req.body.resolucionSecretariaSalud,
        req.body.tarjetaProfesional,
        req.body.rethus,
        req.body.violenciaSexual,
        req.body.gestionDuelo,
        req.body.ataquesQuimicos,
        req.body.donacionOrganos,
        req.body.tomaMuestrasCitologia,
        req.body.soporteVitalBasico,
        req.body.soporteVitalAvanzado,
        req.body.PALS,
        req.body.NALS,
        req.body.vacunasCovid,
        req.body.vacunasHepatitis,
        req.body.conceptoMedico,
        req.body.conceptoInformeFinal,
        req.body.sintesis,
        req.body.certificadoInduccion,
        req.body.cargaInhabilidades,
        req.body.observacionesAuxOperativo,
        req.body.fechaIngreso,
        req.body.estado
    ];

    // Ejecutamos la consulta
    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error("Error al insertar datos:", err);
            return res.status(500).json({ Error: "Error al insertar datos" });
        }
        return res.status(201).json({ Status: "Success" });
    });
});




app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});






