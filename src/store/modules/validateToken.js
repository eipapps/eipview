import axios from "axios";
import { auth } from "firebase/app";
import { async } from "q";
// validate token and set validated global
const validateToken = async () => {
  try {
    const response = await axios.get(
      `https://script.google.com/macros/s/AKfycbzozLeg_FPF61v-MyvmbdBgPkcUcREzQB4PFJSGX7mDkYVzOw9E/exec?email=${
        auth().currentUser.email
      }&&token=${getToken("sessionToken")}&&role=${getToken("sessionRole")}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
// get token from local cookies
const getToken = name => {
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
};

export default validateToken;