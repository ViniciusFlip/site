import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "../../firebase/config.js";


console.log("Serviço de usuários carregado");


async function carregarUsuarios() {

    const usersList =
        document.getElementById("usersList");

    if (!usersList) {
        console.error(
            "Elemento 'usersList' não encontrado."
        );
        return;
    }


    console.log(
        "Elemento 'usersList' encontrado."
    );


    usersList.innerHTML = "";


    try {

        // ===============================
        // BUSCA CONVERSATIONS
        // ===============================

        const snapshot =
            await getDocs(
                collection(db, "conversations")
            );


        // ===============================
        // LISTA USUÁRIOS
        // ===============================

        snapshot.forEach((document) => {

            const user =
                document.data();


            const name =
                user.name || "Sem nome";

            const email =
                user.email || "Sem email";

            const role =
                user.role || "client";

            const method =
                user.method || "visitor";


            const inicial =
                name
                    .charAt(0)
                    .toUpperCase();


            usersList.innerHTML += `

                <tr class="hover:bg-white/5 transition">

                    <!-- USUÁRIO -->

                    <td class="px-6 py-4">

                        <div class="flex items-center gap-3">

                            <div
                                class="w-10 h-10 rounded-xl
                                bg-[#5864be] text-white
                                flex items-center justify-center
                                font-semibold"
                            >
                                ${inicial}
                            </div>

                            <span class="font-medium">
                                ${name}
                            </span>

                        </div>

                    </td>


                    <!-- EMAIL -->

                    <td class="px-6 py-4 text-zinc-400">
                        ${email}
                    </td>


                    <!-- ROLE -->

                    <td class="px-6 py-4">

                        <span
                            class="
                            px-3 py-1
                            rounded-full
                            text-xs
                            ${role === "va"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-zinc-700 text-zinc-300"}
                            "
                        >
                            ${role}
                        </span>

                    </td>


                    <!-- MÉTODO -->

                    <td class="px-6 py-4 text-zinc-400">
                        ${method}
                    </td>


                    <!-- AÇÕES -->

                    <td class="px-6 py-4">

                        <div class="flex justify-end gap-2">

                            <button
                                class="
                                px-3 py-2
                                rounded-lg
                                bg-zinc-700
                                hover:bg-zinc-600
                                "
                            >
                                Editar
                            </button>


                            <button
                                class="
                                px-3 py-2
                                rounded-lg
                                bg-red-500/20
                                text-red-400
                                hover:bg-red-500/30
                                "
                            >
                                Banir
                            </button>

                        </div>

                    </td>

                </tr>

            `;

        });


    } catch (error) {

        console.error(
            "Erro ao carregar conversations:",
            error
        );

        usersList.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="px-6 py-8
                    text-center
                    text-red-400"
                >
                    Erro ao carregar usuários.
                </td>

            </tr>

        `;

    }

}


export {
    carregarUsuarios
};