import http from "http";
import app from "./index";

async function runTests() {
  console.log("=== TESTS AUTOMATISÉS API REST (TP 04) ===");
  const testPort = 3199;
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(testPort, () => resolve()));
  const baseUrl = `http://127.0.0.1:${testPort}`;

  let passed = 0;
  let failed = 0;

  async function check(desc: string, fn: () => Promise<boolean>) {
    try {
      const ok = await fn();
      if (ok) {
        console.log(`  ✓ ${desc}`);
        passed++;
      } else {
        console.error(`  ✗ ${desc}`);
        failed++;
      }
    } catch (err: any) {
      console.error(`  ✗ ${desc} (${err.message})`);
      failed++;
    }
  }

  // 1. Health check
  await check("GET /health renvoie un statut 200", async () => {
    const res = await fetch(`${baseUrl}/health`);
    return res.status === 200;
  });

  // 2. Pollutions: GET /api/pollutions
  await check("GET /api/pollutions renvoie un tableau", async () => {
    const res = await fetch(`${baseUrl}/api/pollutions`);
    const data = await res.json();
    return res.status === 200 && Array.isArray(data);
  });

  // 3. Pollutions: POST /api/pollutions
  let createdPollutionId = 0;
  await check("POST /api/pollutions crée une pollution", async () => {
    const res = await fetch(`${baseUrl}/api/pollutions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titre: "Pollution automatique test",
        type: "Air",
        lieu: "Zone test",
        date: "2026-11-05",
        description: "Description test auto"
      })
    });
    const data = await res.json();
    createdPollutionId = data?.id;
    return res.status === 201 && !!createdPollutionId;
  });

  // 4. Pollutions: GET /api/pollutions/:id
  await check("GET /api/pollutions/:id renvoie la pollution créée", async () => {
    const res = await fetch(`${baseUrl}/api/pollutions/${createdPollutionId}`);
    const data = await res.json();
    return res.status === 200 && data.id === createdPollutionId;
  });

  // 5. Pollutions: PUT /api/pollutions/:id
  await check("PUT /api/pollutions/:id met à jour la pollution", async () => {
    const res = await fetch(`${baseUrl}/api/pollutions/${createdPollutionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre: "Titre mis à jour" })
    });
    const data = await res.json();
    return res.status === 200 && data.titre === "Titre mis à jour";
  });

  // 6. Pollutions: DELETE /api/pollutions/:id
  await check("DELETE /api/pollutions/:id supprime la pollution", async () => {
    const res = await fetch(`${baseUrl}/api/pollutions/${createdPollutionId}`, {
      method: "DELETE"
    });
    return res.status === 200;
  });

  // 7. Users: GET /api/users
  await check("GET /api/users renvoie la liste des utilisateurs", async () => {
    const res = await fetch(`${baseUrl}/api/users`);
    const data = await res.json();
    return res.status === 200 && Array.isArray(data);
  });

  // 8. Users: POST /api/users
  const uniqueLogin = `ci_${Date.now()}`;
  let createdUserId = 0;
  await check("POST /api/users crée un nouvel utilisateur sécurisé", async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: uniqueLogin,
        password: "secretpassword123",
        nom: "Test",
        prenom: "Auto",
        email: `${uniqueLogin}@cnam.fr`
      })
    });
    const data = await res.json();
    createdUserId = data?.id;
    return res.status === 201 && data.password === undefined && !!createdUserId;
  });

  // 9. Users: POST /api/users/login
  await check("POST /api/users/login authentifie l'utilisateur", async () => {
    const res = await fetch(`${baseUrl}/api/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: uniqueLogin,
        password: "secretpassword123"
      })
    });
    const data = await res.json();
    return res.status === 200 && !!data.token;
  });

  // 10. Users: DELETE /api/users/:id
  await check("DELETE /api/users/:id supprime l'utilisateur de test", async () => {
    const res = await fetch(`${baseUrl}/api/users/${createdUserId}`, {
      method: "DELETE"
    });
    return res.status === 200;
  });

  server.close();

  console.log(`\nBilan : ${passed} passés, ${failed} échoués.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Erreur critique lors des tests:", err);
  process.exit(1);
});
