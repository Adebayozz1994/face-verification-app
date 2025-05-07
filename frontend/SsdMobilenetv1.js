import * as tf from '@tensorflow/tfjs';

export class SsdMobilenetv1 {
  constructor() {
    this.model = null;
  }

  async load() {
    this.model = await tf.loadGraphModel(
      'https://storage.googleapis.com/tfjs-models/savedmodel/ssd_mobilenet_v1/model.json'
    );
  }

  async predict(input) {
    if (!this.model) {
      throw new Error('SsdMobilenetv1 - load model before inference');
    }

    // Cast to int32 (required by the model)
    const casted = tf.cast(input, 'int32');

    // Wrap input as expected by model: { image_tensor: tensor }
    const result = await this.model.executeAsync({ image_tensor: casted });

    return result;
  }
}
