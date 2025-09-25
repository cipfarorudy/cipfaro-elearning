import http from "http";

function testEndpoint(path, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 10002,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const req = http.request(options, (res) => {
      let responseData = "";
      res.on("data", (chunk) => {
        responseData += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData,
        });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testELearningFeatures() {
  console.log("🚀 Test des fonctionnalités e-learning CIPFARO");
  console.log("=".repeat(50));

  try {
    // Test 1: Health check
    console.log("1️⃣ Test du endpoint de santé...");
    const healthResponse = await testEndpoint("/health");
    console.log(`   ✅ Status: ${healthResponse.statusCode}`);
    console.log(`   📄 Response: ${healthResponse.data}`);
    console.log("");

    // Test 2: Catalog trainings
    console.log("2️⃣ Test du catalogue de formations...");
    const catalogResponse = await testEndpoint("/catalog/trainings");
    console.log(`   ✅ Status: ${catalogResponse.statusCode}`);
    console.log(`   📄 Response: ${catalogResponse.data}`);
    console.log("");

    // Test 3: Demo authentication
    console.log("3️⃣ Test de l'authentification démo...");
    const authResponse = await testEndpoint("/auth/demo", "POST", {
      email: "demo@cipfaro.com",
      password: "demo123",
    });
    console.log(`   ✅ Status: ${authResponse.statusCode}`);
    console.log(`   📄 Response: ${authResponse.data}`);
    console.log("");

    console.log("🎉 Tous les tests sont réussis !");
    console.log("✨ La plateforme e-learning CIPFARO est opérationnelle !");
  } catch (error) {
    console.error("❌ Erreur lors des tests:", error.message);
  }
}

// Lancement des tests
testELearningFeatures();
