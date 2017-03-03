import { nil } from '../internal';

const unitExpression = /^([+-][=]){0,1}[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]*){0,1}[ ]*(to){0,1}[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]*)[ ]*([a-z%]+){0,1}[ ]*$/i;

const measureExpression = /^[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]*){1}[ ]*([a-z%]+){0,1}$/i;

// export const stepNone: string = '=';
export const stepForward: string = '+=';
export const stepBackward: string = '-=';

/**
 * Returns a unit resolver.  The unit resolver returns what the unit should be
 * at a given index.  for instance +=200 should be 200 at 0, 400 at 1, and 600 at 2
 */
export function createUnitResolver(val: string | number): UnitResolver {
  if (!val && val !== 0) {
    return () => ({ unit: nil, value: 0 });
  }
  if (typeof val === 'number') {
    return () => ({ unit: nil, value: val as number });
  }

  const match = unitExpression.exec(val as string) as RegExpExecArray;
  const stepTypeString = match[1];
  const startString = match[2];
  const toOperator = match[3];
  const endValueString = match[4];
  const unitTypeString = match[5];

  const startCo = startString ? parseFloat(startString) : nil;
  const endCo = endValueString ? parseFloat(endValueString) : nil;
  const sign = stepTypeString === stepBackward ? -1 : 1;
  const isIndexed = !!stepTypeString;
  const isRange = toOperator === 'to';

  const resolver = (index?: number) => {
    const index2 = isIndexed && (index || index === 0) ? index + 1 : 1;
    const value = isRange
      ? random(startCo! * (index2) * sign, (endCo! - startCo!) * index2 * sign) as number
      : startCo! * index2 * sign;

    return {
      unit: unitTypeString || nil,
      value: value
    };
  };

  return resolver;
}

/**
 * Parses a string or number and returns the unit and numeric value
 */
export function parseUnit(val: string | number | undefined, output?: Unit): Unit {
  output = output || {} as Unit;

  if (!val && val !== 0) {
    output.unit = nil;
    output.value = nil;
  } else if (typeof val === 'number') {
    output.unit = nil;
    output.value = val as number;
  } else {
    const match = measureExpression.exec(val as string) as RegExpExecArray;
    const startString = match[1];
    const unitTypeString = match[2];

    output.unit = unitTypeString || nil;
    output.value = startString ? parseFloat(startString) : nil;
  }

  return output;
}

/**
 * returns the unit as a number (resolves seconds to milliseconds)
 */
export function convertToSeconds(unit: Unit): number | undefined {
  return unit.unit === 's' ? unit.value! * 1000 : unit.value;
}


export function random(first: number, last: number, unit?: string, wholeNumbersOnly?: boolean): number | string {
  let val = first + (Math.random() * (last - first));
  if (wholeNumbersOnly === true) {
    val = Math.floor(val);
  }
  return !unit ? val : val + unit;
}

export type Unit = {
  value: number | undefined;
  unit: string | undefined;
};

export type UnitResolver = {
  (index: number): Unit;
};