import { Dictionary, ICurve, ILayer, IState, ITarget } from '../types';
import { attr, selectAll } from '../internal';

const layerSelector = 'layer';
const stateSelector = 'state';
const curveSelector = 'curve';
const targetSelector = 'target';
const nameAttr = 'name';
const stateAttr = 'state';
const state1Attr = 'state-1';
const state2Attr = 'state-2';

export function elementToLayers(el: Element): Dictionary<ILayer> {
  const $layers = el.querySelectorAll(layerSelector);
  const layers: Dictionary<ILayer> = {};
  for (let i = 0, len = $layers.length; i < len; i++) {
    const layer1 = elementToLayer($layers[i]);
    layers[layer1.name] = layer1;
  }
  return layers;
}

export function elementToLayer($layer: Element): ILayer {
  const layerName = attr($layer, nameAttr);
  if (!layerName) {
    throw '<layer> is missing "name"';
  }

  const layerState = attr($layer, stateAttr);
  if (!layerState) {
    throw '<layer> is missing "state"';
  }

  const states: Dictionary<IState> = {};
  const $states = selectAll($layer, stateSelector);
  for (let i = 0, len = $states.length; i < len; i++) {
    const state = elementToState($states[i]);
    states[state.name] = state;
  }

  const curves: ICurve[] = [];
  const $curves = selectAll($layer, curveSelector);
  for (let i = 0, len = $curves.length; i < len; i++) {
    curves.push(elementToCurve($states[i]));
  }

  return {
    name: layerName,
    state: layerState,
    states: states,
    curves: curves
  };
}

export function elementToState($state: Element): IState {
  const stateName = attr($state, nameAttr);
  if (!stateName) {
    throw '<state> is missing "name"';
  }

  const targets: ITarget[] = [];
  const $targets = selectAll($state, targetSelector);
  for (let i = 0, len = $targets.length; i < len; i++) {
    targets.push(elementToTarget($targets[i]));
  }

  return {
    name: stateName,
    targets: targets
  };
};

export function elementToTarget($target: Element): ITarget {
  const target = {} as ITarget;
  const attributes = $target.attributes;
  for (let i = 0, len = attributes.length; i < len; i++) {
    const att = attributes[i];
    target[att.name] = att.value;
  }

  if (!target.ref) {
    throw '<target> is missing "ref"';
  }

  return target;
}

export function elementToCurve($curve: Element): ICurve {
  const state1 = attr($curve, state1Attr);
  if (!state1) {
    throw '<curve> is missing "state-1"';
  }

  const state2 = attr($curve, state2Attr);
  if (!state2) {
    throw '<curve> is missing "state-2"';
  }

  const durationStr = attr($curve, 'duration');
  const duration = durationStr ? parseFloat(durationStr) : undefined;

  const easing = attr($curve, 'easing') || undefined;

  return {
    state1,
    state2,
    duration,
    easing
  };
}
