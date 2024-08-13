import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { json } from 'react-router-dom';

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
    user: 'laura',
    password: 'LauraGodoy17*',
    database: 'bdkeralty',
    port: '33065'
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "No estás autenticado" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token no válido" });
            } else {
                req.cedula = decoded.cedula;
                next();
            }
        });
    }
};
app.get('/', verifyUser, (req, res)=>{
    return res.json({Status: "Success", cedula: req.cedula});
})
app.post('/Registro', (req,res)=>{
    const sql= "INSERT INTO usuarios (cedula,email,contraseña) VALUES (?)";
    bcrypt.hash(req.body.contraseña.toString(),salt, (err, hash)=>{
        if (err) return res.json({Error: "Errror por hashing"});
        const values= [
            req.body.cedula,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (err, result)=>{
            if(err) return res.json({Error: "Inserting Data errror in server"});
            return res.json({Status: "Success"});
        })

    })
})

app.post('/Inicio', (req, res) => {
    const sql = 'SELECT * FROM usuarios WHERE email=?';
    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.json({ Error: "Error en el servidor" });
        if (data.length > 0) {
            bcrypt.compare(req.body.contraseña.toString(), data[0].contraseña, (err, response) => {
                if (err) return res.json({ Error: "Error al comparar contraseñas" });
                if (response) {
                    const cedula = data[0].cedula;
                    const token = jwt.sign({ cedula }, "jwt-secret-key", { expiresIn: '1d' });
                    res.cookie('token', token, { httpOnly: true });
                    return res.json({ Status: "Success", role: data[0].id_cargo }); 
                } else {
                    return res.json({ Error: "Contraseña incorrecta" });
                }
            });
        } else {
            return res.json({ Error: "El email no existe" });
        }
    });
});

app.post('/Registrar', (req, res) => {
    const sql = "INSERT INTO registro (auxiliarSeleccion, documento, nombreCompleto, fechaIngreso, fechaTerminacion, regional, empresa, cargo, posicion, tipoGasto, centroCosto, tipoPlanta, tipoIngreso, analistaSeleccion, estado) VALUES (?)";

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
            return res.status(500).json({ Error: "Inserting Data error in server" });
        }
        return res.status(201).json({ Status: "Success" });
    });
});

app.get('/Registrar', (req, res) => {
    db.query('SELECT * FROM registro', (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Error al obtener datos", details: err });
        } else {
            if (rows.length === 0) {
                return res.status(404).json({ error: "No se encontraron datos" });
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
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.post('/Eliminar', (req, res) => {
    const { id } = req.body;
    db.query('DELETE FROM registro WHERE id = ?', [id], (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.status(200).json({ Status: "Success", message: "Usuario eliminado" });
      }
    });
  });
  app.post('/Editar',(req,res)=>{
    const{id, documento, nombreCompleto, fechaIngreso,fechaTerminacion, regional,empresa,cargo,posicion,tipoGasto,centroCosto,tipoPlanta,analistaSeleccion,estado}=req.body
    const params=[documento, nombreCompleto, fechaIngreso,fechaTerminacion, regional,empresa,cargo,posicion,tipoGasto,centroCosto,tipoPlanta,analistaSeleccion,estado, id]
    db.query('UPDATE registro set documento=?, nombreCompleto=?, fechaIngreso=?, fechaTerminacion=?, regional=?,empresa=?, cargo=?, posicion=?, tipoGasto=?, centroCosto=?,tipoPlanta=?,  analistaSeleccion=?, estado=? WHERE id =? ', params, (err, result)=>{
        if (err){
            res.status(500),json(err);
        }else{
            res.status(200).json({ Status: "Success", message: "Usuario editado" });
        }
    })
  })


app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});




