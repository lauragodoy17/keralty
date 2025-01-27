import React, { useState } from "react";
import { Button, Spinner } from "reactstrap";
import * as XLSX from "xlsx";

const BotonExcel = ({ getUsers }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = () => {
    setLoading(true);

    // Verificar si getUsers es un array y no está vacío
    if (!Array.isArray(getUsers) || getUsers.length === 0) {
      console.error("getUsers debe ser un array de objetos JSON válido.");
      setLoading(false);
      return;
    }

    const libro = XLSX.utils.book_new();
    const hoja = XLSX.utils.json_to_sheet(getUsers);
    XLSX.utils.book_append_sheet(libro, hoja, "getUsers");

    setTimeout(() => {
      XLSX.writeFile(libro, "reporte.xlsx");
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      {!loading ? (
        <Button color="success" onClick={handleDownload}>
          Excel Default
        </Button>
      ) : (
        <Button color="success" disabled>
          <Spinner size="sm">Loading...</Spinner>
          <span> Generando...</span>
        </Button>
      )}
    </>
  );
};

export default BotonExcel;

