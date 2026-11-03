import { describe, it, expect } from 'vitest';
import { skinCrops } from '@/lib/face-crop';

const insideImage = (c: { x: number; y: number; width: number; height: number }, w: number, h: number) =>
  c.x >= 0 && c.y >= 0 && c.x + c.width <= w + 1e-6 && c.y + c.height <= h + 1e-6;

describe('skinCrops', () => {
  it('makes the face span over 60% of the crop width, as YouCam requires', () => {
    const face = { x: 500, y: 200, width: 280, height: 280 };
    for (const crop of skinCrops(1280, 720, face)) {
      expect(face.width / crop.width).toBeGreaterThan(0.6);
    }
  });

  it('follows an off-centre face and keeps all of it in the crop', () => {
    const face = { x: 900, y: 150, width: 200, height: 200 };
    const [crop] = skinCrops(1280, 720, face);
    expect(crop.x).toBeLessThanOrEqual(face.x);
    expect(crop.x + crop.width).toBeGreaterThanOrEqual(face.x + face.width);
    expect(crop.y).toBeLessThanOrEqual(face.y);
    expect(crop.y + crop.height).toBeGreaterThanOrEqual(face.y + face.height);
  });

  it('stays inside the image when the face is at an edge', () => {
    for (const face of [
      { x: 0, y: 0, width: 200, height: 200 },
      { x: 1080, y: 520, width: 200, height: 200 },
    ]) {
      for (const crop of skinCrops(1280, 720, face)) expect(insideImage(crop, 1280, 720)).toBe(true);
    }
  });

  it('never exceeds the image when the face already fills it', () => {
    for (const crop of skinCrops(600, 800, { x: 20, y: 100, width: 560, height: 560 })) {
      expect(insideImage(crop, 600, 800)).toBe(true);
    }
  });

  it('falls back to centred crops that get tighter when no face is found', () => {
    const crops = skinCrops(1000, 1500, null);
    expect(crops.length).toBeGreaterThan(1);
    for (let i = 1; i < crops.length; i += 1) expect(crops[i].width).toBeLessThan(crops[i - 1].width);
    for (const crop of crops) expect(insideImage(crop, 1000, 1500)).toBe(true);
  });
});
