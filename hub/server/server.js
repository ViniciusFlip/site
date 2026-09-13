const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "online",
    servico: "Monitoramento"
  });
});

app.post("/api/acessos", (req, res) => {
  console.log("Novo acesso recebido:");
  console.log(req.body);

  res.json({
    sucesso: true
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});