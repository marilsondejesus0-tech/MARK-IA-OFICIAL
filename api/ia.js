export default async function handler(req, res) {
  try {
    const { texto } = await req.json?.() || req.body;

    if (!texto) {
      return res.status(400).json({ error: 'Texto não recebido' });
    }

    // Conecta a IA gratuita da Hugging Face
    const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: texto }),
    });

    const data = await response.json();
    const output = data?.[0]?.generated_text || "Sem resposta no momento.";

    res.status(200).json({ resposta: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno na IA" });
  }
}
