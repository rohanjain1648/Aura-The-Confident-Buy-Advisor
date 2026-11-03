import type { FaceDetector } from '@mediapipe/tasks-vision';

// YouCam skin analysis rejects a photo unless the face spans over 60% of the image
// width (it recommends 60-80%), so a normal selfie has to be cropped to the face first.

export type Rect = { x: number; y: number; width: number; height: number };

// Portrait, because the rule is about width and YouCam also rejects a face with too
// little margin above or below it.
const CROP_ASPECT = 1.4;
// How much of the crop's width the detected face should fill, in the order to try.
const FACE_SHARES = [0.7, 0.85, 1];
// Used when no face is found, as a share of the image's short side, widest first.
const BLIND_RATIOS = [1, 0.7, 0.5, 0.35];
const DETECTOR_TIMEOUT_MS = 15_000;

let detector: Promise<FaceDetector> | undefined;

/** Loads the detector once. The runtime and model are served from public/mediapipe. */
export function loadFaceDetector(): Promise<FaceDetector> {
  detector ??= import('@mediapipe/tasks-vision').then(async ({ FaceDetector, FilesetResolver }) =>
    FaceDetector.createFromOptions(await FilesetResolver.forVisionTasks('/mediapipe/wasm'), {
      baseOptions: { modelAssetPath: '/mediapipe/blaze_face_short_range.tflite', delegate: 'CPU' },
      runningMode: 'IMAGE',
    }),
  );
  return detector;
}

type Image = HTMLCanvasElement | ImageBitmap;

function largestFace(faceDetector: FaceDetector, image: Image): Rect | null {
  const faces = faceDetector.detect(image).detections.flatMap((d) => d.boundingBox ?? []);
  if (faces.length === 0) return null;
  const { originX, originY, width, height } = faces.reduce((a, b) => (b.width > a.width ? b : a));
  return { x: originX, y: originY, width, height };
}

/** The largest face in the image, or null when there is none or the detector can't run. */
export async function findFace(image: Image): Promise<Rect | null> {
  try {
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('timed out')), DETECTOR_TIMEOUT_MS);
    });
    const faceDetector = await Promise.race([loadFaceDetector(), timeout]);
    const rough = largestFace(faceDetector, image);
    if (!rough) return null;

    // The model sees a small copy of the image, so a distant face gets a loose box.
    // Looking again at just that area gives an accurate one.
    const area = cropAt(
      rough.width * 2,
      rough.x + rough.width / 2, rough.y + rough.height / 2,
      image.width, image.height,
    );
    const closeUp = document.createElement('canvas');
    closeUp.width = area.width;
    closeUp.height = area.height;
    closeUp.getContext('2d')?.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, area.width, area.height);
    const exact = largestFace(faceDetector, closeUp);
    return exact ? { ...exact, x: area.x + exact.x, y: area.y + exact.y } : rough;
  } catch (err) {
    console.warn('Face detection is unavailable, so using centred crops.', err);
    return null;
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function cropAt(width: number, centreX: number, centreY: number, imageWidth: number, imageHeight: number): Rect {
  const cropWidth = Math.min(imageWidth, width);
  const cropHeight = Math.min(imageHeight, cropWidth * CROP_ASPECT);
  return {
    x: clamp(centreX - cropWidth / 2, 0, imageWidth - cropWidth),
    y: clamp(centreY - cropHeight / 2, 0, imageHeight - cropHeight),
    width: cropWidth,
    height: cropHeight,
  };
}

/** The crops to send, in order. Each later one is tighter, for when the last was too loose. */
export function skinCrops(imageWidth: number, imageHeight: number, face: Rect | null): Rect[] {
  if (face) {
    // The detector's box runs from the forehead to the chin, so sit it slightly high to leave room for hair.
    const centreX = face.x + face.width / 2;
    const centreY = face.y + face.height * 0.45;
    return FACE_SHARES.map((share) => cropAt(face.width / share, centreX, centreY, imageWidth, imageHeight));
  }
  // Faces usually sit above the middle of a portrait photo.
  const centreY = imageHeight * (imageHeight > imageWidth ? 0.4 : 0.5);
  const short = Math.min(imageWidth, imageHeight);
  return BLIND_RATIOS.map((ratio) => cropAt(short * ratio, imageWidth / 2, centreY, imageWidth, imageHeight));
}
