import { from0to, toRadians, gauss2d } from 'genocog/utils/applied-math';
import Ember from 'ember';

let setPixel = function(im, i, r, g, b, a) {
  im.data[i] = r;
  im.data[i + 1] = g;
  im.data[i + 2] = b;
  im.data[i + 3] = a;
};

export default class VisualStimulusGenerator {

  constructor(settings) {

    const defaults = {
      width: 200,
      height: 200,
      lambda: 30,
      sigma: 40,
      frequency: 200 / 30,
      circleMask: 0.07,
      finalContrast: 10
    };

    const THETA = from0to(360);
    const PHASE = from0to(1);
    const THETA_RAD = toRadians(THETA / 360);
    const PHASE_RAD = toRadians(PHASE);
    const COS_T = Math.cos(THETA_RAD);
    const SIN_T = Math.sin(THETA_RAD);

    this.options = {};

    Object.assign(
      this.options,
      defaults,
      settings,
      {
        THETA: THETA,
        PHASE: PHASE,
        THETA_RAD: THETA_RAD,
        PHASE_RAD: PHASE_RAD,
        COS_T: COS_T,
        SIN_T: SIN_T
      }
    );
  }

  /**
   * @param callback {Function}
   */
  everyPixel(callback) {
    const imageSize = Math.max(this.options.width, this.options.height);

    let idx = 0;
    for (let i = 0; i < imageSize; i++) {
      for (let j = 0; j < imageSize; j++) {
        callback.call(this, idx, i, j);
        idx += 1;
      }
    }
  }

  generateImage(stimulusVal, withGabor = false) {
    const canvas = this.getCanvas();
    const ctx = canvas.getContext('2d');
    const imageSize = Math.max(this.options.width, this.options.height);

    let frequency = this.options.frequency * 2 * Math.PI;
    let X = [];

    for (let x = 0; x < imageSize; x++) {
      X[x] = x;
    }

    let X0 = [];

    for (let x = 0; x < imageSize; x++) {
      X0[x] = (X[x] / imageSize) - 0.05;
    }

    let s = this.options.sigma / imageSize;
    let mask = [];
    let stimulus = [];
    let min = 0, max = 0;

    const COS_T = this.options.COS_T;
    const SIN_T = this.options.SIN_T;

    this.everyPixel((idx, i, j) => {
      let Xm = 0, Ym = 0, Xt = 0, Yt = 0, XYt = 0, XYf = 0;
      let grating;
      let gauss, gabor, noise;

      [Xm, Ym] = [X0[j], [X0[i]]];
      [Xt, Yt] = [Xm * COS_T, Ym * SIN_T];
      [XYt, XYf] = [Xt + Yt, XYt * frequency];

      grating = Math.sin(XYf + this.options.PHASE_RAD);
      gauss = gauss2d(Xm, Ym, s);
      gabor = grating * gauss;

      noise = (Math.random() - 0.5) / 0.5;

      stimulus[idx] = noise;

      if (withGabor) {
        stimulus[idx] += gabor * stimulusVal;
      }

      mask[idx] = gauss > this.options.circleMask;
      stimulus[idx] *= mask[idx];

      min = min > stimulus[idx] ? stimulus[idx] : min;
      max = max < stimulus[idx] ? stimulus[idx] : max;
    });

    this.everyPixel((idx) => {
      stimulus[idx] = (stimulus[idx] - min) / (max - min);
      stimulus[idx] = 2 * stimulus[idx] - 1;
      stimulus[idx] *= this.options.finalContrast;
    });

    let imageData = ctx.getImageData(0, 0, this.options.width, this.options.height);

    for (let i = 0, idx = 0; i < imageData.data.length; i += 4, idx += 1) {
      if (mask[idx]) {
        let px = stimulus[idx] * 255;
        setPixel(imageData, i, px, px, px, 255);
      } else {
        let px = 255;
        setPixel(imageData, i, px, px, px, 0);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * @return {Canvas}
   */
  getCanvas() {
    const canvas = Ember.$('<canvas/>');
    canvas.prop({
      width: this.options.width,
      height: this.options.height
    });
    return canvas[0];
  }

}
