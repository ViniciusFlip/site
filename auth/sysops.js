import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  query,
  where,
  getDocs
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

    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const user = result.user;


    // ===============================
    // BUSCA USUÁRIO NO CONVERSATIONS
    // ===============================

    const conversationsRef =
      collection(db, "conversations");

    const q = query(
      conversationsRef,
      where("uid", "==", user.uid),
      where("role", "==", "va")
    );

    const snapshot =
      await getDocs(q);


    // ===============================
    // NÃO AUTORIZADO
    // ===============================

    if (snapshot.empty) {

      status.textContent =
        "Acesso não autorizado.";

      await signOut(auth);

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