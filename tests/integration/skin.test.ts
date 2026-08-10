import { describe, it, expect } from 'vitest';
import { analyzeSkinAndSave } from '@/server/orchestrators/skin';

describe('skin orchestrator', () => {
  it('normalizes raw skin analysis into passport and saves', async () => {
    process.env.YOUCAM_MODE = 'fixture';
    const sess = 'test-sess-1';
    const imageBytes = Buffer.from('fake-image');

    const result = await analyzeSkinAndSave(sess, imageBytes);
    expect(result.status).toBe('complete');
  });
});
