import * as Yup from "yup";

export const entrySchema = Yup.object().shape({
  title: Yup.string().required("Es obligatorio ingresar el título"),
  description: Yup.string().required("Es obligatorio ingresar la descripción"),
  type: Yup.string()
    .oneOf(
      ["Rotura de calle/vereda", "Iluminacion", "Acumulación de basura", "Otros"],
      "Tipo No Válido"
    )
    .required("Es obligatorio ingresar el tipo"),
});