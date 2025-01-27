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
    const { id } = req.body;
    db.query('DELETE FROM registro WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar datos:', err);
            return res.status(500).json({ Error: "Error al eliminar datos" });
        } else {
            return res.status(200).json({ Status: "Success", message: "Usuario eliminado" });
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

app.post('/RegistrarSeleccion', (req, res) => {
    // Seleccionamos la tabla según el psicólogo elegido
    let tableName;
    switch (req.body.psicologos) {
        case 'TIBI':
            tableName = 'tibi'; // Asumiendo que esta tabla también existe
            break;
        case 'JESSI':
            tableName = 'jessi';
            break;
        case 'ROS':
            tableName = 'ros';
            break;
        case 'ALE DUQUE':
            tableName = 'ale';
            break;
        case 'ANDRE':
            tableName = 'andre';
            break;
        case 'ELE':
            tableName = 'ele';
            break;
        default:
            return res.status(400).json({ Error: "Psicólogo no válido" });
    }

    // Construimos la consulta SQL con la tabla seleccionada
    const sql = `INSERT INTO ${tableName} (fechaInicioProcesoAnalista, idRequisicion, fechaAsignacionConexionAuxOperativo, tipoIngreso, empresa, servicio, posicion, nuevoReingreso, ciudad, teletrabajo, fechaExpedicionCedula, cedula, nombreCandidato, cargo, correo, celular, tipoPlanta, tiempoContrato, fechaEnvioDocumentos, solicitudExamenMedico, fechaProgramacionExamenMedico, fechaConceptoExamenMedico, fechaProgramacionEstudioAYC, fechaConceptoEstudioSeguridad, fechaAsignacionAnalista, hojaVidaKeralty, cedulaPapel, infolaft, inhabilidades, certificadoBancario, certificadoEPS, certificadoPension, certificadoCesantias, certificadosLaborales, diplomaBachiller, actaBachiller, diplomaPregado, actaPregado, diplomaPosgrado, actaPosgrado, resolucionSecretariaSalud, tarjetaProfesional, rethus, violenciaSexual, gestionDuelo, ataquesQuimicos, donacionOrganos, tomaMuestrasCitologia, soporteVitalBasico, soporteVitalAvanzado, PALS, NALS, vacunasCovid, vacunasHepatitis, conceptoMedico, conceptoInformeFinal, sintesis, certificadoInduccion, cargaInhabilidades, observacionesAuxOperativo, fechaIngreso, estado) VALUES (?)`;


    const values = [
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






