import { isAnyArray } from 'is-any-array';

interface Appender {
  propertyName: string;
  callback: (value: any) => any;
}

/**
 *
 * @param data - any data object that may contain object, arrays, etc
 * @param appenders
 */
export function appendDerivedProperties(
  data: any,
  appenders: Record<string, Appender>,
) {
  deriveProps(data, (parent: any, propName: string, info: any) => {
    const path = info.noArrayPath.join('.');
    const appender = appenders[path];
    if (appender) {
      if (isAnyArray(info.value)) {
        parent[appender.propertyName] = info.value.map((value: any) =>
          appender.callback(value),
        );
      } else {
        parent[appender.propertyName] = appender.callback(info.value);
      }
    }
  });
}

function deriveProps(data: any, callback: any, options = {}): void {
  const info = {
    path: [],
    noArrayPath: [],
  };
  derivePropsSS(data, callback, info, options);
}

function derivePropsSS(
  data: any,
  callback: any,
  info: any,
  options = {},
): void {
  if (typeof data !== 'object' || isArrayOfPrimitives(data)) {
    return;
  }
  for (const propName in data) {
    if (data[propName] !== undefined) {
      const newInfo: any = {
        path: [...info.path, propName],
        noArrayPath: info.noArrayPath,
      };
      if (!isAnyArray(data)) {
        newInfo.noArrayPath = [...info.noArrayPath, propName];
      }
      if (
        typeof data[propName] === 'object' &&
        !isArrayOfPrimitives(data[propName])
      ) {
        derivePropsSS(data[propName], callback, newInfo, options);
      } else {
        callback(data, propName, { value: data[propName], ...newInfo });
      }
    }
  }
}

function isArrayOfPrimitives(value: any) {
  return isAnyArray(value) && value.every((v) => typeof v !== 'object');
}
