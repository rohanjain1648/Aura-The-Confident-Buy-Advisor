export const CONCERNS = ['redness', 'oiliness', 'spots', 'texture', 'darkCircles', 'pores', 'wrinkles', 'acne'] as const;
export type Concern = typeof CONCERNS[number];
export const UNDERTONES = ['warm', 'cool', 'neutral'] as const;
export type Undertone = typeof UNDERTONES[number];
export type Tier = 'buy' | 'maybe' | 'skip';
export type ConcernScores = Record<Concern, number>; // 0..100
