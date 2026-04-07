import { isAnyArray } from 'is-any-array';

interface Appender {
  propertyName: string;
  callback: (value: any) => any;
}

interface DeriveInfo {
  path: string[];
  noArrayPath: string[];
}

interface CallbackInfo extends DeriveInfo {
  value: any;
}

type DeriveCallback = (
  parent: any,
  propName: string,
  info: CallbackInfo,
) => void;

/**
 * Append derived properties to a data object based on property path matching.
 * @param data - Any data object that may contain nested objects, arrays, etc.
 * @param appenders - Record of jpath patterns mapped to appender configurations.
 */
export function appendDerivedProperties(
  data: any,
  appenders: Record<string, Appender>,
) {
  deriveProps(data, (parent, propName, info) => {
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

function deriveProps(data: any, callback: DeriveCallback): void {
  const info: DeriveInfo = {
    path: [],
    noArrayPath: [],
  };
  derivePropsSS(data, callback, info);
}

function derivePropsSS(
  data: any,
  callback: DeriveCallback,
  info: DeriveInfo,
): void {
  if (typeof data !== 'object' || isArrayOfPrimitives(data)) {
    return;
  }
  for (const propName in data) {
    if (data[propName] !== undefined) {
      const newInfo: DeriveInfo = {
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
        derivePropsSS(data[propName], callback, newInfo);
      } else {
        callback(data, propName, { value: data[propName], ...newInfo });
      }
    }
  }
}

function isArrayOfPrimitives(value: any) {
  return isAnyArray(value) && value.every((v) => typeof v !== 'object');
}
