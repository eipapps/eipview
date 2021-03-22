import { format } from "date-fns";
import { formatDistanceToNow } from "date-fns";

function checkForm() {
    let valid = true;
    this.errors = [];
    if (!this.cedula) {
        this.errors.push("El numero de cedula es obligadorio.");
        valid = false;
    }
    if (this.cedula.length < 13) {
        this.errors.push("Le faltan digitos a tu cedula de identidad.");
        valid = false;
    }
    if (!this.phoneNumber) {
        this.errors.push("Necesitamos tu numero de telefono.");
        valid = false;
    }
    if (this.phoneNumber.length < 12) {
        this.errors.push("Le faltan digitos a tu numero telefonico.");
        valid = false;
    }
    if (!this.gender) {
        this.errors.push("especifica tu sexo.");
        valid = false;
    }
    if (!this.regionSelect && !this.region) {
        this.errors.push("tienes que seleccionar la region.");
        valid = false;
    }
    if (!this.provinceSelect && !this.province) {
        this.errors.push("tienes que seleccionar la provincia.");
        valid = false;
    }
    if (!this.center) {
        this.errors.push("tienes que seleccionar el centro.");
        valid = false;
    }
    if (!this.date) {
        this.errors.push("Falto tu fecha de Nacimiento.");
        valid = false;
    }
    return valid;
}


function onlyNumbersValidator(event) {
    const { key, keyCode } = event;
    if (
        !/^[0-9]+$/.test(key)
        && keyCode != Number.parseInt("08")
        && keyCode != Number.parseInt("09")
        && keyCode != Number.parseInt("39")
        && keyCode != Number.parseInt("37")
    ) {
        event.preventDefault();
    }
}

function dateFromNow(date){
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  function dateFormater(date) {
    return date ? format(new Date(date),"dd, MMM, yyyy") : "";
  }

export { checkForm, onlyNumbersValidator, dateFromNow, dateFormater }
