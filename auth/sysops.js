import {
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  auth,
  db
} from "../firebase/config.js";

const googleProvider = new GoogleAuthProvider();

const button = document.getElementById("continueWithGoogle");
const status = document.getElementById("loginStatus");

button.addEventListener("click", async () => {

  button.disabled = true;
  status.textContent = "Entrando...";

  try {

    // LOGIN GOOGLE
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const user = result.user;

    // DOCUMENTO DO USUÁRIO
    const userRef = doc(
      db,
      "usuarios",
      user.uid
    );

    const userSnap = await getDoc(userRef);

    // USUÁRIO AINDA NÃO CADASTRADO
    if (!userSnap.exists()) {

      await setDoc(userRef, {
        uid: user.uid,
        nome: user.displayName || "",
        email: user.email || "",
        role: "cliente",
        criadoEm: serverTimestamp()
      });

      status.textContent =
        "Sua conta foi criada, mas você não tem acesso ao Hub.";

      await auth.signOut();

      button.disabled = false;

      return;
    }

    // DADOS DO USUÁRIO
    const dados = userSnap.data();

    // SOMENTE ROLE VA
    if (dados.role !== "va") {

      status.textContent =
        "Acesso não autorizado.";

      await auth.signOut();

      button.disabled = false;

      return;
    }

    // ADMIN AUTORIZADO
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

    window.location.href = "/hub/";

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