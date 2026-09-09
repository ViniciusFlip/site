import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  auth,
  db
} from "../firebase/config.js";


const googleProvider = new GoogleAuthProvider();

const button =
  document.getElementById("continueWithGoogle");

const status =
  document.getElementById("loginStatus");


button.addEventListener("click", async () => {

  button.disabled = true;
  status.textContent = "Entrando...";


  try {

    // ===============================
    // GOOGLE LOGIN
    // ===============================

    const result =
      await signInWithPopup(
        auth,
        googleProvider
      );

    const user = result.user;


    // ===============================
    // BUSCA ADMIN
    // ===============================

    const adminRef =
      doc(
        db,
        "admins",
        user.uid
      );

    const adminSnap =
      await getDoc(adminRef);


    // ===============================
    // NÃO É ADMIN
    // ===============================

    if (!adminSnap.exists()) {

      status.textContent =
        "Acesso não autorizado.";

      await auth.signOut();

      button.disabled = false;

      return;
    }


    // ===============================
    // VERIFICA ROLE
    // ===============================

    const admin =
      adminSnap.data();


    if (admin.role !== "va") {

      status.textContent =
        "Acesso não autorizado.";

      await auth.signOut();

      button.disabled = false;

      return;
    }


    // ===============================
    // ACESSO AUTORIZADO
    // ===============================

    localStorage.setItem(
      "uid",
      user.uid
    );

    localStorage.setItem(
      "role",
      "va"
    );


    status.textContent =
      "Acesso autorizado.";


    window.location.href =
      "/hub/";


  } catch (error) {

    console.error(
      "Erro no login Google:",
      error
    );

    status.textContent =
      "Não foi possível entrar.";

    button.disabled = false;
  }

});