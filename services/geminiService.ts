import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AnalysisResult, ViralCampaign, CompetitorAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
let chat: Chat | null = null;

export const startChat = () => {
    chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `Você é M.A.R.K., um mentor de marketing de elite, funcionando como uma agência de ponta. Sua linguagem é de um 'personal trainer' de marketing: direto, estratégico, empático e motivador. Você usa dados de estudos (Meta, Google), estatísticas e tendências de mercado para dar conselhos práticos e acionáveis. Evite respostas genéricas. Aja como um consultor 24/7.`,
        },
    });
};

export const sendMessageToMentor = async (message: string): Promise<string> => {
    if (!chat) {
        startChat();
    }
    try {
        const response = await (chat as Chat).sendMessage({ message });
        return response.text;
    } catch (error) {
        console.error("Error sending chat message:", error);
        return "Ocorreu um erro ao conectar com o mentor. Por favor, tente novamente.";
    }
};

export const generateDashboardInsight = async (): Promise<string> => {
    try {
        const metrics = ['Taxa de Engajamento (TE)', 'Alcance', 'Crescimento de Seguidores', 'CTR (Click-Through Rate)'];
        const metric = metrics[Math.floor(Math.random() * metrics.length)];

        const prompt = `
        Act as M.A.R.K., a world-class marketing AI. Generate a daily strategic summary for a marketing dashboard in Portuguese. 
        The 'Metric in Focus' today is '${metric}'. Provide a target, the current trend (simulating data from Google Trends or Reddit), and a single, actionable 'Action of the Day'. 
        Keep it concise, strategic, and motivational.
        Format it EXACTLY like this, without any extra markdown:
        
        🚀 PAINEL DE CONTROLE M.A.R.K. – Resumo Estratégico 🚀

        📊 Métrica em Foco: ${metric}
        🎯 Meta: [Your goal suggestion]
        📈 Tendência: [A relevant market trend based on simulated real-time data]
        💡 Ação do Dia: [A concrete action for the user to take]
        ⏰ Melhor horário: [Suggest a peak time range]

        Repita. Analise. Otimize. Domine.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating dashboard insight:", error);
        return "Erro ao gerar insight. Verifique sua conexão e a chave da API.";
    }
};

export const analyzeInstagramProfile = async (username: string, niche: string): Promise<AnalysisResult> => {
     const prompt = `
        Act as M.A.R.K., an elite marketing AI. A user provided '@${username}' from the '${niche}' niche.
        Simulate a deep analysis by referencing scraped data from Google Trends, Reddit, and public datasets for this niche.
        Provide a detailed, actionable report, including a follower analysis based on engagement heuristics. Return ONLY a valid JSON object.

        The JSON object must follow this structure:
        {
          "summary": {
            "last12Posts": 12,
            "avgEngagement": "A realistic engagement rate like '3.8%' or '5.2%'",
            "peakHours": "A time range like '18h - 21h'",
            "topContent": "A content type like 'Reels de dicas rápidas' or 'Carrosséis educativos'"
          },
          "followerAnalysis": {
            "realFollowerEstimation": "A percentage range like '85%-90%'",
            "insights": "Provide insights based on engagement-to-follower ratio and comment quality heuristics."
          },
          "sevenDayPlan": [
            { "day": 1, "action": "Post a Reel with a strong hook about a common pain point.", "caption": "A compelling caption for the action.", "hashtags": "#tag1 #tag2 #tag3" },
            { "day": 2, "action": "Create an interactive Story with a poll or question box.", "caption": "A caption for the story.", "hashtags": "" },
            { "day": 3, "action": "Post a carousel explaining a complex topic simply.", "caption": "An educational caption.", "hashtags": "#tag1 #tag2 #tag3" },
            { "day": 4, "action": "Go live to answer audience questions.", "caption": "Announcement for the live session.", "hashtags": "#live #q&a" },
            { "day": 5, "action": "Share a client testimonial or case study.", "caption": "A caption building social proof.", "hashtags": "#success #testimonial" },
            { "day": 6, "action": "Post a personal story to connect with your audience.", "caption": "A vulnerable and authentic caption.", "hashtags": "#mystory #journey" },
            { "day": 7, "action": "Analyze the week's performance and plan for the next.", "caption": "A reflective caption about growth.", "hashtags": "#planning #growth" }
          ]
        }
        `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    const jsonStr = response.text.trim();
    const result = JSON.parse(jsonStr);

    return {
        ...result,
        engagementRate: result.summary.avgEngagement,
        bestPostingTime: result.summary.peakHours,
        topContentType: result.summary.topContent,
    };
};

export const generateViralCampaign = async (niche: string, objective: string): Promise<ViralCampaign> => {
    const prompt = `
    Act as M.A.R.K., an elite marketing AI. Generate a complete viral campaign package for the niche '${niche}' with the objective '${objective}'.
    Simulate that you have access to real-time trend data.
    Return ONLY a valid JSON object with the following structure:
    {
        "title": "A catchy title for the campaign",
        "script": {
            "hook": "A strong 3-second hook for a Reel.",
            "content": "The main content of the 15-30 second video script.",
            "cta": "A clear and powerful call to action."
        },
        "caption": "A compelling caption for the post.",
        "hashtags": "A mix of niche and trending hashtags.",
        "trendingMusic": "A suggestion for a currently trending audio/music on Reels.",
        "thumbnailIdea": "A detailed description of a high-converting thumbnail."
    }
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
    });
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
};

