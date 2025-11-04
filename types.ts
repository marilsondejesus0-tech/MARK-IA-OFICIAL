export interface Profile {
  id: string;
  name: string;
  niche: string;
  objective: string;
}

export interface AnalysisResult {
    engagementRate: string;
    bestPostingTime: string;
    topContentType: string;
    sevenDayPlan: {
        day: number;
        action: string;
        caption: string;
        hashtags: string;
    }[];
    summary: {
        last12Posts: number;
        avgEngagement: string;
        peakHours: string;
        topContent: string;
    },
    followerAnalysis: {
        realFollowerEstimation: string;
        insights: string;
    }
}

export interface ViralCampaign {
    title: string;
    script: {
        hook: string;
        content: string;
        cta: string;
    };
    caption: string;
    hashtags: string;
    trendingMusic: string;
    thumbnailIdea: string;
}

export interface CompetitorAnalysis {
    competitor: string;
    strengths: string;
    weaknesses: string;
    strategyToOutperform: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}