export const analyzeCompetitors = async (competitors: string[]): Promise<CompetitorAnalysis[]> => {
    const prompt = `
    Act as M.A.R.K., an elite marketing AI. Analyze the following competitors: ${competitors.join(', ')}.
    Simulate a deep analysis of their public profiles. For each competitor, identify their main strengths, weaknesses, and a concise strategy to outperform them.
    Return ONLY a valid JSON array with objects following this structure:
    [{
        "competitor": "competitor_handle",
        "strengths": "What they are doing well (e.g., content quality, community engagement).",
        "weaknesses": "Where they are failing (e.g., inconsistent posting, poor CTA).",
        "strategyToOutperform": "A 30-day actionable plan to gain an advantage."
    }]
    `;
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' },
    });
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr);
};


export const generateGenericContent = async (tool: string, promptText: string): Promise<string> => {
     const prompts: { [key: string]: string } = {
        script: `Como M.A.R.K., crie um roteiro para um Instagram Reel de 15 segundos sobre '${promptText}'. Inclua um gancho, conteúdo principal e uma chamada para ação clara. Forneça sugestões visuais.`,
        thumbnail: `Como M.A.R.K., gere 3 ideias de thumbnails atraentes e de alta conversão para um vídeo com o título '${promptText}'. Descreva cada uma em detalhes.`,
        persuasive: `Como M.A.R.K., escreva um texto de marketing persuasivo para '${promptText}'. Use gatilhos mentais como escassez, prova social e autoridade.`,
        ad: `Como M.A.R.K., crie um texto de anúncio para Facebook/Instagram para '${promptText}'. Inclua uma headline, corpo do anúncio e CTA. Sugira um público-alvo detalhado.`,
        hashtag: `Como M.A.R.K., gere um conjunto de 15 hashtags otimizadas para um post sobre '${promptText}'. Inclua hashtags de nicho, de alcance médio e amplas.`,
        bio: `Como M.A.R.K., crie uma bio de Instagram profissional e otimizada para '${promptText}'. A bio deve ser clara, concisa, mostrar autoridade e ter um CTA.`,
        nicheExplosion: `Como M.A.R.K., execute uma "Explosão de Nicho" para a palavra-chave '${promptText}'. Simule uma análise de 10.000 posts públicos e gere 5 ideias de conteúdo inéditas, cada uma com título, formato (Reel, Carrossel, etc.) e um breve resumo. Apresente como uma lista clara e acionável.`,
        contract: `Como M.A.R.K., gere um modelo de contrato simples para um influenciador/prestador de serviço baseado na seguinte descrição: '${promptText}'. Inclua seções para escopo, prazo, pagamento e confidencialidade. Adicione um aviso de que este é um modelo e deve ser revisado por um advogado.`,
        infiltrate: `Como M.A.R.K., execute o "Modo Infiltrar" para o nicho '${promptText}'. Simule uma busca por micro-influenciadores (1k-50k seguidores) com alto engajamento. Gere uma lista de 5 perfis potenciais com uma breve justificativa para a colaboração e uma mensagem de abordagem personalizada para cada um.`,
    };
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompts[tool],
    });

    return response.text;
};